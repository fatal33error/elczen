import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Truck,
  Users,
  Wallet,
  Wifi,
  ScanBarcode,
  Plus,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  History,
  Edit3,
  Trash2,
  Printer,
  Globe,
  Smartphone,
  Sparkles,
  ArrowUpRight,
  Layers,
  ShieldCheck,
  CreditCard,
  Calendar,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Language,
  Product,
  Supplier,
  Purchase,
  Customer,
  Sale,
  SaleItem,
  Expense,
  NetworkInfo,
  Installment,
} from './types';
import { translations, getProductName, formatMoney } from './i18n';
import { BarcodeInspectorModal } from './components/BarcodeInspectorModal';
import { ProductFormModal } from './components/ProductFormModal';
import { InvoiceWarrantyModal } from './components/InvoiceWarrantyModal';

type TabId =
  | 'dashboard'
  | 'pos'
  | 'products'
  | 'purchases'
  | 'customers'
  | 'expenses'
  | 'connect';

export function App() {
  const [lang, setLang] = useState<Language>('fr');
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const t = translations[lang];

  // Data state
  const [dashboard, setDashboard] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({
    store_name: 'ElectroMaison & High-Tech Pro',
    store_phone: '+213 550 12 34 56',
    store_address: 'Boulevard Commercial, Centre-Ville',
    currency: 'DA',
  });

  // Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modals
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [inspectorBarcode, setInspectorBarcode] = useState('');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [printableSale, setPrintableSale] = useState<Sale | null>(null);

  // POS Cart State
  const [posPriceTier, setPosPriceTier] = useState<'retail' | 'wholesale'>('retail');
  const [posCart, setPosCart] = useState<SaleItem[]>([]);
  const [posBarcodeInput, setPosBarcodeInput] = useState('');
  const [posCustomerId, setPosCustomerId] = useState<number | ''>('');
  const [posDiscount, setPosDiscount] = useState(0);
  const [posPaidAmount, setPosPaidAmount] = useState<number | ''>('');
  const [posPaymentMethod, setPosPaymentMethod] = useState('cash');
  const [posInstallmentsCount, setPosInstallmentsCount] = useState(3);
  const [posNotes, setPosNotes] = useState('');

  // Purchase (Stock-In) Form State
  const [purchaseSupplierId, setPurchaseSupplierId] = useState<number>(1);
  const [purchaseInvoiceRef, setPurchaseInvoiceRef] = useState('');
  const [purchaseItems, setPurchaseItems] = useState<
    {
      product_id: number;
      quantity: number;
      unit_cost: number;
      new_wholesale_price: number;
      new_retail_price: number;
      serial_numbers_raw: string;
    }[]
  >([]);
  const [purchasePaid, setPurchasePaid] = useState<number | ''>('');
  const [newSupplierForm, setNewSupplierForm] = useState({
    name: '',
    company: '',
    phone: '',
  });

  // Customer Ledger & New Customer State
  const [selectedCustomerLedger, setSelectedCustomerLedger] = useState<{
    customer: Customer;
    sales: Sale[];
    installments: Installment[];
    payments: any[];
  } | null>(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState('');
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    phone: '',
    address: '',
    customer_type: 'retail',
  });

  // Expense Form State
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'utilities',
    amount: '',
    expense_date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // WooCommerce Sync & Toast State
  const [syncingWoo, setSyncingWoo] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const currency = settings.currency || 'DA';

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAllData = useCallback(async () => {
    try {
      const [dashRes, prodRes, supRes, purRes, custRes, salesRes, expRes, netRes, setRes] =
        await Promise.all([
          fetch('/api/dashboard'),
          fetch('/api/products'),
          fetch('/api/suppliers'),
          fetch('/api/purchases'),
          fetch('/api/customers'),
          fetch('/api/sales'),
          fetch('/api/expenses'),
          fetch('/api/network-info'),
          fetch('/api/settings'),
        ]);

      if (dashRes.ok) setDashboard(await dashRes.json());
      if (prodRes.ok) setProducts(await prodRes.json());
      if (supRes.ok) setSuppliers(await supRes.json());
      if (purRes.ok) setPurchases(await purRes.json());
      if (custRes.ok) setCustomers(await custRes.json());
      if (salesRes.ok) setSales(await salesRes.json());
      if (expRes.ok) setExpenses(await expRes.json());
      if (netRes.ok) setNetworkInfo(await netRes.json());
      if (setRes.ok) setSettings(await setRes.json());
    } catch {
      // ignore initial startup delay
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Document RTL / LTR direction switch
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Global F2 shortcut to open Barcode Price Inspector
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        setInspectorOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time WebSocket connection for Android <-> Windows instant sync
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'REMOTE_BARCODE_SCANNED' && msg.data?.barcode) {
          setInspectorBarcode(msg.data.barcode);
          setInspectorOpen(true);
          showToast(`📱 Code scanné depuis Android: ${msg.data.barcode}`);
        } else if (
          [
            'PRODUCT_CREATED',
            'PRODUCT_UPDATED',
            'SALE_COMPLETED',
            'PURCHASE_RECORDED',
            'ANDROID_DEVICE_PAIRED',
            'WOO_SYNC_COMPLETED',
          ].includes(msg.type)
        ) {
          fetchAllData();
        }
      } catch {
        // ignore
      }
    };
    return () => ws.close();
  }, [fetchAllData]);

  // POS Helpers
  const addToPosCart = (product: Product, forcedTier?: 'retail' | 'wholesale') => {
    const tier = forcedTier || posPriceTier;
    if (forcedTier) setPosPriceTier(forcedTier);
    const price = tier === 'wholesale' ? product.wholesale_price : product.retail_price;

    setPosCart((prev) => {
      const existingIdx = prev.findIndex((i) => i.product_id === product.id);
      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + 1;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          unit_price: price,
          subtotal: newQty * price,
        };
        return updated;
      }
      return [
        ...prev,
        {
          product_id: product.id,
          product_name: getProductName(product, lang),
          barcode: product.barcode,
          quantity: 1,
          unit_price: price,
          unit_cost: product.current_cost_price,
          serial_number: '',
          warranty_months: product.warranty_months,
          subtotal: price,
        },
      ];
    });
    setActiveTab('pos');
    showToast(`Ajouté à la caisse: ${getProductName(product, lang)}`);
  };

  // Switch all POS items when toggling Retail <-> Wholesale
  const handleTogglePosTier = (newTier: 'retail' | 'wholesale') => {
    setPosPriceTier(newTier);
    setPosCart((prev) =>
      prev.map((item) => {
        const prod = products.find((p) => p.id === item.product_id);
        if (!prod) return item;
        const unitPrice = newTier === 'wholesale' ? prod.wholesale_price : prod.retail_price;
        return {
          ...item,
          unit_price: unitPrice,
          subtotal: unitPrice * item.quantity,
        };
      })
    );
  };

  const handlePosBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = posBarcodeInput.trim();
    if (!code) return;
    const found = products.find(
      (p) =>
        p.barcode === code ||
        p.sku.toLowerCase() === code.toLowerCase() ||
        p.model_number.toLowerCase() === code.toLowerCase()
    );
    if (found) {
      addToPosCart(found);
      setPosBarcodeInput('');
    } else {
      showToast(`Aucun produit trouvé pour le code: ${code}`);
    }
  };

  const posSubtotal = posCart.reduce((acc, i) => acc + i.subtotal, 0);
  const posTotal = Math.max(0, posSubtotal - posDiscount);
  const effectivePaid = posPaidAmount === '' ? posTotal : Number(posPaidAmount);
  const posRemainingDebt = Math.max(0, posTotal - effectivePaid);

  const handleCompleteSale = async () => {
    if (posCart.length === 0) return;
    const selectedCustomer = customers.find((c) => c.id === Number(posCustomerId));
    const res = await fetch('/api/sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: selectedCustomer ? selectedCustomer.id : null,
        customer_name: selectedCustomer ? selectedCustomer.name : 'Client Comptoir',
        price_tier: posPriceTier,
        items: posCart,
        discount: posDiscount,
        paid_amount: effectivePaid,
        payment_method: posRemainingDebt > 0 ? 'installment' : posPaymentMethod,
        installments_count: posRemainingDebt > 0 ? posInstallmentsCount : 0,
        source_device: 'windows_pos',
        notes: posNotes,
      }),
    });

    if (res.ok) {
      const completedSale = await res.json();
      setPosCart([]);
      setPosDiscount(0);
      setPosPaidAmount('');
      setPosNotes('');
      setPrintableSale(completedSale);
      fetchAllData();
      showToast(`✅ Vente ${completedSale.invoice_number} enregistrée avec succès !`);
    }
  };

  // Purchase (Restock) Helpers
  const addProductToPurchase = (p: Product) => {
    setPurchaseItems((prev) => {
      if (prev.some((i) => i.product_id === p.id)) return prev;
      return [
        ...prev,
        {
          product_id: p.id,
          quantity: 5,
          unit_cost: p.current_cost_price,
          new_wholesale_price: p.wholesale_price,
          new_retail_price: p.retail_price,
          serial_numbers_raw: '',
        },
      ];
    });
  };

  const handleRecordPurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (purchaseItems.length === 0) return;
    const totalPurchase = purchaseItems.reduce(
      (sum, i) => sum + i.quantity * i.unit_cost,
      0
    );
    const res = await fetch('/api/purchases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        supplier_id: purchaseSupplierId,
        invoice_number: purchaseInvoiceRef || `BL-2026-${Date.now().toString().slice(-4)}`,
        paid_amount: purchasePaid === '' ? totalPurchase : Number(purchasePaid),
        items: purchaseItems.map((i) => ({
          ...i,
          serial_numbers: i.serial_numbers_raw
            .split(/[,;\n]+/)
            .map((s) => s.trim())
            .filter(Boolean),
        })),
      }),
    });
    if (res.ok) {
      setPurchaseItems([]);
      setPurchaseInvoiceRef('');
      setPurchasePaid('');
      fetchAllData();
      showToast('📦 Arrivage enregistré ! Stocks et Historique des Derniers Prix mis à jour.');
    }
  };

  const handleSyncWooCommerce = async () => {
    setSyncingWoo(true);
    try {
      const res = await fetch('/api/woocommerce/sync', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        await fetchAllData();
        showToast(`🛒 WooCommerce synchronisé (${data.syncedCount} produits mis à jour)`);
      }
    } finally {
      setSyncingWoo(false);
    }
  };

  const openCustomerLedger = async (cust: Customer) => {
    const res = await fetch(`/api/customers/${cust.id}/ledger`);
    if (res.ok) {
      setSelectedCustomerLedger(await res.json());
    }
  };

  const handleCustomerPayment = async (installmentId?: number, customAmount?: number) => {
    if (!selectedCustomerLedger) return;
    const amt = customAmount ?? Number(paymentAmountInput);
    if (!amt || amt <= 0) return;
    const res = await fetch(`/api/customers/${selectedCustomerLedger.customer.id}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amt,
        installment_id: installmentId,
        payment_method: 'cash',
        notes: installmentId ? `Règlement échéance #${installmentId}` : 'Versement libre',
      }),
    });
    if (res.ok) {
      setPaymentAmountInput('');
      await openCustomerLedger(selectedCustomerLedger.customer);
      await fetchAllData();
      showToast('💰 Versement client enregistré avec succès');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    if (!matchesCat) return false;
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return (
      p.barcode.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q) ||
      p.model_number.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.name_fr.toLowerCase().includes(q) ||
      p.name_ar.toLowerCase().includes(q) ||
      p.name_en.toLowerCase().includes(q)
    );
  });

  const categories = ['ALL', ...Array.from(new Set(products.map((p) => p.category)))];

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 end-5 z-50 px-4 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-2xl border border-blue-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-68 bg-slate-900 border-e border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Logo */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-lg">
              ⚡
            </div>
            <div className="overflow-hidden">
              <h1 className="font-extrabold text-sm text-white truncate">
                {settings.store_name || t.appTitle}
              </h1>
              <p className="text-[11px] text-slate-400 truncate">
                Windows Master + Android Wi-Fi
              </p>
            </div>
          </div>

          {/* Quick Barcode Inspector Button */}
          <div className="p-3.5">
            <button
              onClick={() => {
                setInspectorBarcode('');
                setInspectorOpen(true);
              }}
              className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50 transition cursor-pointer"
            >
              <ScanBarcode className="w-4 h-4" />
              <span>{t.quickScanBtn}</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {[
              { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
              {
                id: 'pos',
                label: t.pos,
                icon: ShoppingCart,
                badge: posCart.length > 0 ? posCart.length : undefined,
              },
              { id: 'products', label: t.products, icon: Package },
              { id: 'purchases', label: t.purchases, icon: Truck },
              { id: 'customers', label: t.customers, icon: Users },
              { id: 'expenses', label: t.expenses, icon: Wallet },
              {
                id: 'connect',
                label: t.connectHub,
                icon: Wifi,
                badge: dashboard?.pendingWooSync || undefined,
              },
            ].map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabId)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    active
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Wi-Fi & WooCommerce Live Status */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                Serveur Android Wi-Fi
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="font-mono text-[11px] text-slate-300">
              http://{networkInfo?.primaryIp || '127.0.0.1'}:{networkInfo?.port || 4000}
            </div>
          </div>

          {/* Language Switcher (FR / AR / EN) */}
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['fr', 'ar', 'en'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`py-1.5 rounded-lg text-xs font-bold uppercase transition cursor-pointer ${
                  lang === l
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {l === 'ar' ? 'العربية' : l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 px-6 bg-slate-900/70 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0">
          <div>
            <h2 className="text-base font-bold text-white">
              {activeTab === 'dashboard' && t.dashboard}
              {activeTab === 'pos' && t.pos}
              {activeTab === 'products' && t.products}
              {activeTab === 'purchases' && t.purchases}
              {activeTab === 'customers' && t.customers}
              {activeTab === 'expenses' && t.expenses}
              {activeTab === 'connect' && t.connectHub}
            </h2>
            <p className="text-xs text-slate-400">{t.appSubtitle}</p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSyncWooCommerce}
              disabled={syncingWoo}
              className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncingWoo ? 'animate-spin' : ''}`} />
              <span>
                {t.syncWooNow}
                {dashboard?.pendingWooSync ? ` (${dashboard.pendingWooSync})` : ''}
              </span>
            </button>

            <button
              onClick={() => {
                setEditingProduct(null);
                setProductModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addProductBtn}</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ==============================================================
              TAB 1: DASHBOARD
             ============================================================== */}
          {activeTab === 'dashboard' && dashboard && (
            <div className="space-y-6">
              {/* Top KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>{t.totalRevenue}</span>
                    <ShoppingCart className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-white mt-2">
                    {formatMoney(dashboard.salesStats.totalRevenue, currency)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Encaissé: {formatMoney(dashboard.salesStats.totalCollected, currency)}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>{t.netProfit}</span>
                    <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-emerald-400 mt-2">
                    {formatMoney(dashboard.salesStats.netProfit, currency)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Marge brute: {formatMoney(dashboard.salesStats.grossProfit, currency)} | Charges:{' '}
                    {formatMoney(dashboard.salesStats.totalExpenses, currency)}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>{t.stockValuationCost}</span>
                    <Package className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-black text-white mt-2">
                    {formatMoney(dashboard.productStats.stockValueCost, currency)}
                  </div>
                  <div className="text-xs text-indigo-300 mt-1">
                    Valeur Détail: {formatMoney(dashboard.productStats.stockValueRetail, currency)}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>{t.customerReceivables}</span>
                    <CreditCard className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-amber-400 mt-2">
                    {formatMoney(dashboard.salesStats.totalReceivables, currency)}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Dettes Fournisseurs: {formatMoney(dashboard.salesStats.totalSupplierDebt, currency)}
                  </div>
                </div>
              </div>

              {/* Middle Row: Low Stock Alerts & Upcoming Installments */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Alerts */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-bold text-white">{t.lowStockAlerts}</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('purchases')}
                      className="text-xs text-blue-400 hover:underline cursor-pointer"
                    >
                      Nouvel Arrivage →
                    </button>
                  </div>
                  <div className="divide-y divide-slate-800/70">
                    {dashboard.lowStockProducts.length === 0 ? (
                      <p className="p-5 text-xs text-slate-400">
                        Tous les produits ont un stock suffisant.
                      </p>
                    ) : (
                      dashboard.lowStockProducts.map((p: Product) => (
                        <div
                          key={p.id}
                          className="px-5 py-3 flex items-center justify-between text-xs hover:bg-slate-800/40"
                        >
                          <div>
                            <div className="font-bold text-white">{getProductName(p, lang)}</div>
                            <div className="text-slate-400 font-mono">
                              {p.brand} • EAN: {p.barcode} • Dernier Achat:{' '}
                              {formatMoney(p.current_cost_price, currency)}
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 font-bold">
                            {p.stock_quantity} en stock
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Upcoming Customer Installments */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <h3 className="text-sm font-bold text-white">{t.upcomingInstallments}</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('customers')}
                      className="text-xs text-blue-400 hover:underline cursor-pointer"
                    >
                      Gérer Crédits →
                    </button>
                  </div>
                  <div className="divide-y divide-slate-800/70">
                    {dashboard.upcomingInstallments.length === 0 ? (
                      <p className="p-5 text-xs text-slate-400">Aucune échéance en attente.</p>
                    ) : (
                      dashboard.upcomingInstallments.map((inst: Installment) => (
                        <div
                          key={inst.id}
                          className="px-5 py-3 flex items-center justify-between text-xs hover:bg-slate-800/40"
                        >
                          <div>
                            <div className="font-bold text-white">
                              {inst.customer_name} ({inst.customer_phone})
                            </div>
                            <div className="text-slate-400">
                              Facture {inst.invoice_number} • Tranche #{inst.installment_number} •
                              Échéance: <span className="text-amber-300">{inst.due_date}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-amber-300">
                              {formatMoney(inst.amount, currency)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Sales Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Dernières Ventes & Factures</h3>
                  <button
                    onClick={() => setActiveTab('pos')}
                    className="text-xs text-blue-400 hover:underline cursor-pointer"
                  >
                    Ouvrir la Caisse POS →
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950/60 text-slate-400 border-b border-slate-800">
                        <th className="py-3 px-4">N° Facture</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Client</th>
                        <th className="py-3 px-4">Tarif</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Payé / Reste</th>
                        <th className="py-3 px-4">Source</th>
                        <th className="py-3 px-4 text-right">Facture / Garantie</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {sales.slice(0, 8).map((s) => (
                        <tr key={s.id} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-mono font-bold text-blue-400">
                            {s.invoice_number}
                          </td>
                          <td className="py-3 px-4 text-slate-400">{s.created_at.slice(0, 16)}</td>
                          <td className="py-3 px-4 font-semibold text-white">{s.customer_name}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                                s.price_tier === 'wholesale'
                                  ? 'bg-indigo-500/20 text-indigo-300'
                                  : 'bg-emerald-500/20 text-emerald-300'
                              }`}
                            >
                              {s.price_tier === 'wholesale' ? 'Gros' : 'Détail'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-white">
                            {formatMoney(s.total_amount, currency)}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-emerald-400 font-semibold">
                              {formatMoney(s.paid_amount, currency)}
                            </span>
                            {s.remaining_debt > 0 && (
                              <span className="ms-2 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                                Crédit: {formatMoney(s.remaining_debt, currency)}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[11px] text-slate-400">
                              {s.source_device === 'android_app' ? '📱 Android' : '💻 Windows'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setPrintableSale(s)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" /> Imprimer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              TAB 2: POINT OF SALE (POS)
             ============================================================== */}
          {activeTab === 'pos' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 Cols: Product Picker & Barcode Scanner */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <form onSubmit={handlePosBarcodeSubmit} className="relative flex-1">
                      <ScanBarcode className="w-5 h-5 text-blue-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={posBarcodeInput}
                        onChange={(e) => setPosBarcodeInput(e.target.value)}
                        placeholder="Scanner Code-Barres ou taper Modèle + Entrée..."
                        className="w-full ps-11 pe-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 text-xs font-mono text-white outline-none"
                      />
                    </form>

                    {/* Retail vs Wholesale Switch */}
                    <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleTogglePosTier('retail')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          posPriceTier === 'retail'
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {t.retailMode}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTogglePosTier('wholesale')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          posPriceTier === 'wholesale'
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {t.wholesaleMode}
                      </button>
                    </div>
                  </div>

                  {/* Quick Category Filter */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat === 'ALL' ? 'Tous les rayons' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredProducts.map((p) => {
                    const activePrice =
                      posPriceTier === 'wholesale' ? p.wholesale_price : p.retail_price;
                    return (
                      <div
                        key={p.id}
                        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition flex flex-col justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/15 text-blue-300">
                              {p.brand}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              {p.barcode}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white mt-2 line-clamp-2">
                            {getProductName(p, lang)}
                          </h4>
                          <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                            <span>Stock: {p.stock_quantity}</span>
                            <span>•</span>
                            <span>Garantie: {p.warranty_months}m</span>
                            <span>•</span>
                            <span className="text-amber-300/90">
                              Achat: {formatMoney(p.current_cost_price, currency)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                          <div>
                            <div className="text-base font-extrabold text-white">
                              {formatMoney(activePrice, currency)}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {posPriceTier === 'wholesale'
                                ? `Détail: ${formatMoney(p.retail_price, currency)}`
                                : `Gros: ${formatMoney(p.wholesale_price, currency)}`}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setInspectorBarcode(p.barcode);
                                setInspectorOpen(true);
                              }}
                              title="Voir Historique des Derniers Prix"
                              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 cursor-pointer"
                            >
                              <History className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => addToPosCart(p)}
                              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-4 h-4" /> Ajouter
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right 5 Cols: POS Cart, Customer Credit & Checkout */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-5 h-fit sticky top-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-blue-400" />
                      Panier & Facturation ({posCart.length} articles)
                    </h3>
                    {posCart.length > 0 && (
                      <button
                        onClick={() => setPosCart([])}
                        className="text-xs text-red-400 hover:underline cursor-pointer"
                      >
                        Vider
                      </button>
                    )}
                  </div>

                  {/* Customer Selector */}
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Client (Obligatoire pour Crédit / Facilité de paiement)
                    </label>
                    <select
                      value={posCustomerId}
                      onChange={(e) =>
                        setPosCustomerId(e.target.value ? Number(e.target.value) : '')
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    >
                      <option value="">Client Comptoir (Vente directe)</option>
                      {customers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.phone}) — {c.customer_type === 'wholesale' ? 'GROS' : 'DÉTAIL'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Cart Items */}
                  {posCart.length === 0 ? (
                    <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl p-4">
                      {t.emptyCart}
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-80 overflow-y-auto pe-1">
                      {posCart.map((item, idx) => (
                        <div
                          key={item.product_id}
                          className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="font-bold text-white">{item.product_name}</div>
                            <button
                              onClick={() =>
                                setPosCart(posCart.filter((_, i) => i !== idx))
                              }
                              className="text-slate-500 hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <span className="text-[10px] text-slate-400 block">Quantité</span>
                              <input
                                type="number"
                                min={1}
                                value={item.quantity}
                                onChange={(e) => {
                                  const q = Math.max(1, Number(e.target.value));
                                  const copy = [...posCart];
                                  copy[idx] = {
                                    ...item,
                                    quantity: q,
                                    subtotal: q * item.unit_price,
                                  };
                                  setPosCart(copy);
                                }}
                                className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block">
                                Prix Unitaire ({currency})
                              </span>
                              <input
                                type="number"
                                value={item.unit_price}
                                onChange={(e) => {
                                  const p = Number(e.target.value);
                                  const copy = [...posCart];
                                  copy[idx] = {
                                    ...item,
                                    unit_price: p,
                                    subtotal: item.quantity * p,
                                  };
                                  setPosCart(copy);
                                }}
                                className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-emerald-300 font-bold"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block">
                                N° Série (Garantie)
                              </span>
                              <input
                                type="text"
                                placeholder="S/N optionnel"
                                value={item.serial_number}
                                onChange={(e) => {
                                  const copy = [...posCart];
                                  copy[idx] = { ...item, serial_number: e.target.value };
                                  setPosCart(copy);
                                }}
                                className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Totals & Payment / Installment Controls */}
                <div className="pt-4 border-t border-slate-800 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Remise Globale ({currency})</label>
                      <input
                        type="number"
                        value={posDiscount}
                        onChange={(e) => setPosDiscount(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">
                        Montant Versé Aujourd’hui
                      </label>
                      <input
                        type="number"
                        placeholder={String(posTotal)}
                        value={posPaidAmount}
                        onChange={(e) =>
                          setPosPaidAmount(
                            e.target.value === '' ? '' : Number(e.target.value)
                          )
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-300 font-bold"
                      />
                    </div>
                  </div>

                  {posRemainingDebt > 0 && (
                    <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-2">
                      <div className="flex justify-between font-bold text-amber-300">
                        <span>Reste à Payer (Crédit Client) :</span>
                        <span>{formatMoney(posRemainingDebt, currency)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-slate-300">Nombre de mensualités :</span>
                        <select
                          value={posInstallmentsCount}
                          onChange={(e) => setPosInstallmentsCount(Number(e.target.value))}
                          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-white"
                        >
                          <option value={1}>1 mois ({formatMoney(posRemainingDebt, currency)})</option>
                          <option value={2}>
                            2 mois ({formatMoney(posRemainingDebt / 2, currency)}/m)
                          </option>
                          <option value={3}>
                            3 mois ({formatMoney(posRemainingDebt / 3, currency)}/m)
                          </option>
                          <option value={6}>
                            6 mois ({formatMoney(posRemainingDebt / 6, currency)}/m)
                          </option>
                          <option value={12}>
                            12 mois ({formatMoney(posRemainingDebt / 12, currency)}/m)
                          </option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-300">Total Net à Payer</span>
                    <span className="text-2xl font-black text-emerald-400">
                      {formatMoney(posTotal, currency)}
                    </span>
                  </div>

                  <button
                    onClick={handleCompleteSale}
                    disabled={posCart.length === 0}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{t.checkoutBtn}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              TAB 3: PRODUCTS & PRICE HISTORY CATALOG
             ============================================================== */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full ps-10 pe-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-blue-500"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c === 'ALL' ? 'Toutes les Catégories' : c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Products Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-950/70 text-slate-400 border-b border-slate-800">
                        <th className="py-3.5 px-4">Produit & Code-Barres</th>
                        <th className="py-3.5 px-4">Dernier Prix Achat</th>
                        <th className="py-3.5 px-4">Prix Achat Actuel</th>
                        <th className="py-3.5 px-4">Prix Vente GROS</th>
                        <th className="py-3.5 px-4">Prix Vente DÉTAIL</th>
                        <th className="py-3.5 px-4">Stock & Garantie</th>
                        <th className="py-3.5 px-4">Sync Woo</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-800/40">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 font-bold text-[10px]">
                                {p.brand}
                              </span>
                              <span className="font-mono text-slate-400">{p.barcode}</span>
                            </div>
                            <div className="font-bold text-white text-sm mt-1">
                              {getProductName(p, lang)}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Modèle: {p.model_number || p.sku} • {p.category}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-purple-300">
                            {formatMoney(p.last_cost_price, currency)}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-amber-300">
                            {formatMoney(p.current_cost_price, currency)}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-indigo-300">
                            {formatMoney(p.wholesale_price, currency)}
                          </td>
                          <td className="py-3.5 px-4 font-extrabold text-emerald-400 text-sm">
                            {formatMoney(p.retail_price, currency)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded font-bold ${
                                p.stock_quantity > p.min_stock_alert
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-red-500/20 text-red-300'
                              }`}
                            >
                              {p.stock_quantity} unités
                            </span>
                            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-400" />
                              Garantie {p.warranty_months} mois
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                p.woo_sync_status === 'synced'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              {p.woo_sync_status === 'synced' ? 'Synchronisé' : 'En attente'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => {
                                setInspectorBarcode(p.barcode);
                                setInspectorOpen(true);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-semibold inline-flex items-center gap-1 cursor-pointer"
                              title="Historique des Derniers Prix & Numéros de Série"
                            >
                              <History className="w-3.5 h-3.5" /> Derniers Prix
                            </button>
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setProductModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 inline-flex cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              TAB 4: PURCHASES / RESTOCKING & SUPPLIERS
             ============================================================== */}
          {activeTab === 'purchases' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 Cols: Record New Purchase Order (Updates Last Buying Prices) */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Enregistrer une Facture d’Achat / Nouvel Arrivage
                  </h3>
                  <p className="text-xs text-slate-400">
                    Met à jour automatiquement le Stock, le Dernier Prix d’Achat, et l’Historique des Prix
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">Fournisseur</label>
                    <select
                      value={purchaseSupplierId}
                      onChange={(e) => setPurchaseSupplierId(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    >
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} — {s.company}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">N° Bon de Livraison / Facture</label>
                    <input
                      type="text"
                      placeholder="ex: BL-2026-105"
                      value={purchaseInvoiceRef}
                      onChange={(e) => setPurchaseInvoiceRef(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>

                {/* Select Product to Add to Purchase Batch */}
                <div className="text-xs">
                  <label className="block text-slate-400 mb-1">
                    Sélectionner un produit reçu dans cet arrivage :
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {products.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => addProductToPurchase(p)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-blue-600/30 border border-slate-700 text-slate-200 cursor-pointer"
                      >
                        + {p.brand} {p.model_number || p.sku}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Purchase Items List */}
                <form onSubmit={handleRecordPurchase} className="space-y-3">
                  {purchaseItems.map((item, idx) => {
                    const prod = products.find((p) => p.id === item.product_id);
                    return (
                      <div
                        key={item.product_id}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs"
                      >
                        <div className="flex justify-between font-bold text-white">
                          <span>
                            {prod ? getProductName(prod, lang) : ''} (Ancien achat:{' '}
                            {formatMoney(prod?.current_cost_price, currency)})
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setPurchaseItems(purchaseItems.filter((_, i) => i !== idx))
                            }
                            className="text-red-400"
                          >
                            Retirer
                          </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Qté Reçue</span>
                            <input
                              type="number"
                              min={1}
                              value={item.quantity}
                              onChange={(e) => {
                                const copy = [...purchaseItems];
                                copy[idx].quantity = Number(e.target.value);
                                setPurchaseItems(copy);
                              }}
                              className="w-full px-2 py-1.5 rounded bg-slate-900 border border-slate-700 text-white font-bold"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-amber-300 block">
                              Nouveau Prix Achat
                            </span>
                            <input
                              type="number"
                              value={item.unit_cost}
                              onChange={(e) => {
                                const copy = [...purchaseItems];
                                copy[idx].unit_cost = Number(e.target.value);
                                setPurchaseItems(copy);
                              }}
                              className="w-full px-2 py-1.5 rounded bg-slate-900 border border-amber-500/40 text-amber-300 font-bold"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-indigo-300 block">
                              Nouveau Prix Gros
                            </span>
                            <input
                              type="number"
                              value={item.new_wholesale_price}
                              onChange={(e) => {
                                const copy = [...purchaseItems];
                                copy[idx].new_wholesale_price = Number(e.target.value);
                                setPurchaseItems(copy);
                              }}
                              className="w-full px-2 py-1.5 rounded bg-slate-900 border border-indigo-500/40 text-indigo-300 font-bold"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-emerald-300 block">
                              Nouveau Prix Détail
                            </span>
                            <input
                              type="number"
                              value={item.new_retail_price}
                              onChange={(e) => {
                                const copy = [...purchaseItems];
                                copy[idx].new_retail_price = Number(e.target.value);
                                setPurchaseItems(copy);
                              }}
                              className="w-full px-2 py-1.5 rounded bg-slate-900 border border-emerald-500/40 text-emerald-300 font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {purchaseItems.length > 0 && (
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer"
                    >
                      Valider l’Arrivage & Mettre à Jour les Stocks et Derniers Prix
                    </button>
                  )}
                </form>
              </div>

              {/* Right 5 Cols: Suppliers Directory & Recent Purchases */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white">Fournisseurs & Dettes</h3>
                  <div className="space-y-2">
                    {suppliers.map((s) => (
                      <div
                        key={s.id}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-white">{s.company || s.name}</div>
                          <div className="text-slate-400">
                            {s.name} • {s.phone}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Reste à payer</span>
                          <span className="font-bold text-amber-400">
                            {formatMoney(s.balance_owed, currency)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Add Supplier */}
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!newSupplierForm.name) return;
                      await fetch('/api/suppliers', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newSupplierForm),
                      });
                      setNewSupplierForm({ name: '', company: '', phone: '' });
                      fetchAllData();
                    }}
                    className="pt-3 border-t border-slate-800 grid grid-cols-3 gap-2 text-xs"
                  >
                    <input
                      type="text"
                      placeholder="Nom contact"
                      value={newSupplierForm.name}
                      onChange={(e) =>
                        setNewSupplierForm({ ...newSupplierForm, name: e.target.value })
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Société / Marque"
                      value={newSupplierForm.company}
                      onChange={(e) =>
                        setNewSupplierForm({ ...newSupplierForm, company: e.target.value })
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
                    >
                      + Fournisseur
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              TAB 5: CUSTOMERS, CREDIT & INSTALLMENTS LEDGER
             ============================================================== */}
          {activeTab === 'customers' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white">
                  Répertoire Clients & Suivi des Crédits / Facilités
                </h3>

                <div className="space-y-2.5">
                  {customers.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => openCustomerLedger(c)}
                      className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs ${
                        selectedCustomerLedger?.customer.id === c.id
                          ? 'bg-blue-950/30 border-blue-500'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-white">{c.name}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] uppercase text-slate-300">
                            {c.customer_type === 'wholesale' ? 'Revendeur Gros' : 'Client Détail'}
                          </span>
                        </div>
                        <div className="text-slate-400 mt-1">
                          Tél: {c.phone} • Total acheté: {formatMoney(c.total_spent, currency)}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Dette / Crédit Actuel</span>
                        <span
                          className={`text-sm font-extrabold ${
                            c.total_debt > 0 ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        >
                          {formatMoney(c.total_debt, currency)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Customer */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newCustomerForm.name) return;
                    await fetch('/api/customers', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newCustomerForm),
                    });
                    setNewCustomerForm({
                      name: '',
                      phone: '',
                      address: '',
                      customer_type: 'retail',
                    });
                    fetchAllData();
                  }}
                  className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs"
                >
                  <input
                    type="text"
                    required
                    placeholder="Nom complet du client"
                    value={newCustomerForm.name}
                    onChange={(e) =>
                      setNewCustomerForm({ ...newCustomerForm, name: e.target.value })
                    }
                    className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Téléphone"
                    value={newCustomerForm.phone}
                    onChange={(e) =>
                      setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })
                    }
                    className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                  <select
                    value={newCustomerForm.customer_type}
                    onChange={(e) =>
                      setNewCustomerForm({ ...newCustomerForm, customer_type: e.target.value })
                    }
                    className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="retail">Client Détail</option>
                    <option value="wholesale">Acheteur en Gros</option>
                  </select>
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
                  >
                    + Ajouter Client
                  </button>
                </form>
              </div>

              {/* Customer Installments & Debt Collection Drawer */}
              <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                {!selectedCustomerLedger ? (
                  <div className="py-16 text-center text-xs text-slate-500">
                    Cliquez sur un client à gauche pour voir son échéancier de paiement et encaisser un versement.
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="text-base font-bold text-white">
                          Dossier Crédit : {selectedCustomerLedger.customer.name}
                        </h3>
                        <p className="text-xs text-slate-400">
                          Reste total à recouvrer :{' '}
                          <span className="text-amber-400 font-bold">
                            {formatMoney(selectedCustomerLedger.customer.total_debt, currency)}
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Montant versement..."
                          value={paymentAmountInput}
                          onChange={(e) => setPaymentAmountInput(e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white w-36"
                        />
                        <button
                          onClick={() => handleCustomerPayment()}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                        >
                          Encaisser
                        </button>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold uppercase text-slate-400">
                      Échéancier des Mensualités
                    </h4>
                    <div className="space-y-2">
                      {selectedCustomerLedger.installments.length === 0 ? (
                        <p className="text-xs text-slate-500">Aucune mensualité programmée.</p>
                      ) : (
                        selectedCustomerLedger.installments.map((inst) => (
                          <div
                            key={inst.id}
                            className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-bold text-white">
                                Tranche #{inst.installment_number} — Facture {inst.invoice_number}
                              </div>
                              <div className="text-slate-400">Échéance : {inst.due_date}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-amber-300">
                                {formatMoney(inst.amount, currency)}
                              </span>
                              {inst.status === 'paid' ? (
                                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                                  Payé
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleCustomerPayment(inst.id, inst.amount)}
                                  className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer"
                                >
                                  Régler Tranche
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ==============================================================
              TAB 6: STORE EXPENSES & CHARGES
             ============================================================== */}
          {activeTab === 'expenses' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 h-fit">
                <h3 className="text-sm font-bold text-white">Ajouter une Dépense / Charge Magasin</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!expenseForm.title || !expenseForm.amount) return;
                    await fetch('/api/expenses', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(expenseForm),
                    });
                    setExpenseForm({
                      ...expenseForm,
                      title: '',
                      amount: '',
                      notes: '',
                    });
                    fetchAllData();
                    showToast('Dépense enregistrée');
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="block text-slate-400 mb-1">Intitulé de la dépense *</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Loyer Showroom, Facture Électricité, Livraison..."
                      value={expenseForm.title}
                      onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Catégorie</label>
                      <select
                        value={expenseForm.category}
                        onChange={(e) =>
                          setExpenseForm({ ...expenseForm, category: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                      >
                        <option value="rent">Loyer & Local</option>
                        <option value="utilities">Électricité, Eau, Internet</option>
                        <option value="salaries">Salaires & Personnel</option>
                        <option value="transport">Transport & Livraison</option>
                        <option value="marketing">Publicité & Sponsoring</option>
                        <option value="other">Autres Charges</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Montant ({currency}) *</label>
                      <input
                        type="number"
                        required
                        value={expenseForm.amount}
                        onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
                  >
                    Enregistrer la Dépense
                  </button>
                </form>
              </div>

              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white">Journal des Charges & Dépenses</h3>
                <div className="divide-y divide-slate-800 text-xs">
                  {expenses.map((exp) => (
                    <div key={exp.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">{exp.title}</div>
                        <div className="text-slate-400">
                          {exp.expense_date} • Catégorie: {exp.category}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-red-400">
                          -{formatMoney(exp.amount, currency)}
                        </span>
                        <button
                          onClick={async () => {
                            await fetch(`/api/expenses/${exp.id}`, { method: 'DELETE' });
                            fetchAllData();
                          }}
                          className="text-slate-500 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              TAB 7: ANDROID WI-FI PAIRING HUB, WOOCOMMERCE & AI SETTINGS
             ============================================================== */}
          {activeTab === 'connect' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 6 Cols: Android Wi-Fi Pairing QR Code & Live Simulator */}
              <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Connexion Application Android (Même Réseau Wi-Fi)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Scannez ce QR Code depuis l’application Android pour relier le téléphone instantanément
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="p-3 bg-white rounded-xl shrink-0">
                    <QRCodeSVG
                      value={
                        networkInfo?.qrPayload ||
                        JSON.stringify({ host: '127.0.0.1', port: 4000 })
                      }
                      size={148}
                    />
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 block">Adresse IP Locale Windows :</span>
                      <span className="font-mono text-sm font-bold text-emerald-400">
                        http://{networkInfo?.primaryIp || '127.0.0.1'}:{networkInfo?.port || 4000}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Clé de sécurité Wi-Fi :</span>
                      <span className="font-mono font-bold text-white">
                        {networkInfo?.pairingToken}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      L’application Android utilise cette API locale pour scanner les codes-barres, afficher le Prix Détail, le Prix de Gros, les Derniers Prix d’Achat, ajouter des produits et envoyer des ventes POS.
                    </p>
                  </div>
                </div>

                {/* Test Android Wi-Fi Pairing & Remote Scan */}
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700 space-y-3">
                  <h4 className="text-xs font-bold text-blue-300">
                    Simulateur de Test Rapide API Android :
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={async () => {
                        await fetch('/api/android/pair', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            deviceId: 'ANDROID-GALAXY-S24',
                            deviceName: 'Samsung Galaxy S24 (Scanner Magasin)',
                            token: networkInfo?.pairingToken,
                          }),
                        });
                        fetchAllData();
                        showToast('📱 Appareil Android jumelé avec succès sur le Wi-Fi !');
                      }}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Simuler Jumelage Téléphone Android
                    </button>
                    <button
                      onClick={() => {
                        setInspectorBarcode('8806094892154');
                        setInspectorOpen(true);
                      }}
                      className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
                    >
                      Tester Scan Code-Barres Android (TV Samsung)
                    </button>
                  </div>

                  {networkInfo?.pairedDevices && networkInfo.pairedDevices.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[11px] text-slate-400 font-semibold">
                        Appareils Android Connectés :
                      </span>
                      {networkInfo.pairedDevices.map((d) => (
                        <div
                          key={d.id}
                          className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <span className="font-semibold text-white">📱 {d.device_name}</span>
                          <span className="text-emerald-400 font-mono text-[11px]">
                            En ligne ({d.last_seen.slice(11, 16)})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right 6 Cols: WooCommerce REST API v3 & AI Configuration */}
              <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Configuration WooCommerce / WordPress & IA
                    </h3>
                    <p className="text-xs text-slate-400">
                      Synchronisation automatique des stocks et génération IA des fiches produits
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await fetch('/api/settings', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(settings),
                    });
                    showToast('⚙️ Paramètres enregistrés avec succès');
                  }}
                  className="space-y-3.5 text-xs"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Nom du Magasin</label>
                      <input
                        type="text"
                        value={settings.store_name || ''}
                        onChange={(e) =>
                          setSettings({ ...settings, store_name: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Devise (DA, MAD, TND, EUR)</label>
                      <input
                        type="text"
                        value={settings.currency || 'DA'}
                        onChange={(e) =>
                          setSettings({ ...settings, currency: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">
                      URL de votre site WordPress / WooCommerce
                    </label>
                    <input
                      type="url"
                      placeholder="https://votreboutique.com"
                      value={settings.woo_url || ''}
                      onChange={(e) => setSettings({ ...settings, woo_url: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">
                        WooCommerce Consumer Key (ck_...)
                      </label>
                      <input
                        type="password"
                        placeholder="ck_xxxxxxxxxxxxxxxx"
                        value={settings.woo_consumer_key || ''}
                        onChange={(e) =>
                          setSettings({ ...settings, woo_consumer_key: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">
                        WooCommerce Consumer Secret (cs_...)
                      </label>
                      <input
                        type="password"
                        placeholder="cs_xxxxxxxxxxxxxxxx"
                        value={settings.woo_consumer_secret || ''}
                        onChange={(e) =>
                          setSettings({ ...settings, woo_consumer_secret: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Clé API Google Gemini (Optionnel — pour génération IA avancée)
                    </label>
                    <input
                      type="password"
                      placeholder="AIzaSy..."
                      value={settings.ai_api_key || ''}
                      onChange={(e) =>
                        setSettings({ ...settings, ai_api_key: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer"
                  >
                    Sauvegarder la Configuration
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <BarcodeInspectorModal
        isOpen={inspectorOpen}
        onClose={() => setInspectorOpen(false)}
        initialBarcode={inspectorBarcode}
        products={products}
        lang={lang}
        currency={currency}
        onAddToPos={addToPosCart}
        onEditProduct={(p) => {
          setEditingProduct(p);
          setProductModalOpen(true);
        }}
        onRefresh={fetchAllData}
      />

      <ProductFormModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        editingProduct={editingProduct}
        lang={lang}
        currency={currency}
        onSaved={() => {
          fetchAllData();
          showToast('Produit sauvegardé et ajouté à la file WooCommerce');
        }}
      />

      <InvoiceWarrantyModal
        sale={printableSale}
        onClose={() => setPrintableSale(null)}
        storeName={settings.store_name || 'ElectroMaison Pro'}
        storePhone={settings.store_phone || '+213 550 12 34 56'}
        storeAddress={settings.store_address || 'Centre-Ville'}
        currency={currency}
      />
    </div>
  );
}
export default App;
