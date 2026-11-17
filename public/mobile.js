const isFileProtocol = window.location.protocol === 'file:';
const defaultApiBase = isFileProtocol
  ? localStorage.getItem('ez_mob_api_base') || 'http://192.168.100.38:4000'
  : localStorage.getItem('ez_mob_api_base') || '';

const MOB_ICONS = {
  scan: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="8" x2="7" y2="16"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="17" y1="8" x2="17" y2="16"/></svg>`,
  box: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  pos: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/></svg>`,
  wifi: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
};

const mobState = {
  tab: 'scanner',
  theme: localStorage.getItem('ez_mob_theme_v2') || 'light',
  lang: 'fr',
  apiBase: defaultApiBase,
  hideCosts: true,
  cameraOpen: false,
  barcodeQuery: '',
  scannedProduct: null,
  notFoundCode: null,
  products: [],
  customers: [],
  catalogSearch: '',
  showProductForm: false,
  editingProduct: null,
  posTier: 'retail',
  posCart: [],
  posCustomerId: '',
  posPaymentMethod: 'cash',
  posPaidAmount: '',
  posInstallments: 3,
  networkInfo: null,
  pairingToken: localStorage.getItem('ez_mob_pair_token') || 'ELECTROZEN-POS-2026',
  bearerToken: localStorage.getItem('ez_mob_bearer') || '',
  deviceName: localStorage.getItem('ez_mob_device') || 'ELECTROZEN-Android-APK',
  toast: null,
};

let mediaStream = null;
let scanInterval = null;

function apiUrl(path) {
  const base = (mobState.apiBase || '').replace(/\/+$/, '');
  return base + path;
}

function apiFetch(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (mobState.bearerToken) {
    headers['Authorization'] = `Bearer ${mobState.bearerToken}`;
  }
  return fetch(apiUrl(path), { ...options, headers });
}

function imgUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return apiUrl(path);
}

function fmtMad(val) {
  const num = Number(val || 0);
  return (
    num.toLocaleString('fr-MA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + ' MAD'
  );
}

function showMobToast(msg) {
  mobState.toast = msg;
  renderMobile();
  setTimeout(() => {
    mobState.toast = null;
    renderMobile();
  }, 2800);
}

async function initMobile() {
  document.documentElement.setAttribute('data-theme', mobState.theme);
  try {
    const netRes = await apiFetch('/api/network-info').then((r) => r.json());
    mobState.networkInfo = netRes;
    const pairToken = netRes.pairingToken || mobState.pairingToken || 'ELECTROZEN-POS-2026';
    const pairRes = await fetch(apiUrl('/api/android/pair'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: 'ez-mob-' + mobState.deviceName.replace(/\s+/g, '-').toLowerCase(),
        deviceName: mobState.deviceName,
        token: pairToken,
      }),
    }).then((r) => r.json());
    if (pairRes?.accessToken) {
      mobState.bearerToken = pairRes.accessToken;
      localStorage.setItem('ez_mob_bearer', pairRes.accessToken);
    }

    const [prodRes, custRes] = await Promise.all([
      apiFetch('/api/products').then((r) => r.json()),
      apiFetch('/api/customers').then((r) => r.json()),
    ]);
    mobState.products = Array.isArray(prodRes) ? prodRes : [];
    mobState.customers = Array.isArray(custRes) ? custRes : [];
    const defaultProd = mobState.products.find((x) => x.image_url && x.retail_price > 2000) || mobState.products[0];
    if (defaultProd && !mobState.barcodeQuery) {
      mobState.barcodeQuery = defaultProd.barcode;
    }
    if (mobState.barcodeQuery) {
      await lookupBarcode(mobState.barcodeQuery);
    }
  } catch (e) {
    console.error(e);
  }
  renderMobile();
}

async function lookupBarcode(code) {
  const clean = String(code || '').trim();
  if (!clean) return;
  mobState.barcodeQuery = clean;
  mobState.notFoundCode = null;
  try {
    const res = await apiFetch('/api/products/barcode/' + encodeURIComponent(clean));
    if (res.status === 404) {
      mobState.scannedProduct = null;
      mobState.notFoundCode = clean;
    } else if (res.ok) {
      mobState.scannedProduct = await res.json();
    }
  } catch (e) {
    showMobToast('Erreur réseau Wi-Fi — Vérifiez IP dans l\'onglet Wi-Fi');
  }
  renderMobile();
}

async function startCameraScanner(onDetectedCallback) {
  stopCameraScanner();
  mobState.cameraOpen = true;
  renderMobile();
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    });
    const videoEl = document.getElementById('mob-camera-video');
    if (videoEl) {
      videoEl.srcObject = mediaStream;
      await videoEl.play();
    }
    if ('BarcodeDetector' in window) {
      const detector = new window.BarcodeDetector({
        formats: ['ean_13', 'ean_8', 'code_128', 'upc_a', 'qr_code'],
      });
      scanInterval = setInterval(async () => {
        if (!videoEl || videoEl.readyState < 2) return;
        try {
          const codes = await detector.detect(videoEl);
          if (codes && codes.length > 0 && codes[0].rawValue) {
            const raw = codes[0].rawValue;
            stopCameraScanner();
            onDetectedCallback(raw);
          }
        } catch {}
      }, 300);
    }
  } catch (err) {
    showMobToast('Autorisez la caméra ou utilisez la recherche rapide EAN/Modèle');
    mobState.cameraOpen = false;
    renderMobile();
  }
}

function stopCameraScanner() {
  if (scanInterval) {
    clearInterval(scanInterval);
    scanInterval = null;
  }
  if (mediaStream) {
    mediaStream.getTracks().forEach((t) => t.stop());
    mediaStream = null;
  }
  mobState.cameraOpen = false;
}

function addToMobilePos(prod) {
  if (!prod || prod.stock_quantity <= 0) {
    showMobToast('Stock épuisé');
    return;
  }
  const existing = mobState.posCart.find((i) => i.product.id === prod.id);
  const price = mobState.posTier === 'wholesale' ? Number(prod.wholesale_price) : Number(prod.retail_price);
  if (existing) {
    existing.quantity += 1;
  } else {
    const firstSerial =
      prod.available_serials && prod.available_serials.length > 0
        ? prod.available_serials[0].serial_number || prod.available_serials[0]
        : '';
    mobState.posCart.push({
      product: prod,
      quantity: 1,
      unitPrice: price,
      serialNumber: firstSerial,
    });
  }
  mobState.tab = 'pos';
  showMobToast('Ajouté au Panier POS Mobile');
}

function renderScannerTab() {
  const p = mobState.scannedProduct;
  const marginMad = p ? Number(p.retail_price) - Number(p.current_cost_price) : 0;
  const marginPct =
    p && Number(p.current_cost_price) > 0
      ? ((marginMad / Number(p.current_cost_price)) * 100).toFixed(1)
      : '0.0';
  const wholesaleMargin = p ? Number(p.wholesale_price) - Number(p.current_cost_price) : 0;

  return `
    <div class="mob-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <span style="font-size:10.5px;font-weight:700;color:var(--ink-400);letter-spacing:0.06em">SCANNER CODE-BARRES & PRIX</span>
        <button class="btn btn-sm" id="mob-toggle-privacy" style="${mobState.hideCosts ? 'background:#1c61e7;color:#fff;border-color:#1c61e7' : ''}">
          ${mobState.hideCosts ? 'Mode Client (Coûts Masqués)' : 'Afficher Coûts & Marges'}
        </button>
      </div>
      <form id="mob-scan-form" style="display:flex;gap:6px">
        <input type="text" id="mob-barcode-input" class="input mono" value="${mobState.barcodeQuery}" placeholder="EAN / SKU / Modèle..." style="flex:1" />
        <button type="submit" class="btn btn-dark">Chercher</button>
        <button type="button" class="btn" id="mob-cam-btn">${mobState.cameraOpen ? 'Fermer' : 'Caméra'}</button>
      </form>
      <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:9px">
        ${mobState.products
          .filter((x) => x.image_url)
          .slice(0, 5)
          .map(
            (item) => `
          <button class="btn btn-sm mob-quick-sample" data-code="${item.barcode}">
            ${item.brand} (${item.model_number || item.barcode.slice(-4)})
          </button>
        `
          )
          .join('')}
      </div>
      ${
        mobState.cameraOpen
          ? `
        <div class="video-box">
          <video id="mob-camera-video" playsinline muted></video>
        </div>
      `
          : ''
      }
    </div>

    ${
      mobState.notFoundCode
        ? `
      <div class="mob-card">
        <div style="font-weight:700;font-size:14px;margin-bottom:4px">Code-barres inconnu : <span class="mono">${mobState.notFoundCode}</span></div>
        <div style="font-size:12px;color:var(--ink-400);margin-bottom:10px">Ce produit n'est pas encore enregistré dans la base SQLite ELECTROZEN.</div>
        <button class="btn btn-dark" id="mob-create-from-scan" style="width:100%;justify-content:center">+ Créer ce Produit Maintenant</button>
      </div>
    `
        : ''
      }

    ${
      p
        ? `
      <div class="mob-card" style="padding:0;overflow:hidden">
        <div style="padding:14px;background:var(--panel-subtle);border-bottom:1px solid var(--border)">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="display:flex;align-items:center;gap:6px">
              <span class="site-badge site-badge-ez">${p.category || 'ELECTROZEN'}</span>
              <span style="font-size:11px;font-weight:700;color:var(--ink-500)">${p.brand.toUpperCase()}</span>
            </div>
            <span class="tag ${p.stock_quantity > p.min_stock_alert ? 'tag-ok' : 'tag-danger'} mono">
              Stock: ${p.stock_quantity} u.
            </span>
          </div>
          <div style="display:flex;gap:12px;align-items:center;margin-top:11px">
            ${
              p.image_url
                ? `<img src="${imgUrl(p.image_url)}" class="prod-thumb-lg" style="width:78px;height:78px" alt="" />`
                : ''
            }
            <div>
              <div style="font-size:15px;font-weight:700;color:var(--ink-900);line-height:1.25">${p.name_fr}</div>
              <div class="mono" style="font-size:11px;color:var(--ink-400);margin-top:4px">
                EAN: ${p.barcode} | Mod: ${p.model_number} | Gar. ${p.warranty_months}m
              </div>
              ${
                p.regular_price > p.retail_price
                  ? `<div style="margin-top:3px"><span class="price-old mono">Prix barré: ${fmtMad(p.regular_price)}</span></div>`
                  : ''
              }
            </div>
          </div>
        </div>

        <div style="padding:14px">
          <div class="tier-grid">
            <div class="tier-box primary">
              <div style="font-size:10px;font-weight:700;color:rgba(255,255,255,0.75)">PRIX DÉTAIL (PUBLIC)</div>
              <div class="mono" style="font-size:16.5px;font-weight:800;margin-top:4px">${fmtMad(p.retail_price)}</div>
              <div style="font-size:10.5px;color:rgba(255,255,255,0.85);margin-top:2px">
                ${mobState.hideCosts ? 'TTC Maroc' : `Marge: +${fmtMad(marginMad)} (${marginPct}%)`}
              </div>
            </div>
            <div class="tier-box">
              <div style="font-size:10px;font-weight:700;color:var(--ink-400)">PRIX GROS (REVENDEUR)</div>
              <div class="mono" style="font-size:16px;font-weight:800;margin-top:4px;color:var(--ink-900)">${fmtMad(p.wholesale_price)}</div>
              <div style="font-size:10.5px;color:var(--ink-500);margin-top:2px">
                ${mobState.hideCosts ? 'Tarif Revendeur' : `Marge Gros: +${fmtMad(wholesaleMargin)}`}
              </div>
            </div>
            ${
              !mobState.hideCosts
                ? `
              <div class="tier-box">
                <div style="font-size:10px;font-weight:700;color:var(--ink-400)">COÛT D'ACHAT ACTUEL</div>
                <div class="mono" style="font-size:14.5px;font-weight:700;margin-top:4px;color:var(--ink-900)">${fmtMad(p.current_cost_price)}</div>
                <div style="font-size:10px;color:var(--ink-400);margin-top:2px">Prix de revient actuel</div>
              </div>
              <div class="tier-box">
                <div style="font-size:10px;font-weight:700;color:var(--ink-400)">DERNIER COÛT D'ACHAT</div>
                <div class="mono" style="font-size:14.5px;font-weight:700;margin-top:4px;color:var(--ink-900)">${fmtMad(p.last_cost_price)}</div>
                <div style="font-size:10px;color:var(--ink-400);margin-top:2px">Dernier arrivage</div>
              </div>
            `
                : ''
            }
          </div>

          <div style="display:flex;gap:8px;margin-top:12px">
            <button class="btn btn-pos" id="mob-scan-add-pos" style="flex:1;justify-content:center;height:36px">+ Ajouter au Panier POS</button>
            <button class="btn" id="mob-scan-edit-prod" style="height:36px">Modifier</button>
          </div>

          ${
            !mobState.hideCosts && p.price_history && p.price_history.length > 0
              ? `
            <div style="margin-top:14px">
              <div style="font-size:10.5px;font-weight:700;color:var(--ink-400);margin-bottom:6px">
                HISTORIQUE DES DERNIERS PRIX D'ACHAT (FOURNISSEURS)
              </div>
              <div style="border:1px solid var(--border);border-radius:8px;overflow:hidden">
                ${p.price_history
                  .map(
                    (h) => `
                  <div style="display:flex;justify-content:space-between;padding:9px 11px;border-bottom:1px solid var(--border);font-size:11.5px">
                    <div>
                      <div style="font-weight:600;color:var(--ink-900)">${h.supplier_name || 'Fournisseur'}</div>
                      <div style="font-size:10.5px;color:var(--ink-400)">${String(h.recorded_at || '').slice(0, 10)} • Réf: ${h.invoice_ref || 'N/A'} (+${h.quantity_added} u.)</div>
                    </div>
                    <div style="text-align:right">
                      <div class="mono" style="font-weight:700;color:var(--ink-900)">Achat: ${fmtMad(h.buying_price)}</div>
                      <div class="mono" style="font-size:10px;color:var(--ink-400)">Détail: ${fmtMad(h.retail_price_at_time)}</div>
                    </div>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>
          `
              : ''
          }

          ${
            p.available_serials && p.available_serials.length > 0
              ? `
            <div style="margin-top:12px">
              <div style="font-size:10.5px;font-weight:700;color:var(--ink-400);margin-bottom:6px">
                NUMÉROS DE SÉRIE / IMEI EN STOCK (${p.available_serials.length})
              </div>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                ${p.available_serials
                  .map(
                    (s) => `<span class="tag mono">${s.serial_number || s}</span>`
                  )
                  .join('')}
              </div>
            </div>
          `
              : ''
          }
        </div>
      </div>
    `
        : ''
    }
  `;
}

function renderCatalogTab() {
  if (mobState.showProductForm) {
    const ep = mobState.editingProduct || {};
    return `
      <div class="mob-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
          <span style="font-weight:700;font-size:13px">${ep.id ? 'MODIFIER PRODUIT #' + ep.id : 'NOUVEAU PRODUIT'}</span>
          <button class="btn btn-sm" id="mob-cancel-form">Retour</button>
        </div>
        <form id="mob-product-form" style="display:flex;flex-direction:column;gap:10px">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <div>
              <label class="field-label">Code-Barres EAN</label>
              <input class="input mono" name="barcode" required value="${ep.barcode || ''}" />
            </div>
            <div>
              <label class="field-label">SKU Interne</label>
              <input class="input mono" name="sku" value="${ep.sku || 'EZ-' + String(Date.now()).slice(-5)}" />
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <div>
              <label class="field-label">Marque</label>
              <input class="input" name="brand" required value="${ep.brand || ''}" placeholder="Samsung, TCL, ZEN RIDE..." />
            </div>
            <div>
              <label class="field-label">Modèle</label>
              <input class="input mono" name="model_number" required value="${ep.model_number || ''}" />
            </div>
          </div>
          <div>
            <label class="field-label">Catégorie</label>
            <select class="input" name="category">
              ${[
                'Trottinettes & Mobilité (ZEN RIDE)',
                'Machines à Laver',
                'Réfrigérateurs & Froid',
                'Smart TV & QLED / MiniLED',
                'Climatiseurs & Chauffage',
                'Petit Électroménager',
                'Sécurité & Vidéosurveillance',
                'Informatique & Réseaux',
              ]
                .map((c) => `<option value="${c}" ${ep.category === c ? 'selected' : ''}>${c}</option>`)
                .join('')}
            </select>
          </div>
          <div>
            <label class="field-label">Désignation (FR)</label>
            <input class="input" name="name_fr" required value="${ep.name_fr || ''}" />
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
            <div>
              <label class="field-label">Coût Achat (MAD)</label>
              <input type="number" step="0.01" class="input mono" name="current_cost_price" required value="${ep.current_cost_price ?? 0}" />
            </div>
            <div>
              <label class="field-label">Prix Gros (MAD)</label>
              <input type="number" step="0.01" class="input mono" name="wholesale_price" required value="${ep.wholesale_price ?? 0}" />
            </div>
            <div>
              <label class="field-label">Prix Détail (MAD)</label>
              <input type="number" step="0.01" class="input mono" name="retail_price" required value="${ep.retail_price ?? 0}" />
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <div>
              <label class="field-label">Stock Quantité</label>
              <input type="number" class="input mono" name="stock_quantity" required value="${ep.stock_quantity ?? 1}" />
            </div>
            <div>
              <label class="field-label">Garantie (Mois)</label>
              <input type="number" class="input mono" name="warranty_months" required value="${ep.warranty_months ?? 12}" />
            </div>
          </div>
          <button type="submit" class="btn btn-dark" style="justify-content:center;height:38px">
            Enregistrer sur ELECTROZEN Windows
          </button>
        </form>
      </div>
    `;
  }

  const q = mobState.catalogSearch.toLowerCase();
  const filtered = mobState.products.filter(
    (p) =>
      !q ||
      String(p.name_fr || '').toLowerCase().includes(q) ||
      String(p.brand || '').toLowerCase().includes(q) ||
      String(p.barcode || '').toLowerCase().includes(q) ||
      String(p.model_number || '').toLowerCase().includes(q)
  );

  return `
    <div class="mob-card" style="display:flex;gap:8px">
      <input class="input" id="mob-cat-search" placeholder="Chercher produit, marque, EAN..." value="${mobState.catalogSearch}" style="flex:1" />
      <button class="btn btn-dark" id="mob-new-prod-btn">+ Produit</button>
    </div>
    ${filtered
      .map(
        (p) => `
      <div class="mob-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px">
          <div style="display:flex;gap:10px;align-items:center">
            ${
              p.image_url
                ? `<img src="${imgUrl(p.image_url)}" class="prod-thumb" alt="" loading="lazy" />`
                : `<div class="prod-thumb" style="display:flex;align-items:center;justify-content:center;font-weight:700;font-size:10px;color:#64748b">${(p.brand || 'EZ').slice(0, 3)}</div>`
            }
            <div>
              <div style="font-weight:700;font-size:13px;color:var(--ink-900);line-height:1.25">${p.name_fr}</div>
              <div style="display:flex;align-items:center;gap:6px;margin-top:3px">
                <span class="site-badge site-badge-ez">${p.brand ? p.brand.toUpperCase() : 'ELECTROZEN'}</span>
                <span class="mono" style="font-size:11px;color:var(--ink-400)">${p.model_number || p.sku}</span>
              </div>
            </div>
          </div>
          <span class="tag ${p.stock_quantity > 2 ? 'tag-ok' : 'tag-danger'} mono">${p.stock_quantity} u.</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:8px;border-top:1px solid var(--border)">
          <div class="mono" style="font-size:12px;font-weight:700;color:#e11d48">
            Détail: ${fmtMad(p.retail_price)} <span style="color:var(--ink-500);font-weight:600">| Gros: ${fmtMad(p.wholesale_price)}</span>
          </div>
          <div style="display:flex;gap:6px">
            <button class="btn btn-sm mob-edit-prod" data-id="${p.id}">Modifier</button>
            <button class="btn btn-sm btn-dark mob-pos-add" data-id="${p.id}">+ POS</button>
          </div>
        </div>
      </div>
    `
      )
      .join('')}
  `;
}

function renderPosTab() {
  const total = mobState.posCart.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
  return `
    <div class="mob-card">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:11px;font-weight:700;color:var(--ink-400)">CAISSE POS MOBILE</span>
        <div class="segmented">
          <button class="seg-btn ${mobState.posTier === 'retail' ? 'active' : ''}" id="mob-tier-retail">Détail</button>
          <button class="seg-btn ${mobState.posTier === 'wholesale' ? 'active' : ''}" id="mob-tier-wholesale">Gros</button>
        </div>
      </div>
    </div>

    <div class="mob-card">
      ${
        mobState.posCart.length === 0
          ? `<div style="text-align:center;color:var(--ink-400);padding:20px 0;font-size:12.5px">Panier vide. Scannez ou ajoutez un article.</div>`
          : mobState.posCart
              .map(
                (item, idx) => `
          <div style="padding:9px 0;border-bottom:1px solid var(--border)">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <span style="font-weight:700;font-size:13px;color:var(--ink-900)">${item.product.name_fr}</span>
              <button class="btn btn-sm mob-cart-del" data-idx="${idx}">Retirer</button>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
              <div style="display:flex;align-items:center;gap:6px">
                <button class="btn btn-sm mob-cart-dec" data-idx="${idx}">-</button>
                <span class="mono" style="font-weight:700;color:var(--ink-900)">${item.quantity}</span>
                <button class="btn btn-sm mob-cart-inc" data-idx="${idx}">+</button>
              </div>
              <span class="mono" style="font-weight:700;color:var(--ink-900)">${fmtMad(item.unitPrice * item.quantity)}</span>
            </div>
          </div>
        `
              )
              .join('')
      }
    </div>

    <div class="mob-card">
      <div style="display:flex;flex-direction:column;gap:10px">
        <div>
          <label class="field-label">Client</label>
          <select class="input" id="mob-pos-customer">
            <option value="">Client Comptoir (Anonyme)</option>
            ${mobState.customers
              .map(
                (c) =>
                  `<option value="${c.id}" ${String(mobState.posCustomerId) === String(c.id) ? 'selected' : ''}>${c.name || c.full_name} (${c.phone})</option>`
              )
              .join('')}
          </select>
        </div>
        <div>
          <label class="field-label">Mode de Paiement</label>
          <select class="input" id="mob-pos-method">
            <option value="cash" ${mobState.posPaymentMethod === 'cash' ? 'selected' : ''}>Espèces (Cash)</option>
            <option value="card" ${mobState.posPaymentMethod === 'card' ? 'selected' : ''}>Carte / Virement</option>
            <option value="credit" ${mobState.posPaymentMethod === 'credit' ? 'selected' : ''}>Crédit / Facilité</option>
          </select>
        </div>
        ${
          mobState.posPaymentMethod === 'credit'
            ? `
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
            <div>
              <label class="field-label">Acompte (MAD)</label>
              <input type="number" class="input mono" id="mob-pos-paid" value="${mobState.posPaidAmount}" placeholder="0.00" />
            </div>
            <div>
              <label class="field-label">Mensualités</label>
              <select class="input" id="mob-pos-inst">
                ${[2, 3, 4, 6, 12]
                  .map((m) => `<option value="${m}" ${mobState.posInstallments === m ? 'selected' : ''}>${m} Mois</option>`)
                  .join('')}
              </select>
            </div>
          </div>
        `
            : ''
        }
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid var(--border)">
          <span style="font-weight:700;font-size:13px;color:var(--ink-900)">TOTAL À PAYER</span>
          <span class="mono" style="font-weight:800;font-size:18px;color:var(--ink-900)">${fmtMad(total)}</span>
        </div>
        <button class="btn btn-pos" id="mob-pos-submit" style="justify-content:center;height:40px" ${mobState.posCart.length === 0 ? 'disabled' : ''}>
          Valider la Vente sur ELECTROZEN
        </button>
      </div>
    </div>
  `;
}

function renderWifiTab() {
  const net = mobState.networkInfo || {};
  const currentHostUrl = mobState.apiBase || `http://${net.primaryIp || window.location.hostname}:${net.port || 4000}`;
  return `
    <div class="mob-card">
      <div style="font-size:10.5px;font-weight:700;color:var(--ink-400);letter-spacing:0.06em;margin-bottom:10px">APPLICATION ANDROID NATIVE (APK)</div>
      <div style="font-size:12.5px;color:var(--ink-500);margin-bottom:12px">
        Téléchargez et installez l'application Android native <strong>ELECTROZEN-Android.apk</strong> directement sur ce téléphone :
      </div>
      <a href="${apiUrl('/download/ELECTROZEN-Android.apk')}" class="btn btn-pos" style="width:100%;justify-content:center;height:38px;text-decoration:none">
        Télécharger & Installer ELECTROZEN-Android.apk
      </a>
    </div>

    <div class="mob-card">
      <div style="font-size:10.5px;font-weight:700;color:var(--ink-400);letter-spacing:0.06em;margin-bottom:10px">SYNCHRONISATION WI-FI ELECTROZEN</div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <div>
          <label class="field-label">URL du Serveur Windows (Même Wi-Fi)</label>
          <input class="input mono" id="mob-api-base" value="${currentHostUrl}" placeholder="http://192.168.100.38:4000" />
        </div>
        <div>
          <label class="field-label">Clé d'appairage</label>
          <div class="mono" style="font-weight:600;color:var(--ink-500)">${net.pairingToken || 'ELECTROZEN-POS-2026'}</div>
        </div>
        <div>
          <label class="field-label">Nom de ce Terminal Mobile</label>
          <input class="input" id="mob-device-name" value="${mobState.deviceName}" />
        </div>
        <button class="btn btn-dark" id="mob-save-pair" style="justify-content:center;height:38px">Tester & Synchroniser Maintenant</button>
      </div>
    </div>
  `;
}

function renderMobile() {
  document.documentElement.setAttribute('data-theme', mobState.theme);
  const root = document.getElementById('mobile-root');
  if (!root) return;

  root.innerHTML = `
    <div class="mob-shell">
      ${mobState.toast ? `<div class="toast">${mobState.toast}</div>` : ''}
      <header class="mob-header">
        <div style="display:flex;align-items:center;gap:10px">
          <img src="${imgUrl('/assets/electrozen-icon.png')}" alt="EZ" style="width:29px;height:29px;border-radius:7px;background:#fff;padding:2px;object-fit:contain" onerror="this.style.display='none'" />
          <div>
            <div style="font-weight:800;font-size:13.5px;letter-spacing:0.05em">ELECTROZEN</div>
            <div class="mono" style="font-size:10px;color:#93c5fd">electrozen.ma • Wi-Fi POS</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          <button class="btn btn-sm" id="mob-theme-btn" style="background:rgba(255,255,255,0.14);border-color:rgba(255,255,255,0.22);color:#fff">
            ${mobState.theme === 'dark' ? 'Clair' : 'Sombre'}
          </button>
          <span class="tag tag-ok mono" style="font-size:10px;background:#ffffff">SYNC</span>
        </div>
      </header>

      <main class="mob-main">
        ${mobState.tab === 'scanner' ? renderScannerTab() : ''}
        ${mobState.tab === 'catalog' ? renderCatalogTab() : ''}
        ${mobState.tab === 'pos' ? renderPosTab() : ''}
        ${mobState.tab === 'wifi' ? renderWifiTab() : ''}
      </main>

      <div class="mob-nav-wrap">
        <nav class="mob-nav">
          <button class="mob-nav-btn ${mobState.tab === 'scanner' ? 'active' : ''}" data-tab="scanner">
            ${MOB_ICONS.scan}
            <span>Scanner</span>
          </button>
          <button class="mob-nav-btn ${mobState.tab === 'catalog' ? 'active' : ''}" data-tab="catalog">
            ${MOB_ICONS.box}
            <span>Produits (${mobState.products.length})</span>
          </button>
          <button class="mob-nav-btn ${mobState.tab === 'pos' ? 'active' : ''}" data-tab="pos">
            ${MOB_ICONS.pos}
            <span>POS (${mobState.posCart.length})</span>
          </button>
          <button class="mob-nav-btn ${mobState.tab === 'wifi' ? 'active' : ''}" data-tab="wifi">
            ${MOB_ICONS.wifi}
            <span>Wi-Fi & APK</span>
          </button>
        </nav>
      </div>
    </div>
  `;

  bindMobileEvents();
}

function bindMobileEvents() {
  const themeBtn = document.getElementById('mob-theme-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      mobState.theme = mobState.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('ez_mob_theme_v2', mobState.theme);
      renderMobile();
    });
  }

  document.querySelectorAll('.mob-nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      stopCameraScanner();
      mobState.tab = btn.dataset.tab;
      renderMobile();
    });
  });

  const privacyBtn = document.getElementById('mob-toggle-privacy');
  if (privacyBtn) {
    privacyBtn.addEventListener('click', () => {
      mobState.hideCosts = !mobState.hideCosts;
      renderMobile();
    });
  }

  const scanForm = document.getElementById('mob-scan-form');
  if (scanForm) {
    scanForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = document.getElementById('mob-barcode-input')?.value || '';
      lookupBarcode(val);
    });
  }

  const camBtn = document.getElementById('mob-cam-btn');
  if (camBtn) {
    camBtn.addEventListener('click', () => {
      if (mobState.cameraOpen) {
        stopCameraScanner();
        renderMobile();
      } else {
        startCameraScanner((code) => lookupBarcode(code));
      }
    });
  }

  document.querySelectorAll('.mob-quick-sample').forEach((btn) => {
    btn.addEventListener('click', () => lookupBarcode(btn.dataset.code));
  });

  const createFromScanBtn = document.getElementById('mob-create-from-scan');
  if (createFromScanBtn) {
    createFromScanBtn.addEventListener('click', () => {
      mobState.editingProduct = { barcode: mobState.notFoundCode };
      mobState.showProductForm = true;
      mobState.tab = 'catalog';
      renderMobile();
    });
  }

  const scanAddPos = document.getElementById('mob-scan-add-pos');
  if (scanAddPos) {
    scanAddPos.addEventListener('click', () => addToMobilePos(mobState.scannedProduct));
  }

  const scanEditProd = document.getElementById('mob-scan-edit-prod');
  if (scanEditProd) {
    scanEditProd.addEventListener('click', () => {
      mobState.editingProduct = mobState.scannedProduct;
      mobState.showProductForm = true;
      mobState.tab = 'catalog';
      renderMobile();
    });
  }

  const catSearch = document.getElementById('mob-cat-search');
  if (catSearch) {
    catSearch.addEventListener('input', (e) => {
      mobState.catalogSearch = e.target.value;
      renderMobile();
      const el = document.getElementById('mob-cat-search');
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    });
  }

  const newProdBtn = document.getElementById('mob-new-prod-btn');
  if (newProdBtn) {
    newProdBtn.addEventListener('click', () => {
      mobState.editingProduct = {};
      mobState.showProductForm = true;
      renderMobile();
    });
  }

  const cancelFormBtn = document.getElementById('mob-cancel-form');
  if (cancelFormBtn) {
    cancelFormBtn.addEventListener('click', () => {
      mobState.showProductForm = false;
      renderMobile();
    });
  }

  document.querySelectorAll('.mob-edit-prod').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = mobState.products.find((x) => String(x.id) === String(btn.dataset.id));
      if (p) {
        mobState.editingProduct = p;
        mobState.showProductForm = true;
        renderMobile();
      }
    });
  });

  document.querySelectorAll('.mob-pos-add').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = mobState.products.find((x) => String(x.id) === String(btn.dataset.id));
      if (p) addToMobilePos(p);
    });
  });

  const prodForm = document.getElementById('mob-product-form');
  if (prodForm) {
    prodForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(prodForm);
      const payload = Object.fromEntries(fd.entries());
      const isEdit = mobState.editingProduct && mobState.editingProduct.id;
      const url = isEdit
        ? `/api/products/${mobState.editingProduct.id}`
        : '/api/products';
      const res = await apiFetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const saved = await res.json();
        mobState.products = await apiFetch('/api/products').then((r) => r.json());
        mobState.scannedProduct = saved;
        mobState.showProductForm = false;
        showMobToast('Produit enregistré sur ELECTROZEN');
      } else {
        showMobToast('Erreur lors de la sauvegarde');
      }
    });
  }

  const tierRetail = document.getElementById('mob-tier-retail');
  if (tierRetail) {
    tierRetail.addEventListener('click', () => {
      mobState.posTier = 'retail';
      mobState.posCart.forEach((i) => (i.unitPrice = Number(i.product.retail_price)));
      renderMobile();
    });
  }

  const tierWholesale = document.getElementById('mob-tier-wholesale');
  if (tierWholesale) {
    tierWholesale.addEventListener('click', () => {
      mobState.posTier = 'wholesale';
      mobState.posCart.forEach((i) => (i.unitPrice = Number(i.product.wholesale_price)));
      renderMobile();
    });
  }

  document.querySelectorAll('.mob-cart-del').forEach((btn) => {
    btn.addEventListener('click', () => {
      mobState.posCart.splice(Number(btn.dataset.idx), 1);
      renderMobile();
    });
  });

  document.querySelectorAll('.mob-cart-dec').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = mobState.posCart[Number(btn.dataset.idx)];
      if (item && item.quantity > 1) item.quantity -= 1;
      renderMobile();
    });
  });

  document.querySelectorAll('.mob-cart-inc').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = mobState.posCart[Number(btn.dataset.idx)];
      if (item && item.quantity < item.product.stock_quantity) item.quantity += 1;
      renderMobile();
    });
  });

  const posCustomer = document.getElementById('mob-pos-customer');
  if (posCustomer) {
    posCustomer.addEventListener('change', (e) => {
      mobState.posCustomerId = e.target.value;
    });
  }

  const posMethod = document.getElementById('mob-pos-method');
  if (posMethod) {
    posMethod.addEventListener('change', (e) => {
      mobState.posPaymentMethod = e.target.value;
      renderMobile();
    });
  }

  const posPaid = document.getElementById('mob-pos-paid');
  if (posPaid) {
    posPaid.addEventListener('input', (e) => {
      mobState.posPaidAmount = e.target.value;
    });
  }

  const posInst = document.getElementById('mob-pos-inst');
  if (posInst) {
    posInst.addEventListener('change', (e) => {
      mobState.posInstallments = Number(e.target.value);
    });
  }

  const posSubmit = document.getElementById('mob-pos-submit');
  if (posSubmit) {
    posSubmit.addEventListener('click', async () => {
      if (mobState.posPaymentMethod === 'credit' && !mobState.posCustomerId) {
        showMobToast('Sélectionnez un client pour une vente à Crédit');
        return;
      }
      const total = mobState.posCart.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);
      const paid =
        mobState.posPaymentMethod === 'credit' ? Number(mobState.posPaidAmount || 0) : total;
      const res = await apiFetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price_tier: mobState.posTier,
          customer_id: mobState.posCustomerId ? Number(mobState.posCustomerId) : null,
          discount: 0,
          paid_amount: paid,
          payment_method: mobState.posPaymentMethod,
          installments_count: mobState.posPaymentMethod === 'credit' ? mobState.posInstallments : 0,
          source_device: mobState.deviceName,
          items: mobState.posCart.map((i) => ({
            product_id: i.product.id,
            quantity: i.quantity,
            unit_price: i.unitPrice,
            serial_number: i.serialNumber,
          })),
        }),
      });
      if (res.ok) {
        mobState.posCart = [];
        mobState.products = await apiFetch('/api/products').then((r) => r.json());
        showMobToast('Vente validée et synchronisée sur ELECTROZEN Windows');
      } else {
        showMobToast('Erreur lors de la validation de la vente');
      }
    });
  }

  const savePair = document.getElementById('mob-save-pair');
  if (savePair) {
    savePair.addEventListener('click', async () => {
      const nameVal = document.getElementById('mob-device-name')?.value || 'ELECTROZEN-Android';
      const baseVal = document.getElementById('mob-api-base')?.value || '';
      mobState.deviceName = nameVal;
      if (baseVal && baseVal.startsWith('http')) {
        mobState.apiBase = baseVal.replace(/\/+$/, '');
        localStorage.setItem('ez_mob_api_base', mobState.apiBase);
      }
      localStorage.setItem('ez_mob_device', nameVal);
      await initMobile();
      showMobToast('Synchronisé avec ELECTROZEN Windows');
    });
  }
}

initMobile();
