import http, { IncomingMessage, ServerResponse } from 'node:http';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
import {
  db,
  dbPath,
  initDatabase,
  withTransaction,
  getNextInvoiceNumber,
  hashPin,
  logAudit,
  listBackups,
  resetStoreForProduction,
  runDailyBackupIfNeeded,
} from './db.ts';

initDatabase();

const sseClients = new Set<ServerResponse>();

function broadcastEvent(type: string, data: unknown) {
  const payload = `data: ${JSON.stringify({ type, data, timestamp: new Date().toISOString() })}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

function getLocalLanIps(): string[] {
  const nets = os.networkInterfaces();
  const wifiIps: string[] = [];
  const otherIps: string[] = [];
  for (const name of Object.keys(nets)) {
    const lower = name.toLowerCase();
    // Skip VirtualBox (192.168.56.x), VMware, Hyper-V, WSL virtual adapters
    if (lower.includes('virtual') || lower.includes('vbox') || lower.includes('vmware') || lower.includes('vethernet') || lower.includes('wsl')) {
      continue;
    }
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('192.168.56.')) {
        if (lower.includes('wi-fi') || lower.includes('wifi') || lower.includes('wlan')) {
          wifiIps.push(net.address);
        } else {
          otherIps.push(net.address);
        }
      }
    }
  }
  const combined = [...wifiIps, ...otherIps];
  return combined.length > 0 ? combined : ['127.0.0.1'];
}

function getSettingsMap(): Record<string, string> {
  const rows = db.prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[];
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  return map;
}

function parseJsonFromAiText(raw: string): Record<string, any> | null {
  try {
    const cleaned = String(raw || '')
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();
    const parsed = JSON.parse(cleaned);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    const m = String(raw || '').match(/\{[\s\S]*\}/);
    if (m) {
      try {
        return JSON.parse(m[0]);
      } catch {}
    }
    return null;
  }
}

async function callAiProductEnrichment(
  providerRaw: string,
  apiKey: string,
  promptText: string
): Promise<{ data: Record<string, any> | null; provider: string; error?: string }> {
  const provider = (providerRaw || 'gemini').toLowerCase();
  const key = String(apiKey || '').trim();
  if (!key) return { data: null, provider: 'template', error: 'Aucune clé API IA configurée' };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 14000);
    let contentText = '';

    if (provider === 'deepseek' || provider === 'openai') {
      const endpoint =
        provider === 'deepseek'
          ? 'https://api.deepseek.com/chat/completions'
          : 'https://api.openai.com/v1/chat/completions';
      const model = provider === 'deepseek' ? 'deepseek-chat' : 'gpt-4o-mini';
      const resp = await fetch(endpoint, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content:
                'You are an electronics & home appliances catalog expert in Morocco. Return ONLY valid JSON with keys: brand, model_number, category, name_fr, name_ar, name_en, specs_text, description_fr, description_ar, description_en.',
            },
            { role: 'user', content: promptText },
          ],
        }),
      });
      clearTimeout(timer);
      if (!resp.ok) {
        const errBody = await resp.text().catch(() => '');
        return { data: null, provider, error: `${provider.toUpperCase()} HTTP ${resp.status}: ${errBody.slice(0, 140)}` };
      }
      const json = (await resp.json()) as any;
      contentText = json?.choices?.[0]?.message?.content || '';
    } else {
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${encodeURIComponent(key)}`,
        {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
          }),
        }
      );
      clearTimeout(timer);
      if (!resp.ok) {
        const errBody = await resp.text().catch(() => '');
        return { data: null, provider: 'gemini', error: `GEMINI HTTP ${resp.status}: ${errBody.slice(0, 140)}` };
      }
      const json = (await resp.json()) as any;
      contentText = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    const parsed = parseJsonFromAiText(contentText);
    if (!parsed) return { data: null, provider, error: 'Réponse JSON invalide de l\'IA' };
    return { data: parsed, provider };
  } catch (err: any) {
    return { data: null, provider, error: err?.message || 'Erreur réseau IA' };
  }
}

async function callAiInvoiceExtraction(
  providerRaw: string,
  apiKey: string,
  imageBase64: string,
  mimeType: string,
  rawText: string
): Promise<{ data: Record<string, any> | null; provider: string; error?: string }> {
  const provider = (providerRaw || 'gemini').toLowerCase();
  const key = String(apiKey || '').trim();
  if (!key) return { data: null, provider: 'none', error: 'Aucune clé API IA configurée dans Paramètres.' };

  const invoicePrompt = `You are an expert invoice OCR & structured extraction assistant for an electronics & home appliances store in Morocco (currency: MAD).
Extract all information from this supplier/provider invoice and return ONLY strict valid JSON with this exact schema:
{
  "provider_name": "string (supplier / company name)",
  "provider_phone": "string (phone if found, else empty)",
  "invoice_number": "string (BL or invoice number if found)",
  "invoice_date": "string (YYYY-MM-DD if found)",
  "total_amount": 0,
  "items": [
    {
      "product_name": "string (clean product designation)",
      "sku_or_ref": "string (model number / SKU / barcode if visible)",
      "brand": "string (brand name if visible)",
      "quantity": 1,
      "unit_cost": 0,
      "suggested_retail_price": 0
    }
  ]
}
Rules:
- unit_cost is the unit buying price (HT or TTC per unit). If only line total is shown, divide by quantity.
- If suggested_retail_price is not on the invoice, estimate a realistic Moroccan retail price (~20% markup over unit_cost) or set 0.
- Return ONLY JSON, no markdown fences.`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 28000);
    let contentText = '';
    const cleanB64 = String(imageBase64 || '').replace(/^data:[^;]+;base64,/, '').trim();

    if (provider === 'deepseek') {
      if (!rawText.trim()) {
        clearTimeout(timer);
        return {
          data: null,
          provider: 'deepseek',
          error: 'DeepSeek ne supporte pas la lecture directe de photos (Vision). Sélectionnez Gemini ou OpenAI dans Paramètres IA, ou collez le texte de la facture.',
        };
      }
      const resp = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: 'deepseek-chat',
          temperature: 0.1,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: invoicePrompt },
            { role: 'user', content: `Extract from this invoice text:\n\n${rawText}` },
          ],
        }),
      });
      clearTimeout(timer);
      if (!resp.ok) {
        const errBody = await resp.text().catch(() => '');
        return { data: null, provider: 'deepseek', error: `DEEPSEEK HTTP ${resp.status}: ${errBody.slice(0, 140)}` };
      }
      const json = (await resp.json()) as any;
      contentText = json?.choices?.[0]?.message?.content || '';
    } else if (provider === 'openai') {
      const userContent: any[] = [{ type: 'text', text: rawText ? `${invoicePrompt}\n\nText:\n${rawText}` : invoicePrompt }];
      if (cleanB64) {
        userContent.push({
          type: 'image_url',
          image_url: { url: `data:${mimeType || 'image/jpeg'};base64,${cleanB64}` },
        });
      }
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.1,
          response_format: { type: 'json_object' },
          messages: [{ role: 'user', content: userContent }],
        }),
      });
      clearTimeout(timer);
      if (!resp.ok) {
        const errBody = await resp.text().catch(() => '');
        return { data: null, provider: 'openai', error: `OPENAI HTTP ${resp.status}: ${errBody.slice(0, 140)}` };
      }
      const json = (await resp.json()) as any;
      contentText = json?.choices?.[0]?.message?.content || '';
    } else {
      const parts: any[] = [{ text: rawText ? `${invoicePrompt}\n\nTexte:\n${rawText}` : invoicePrompt }];
      if (cleanB64) {
        parts.push({ inline_data: { mime_type: mimeType || 'image/jpeg', data: cleanB64 } });
      }
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${encodeURIComponent(key)}`,
        {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
          }),
        }
      );
      clearTimeout(timer);
      if (!resp.ok) {
        const errBody = await resp.text().catch(() => '');
        return { data: null, provider: 'gemini', error: `GEMINI HTTP ${resp.status}: ${errBody.slice(0, 140)}` };
      }
      const json = (await resp.json()) as any;
      contentText = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    const parsed = parseJsonFromAiText(contentText);
    if (!parsed) return { data: null, provider, error: 'Réponse JSON invalide de l\'IA lors de l\'analyse de facture.' };
    return { data: parsed, provider };
  } catch (err: any) {
    return { data: null, provider, error: err?.message || 'Erreur réseau IA' };
  }
}

async function callAiVisionProductExtraction(
  providerRaw: string,
  apiKey: string,
  images: Array<{ imageBase64: string; mimeType?: string }>,
  hintName = ''
): Promise<{ data: Record<string, any> | null; provider: string; error?: string }> {
  const provider = (providerRaw || 'gemini').toLowerCase();
  const key = String(apiKey || '').trim();
  if (!key) return { data: null, provider: 'none', error: 'Aucune clé API IA configurée dans Paramètres.' };
  if (!Array.isArray(images) || images.length === 0) {
    return { data: null, provider, error: 'Aucune image fournie.' };
  }

  const visionPrompt = `You are a retail electronics & home appliances product catalog expert in Morocco.
Inspect ALL provided product/box photos carefully (front, back, side panels, model stickers, feature icons, Arabic/French labels) and extract all product details.
${hintName ? `Additional user hint: "${hintName}".` : ''}
Return ONLY strict valid JSON with these exact keys:
{
  "brand": "string (e.g. SONIC, LG, Samsung, Bosch, Siera...)",
  "model_number": "string (exact model code printed on the box/label, e.g. FE5022SC)",
  "barcode": "string (EAN barcode digits if visible on sticker, else empty)",
  "category": "string (one of: Gros Électroménager, Petit Électroménager, TV & Audio, Climatisation & Chauffage, Froid & Congélation, Lavage & Séchage, Cuisine & Fours, Sécurité & Vidéosurveillance, Informatique & Réseau)",
  "name_fr": "string (clear French commercial product title including brand, capacity/size, model)",
  "name_ar": "string (clear Arabic commercial product title)",
  "name_en": "string (clear English commercial product title)",
  "specs_text": "string (bullet-style technical features extracted from icons/text on the box, separated by ' • ')",
  "description_fr": "string (2-3 sentences clean French description summarizing features and included accessories)",
  "description_ar": "string (2-3 sentences clean Arabic description)",
  "description_en": "string (2-3 sentences clean English description)",
  "warranty_months": 12
}
Return ONLY valid JSON without markdown code fences.`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    let contentText = '';

    if (provider === 'deepseek') {
      clearTimeout(timer);
      return {
        data: null,
        provider: 'deepseek',
        error: 'DeepSeek ne supporte pas l\'analyse d\'images (Vision). Sélectionnez Gemini ou OpenAI dans Paramètres IA.',
      };
    } else if (provider === 'openai') {
      const userContent: any[] = [{ type: 'text', text: visionPrompt }];
      for (const img of images.slice(0, 4)) {
        const cleanB64 = String(img.imageBase64 || '').replace(/^data:[^;]+;base64,/, '').trim();
        if (cleanB64) {
          userContent.push({
            type: 'image_url',
            image_url: { url: `data:${img.mimeType || 'image/jpeg'};base64,${cleanB64}` },
          });
        }
      }
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0.15,
          response_format: { type: 'json_object' },
          messages: [{ role: 'user', content: userContent }],
        }),
      });
      clearTimeout(timer);
      if (!resp.ok) {
        const errBody = await resp.text().catch(() => '');
        return { data: null, provider: 'openai', error: `OPENAI HTTP ${resp.status}: ${errBody.slice(0, 140)}` };
      }
      const json = (await resp.json()) as any;
      contentText = json?.choices?.[0]?.message?.content || '';
    } else {
      const parts: any[] = [{ text: visionPrompt }];
      for (const img of images.slice(0, 4)) {
        const cleanB64 = String(img.imageBase64 || '').replace(/^data:[^;]+;base64,/, '').trim();
        if (cleanB64) {
          parts.push({ inline_data: { mime_type: img.mimeType || 'image/jpeg', data: cleanB64 } });
        }
      }
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${encodeURIComponent(key)}`,
        {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.15 },
          }),
        }
      );
      clearTimeout(timer);
      if (!resp.ok) {
        const errBody = await resp.text().catch(() => '');
        return { data: null, provider: 'gemini', error: `GEMINI HTTP ${resp.status}: ${errBody.slice(0, 140)}` };
      }
      const json = (await resp.json()) as any;
      contentText = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    const parsed = parseJsonFromAiText(contentText);
    if (!parsed) return { data: null, provider, error: 'Réponse JSON invalide de l\'IA.' };
    return { data: parsed, provider };
  } catch (err: any) {
    return { data: null, provider, error: err?.message || 'Erreur réseau IA Vision' };
  }
}

let geminiImageQuotaBlockedUntil = 0;

function normalizeProductImages(row: Record<string, any> | undefined | null): string[] {
  if (!row) return [];
  const out: string[] = [];
  try {
    const parsed = typeof row.images_json === 'string' ? JSON.parse(row.images_json || '[]') : row.images_json;
    if (Array.isArray(parsed)) {
      for (const item of parsed) {
        const s = String(item || '').trim();
        if (s && !out.includes(s)) out.push(s);
      }
    }
  } catch {}
  const legacyUrl = String(row.image_url || '').trim();
  if (legacyUrl && !out.includes(legacyUrl)) {
    out.unshift(legacyUrl);
  }
  return out;
}

function attachNormalizedImages<T extends Record<string, any>>(row: T): T & { images: string[]; image_url: string } {
  const imgs = normalizeProductImages(row);
  return {
    ...row,
    images: imgs,
    image_url: imgs[0] || '',
  };
}

function saveWooMediaMapping(localUrl: string, entry: { public_url?: string; wp_media_id?: number; source_url?: string; base_url?: string }) {
  try {
    const row = db.prepare("SELECT value FROM settings WHERE key = 'woo_media_map_json'").get() as { value: string } | undefined;
    const map = row?.value ? JSON.parse(row.value) : {};
    map[localUrl] = { ...(map[localUrl] || {}), ...entry, updated_at: new Date().toISOString() };
    db.prepare(`
      INSERT INTO settings (key, value) VALUES ('woo_media_map_json', ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run(JSON.stringify(map));
  } catch {}
}

async function searchWebProductImages(query: string): Promise<Array<{ url: string; thumb: string; title: string }>> {
  const cleanQ = String(query || '').trim();
  if (!cleanQ) return [];
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 9000);
    const searchUrl = `https://www.bing.com/images/async?q=${encodeURIComponent(cleanQ)}&first=0&count=18&adlt=Strict`;
    const resp = await fetch(searchUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      },
    });
    clearTimeout(timer);
    if (!resp.ok) return [];
    const html = await resp.text();
    const results: Array<{ url: string; thumb: string; title: string }> = [];
    const seen = new Set<string>();
    const regex = /murl&quot;:&quot;(https?:\/\/.+?)&quot;,&quot;turl&quot;:&quot;(https?:\/\/.+?)&quot;/g;
    for (const m of html.matchAll(regex)) {
      const imgUrl = m[1].replace(/&amp;/g, '&');
      const thumbUrl = m[2].replace(/&amp;/g, '&');
      if (!imgUrl || seen.has(imgUrl)) continue;
      seen.add(imgUrl);
      const afterSlice = html.slice(m.index || 0, (m.index || 0) + 600);
      const titleMatch = afterSlice.match(/&quot;t&quot;:&quot;(.+?)&quot;/);
      const title = titleMatch ? titleMatch[1].replace(/&amp;/g, '&') : cleanQ;
      results.push({ url: imgUrl, thumb: thumbUrl, title });
      if (results.length >= 12) break;
    }
    return results;
  } catch (err) {
    console.error('Web image search error:', err);
    return [];
  }
}

async function downloadWebProductImage(
  url: string,
  thumb: string,
  uploadDir: string
): Promise<{ image_url?: string; public_url?: string; error?: string }> {
  const primary = String(url || '').trim();
  const fallback = String(thumb || '').trim();
  if (!primary && !fallback) return { error: 'URL image manquante' };
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const candidates = [primary, fallback].filter((u) => /^https?:\/\//i.test(u));
  for (const candidate of candidates) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8500);
      const resp = await fetch(candidate, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
          Accept: 'image/webp,image/png,image/jpeg,*/*;q=0.8',
        },
      });
      clearTimeout(timer);
      if (!resp.ok) continue;
      const cType = String(resp.headers.get('content-type') || 'image/jpeg').toLowerCase();
      if (!cType.includes('image') && !cType.includes('octet-stream')) continue;
      const arr = await resp.arrayBuffer();
      const buf = Buffer.from(arr);
      if (buf.length < 1500) continue;
      const ext = cType.includes('png') ? '.png' : cType.includes('webp') ? '.webp' : '.jpg';
      const fileName = `web-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}${ext}`;
      fs.writeFileSync(path.join(uploadDir, fileName), buf);
      const localUrl = `/uploads/products/${fileName}`;
      const publicUrl = primary && /^https?:\/\//i.test(primary) ? primary : candidate;
      saveWooMediaMapping(localUrl, { public_url: publicUrl });
      return { image_url: localUrl, public_url: publicUrl };
    } catch {}
  }
  return { error: 'Impossible de télécharger cette image distante (serveur protégé ou hors ligne).' };
}

async function callGenerateProProductPhoto(
  providerRaw: string,
  apiKey: string,
  images: Array<{ imageBase64: string; mimeType?: string }>,
  uploadDir: string,
  productName = '',
  brand = '',
  modeRaw = 'clean_crop'
): Promise<{ imageUrl?: string; method?: string; best_index?: number; box_2d?: number[]; error?: string }> {
  const provider = (providerRaw || 'gemini').toLowerCase();
  const key = String(apiKey || '').trim();
  const mode = String(modeRaw || 'clean_crop').toLowerCase();
  if (!Array.isArray(images) || images.length === 0) {
    return { error: 'Veuillez fournir au moins une photo du produit ou de sa boîte.' };
  }

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Generative AI 3D Studio Render Mode
  if (mode === 'ai_render') {
    const studioPrompt = `Generate a crisp, clean, ultra-realistic 3D commercial e-commerce product photograph of ONLY the appliance (${brand} ${productName}) shown in the reference photo. Front-facing 3/4 studio angle on a pure white (#FFFFFF) seamless infinity backdrop, soft natural studio contact shadow, sharp metal/glass reflections, NO cardboard box, NO text labels, NO background clutter.`;
    if (key && provider === 'openai') {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 28000);
        const resp = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
          body: JSON.stringify({ model: 'gpt-image-1', prompt: studioPrompt, size: '1024x1024', n: 1 }),
        });
        clearTimeout(timer);
        if (resp.ok) {
          const j = (await resp.json()) as any;
          const b64 = j?.data?.[0]?.b64_json;
          if (b64) {
            const outFile = `pro-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}.png`;
            fs.writeFileSync(path.join(uploadDir, outFile), Buffer.from(b64, 'base64'));
            return { imageUrl: `/uploads/products/${outFile}`, method: 'ai_studio_gen' };
          }
        }
      } catch {}
    }
    if (key && provider === 'gemini' && Date.now() > geminiImageQuotaBlockedUntil) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 16000);
        const parts: any[] = [{ text: studioPrompt }];
        const firstImg = images[0];
        const cleanB64 = String(firstImg?.imageBase64 || '').replace(/^data:[^;]+;base64,/, '').trim();
        if (cleanB64) parts.push({ inline_data: { mime_type: firstImg.mimeType || 'image/jpeg', data: cleanB64 } });
        const resp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${encodeURIComponent(key)}`,
          {
            method: 'POST',
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts }],
              generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
            }),
          }
        );
        clearTimeout(timer);
        if (resp.status === 429 || resp.status === 404) {
          geminiImageQuotaBlockedUntil = Date.now() + 10 * 60 * 1000;
        } else if (resp.ok) {
          const json = (await resp.json()) as any;
          const outParts = json?.candidates?.[0]?.content?.parts || [];
          const imgPart = outParts.find((p: any) => p.inlineData?.data || p.inline_data?.data);
          const outData = imgPart?.inlineData || imgPart?.inline_data;
          if (outData?.data) {
            const outMime = String(outData.mimeType || 'image/png').toLowerCase();
            const ext = outMime.includes('png') ? '.png' : '.jpg';
            const outFile = `pro-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}${ext}`;
            fs.writeFileSync(path.join(uploadDir, outFile), Buffer.from(outData.data, 'base64'));
            return { imageUrl: `/uploads/products/${outFile}`, method: 'ai_studio_gen' };
          }
        }
      } catch {}
    }

    // Free-tier Vision prompt -> Pollinations studio synthesis fallback
    try {
      let renderPrompt = `commercial e-commerce studio product photograph of ${brand} ${productName}, home electronics appliance isolated on pure solid white studio background, soft contact shadow, sharp details, clean lighting`;
      if (key && provider === 'gemini') {
        try {
          const c = new AbortController();
          const t = setTimeout(() => c.abort(), 14000);
          const parts: any[] = [
            {
              text: `Inspect these photos (${brand} ${productName}) and write ONE concise English prompt (max 35 words) describing the physical appliance's exact color, finish, controls, glass door/display, and style for a pure white background studio product render. Return ONLY strict JSON: {"prompt": "..."}`,
            },
          ];
          const first = images[0];
          const cleanB64 = String(first?.imageBase64 || '').replace(/^data:[^;]+;base64,/, '').trim();
          if (cleanB64) parts.push({ inline_data: { mime_type: first.mimeType || 'image/jpeg', data: cleanB64 } });
          const r = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${encodeURIComponent(key)}`,
            {
              method: 'POST',
              signal: c.signal,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents: [{ parts }], generationConfig: { responseMimeType: 'application/json', temperature: 0.2 } }),
            }
          );
          clearTimeout(t);
          if (r.ok) {
            const j = (await r.json()) as any;
            const parsed = parseJsonFromAiText(j?.candidates?.[0]?.content?.parts?.[0]?.text || '');
            if (parsed?.prompt) {
              renderPrompt = `${parsed.prompt}, isolated on pure solid white studio background, e-commerce catalog photography, soft ground shadow`;
            }
          }
        } catch {}
      }

      const polController = new AbortController();
      const polTimer = setTimeout(() => polController.abort(), 18000);
      const polUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(renderPrompt)}?width=1000&height=1000&nologo=true&seed=${Date.now() % 99999}`;
      const polResp = await fetch(polUrl, { signal: polController.signal, headers: { 'User-Agent': 'ELECTROZEN-POS/1.0' } });
      clearTimeout(polTimer);
      if (polResp.ok) {
        const cType = String(polResp.headers.get('content-type') || '').toLowerCase();
        if (cType.includes('image')) {
          const buf = Buffer.from(await polResp.arrayBuffer());
          if (buf.length > 4000) {
            const outFile = `pro-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}.jpg`;
            fs.writeFileSync(path.join(uploadDir, outFile), buf);
            return { imageUrl: `/uploads/products/${outFile}`, method: 'ai_studio_gen' };
          }
        }
      }
    } catch {}
  }

  // Vision Bounding-Box Localization + Multi-Mode Studio Processor (clean_crop | white_cutout | original_framed)
  let bestIdx = 0;
  let box: [number, number, number, number] = [0, 0, 1000, 1000];
  const psMode = mode === 'white_cutout' ? 'white_cutout' : mode === 'original_framed' ? 'original_framed' : 'clean_crop';

  if (psMode !== 'original_framed' && key && (provider === 'gemini' || provider === 'openai')) {
    try {
      const bboxPrompt =
        'Inspect these photos of a product or its retail box. Choose the image index (0-based) that shows the physical appliance illustration/body most clearly from the front or 3/4 view. Return ONLY strict JSON with a tight normalized [ymin, xmin, ymax, xmax] bounding box (0-1000) tightly framing ONLY the physical appliance itself (exclude outer cardboard box borders, handles, text, logos, tables, and icons outside the appliance): {"best_index": 0, "box_2d": [ymin, xmin, ymax, xmax]}';

      let bboxText = '';
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 28000);

      if (provider === 'openai') {
        const content: any[] = [{ type: 'text', text: bboxPrompt }];
        for (const img of images.slice(0, 4)) {
          const cleanB64 = String(img.imageBase64 || '').replace(/^data:[^;]+;base64,/, '').trim();
          if (cleanB64) content.push({ type: 'image_url', image_url: { url: `data:${img.mimeType || 'image/jpeg'};base64,${cleanB64}` } });
        }
        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          signal: controller.signal,
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
          body: JSON.stringify({ model: 'gpt-4o-mini', temperature: 0.1, response_format: { type: 'json_object' }, messages: [{ role: 'user', content }] }),
        });
        clearTimeout(timer);
        if (resp.ok) {
          const json = (await resp.json()) as any;
          bboxText = json?.choices?.[0]?.message?.content || '';
        }
      } else {
        const parts: any[] = [{ text: bboxPrompt }];
        for (const img of images.slice(0, 4)) {
          const cleanB64 = String(img.imageBase64 || '').replace(/^data:[^;]+;base64,/, '').trim();
          if (cleanB64) parts.push({ inline_data: { mime_type: img.mimeType || 'image/jpeg', data: cleanB64 } });
        }
        const resp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${encodeURIComponent(key)}`,
          {
            method: 'POST',
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts }], generationConfig: { responseMimeType: 'application/json', temperature: 0.1 } }),
          }
        );
        clearTimeout(timer);
        if (resp.ok) {
          const json = (await resp.json()) as any;
          bboxText = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      }

      const parsed = parseJsonFromAiText(bboxText);
      if (parsed && Array.isArray(parsed.box_2d) && parsed.box_2d.length === 4) {
        bestIdx = Math.max(0, Math.min(images.length - 1, Number(parsed.best_index) || 0));
        box = [
          Math.max(0, Math.min(990, Number(parsed.box_2d[0]) || 0)),
          Math.max(0, Math.min(990, Number(parsed.box_2d[1]) || 0)),
          Math.max(10, Math.min(1000, Number(parsed.box_2d[2]) || 1000)),
          Math.max(10, Math.min(1000, Number(parsed.box_2d[3]) || 1000)),
        ];
      }
    } catch (err) {
      console.error('Vision bbox error:', err);
    }
  }

  const chosen = images[bestIdx] || images[0];
  const cleanB64 = String(chosen.imageBase64 || '').replace(/^data:[^;]+;base64,/, '').trim();
  if (!cleanB64) return { error: 'Image vide.' };

  const tmpIn = path.join(os.tmpdir(), `ez-in-${Date.now()}.jpg`);
  const outFile = `pro-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}.jpg`;
  const outPath = path.join(uploadDir, outFile);
  fs.writeFileSync(tmpIn, Buffer.from(cleanB64, 'base64'));

  try {
    const psScript = path.resolve(import.meta.dirname, 'studio_photo.ps1');
    if (process.platform === 'win32' && fs.existsSync(psScript)) {
      await execFileAsync(
        'powershell',
        [
          '-NoProfile',
          '-ExecutionPolicy',
          'Bypass',
          '-File',
          psScript,
          '-InputPath',
          tmpIn,
          '-OutputPath',
          outPath,
          '-YMin',
          String(Math.round(box[0])),
          '-XMin',
          String(Math.round(box[1])),
          '-YMax',
          String(Math.round(box[2])),
          '-XMax',
          String(Math.round(box[3])),
          '-Mode',
          psMode,
        ],
        { timeout: 15000 }
      );
      if (fs.existsSync(outPath)) {
        return { imageUrl: `/uploads/products/${outFile}`, method: `studio_${psMode}`, best_index: bestIdx, box_2d: box };
      }
    }
    // Non-Windows fallback: save uploaded image
    fs.copyFileSync(tmpIn, outPath);
    return { imageUrl: `/uploads/products/${outFile}`, method: 'direct_upload' };
  } catch (err: any) {
    return { error: err?.message || 'Erreur traitement photo studio' };
  } finally {
    try {
      fs.unlinkSync(tmpIn);
    } catch {}
  }
}

async function fetchJsonWithTimeout(url: string, ms = 4500): Promise<any | null> {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), ms);
    const r = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'ELECTROZEN-POS/1.0' },
    });
    clearTimeout(t);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

async function lookupBarcodeOnInternet(barcode: string) {
  const clean = String(barcode || '').trim();
  const existing = db
    .prepare('SELECT * FROM products WHERE barcode = ? OR sku = ? OR model_number = ?')
    .get(clean, clean, clean) as Record<string, any> | undefined;
  if (existing) {
    const normExisting = attachNormalizedImages(existing);
    return {
      found: true,
      existsLocally: true,
      source: 'local',
      product: normExisting,
      brand: normExisting.brand,
      model_number: normExisting.model_number,
      category: normExisting.category,
      name_fr: normExisting.name_fr,
      name_ar: normExisting.name_ar,
      name_en: normExisting.name_en,
      description_fr: normExisting.description_fr,
      image_url: normExisting.image_url,
      images: normExisting.images,
    };
  }

  let rawHit: {
    source: string;
    title: string;
    brand: string;
    model: string;
    category: string;
    description: string;
    image_url: string;
  } | null = null;

  const upc = await fetchJsonWithTimeout(`https://api.upcitemdb.com/prod/trial/lookup?upc=${encodeURIComponent(clean)}`);
  if (upc && Array.isArray(upc.items) && upc.items.length > 0) {
    const it = upc.items[0];
    rawHit = {
      source: 'UPCitemdb',
      title: String(it.title || '').trim(),
      brand: String(it.brand || '').trim(),
      model: String(it.model || '').trim(),
      category: String(it.category || '').trim(),
      description: String(it.description || '').trim(),
      image_url: Array.isArray(it.images) && it.images[0] ? String(it.images[0]) : '',
    };
  }

  if (!rawHit) {
    for (const host of ['world.openproductsfacts.org', 'world.openfoodfacts.org']) {
      const opf = await fetchJsonWithTimeout(`https://${host}/api/v2/product/${encodeURIComponent(clean)}.json`);
      if (opf && opf.status === 1 && opf.product) {
        const pr = opf.product;
        const title = String(pr.product_name_fr || pr.product_name || pr.generic_name || '').trim();
        if (title) {
          rawHit = {
            source: host.includes('openproductsfacts') ? 'OpenProductsFacts' : 'OpenFoodFacts',
            title,
            brand: String(pr.brands || '').split(',')[0].trim(),
            model: String(pr.code || clean),
            category: String(pr.categories || 'Électronique').split(',')[0].trim(),
            description: String(pr.generic_name_fr || pr.generic_name || title),
            image_url: String(pr.image_front_url || pr.image_url || ''),
          };
          break;
        }
      }
    }
  }

  if (!rawHit) {
    try {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 5000);
      const r = await fetch(`https://go-upc.com/search?q=${encodeURIComponent(clean)}`, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0 Safari/537.36' },
      });
      clearTimeout(t);
      if (r.ok) {
        const html = await r.text();
        const name = html.match(/<h1[^>]*class="product-name"[^>]*>(.*?)<\/h1>/s)?.[1]?.replace(/<[^>]+>/g, '').trim() || '';
        if (name) {
          const brand = html.match(/<td[^>]*>\s*Brand\s*<\/td>\s*<td[^>]*>(.*?)<\/td>/s)?.[1]?.replace(/<[^>]+>/g, '').trim() || '';
          const cat = html.match(/<td[^>]*>\s*Category\s*<\/td>\s*<td[^>]*>(.*?)<\/td>/s)?.[1]?.replace(/<[^>]+>/g, '').trim() || '';
          rawHit = {
            source: 'Go-UPC',
            title: name,
            brand,
            model: clean,
            category: cat || 'Électronique',
            description: name,
            image_url: '',
          };
        }
      }
    } catch {}
  }

  if (!rawHit || !rawHit.title) {
    return {
      found: false,
      existsLocally: false,
      barcode: clean,
      message: 'Code-barres non trouvé sur Internet — veuillez saisir les informations manuellement ou utiliser l\'IA.',
    };
  }

  let nameFr = rawHit.title;
  let nameAr = rawHit.title;
  let nameEn = rawHit.title;
  let descFr = rawHit.description || rawHit.title;
  let mappedCategory = rawHit.category || 'Petit Électroménager';

  const settings = getSettingsMap();
  if (settings.ai_api_key) {
    const aiRes = await callAiProductEnrichment(
      settings.ai_provider || 'gemini',
      settings.ai_api_key,
      `Normalize and translate this product found online for barcode "${clean}" into a clean French, Arabic, and English store catalog JSON (keys: brand, model_number, category, name_fr, name_ar, name_en, specs_text, description_fr, description_ar, description_en). Raw title: "${rawHit.title}", brand: "${rawHit.brand}", model: "${rawHit.model}", category: "${rawHit.category}", description: "${rawHit.description}". Keep descriptions concise.`
    );
    if (aiRes.data) {
      nameFr = String(aiRes.data.name_fr || nameFr);
      nameAr = String(aiRes.data.name_ar || nameAr);
      nameEn = String(aiRes.data.name_en || nameEn);
      descFr = String(aiRes.data.description_fr || aiRes.data.specs_text || descFr);
      mappedCategory = String(aiRes.data.category || mappedCategory);
    }
  }

  return {
    found: true,
    existsLocally: false,
    barcode: clean,
    source: rawHit.source,
    brand: rawHit.brand || 'Générique',
    model_number: rawHit.model || clean,
    category: mappedCategory,
    name_fr: nameFr,
    name_ar: nameAr,
    name_en: nameEn,
    description_fr: descFr,
    specs_text: descFr,
    image_url: rawHit.image_url || '',
  };
}

function queueWooSync(productId: number, action: 'upsert_product' | 'update_stock', payload: unknown) {
  db.prepare(`
    INSERT INTO woo_sync_queue (product_id, action, payload_json, status)
    VALUES (?, ?, ?, 'pending')
  `).run(productId, action, JSON.stringify(payload));

  db.prepare(`UPDATE products SET woo_sync_status = 'pending', updated_at = datetime('now') WHERE id = ?`).run(productId);
}

async function readJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function executeAtomicSale(body: Record<string, any>, sourceDeviceDefault = 'windows_pos') {
  const customer_id = body.customer_id;
  const customer_name = body.customer_name;
  const price_tier = body.price_tier || body.sale_type || 'retail';
  const items = body.items;
  const discount = body.discount ?? body.discount_amount ?? 0;
  const paid_amount = body.paid_amount;
  const payment_method = body.payment_method || 'cash';
  const installments_count = body.installments_count ?? 0;
  const source_device = body.source_device || body.sold_by_device || sourceDeviceDefault;
  const notes = body.notes || '';

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Cart is empty');
  }

  return withTransaction(() => {
    let subtotal = 0;
    let totalCost = 0;
    const resolvedItems: Array<{ prod: Record<string, any>; qty: number; unitPrice: number; serial: string; customName?: string }> = [];

    for (const item of items) {
      const qty = Number(item.quantity) || 1;
      if (qty <= 0) throw new Error('Quantité invalide');
      const prod = db.prepare('SELECT * FROM products WHERE id = ?').get(Number(item.product_id)) as Record<string, any> | undefined;
      if (!prod) throw new Error(`Produit #${item.product_id} introuvable`);
      if (Number(prod.stock_quantity) < qty) {
        throw new Error(`Stock insuffisant pour ${prod.name_fr} (dispo: ${prod.stock_quantity})`);
      }
      const unitPrice = Number(item.unit_price);
      subtotal += unitPrice * qty;
      totalCost += Number(prod.current_cost_price) * qty;
      resolvedItems.push({
        prod,
        qty,
        unitPrice,
        serial: String(item.serial_number || '').trim(),
        customName: item.product_name,
      });
    }

    const discountVal = Math.max(0, Number(discount) || 0);
    const totalAmount = Math.max(0, subtotal - discountVal);
    const paidVal = paid_amount !== undefined ? Math.max(0, Number(paid_amount)) : totalAmount;
    const remainingDebt = Math.max(0, totalAmount - paidVal);
    const invoiceNumber = getNextInvoiceNumber('FAC');

    let resolvedCustomerName = customer_name || 'Client Comptoir';
    if (customer_id && !customer_name) {
      const cust = db.prepare('SELECT name FROM customers WHERE id = ?').get(Number(customer_id)) as { name: string } | undefined;
      if (cust?.name) resolvedCustomerName = cust.name;
    }

    const saleRes = db.prepare(`
      INSERT INTO sales (
        invoice_number, customer_id, customer_name, price_tier,
        subtotal, discount, total_amount, paid_amount, remaining_debt,
        total_cost, payment_method, source_device, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      invoiceNumber,
      customer_id ? Number(customer_id) : null,
      resolvedCustomerName,
      price_tier,
      subtotal,
      discountVal,
      totalAmount,
      paidVal,
      remainingDebt,
      totalCost,
      payment_method,
      source_device,
      notes
    );

    const saleId = Number(saleRes.lastInsertRowid);

    for (const entry of resolvedItems) {
      const { prod, qty, unitPrice, serial, customName } = entry;
      const unitCost = Number(prod.current_cost_price);
      const warrantyMonths = Number(prod.warranty_months) || 12;
      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + warrantyMonths);
      const expiryStr = expiryDate.toISOString().split('T')[0];

      db.prepare(`
        INSERT INTO sale_items (
          sale_id, product_id, product_name, barcode, quantity,
          unit_price, unit_cost, serial_number, warranty_months, warranty_expires_at, subtotal
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        saleId,
        prod.id,
        customName || prod.name_fr,
        prod.barcode,
        qty,
        unitPrice,
        unitCost,
        serial,
        warrantyMonths,
        expiryStr,
        qty * unitPrice
      );

      db.prepare(`
        UPDATE products SET
          stock_quantity = stock_quantity - ?,
          woo_sync_status = 'pending',
          updated_at = datetime('now')
        WHERE id = ?
      `).run(qty, prod.id);

      if (serial) {
        db.prepare(`
          UPDATE serial_items SET
            status = 'sold',
            sale_id = ?,
            customer_id = ?,
            sold_at = datetime('now'),
            warranty_expires_at = ?
          WHERE serial_number = ?
        `).run(saleId, customer_id ? Number(customer_id) : null, expiryStr, serial);
      }

      queueWooSync(Number(prod.id), 'update_stock', { productId: prod.id, sold: qty });
    }

    if (customer_id) {
      db.prepare(`
        UPDATE customers SET
          total_spent = total_spent + ?,
          total_debt = total_debt + ?
        WHERE id = ?
      `).run(totalAmount, remainingDebt, Number(customer_id));

      if (remainingDebt > 0 && Number(installments_count) > 0) {
        const count = Number(installments_count);
        const perMonth = Math.round((remainingDebt / count) * 100) / 100;
        const insertInst = db.prepare(`
          INSERT INTO installments (sale_id, customer_id, installment_number, due_date, amount, status)
          VALUES (?, ?, ?, ?, ?, 'pending')
        `);
        for (let i = 1; i <= count; i++) {
          const d = new Date();
          d.setMonth(d.getMonth() + i);
          const amt = i === count ? Math.round((remainingDebt - perMonth * (count - 1)) * 100) / 100 : perMonth;
          insertInst.run(saleId, Number(customer_id), i, d.toISOString().split('T')[0], amt);
        }
      }
    }

    return {
      ...(db.prepare('SELECT * FROM sales WHERE id = ?').get(saleId) as Record<string, any>),
      items: db.prepare('SELECT * FROM sale_items WHERE sale_id = ?').all(saleId),
    };
  });
}

function getDateRangeBounds(range: string, startParam?: string, endParam?: string): { start: string; end: string } {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  if (range === 'custom' && startParam && endParam) {
    return { start: startParam, end: endParam };
  }
  if (range === 'today') return { start: today, end: today };
  if (range === '7d') {
    const d = new Date(now);
    d.setDate(d.getDate() - 6);
    return { start: d.toISOString().slice(0, 10), end: today };
  }
  if (range === '30d') {
    const d = new Date(now);
    d.setDate(d.getDate() - 29);
    return { start: d.toISOString().slice(0, 10), end: today };
  }
  if (range === 'mtd') return { start: `${today.slice(0, 8)}01`, end: today };
  if (range === 'ytd') return { start: `${today.slice(0, 5)}01-01`, end: today };
  return { start: '2000-01-01', end: '2099-12-31' };
}

function sendJson(res: ServerResponse, status: number, data: unknown, req?: IncomingMessage) {
  const raw = JSON.stringify(data);
  const acceptGzip = req && String(req.headers['accept-encoding'] || '').includes('gzip');
  const headers: Record<string, string | number> = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': req?.headers?.origin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  if (acceptGzip && raw.length > 1536) {
    const compressed = zlib.gzipSync(raw);
    headers['Content-Encoding'] = 'gzip';
    headers['Content-Length'] = compressed.length;
    res.writeHead(status, headers);
    res.end(compressed);
    return;
  }
  res.writeHead(status, headers);
  res.end(raw);
}

const PORT = Number(process.env.PORT) || 4000;
const publicDir = path.resolve(import.meta.dirname, '..', 'public');

function isLocalRequest(req: IncomingMessage): boolean {
  const addr = req.socket.remoteAddress || '';
  return addr === '127.0.0.1' || addr === '::1' || addr === '::ffff:127.0.0.1';
}

function getBearerToken(req: IncomingMessage): string {
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7).trim();
  return '';
}

function isAuthorizedApiRequest(req: IncomingMessage): boolean {
  if (isLocalRequest(req)) return true;
  const token = getBearerToken(req);
  if (!token) return false;
  const device = db
    .prepare("SELECT id FROM paired_devices WHERE access_token = ? AND access_token != ''")
    .get(token) as { id: number } | undefined;
  if (device) {
    db.prepare("UPDATE paired_devices SET last_seen = datetime('now'), status = 'online' WHERE id = ?").run(device.id);
    return true;
  }
  return false;
}

function normalizeWooBaseUrl(raw: string): string {
  let u = String(raw || '').trim().replace(/\/+$/, '');
  if (!u) return '';
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  return u;
}

async function wooFetch(
  baseUrl: string,
  ck: string,
  cs: string,
  endpointPath: string,
  options: { method?: string; body?: unknown; timeoutMs?: number } = {}
): Promise<{ ok: boolean; status: number; data: any; errorMsg: string }> {
  const sep = endpointPath.includes('?') ? '&' : '?';
  const fullUrl = `${baseUrl}${endpointPath}${sep}consumer_key=${encodeURIComponent(ck)}&consumer_secret=${encodeURIComponent(cs)}`;
  const auth = Buffer.from(`${ck}:${cs}`).toString('base64');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs || 20000);
  try {
    const resp = await fetch(fullUrl, {
      method: options.method || 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
        'User-Agent': 'ELECTROZEN-POS/1.0',
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
    clearTimeout(timer);
    const rawText = await resp.text();
    let data: any = null;
    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch {}
    if (!resp.ok) {
      const msg = data?.message || data?.error || rawText.slice(0, 180) || `HTTP ${resp.status}`;
      return { ok: false, status: resp.status, data, errorMsg: `HTTP ${resp.status}: ${msg}` };
    }
    return { ok: true, status: resp.status, data, errorMsg: '' };
  } catch (err: any) {
    clearTimeout(timer);
    return { ok: false, status: 0, data: null, errorMsg: err?.message || 'Erreur réseau WooCommerce' };
  }
}

async function resolveWooImagesForProduct(
  prod: Record<string, any>,
  baseUrl: string,
  settings: Record<string, string>
): Promise<{ wooImages: Array<Record<string, any>>; localSkipped: number; uploadErrors: string[] }> {
  const imgs = normalizeProductImages(prod);
  if (imgs.length === 0) return { wooImages: [], localSkipped: 0, uploadErrors: [] };

  let mediaMap: Record<string, any> = {};
  try {
    mediaMap = settings.woo_media_map_json ? JSON.parse(settings.woo_media_map_json) : {};
  } catch {}

  const wpUser = String(settings.woo_wp_user || '').trim();
  const wpPass = String(settings.woo_wp_app_password || '').trim();
  const hasWpAuth = Boolean(wpUser && wpPass);
  const wooImages: Array<Record<string, any>> = [];
  let localSkipped = 0;
  const uploadErrors: string[] = [];

  for (let i = 0; i < imgs.length; i++) {
    const imgUrl = imgs[i];
    if (/^https?:\/\//i.test(imgUrl) && !/\/\/(localhost|127\.|192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(imgUrl)) {
      wooImages.push({ src: imgUrl, position: wooImages.length });
      continue;
    }

    if (imgUrl.startsWith('/uploads/')) {
      const cached = mediaMap[imgUrl];
      if (cached?.wp_media_id && cached?.base_url === baseUrl) {
        wooImages.push({ id: Number(cached.wp_media_id), position: wooImages.length });
        continue;
      }

      if (hasWpAuth) {
        const localFile = path.join(publicDir, imgUrl.replace(/^\/+/, ''));
        if (localFile.startsWith(publicDir) && fs.existsSync(localFile)) {
          try {
            const ext = path.extname(localFile).toLowerCase();
            const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
            const fileName = path.basename(localFile);
            const buf = fs.readFileSync(localFile);
            const wpAuth = Buffer.from(`${wpUser}:${wpPass}`).toString('base64');
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 25000);
            const mediaResp = await fetch(`${baseUrl}/wp-json/wp/v2/media`, {
              method: 'POST',
              signal: controller.signal,
              headers: {
                Authorization: `Basic ${wpAuth}`,
                'Content-Disposition': `attachment; filename="${fileName}"`,
                'Content-Type': mime,
                'User-Agent': 'ELECTROZEN-POS/1.0',
              },
              body: buf,
            });
            clearTimeout(timer);
            if (mediaResp.ok) {
              const mJson = (await mediaResp.json()) as any;
              if (mJson?.id) {
                saveWooMediaMapping(imgUrl, {
                  wp_media_id: Number(mJson.id),
                  source_url: String(mJson.source_url || ''),
                  base_url: baseUrl,
                });
                wooImages.push({ id: Number(mJson.id), position: wooImages.length });
                continue;
              }
            } else {
              const errT = await mediaResp.text().catch(() => '');
              uploadErrors.push(`Media WP ${mediaResp.status}: ${errT.slice(0, 90)}`);
            }
          } catch (err: any) {
            uploadErrors.push(`Upload WP Media: ${err?.message || 'timeout'}`);
          }
        }
      }

      if (cached?.public_url && /^https?:\/\//i.test(cached.public_url)) {
        wooImages.push({ src: cached.public_url, position: wooImages.length });
        continue;
      }

      localSkipped++;
    }
  }

  return { wooImages, localSkipped, uploadErrors };
}

async function ensureWooCategory(
  categoryName: string,
  baseUrl: string,
  ck: string,
  cs: string,
  catCache: Map<string, number>
): Promise<number | null> {
  const clean = String(categoryName || '').trim();
  if (!clean) return null;
  const key = clean.toLowerCase();
  if (catCache.has(key)) return catCache.get(key) || null;

  const listRes = await wooFetch(baseUrl, ck, cs, `/wp-json/wc/v3/products/categories?search=${encodeURIComponent(clean)}&per_page=20`);
  if (listRes.ok && Array.isArray(listRes.data)) {
    const exact = listRes.data.find((c: any) => String(c.name || '').trim().toLowerCase() === key);
    const match = exact || listRes.data[0];
    if (match?.id) {
      catCache.set(key, Number(match.id));
      return Number(match.id);
    }
  }
  const createRes = await wooFetch(baseUrl, ck, cs, `/wp-json/wc/v3/products/categories`, {
    method: 'POST',
    body: { name: clean },
  });
  if (createRes.ok && createRes.data?.id) {
    catCache.set(key, Number(createRes.data.id));
    return Number(createRes.data.id);
  }
  return null;
}

async function syncSingleProductToWoo(
  prod: Record<string, any>,
  settings: Record<string, string>,
  catCache: Map<string, number>
): Promise<{ ok: boolean; wooId?: number; localSkippedImages?: number; error?: string }> {
  const baseUrl = normalizeWooBaseUrl(settings.woo_url || '');
  const ck = String(settings.woo_consumer_key || '').trim();
  const cs = String(settings.woo_consumer_secret || '').trim();
  if (!baseUrl || !ck || !cs) {
    return { ok: false, error: 'URL ou clés API WooCommerce manquantes.' };
  }

  const sku = String(prod.sku || prod.barcode || `EZ-${prod.id}`).trim();
  const { wooImages, localSkipped, uploadErrors } = await resolveWooImagesForProduct(prod, baseUrl, settings);
  const catId = await ensureWooCategory(String(prod.category || ''), baseUrl, ck, cs, catCache);

  const regularPrice = Number(prod.regular_price) > Number(prod.retail_price) ? Number(prod.regular_price) : Number(prod.retail_price || 0);
  const salePrice =
    Number(prod.regular_price) > Number(prod.retail_price) && Number(prod.retail_price) > 0
      ? String(Number(prod.retail_price))
      : undefined;

  const shortDesc = `${prod.brand || 'ELECTROZEN'}${prod.model_number ? ' • Modèle: ' + prod.model_number : ''} • Garantie ${prod.warranty_months || 12} mois`;
  const fullDesc = [
    prod.description_fr ? `<p>${String(prod.description_fr).replace(/\n/g, '<br/>')}</p>` : '',
    prod.description_ar ? `<p dir="rtl">${String(prod.description_ar).replace(/\n/g, '<br/>')}</p>` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const payload: Record<string, any> = {
    name: String(prod.name_fr || prod.name_en || sku),
    type: 'simple',
    sku,
    regular_price: String(regularPrice),
    description: fullDesc || String(prod.description_fr || prod.name_fr || ''),
    short_description: shortDesc,
    manage_stock: true,
    stock_quantity: Math.max(0, Math.floor(Number(prod.stock_quantity) || 0)),
    stock_status: Number(prod.stock_quantity) > 0 ? 'instock' : 'outofstock',
  };
  if (salePrice) payload.sale_price = salePrice;
  if (catId) payload.categories = [{ id: catId }];
  if (wooImages.length > 0) payload.images = wooImages;

  let resWoo: { ok: boolean; status: number; data: any; errorMsg: string } | null = null;

  // Try existing verified woo_id first
  if (prod.woo_id && Number(prod.woo_id_verified) === 1) {
    resWoo = await wooFetch(baseUrl, ck, cs, `/wp-json/wc/v3/products/${prod.woo_id}`, {
      method: 'PUT',
      body: payload,
    });
  }

  // If no verified ID or 404, search by SKU
  if (!resWoo || (!resWoo.ok && resWoo.status === 404)) {
    const skuLookup = await wooFetch(baseUrl, ck, cs, `/wp-json/wc/v3/products?sku=${encodeURIComponent(sku)}`);
    if (skuLookup.ok && Array.isArray(skuLookup.data) && skuLookup.data.length > 0) {
      const existingWooId = Number(skuLookup.data[0].id);
      resWoo = await wooFetch(baseUrl, ck, cs, `/wp-json/wc/v3/products/${existingWooId}`, {
        method: 'PUT',
        body: payload,
      });
    } else if (skuLookup.ok) {
      resWoo = await wooFetch(baseUrl, ck, cs, `/wp-json/wc/v3/products`, {
        method: 'POST',
        body: payload,
      });
      if (!resWoo.ok && resWoo.data?.code === 'product_invalid_sku' && resWoo.data?.data?.resource_id) {
        resWoo = await wooFetch(baseUrl, ck, cs, `/wp-json/wc/v3/products/${resWoo.data.data.resource_id}`, {
          method: 'PUT',
          body: payload,
        });
      }
    } else {
      resWoo = skuLookup;
    }
  }

  if (resWoo.ok && resWoo.data?.id) {
    const realWooId = Number(resWoo.data.id);
    const noteWarn = uploadErrors.length > 0 ? uploadErrors.join(' | ') : '';
    db.prepare(`
      UPDATE products SET
        woo_id = ?,
        woo_id_verified = 1,
        woo_sync_status = 'synced',
        woo_last_synced = datetime('now'),
        woo_last_error = ?,
        permalink = COALESCE(NULLIF(?, ''), permalink)
      WHERE id = ?
    `).run(realWooId, noteWarn, String(resWoo.data.permalink || ''), prod.id);
    return { ok: true, wooId: realWooId, localSkippedImages: localSkipped };
  }

  const finalErr = resWoo.errorMsg || 'Échec synchronisation WooCommerce';
  db.prepare(`
    UPDATE products SET woo_sync_status = 'pending', woo_last_error = ? WHERE id = ?
  `).run(finalErr, prod.id);
  return { ok: false, error: finalErr, localSkippedImages: localSkipped };
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': req.headers.origin || '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method || 'GET';

  try {
    // Enforce authentication on all remote /api/* requests except pairing
    if (
      pathname.startsWith('/api/') &&
      pathname !== '/api/android/pair' &&
      pathname !== '/api/network-info'
    ) {
      if (!isAuthorizedApiRequest(req)) {
        sendJson(res, 401, { error: 'Unauthorized: device pairing token required' });
        return;
      }
      if ((method === 'DELETE' || pathname === '/api/backup/sqlite') && !isLocalRequest(req)) {
        sendJson(res, 403, { error: 'Forbidden: action allowed only from Windows master PC' });
        return;
      }
    }
    // ========================================================================
    // REAL-TIME EVENTS STREAM (SSE)
    // ========================================================================
    if (pathname === '/api/events' && method === 'GET') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      });
      res.write(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: new Date().toISOString() })}\n\n`);
      sseClients.add(res);
      req.on('close', () => sseClients.delete(res));
      return;
    }

    // ========================================================================
    // BACKUP, CSV EXPORT & ANDROID APK DOWNLOAD ENDPOINTS
    // ========================================================================
    if ((pathname === '/download/ELECTROZEN-Android.apk' || pathname === '/ELECTROZEN-Android.apk') && (method === 'GET' || method === 'HEAD')) {
      const apkFile = path.join(publicDir, 'ELECTROZEN-Android.apk');
      if (!fs.existsSync(apkFile)) {
        sendJson(res, 404, { error: 'APK file not found yet' });
        return;
      }
      const stat = fs.statSync(apkFile);
      const total = stat.size;
      const rangeHeader = req.headers.range;
      if (rangeHeader && method === 'GET') {
        const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
        if (match) {
          const start = Number(match[1]);
          const end = match[2] ? Math.min(Number(match[2]), total - 1) : total - 1;
          res.writeHead(206, {
            'Content-Type': 'application/vnd.android.package-archive',
            'Content-Disposition': 'attachment; filename="ELECTROZEN-Android-v1.0.1.apk"',
            'Content-Range': `bytes ${start}-${end}/${total}`,
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Content-Length': end - start + 1,
          });
          fs.createReadStream(apkFile, { start, end }).pipe(res);
          return;
        }
      }
      res.writeHead(200, {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Disposition': 'attachment; filename="ELECTROZEN-Android-v1.0.1.apk"',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Content-Length': total,
      });
      if (method === 'HEAD') {
        res.end();
        return;
      }
      fs.createReadStream(apkFile).pipe(res);
      return;
    }

    if (pathname === '/api/mobile/version' && method === 'GET') {
      const apkFile = path.join(publicDir, 'ELECTROZEN-Android.apk');
      const ips = getLocalLanIps();
      sendJson(res, 200, {
        version: '1.0.0',
        apkAvailable: fs.existsSync(apkFile),
        apkSize: fs.existsSync(apkFile) ? fs.statSync(apkFile).size : 0,
        downloadUrl: `http://${ips[0]}:${PORT}/download/ELECTROZEN-Android.apk`,
      });
      return;
    }

    if (pathname === '/api/backup/sqlite' && method === 'GET') {
      const fileName = `electrozen-${new Date().toISOString().slice(0, 10)}.sqlite`;
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      });
      fs.createReadStream(dbPath).pipe(res);
      return;
    }

    if (pathname === '/api/export/products.csv' && method === 'GET') {
      const prods = db.prepare('SELECT * FROM products ORDER BY id ASC').all() as Record<string, any>[];
      const header = 'ID;Code_Barres;SKU;Modele;Marque;Categorie;Designation_FR;Dernier_Cout_MAD;Cout_Actuel_MAD;Prix_Gros_MAD;Prix_Detail_MAD;Stock;Garantie_Mois\n';
      const rows = prods
        .map((p) =>
          [
            p.id,
            p.barcode,
            p.sku,
            p.model_number,
            p.brand,
            p.category,
            `"${String(p.name_fr || '').replace(/"/g, '""')}"`,
            p.last_cost_price,
            p.current_cost_price,
            p.wholesale_price,
            p.retail_price,
            p.stock_quantity,
            p.warranty_months,
          ].join(';')
        )
        .join('\n');
      res.writeHead(200, {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="catalogue-produits-mad.csv"',
      });
      res.end('\uFEFF' + header + rows);
      return;
    }

    // ========================================================================
    // 1. NETWORK & ANDROID WI-FI PAIRING ENDPOINTS
    // ========================================================================
    if (pathname === '/api/network-info' && method === 'GET') {
      const ips = getLocalLanIps();
      const settings = getSettingsMap();
      const localOrAuthed = isAuthorizedApiRequest(req);
      const devices = localOrAuthed
        ? db.prepare('SELECT id, device_id, device_name, ip_address, last_seen, status FROM paired_devices ORDER BY last_seen DESC').all()
        : [];
      sendJson(res, 200, {
        ips,
        primaryIp: ips[0],
        port: PORT,
        pairingToken: localOrAuthed ? (settings.pairing_token || 'ELECTROZEN-POS-2026') : undefined,
        storeName: settings.store_name || 'ELECTROZEN',
        qrPayload: localOrAuthed
          ? JSON.stringify({
              type: 'ELECTROZEN_PAIR',
              host: ips[0],
              port: PORT,
              token: settings.pairing_token || 'ELECTROZEN-POS-2026',
              store: settings.store_name || 'ELECTROZEN',
            })
          : undefined,
        pairedDevices: devices,
      });
      return;
    }

    if (pathname === '/api/android/pair' && method === 'POST') {
      const body = await readJsonBody(req);
      const settings = getSettingsMap();
      const expectedToken = settings.pairing_token || 'ELECTROZEN-POS-2026';
      if (!isLocalRequest(req) && body.token !== expectedToken) {
        sendJson(res, 401, { error: 'Invalid pairing token' });
        return;
      }
      const ip = req.socket.remoteAddress || '';
      const id = body.deviceId || `AND-${Date.now()}`;
      const name = body.deviceName || 'Terminal Scanner Android';
      const accessToken = crypto.randomBytes(24).toString('hex');

      db.prepare(`
        INSERT INTO paired_devices (device_id, device_name, ip_address, access_token, last_seen, status)
        VALUES (?, ?, ?, ?, datetime('now'), 'online')
        ON CONFLICT(device_id) DO UPDATE SET
          device_name = excluded.device_name,
          ip_address = excluded.ip_address,
          access_token = excluded.access_token,
          last_seen = datetime('now'),
          status = 'online'
      `).run(id, name, ip, accessToken);

      broadcastEvent('ANDROID_DEVICE_PAIRED', { deviceId: id, deviceName: name, ip });
      sendJson(res, 200, {
        success: true,
        deviceId: id,
        accessToken,
        storeName: settings.store_name,
        currency: settings.currency,
      });
      return;
    }

    if (pathname === '/api/android/remote-scan' && method === 'POST') {
      const body = await readJsonBody(req);
      broadcastEvent('REMOTE_BARCODE_SCANNED', { barcode: body.barcode, deviceName: body.deviceName || 'Android' });
      sendJson(res, 200, { success: true });
      return;
    }

    // ========================================================================
    // 2. DASHBOARD & ANALYTICS
    // ========================================================================
    if (pathname === '/api/dashboard' && method === 'GET') {
      const range = parsedUrl.searchParams.get('range') || 'all';
      const bounds = getDateRangeBounds(
        range,
        parsedUrl.searchParams.get('start') || '',
        parsedUrl.searchParams.get('end') || ''
      );
      const startDt = `${bounds.start} 00:00:00`;
      const endDt = `${bounds.end} 23:59:59`;

      const productStats = db.prepare(`
        SELECT
          COUNT(*) as totalProducts,
          COALESCE(SUM(stock_quantity), 0) as totalUnits,
          COALESCE(SUM(stock_quantity * current_cost_price), 0) as stockValueCost,
          COALESCE(SUM(stock_quantity * retail_price), 0) as stockValueRetail,
          COALESCE(SUM(stock_quantity * wholesale_price), 0) as stockValueWholesale,
          COALESCE(SUM(CASE WHEN stock_quantity <= min_stock_alert THEN 1 ELSE 0 END), 0) as lowStockCount
        FROM products
      `).get() as Record<string, number>;

      const salesStats = db.prepare(`
        SELECT
          COUNT(*) as totalSalesCount,
          COALESCE(SUM(total_amount), 0) as totalRevenue,
          COALESCE(SUM(total_cost), 0) as totalCogs,
          COALESCE(SUM(paid_amount), 0) as totalCollected,
          COALESCE(SUM(remaining_debt), 0) as totalReceivables
        FROM sales
        WHERE COALESCE(status, 'completed') != 'canceled'
          AND datetime(created_at) BETWEEN datetime(?) AND datetime(?)
      `).get(startDt, endDt) as Record<string, number>;

      const purchaseStats = db.prepare(`
        SELECT
          COUNT(*) as totalPurchasesCount,
          COALESCE(SUM(total_amount), 0) as totalPurchases
        FROM purchases
        WHERE datetime(created_at) BETWEEN datetime(?) AND datetime(?)
      `).get(startDt, endDt) as Record<string, number>;

      const returnStats = db.prepare(`
        SELECT COALESCE(SUM(total_amount), 0) as totalSalesReturn
        FROM sales
        WHERE status = 'canceled'
          AND datetime(created_at) BETWEEN datetime(?) AND datetime(?)
      `).get(startDt, endDt) as { totalSalesReturn: number };

      const expenseStats = db.prepare(`
        SELECT COALESCE(SUM(amount), 0) as totalExpenses
        FROM expenses
        WHERE date(expense_date) BETWEEN date(?) AND date(?)
      `).get(bounds.start, bounds.end) as { totalExpenses: number };

      const serviceStats = db.prepare(`
        SELECT
          COALESCE(SUM(CASE WHEN status IN ('pending', 'in_progress') THEN 1 ELSE 0 END), 0) as openJobs,
          COALESCE(SUM(CASE WHEN status = 'ready' THEN 1 ELSE 0 END), 0) as readyJobs,
          COALESCE(SUM(paid_amount), 0) as serviceRevenue,
          COALESCE(SUM(parts_cost), 0) as servicePartsCost
        FROM service_jobs
        WHERE datetime(created_at) BETWEEN datetime(?) AND datetime(?)
      `).get(startDt, endDt) as Record<string, number>;

      const supplierDebt = db.prepare(`
        SELECT COALESCE(SUM(balance_owed), 0) as totalSupplierDebt FROM suppliers
      `).get() as { totalSupplierDebt: number };

      const paymentBreakdown = db.prepare(`
        SELECT
          payment_method,
          COUNT(*) as count,
          COALESCE(SUM(paid_amount), 0) as amount
        FROM sales
        WHERE COALESCE(status, 'completed') != 'canceled'
          AND datetime(created_at) BETWEEN datetime(?) AND datetime(?)
        GROUP BY payment_method
      `).all(startDt, endDt);

      const topProducts = db.prepare(`
        SELECT
          si.product_id,
          si.product_name,
          SUM(si.quantity) as totalQty,
          SUM(si.subtotal) as totalRevenue
        FROM sale_items si
        JOIN sales s ON s.id = si.sale_id
        WHERE COALESCE(s.status, 'completed') != 'canceled'
          AND datetime(s.created_at) BETWEEN datetime(?) AND datetime(?)
        GROUP BY si.product_id, si.product_name
        ORDER BY totalQty DESC, totalRevenue DESC
        LIMIT 5
      `).all(startDt, endDt);

      const topCustomers = db.prepare(`
        SELECT
          c.id,
          c.name,
          c.phone,
          COUNT(s.id) as ordersCount,
          COALESCE(SUM(s.total_amount), 0) as totalSpent,
          c.total_debt
        FROM sales s
        JOIN customers c ON c.id = s.customer_id
        WHERE COALESCE(s.status, 'completed') != 'canceled'
          AND datetime(s.created_at) BETWEEN datetime(?) AND datetime(?)
        GROUP BY c.id
        ORDER BY totalSpent DESC
        LIMIT 5
      `).all(startDt, endDt);

      const dailySales = db.prepare(`
        SELECT date(created_at) as day, COALESCE(SUM(total_amount), 0) as total
        FROM sales
        WHERE COALESCE(status, 'completed') != 'canceled'
          AND date(created_at) >= date('now', '-13 days')
        GROUP BY date(created_at)
      `).all() as { day: string; total: number }[];
      const dailyPurchases = db.prepare(`
        SELECT date(created_at) as day, COALESCE(SUM(total_amount), 0) as total
        FROM purchases
        WHERE date(created_at) >= date('now', '-13 days')
        GROUP BY date(created_at)
      `).all() as { day: string; total: number }[];
      const sDayMap = new Map(dailySales.map((r) => [r.day, Number(r.total)]));
      const pDayMap = new Map(dailyPurchases.map((r) => [r.day, Number(r.total)]));
      const dailySeries: Array<{ day: string; sales: number; purchases: number }> = [];
      for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = d.toISOString().slice(0, 10);
        dailySeries.push({
          day: dayStr,
          sales: sDayMap.get(dayStr) || 0,
          purchases: pDayMap.get(dayStr) || 0,
        });
      }

      const openQuotes = db.prepare("SELECT COUNT(*) as count FROM quotations WHERE status = 'open'").get() as { count: number };

      const lowStockProducts = db.prepare(`
        SELECT id, barcode, sku, model_number, brand, name_fr, name_ar, name_en, stock_quantity, min_stock_alert, current_cost_price, retail_price
        FROM products
        WHERE stock_quantity <= min_stock_alert
        ORDER BY stock_quantity ASC
        LIMIT 10
      `).all();

      const recentSales = db.prepare(`SELECT * FROM sales ORDER BY id DESC LIMIT 8`).all();

      const upcomingInstallments = db.prepare(`
        SELECT i.*, c.name as customer_name, c.phone as customer_phone, s.invoice_number
        FROM installments i
        JOIN customers c ON c.id = i.customer_id
        JOIN sales s ON s.id = i.sale_id
        WHERE i.status != 'paid'
        ORDER BY i.due_date ASC
        LIMIT 10
      `).all();

      const pendingWooSync = db.prepare(`
        SELECT COUNT(*) as count FROM products WHERE woo_sync_status = 'pending'
      `).get() as { count: number };

      const grossProfit = (salesStats.totalRevenue || 0) - (salesStats.totalCogs || 0);
      const serviceProfit = (serviceStats.serviceRevenue || 0) - (serviceStats.servicePartsCost || 0);
      const netProfit = grossProfit + serviceProfit - (expenseStats.totalExpenses || 0);

      sendJson(res, 200, {
        range,
        bounds,
        productStats,
        salesStats: {
          ...salesStats,
          totalPurchases: purchaseStats.totalPurchases || 0,
          totalPurchasesCount: purchaseStats.totalPurchasesCount || 0,
          totalSalesReturn: returnStats.totalSalesReturn || 0,
          grossProfit,
          serviceProfit,
          netProfit,
          totalExpenses: expenseStats.totalExpenses || 0,
          totalSupplierDebt: supplierDebt.totalSupplierDebt || 0,
        },
        serviceStats,
        paymentBreakdown,
        topProducts,
        topCustomers,
        dailySeries,
        openQuotationsCount: openQuotes.count,
        lowStockProducts,
        recentSales,
        upcomingInstallments,
        pendingWooSync: pendingWooSync.count,
      });
      return;
    }

    // ========================================================================
    // 3. PRODUCTS, BARCODE LOOKUP, SERIALS & LAST BUYING PRICES HISTORY
    // ========================================================================
    if (pathname === '/api/products' && method === 'GET') {
      const search = (parsedUrl.searchParams.get('search') || '').trim();
      const category = (parsedUrl.searchParams.get('category') || '').trim();

      let query = 'SELECT * FROM products WHERE 1=1';
      const params: (string | number)[] = [];

      if (search) {
        query += ` AND (barcode LIKE ? OR sku LIKE ? OR model_number LIKE ? OR brand LIKE ? OR name_fr LIKE ? OR name_ar LIKE ? OR name_en LIKE ?)`;
        const like = `%${search}%`;
        params.push(like, like, like, like, like, like, like);
      }
      if (category && category !== 'ALL') {
        query += ` AND category = ?`;
        params.push(category);
      }
      query += ' ORDER BY id DESC';
      const limitParam = Number(parsedUrl.searchParams.get('limit') || 0);
      const offsetParam = Number(parsedUrl.searchParams.get('offset') || 0);
      if (limitParam > 0) {
        query += ' LIMIT ? OFFSET ?';
        params.push(limitParam, Math.max(0, offsetParam));
      }

      const products = db.prepare(query).all(...params) as Record<string, any>[];
      const allSerials = db
        .prepare("SELECT product_id, serial_number FROM serial_items WHERE status = 'in_stock'")
        .all() as { product_id: number; serial_number: string }[];
      const serialMap = new Map<number, string[]>();
      for (const s of allSerials) {
        const list = serialMap.get(s.product_id);
        if (list) list.push(s.serial_number);
        else serialMap.set(s.product_id, [s.serial_number]);
      }
      const enriched = products.map((p) => ({
        ...attachNormalizedImages(p),
        available_serials: serialMap.get(Number(p.id)) || [],
      }));
      sendJson(res, 200, enriched, req);
      return;
    }

    if (pathname === '/api/products/image-search' && method === 'GET') {
      const q = (parsedUrl.searchParams.get('q') || '').trim();
      if (!q) {
        sendJson(res, 400, { error: 'Requête de recherche manquante' });
        return;
      }
      const results = await searchWebProductImages(q);
      sendJson(res, 200, { results }, req);
      return;
    }

    if (pathname === '/api/products/download-web-image' && method === 'POST') {
      const body = await readJsonBody(req);
      const uploadDir = path.join(publicDir, 'uploads', 'products');
      const dl = await downloadWebProductImage(String(body.url || ''), String(body.thumb || ''), uploadDir);
      if (!dl.image_url) {
        sendJson(res, 400, { error: dl.error || 'Téléchargement impossible' });
        return;
      }
      sendJson(res, 200, { success: true, image_url: dl.image_url, public_url: dl.public_url });
      return;
    }

    if (pathname.startsWith('/api/products/internet-lookup/') && method === 'GET') {
      const barcode = decodeURIComponent(pathname.replace('/api/products/internet-lookup/', ''));
      const lookup = await lookupBarcodeOnInternet(barcode);
      sendJson(res, 200, lookup);
      return;
    }

    if (pathname.startsWith('/api/products/barcode/') && method === 'GET') {
      const barcode = decodeURIComponent(pathname.replace('/api/products/barcode/', ''));
      const productRaw = db
        .prepare('SELECT * FROM products WHERE barcode = ? OR sku = ? OR model_number = ?')
        .get(barcode, barcode, barcode) as Record<string, any> | undefined;

      if (!productRaw) {
        sendJson(res, 404, { error: 'Product not found', barcode });
        return;
      }
      const product = attachNormalizedImages(productRaw);

      const priceHistory = db
        .prepare('SELECT * FROM price_history WHERE product_id = ? ORDER BY recorded_at DESC, id DESC LIMIT 20')
        .all(Number(product.id));

      const serialItems = db
        .prepare('SELECT * FROM serial_items WHERE product_id = ? ORDER BY id DESC')
        .all(Number(product.id));

      const inStockSerials = (serialItems as Record<string, any>[]).filter((s) => s.status === 'in_stock');

      sendJson(res, 200, {
        ...product,
        price_history: priceHistory,
        available_serials: inStockSerials,
        product,
        priceHistory,
        serialItems,
      });
      return;
    }

    if (pathname === '/api/products' && method === 'POST') {
      const p = await readJsonBody(req);
      const barcode = String(p.barcode || `611${Math.floor(1000000000 + Math.random() * 9000000000)}`).trim();
      const sku = String(p.sku || `SKU-${Date.now().toString().slice(-5)}`).trim();
      const cost = Number(p.current_cost_price) || 0;
      const lastCost = Number(p.last_cost_price) || cost;
      const retail = Number(p.retail_price) || 0;
      const wholesale = Number(p.wholesale_price) || retail;
      const minSelling = Number(p.min_selling_price) || wholesale;
      const stock = Number(p.stock_quantity) || 0;
      const imgList = normalizeProductImages({ images_json: Array.isArray(p.images) ? p.images : p.images_json, image_url: p.image_url });
      const primaryImg = imgList[0] || '';

      const result = db.prepare(`
        INSERT INTO products (
          barcode, sku, model_number, brand, category,
          name_fr, name_ar, name_en,
          description_fr, description_ar, description_en,
          specs_json, retail_price, wholesale_price, min_selling_price,
          current_cost_price, last_cost_price, stock_quantity, min_stock_alert,
          warranty_months, has_serial, image_url, images_json, woo_sync_status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
      `).run(
        barcode,
        sku,
        p.model_number || '',
        p.brand || 'Générique',
        p.category || 'Électroménager',
        p.name_fr || p.name_en || 'Nouvel Article',
        p.name_ar || p.name_fr || 'منتج جديد',
        p.name_en || p.name_fr || 'New Item',
        p.description_fr || '',
        p.description_ar || '',
        p.description_en || '',
        typeof p.specs_json === 'string' ? p.specs_json : JSON.stringify(p.specs_json || {}),
        retail,
        wholesale,
        minSelling,
        cost,
        lastCost,
        stock,
        Number(p.min_stock_alert) || 2,
        Number(p.warranty_months) || 12,
        p.has_serial ? 1 : 0,
        primaryImg,
        JSON.stringify(imgList)
      );

      const productId = Number(result.lastInsertRowid);

      db.prepare(`
        INSERT INTO price_history (
          product_id, supplier_name, buying_price, previous_buying_price,
          retail_price_at_time, wholesale_price_at_time, quantity_added, invoice_ref, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        productId,
        p.supplier_name || 'Stock Initial',
        cost,
        lastCost,
        retail,
        wholesale,
        stock,
        'INIT-STOCK',
        'Création de fiche article'
      );

      if (Array.isArray(p.serial_numbers)) {
        const insertSerial = db.prepare(
          `INSERT OR IGNORE INTO serial_items (product_id, serial_number, status) VALUES (?, ?, 'in_stock')`
        );
        for (const sn of p.serial_numbers) {
          if (sn && String(sn).trim()) {
            insertSerial.run(productId, String(sn).trim());
          }
        }
      }

      queueWooSync(productId, 'upsert_product', { barcode, retail, stock });
      const created = attachNormalizedImages(db.prepare('SELECT * FROM products WHERE id = ?').get(productId) as Record<string, any>);
      broadcastEvent('PRODUCT_CREATED', created);
      sendJson(res, 200, created);
      return;
    }

    const prodImagesMatch = pathname.match(/^\/api\/products\/(\d+)\/images$/);
    if (prodImagesMatch && method === 'PUT') {
      const id = Number(prodImagesMatch[1]);
      const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Record<string, any> | undefined;
      if (!existing) {
        sendJson(res, 404, { error: 'Product not found' });
        return;
      }
      const body = await readJsonBody(req);
      let imgs = normalizeProductImages(existing);
      if (Array.isArray(body.images)) {
        imgs = body.images.map((u: any) => String(u || '').trim()).filter(Boolean);
      }
      if (body.add_image) {
        const addUrl = String(body.add_image).trim();
        if (addUrl && !imgs.includes(addUrl)) {
          if (body.make_primary) imgs.unshift(addUrl);
          else imgs.push(addUrl);
        }
      }
      if (body.remove_image) {
        const rem = String(body.remove_image).trim();
        imgs = imgs.filter((u) => u !== rem);
      }
      if (body.set_primary) {
        const prim = String(body.set_primary).trim();
        if (imgs.includes(prim)) {
          imgs = [prim, ...imgs.filter((u) => u !== prim)];
        }
      }
      const deduped: string[] = [];
      for (const u of imgs) {
        if (u && !deduped.includes(u)) deduped.push(u);
      }
      const primaryUrl = deduped[0] || '';
      db.prepare(`
        UPDATE products SET image_url = ?, images_json = ?, woo_sync_status = 'pending', updated_at = datetime('now') WHERE id = ?
      `).run(primaryUrl, JSON.stringify(deduped), id);
      queueWooSync(id, 'upsert_product', { id, images: deduped });
      const updated = attachNormalizedImages(db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Record<string, any>);
      broadcastEvent('PRODUCT_UPDATED', updated);
      sendJson(res, 200, updated);
      return;
    }

    const prodIdMatch = pathname.match(/^\/api\/products\/(\d+)$/);
    if (prodIdMatch && method === 'PUT') {
      const id = Number(prodIdMatch[1]);
      const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Record<string, any> | undefined;
      if (!existing) {
        sendJson(res, 404, { error: 'Product not found' });
        return;
      }

      const p = await readJsonBody(req);
      const newCost = p.current_cost_price !== undefined ? Number(p.current_cost_price) : Number(existing.current_cost_price);
      const oldCost = Number(existing.current_cost_price);
      const lastCost = newCost !== oldCost ? oldCost : Number(existing.last_cost_price);
      const newRetail = p.retail_price !== undefined ? Number(p.retail_price) : Number(existing.retail_price);
      const newWholesale = p.wholesale_price !== undefined ? Number(p.wholesale_price) : Number(existing.wholesale_price);

      let nextImages = normalizeProductImages(existing);
      if (Array.isArray(p.images)) {
        nextImages = normalizeProductImages({ images_json: p.images, image_url: p.image_url });
      } else if (p.image_url !== undefined) {
        const u = String(p.image_url || '').trim();
        if (!u) {
          nextImages = nextImages.filter((x) => x !== existing.image_url);
        } else if (!nextImages.includes(u)) {
          nextImages = [u, ...nextImages];
        } else {
          nextImages = [u, ...nextImages.filter((x) => x !== u)];
        }
      }
      const nextPrimaryImg = nextImages[0] || '';

      db.prepare(`
        UPDATE products SET
          barcode = ?, sku = ?, model_number = ?, brand = ?, category = ?,
          name_fr = ?, name_ar = ?, name_en = ?,
          description_fr = ?, description_ar = ?, description_en = ?,
          retail_price = ?, wholesale_price = ?, min_selling_price = ?,
          current_cost_price = ?, last_cost_price = ?,
          stock_quantity = ?, min_stock_alert = ?, warranty_months = ?, has_serial = ?, image_url = ?, images_json = ?,
          woo_sync_status = 'pending', updated_at = datetime('now')
        WHERE id = ?
      `).run(
        p.barcode ?? existing.barcode,
        p.sku ?? existing.sku,
        p.model_number ?? existing.model_number,
        p.brand ?? existing.brand,
        p.category ?? existing.category,
        p.name_fr ?? existing.name_fr,
        p.name_ar ?? existing.name_ar,
        p.name_en ?? existing.name_en,
        p.description_fr ?? existing.description_fr,
        p.description_ar ?? existing.description_ar,
        p.description_en ?? existing.description_en,
        newRetail,
        newWholesale,
        p.min_selling_price !== undefined ? Number(p.min_selling_price) : existing.min_selling_price,
        newCost,
        lastCost,
        p.stock_quantity !== undefined ? Number(p.stock_quantity) : existing.stock_quantity,
        p.min_stock_alert !== undefined ? Number(p.min_stock_alert) : existing.min_stock_alert,
        p.warranty_months !== undefined ? Number(p.warranty_months) : existing.warranty_months,
        p.has_serial !== undefined ? (p.has_serial ? 1 : 0) : existing.has_serial,
        nextPrimaryImg,
        JSON.stringify(nextImages),
        id
      );

      if (newCost !== oldCost || newRetail !== Number(existing.retail_price) || newWholesale !== Number(existing.wholesale_price)) {
        db.prepare(`
          INSERT INTO price_history (
            product_id, supplier_name, buying_price, previous_buying_price,
            retail_price_at_time, wholesale_price_at_time, quantity_added, invoice_ref, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          id,
          p.supplier_name || 'Modification directe',
          newCost,
          oldCost,
          newRetail,
          newWholesale,
          0,
          'MAJ-TARIF',
          p.price_note || 'Actualisation tarifaire'
        );
      }

      queueWooSync(id, 'upsert_product', { id, newRetail, stock: p.stock_quantity ?? existing.stock_quantity });
      const updated = attachNormalizedImages(db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Record<string, any>);
      broadcastEvent('PRODUCT_UPDATED', updated);
      sendJson(res, 200, updated);
      return;
    }

    if (prodIdMatch && method === 'DELETE') {
      const id = Number(prodIdMatch[1]);
      db.prepare('DELETE FROM sale_items WHERE product_id = ?').run(id);
      db.prepare('DELETE FROM purchase_items WHERE product_id = ?').run(id);
      db.prepare('DELETE FROM products WHERE id = ?').run(id);
      broadcastEvent('PRODUCT_DELETED', { id });
      sendJson(res, 200, { success: true });
      return;
    }

    const serialsMatch = pathname.match(/^\/api\/products\/(\d+)\/serials$/);
    if (serialsMatch && method === 'POST') {
      const id = Number(serialsMatch[1]);
      const body = await readJsonBody(req);
      if (!body.serial_number) {
        sendJson(res, 400, { error: 'Serial number required' });
        return;
      }
      db.prepare(`INSERT OR IGNORE INTO serial_items (product_id, serial_number, status, notes) VALUES (?, ?, 'in_stock', ?)`).run(
        id,
        String(body.serial_number).trim(),
        body.notes || ''
      );
      const serials = db.prepare('SELECT * FROM serial_items WHERE product_id = ? ORDER BY id DESC').all(id);
      broadcastEvent('SERIAL_ADDED', { productId: id });
      sendJson(res, 200, serials);
      return;
    }

    const delSerialMatch = pathname.match(/^\/api\/serials\/(\d+)$/);
    if (delSerialMatch && method === 'DELETE') {
      db.prepare('DELETE FROM serial_items WHERE id = ?').run(Number(delSerialMatch[1]));
      sendJson(res, 200, { success: true });
      return;
    }

    // ========================================================================
    // 4. SUPPLIERS & PURCHASES (RESTOCKING + SUPPLIER PAYMENTS)
    // ========================================================================
    if (pathname === '/api/suppliers' && method === 'GET') {
      sendJson(res, 200, db.prepare('SELECT * FROM suppliers ORDER BY id DESC').all());
      return;
    }

    if (pathname === '/api/suppliers' && method === 'POST') {
      const { name, company, phone, email, address, balance_owed, notes } = await readJsonBody(req);
      const result = db.prepare(`
        INSERT INTO suppliers (name, company, phone, email, address, balance_owed, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(name, company || name, phone || '', email || '', address || '', Number(balance_owed) || 0, notes || '');
      sendJson(res, 200, db.prepare('SELECT * FROM suppliers WHERE id = ?').get(Number(result.lastInsertRowid)));
      return;
    }

    const supPayMatch = pathname.match(/^\/api\/suppliers\/(\d+)\/pay$/);
    if (supPayMatch && method === 'POST') {
      const supId = Number(supPayMatch[1]);
      const { amount, notes } = await readJsonBody(req);
      const payVal = Number(amount) || 0;
      const sup = db.prepare('SELECT * FROM suppliers WHERE id = ?').get(supId) as Record<string, any> | undefined;
      if (!sup || payVal <= 0) {
        sendJson(res, 400, { error: 'Invalid supplier payment' });
        return;
      }
      db.prepare('UPDATE suppliers SET balance_owed = MAX(0, balance_owed - ?) WHERE id = ?').run(payVal, supId);
      db.prepare(`
        INSERT INTO expenses (title, category, amount, payment_method, expense_date, notes)
        VALUES (?, 'supplier_payment', ?, 'transfer', date('now'), ?)
      `).run(`Règlement Fournisseur : ${sup.company || sup.name}`, payVal, notes || '');
      broadcastEvent('SUPPLIER_PAID', { supId, amount: payVal });
      sendJson(res, 200, { success: true });
      return;
    }

    if (pathname === '/api/purchases' && method === 'GET') {
      const purchases = db.prepare(`
        SELECT p.*, s.name as supplier_name, s.company as supplier_company
        FROM purchases p
        LEFT JOIN suppliers s ON s.id = p.supplier_id
        ORDER BY p.id DESC
      `).all() as Record<string, any>[];

      const getItems = db.prepare(`
        SELECT pi.*, pr.name_fr, pr.barcode, pr.brand, pr.model_number
        FROM purchase_items pi
        LEFT JOIN products pr ON pr.id = pi.product_id
        WHERE pi.purchase_id = ?
      `);
      sendJson(
        res,
        200,
        purchases.map((pur) => ({
          ...pur,
          items: getItems.all(pur.id),
        }))
      );
      return;
    }

    if (pathname === '/api/purchases' && method === 'POST') {
      const { supplier_id, provider_name, provider_phone, invoice_number, items, paid_amount, notes } = await readJsonBody(req);
      if (!Array.isArray(items) || items.length === 0) {
        sendJson(res, 400, { error: 'Purchase must include at least one item' });
        return;
      }

      let resolvedSupplierId = Number(supplier_id) || 0;
      let supplier = resolvedSupplierId
        ? (db.prepare('SELECT * FROM suppliers WHERE id = ?').get(resolvedSupplierId) as Record<string, any> | undefined)
        : undefined;

      if (!supplier && provider_name && String(provider_name).trim()) {
        const cleanProv = String(provider_name).trim();
        supplier = db
          .prepare('SELECT * FROM suppliers WHERE LOWER(company) = LOWER(?) OR LOWER(name) = LOWER(?) LIMIT 1')
          .get(cleanProv, cleanProv) as Record<string, any> | undefined;
        if (!supplier) {
          const insSup = db
            .prepare(`INSERT INTO suppliers (name, company, phone, notes) VALUES (?, ?, ?, ?)`)
            .run(cleanProv, cleanProv, String(provider_phone || ''), 'Créé automatiquement via scan facture');
          resolvedSupplierId = Number(insSup.lastInsertRowid);
          supplier = db.prepare('SELECT * FROM suppliers WHERE id = ?').get(resolvedSupplierId) as Record<string, any>;
        } else {
          resolvedSupplierId = Number(supplier.id);
        }
      }

      if (!resolvedSupplierId) resolvedSupplierId = 1;
      const supplierName = supplier ? `${supplier.company || supplier.name}` : String(provider_name || 'Fournisseur Direct');

      let totalAmount = 0;
      for (const item of items) {
        totalAmount += (Number(item.quantity) || 1) * (Number(item.unit_cost) || 0);
      }
      const paid = paid_amount !== undefined && paid_amount !== '' ? Number(paid_amount) : totalAmount;
      const remainingOwed = Math.max(0, totalAmount - paid);
      const invRef = invoice_number || `BL-${Date.now().toString().slice(-6)}`;

      const purchaseRes = db.prepare(`
        INSERT INTO purchases (invoice_number, supplier_id, total_amount, paid_amount, remaining_owed, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(invRef, resolvedSupplierId, totalAmount, paid, remainingOwed, notes || '');

      const purchaseId = Number(purchaseRes.lastInsertRowid);
      const createdProducts: number[] = [];

      for (const item of items) {
        let prod = item.product_id
          ? (db.prepare('SELECT * FROM products WHERE id = ?').get(Number(item.product_id)) as Record<string, any> | undefined)
          : undefined;

        const qty = Number(item.quantity) || 1;
        const unitCost = Number(item.unit_cost) || Number(prod?.current_cost_price || 0);
        const newRetail = item.new_retail_price
          ? Number(item.new_retail_price)
          : Number(prod?.retail_price || Math.round(unitCost * 1.25));
        const newWholesale = item.new_wholesale_price
          ? Number(item.new_wholesale_price)
          : Number(prod?.wholesale_price || Math.round(unitCost * 1.12));

        if (!prod && item.product_name && String(item.product_name).trim()) {
          const cleanName = String(item.product_name).trim();
          const sku = String(item.sku_or_ref || '').trim() || `SKU-${Date.now().toString().slice(-5)}-${Math.floor(Math.random() * 90 + 10)}`;
          const barcode = String(item.barcode || '').trim() || `611${Date.now().toString().slice(-9)}${Math.floor(Math.random() * 9)}`;
          const insProd = db.prepare(`
            INSERT INTO products (
              barcode, sku, model_number, brand, category,
              name_fr, name_ar, name_en,
              retail_price, wholesale_price, min_selling_price,
              current_cost_price, last_cost_price, stock_quantity, min_stock_alert,
              warranty_months, has_serial, woo_sync_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 2, 12, 0, 'pending')
          `).run(
            barcode,
            sku,
            sku,
            String(item.brand || 'Générique').trim(),
            String(item.category || 'Électroménager').trim(),
            cleanName,
            cleanName,
            cleanName,
            newRetail,
            newWholesale,
            Math.round(unitCost * 1.05),
            unitCost,
            unitCost
          );
          const newProdId = Number(insProd.lastInsertRowid);
          createdProducts.push(newProdId);
          prod = db.prepare('SELECT * FROM products WHERE id = ?').get(newProdId) as Record<string, any>;
        }

        if (!prod) continue;
        const previousCost = Number(prod.current_cost_price);

        db.prepare(`
          INSERT INTO purchase_items (purchase_id, product_id, quantity, unit_cost, new_retail_price, new_wholesale_price, subtotal)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(purchaseId, prod.id, qty, unitCost, newRetail, newWholesale, qty * unitCost);

        db.prepare(`
          UPDATE products SET
            last_cost_price = current_cost_price,
            current_cost_price = ?,
            retail_price = ?,
            wholesale_price = ?,
            stock_quantity = stock_quantity + ?,
            woo_sync_status = 'pending',
            updated_at = datetime('now')
          WHERE id = ?
        `).run(unitCost, newRetail, newWholesale, qty, prod.id);

        db.prepare(`
          INSERT INTO price_history (
            product_id, supplier_id, supplier_name,
            buying_price, previous_buying_price, retail_price_at_time, wholesale_price_at_time,
            quantity_added, invoice_ref, notes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          prod.id,
          resolvedSupplierId,
          supplierName,
          unitCost,
          previousCost,
          newRetail,
          newWholesale,
          qty,
          invRef,
          notes || 'Réception fournisseur'
        );

        if (Array.isArray(item.serial_numbers)) {
          const insSn = db.prepare(`INSERT OR IGNORE INTO serial_items (product_id, serial_number, status, purchase_id) VALUES (?, ?, 'in_stock', ?)`);
          for (const sn of item.serial_numbers) {
            if (sn && String(sn).trim()) insSn.run(prod.id, String(sn).trim(), purchaseId);
          }
        }

        queueWooSync(Number(prod.id), 'update_stock', { productId: prod.id, added: qty });
      }

      if (remainingOwed > 0 && supplier) {
        db.prepare('UPDATE suppliers SET balance_owed = balance_owed + ? WHERE id = ?').run(remainingOwed, supplier.id);
      }

      broadcastEvent('PURCHASE_RECORDED', { purchaseId, invoice_number: invRef, totalAmount });
      sendJson(res, 200, { success: true, purchaseId, invoice_number: invRef, supplier_id: resolvedSupplierId, createdProducts });
      return;
    }

    // ========================================================================
    // 5. POS SALES, CUSTOMERS, CREDIT / INSTALLMENTS & WARRANTIES
    // ========================================================================
    if (pathname === '/api/customers' && method === 'GET') {
      sendJson(res, 200, db.prepare('SELECT * FROM customers ORDER BY id DESC').all());
      return;
    }

    if (pathname === '/api/customers' && method === 'POST') {
      const body = await readJsonBody(req);
      const cleanName = String(body.name || body.full_name || '').trim();
      if (!cleanName) {
        sendJson(res, 400, { error: 'Customer name is required' });
        return;
      }
      const { phone, address, national_id, customer_type, notes } = body;
      const result = db.prepare(`
        INSERT INTO customers (name, phone, address, national_id, customer_type, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(cleanName, phone || '', address || '', national_id || '', customer_type || 'retail', notes || '');
      sendJson(res, 200, db.prepare('SELECT * FROM customers WHERE id = ?').get(Number(result.lastInsertRowid)));
      return;
    }

    const custIdMatch = pathname.match(/^\/api\/customers\/(\d+)$/);
    if (custIdMatch && method === 'DELETE') {
      const id = Number(custIdMatch[1]);
      db.prepare('DELETE FROM customers WHERE id = ?').run(id);
      sendJson(res, 200, { success: true });
      return;
    }

    const custLedgerMatch = pathname.match(/^\/api\/customers\/(\d+)\/ledger$/);
    if (custLedgerMatch && method === 'GET') {
      const id = Number(custLedgerMatch[1]);
      const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(id);
      const sales = db.prepare('SELECT * FROM sales WHERE customer_id = ? ORDER BY id DESC').all(id);
      const installments = db.prepare(`
        SELECT i.*, s.invoice_number
        FROM installments i
        JOIN sales s ON s.id = i.sale_id
        WHERE i.customer_id = ?
        ORDER BY i.due_date ASC
      `).all(id);
      const payments = db.prepare('SELECT * FROM customer_payments WHERE customer_id = ? ORDER BY id DESC').all(id);
      sendJson(res, 200, { customer, sales, installments, payments });
      return;
    }

    const custPayMatch = pathname.match(/^\/api\/customers\/(\d+)\/pay$/);
    if (custPayMatch && method === 'POST') {
      const customerId = Number(custPayMatch[1]);
      const { amount, payment_method, notes, installment_id } = await readJsonBody(req);
      const payAmount = Number(amount) || 0;
      if (payAmount <= 0) {
        sendJson(res, 400, { error: 'Invalid payment amount' });
        return;
      }

      withTransaction(() => {
        db.prepare(`
          INSERT INTO customer_payments (customer_id, amount, payment_method, notes)
          VALUES (?, ?, ?, ?)
        `).run(customerId, payAmount, payment_method || 'cash', notes || 'Règlement client');

        db.prepare(`UPDATE customers SET total_debt = MAX(0, total_debt - ?) WHERE id = ?`).run(payAmount, customerId);

        if (installment_id) {
          db.prepare(`
            UPDATE installments SET paid_amount = amount, status = 'paid', paid_at = datetime('now') WHERE id = ?
          `).run(Number(installment_id));
        }
      });

      broadcastEvent('CUSTOMER_PAYMENT', { customerId, amount: payAmount });
      sendJson(res, 200, { success: true });
      return;
    }

    if (pathname === '/api/sales' && method === 'GET') {
      const sales = db.prepare('SELECT * FROM sales ORDER BY id DESC LIMIT 100').all() as Record<string, any>[];
      const getItems = db.prepare('SELECT * FROM sale_items WHERE sale_id = ?');
      sendJson(
        res,
        200,
        sales.map((s) => ({ ...s, items: getItems.all(s.id) }))
      );
      return;
    }

    if (pathname === '/api/sales' && method === 'POST') {
      const body = await readJsonBody(req);
      let fullSale: Record<string, any>;
      try {
        fullSale = executeAtomicSale(body, 'windows_pos');
      } catch (err: any) {
        sendJson(res, 400, { error: err?.message || 'Transaction failed' });
        return;
      }

      logAudit(body.operator_name || 'Système', body.operator_role || 'admin', 'SALE_CREATED', 'sale', fullSale.id, {
        invoice_number: fullSale.invoice_number,
        total_amount: fullSale.total_amount,
        payment_method: fullSale.payment_method,
      }, fullSale.source_device || 'windows_pos');
      broadcastEvent('SALE_COMPLETED', fullSale);
      sendJson(res, 200, fullSale);
      return;
    }

    // Cancel / Return Sale (creates sequential AV Credit Note, restores stock/serials/debt atomically)
    const saleDelMatch = pathname.match(/^\/api\/sales\/(\d+)$/);
    if (saleDelMatch && method === 'DELETE') {
      const saleId = Number(saleDelMatch[1]);
      const result = withTransaction(() => {
        const sale = db.prepare('SELECT * FROM sales WHERE id = ?').get(saleId) as Record<string, any> | undefined;
        if (!sale) return { found: false, alreadyCanceled: false, creditNote: '' };
        if (sale.status === 'canceled') return { found: true, alreadyCanceled: true, creditNote: sale.credit_note_number || '' };
        const items = db.prepare('SELECT * FROM sale_items WHERE sale_id = ?').all(saleId) as Record<string, any>[];
        for (const item of items) {
          db.prepare('UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?').run(item.quantity, item.product_id);
          if (item.serial_number) {
            db.prepare(`UPDATE serial_items SET status = 'in_stock', sale_id = NULL, customer_id = NULL WHERE serial_number = ?`).run(item.serial_number);
          }
        }
        if (sale.customer_id) {
          db.prepare(`
            UPDATE customers SET
              total_spent = MAX(0, total_spent - ?),
              total_debt = MAX(0, total_debt - ?)
            WHERE id = ?
          `).run(sale.total_amount, sale.remaining_debt, sale.customer_id);
        }
        const creditNote = getNextInvoiceNumber('AV');
        db.prepare(`UPDATE installments SET status = 'canceled' WHERE sale_id = ? AND status != 'paid'`).run(saleId);
        db.prepare(`UPDATE sales SET status = 'canceled', credit_note_number = ? WHERE id = ?`).run(creditNote, saleId);
        return { found: true, alreadyCanceled: false, creditNote };
      });
      if (!result.found) {
        sendJson(res, 404, { error: 'Sale not found' });
        return;
      }
      logAudit('Admin', 'admin', 'CREDIT_NOTE_ISSUED', 'sale', saleId, { credit_note_number: result.creditNote });
      broadcastEvent('SALE_CANCELED', { saleId, creditNoteNumber: result.creditNote });
      sendJson(res, 200, { success: true, credit_note_number: result.creditNote });
      return;
    }

    // ========================================================================
    // 6. STORE EXPENSES
    // ========================================================================
    if (pathname === '/api/expenses' && method === 'GET') {
      sendJson(res, 200, db.prepare('SELECT * FROM expenses ORDER BY expense_date DESC, id DESC').all());
      return;
    }

    if (pathname === '/api/expenses' && method === 'POST') {
      const { title, category, amount, payment_method, expense_date, notes } = await readJsonBody(req);
      const result = db.prepare(`
        INSERT INTO expenses (title, category, amount, payment_method, expense_date, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        title,
        category || 'other',
        Number(amount) || 0,
        payment_method || 'cash',
        expense_date || new Date().toISOString().split('T')[0],
        notes || ''
      );
      sendJson(res, 200, db.prepare('SELECT * FROM expenses WHERE id = ?').get(Number(result.lastInsertRowid)));
      return;
    }

    const expDelMatch = pathname.match(/^\/api\/expenses\/(\d+)$/);
    if (expDelMatch && method === 'DELETE') {
      db.prepare('DELETE FROM expenses WHERE id = ?').run(Number(expDelMatch[1]));
      sendJson(res, 200, { success: true });
      return;
    }

    // ========================================================================
    // 7. WOOCOMMERCE AUTO-SYNC & AI PRODUCT GENERATOR
    // ========================================================================
    if (pathname === '/api/settings' && method === 'GET') {
      sendJson(res, 200, getSettingsMap());
      return;
    }

    if (pathname === '/api/settings' && method === 'PUT') {
      const updates = await readJsonBody(req);
      const stmt = db.prepare(`
        INSERT INTO settings (key, value) VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `);
      for (const [k, v] of Object.entries(updates)) {
        stmt.run(k, String(v ?? ''));
      }
      sendJson(res, 200, getSettingsMap());
      return;
    }

    if (pathname === '/api/woocommerce/test' && method === 'POST') {
      const body = await readJsonBody(req).catch(() => ({}));
      const saved = getSettingsMap();
      const baseUrl = normalizeWooBaseUrl(body.woo_url ?? saved.woo_url ?? '');
      const ck = String(body.woo_consumer_key ?? saved.woo_consumer_key ?? '').trim();
      const cs = String(body.woo_consumer_secret ?? saved.woo_consumer_secret ?? '').trim();
      const wpUser = String(body.woo_wp_user ?? saved.woo_wp_user ?? '').trim();
      const wpPass = String(body.woo_wp_app_password ?? saved.woo_wp_app_password ?? '').trim();

      if (!baseUrl || !ck || !cs) {
        sendJson(res, 400, {
          success: false,
          wc_connected: false,
          wp_media_connected: false,
          error: 'Veuillez saisir l’URL du site et les clés Consumer Key / Secret WooCommerce.',
        });
        return;
      }

      const wcCheck = await wooFetch(baseUrl, ck, cs, '/wp-json/wc/v3/products?per_page=1');
      let wpMediaConnected = false;
      let wpMediaMsg = 'Non configuré (les Photos Web s’envoient directement ; les photos locales caméra nécessitent un mot de passe d’application WP).';
      if (wpUser && wpPass) {
        try {
          const wpAuth = Buffer.from(`${wpUser}:${wpPass}`).toString('base64');
          const c = new AbortController();
          const t = setTimeout(() => c.abort(), 12000);
          const wpResp = await fetch(`${baseUrl}/wp-json/wp/v2/users/me`, {
            signal: c.signal,
            headers: { Authorization: `Basic ${wpAuth}`, 'User-Agent': 'ELECTROZEN-POS/1.0' },
          });
          clearTimeout(t);
          if (wpResp.ok) {
            wpMediaConnected = true;
            wpMediaMsg = 'Bibliothèque Médias WordPress prête (upload automatique des photos PC/Android activé).';
          } else {
            wpMediaMsg = `Erreur auth WordPress Médias (HTTP ${wpResp.status}) — vérifiez le Mot de passe d'application.`;
          }
        } catch (err: any) {
          wpMediaMsg = `Médias WP injoignables (${err?.message || 'timeout'})`;
        }
      }

      if (!wcCheck.ok) {
        sendJson(res, 200, {
          success: false,
          store_url: baseUrl,
          wc_connected: false,
          wp_media_connected: wpMediaConnected,
          wp_media_message: wpMediaMsg,
          error: wcCheck.errorMsg,
        });
        return;
      }

      sendJson(res, 200, {
        success: true,
        store_url: baseUrl,
        wc_connected: true,
        wp_media_connected: wpMediaConnected,
        wp_media_message: wpMediaMsg,
        message: `Connexion réussie à ${baseUrl} (API WooCommerce v3 opérationnelle).`,
      });
      return;
    }

    const wooSingleMatch = pathname.match(/^\/api\/woocommerce\/sync-single\/(\d+)$/);
    if (wooSingleMatch && method === 'POST') {
      const id = Number(wooSingleMatch[1]);
      const prod = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Record<string, any> | undefined;
      if (!prod) {
        sendJson(res, 404, { error: 'Article introuvable' });
        return;
      }
      const settings = getSettingsMap();
      const hasRealWoo = Boolean(normalizeWooBaseUrl(settings.woo_url || '') && settings.woo_consumer_key && settings.woo_consumer_secret);
      if (!hasRealWoo) {
        sendJson(res, 400, {
          error: 'Configurez votre Consumer Key & Secret WooCommerce dans Paramètres avant la synchronisation en ligne.',
        });
        return;
      }
      const catCache = new Map<string, number>();
      const resSync = await syncSingleProductToWoo(prod, settings, catCache);
      const updated = attachNormalizedImages(db.prepare('SELECT * FROM products WHERE id = ?').get(id) as Record<string, any>);
      if (!resSync.ok) {
        sendJson(res, 400, { success: false, error: resSync.error, product: updated });
        return;
      }
      db.prepare(`UPDATE woo_sync_queue SET status = 'synced', synced_at = datetime('now') WHERE product_id = ? AND status = 'pending'`).run(id);
      broadcastEvent('WOO_SYNC_COMPLETED', { syncedCount: 1, productId: id });
      sendJson(res, 200, {
        success: true,
        wooId: resSync.wooId,
        localSkippedImages: resSync.localSkippedImages || 0,
        product: updated,
      });
      return;
    }

    if (pathname === '/api/woocommerce/sync' && method === 'POST') {
      const settings = getSettingsMap();
      const pendingProducts = db.prepare(`SELECT * FROM products WHERE woo_sync_status = 'pending'`).all() as Record<string, any>[];
      const baseUrl = normalizeWooBaseUrl(settings.woo_url || '');
      const hasRealWoo = Boolean(baseUrl && settings.woo_consumer_key && settings.woo_consumer_secret);
      const syncedIds: number[] = [];
      const errors: Array<{ id: number; sku: string; name: string; error: string }> = [];
      let localSkippedImagesTotal = 0;

      if (hasRealWoo) {
        const catCache = new Map<string, number>();
        for (const prod of pendingProducts) {
          const r = await syncSingleProductToWoo(prod, settings, catCache);
          localSkippedImagesTotal += r.localSkippedImages || 0;
          if (r.ok) {
            syncedIds.push(Number(prod.id));
            db.prepare(`UPDATE woo_sync_queue SET status = 'synced', synced_at = datetime('now') WHERE product_id = ? AND status = 'pending'`).run(prod.id);
          } else {
            errors.push({
              id: Number(prod.id),
              sku: String(prod.sku || prod.barcode || ''),
              name: String(prod.name_fr || ''),
              error: r.error || 'Erreur WooCommerce',
            });
          }
        }
        broadcastEvent('WOO_SYNC_COMPLETED', { syncedCount: syncedIds.length, failedCount: errors.length });
        sendJson(res, 200, {
          success: errors.length === 0,
          syncedCount: syncedIds.length,
          failedCount: errors.length,
          localSkippedImagesTotal,
          errors,
          mode: 'live_woocommerce',
        });
        return;
      }

      sendJson(res, 400, {
        success: false,
        syncedCount: 0,
        failedCount: pendingProducts.length,
        mode: 'unconfigured',
        error: 'Clés API WooCommerce (Consumer Key / Secret) non configurées. Saisissez vos clés dans Terminaux & WooCommerce puis testez la connexion.',
      });
      return;
    }

    if (pathname === '/api/ai/generate-product' && method === 'POST') {
      const body = await readJsonBody(req);
      const barcode = String(body.barcode || '').trim();
      const brand = String(body.brand || '').trim();
      const modelNumber = String(body.model_number || '').trim();
      const category = String(body.category || 'Électroménager').trim();
      const hintName = String(body.hint_name || '').trim();

      const settings = getSettingsMap();
      const aiProvider = String(body.ai_provider || settings.ai_provider || 'gemini');
      const aiApiKey = String(body.ai_api_key || settings.ai_api_key || '');

      if (aiApiKey) {
        const prompt = `Generate a clean electronics/appliances product catalog sheet for Morocco in strict JSON with keys: brand, model_number, category, name_fr, name_ar, name_en, specs_text, description_fr, description_ar, description_en. Input barcode="${barcode}", brand="${brand}", model="${modelNumber}", category="${category}", hint="${hintName}".`;
        const ai = await callAiProductEnrichment(aiProvider, aiApiKey, prompt);
        if (ai.data) {
          sendJson(res, 200, {
            source: ai.provider,
            brand: ai.data.brand || brand || 'Samsung',
            model_number: ai.data.model_number || modelNumber || barcode || 'PRO-2026',
            category: ai.data.category || category,
            name_fr: ai.data.name_fr || `${category} ${brand} ${modelNumber}`.trim(),
            name_ar: ai.data.name_ar || `${brand} ${modelNumber}`.trim(),
            name_en: ai.data.name_en || `${brand} ${modelNumber} ${category}`.trim(),
            specs_text: ai.data.specs_text || ai.data.description_fr || '',
            description_fr: ai.data.description_fr || ai.data.specs_text || '',
            description_ar: ai.data.description_ar || '',
            description_en: ai.data.description_en || '',
          });
          return;
        }
      }

      const cleanBrand = brand || 'Samsung';
      const cleanModel = modelNumber || barcode || 'PRO-2026';

      sendJson(res, 200, {
        source: 'template',
        name_fr: hintName || `${category} ${cleanBrand} ${cleanModel} Smart Inverter`,
        name_ar: `${cleanBrand} ${cleanModel} جهاز كهرومنزلي سمارت إنفرتر`,
        name_en: `${cleanBrand} ${cleanModel} Smart Inverter ${category}`,
        specs_text: `Appareil ${cleanBrand} réf. ${cleanModel} • Classe énergétique A+++ • Motorisation Inverter • Garantie 24 mois`,
        description_fr: `Appareil ${cleanBrand} réf. ${cleanModel}, classe énergétique A+++, motorisation Inverter silencieuse et garantie officielle 24 mois.`,
        description_ar: `جهاز ${cleanBrand} موديل ${cleanModel} بتقنية الإنفرتر الاقتصادية وضمان رسمي لمدة 24 شهراً.`,
        description_en: `${cleanBrand} ${cleanModel} featuring A+++ Inverter efficiency and 24-month store warranty.`,
      });
      return;
    }

    if (pathname === '/api/ai/scan-invoice' && method === 'POST') {
      const body = await readJsonBody(req);
      const imageBase64 = String(body.imageBase64 || '');
      const mimeType = String(body.mimeType || 'image/jpeg');
      const rawText = String(body.rawText || '');

      if (!imageBase64 && !rawText.trim()) {
        sendJson(res, 400, { error: 'Veuillez fournir une image de facture ou du texte.' });
        return;
      }

      const settings = getSettingsMap();
      const aiProvider = String(body.ai_provider || settings.ai_provider || 'gemini');
      const aiApiKey = String(body.ai_api_key || settings.ai_api_key || '');

      const aiRes = await callAiInvoiceExtraction(aiProvider, aiApiKey, imageBase64, mimeType, rawText);
      if (!aiRes.data) {
        sendJson(res, 400, { error: aiRes.error || 'Impossible d\'extraire la facture.' });
        return;
      }

      const extracted = aiRes.data;
      const provName = String(extracted.provider_name || '').trim();
      const allSuppliers = db.prepare('SELECT id, name, company, phone FROM suppliers').all() as Record<string, any>[];
      let matchedSupplier: Record<string, any> | undefined;
      if (provName) {
        const lowerProv = provName.toLowerCase();
        matchedSupplier = allSuppliers.find(
          (s) =>
            String(s.company || '').toLowerCase().includes(lowerProv) ||
            lowerProv.includes(String(s.company || '').toLowerCase()) ||
            String(s.name || '').toLowerCase().includes(lowerProv)
        );
      }

      const allProducts = db
        .prepare('SELECT id, barcode, sku, model_number, brand, name_fr, current_cost_price, retail_price, wholesale_price FROM products')
        .all() as Record<string, any>[];

      const rawItems = Array.isArray(extracted.items) ? extracted.items : [];
      const matchedItems = rawItems.map((it: any) => {
        const pName = String(it.product_name || '').trim();
        const ref = String(it.sku_or_ref || '').trim().toLowerCase();
        const nameLower = pName.toLowerCase();
        const tokens = nameLower.split(/[\s\-_,/]+/).filter((w) => w.length >= 3);

        let bestMatch: Record<string, any> | undefined;
        let bestScore = 0;
        for (const p of allProducts) {
          let score = 0;
          const pSku = String(p.sku || '').toLowerCase();
          const pMod = String(p.model_number || '').toLowerCase();
          const pBar = String(p.barcode || '').toLowerCase();
          const pFull = String(p.name_fr || '').toLowerCase();

          if (ref && (pSku === ref || pMod === ref || pBar === ref)) score += 100;
          else if (ref && (pFull.includes(ref) || pMod.includes(ref))) score += 45;

          for (const tok of tokens) {
            if (pFull.includes(tok)) score += 10;
            if (pMod && pMod.includes(tok)) score += 12;
          }
          if (score > bestScore) {
            bestScore = score;
            bestMatch = p;
          }
        }

        const matched = bestScore >= 20 ? bestMatch : undefined;
        const unitCost = Number(it.unit_cost) || 0;
        const retailEst = Number(it.suggested_retail_price) || Number(matched?.retail_price || Math.round(unitCost * 1.25));

        return {
          product_name: pName || (matched?.name_fr ?? 'Article Facture'),
          sku_or_ref: String(it.sku_or_ref || matched?.model_number || matched?.sku || ''),
          brand: String(it.brand || matched?.brand || ''),
          quantity: Math.max(1, Number(it.quantity) || 1),
          unit_cost: unitCost,
          suggested_retail_price: retailEst,
          matched_product_id: matched ? Number(matched.id) : null,
          matched_product_name: matched ? String(matched.name_fr) : null,
          current_cost_price: matched ? Number(matched.current_cost_price) : 0,
        };
      });

      sendJson(res, 200, {
        success: true,
        source: aiRes.provider,
        provider_name: provName,
        provider_phone: String(extracted.provider_phone || matchedSupplier?.phone || ''),
        matched_supplier_id: matchedSupplier ? Number(matchedSupplier.id) : null,
        invoice_number: String(extracted.invoice_number || `BL-${Date.now().toString().slice(-6)}`),
        invoice_date: String(extracted.invoice_date || new Date().toISOString().slice(0, 10)),
        total_amount: Number(extracted.total_amount) || matchedItems.reduce((s: number, i: any) => s + i.quantity * i.unit_cost, 0),
        items: matchedItems,
      });
      return;
    }

    if (pathname === '/api/products/upload-image' && method === 'POST') {
      const body = await readJsonBody(req);
      const rawB64 = String(body.imageBase64 || '').trim();
      const mimeType = String(body.mimeType || 'image/jpeg').toLowerCase();
      if (!rawB64) {
        sendJson(res, 400, { error: 'Image base64 manquante' });
        return;
      }
      const cleanB64 = rawB64.replace(/^data:[^;]+;base64,/, '');
      const ext = mimeType.includes('png') ? '.png' : mimeType.includes('webp') ? '.webp' : '.jpg';
      const uploadDir = path.join(publicDir, 'uploads', 'products');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const fileName = `prod-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}${ext}`;
      const fullPath = path.join(uploadDir, fileName);
      fs.writeFileSync(fullPath, Buffer.from(cleanB64, 'base64'));
      const imageUrl = `/uploads/products/${fileName}`;
      sendJson(res, 200, { success: true, image_url: imageUrl });
      return;
    }

    if (pathname === '/api/ai/extract-product-from-images' && method === 'POST') {
      const body = await readJsonBody(req);
      const images = Array.isArray(body.images) ? body.images : [];
      const hintName = String(body.hintName || '').trim();
      const settings = getSettingsMap();
      const aiProvider = String(body.ai_provider || settings.ai_provider || 'gemini');
      const aiApiKey = String(body.ai_api_key || settings.ai_api_key || '');

      const aiRes = await callAiVisionProductExtraction(aiProvider, aiApiKey, images, hintName);
      if (!aiRes.data) {
        sendJson(res, 400, { error: aiRes.error || 'Impossible d\'extraire les informations depuis ces photos.' });
        return;
      }
      sendJson(res, 200, {
        success: true,
        source: aiRes.provider,
        brand: String(aiRes.data.brand || ''),
        model_number: String(aiRes.data.model_number || ''),
        barcode: String(aiRes.data.barcode || ''),
        category: String(aiRes.data.category || 'Petit Électroménager'),
        name_fr: String(aiRes.data.name_fr || ''),
        name_ar: String(aiRes.data.name_ar || ''),
        name_en: String(aiRes.data.name_en || ''),
        specs_text: String(aiRes.data.specs_text || ''),
        description_fr: String(aiRes.data.description_fr || aiRes.data.specs_text || ''),
        description_ar: String(aiRes.data.description_ar || ''),
        description_en: String(aiRes.data.description_en || ''),
        warranty_months: Number(aiRes.data.warranty_months) || 12,
      });
      return;
    }

    if (pathname === '/api/ai/enhance-product' && method === 'POST') {
      const body = await readJsonBody(req);
      const nameFr = String(body.name_fr || '').trim();
      const nameAr = String(body.name_ar || '').trim();
      const brand = String(body.brand || '').trim();
      const modelNumber = String(body.model_number || '').trim();
      const category = String(body.category || 'Électroménager').trim();
      const specsText = String(body.specs_text || body.description_fr || '').trim();

      const settings = getSettingsMap();
      const aiProvider = String(body.ai_provider || settings.ai_provider || 'gemini');
      const aiApiKey = String(body.ai_api_key || settings.ai_api_key || '');

      const enhancePrompt = `You are a senior e-commerce & electronics copywriter for ELECTROZEN Morocco.
Take these extracted/raw product features and ENHANCE them into polished, compelling, well-structured commercial titles, bullet-point specifications, and detailed customer-friendly descriptions in French, Arabic, and English.
Input data:
- Brand: "${brand}"
- Model: "${modelNumber}"
- Category: "${category}"
- Current French Name: "${nameFr}"
- Current Arabic Name: "${nameAr}"
- Extracted Features / Description: "${specsText}"

Return ONLY strict valid JSON with keys:
- "brand": polished brand
- "model_number": exact model
- "category": best matching category
- "name_fr": punchy, SEO-friendly French product title (with capacity/power/highlights)
- "name_ar": punchy, natural Moroccan/Modern Standard Arabic product title
- "name_en": punchy English product title
- "specs_text": clean, structured technical highlights separated by ' • ' (include key benefits + included accessories if mentioned)
- "description_fr": rich, persuasive 3-4 sentence French commercial description highlighting benefits, durability, usage, and warranty
- "description_ar": rich, persuasive 3-4 sentence Arabic commercial description
- "description_en": rich English description`;

      if (aiApiKey) {
        const ai = await callAiProductEnrichment(aiProvider, aiApiKey, enhancePrompt);
        if (ai.data) {
          sendJson(res, 200, {
            success: true,
            source: ai.provider,
            brand: ai.data.brand || brand,
            model_number: ai.data.model_number || modelNumber,
            category: ai.data.category || category,
            name_fr: ai.data.name_fr || nameFr,
            name_ar: ai.data.name_ar || nameAr,
            name_en: ai.data.name_en || nameFr,
            specs_text: ai.data.specs_text || specsText,
            description_fr: ai.data.description_fr || specsText,
            description_ar: ai.data.description_ar || '',
            description_en: ai.data.description_en || '',
          });
          return;
        }
        sendJson(res, 400, { error: ai.error || 'Échec amélioration IA' });
        return;
      }

      sendJson(res, 400, { error: 'Veuillez configurer une clé API IA dans Paramètres.' });
      return;
    }

    if (pathname === '/api/ai/generate-pro-product-photo' && method === 'POST') {
      const body = await readJsonBody(req);
      let images: Array<{ imageBase64: string; mimeType?: string }> = Array.isArray(body.images) ? body.images : [];
      const imageUrl = String(body.image_url || '').trim();
      if (images.length === 0 && imageUrl.startsWith('/uploads/')) {
        const localFile = path.join(publicDir, imageUrl.replace(/^\/+/, ''));
        if (localFile.startsWith(publicDir) && fs.existsSync(localFile)) {
          const ext = path.extname(localFile).toLowerCase();
          const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
          images = [{ imageBase64: fs.readFileSync(localFile).toString('base64'), mimeType: mime }];
        }
      } else if (images.length === 0 && /^https?:\/\//i.test(imageUrl)) {
        try {
          const r = await fetch(imageUrl, { headers: { 'User-Agent': 'ELECTROZEN-POS/1.0' } });
          if (r.ok) {
            const cType = String(r.headers.get('content-type') || 'image/jpeg').split(';')[0];
            const b = Buffer.from(await r.arrayBuffer());
            if (b.length > 500) images = [{ imageBase64: b.toString('base64'), mimeType: cType }];
          }
        } catch {}
      }

      const settings = getSettingsMap();
      const aiProvider = String(body.ai_provider || settings.ai_provider || 'gemini');
      const aiApiKey = String(body.ai_api_key || settings.ai_api_key || '');
      const uploadDir = path.join(publicDir, 'uploads', 'products');
      const mode = String(body.mode || 'clean_crop');

      const result = await callGenerateProProductPhoto(
        aiProvider,
        aiApiKey,
        images,
        uploadDir,
        String(body.product_name || ''),
        String(body.brand || ''),
        mode
      );
      if (!result.imageUrl) {
        sendJson(res, 400, { error: result.error || 'Échec de génération de la photo studio.' });
        return;
      }
      sendJson(res, 200, {
        success: true,
        image_url: result.imageUrl,
        method: result.method,
        best_index: result.best_index,
        box_2d: result.box_2d,
      });
      return;
    }

    // ========================================================================
    // 7B. USERS, PIN ROLES, CASH REGISTER SESSIONS (X/Z) & AUDIT LOG
    // ========================================================================
    if (pathname === '/api/users' && method === 'GET') {
      const users = db.prepare('SELECT id, username, full_name, role, active, created_at FROM users WHERE active = 1 ORDER BY id ASC').all();
      sendJson(res, 200, users);
      return;
    }

    if (pathname === '/api/auth/pin' && method === 'POST') {
      const { userId, pin } = await readJsonBody(req);
      const user = db.prepare('SELECT * FROM users WHERE id = ? AND active = 1').get(Number(userId)) as Record<string, any> | undefined;
      if (!user || user.pin_hash !== hashPin(String(pin || ''))) {
        sendJson(res, 401, { error: 'Code PIN incorrect' });
        return;
      }
      logAudit(user.full_name, user.role, 'USER_LOGIN', 'user', user.id, { username: user.username });
      sendJson(res, 200, {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
      });
      return;
    }

    if (pathname === '/api/cash-session' && method === 'GET') {
      const openSession = db.prepare("SELECT * FROM cash_sessions WHERE status = 'open' ORDER BY id DESC LIMIT 1").get() as Record<string, any> | undefined;
      let cashSalesToday = 0;
      let cardSalesToday = 0;
      let cashExpensesToday = 0;

      if (openSession) {
        const sRow = db.prepare(`
          SELECT
            COALESCE(SUM(CASE WHEN payment_method = 'cash' THEN paid_amount ELSE 0 END), 0) as cashIn,
            COALESCE(SUM(CASE WHEN payment_method != 'cash' THEN paid_amount ELSE 0 END), 0) as nonCashIn
          FROM sales
          WHERE created_at >= ?
        `).get(openSession.opened_at) as { cashIn: number; nonCashIn: number };
        const eRow = db.prepare(`
          SELECT COALESCE(SUM(amount), 0) as cashOut
          FROM expenses
          WHERE payment_method = 'cash' AND created_at >= ?
        `).get(openSession.opened_at) as { cashOut: number };

        cashSalesToday = sRow?.cashIn || 0;
        cardSalesToday = sRow?.nonCashIn || 0;
        cashExpensesToday = eRow?.cashOut || 0;
      }

      const history = db.prepare("SELECT * FROM cash_sessions WHERE status = 'closed' ORDER BY id DESC LIMIT 15").all();
      sendJson(res, 200, {
        openSession: openSession
          ? {
              ...openSession,
              cashSalesToday,
              cardSalesToday,
              cashExpensesToday,
              expected_cash: Number(openSession.opening_float) + cashSalesToday - cashExpensesToday,
            }
          : null,
        history,
      });
      return;
    }

    if (pathname === '/api/cash-session/open' && method === 'POST') {
      const { opening_float = 0, opened_by = 'Admin ELECTROZEN' } = await readJsonBody(req);
      const existing = db.prepare("SELECT id FROM cash_sessions WHERE status = 'open'").get();
      if (existing) {
        sendJson(res, 400, { error: 'Une session de caisse est déjà ouverte' });
        return;
      }
      const resInsert = db.prepare(`
        INSERT INTO cash_sessions (opened_by, opening_float, expected_cash, status)
        VALUES (?, ?, ?, 'open')
      `).run(opened_by, Number(opening_float) || 0, Number(opening_float) || 0);
      logAudit(opened_by, 'admin', 'CASH_OPEN', 'cash_session', Number(resInsert.lastInsertRowid), { opening_float });
      sendJson(res, 200, { success: true, id: Number(resInsert.lastInsertRowid) });
      return;
    }

    if (pathname === '/api/cash-session/close' && method === 'POST') {
      const { counted_cash = 0, closed_by = 'Admin ELECTROZEN', notes = '' } = await readJsonBody(req);
      const openSession = db.prepare("SELECT * FROM cash_sessions WHERE status = 'open' ORDER BY id DESC LIMIT 1").get() as Record<string, any> | undefined;
      if (!openSession) {
        sendJson(res, 400, { error: 'Aucune session ouverte à clôturer' });
        return;
      }
      const sRow = db.prepare(`
        SELECT COALESCE(SUM(CASE WHEN payment_method = 'cash' THEN paid_amount ELSE 0 END), 0) as cashIn
        FROM sales WHERE created_at >= ?
      `).get(openSession.opened_at) as { cashIn: number };
      const eRow = db.prepare(`
        SELECT COALESCE(SUM(amount), 0) as cashOut
        FROM expenses WHERE payment_method = 'cash' AND created_at >= ?
      `).get(openSession.opened_at) as { cashOut: number };

      const expected = Number(openSession.opening_float) + (sRow?.cashIn || 0) - (eRow?.cashOut || 0);
      const counted = Number(counted_cash) || 0;
      const diff = Math.round((counted - expected) * 100) / 100;

      db.prepare(`
        UPDATE cash_sessions SET
          closed_by = ?,
          expected_cash = ?,
          counted_cash = ?,
          difference = ?,
          notes = ?,
          status = 'closed',
          closed_at = datetime('now')
        WHERE id = ?
      `).run(closed_by, expected, counted, diff, notes, openSession.id);

      logAudit(closed_by, 'admin', 'CASH_CLOSE_Z', 'cash_session', openSession.id, { expected, counted, diff });
      sendJson(res, 200, { success: true, expected_cash: expected, counted_cash: counted, difference: diff });
      return;
    }

    if (pathname === '/api/audit-log' && method === 'GET') {
      const logs = db.prepare('SELECT * FROM audit_log ORDER BY id DESC LIMIT 100').all();
      sendJson(res, 200, logs, req);
      return;
    }

    if (pathname === '/api/backups' && method === 'GET') {
      if (!isLocalRequest(req)) {
        sendJson(res, 403, { error: 'Localhost only' });
        return;
      }
      sendJson(res, 200, listBackups());
      return;
    }

    if (pathname === '/api/backups/now' && method === 'POST') {
      if (!isLocalRequest(req)) {
        sendJson(res, 403, { error: 'Localhost only' });
        return;
      }
      runDailyBackupIfNeeded();
      sendJson(res, 200, { success: true, backups: listBackups() });
      return;
    }

    if (pathname === '/api/setup/reset-demo' && method === 'POST') {
      if (!isLocalRequest(req)) {
        sendJson(res, 403, { error: 'Localhost only' });
        return;
      }
      const cfg = await readJsonBody(req);
      resetStoreForProduction(cfg);
      logAudit('Admin', 'admin', 'STORE_INITIALIZED_CLEAN', 'system', '', { store_name: cfg.store_name || 'ELECTROZEN' });
      broadcastEvent('STORE_RESET', {});
      sendJson(res, 200, { success: true });
      return;
    }

    if (pathname === '/api/import/products' && method === 'POST') {
      if (!isLocalRequest(req)) {
        sendJson(res, 403, { error: 'Localhost only' });
        return;
      }
      const body = await readJsonBody(req);
      const rows = Array.isArray(body.rows) ? body.rows : [];
      if (rows.length === 0) {
        sendJson(res, 400, { error: 'No product rows provided' });
        return;
      }
      let imported = 0;
      withTransaction(() => {
        const stmt = db.prepare(`
          INSERT INTO products (
            barcode, sku, model_number, brand, category,
            name_fr, name_ar, name_en,
            current_cost_price, last_cost_price, wholesale_price, min_selling_price, retail_price,
            stock_quantity, warranty_months, woo_sync_status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
          ON CONFLICT(barcode) DO UPDATE SET
            name_fr = excluded.name_fr,
            current_cost_price = excluded.current_cost_price,
            wholesale_price = excluded.wholesale_price,
            retail_price = excluded.retail_price,
            stock_quantity = excluded.stock_quantity,
            updated_at = datetime('now')
        `);
        for (const r of rows) {
          const barcode = String(r.barcode || '').trim();
          const name = String(r.name_fr || r.name || '').trim();
          if (!barcode || !name) continue;
          const cost = Number(r.current_cost_price ?? r.cost ?? 0) || 0;
          const retail = Number(r.retail_price ?? r.retail ?? 0) || 0;
          const wholesale = Number(r.wholesale_price ?? r.wholesale ?? retail) || retail;
          stmt.run(
            barcode,
            String(r.sku || barcode).trim(),
            String(r.model_number || r.model || '').trim(),
            String(r.brand || 'Générique').trim(),
            String(r.category || 'Gros Électroménager').trim(),
            name,
            String(r.name_ar || name).trim(),
            String(r.name_en || name).trim(),
            cost,
            cost,
            wholesale,
            wholesale,
            retail,
            Number(r.stock_quantity ?? r.stock ?? 0) || 0,
            Number(r.warranty_months ?? 12) || 12
          );
          imported++;
        }
      });
      logAudit('Admin', 'admin', 'CSV_IMPORT', 'products', imported, { imported });
      broadcastEvent('CATALOG_IMPORTED', { imported });
      sendJson(res, 200, { success: true, imported });
      return;
    }

    // ========================================================================
    // 7B. QUOTATIONS (DEVIS), SERVICE/SAV JOBS, STOCK ADJUSTMENTS & P&L REPORT
    // ========================================================================
    if (pathname === '/api/quotations' && method === 'GET') {
      const rows = db.prepare('SELECT * FROM quotations ORDER BY id DESC LIMIT 100').all() as Record<string, any>[];
      sendJson(res, 200, rows.map((r) => ({ ...r, items: JSON.parse(r.items_json || '[]') })), req);
      return;
    }

    if (pathname === '/api/quotations' && method === 'POST') {
      const body = await readJsonBody(req);
      const items = Array.isArray(body.items) ? body.items : [];
      if (items.length === 0) {
        sendJson(res, 400, { error: 'Le devis est vide' });
        return;
      }
      const subtotal = items.reduce((s: number, i: any) => s + (Number(i.unit_price) || 0) * (Number(i.quantity) || 1), 0);
      const discount = Math.max(0, Number(body.discount) || 0);
      const totalAmount = Math.max(0, subtotal - discount);
      let custName = String(body.customer_name || 'Client Comptoir').trim();
      if (body.customer_id && !body.customer_name) {
        const cust = db.prepare('SELECT name FROM customers WHERE id = ?').get(Number(body.customer_id)) as { name: string } | undefined;
        if (cust?.name) custName = cust.name;
      }
      const quoteNumber = getNextInvoiceNumber('DEV');
      const validDays = Number(body.valid_days) || 15;
      const validDate = new Date();
      validDate.setDate(validDate.getDate() + validDays);
      const resInsert = db.prepare(`
        INSERT INTO quotations (quote_number, customer_id, customer_name, price_tier, subtotal, discount, total_amount, valid_until, notes, items_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        quoteNumber,
        body.customer_id ? Number(body.customer_id) : null,
        custName,
        body.price_tier || 'retail',
        subtotal,
        discount,
        totalAmount,
        body.valid_until || validDate.toISOString().slice(0, 10),
        String(body.notes || ''),
        JSON.stringify(items)
      );
      logAudit('Système', 'admin', 'QUOTATION_CREATED', 'quotation', Number(resInsert.lastInsertRowid), { quoteNumber, totalAmount });
      broadcastEvent('QUOTATION_CREATED', { quoteNumber });
      sendJson(res, 200, db.prepare('SELECT * FROM quotations WHERE id = ?').get(Number(resInsert.lastInsertRowid)));
      return;
    }

    const quoteConvertMatch = pathname.match(/^\/api\/quotations\/(\d+)\/convert$/);
    if (quoteConvertMatch && method === 'POST') {
      const id = Number(quoteConvertMatch[1]);
      const q = db.prepare('SELECT * FROM quotations WHERE id = ?').get(id) as Record<string, any> | undefined;
      if (!q) {
        sendJson(res, 404, { error: 'Devis introuvable' });
        return;
      }
      if (q.status === 'converted') {
        sendJson(res, 400, { error: 'Ce devis a déjà été converti en facture' });
        return;
      }
      const body = await readJsonBody(req);
      let fullSale: Record<string, any>;
      try {
        const quoteItems = JSON.parse(q.items_json || '[]');
        fullSale = executeAtomicSale({
          customer_id: q.customer_id,
          customer_name: q.customer_name,
          price_tier: q.price_tier,
          discount: q.discount,
          paid_amount: body.paid_amount,
          payment_method: body.payment_method || 'cash',
          notes: `Conversion ${q.quote_number}`,
          items: quoteItems,
        });
        db.prepare("UPDATE quotations SET status = 'converted', converted_sale_id = ? WHERE id = ?").run(fullSale.id, id);
      } catch (err: any) {
        sendJson(res, 400, { error: err?.message || 'Conversion échouée' });
        return;
      }
      broadcastEvent('SALE_COMPLETED', fullSale);
      sendJson(res, 200, fullSale);
      return;
    }

    const quoteIdMatch = pathname.match(/^\/api\/quotations\/(\d+)$/);
    if (quoteIdMatch && method === 'DELETE') {
      db.prepare('DELETE FROM quotations WHERE id = ?').run(Number(quoteIdMatch[1]));
      sendJson(res, 200, { success: true });
      return;
    }

    if (pathname === '/api/service-jobs' && method === 'GET') {
      sendJson(res, 200, db.prepare('SELECT * FROM service_jobs ORDER BY id DESC LIMIT 100').all(), req);
      return;
    }

    if (pathname === '/api/service-jobs' && method === 'POST') {
      const body = await readJsonBody(req);
      const custName = String(body.customer_name || '').trim();
      const deviceName = String(body.device_name || '').trim();
      if (!custName || !deviceName) {
        sendJson(res, 400, { error: 'Client et appareil requis' });
        return;
      }
      const partsCost = Math.max(0, Number(body.parts_cost) || 0);
      const laborPrice = Math.max(0, Number(body.labor_price) || 0);
      const totalPrice = Number(body.total_price ?? partsCost + laborPrice) || 0;
      const paidAmount = Math.max(0, Number(body.paid_amount) || 0);
      const ticketNumber = getNextInvoiceNumber('SAV');
      const resInsert = db.prepare(`
        INSERT INTO service_jobs (
          ticket_number, customer_id, customer_name, customer_phone,
          device_name, serial_number, issue_description, technician,
          parts_cost, labor_price, total_price, paid_amount, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        ticketNumber,
        body.customer_id ? Number(body.customer_id) : null,
        custName,
        String(body.customer_phone || ''),
        deviceName,
        String(body.serial_number || ''),
        String(body.issue_description || ''),
        String(body.technician || 'Atelier ELECTROZEN'),
        partsCost,
        laborPrice,
        totalPrice,
        paidAmount,
        String(body.status || 'pending')
      );
      logAudit('Atelier SAV', 'admin', 'SAV_CREATED', 'service_job', Number(resInsert.lastInsertRowid), { ticketNumber, deviceName });
      broadcastEvent('SERVICE_JOB_UPDATED', { ticketNumber });
      sendJson(res, 200, db.prepare('SELECT * FROM service_jobs WHERE id = ?').get(Number(resInsert.lastInsertRowid)));
      return;
    }

    const svcMatch = pathname.match(/^\/api\/service-jobs\/(\d+)$/);
    if (svcMatch && method === 'PUT') {
      const id = Number(svcMatch[1]);
      const existing = db.prepare('SELECT * FROM service_jobs WHERE id = ?').get(id) as Record<string, any> | undefined;
      if (!existing) {
        sendJson(res, 404, { error: 'Ticket SAV introuvable' });
        return;
      }
      const body = await readJsonBody(req);
      const partsCost = body.parts_cost !== undefined ? Number(body.parts_cost) : Number(existing.parts_cost);
      const laborPrice = body.labor_price !== undefined ? Number(body.labor_price) : Number(existing.labor_price);
      const totalPrice = body.total_price !== undefined ? Number(body.total_price) : partsCost + laborPrice;
      const paidAmount = body.paid_amount !== undefined ? Number(body.paid_amount) : Number(existing.paid_amount);
      db.prepare(`
        UPDATE service_jobs SET
          status = ?,
          diagnosis_notes = ?,
          parts_cost = ?,
          labor_price = ?,
          total_price = ?,
          paid_amount = ?,
          updated_at = datetime('now')
        WHERE id = ?
      `).run(
        String(body.status || existing.status),
        String(body.diagnosis_notes ?? existing.diagnosis_notes ?? ''),
        partsCost,
        laborPrice,
        totalPrice,
        paidAmount,
        id
      );
      broadcastEvent('SERVICE_JOB_UPDATED', { id });
      sendJson(res, 200, db.prepare('SELECT * FROM service_jobs WHERE id = ?').get(id));
      return;
    }

    if (pathname === '/api/stock-adjustments' && method === 'GET') {
      sendJson(res, 200, db.prepare('SELECT * FROM stock_adjustments ORDER BY id DESC LIMIT 100').all(), req);
      return;
    }

    if (pathname === '/api/stock-adjustments' && method === 'POST') {
      const body = await readJsonBody(req);
      const productId = Number(body.product_id);
      const adjType = body.adj_type === 'add' ? 'add' : body.adj_type === 'damage' ? 'damage' : 'sub';
      const qty = Math.abs(Math.floor(Number(body.quantity) || 0));
      if (!productId || qty <= 0) {
        sendJson(res, 400, { error: 'Produit et quantité positive requis' });
        return;
      }
      const result = withTransaction(() => {
        const prod = db.prepare('SELECT * FROM products WHERE id = ?').get(productId) as Record<string, any> | undefined;
        if (!prod) throw new Error('Produit introuvable');
        const before = Number(prod.stock_quantity);
        const delta = adjType === 'add' ? qty : -qty;
        const after = Math.max(0, before + delta);
        const adjNumber = getNextInvoiceNumber('ADJ');
        db.prepare(`
          UPDATE products SET stock_quantity = ?, woo_sync_status = 'pending', updated_at = datetime('now') WHERE id = ?
        `).run(after, productId);
        const ins = db.prepare(`
          INSERT INTO stock_adjustments (adj_number, product_id, product_name, adj_type, quantity_delta, unit_cost, stock_before, stock_after, reason, user_name)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(adjNumber, productId, prod.name_fr, adjType, delta, Number(prod.current_cost_price) || 0, before, after, String(body.reason || ''), String(body.user_name || 'Admin'));
        queueWooSync(productId, 'update_stock', { productId, stock_quantity: after });
        return db.prepare('SELECT * FROM stock_adjustments WHERE id = ?').get(Number(ins.lastInsertRowid));
      });
      logAudit(String(body.user_name || 'Admin'), 'admin', 'STOCK_ADJUSTED', 'product', productId, result);
      broadcastEvent('STOCK_ADJUSTED', result);
      sendJson(res, 200, result);
      return;
    }

    if (pathname === '/api/reports/profit-loss' && method === 'GET') {
      const range = parsedUrl.searchParams.get('range') || '30d';
      const bounds = getDateRangeBounds(
        range,
        parsedUrl.searchParams.get('start') || '',
        parsedUrl.searchParams.get('end') || ''
      );
      const startDt = `${bounds.start} 00:00:00`;
      const endDt = `${bounds.end} 23:59:59`;

      const salesAgg = db.prepare(`
        SELECT
          COUNT(*) as invoicesCount,
          COALESCE(SUM(subtotal), 0) as grossSales,
          COALESCE(SUM(discount), 0) as totalDiscounts,
          COALESCE(SUM(total_amount), 0) as netSales,
          COALESCE(SUM(total_cost), 0) as cogs,
          COALESCE(SUM(paid_amount), 0) as cashInSales,
          COALESCE(SUM(remaining_debt), 0) as salesDue
        FROM sales
        WHERE COALESCE(status, 'completed') != 'canceled'
          AND datetime(created_at) BETWEEN datetime(?) AND datetime(?)
      `).get(startDt, endDt) as Record<string, number>;

      const serviceAgg = db.prepare(`
        SELECT
          COUNT(*) as jobsCount,
          COALESCE(SUM(paid_amount), 0) as serviceRevenue,
          COALESCE(SUM(parts_cost), 0) as servicePartsCost
        FROM service_jobs
        WHERE datetime(created_at) BETWEEN datetime(?) AND datetime(?)
      `).get(startDt, endDt) as Record<string, number>;

      const dmgAgg = db.prepare(`
        SELECT COALESCE(SUM(ABS(quantity_delta) * unit_cost), 0) as damageCost
        FROM stock_adjustments
        WHERE adj_type = 'damage'
          AND datetime(created_at) BETWEEN datetime(?) AND datetime(?)
      `).get(startDt, endDt) as { damageCost: number };

      const expAgg = db.prepare(`
        SELECT COALESCE(SUM(amount), 0) as totalExpenses
        FROM expenses
        WHERE date(expense_date) BETWEEN date(?) AND date(?)
      `).get(bounds.start, bounds.end) as { totalExpenses: number };

      const purAgg = db.prepare(`
        SELECT COALESCE(SUM(total_amount), 0) as totalPurchases, COALESCE(SUM(paid_amount), 0) as cashOutPurchases
        FROM purchases
        WHERE datetime(created_at) BETWEEN datetime(?) AND datetime(?)
      `).get(startDt, endDt) as Record<string, number>;

      const expByCategory = db.prepare(`
        SELECT category, COALESCE(SUM(amount), 0) as total
        FROM expenses
        WHERE date(expense_date) BETWEEN date(?) AND date(?)
        GROUP BY category
        ORDER BY total DESC
      `).all(bounds.start, bounds.end);

      const grossProfit = (salesAgg.netSales || 0) - (salesAgg.cogs || 0);
      const serviceProfit = (serviceAgg.serviceRevenue || 0) - (serviceAgg.servicePartsCost || 0);
      const netProfit = grossProfit + serviceProfit - (expAgg.totalExpenses || 0) - (dmgAgg.damageCost || 0);

      sendJson(res, 200, {
        range,
        bounds,
        salesAgg,
        serviceAgg,
        damageCost: dmgAgg.damageCost || 0,
        totalExpenses: expAgg.totalExpenses || 0,
        totalPurchases: purAgg.totalPurchases || 0,
        cashOutPurchases: purAgg.cashOutPurchases || 0,
        expByCategory,
        grossProfit,
        serviceProfit,
        netProfit,
      }, req);
      return;
    }

    // ========================================================================
    // 8. STATIC FRONTEND SERVING
    // ========================================================================
    const safePath = pathname === '/' ? '/index.html' : pathname === '/mobile' ? '/mobile.html' : pathname;
    const filePath = path.join(publicDir, safePath);
    if (filePath.startsWith(publicDir) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes: Record<string, string> = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.ico': 'image/x-icon',
      };
      const headers: Record<string, string> = {
        'Content-Type': mimeTypes[ext] || 'text/plain; charset=utf-8',
      };
      if (safePath.startsWith('/uploads/') || safePath.startsWith('/assets/')) {
        headers['Cache-Control'] = 'public, max-age=31536000';
      }
      const isTextAsset = ['.html', '.js', '.css', '.json', '.svg'].includes(ext);
      const acceptGzip = String(req.headers['accept-encoding'] || '').includes('gzip');
      if (isTextAsset && acceptGzip) {
        const rawBuf = fs.readFileSync(filePath);
        const gz = zlib.gzipSync(rawBuf);
        headers['Content-Encoding'] = 'gzip';
        headers['Content-Length'] = String(gz.length);
        res.writeHead(200, headers);
        res.end(gz);
        return;
      }
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    sendJson(res, 404, { error: 'Not found' });
  } catch (err: any) {
    sendJson(res, 500, { error: err?.message || 'Internal Server Error' });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  const ips = getLocalLanIps();
  console.log(`ELECTROZEN Local Server running on:`);
  console.log(`   - Windows App: http://localhost:${PORT}`);
  for (const ip of ips) {
    console.log(`   - Android Wi-Fi API: http://${ip}:${PORT}`);
  }
});
