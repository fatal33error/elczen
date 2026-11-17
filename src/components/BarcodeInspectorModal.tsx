import React, { useState, useEffect } from 'react';
import {
  ScanBarcode,
  X,
  History,
  Tag,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  ShoppingCart,
  Edit3,
  Plus,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { Language, Product, PriceHistoryItem, SerialItem } from '../types';
import { formatMoney, getProductName, translations } from '../i18n';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialBarcode?: string;
  products: Product[];
  lang: Language;
  currency: string;
  onAddToPos: (product: Product, tier: 'retail' | 'wholesale') => void;
  onEditProduct: (product: Product) => void;
  onRefresh: () => void;
}

export const BarcodeInspectorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialBarcode = '',
  products,
  lang,
  currency,
  onAddToPos,
  onEditProduct,
  onRefresh,
}) => {
  const t = translations[lang];
  const [barcodeInput, setBarcodeInput] = useState(initialBarcode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryItem[]>([]);
  const [serialItems, setSerialItems] = useState<SerialItem[]>([]);
  const [newSerial, setNewSerial] = useState('');

  const lookupBarcode = async (code: string) => {
    const clean = code.trim();
    if (!clean) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/products/barcode/${encodeURIComponent(clean)}`);
      if (!res.ok) {
        setProduct(null);
        setPriceHistory([]);
        setSerialItems([]);
        setError(
          lang === 'ar'
            ? `لم يتم العثور على منتج بالباركود: ${clean}`
            : `Aucun produit trouvé pour le code: ${clean}`
        );
      } else {
        const data = await res.json();
        setProduct(data.product);
        setPriceHistory(data.priceHistory || []);
        setSerialItems(data.serialItems || []);
      }
    } catch {
      setError('Erreur de connexion au serveur local');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const target = initialBarcode || (products[0]?.barcode ?? '');
      setBarcodeInput(target);
      if (target) lookupBarcode(target);
    }
  }, [isOpen, initialBarcode]);

  if (!isOpen) return null;

  const handleAddSerial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !newSerial.trim()) return;
    const res = await fetch(`/api/products/${product.id}/serials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serial_number: newSerial.trim(), notes: 'Ajouté via Inspecteur Code-Barres' }),
    });
    if (res.ok) {
      const updatedSerials = await res.json();
      setSerialItems(updatedSerials);
      setNewSerial('');
      onRefresh();
    }
  };

  const retailMargin = product
    ? product.retail_price - product.current_cost_price
    : 0;
  const wholesaleMargin = product
    ? product.wholesale_price - product.current_cost_price
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <ScanBarcode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{t.quickScanBtn}</h2>
              <p className="text-xs text-slate-400">
                {lang === 'ar'
                  ? 'افحص الباركود لمعرفة سعر التجزئة، سعر الجملة، وسجل آخر أسعار الشراء'
                  : 'Scannez un code-barres pour voir Prix Détail, Prix Gros, Coût Actuel et Historique des Derniers Prix'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search / Barcode Input Bar + Quick Product Chips */}
        <div className="p-5 bg-slate-900/90 border-b border-slate-800 space-y-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              lookupBarcode(barcodeInput);
            }}
            className="flex gap-3"
          >
            <div className="relative flex-1">
              <ScanBarcode className="w-5 h-5 text-blue-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                placeholder="Scannez le code-barres EAN / SKU / Modèle (ex: 8806094892154)..."
                className="w-full ps-11 pe-4 py-2.5 bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-xl text-white font-mono text-sm outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition cursor-pointer"
            >
              {loading ? '...' : 'Inspecter Code-Barres'}
            </button>
          </form>

          {/* Quick-select pills so user can test barcode scanning in 1 click */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">Test Rapide :</span>
            {products.slice(0, 6).map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setBarcodeInput(p.barcode);
                  lookupBarcode(p.barcode);
                }}
                className={`text-xs px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                  product?.id === p.id
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {p.brand} ({p.barcode.slice(-6)})
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          {product && (
            <>
              {/* Top Product Summary & Action Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/80">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {product.brand}
                    </span>
                    <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-700">
                      EAN: {product.barcode}
                    </span>
                    <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-700">
                      Modèle: {product.model_number || product.sku}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded font-semibold ${
                        product.stock_quantity > product.min_stock_alert
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {t.stock}: {product.stock_quantity} unités
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-2">
                    {getProductName(product, lang)}
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      onAddToPos(product, 'retail');
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />+ Caisse (Détail)
                  </button>
                  <button
                    onClick={() => {
                      onAddToPos(product, 'wholesale');
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer"
                  >
                    <Layers className="w-4 h-4" />+ Caisse (Gros)
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onEditProduct(product);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" /> Modifier
                  </button>
                </div>
              </div>

              {/* 4 Key Price Cards (Retail, Wholesale, Current Buying Cost, Last Buying Price) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                  <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold uppercase">
                    <span>{t.retailPrice}</span>
                    <Tag className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-extrabold text-white mt-1.5">
                    {formatMoney(product.retail_price, currency)}
                  </div>
                  <div className="text-xs text-emerald-300/90 mt-1">
                    Marge Détail: +{formatMoney(retailMargin, currency)} (
                    {product.current_cost_price > 0
                      ? Math.round((retailMargin / product.current_cost_price) * 100)
                      : 0}
                    %)
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30">
                  <div className="flex items-center justify-between text-indigo-400 text-xs font-semibold uppercase">
                    <span>{t.wholesalePrice}</span>
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-extrabold text-white mt-1.5">
                    {formatMoney(product.wholesale_price, currency)}
                  </div>
                  <div className="text-xs text-indigo-300/90 mt-1">
                    Marge Gros: +{formatMoney(wholesaleMargin, currency)} | Min:{' '}
                    {formatMoney(product.min_selling_price, currency)}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30">
                  <div className="flex items-center justify-between text-amber-400 text-xs font-semibold uppercase">
                    <span>{t.currentBuyingPrice}</span>
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-extrabold text-white mt-1.5">
                    {formatMoney(product.current_cost_price, currency)}
                  </div>
                  <div className="text-xs text-amber-300/90 mt-1">
                    Coût d’acquisition unitaire actuel
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30">
                  <div className="flex items-center justify-between text-purple-400 text-xs font-semibold uppercase">
                    <span>{t.lastBuyingPrice}</span>
                    <History className="w-4 h-4" />
                  </div>
                  <div className="text-2xl font-extrabold text-white mt-1.5">
                    {formatMoney(product.last_cost_price, currency)}
                  </div>
                  <div className="text-xs text-purple-300/90 mt-1 flex items-center gap-1">
                    {product.current_cost_price > product.last_cost_price ? (
                      <>
                        <TrendingUp className="w-3.5 h-3.5 text-red-400" />
                        <span>
                          Hausse de +
                          {formatMoney(
                            product.current_cost_price - product.last_cost_price,
                            currency
                          )}
                        </span>
                      </>
                    ) : product.current_cost_price < product.last_cost_price ? (
                      <>
                        <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          Baisse de -
                          {formatMoney(
                            product.last_cost_price - product.current_cost_price,
                            currency
                          )}
                        </span>
                      </>
                    ) : (
                      <span>Prix d’achat stable</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Historical Buying Prices Table ("Last Prices") */}
              <div className="bg-slate-800/40 border border-slate-700/80 rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm font-bold text-white">{t.priceHistoryTitle}</h4>
                  </div>
                  <span className="text-xs text-slate-400">
                    {priceHistory.length} entrées enregistrées
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400 bg-slate-900/50">
                        <th className="py-2.5 px-4">Date Arrivage</th>
                        <th className="py-2.5 px-4">Fournisseur & Réf BL</th>
                        <th className="py-2.5 px-4">Ancien Prix Achat</th>
                        <th className="py-2.5 px-4">Nouveau Prix Achat</th>
                        <th className="py-2.5 px-4">Prix Gros Fixé</th>
                        <th className="py-2.5 px-4">Prix Détail Fixé</th>
                        <th className="py-2.5 px-4">Qté Ajoutée</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {priceHistory.map((h) => (
                        <tr key={h.id} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-4 font-mono text-slate-300">
                            {h.recorded_at.slice(0, 16)}
                          </td>
                          <td className="py-2.5 px-4">
                            <div className="font-semibold text-white">{h.supplier_name}</div>
                            <div className="text-slate-400">
                              {h.invoice_ref} {h.notes ? `• ${h.notes}` : ''}
                            </div>
                          </td>
                          <td className="py-2.5 px-4 text-slate-400">
                            {formatMoney(h.previous_buying_price, currency)}
                          </td>
                          <td className="py-2.5 px-4 font-bold text-amber-300">
                            {formatMoney(h.buying_price, currency)}
                          </td>
                          <td className="py-2.5 px-4 font-semibold text-indigo-300">
                            {formatMoney(h.wholesale_price_at_time, currency)}
                          </td>
                          <td className="py-2.5 px-4 font-semibold text-emerald-300">
                            {formatMoney(h.retail_price_at_time, currency)}
                          </td>
                          <td className="py-2.5 px-4">
                            {h.quantity_added > 0 ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                                +{h.quantity_added}
                              </span>
                            ) : (
                              <span className="text-slate-500">MAJ Tarif</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Serial Numbers & Warranty Section */}
              <div className="bg-slate-800/40 border border-slate-700/80 rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">
                      Numéros de Série (S/N / IMEI) & Garantie ({product.warranty_months}{' '}
                      {t.months})
                    </h4>
                  </div>
                  <form onSubmit={handleAddSerial} className="flex gap-2">
                    <input
                      type="text"
                      value={newSerial}
                      onChange={(e) => setNewSerial(e.target.value)}
                      placeholder="Scanner nouveau N° Série..."
                      className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Ajouter S/N
                    </button>
                  </form>
                </div>

                {serialItems.length === 0 ? (
                  <p className="text-xs text-slate-400">
                    Aucun numéro de série individuel enregistré pour cet article.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {serialItems.map((sn) => (
                      <div
                        key={sn.id}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex items-center gap-2 ${
                          sn.status === 'in_stock'
                            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                            : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{sn.serial_number}</span>
                        <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-black/30">
                          {sn.status === 'in_stock'
                            ? 'Disponible'
                            : `Vendu (Gar. ${sn.warranty_expires_at || ''})`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
