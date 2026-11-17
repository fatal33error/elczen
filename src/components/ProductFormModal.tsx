import React, { useState, useEffect } from 'react';
import { X, Sparkles, Barcode, RefreshCw, Save, ShieldCheck } from 'lucide-react';
import { Language, Product } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: Product | null;
  lang: Language;
  currency: string;
  onSaved: () => void;
}

const CATEGORIES = [
  'Téléviseurs & Audio',
  'Réfrigérateurs & Congélateurs',
  'Lavage & Séchage',
  'Climatisation & Chauffage',
  'Cuisinières & Encastrable',
  'Petit Électroménager',
  'Smartphones & Informatique',
];

export const ProductFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  editingProduct,
  currency,
  onSaved,
}) => {
  const [form, setForm] = useState({
    barcode: '',
    sku: '',
    model_number: '',
    brand: '',
    category: CATEGORIES[0],
    name_fr: '',
    name_ar: '',
    name_en: '',
    description_fr: '',
    description_ar: '',
    description_en: '',
    current_cost_price: 0,
    last_cost_price: 0,
    wholesale_price: 0,
    retail_price: 0,
    min_selling_price: 0,
    stock_quantity: 1,
    min_stock_alert: 2,
    warranty_months: 24,
    has_serial: true,
    supplier_name: 'Arrivage Direct',
    serial_numbers_text: '',
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setForm({
        barcode: editingProduct.barcode,
        sku: editingProduct.sku,
        model_number: editingProduct.model_number,
        brand: editingProduct.brand,
        category: editingProduct.category,
        name_fr: editingProduct.name_fr,
        name_ar: editingProduct.name_ar,
        name_en: editingProduct.name_en,
        description_fr: editingProduct.description_fr,
        description_ar: editingProduct.description_ar,
        description_en: editingProduct.description_en,
        current_cost_price: editingProduct.current_cost_price,
        last_cost_price: editingProduct.last_cost_price,
        wholesale_price: editingProduct.wholesale_price,
        retail_price: editingProduct.retail_price,
        min_selling_price: editingProduct.min_selling_price,
        stock_quantity: editingProduct.stock_quantity,
        min_stock_alert: editingProduct.min_stock_alert,
        warranty_months: editingProduct.warranty_months,
        has_serial: Boolean(editingProduct.has_serial),
        supplier_name: 'Mise à jour tarifaire',
        serial_numbers_text: '',
      });
    } else {
      const randomEan = `613${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      setForm({
        barcode: randomEan,
        sku: `EL-${Date.now().toString().slice(-5)}`,
        model_number: '',
        brand: 'Samsung',
        category: CATEGORIES[0],
        name_fr: '',
        name_ar: '',
        name_en: '',
        description_fr: '',
        description_ar: '',
        description_en: '',
        current_cost_price: 50000,
        last_cost_price: 50000,
        wholesale_price: 56000,
        retail_price: 62000,
        min_selling_price: 55000,
        stock_quantity: 5,
        min_stock_alert: 2,
        warranty_months: 24,
        has_serial: true,
        supplier_name: 'Stock Initial',
        serial_numbers_text: '',
      });
    }
    setError('');
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleGenerateAi = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: form.brand,
          model_number: form.model_number || form.sku,
          category: form.category,
          keywords: form.name_fr,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({
          ...prev,
          name_fr: data.name_fr || prev.name_fr,
          name_ar: data.name_ar || prev.name_ar,
          name_en: data.name_en || prev.name_en,
          description_fr: data.description_fr || prev.description_fr,
          description_ar: data.description_ar || prev.description_ar,
          description_en: data.description_en || prev.description_en,
        }));
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const serials = form.serial_numbers_text
        .split(/[\n,;]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          serial_numbers: serials,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Erreur lors de la sauvegarde');
        return;
      }
      onSaved();
      onClose();
    } catch {
      setError('Erreur réseau');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700">
          <div>
            <h2 className="text-lg font-bold text-white">
              {editingProduct ? `Modifier Produit: ${editingProduct.name_fr}` : 'Ajouter un Produit (Magasin + WooCommerce)'}
            </h2>
            <p className="text-xs text-slate-400">
              Synchronisation automatique avec le serveur Wi-Fi Android et la file WooCommerce
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* Row 1: Barcode, Brand, Model, Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Code-Barres (EAN / UPC) *</label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  required
                  value={form.barcode}
                  onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
                />
                <button
                  type="button"
                  title="Générer Code-Barres"
                  onClick={() =>
                    setForm({
                      ...form,
                      barcode: `613${Math.floor(1000000000 + Math.random() * 9000000000)}`,
                    })
                  }
                  className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                >
                  <Barcode className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Marque *</label>
              <input
                type="text"
                required
                placeholder="ex: Samsung, LG, Brandt, Condor"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Référence / Modèle</label>
              <input
                type="text"
                placeholder="ex: QA55Q60C / GN-B422"
                value={form.model_number}
                onChange={(e) => setForm({ ...form, model_number: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Catégorie</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing Matrix Card */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Tarification : Prix d’Achat, Dernier Prix, Prix de Gros & Prix Détail ({currency})
              </h3>
              <span className="text-xs text-emerald-400 font-semibold">
                Marge Détail: +{(form.retail_price - form.current_cost_price).toLocaleString()} {currency} | Marge Gros: +{(form.wholesale_price - form.current_cost_price).toLocaleString()} {currency}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-[11px] text-amber-300 font-medium mb-1">
                  Prix d’Achat Actuel
                </label>
                <input
                  type="number"
                  required
                  value={form.current_cost_price}
                  onChange={(e) =>
                    setForm({ ...form, current_cost_price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-amber-500/40 text-white font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] text-purple-300 font-medium mb-1">
                  Dernier Prix d’Achat
                </label>
                <input
                  type="number"
                  value={form.last_cost_price}
                  onChange={(e) =>
                    setForm({ ...form, last_cost_price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-purple-500/40 text-slate-300 font-semibold text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] text-indigo-300 font-medium mb-1">
                  Prix de Vente GROS
                </label>
                <input
                  type="number"
                  required
                  value={form.wholesale_price}
                  onChange={(e) =>
                    setForm({ ...form, wholesale_price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-indigo-500/40 text-white font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] text-emerald-300 font-medium mb-1">
                  Prix de Vente DÉTAIL
                </label>
                <input
                  type="number"
                  required
                  value={form.retail_price}
                  onChange={(e) =>
                    setForm({ ...form, retail_price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-emerald-500/40 text-white font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 font-medium mb-1">
                  Prix Minimum Autorisé
                </label>
                <input
                  type="number"
                  value={form.min_selling_price}
                  onChange={(e) =>
                    setForm({ ...form, min_selling_price: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm"
                />
              </div>
            </div>
          </div>

          {/* AI Multilingual Title & Description Generator for Store + WooCommerce */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-purple-950/40 border border-indigo-500/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Assistant IA — Titres & Descriptions Multilingues (FR / AR / EN) pour WooCommerce
                </h4>
                <p className="text-[11px] text-slate-400">
                  Entrez la marque et le modèle ci-dessus puis cliquez pour générer automatiquement les fiches produits.
                </p>
              </div>
              <button
                type="button"
                onClick={handleGenerateAi}
                disabled={aiLoading}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shrink-0"
              >
                {aiLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Générer avec l’IA
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Nom du Produit (Français) *</label>
                <input
                  type="text"
                  required
                  value={form.name_fr}
                  onChange={(e) => setForm({ ...form, name_fr: e.target.value })}
                  placeholder="ex: Téléviseur Samsung 55 QLED 4K"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
              <div dir="rtl">
                <label className="block text-xs text-slate-300 mb-1">اسم المنتج (بالعربية)</label>
                <input
                  type="text"
                  value={form.name_ar}
                  onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                  placeholder="تلفزيون سامسونج 55 بوصة..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Product Name (English)</label>
                <input
                  type="text"
                  value={form.name_en}
                  onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                  placeholder="Samsung 55 QLED 4K Smart TV"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Description WooCommerce (Français)
                </label>
                <textarea
                  rows={2}
                  value={form.description_fr}
                  onChange={(e) => setForm({ ...form, description_fr: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
              <div dir="rtl">
                <label className="block text-xs text-slate-400 mb-1">
                  وصف المنتج لمتجر ووكومرس (عربي)
                </label>
                <textarea
                  rows={2}
                  value={form.description_ar}
                  onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Stock, Warranty & Serial Tracking */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Quantité en Stock</label>
              <input
                type="number"
                value={form.stock_quantity}
                onChange={(e) => setForm({ ...form, stock_quantity: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Seuil Alerte Stock</label>
              <input
                type="number"
                value={form.min_stock_alert}
                onChange={(e) => setForm({ ...form, min_stock_alert: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Durée Garantie (Mois)</label>
              <input
                type="number"
                value={form.warranty_months}
                onChange={(e) => setForm({ ...form, warranty_months: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs"
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.has_serial}
                  onChange={(e) => setForm({ ...form, has_serial: e.target.checked })}
                  className="w-4 h-4 rounded accent-blue-600"
                />
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Suivi par N° de Série / IMEI
              </label>
            </div>
          </div>

          {!editingProduct && form.has_serial && (
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Numéros de Série initiaux (optionnel — séparez par virgule ou retour à la ligne)
              </label>
              <input
                type="text"
                value={form.serial_numbers_text}
                onChange={(e) => setForm({ ...form, serial_numbers_text: e.target.value })}
                placeholder="SN-2026-001, SN-2026-002..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono text-xs"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Enregistrement...' : 'Enregistrer le Produit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
