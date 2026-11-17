// Crisp 1.75px stroke monochrome SVG icons (Zero emojis)
const ICONS = {
  dashboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>`,
  pos: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
  products: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  purchases: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
  customers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  expenses: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>`,
  connect: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
  barcode: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 5v14"/><path d="M8 5v14"/><path d="M12 5v14"/><path d="M17 5v14"/><path d="M21 5v14"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  sync: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
  print: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`,
  history: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  quotations: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>`,
  reports: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
};

const I18N = {
  fr: {
    dashboard: 'Vue d’ensemble',
    pos: 'Caisse & Facturation',
    products: 'Catalogue & Tarifs',
    quotations: 'Devis & SAV Atelier',
    purchases: 'Achats & Réceptions',
    customers: 'Clients & Échéanciers',
    expenses: 'Charges & Trésorerie',
    reports: 'Rapports P&L & Stock',
    connect: 'Terminaux & WooCommerce',
    quickScanBtn: 'Vérificateur de Prix',
    addProductBtn: 'Nouvel Article',
    syncWooBtn: 'Sync WooCommerce',
    retailMode: 'Tarif Détail',
    wholesaleMode: 'Tarif Gros',
    retailPrice: 'Prix Détail',
    wholesalePrice: 'Prix Gros',
    currentBuyingPrice: "Coût d'Achat",
    lastBuyingPrice: 'Dernier Achat',
    priceHistoryTitle: "Historique des Coûts d'Acquisition",
  },
  ar: {
    dashboard: 'لوحة القيادة',
    pos: 'نقطة البيع والفوترة',
    products: 'المنتجات والأسعار',
    quotations: 'عروض الأسعار والصيانة',
    purchases: 'المشتريات والتموين',
    customers: 'الزبائن والأقساط',
    expenses: 'المصاريف والخزينة',
    reports: 'التقارير والأرباح',
    connect: 'ربط أندرويد وووكومرس',
    quickScanBtn: 'كاشف الأسعار والباركود',
    addProductBtn: 'إضافة منتج',
    syncWooBtn: 'مزامنة المتجر',
    retailMode: 'سعر التجزئة',
    wholesaleMode: 'سعر الجملة',
    retailPrice: 'سعر التجزئة',
    wholesalePrice: 'سعر الجملة',
    currentBuyingPrice: 'سعر الشراء الحالي',
    lastBuyingPrice: 'آخر سعر شراء',
    priceHistoryTitle: 'سجل أسعار الشراء السابقة من الموردين',
  },
  en: {
    dashboard: 'Overview',
    pos: 'Point of Sale',
    products: 'Catalog & Pricing',
    quotations: 'Quotations & Repair',
    purchases: 'Purchase Orders',
    customers: 'Customers & Credit',
    expenses: 'Expenses & Cashflow',
    reports: 'Profit & Stock Reports',
    connect: 'Android & WooCommerce',
    quickScanBtn: 'Price Lookup',
    addProductBtn: 'New Item',
    syncWooBtn: 'Sync WooCommerce',
    retailMode: 'Retail Tier',
    wholesaleMode: 'Wholesale Tier',
    retailPrice: 'Retail Price',
    wholesalePrice: 'Wholesale Price',
    currentBuyingPrice: 'Current Cost',
    lastBuyingPrice: 'Last Cost',
    priceHistoryTitle: 'Historical Buying Costs',
  },
};

const state = {
  lang: 'fr',
  theme: localStorage.getItem('ez_theme_v2') || 'light',
  activeTab: 'dashboard',
  dashRange: 'all',
  pnlRange: '30d',
  quotationsSubTab: 'quotes',
  reportsSubTab: 'pnl',
  dashboard: null,
  quotations: [],
  serviceJobs: [],
  stockAdjustments: [],
  pnlReport: null,
  products: [],
  suppliers: [],
  purchases: [],
  customers: [],
  sales: [],
  expenses: [],
  networkInfo: null,
  settings: {
    store_name: 'ELECTROZEN',
    store_phone: '+212 522 48 91 00',
    store_address: 'Quartier Maarif, Casablanca',
    currency: 'MAD',
  },
  productSearch: '',
  selectedCategory: 'ALL',
  posPriceTier: 'retail',
  posCart: [],
  posCustomerId: '',
  posDiscount: 0,
  posDiscountMode: 'mad',
  posDrafts: JSON.parse(localStorage.getItem('ez_pos_drafts') || '[]'),
  posDraftModalOpen: false,
  posCalcOpen: false,
  posCalcDisplay: '0',
  todaySalesModalOpen: false,
  printableQuote: null,
  posPaidAmount: '',
  posPaymentMethod: 'cash',
  posInstallmentsCount: 3,
  quickCustomerModalOpen: false,
  purchaseSupplierId: 1,
  purchaseInvoiceRef: '',
  purchasePaidAmount: '',
  purchaseItems: [],
  customerLedger: null,
  freePaymentAmount: '',
  inspectorOpen: false,
  inspectorData: null,
  inspectorBarcode: '',
  productModalOpen: false,
  editingProduct: null,
  prefillProduct: null,
  internetLookupBanner: null, // { ok: bool, msg: string }
  cameraScanActive: false,
  printableSale: null,
  printFormat: 'a4', // 'a4' | 'thermal'
  barcodeLabelProduct: null,
  posViewMode: 'table', // 'table' | 'grid'
  posCashReceived: '',
  users: [],
  currentUser: JSON.parse(localStorage.getItem('ez_current_user') || 'null') || {
    id: 1,
    username: 'admin',
    full_name: 'Admin ELECTROZEN',
    role: 'admin',
  },
  cashSession: null,
  backups: [],
  auditLogs: [],
  pinModalOpen: false,
  cashModalMode: null, // null | 'open' | 'close'
  resetModalOpen: false,
  toast: null,
};

function numberToFrenchWords(n) {
  const num = Math.floor(Math.abs(Number(n || 0)));
  if (num === 0) return 'zéro dirham';
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];
  function under100(x) {
    if (x < 20) return units[x];
    const t = Math.floor(x / 10);
    const u = x % 10;
    if (t === 7 || t === 9) return tens[t] + '-' + units[10 + u];
    if (u === 0) return tens[t] + (t === 8 ? 's' : '');
    if (u === 1 && t !== 8) return tens[t] + ' et un';
    return tens[t] + '-' + units[u];
  }
  function under1000(x) {
    const h = Math.floor(x / 100);
    const r = x % 100;
    let out = '';
    if (h === 1) out = 'cent';
    else if (h > 1) out = units[h] + ' cent' + (r === 0 ? 's' : '');
    if (r > 0) out += (out ? ' ' : '') + under100(r);
    return out;
  }
  const millions = Math.floor(num / 1000000);
  const thousands = Math.floor((num % 1000000) / 1000);
  const rest = num % 1000;
  const parts = [];
  if (millions > 0) parts.push(under1000(millions) + ' million' + (millions > 1 ? 's' : ''));
  if (thousands === 1) parts.push('mille');
  else if (thousands > 1) parts.push(under1000(thousands) + ' mille');
  if (rest > 0) parts.push(under1000(rest));
  const dec = Math.round((Math.abs(Number(n || 0)) - num) * 100);
  return parts.join(' ') + (num > 1 ? ' dirhams' : ' dirham') + (dec > 0 ? ` et ${dec} centimes` : '');
}

function fmtMoney(val) {
  const num = Number(val || 0);
  const cur = state.settings.currency || 'MAD';
  return `${num.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${cur}`;
}

function getProdName(p) {
  if (!p) return '';
  if (state.lang === 'ar') return p.name_ar || p.name_fr || p.name_en;
  if (state.lang === 'en') return p.name_en || p.name_fr || p.name_ar;
  return p.name_fr || p.name_en || p.name_ar;
}

function showToast(msg) {
  state.toast = msg;
  render();
  setTimeout(() => {
    if (state.toast === msg) {
      state.toast = null;
      render();
    }
  }, 3200);
}

async function loadAllData() {
  const [dash, prods, sups, purs, custs, sales, exps, net, sets, users, cashSess, backups, auditLogs, quotes, svcJobs, stockAdjs, pnlRep] = await Promise.all([
    fetch(`/api/dashboard?range=${encodeURIComponent(state.dashRange || 'all')}`).then((r) => r.json()),
    fetch('/api/products').then((r) => r.json()),
    fetch('/api/suppliers').then((r) => r.json()),
    fetch('/api/purchases').then((r) => r.json()),
    fetch('/api/customers').then((r) => r.json()),
    fetch('/api/sales').then((r) => r.json()),
    fetch('/api/expenses').then((r) => r.json()),
    fetch('/api/network-info').then((r) => r.json()),
    fetch('/api/settings').then((r) => r.json()),
    fetch('/api/users').then((r) => r.json()).catch(() => []),
    fetch('/api/cash-session').then((r) => r.json()).catch(() => null),
    fetch('/api/backups').then((r) => r.json()).catch(() => []),
    fetch('/api/audit-log').then((r) => r.json()).catch(() => []),
    fetch('/api/quotations').then((r) => r.json()).catch(() => []),
    fetch('/api/service-jobs').then((r) => r.json()).catch(() => []),
    fetch('/api/stock-adjustments').then((r) => r.json()).catch(() => []),
    fetch(`/api/reports/profit-loss?range=${encodeURIComponent(state.pnlRange || '30d')}`).then((r) => r.json()).catch(() => null),
  ]);
  state.dashboard = dash;
  state.products = prods;
  state.suppliers = sups;
  state.purchases = purs;
  state.customers = custs;
  state.sales = sales;
  state.expenses = exps;
  state.networkInfo = net;
  state.settings = sets;
  state.users = Array.isArray(users) ? users : [];
  state.cashSession = cashSess;
  state.backups = Array.isArray(backups) ? backups : [];
  state.auditLogs = Array.isArray(auditLogs) ? auditLogs : [];
  state.quotations = Array.isArray(quotes) ? quotes : [];
  state.serviceJobs = Array.isArray(svcJobs) ? svcJobs : [];
  state.stockAdjustments = Array.isArray(stockAdjs) ? stockAdjs : [];
  state.pnlReport = pnlRep;
  render();
}

async function openBarcodeInspector(barcode) {
  state.inspectorOpen = true;
  const target = barcode || state.products[0]?.barcode || '';
  state.inspectorBarcode = target;
  if (target) {
    const res = await fetch(`/api/products/barcode/${encodeURIComponent(target)}`);
    if (res.ok) {
      state.inspectorData = await res.json();
    } else {
      state.inspectorData = { error: `Aucun article trouvé pour la référence : ${target}` };
    }
  }
  render();
}

function addToPosCart(product, forcedTier) {
  const tier = forcedTier || state.posPriceTier;
  if (forcedTier) state.posPriceTier = forcedTier;
  const price = tier === 'wholesale' ? product.wholesale_price : product.retail_price;
  const existing = state.posCart.find((i) => i.product_id === product.id);
  const defaultSn =
    Array.isArray(product.available_serials) && product.available_serials.length > 0
      ? product.available_serials[0]
      : '';

  if (existing) {
    existing.quantity += 1;
    existing.unit_price = price;
    existing.subtotal = existing.quantity * price;
  } else {
    state.posCart.push({
      product_id: product.id,
      product_name: getProdName(product),
      barcode: product.barcode,
      quantity: 1,
      unit_price: price,
      unit_cost: product.current_cost_price,
      serial_number: defaultSn,
      available_serials: product.available_serials || [],
      warranty_months: product.warranty_months,
      subtotal: price,
    });
  }
  state.activeTab = 'pos';
  showToast(`Ajouté au ticket : ${getProdName(product)}`);
}

function switchPosTier(newTier) {
  state.posPriceTier = newTier;
  state.posCart.forEach((item) => {
    const p = state.products.find((prod) => prod.id === item.product_id);
    if (p) {
      item.unit_price = newTier === 'wholesale' ? p.wholesale_price : p.retail_price;
      item.subtotal = item.unit_price * item.quantity;
    }
  });
  render();
}

function renderPairingQrSvg(text) {
  try {
    if (typeof window.qrcode === 'function') {
      const qr = window.qrcode(0, 'M');
      qr.addData(String(text || 'ELECTROZEN-POS-2026'));
      qr.make();
      return `<div style="width:144px;height:144px;background:#fff;border:1px solid var(--border);border-radius:10px;padding:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0">${qr.createSvgTag({ cellSize: 4, margin: 1, scalable: true })}</div>`;
    }
  } catch {}
  return `<div style="width:144px;height:144px;background:#fff;border:1px solid var(--border);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--ink-400);text-align:center;padding:8px">QR Indisponible</div>`;
}

// Render 1D linear barcode SVG for printable shelf/product labels
function renderLinearBarcodeSvg(code) {
  const str = String(code || '6111245001928');
  let bars = '';
  let x = 10;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    const w1 = (ch % 3) + 1.5;
    const g1 = ((ch >> 1) % 2) + 1.5;
    const w2 = ((ch >> 2) % 3) + 1;
    const g2 = 2;
    bars += `<rect x="${x}" y="6" width="${w1}" height="44" fill="#000"/>`;
    x += w1 + g1;
    bars += `<rect x="${x}" y="6" width="${w2}" height="44" fill="#000"/>`;
    x += w2 + g2;
  }
  return `<svg width="${x + 10}" height="56" viewBox="0 0 ${x + 10} 56" style="background:#fff">${bars}</svg>`;
}

function getFilteredProducts() {
  return state.products.filter((p) => {
    if (state.selectedCategory !== 'ALL' && p.category !== state.selectedCategory) return false;
    if (!state.productSearch.trim()) return true;
    const q = state.productSearch.toLowerCase();
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
}

function renderCatalogRows(filteredProducts) {
  const isAdmin = (state.currentUser?.role || 'admin') !== 'caissier';
  return filteredProducts
    .map(
      (p) => `
    <tr>
      <td>
        <div class="mono" style="font-weight:600;color:var(--ink-900);font-size:12px">${p.barcode}</div>
        <div class="mono" style="font-size:11px;color:var(--ink-400)">${p.model_number || p.sku}</div>
        <div style="margin-top:3px">
          <span class="site-badge site-badge-ez">${p.brand ? p.brand.toUpperCase() : 'ELECTROZEN'}</span>
        </div>
      </td>
      <td>
        <div style="display:flex;align-items:center;gap:10px">
          ${
            p.image_url
              ? `<img src="${p.image_url}" class="prod-thumb" alt="" loading="lazy" />`
              : `<div class="prod-thumb" style="display:flex;align-items:center;justify-content:center;font-weight:700;font-size:10px;color:#64748b">${(p.brand || 'EZ').slice(0, 3)}</div>`
          }
          <div>
            <div style="font-weight:600;color:var(--ink-900)">${getProdName(p)}</div>
            <div style="font-size:11px;color:var(--ink-400)">${p.brand} • ${p.category} • Garantie ${p.warranty_months}m</div>
          </div>
        </div>
      </td>
      <td class="num" style="text-align:end">
        <div style="font-weight:600;color:var(--ink-900)">${isAdmin ? fmtMoney(p.current_cost_price) : '••••'}</div>
        <div style="font-size:10.5px;color:var(--ink-400)">Dernier: ${isAdmin ? fmtMoney(p.last_cost_price) : '••••'}</div>
      </td>
      <td class="num" style="text-align:end;font-weight:600;color:var(--ink-700)">${fmtMoney(p.wholesale_price)}</td>
      <td class="num" style="text-align:end;font-weight:700;color:#bd2424;font-size:13px">
        ${p.regular_price > p.retail_price ? `<div class="price-old num">${fmtMoney(p.regular_price)}</div>` : ''}
        <div>${fmtMoney(p.retail_price)}</div>
      </td>
      <td style="text-align:center">
        <span class="tag ${p.stock_quantity > p.min_stock_alert ? 'tag-ok' : 'tag-danger'} num">${p.stock_quantity}</span>
      </td>
      <td>
        <span class="tag ${p.woo_sync_status === 'synced' ? 'tag-ok' : 'tag-warn'}">
          ${p.woo_sync_status === 'synced' ? 'Synchronisé' : 'En file'}
        </span>
      </td>
      <td style="text-align:end">
        <div class="action-group">
          <button class="btn btn-sm btn-icon btn-print-barcode" data-id="${p.id}" title="Imprimer étiquette code-barres">${ICONS.barcode}</button>
          ${isAdmin ? `<button class="btn btn-sm btn-icon btn-inspect-code" data-barcode="${p.barcode}" title="Historique & S/N">${ICONS.history}</button>` : ''}
          ${isAdmin ? `<button class="btn btn-sm btn-icon btn-edit-prod" data-id="${p.id}" title="Modifier l'article">${ICONS.edit}</button>` : ''}
          ${isAdmin ? `<button class="btn btn-sm btn-icon btn-delete-prod" data-id="${p.id}" title="Supprimer l'article" style="color:#e21b1b">${ICONS.trash}</button>` : ''}
        </div>
      </td>
    </tr>
  `
    )
    .join('');
}

function render() {
  const t = I18N[state.lang];
  document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = state.lang;
  document.documentElement.setAttribute('data-theme', state.theme || 'light');

  const categories = ['ALL', ...Array.from(new Set(state.products.map((p) => p.category)))];
  const filteredProducts = getFilteredProducts();

  const posSubtotal = state.posCart.reduce((s, i) => s + i.subtotal, 0);
  const effectiveDiscount =
    state.posDiscountMode === 'pct'
      ? Math.round(posSubtotal * (Math.min(100, Math.max(0, Number(state.posDiscount || 0))) / 100) * 100) / 100
      : Number(state.posDiscount || 0);
  const posTotal = Math.max(0, posSubtotal - effectiveDiscount);
  const effectivePaid =
    state.posPaidAmount === '' ? posTotal : Number(state.posPaidAmount);
  const posRemainingDebt = Math.max(0, posTotal - effectivePaid);

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: ICONS.dashboard, count: '' },
    { id: 'pos', label: t.pos, icon: ICONS.pos, count: state.posCart.length || '' },
    { id: 'products', label: t.products, icon: ICONS.products, count: state.products.length },
    { id: 'quotations', label: t.quotations, icon: ICONS.quotations, count: (state.dashboard?.openQuotationsCount || 0) + (state.dashboard?.serviceStats?.openJobs || 0) || '' },
    { id: 'purchases', label: t.purchases, icon: ICONS.purchases, count: state.purchases.length || '' },
    { id: 'customers', label: t.customers, icon: ICONS.customers, count: state.customers.length || '' },
    { id: 'expenses', label: t.expenses, icon: ICONS.expenses, count: '' },
    { id: 'reports', label: t.reports, icon: ICONS.reports, count: '' },
    { id: 'connect', label: t.connect, icon: ICONS.connect, count: state.dashboard?.pendingWooSync || '' },
  ];

  const isElectron = Boolean(window.electronAPI?.isElectron);

  const appEl = document.getElementById('app');
  appEl.innerHTML = `
    <div class="app-shell">
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ''}

      <!-- MATTE CARBON SIDEBAR -->
      <aside class="sidebar">
        <div>
          <div class="brand-header">
            <div class="brand-mark">
              <img src="/assets/electrozen-icon.png" alt="EZ" style="width:28px;height:28px;border-radius:5px;background:#fff;padding:2px;object-fit:contain" onerror="this.style.display='none'" />
              <div>
                <div style="font-weight:800;font-size:13px;letter-spacing:0.05em;color:#ffffff;line-height:1.2">
                  ${(state.settings.store_name || 'ELECTROZEN').slice(0, 22)}
                </div>
                <div style="font-size:10.5px;color:#93c5fd">
                  electrozen.ma (${state.settings.currency || 'MAD'})
                </div>
              </div>
            </div>
          </div>

          <button class="scan-trigger" id="btn-open-scanner" style="width:calc(100% - 28px)">
            <span style="display:flex;align-items:center;gap:8px">
              <span style="width:14px;height:14px;display:inline-flex">${ICONS.barcode}</span>
              <span>${t.quickScanBtn}</span>
            </span>
            <span class="kbd">F2</span>
          </button>

          <div class="nav-section-label">Opérations</div>
          <nav class="nav-list">
            ${navItems
              .map(
                (item) => `
              <button class="nav-btn ${state.activeTab === item.id ? 'active' : ''}" data-tab="${item.id}">
                <span class="nav-btn-left">
                  ${item.icon}
                  <span>${item.label}</span>
                </span>
                ${item.count ? `<span class="nav-count">${item.count}</span>` : ''}
              </button>
            `
              )
              .join('')}
          </nav>
        </div>

        <div style="padding:14px;border-top:1px solid var(--sidebar-border);display:flex;flex-direction:column;gap:10px">
          <div style="padding:10px 12px;background:var(--primary-4);border:1px solid var(--primary-3);border-radius:9px">
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--primary-2);font-weight:600">
              <span>Serveur Wi-Fi Android</span>
              <span style="color:var(--primary-green);font-weight:800;font-size:10px">ACTIF</span>
            </div>
            <div class="mono" style="font-size:11.5px;color:var(--primary);font-weight:700;margin-top:3px">
              ${state.networkInfo?.primaryIp || '127.0.0.1'}:${state.networkInfo?.port || 4000}
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;background:var(--primary-4);padding:3px;border-radius:8px;border:1px solid var(--primary-3)">
            ${['fr', 'ar', 'en']
              .map(
                (l) => `
              <button data-lang="${l}" style="border:none;border-radius:6px;padding:5px 0;font-size:11px;font-weight:700;cursor:pointer;background:${state.lang === l ? 'var(--primary)' : 'transparent'};color:${state.lang === l ? '#ffffff' : 'var(--primary-2)'}">
                ${l === 'ar' ? 'عربي' : l.toUpperCase()}
              </button>
            `
              )
              .join('')}
          </div>
        </div>
      </aside>

      <!-- MAIN WORKSPACE -->
      <main class="main-area">
        <header class="topbar">
          <div class="topbar-title">
            <span>${t[state.activeTab] || ''}</span>
            <span style="color:var(--border-strong)">/</span>
            <span class="topbar-subtitle">${state.settings.store_name || ''}</span>
          </div>
          <div class="topbar-actions">
            <button class="btn" id="btn-open-pin" title="Changer d'opérateur (Admin / Caissier)">
              <span class="tag ${state.currentUser?.role === 'admin' ? 'tag-ok' : 'tag-warn'}" style="padding:1px 6px">${(state.currentUser?.role || 'admin').toUpperCase()}</span>
              <span>${state.currentUser?.full_name || 'Admin'}</span>
            </button>
            <button class="btn" id="btn-toggle-theme" title="Basculer Clair / Sombre">
              <span>${state.theme === 'dark' ? 'Clair' : 'Sombre'}</span>
            </button>
            <button class="btn" id="btn-export-csv" title="Exporter le catalogue vers Excel (CSV)">
              ${ICONS.download}
              <span>CSV</span>
            </button>
            <button class="btn" id="btn-backup-db" title="Sauvegarder la base SQLite">
              ${ICONS.download}
              <span>Backup</span>
            </button>
            <button class="btn" id="btn-sync-woo">
              ${ICONS.sync}
              <span>${t.syncWooBtn}${state.dashboard?.pendingWooSync ? ` (${state.dashboard.pendingWooSync})` : ''}</span>
            </button>
            <button class="btn btn-dark" id="btn-new-product">
              ${ICONS.plus}
              <span>${t.addProductBtn}</span>
            </button>
          </div>
        </header>

        <div class="content-scroll">
          ${renderActiveTab(t, categories, filteredProducts, posTotal, effectivePaid, posRemainingDebt)}
        </div>
      </main>
    </div>

    ${renderInspectorModal(t)}
    ${renderProductModal(t)}
    ${renderPrintableInvoiceModal()}
    ${renderBarcodeLabelModal()}
    ${renderQuickCustomerModal()}
    ${renderPinAndCashModals()}
    ${renderPosExtraModals()}
  `;

  attachEvents();
}

function renderActiveTab(t, categories, filteredProducts, posTotal, effectivePaid, posRemainingDebt) {
  const isAdmin = (state.currentUser?.role || 'admin') !== 'caissier';

  // 1. DASHBOARD
  if (state.activeTab === 'dashboard') {
    const d = state.dashboard;
    if (!d) return `<div class="panel"><div class="panel-body">Chargement des données...</div></div>`;
    const cs = state.cashSession?.openSession;
    const rangePills = [
      { id: 'today', label: "Aujourd'hui" },
      { id: '7d', label: '7J' },
      { id: '30d', label: '30J' },
      { id: 'mtd', label: 'Mois (MTD)' },
      { id: 'ytd', label: 'Année (YTD)' },
      { id: 'all', label: 'Tout' },
    ];
    const payLabels = { cash: 'Espèces', card: 'Carte / TPE', transfer: 'Virement', check: 'Chèque', credit: 'Crédit' };
    const totalPayAmt = Math.max(1, (d.paymentBreakdown || []).reduce((s, r) => s + Number(r.amount || 0), 0));
    const maxSeries = Math.max(1, ...(d.dailySeries || []).map((x) => Math.max(Number(x.sales || 0), Number(x.purchases || 0))));

    return `
      <div style="display:flex;flex-direction:column;gap:16px">
        <!-- Period Filter & Cash Register Bar -->
        <div class="panel" style="padding:12px 18px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <span class="tag ${cs ? 'tag-ok' : 'tag-warn'}">${cs ? 'CAISSE OUVERTE' : 'CAISSE FERMÉE'}</span>
            ${
              cs
                ? `<div style="font-size:12.5px">
                    <strong>${cs.opened_by}</strong> • Fond : <span class="mono" style="font-weight:700">${fmtMoney(cs.opening_float)}</span> • Tiroir attendu : <span class="mono" style="font-weight:800;color:#10b981">${fmtMoney(cs.expected_cash)}</span>
                  </div>`
                : `<div style="font-size:12.5px;color:var(--ink-500)">Ouvrez une session de caisse pour suivre les encaissements.</div>`
            }
          </div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <div class="segmented">
              ${rangePills
                .map(
                  (rp) => `<button type="button" class="seg-btn ${state.dashRange === rp.id ? 'active' : ''}" data-dash-range="${rp.id}">${rp.label}</button>`
                )
                .join('')}
            </div>
            ${
              cs
                ? `<button class="btn btn-dark" id="btn-cash-close">Clôturer Caisse (Z)</button>`
                : `<button class="btn btn-pos" id="btn-cash-open">Ouvrir la Caisse</button>`
            }
          </div>
        </div>

        <!-- Quick Actions Strip -->
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <button class="btn" data-goto="pos" style="background:linear-gradient(135deg,#6d28d9,#4f46e5);border:none;color:#ffffff;border-radius:999px;padding:0 18px;box-shadow:0 4px 12px rgba(109,40,217,0.22)">${ICONS.pos}<span>Ouvrir POS</span></button>
          <button class="btn" data-goto="quotations">${ICONS.quotations}<span>Devis (${d.openQuotationsCount || 0}) & SAV (${d.serviceStats?.openJobs || 0})</span></button>
          <button class="btn" data-goto="purchases">${ICONS.purchases}<span>Nouvel Achat</span></button>
          <button class="btn" id="btn-dash-add-product">${ICONS.plus}<span>Ajouter Produit</span></button>
          <button class="btn" data-goto="reports">${ICONS.reports}<span>Rapport Profit & Pertes</span></button>
        </div>

        <!-- Stocky-Inspired KPI Grid (Pastel Icon Tiles) -->
        <div class="kpi-strip">
          <div class="kpi-cell">
            <div class="kpi-card-row">
              <div class="kpi-icon-box kpi-icon-indigo">${ICONS.pos}</div>
              <div>
                <div class="kpi-label">Ventes (${d.salesStats.totalSalesCount || 0})</div>
                <div class="kpi-val num">${fmtMoney(d.salesStats.totalRevenue)}</div>
              </div>
            </div>
            <div class="kpi-sub">Encaissé : <span class="num">${fmtMoney(d.salesStats.totalCollected)}</span> • Avoirs : <span class="num">${fmtMoney(d.salesStats.totalSalesReturn || 0)}</span></div>
          </div>

          <div class="kpi-cell">
            <div class="kpi-card-row">
              <div class="kpi-icon-box kpi-icon-green">${ICONS.reports}</div>
              <div>
                <div class="kpi-label">${isAdmin ? 'Résultat Net' : 'Achats Période'}</div>
                <div class="kpi-val num" style="color:${isAdmin ? '#16a34a' : 'var(--primary)'}">${isAdmin ? fmtMoney(d.salesStats.netProfit) : fmtMoney(d.salesStats.totalPurchases || 0)}</div>
              </div>
            </div>
            <div class="kpi-sub">${isAdmin ? `Marge : <span class="num">${fmtMoney(d.salesStats.grossProfit)}</span> • Charges : <span class="num">${fmtMoney(d.salesStats.totalExpenses)}</span>` : 'Masqué (Mode Caissier)'}</div>
          </div>

          <div class="kpi-cell">
            <div class="kpi-card-row">
              <div class="kpi-icon-box kpi-icon-blue">${ICONS.products}</div>
              <div>
                <div class="kpi-label">Stock (${d.productStats.totalUnits || 0} u.)</div>
                <div class="kpi-val num">${isAdmin ? fmtMoney(d.productStats.stockValueCost) : fmtMoney(d.productStats.stockValueRetail)}</div>
              </div>
            </div>
            <div class="kpi-sub">Détail : <span class="num">${fmtMoney(d.productStats.stockValueRetail)}</span> • Gros : <span class="num">${fmtMoney(d.productStats.stockValueWholesale)}</span></div>
          </div>

          <div class="kpi-cell">
            <div class="kpi-card-row">
              <div class="kpi-icon-box kpi-icon-amber">${ICONS.customers}</div>
              <div>
                <div class="kpi-label">Crédits & Dettes</div>
                <div class="kpi-val num" style="color:${d.salesStats.totalReceivables > 0 ? '#ea580c' : 'var(--primary)'}">${fmtMoney(d.salesStats.totalReceivables)}</div>
              </div>
            </div>
            <div class="kpi-sub">Fournisseurs : <span class="num">${fmtMoney(d.salesStats.totalSupplierDebt)}</span> • Prêts SAV : <strong>${d.serviceStats?.readyJobs || 0}</strong></div>
          </div>
        </div>

        <!-- Stocky-Inspired Analytics Row: 14-Day Bar Chart + Payment Methods -->
        <div class="grid-2">
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">Ventes vs Achats (14 Derniers Jours)</span>
              <div style="display:flex;gap:10px;font-size:11px;font-weight:700">
                <span style="color:#4b4ded">● Ventes</span>
                <span style="color:#98a2b3">● Achats</span>
              </div>
            </div>
            <div class="panel-body" style="padding:14px 16px">
              <div style="display:flex;align-items:flex-end;gap:6px;height:140px;padding-top:10px;border-bottom:1px solid var(--border)">
                ${(d.dailySeries || [])
                  .map((pt) => {
                    const hSales = Math.max(3, Math.round((Number(pt.sales || 0) / maxSeries) * 115));
                    const hPur = Math.max(2, Math.round((Number(pt.purchases || 0) / maxSeries) * 115));
                    return `
                      <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px" title="${pt.day} | Ventes: ${fmtMoney(pt.sales)} | Achats: ${fmtMoney(pt.purchases)}">
                        <div style="display:flex;align-items:flex-end;gap:2px;height:118px">
                          <div style="width:9px;height:${pt.sales > 0 ? hSales : 3}px;background:#4b4ded;border-radius:3px 3px 0 0"></div>
                          <div style="width:7px;height:${pt.purchases > 0 ? hPur : 2}px;background:#cbd5e1;border-radius:3px 3px 0 0"></div>
                        </div>
                        <span class="mono" style="font-size:9px;color:var(--ink-400)">${pt.day.slice(8)}</span>
                      </div>
                    `;
                  })
                  .join('')}
              </div>
            </div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">Répartition par Mode de Paiement</span>
              <span class="mono" style="font-size:11.5px;color:var(--ink-400)">Encaissé : ${fmtMoney(d.salesStats.totalCollected)}</span>
            </div>
            <div class="panel-body" style="display:flex;flex-direction:column;gap:11px">
              ${(d.paymentBreakdown || []).length === 0
                ? `<div style="color:var(--ink-400);font-size:12.5px;padding:24px 0;text-align:center">Aucun encaissement sur cette période.</div>`
                : (d.paymentBreakdown || [])
                    .map((pb) => {
                      const pct = Math.min(100, Math.round((Number(pb.amount || 0) / totalPayAmt) * 100));
                      return `
                        <div>
                          <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px">
                            <span style="font-weight:600;color:var(--ink-900)">${payLabels[pb.payment_method] || pb.payment_method} (${pb.count})</span>
                            <span class="mono" style="font-weight:700;color:var(--ink-900)">${fmtMoney(pb.amount)} (${pct}%)</span>
                          </div>
                          <div style="height:7px;background:var(--primary-4);border-radius:999px;overflow:hidden">
                            <div style="width:${pct}%;height:100%;background:var(--secondary);border-radius:999px"></div>
                          </div>
                        </div>
                      `;
                    })
                    .join('')}
            </div>
          </div>
        </div>

        <!-- Top Products & Top Customers -->
        <div class="grid-2">
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">Meilleures Ventes (Top Produits)</span>
              <button class="btn btn-sm" data-goto="products">Catalogue</button>
            </div>
            <div class="table-wrap">
              <table>
                <thead><tr><th>Article</th><th style="text-align:center">Qté</th><th style="text-align:end">CA</th></tr></thead>
                <tbody>
                  ${(d.topProducts || [])
                    .map(
                      (tp) => `<tr>
                        <td style="font-weight:600;color:var(--ink-900)">${tp.product_name}</td>
                        <td style="text-align:center"><span class="tag tag-ok num">${tp.totalQty}</span></td>
                        <td class="num" style="text-align:end;font-weight:700;color:var(--ink-900)">${fmtMoney(tp.totalRevenue)}</td>
                      </tr>`
                    )
                    .join('') || '<tr><td colspan="3" style="color:var(--ink-400)">Aucune vente sur cette période</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">Meilleurs Clients</span>
              <button class="btn btn-sm" data-goto="customers">Voir Clients</button>
            </div>
            <div class="table-wrap">
              <table>
                <thead><tr><th>Client</th><th style="text-align:center">Cmds</th><th style="text-align:end">Total Achats</th></tr></thead>
                <tbody>
                  ${(d.topCustomers || [])
                    .map(
                      (tc) => `<tr>
                        <td><div style="font-weight:600;color:var(--ink-900)">${tc.name}</div><div class="mono" style="font-size:10.5px;color:var(--ink-400)">${tc.phone}</div></td>
                        <td style="text-align:center"><span class="tag num">${tc.ordersCount}</span></td>
                        <td class="num" style="text-align:end;font-weight:700;color:var(--ink-900)">${fmtMoney(tc.totalSpent)}</td>
                      </tr>`
                    )
                    .join('') || '<tr><td colspan="3" style="color:var(--ink-400)">Aucun client enregistré sur la période</td></tr>'}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="grid-2">
          <!-- Low Stock Panel -->
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">Articles en Seuil Critique (${d.lowStockProducts.length})</span>
              <button class="btn btn-sm" data-goto="purchases">Créer Bon de Réception</button>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Référence / Désignation</th>
                    <th style="text-align:end">Dernier Coût</th>
                    <th style="text-align:end">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  ${d.lowStockProducts
                    .map(
                      (p) => `
                    <tr>
                      <td>
                        <div style="font-weight:600;color:#09090b">${getProdName(p)}</div>
                        <div class="mono" style="font-size:11px;color:#71717a">${p.brand} • ${p.barcode}</div>
                      </td>
                      <td class="num" style="text-align:end;font-weight:500">${fmtMoney(p.current_cost_price)}</td>
                      <td style="text-align:end"><span class="tag tag-danger num">${p.stock_quantity} u.</span></td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Upcoming Installments Panel -->
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">Échéances Clients à Recouvrer</span>
              <button class="btn btn-sm" data-goto="customers">Ouvrir Échéanciers</button>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Facture</th>
                    <th>Échéance</th>
                    <th style="text-align:end">Montant</th>
                  </tr>
                </thead>
                <tbody>
                  ${d.upcomingInstallments
                    .map((inst) => {
                      const today = new Date().toISOString().slice(0, 10);
                      const isOverdue = String(inst.due_date || '') < today;
                      const cleanPhone = String(inst.customer_phone || '').replace(/[^0-9]/g, '').replace(/^0/, '212');
                      const waText = encodeURIComponent(
                        `Bonjour ${inst.customer_name}, rappel amical de ${state.settings.store_name || 'ELECTROZEN'} concernant votre échéance (${inst.invoice_number} T${inst.installment_number}) de ${fmtMoney(inst.amount)} prévue le ${inst.due_date}.`
                      );
                      return `
                    <tr>
                      <td>
                        <div style="font-weight:600;color:var(--ink-900)">${inst.customer_name}</div>
                        <div class="mono" style="font-size:11px;color:var(--ink-400)">${inst.customer_phone}</div>
                      </td>
                      <td class="mono" style="font-size:11.5px">${inst.invoice_number} (T${inst.installment_number})</td>
                      <td><span class="tag ${isOverdue ? 'tag-danger' : 'tag-warn'} mono">${inst.due_date}${isOverdue ? ' (RETARD)' : ''}</span></td>
                      <td class="num" style="text-align:end;font-weight:600;color:var(--ink-900)">
                        <div>${fmtMoney(inst.amount)}</div>
                        ${
                          cleanPhone.length >= 9
                            ? `<a href="https://wa.me/${cleanPhone}?text=${waText}" target="_blank" style="font-size:10.5px;color:#267d39;font-weight:700;text-decoration:none">Relance WhatsApp</a>`
                            : ''
                        }
                      </td>
                    </tr>
                  `;
                    })
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Recent Invoices -->
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">Journal des Ventes Récentes</span>
            <button class="btn btn-sm btn-dark" data-goto="pos">Nouvelle Vente POS</button>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>N° Pièce</th>
                  <th>Date</th>
                  <th>Client</th>
                  <th>Grille</th>
                  <th style="text-align:end">Total TTC</th>
                  <th style="text-align:end">Réglé</th>
                  <th style="text-align:end">Reste Dû</th>
                  <th>Terminal</th>
                  <th style="text-align:end">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${state.sales
                  .slice(0, 12)
                  .map(
                    (s) => `
                  <tr>
                    <td class="mono" style="font-weight:600;color:var(--ink-900)">
                      <div>${s.invoice_number}</div>
                      ${s.status === 'canceled' ? `<span class="tag tag-danger" style="font-size:9.5px">ANNULÉE • ${s.credit_note_number || 'AVOIR'}</span>` : ''}
                    </td>
                    <td class="mono" style="color:var(--ink-400);font-size:11.5px">${s.created_at.slice(0, 16)}</td>
                    <td style="font-weight:500;color:var(--ink-900)">${s.customer_name}</td>
                    <td>
                      <span class="tag">${s.price_tier === 'wholesale' ? 'Gros' : 'Détail'}</span>
                    </td>
                    <td class="num" style="text-align:end;font-weight:600;color:var(--ink-900)">${fmtMoney(s.total_amount)}</td>
                    <td class="num" style="text-align:end;color:#267d39;font-weight:500">${fmtMoney(s.paid_amount)}</td>
                    <td class="num" style="text-align:end">
                      ${s.remaining_debt > 0 && s.status !== 'canceled' ? `<span class="tag tag-warn num">${fmtMoney(s.remaining_debt)}</span>` : `<span style="color:#a1a1aa">—</span>`}
                    </td>
                    <td style="font-size:11.5px;color:var(--ink-500)">${s.source_device || 'Poste Windows'}</td>
                    <td style="text-align:end">
                      <div class="action-group">
                        <button class="btn btn-sm btn-print-sale" data-sale-id="${s.id}">${ICONS.print}<span>Facture / Garantie</span></button>
                        ${isAdmin && s.status !== 'canceled' ? `<button class="btn btn-sm btn-icon btn-cancel-sale" data-sale-id="${s.id}" title="Émettre un Avoir (AV) et réintégrer le stock" style="color:#e21b1b">${ICONS.trash}</button>` : ''}
                      </div>
                    </td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // 2. POS (CAISSE & FACTURATION)
  if (state.activeTab === 'pos') {
    const receivedVal = Number(state.posCashReceived || 0);
    const changeToReturn = state.posPaymentMethod === 'cash' && receivedVal > posTotal ? receivedVal - posTotal : 0;
    return `
      <div class="split-pos">
        <!-- Left: Fast Product Selection (Table or Photo Grid + Quick Category Pills) -->
        <div class="panel">
          <div class="panel-header" style="gap:10px;flex-wrap:wrap">
            <form id="form-pos-barcode" style="flex:1;min-width:220px;display:flex;gap:6px">
              <input class="input mono" id="input-pos-barcode" placeholder="Scanner code-barres EAN ou saisir modèle + Entrée..." autofocus />
              <button type="submit" class="btn btn-dark">Ajouter</button>
            </form>

            <div class="segmented">
              <button type="button" class="seg-btn ${state.posViewMode === 'table' ? 'active' : ''}" id="btn-pos-view-table">Tableau</button>
              <button type="button" class="seg-btn ${state.posViewMode === 'grid' ? 'active' : ''}" id="btn-pos-view-grid">Grille Photos</button>
            </div>

            <div class="segmented">
              <button type="button" class="seg-btn ${state.posPriceTier === 'retail' ? 'active' : ''}" id="btn-tier-retail">
                ${t.retailMode}
              </button>
              <button type="button" class="seg-btn ${state.posPriceTier === 'wholesale' ? 'active' : ''}" id="btn-tier-wholesale">
                ${t.wholesaleMode}
              </button>
            </div>
          </div>

          <div style="padding:10px 14px;border-bottom:1px solid var(--border);display:flex;gap:6px;flex-wrap:wrap;background:var(--panel-subtle)">
            ${categories
              .map(
                (c) => `
              <button type="button" class="btn btn-sm ${state.selectedCategory === c ? 'btn-dark' : ''}" data-pos-cat="${c}">
                ${c === 'ALL' ? 'Tous' : c}
              </button>
            `
              )
              .join('')}
          </div>

          ${
            state.posViewMode === 'grid'
              ? `<div style="padding:14px;display:grid;grid-template-columns:repeat(auto-fill,minmax(175px,1fr));gap:12px;max-height:70vh;overflow-y:auto">
                  ${filteredProducts
                    .map((p) => {
                      const activePrice = state.posPriceTier === 'wholesale' ? p.wholesale_price : p.retail_price;
                      return `
                      <div class="panel btn-add-pos" data-id="${p.id}" style="padding:10px;cursor:pointer;display:flex;flex-direction:column;justify-content:space-between;gap:8px">
                        <div style="height:105px;display:flex;align-items:center;justify-content:center;background:#fff;border-radius:8px;border:1px solid var(--line);padding:6px">
                          ${
                            p.image_url
                              ? `<img src="${p.image_url}" style="max-height:92px;max-width:100%;object-fit:contain" loading="lazy" />`
                              : `<span style="font-weight:700;color:var(--ink-400)">${p.brand}</span>`
                          }
                        </div>
                        <div>
                          <div style="font-size:10.5px;color:var(--ink-400);font-weight:700">${p.brand} • Stock: ${p.stock_quantity}</div>
                          <div style="font-size:12px;font-weight:700;color:var(--ink-900);margin-top:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${getProdName(p)}</div>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:6px;border-top:1px solid var(--line-2)">
                          <span class="num" style="font-weight:800;color:var(--primary);font-size:13.5px">${fmtMoney(activePrice)}</span>
                          <span class="tag tag-ok" style="font-size:10px">+ Ajouter</span>
                        </div>
                      </div>
                    `;
                    })
                    .join('')}
                </div>`
              : `<div class="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Article & Code-Barres</th>
                        <th style="text-align:center">Stock</th>
                        <th style="text-align:end">Prix (${state.posPriceTier === 'wholesale' ? 'Gros' : 'Détail'})</th>
                        <th style="text-align:end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${filteredProducts
                        .map((p) => {
                          const activePrice = state.posPriceTier === 'wholesale' ? p.wholesale_price : p.retail_price;
                          return `
                          <tr>
                            <td>
                              <div style="display:flex;align-items:center;gap:10px">
                                ${
                                  p.image_url
                                    ? `<img src="${p.image_url}" class="prod-thumb" alt="" loading="lazy" />`
                                    : `<div class="prod-thumb" style="display:flex;align-items:center;justify-content:center;font-weight:700;font-size:10px;color:#64748b">${(p.brand || 'EZ').slice(0, 3)}</div>`
                                }
                                <div style="min-width:0">
                                  <div style="font-weight:600;color:var(--ink-900);line-height:1.25">${getProdName(p)}</div>
                                  <div style="font-size:11px;color:var(--ink-400);display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:2px">
                                    <span class="site-badge site-badge-ez">${p.brand ? p.brand.toUpperCase() : 'ELECTROZEN'}</span>
                                    <span class="mono">EAN: ${p.barcode}</span>
                                    <span>• Réf: <span class="mono">${p.model_number || p.sku}</span></span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td style="text-align:center">
                              <span class="tag ${p.stock_quantity > p.min_stock_alert ? 'tag-ok' : 'tag-danger'} num">${p.stock_quantity}</span>
                            </td>
                            <td class="num" style="text-align:end;font-weight:700;color:var(--ink-900);font-size:13px">
                              ${p.regular_price > activePrice ? `<div class="price-old num">${fmtMoney(p.regular_price)}</div>` : ''}
                              <div>${fmtMoney(activePrice)}</div>
                              ${isAdmin ? `<div style="font-size:10px;color:var(--ink-400);font-weight:500">Coût: ${fmtMoney(p.current_cost_price)}</div>` : ''}
                            </td>
                            <td style="text-align:end">
                              <div class="action-group">
                                ${isAdmin ? `<button class="btn btn-sm btn-icon btn-inspect-code" data-barcode="${p.barcode}" title="Historique des prix d'achat">${ICONS.history}</button>` : ''}
                                <button class="btn btn-sm btn-dark btn-add-pos" data-id="${p.id}">+ Ticket</button>
                              </div>
                            </td>
                          </tr>
                        `;
                        })
                        .join('')}
                    </tbody>
                  </table>
                </div>`
          }
        </div>

        <!-- Right: POS Ticket & Checkout -->
        <div class="panel" style="position:sticky;top:0">
          <div class="panel-header" style="flex-wrap:wrap;gap:6px">
            <span class="panel-title">Ticket (${state.posCart.length})</span>
            <div class="action-group">
              <button type="button" class="btn btn-sm" id="btn-pos-today" title="Ventes du jour">Ventes Jour</button>
              <button type="button" class="btn btn-sm" id="btn-pos-calc" title="Calculatrice">Calc.</button>
              <button type="button" class="btn btn-sm" id="btn-pos-drafts">Brouillons (${state.posDrafts.length})</button>
              ${state.posCart.length ? `<button type="button" class="btn btn-sm" id="btn-pos-hold">Attente</button>` : ''}
              ${state.posCart.length ? `<button type="button" class="btn btn-sm" id="btn-clear-cart">Effacer</button>` : ''}
            </div>
          </div>

          <div class="panel-body" style="display:flex;flex-direction:column;gap:12px">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                <label class="field-label" style="margin:0">Client (Compte ou Crédit)</label>
                <button type="button" class="btn btn-sm" id="btn-pos-new-customer" style="height:22px;font-size:11px">+ Nouveau Client</button>
              </div>
              <select id="select-pos-customer" class="input">
                <option value="">Client Comptoir (Paiement comptant)</option>
                ${state.customers
                  .map(
                    (c) => `
                  <option value="${c.id}" ${Number(state.posCustomerId) === c.id ? 'selected' : ''}>
                    ${c.name} (${c.phone}) — ${c.customer_type === 'wholesale' ? 'Gros' : 'Détail'}
                  </option>
                `
                  )
                  .join('')}
              </select>
            </div>

            ${
              state.posCart.length === 0
                ? `<div style="padding:32px 14px;text-align:center;color:#71717a;border:1px dashed #d4d4d8;border-radius:5px;font-size:12px">
                    Aucun article sélectionné. Scannez un code-barres ou cliquez sur "+ Ticket".
                  </div>`
                : `<div style="display:flex;flex-direction:column;gap:8px;max-height:280px;overflow-y:auto">
                    ${state.posCart
                      .map(
                        (item, idx) => `
                      <div style="padding:10px;border:1px solid #e4e4e7;border-radius:5px;background:#fafafa">
                        <div style="display:flex;justify-content:space-between;font-weight:600;color:#09090b;margin-bottom:6px;font-size:12px">
                          <span>${item.product_name}</span>
                          <button class="btn-remove-cart" data-idx="${idx}" style="border:none;background:none;color:#71717a;cursor:pointer;font-weight:700">✕</button>
                        </div>
                        <div style="display:grid;grid-template-columns:60px 1fr 1.3fr;gap:6px">
                          <div>
                            <label class="field-label" style="font-size:10px">Qté</label>
                            <input type="number" min="1" class="input mono input-cart-qty" data-idx="${idx}" value="${item.quantity}" style="height:28px" />
                          </div>
                          <div>
                            <label class="field-label" style="font-size:10px">P.U (MAD)</label>
                            <input type="number" class="input mono input-cart-price" data-idx="${idx}" value="${item.unit_price}" style="height:28px;font-weight:600" />
                          </div>
                          <div>
                            <label class="field-label" style="font-size:10px">N° Série (Garantie)</label>
                            <input type="text" list="sn-list-${item.product_id}" class="input mono input-cart-sn" data-idx="${idx}" value="${item.serial_number}" placeholder="S/N..." style="height:28px" />
                            <datalist id="sn-list-${item.product_id}">
                              ${(item.available_serials || []).map((sn) => `<option value="${sn}"></option>`).join('')}
                            </datalist>
                          </div>
                        </div>
                      </div>
                    `
                      )
                      .join('')}
                  </div>`
            }

            <div style="border-top:1px solid #e4e4e7;padding-top:12px;display:flex;flex-direction:column;gap:10px">
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;align-items:end">
                <div>
                  <label class="field-label" style="min-height:18px;display:flex;align-items:center;white-space:nowrap">Règlement</label>
                  <select id="select-pos-method" class="input">
                    <option value="cash" ${state.posPaymentMethod === 'cash' ? 'selected' : ''}>Espèces</option>
                    <option value="card" ${state.posPaymentMethod === 'card' ? 'selected' : ''}>Carte / TPE</option>
                    <option value="transfer" ${state.posPaymentMethod === 'transfer' ? 'selected' : ''}>Virement</option>
                    <option value="check" ${state.posPaymentMethod === 'check' ? 'selected' : ''}>Chèque</option>
                  </select>
                </div>
                <div>
                  <div style="min-height:18px;display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;white-space:nowrap">
                    <label class="field-label" style="margin:0">Remise (${state.posDiscountMode === 'pct' ? '%' : 'MAD'})</label>
                    <button type="button" id="btn-toggle-disc-mode" style="border:none;background:none;color:var(--secondary);font-size:10px;font-weight:800;cursor:pointer;padding:0">${state.posDiscountMode === 'pct' ? '% ⇄' : 'MAD ⇄'}</button>
                  </div>
                  <input type="number" id="input-pos-discount" class="input mono" value="${state.posDiscount}" />
                </div>
                <div>
                  <label class="field-label" style="min-height:18px;display:flex;align-items:center;white-space:nowrap">Versé (MAD)</label>
                  <input type="number" id="input-pos-paid" class="input mono" placeholder="${posTotal}" value="${state.posPaidAmount}" style="font-weight:700" />
                </div>
              </div>

              ${
                posRemainingDebt > 0
                  ? `<div style="padding:10px;background:#fffbeb;border:1px solid #fde68a;border-radius:5px;display:flex;justify-content:space-between;align-items:center">
                      <div>
                        <div style="font-weight:600;color:#92400e;font-size:12px">Solde à Crédit : <span class="num">${fmtMoney(posRemainingDebt)}</span></div>
                        <div style="font-size:11px;color:#b45309">Échéancier mensuel</div>
                      </div>
                      <select id="select-pos-installments" class="input" style="width:150px;height:28px">
                        <option value="2" ${state.posInstallmentsCount === 2 ? 'selected' : ''}>2 mois (${fmtMoney(posRemainingDebt / 2)})</option>
                        <option value="3" ${state.posInstallmentsCount === 3 ? 'selected' : ''}>3 mois (${fmtMoney(posRemainingDebt / 3)})</option>
                        <option value="6" ${state.posInstallmentsCount === 6 ? 'selected' : ''}>6 mois (${fmtMoney(posRemainingDebt / 6)})</option>
                        <option value="12" ${state.posInstallmentsCount === 12 ? 'selected' : ''}>12 mois (${fmtMoney(posRemainingDebt / 12)})</option>
                      </select>
                    </div>`
                  : ''
              }

              <div style="padding:12px;background:var(--primary-4);border:1px solid var(--primary-3);border-radius:8px;display:flex;justify-content:space-between;align-items:baseline">
                <span style="font-weight:700;font-size:12px;text-transform:uppercase;color:var(--primary)">Net à Payer</span>
                <span class="num" style="font-weight:800;font-size:21px;color:var(--primary)">${fmtMoney(posTotal)}</span>
              </div>

              ${
                state.posPaymentMethod === 'cash' && posTotal > 0
                  ? `<div style="padding:10px;background:var(--panel-subtle);border:1px solid var(--border);border-radius:8px;display:flex;flex-direction:column;gap:8px">
                      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
                        <label class="field-label" style="margin:0">Espèces Reçues :</label>
                        <input type="number" id="input-pos-cash-received" class="input mono" style="width:130px;height:30px;font-weight:700" placeholder="${posTotal}" value="${state.posCashReceived}" />
                      </div>
                      <div style="display:flex;gap:5px;flex-wrap:wrap">
                        ${[100, 200, 500, 1000]
                          .map((amt) => `<button type="button" class="btn btn-sm btn-quick-bill" data-bill="${amt}">${amt} DH</button>`)
                          .join('')}
                      </div>
                      ${
                        changeToReturn > 0
                          ? `<div style="display:flex;justify-content:space-between;font-weight:800;color:#267d39;font-size:13px">
                              <span>Monnaie à rendre :</span>
                              <span class="mono">${fmtMoney(changeToReturn)}</span>
                            </div>`
                          : ''
                      }
                    </div>`
                  : ''
              }

              <div style="display:grid;grid-template-columns:1fr 140px;gap:8px">
                <button class="btn btn-pos" id="btn-complete-sale" style="width:100%;height:40px;justify-content:center;font-size:13px" ${state.posCart.length === 0 ? 'disabled' : ''}>
                  ${ICONS.print}
                  <span>Valider & Facture (F9)</span>
                </button>
                <button type="button" class="btn" id="btn-save-quotation" style="height:40px;justify-content:center" ${state.posCart.length === 0 ? 'disabled' : ''}>
                  ${ICONS.quotations}
                  <span>En Devis</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 3. PRODUCTS & PRICE HISTORY CATALOG
  if (state.activeTab === 'products') {
    return `
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="panel">
          <div class="panel-body" style="padding:12px 16px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">
            <input class="input" id="input-prod-search" placeholder="Filtrer par code-barres, modèle, marque ou désignation..." value="${state.productSearch}" style="flex:1;min-width:240px" />
            <select class="input" id="select-prod-cat" style="width:230px">
              ${categories
                .map(
                  (c) => `<option value="${c}" ${state.selectedCategory === c ? 'selected' : ''}>${c === 'ALL' ? 'Toutes les familles' : c}</option>`
                )
                .join('')}
            </select>
            <button type="button" class="btn btn-dark" id="btn-scan-add-product">${ICONS.barcode}<span>Scanner Code-Barres & Ajouter</span></button>
          </div>
        </div>

        <div class="panel">
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Code-Barres / Réf</th>
                  <th>Désignation</th>
                  <th style="text-align:end">${t.currentBuyingPrice}</th>
                  <th style="text-align:end">${t.wholesalePrice}</th>
                  <th style="text-align:end">${t.retailPrice}</th>
                  <th style="text-align:center">Stock</th>
                  <th>Sync Web</th>
                  <th style="text-align:end">Actions</th>
                </tr>
              </thead>
              <tbody id="products-catalog-tbody">
                ${renderCatalogRows(filteredProducts)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // 4. PURCHASES & SUPPLIERS
  if (state.activeTab === 'purchases') {
    const purTotal = state.purchaseItems.reduce((s, i) => s + i.quantity * i.unit_cost, 0);
    return `
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="split-pos">
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">Réception Fournisseur (Mise à Jour Stock & Historique des Prix)</span>
            </div>
            <div class="panel-body" style="display:flex;flex-direction:column;gap:14px">
              <div style="display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:10px">
                <div>
                  <label class="field-label">Fournisseur</label>
                  <select id="select-pur-supplier" class="input">
                    ${state.suppliers.map((s) => `<option value="${s.id}">${s.company} (${s.name})</option>`).join('')}
                  </select>
                </div>
                <div>
                  <label class="field-label">N° Bon de Livraison / Facture</label>
                  <input id="input-pur-ref" class="input mono" placeholder="BL-2026-..." value="${state.purchaseInvoiceRef}" />
                </div>
                <div>
                  <label class="field-label">Montant Réglé au Fournisseur (MAD)</label>
                  <input id="input-pur-paid" type="number" class="input mono" placeholder="${purTotal}" value="${state.purchasePaidAmount}" />
                </div>
              </div>

              <div>
                <label class="field-label">Sélectionner les articles reçus :</label>
                <div style="display:flex;flex-wrap:wrap;gap:6px">
                  ${state.products
                    .map(
                      (p) => `
                    <button class="btn btn-sm btn-add-pur-item" data-id="${p.id}">+ ${p.brand} ${p.model_number || p.sku}</button>
                  `
                    )
                    .join('')}
                </div>
              </div>

              ${
                state.purchaseItems.length === 0
                  ? `<div style="padding:24px;text-align:center;color:#71717a;border:1px dashed #d4d4d8;border-radius:5px">Sélectionnez un article ci-dessus pour saisir les quantités et nouveaux coûts d'achat.</div>`
                  : `<div style="display:flex;flex-direction:column;gap:10px">
                      ${state.purchaseItems
                        .map((item, idx) => {
                          const prod = state.products.find((p) => p.id === item.product_id);
                          return `
                            <div style="padding:12px;border:1px solid #e4e4e7;border-radius:5px;background:#fafafa">
                              <div style="display:flex;justify-content:space-between;font-weight:600;color:#09090b;margin-bottom:8px">
                                <span>${getProdName(prod)} <span style="color:#71717a;font-weight:400">(Coût précédent : ${fmtMoney(prod?.current_cost_price)})</span></span>
                                <button type="button" class="btn-remove-pur-item" data-idx="${idx}" style="border:none;background:none;color:#b91c1c;cursor:pointer">Retirer</button>
                              </div>
                              <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">
                                <div>
                                  <label class="field-label">Quantité</label>
                                  <input type="number" class="input mono pur-qty" data-idx="${idx}" value="${item.quantity}" />
                                </div>
                                <div>
                                  <label class="field-label">Nouveau Coût Achat</label>
                                  <input type="number" class="input mono pur-cost" data-idx="${idx}" value="${item.unit_cost}" />
                                </div>
                                <div>
                                  <label class="field-label">Nouveau Prix Gros</label>
                                  <input type="number" class="input mono pur-wholesale" data-idx="${idx}" value="${item.new_wholesale_price}" />
                                </div>
                                <div>
                                  <label class="field-label">Nouveau Prix Détail</label>
                                  <input type="number" class="input mono pur-retail" data-idx="${idx}" value="${item.new_retail_price}" />
                                </div>
                              </div>
                            </div>
                          `;
                        })
                        .join('')}
                      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#f4f4f5;border-radius:5px">
                        <span style="font-weight:600">Total Bon de Réception :</span>
                        <span class="num" style="font-weight:800;font-size:16px">${fmtMoney(purTotal)}</span>
                      </div>
                      <button class="btn btn-dark" id="btn-submit-purchase" style="justify-content:center;height:36px">
                        Enregistrer la Réception & Archiver les Anciens Prix
                      </button>
                    </div>`
              }
            </div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">Comptes Fournisseurs & Règlements</span>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Société / Contact</th>
                    <th style="text-align:end">Solde Dû</th>
                    <th style="text-align:end">Règlement</th>
                  </tr>
                </thead>
                <tbody>
                  ${state.suppliers
                    .map(
                      (s) => `
                    <tr>
                      <td>
                        <div style="font-weight:600;color:#09090b">${s.company}</div>
                        <div style="font-size:11px;color:#71717a">${s.name} • ${s.phone}</div>
                      </td>
                      <td class="num" style="text-align:end;font-weight:600;color:${s.balance_owed > 0 ? '#b45309' : '#09090b'}">${fmtMoney(s.balance_owed)}</td>
                      <td style="text-align:end">
                        ${
                          s.balance_owed > 0
                            ? `<button class="btn btn-sm btn-pay-supplier" data-id="${s.id}" data-owed="${s.balance_owed}">Régler</button>`
                            : `<span class="tag tag-ok">Soldé</span>`
                        }
                      </td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
            <form id="form-new-supplier" class="panel-body" style="border-top:1px solid #e4e4e7;display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:8px">
              <input name="company" required class="input" placeholder="Société fournisseur..." />
              <input name="name" required class="input" placeholder="Nom contact..." />
              <input name="phone" class="input mono" placeholder="Téléphone..." />
              <button type="submit" class="btn btn-dark">+ Fournisseur</button>
            </form>
          </div>
        </div>

        <!-- Purchase History Table -->
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">Journal des Bons de Réception (${state.purchases.length})</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>N° Bon / Facture</th>
                  <th>Date</th>
                  <th>Fournisseur</th>
                  <th style="text-align:end">Total Achat</th>
                  <th style="text-align:end">Montant Réglé</th>
                  <th style="text-align:end">Reste Dû</th>
                </tr>
              </thead>
              <tbody>
                ${
                  state.purchases.length === 0
                    ? `<tr><td colspan="6" style="text-align:center;color:#71717a;padding:18px">Aucun bon de réception enregistré dans cette session.</td></tr>`
                    : state.purchases
                        .map(
                          (pur) => `
                        <tr>
                          <td class="mono" style="font-weight:600;color:#09090b">${pur.invoice_number}</td>
                          <td class="mono" style="font-size:11.5px;color:#71717a">${pur.created_at.slice(0, 16)}</td>
                          <td style="font-weight:500">${pur.supplier_company || pur.supplier_name || 'Fournisseur'}</td>
                          <td class="num" style="text-align:end;font-weight:600">${fmtMoney(pur.total_amount)}</td>
                          <td class="num" style="text-align:end;color:#166534">${fmtMoney(pur.paid_amount)}</td>
                          <td class="num" style="text-align:end;color:${pur.remaining_owed > 0 ? '#b45309' : '#71717a'}">${fmtMoney(pur.remaining_owed)}</td>
                        </tr>
                      `
                        )
                        .join('')
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // 5. CUSTOMERS & INSTALLMENTS
  if (state.activeTab === 'customers') {
    return `
      <div class="grid-2">
        <div class="panel" style="display:flex;flex-direction:column;justify-content:space-between">
          <div>
            <div class="panel-header">
              <span class="panel-title">Comptes Clients & Encours (${state.customers.length})</span>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Catégorie</th>
                    <th style="text-align:end">Chiffre Cumulé</th>
                    <th style="text-align:end">Encours / Dette</th>
                  </tr>
                </thead>
                <tbody>
                  ${state.customers
                    .map(
                      (c) => `
                    <tr class="btn-open-ledger" data-id="${c.id}" style="cursor:pointer;background:${state.customerLedger?.customer?.id === c.id ? '#f4f4f5' : ''}">
                      <td>
                        <div style="font-weight:600;color:#09090b">${c.name}</div>
                        <div class="mono" style="font-size:11px;color:#71717a">${c.phone} ${c.national_id ? `• ${c.national_id}` : ''}</div>
                      </td>
                      <td><span class="tag">${c.customer_type === 'wholesale' ? 'Revendeur Gros' : 'Particulier'}</span></td>
                      <td class="num" style="text-align:end">${fmtMoney(c.total_spent)}</td>
                      <td class="num" style="text-align:end;font-weight:700;color:${c.total_debt > 0 ? '#b45309' : '#166534'}">${fmtMoney(c.total_debt)}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>

          <form id="form-add-customer-tab" class="panel-body" style="border-top:1px solid #e4e4e7;display:grid;grid-template-columns:1.2fr 1fr 1fr 1fr auto;gap:8px">
            <input name="name" required class="input" placeholder="Nom complet / Société..." />
            <input name="phone" required class="input mono" placeholder="Téléphone..." />
            <input name="national_id" class="input mono" placeholder="CIN / ICE..." />
            <select name="customer_type" class="input">
              <option value="retail">Particulier (Détail)</option>
              <option value="wholesale">Revendeur (Gros)</option>
            </select>
            <button type="submit" class="btn btn-dark">+ Client</button>
          </form>
        </div>

        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">
              ${state.customerLedger ? `Dossier Client : ${state.customerLedger.customer.name}` : 'Détail Échéancier & Règlements'}
            </span>
            ${
              state.customerLedger
                ? `<span class="tag ${state.customerLedger.customer.total_debt > 0 ? 'tag-warn' : 'tag-ok'} num">
                    Encours : ${fmtMoney(state.customerLedger.customer.total_debt)}
                  </span>`
                : ''
            }
          </div>
          <div class="panel-body" style="display:flex;flex-direction:column;gap:14px">
            ${
              !state.customerLedger
                ? `<div style="padding:28px;text-align:center;color:#71717a">Sélectionnez un client dans la liste à gauche pour consulter ses échéances et enregistrer un règlement.</div>`
                : `
                  <!-- Free / Partial Payment Bar -->
                  <form id="form-free-payment" style="display:flex;gap:8px;padding:10px;background:#fafafa;border:1px solid #e4e4e7;border-radius:5px">
                    <input type="number" id="input-free-payment" required class="input mono" placeholder="Montant versement libre (MAD)..." value="${state.freePaymentAmount}" />
                    <button type="submit" class="btn btn-pos">Encaisser Versement</button>
                  </form>

                  <div>
                    <div class="field-label">Échéancier des Traites / Mensualités</div>
                    <div class="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Facture / Tranche</th>
                            <th>Date Échéance</th>
                            <th style="text-align:end">Montant</th>
                            <th style="text-align:end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${
                            state.customerLedger.installments.length === 0
                              ? `<tr><td colspan="4" style="color:#71717a;text-align:center">Aucune traite programmée</td></tr>`
                              : state.customerLedger.installments
                                  .map(
                                    (inst) => `
                                  <tr>
                                    <td class="mono">${inst.invoice_number} (#${inst.installment_number})</td>
                                    <td class="mono">${inst.due_date}</td>
                                    <td class="num" style="text-align:end;font-weight:600">${fmtMoney(inst.amount)}</td>
                                    <td style="text-align:end">
                                      ${
                                        inst.status === 'paid'
                                          ? `<span class="tag tag-ok">Réglé</span>`
                                          : `<button class="btn btn-sm btn-pos btn-pay-inst" data-inst-id="${inst.id}" data-amount="${inst.amount}">Encaisser</button>`
                                      }
                                    </td>
                                  </tr>
                                `
                                  )
                                  .join('')
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <div class="field-label">Historique des Règlements Reçus (${state.customerLedger.payments?.length || 0})</div>
                    <div class="table-wrap">
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Note / Référence</th>
                            <th style="text-align:end">Montant</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${(state.customerLedger.payments || [])
                            .map(
                              (pay) => `
                            <tr>
                              <td class="mono" style="font-size:11px;color:#71717a">${pay.created_at.slice(0, 16)}</td>
                              <td>${pay.notes || 'Versement'}</td>
                              <td class="num" style="text-align:end;font-weight:600;color:#166534">+${fmtMoney(pay.amount)}</td>
                            </tr>
                          `
                            )
                            .join('')}
                        </tbody>
                      </table>
                    </div>
                  </div>
                `
            }
          </div>
        </div>
      </div>
    `;
  }

  // 6. EXPENSES & CASHFLOW
  if (state.activeTab === 'expenses') {
    const d = state.dashboard;
    return `
      <div style="display:flex;flex-direction:column;gap:16px">
        ${
          d
            ? `<div class="kpi-strip">
                <div class="kpi-cell">
                  <div class="kpi-label">Recettes Encaissées</div>
                  <div class="kpi-val num">${fmtMoney(d.salesStats.totalCollected)}</div>
                </div>
                <div class="kpi-cell">
                  <div class="kpi-label">Coût d'Achat Marchandises Vendues</div>
                  <div class="kpi-val num">${fmtMoney(d.salesStats.totalCogs)}</div>
                </div>
                <div class="kpi-cell">
                  <div class="kpi-label">Total Charges & Dépenses</div>
                  <div class="kpi-val num" style="color:#b91c1c">-${fmtMoney(d.salesStats.totalExpenses)}</div>
                </div>
                <div class="kpi-cell">
                  <div class="kpi-label">Bénéfice Net</div>
                  <div class="kpi-val num" style="color:#166534">${fmtMoney(d.salesStats.netProfit)}</div>
                </div>
              </div>`
            : ''
        }

        <div class="split-pos">
          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">Journal des Charges d'Exploitation (${state.expenses.length})</span>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Libellé</th>
                    <th>Poste</th>
                    <th style="text-align:end">Montant</th>
                    <th style="text-align:end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${state.expenses
                    .map(
                      (e) => `
                    <tr>
                      <td class="mono" style="font-size:11.5px;color:var(--ink-400)">${e.expense_date}</td>
                      <td style="font-weight:600;color:var(--ink-900)">${e.title}</td>
                      <td><span class="tag">${e.category}</span></td>
                      <td class="num" style="text-align:end;font-weight:600;color:#b91c1c">-${fmtMoney(e.amount)}</td>
                      <td style="text-align:end">
                        <button class="btn btn-sm btn-icon btn-del-expense" data-id="${e.id}" title="Supprimer" style="color:#b91c1c">${ICONS.trash}</button>
                      </td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <span class="panel-title">Saisir une Charge</span>
            </div>
            <form id="form-add-expense" class="panel-body" style="display:flex;flex-direction:column;gap:12px">
              <div>
                <label class="field-label">Libellé *</label>
                <input name="title" required class="input" placeholder="ex: Facture Lydec, Loyer, Transport..." />
              </div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                <div>
                  <label class="field-label">Catégorie</label>
                  <select name="category" class="input">
                    <option value="rent">Loyer</option>
                    <option value="utilities">Électricité / Eau / Télécom</option>
                    <option value="salaries">Salaires</option>
                    <option value="transport">Transport & Livraison</option>
                    <option value="marketing">Publicité</option>
                  </select>
                </div>
                <div>
                  <label class="field-label">Montant (MAD) *</label>
                  <input name="amount" type="number" required class="input mono" placeholder="0.00" />
                </div>
              </div>
              <button type="submit" class="btn btn-dark" style="justify-content:center">Enregistrer la Dépense</button>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  // 7. ANDROID WI-FI PAIRING & WOOCOMMERCE SETTINGS
  if (state.activeTab === 'connect') {
    const qrSvg = renderPairingQrSvg(state.networkInfo?.qrPayload || 'ELECTROZEN-POS-2026');
    return `
      <div class="grid-2">
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">Serveur Local Wi-Fi (Application Android)</span>
          </div>
          <div class="panel-body" style="display:flex;flex-direction:column;gap:14px">
            <div style="display:flex;gap:16px;align-items:center;padding:12px;background:#fafafa;border:1px solid #e4e4e7;border-radius:6px">
              ${qrSvg}
              <div style="display:flex;flex-direction:column;gap:6px">
                <div>
                  <span class="field-label">Hôte Local (Même réseau Wi-Fi)</span>
                  <div class="mono" style="font-size:14px;font-weight:700;color:#09090b">
                    http://${state.networkInfo?.primaryIp || '127.0.0.1'}:${state.networkInfo?.port || 4000}
                  </div>
                </div>
                <div>
                  <span class="field-label">Clé d'appairage</span>
                  <div class="mono" style="font-weight:600;color:#52525b">${state.networkInfo?.pairingToken || 'ELECTROZEN-POS-2026'}</div>
                </div>
                <div>
                  <span class="field-label">App Mobile Directe (Wi-Fi PWA & Flutter API)</span>
                  <div class="mono" style="font-size:12px;font-weight:700;color:#09090b">
                    http://${state.networkInfo?.primaryIp || '127.0.0.1'}:${state.networkInfo?.port || 4000}/mobile
                  </div>
                </div>
              </div>
            </div>

            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <a href="/download/ELECTROZEN-Android.apk" class="btn btn-pos" style="text-decoration:none">
                ${ICONS.download}
                <span>Télécharger APK Android (ELECTROZEN-Android.apk)</span>
              </a>
              <button class="btn btn-dark" id="btn-sim-android-pair">Tester Appairage Terminal Android</button>
              <button class="btn" id="btn-sim-android-scan">Simuler Scan Code-Barres Android</button>
              <a href="/mobile" target="_blank" class="btn" style="text-decoration:none">Ouvrir l'App Mobile ELECTROZEN (/mobile)</a>
            </div>

            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Terminal Mobile</th>
                    <th>Dernière Activité</th>
                    <th style="text-align:end">État</th>
                  </tr>
                </thead>
                <tbody>
                  ${(state.networkInfo?.pairedDevices || [])
                    .map(
                      (d) => `
                    <tr>
                      <td style="font-weight:600;color:#09090b">${d.device_name}</td>
                      <td class="mono" style="font-size:11.5px;color:#71717a">${d.last_seen.slice(0, 16)}</td>
                      <td style="text-align:end"><span class="tag tag-ok">En ligne</span></td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">Paramètres Enseigne, Devise & WooCommerce REST API</span>
          </div>
          <form id="form-save-settings" class="panel-body" style="display:flex;flex-direction:column;gap:12px">
            <div style="display:grid;grid-template-columns:2fr 1fr;gap:10px">
              <div>
                <label class="field-label">Raison Sociale / Nom du Magasin</label>
                <input name="store_name" class="input" value="${state.settings.store_name || ''}" />
              </div>
              <div>
                <label class="field-label">Devise</label>
                <input name="currency" class="input mono" value="${state.settings.currency || 'MAD'}" />
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              <div>
                <label class="field-label">Téléphone Magasin</label>
                <input name="store_phone" class="input mono" value="${state.settings.store_phone || ''}" />
              </div>
              <div>
                <label class="field-label">Adresse Magasin</label>
                <input name="store_address" class="input" value="${state.settings.store_address || ''}" />
              </div>
            </div>
            <div>
              <label class="field-label">URL Site WooCommerce / WordPress</label>
              <input name="woo_url" class="input mono" value="${state.settings.woo_url || ''}" />
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
              <div>
                <label class="field-label">ICE Entreprise (Maroc)</label>
                <input name="store_ice" class="input mono" value="${state.settings.store_ice || ''}" />
              </div>
              <div>
                <label class="field-label">Identifiant Fiscal (IF)</label>
                <input name="store_if" class="input mono" value="${state.settings.store_if || ''}" />
              </div>
              <div>
                <label class="field-label">RC / Patente / TVA %</label>
                <input name="store_rc" class="input mono" value="${state.settings.store_rc || ''}" />
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              <div>
                <label class="field-label">Consumer Key (ck_...)</label>
                <input name="woo_consumer_key" type="password" class="input mono" value="${state.settings.woo_consumer_key || ''}" />
              </div>
              <div>
                <label class="field-label">Consumer Secret (cs_...)</label>
                <input name="woo_consumer_secret" type="password" class="input mono" value="${state.settings.woo_consumer_secret || ''}" />
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1.6fr;gap:10px">
              <div>
                <label class="field-label">Fournisseur IA</label>
                <select name="ai_provider" class="input">
                  <option value="deepseek" ${(state.settings.ai_provider || 'gemini') === 'deepseek' ? 'selected' : ''}>DeepSeek API (deepseek-chat)</option>
                  <option value="gemini" ${(state.settings.ai_provider || 'gemini') === 'gemini' ? 'selected' : ''}>Google Gemini (2.5 Flash)</option>
                  <option value="openai" ${(state.settings.ai_provider || 'gemini') === 'openai' ? 'selected' : ''}>OpenAI (gpt-4o-mini)</option>
                </select>
              </div>
              <div>
                <label class="field-label">Clé API IA (DeepSeek / Gemini / OpenAI)</label>
                <input name="ai_api_key" type="password" class="input mono" placeholder="sk-... ou AIza..." value="${state.settings.ai_api_key || ''}" />
              </div>
            </div>
            <button type="submit" class="btn btn-dark" style="justify-content:center">Enregistrer les Paramètres</button>
          </form>
        </div>

        <!-- Backup, CSV Catalog Import, Store Init & Audit Log -->
        <div class="panel" style="grid-column:1 / -1">
          <div class="panel-header">
            <span class="panel-title">Sauvegardes Automatiques SQLite, Import Catalogue CSV & Journal d'Audit</span>
            <div style="display:flex;gap:8px;flex-wrap:wrap">
              <button class="btn btn-sm" id="btn-backup-now">Créer Sauvegarde Maintenant</button>
              <label class="btn btn-sm" style="cursor:pointer">
                <span>Importer Catalogue CSV</span>
                <input type="file" id="input-import-csv" accept=".csv,.txt" style="display:none" />
              </label>
              <button class="btn btn-sm" id="btn-open-reset-store" style="color:#e21b1b;border-color:rgba(226,27,27,0.35)">Vider Données Démo (Mise en Production)</button>
            </div>
          </div>
          <div class="panel-body grid-2">
            <div>
              <div class="field-label" style="margin-bottom:6px">Dernières Sauvegardes SQLite (data/backups/)</div>
              <div class="table-wrap" style="max-height:200px;overflow-y:auto">
                <table>
                  <thead><tr><th>Fichier</th><th style="text-align:end">Taille</th></tr></thead>
                  <tbody>
                    ${(state.backups || [])
                      .slice(0, 8)
                      .map(
                        (b) => `<tr><td class="mono" style="font-size:11.5px">${b.name}</td><td class="mono" style="text-align:end;font-size:11px">${(b.size / 1024).toFixed(1)} KB</td></tr>`
                      )
                      .join('') || '<tr><td colspan="2" style="color:var(--ink-400)">Aucune sauvegarde</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <div class="field-label" style="margin-bottom:6px">Journal d'Audit (Actions Critiques)</div>
              <div class="table-wrap" style="max-height:200px;overflow-y:auto">
                <table>
                  <thead><tr><th>Date</th><th>Opérateur</th><th>Action</th></tr></thead>
                  <tbody>
                    ${(state.auditLogs || [])
                      .slice(0, 10)
                      .map(
                        (a) => `<tr><td class="mono" style="font-size:10.5px">${String(a.created_at || '').slice(5, 16)}</td><td style="font-size:11.5px;font-weight:600">${a.user_name}</td><td class="mono" style="font-size:11px">${a.action}</td></tr>`
                      )
                      .join('') || '<tr><td colspan="3" style="color:var(--ink-400)">Aucune activité</td></tr>'}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 3B. DEVIS PROFORMA & SAV ATELIER
  if (state.activeTab === 'quotations') {
    const statusLabels = {
      pending: { text: 'En attente', cls: 'tag-warn' },
      in_progress: { text: 'En réparation', cls: 'tag-info' },
      ready: { text: 'Prêt à récupérer', cls: 'tag-ok' },
      delivered: { text: 'Livré / Clôturé', cls: '' },
    };
    return `
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="panel" style="padding:12px 18px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
          <div class="segmented">
            <button type="button" class="seg-btn ${state.quotationsSubTab === 'quotes' ? 'active' : ''}" data-qsub="quotes">Devis & Proforma (${state.quotations.length})</button>
            <button type="button" class="seg-btn ${state.quotationsSubTab === 'sav' ? 'active' : ''}" data-qsub="sav">Atelier SAV & Réparations (${state.serviceJobs.length})</button>
          </div>
          <button class="btn btn-dark" data-goto="pos">${ICONS.pos}<span>Nouveau Devis depuis POS</span></button>
        </div>

        ${
          state.quotationsSubTab === 'quotes'
            ? `<div class="panel">
                <div class="panel-header">
                  <span class="panel-title">Devis Clients & Proforma B2B</span>
                  <span style="font-size:12px;color:var(--ink-400)">Créez un devis depuis l'onglet POS (« En Devis ») puis convertissez-le en facture en 1 clic.</span>
                </div>
                <div class="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>N° Devis</th>
                        <th>Date / Validité</th>
                        <th>Client</th>
                        <th>Articles</th>
                        <th style="text-align:end">Total TTC</th>
                        <th>Statut</th>
                        <th style="text-align:end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${state.quotations
                        .map(
                          (q) => `
                        <tr>
                          <td class="mono" style="font-weight:700;color:var(--ink-900)">${q.quote_number}</td>
                          <td class="mono" style="font-size:11.5px;color:var(--ink-400)">${String(q.created_at || '').slice(0, 10)} → ${q.valid_until}</td>
                          <td style="font-weight:600;color:var(--ink-900)">${q.customer_name}</td>
                          <td style="font-size:12px;color:var(--ink-500)">${(q.items || []).length} ligne(s) • ${q.price_tier === 'wholesale' ? 'Gros' : 'Détail'}</td>
                          <td class="num" style="text-align:end;font-weight:700;color:var(--ink-900)">${fmtMoney(q.total_amount)}</td>
                          <td><span class="tag ${q.status === 'converted' ? 'tag-ok' : 'tag-warn'}">${q.status === 'converted' ? 'Converti en Facture' : 'Ouvert'}</span></td>
                          <td style="text-align:end">
                            <div class="action-group">
                              <button class="btn btn-sm btn-print-quote" data-id="${q.id}">${ICONS.print}<span>Imprimer</span></button>
                              ${q.status !== 'converted' ? `<button class="btn btn-sm btn-pos btn-convert-quote" data-id="${q.id}">Convertir → Vente</button>` : ''}
                              ${isAdmin ? `<button class="btn btn-sm btn-icon btn-del-quote" data-id="${q.id}" style="color:#e21b1b">${ICONS.trash}</button>` : ''}
                            </div>
                          </td>
                        </tr>
                      `
                        )
                        .join('') || '<tr><td colspan="7" style="color:var(--ink-400);text-align:center;padding:24px">Aucun devis enregistré. Remplissez un panier au POS et cliquez sur « En Devis ».</td></tr>'}
                    </tbody>
                  </table>
                </div>
              </div>`
            : `<div class="grid-2" style="align-items:start">
                <div class="panel">
                  <div class="panel-header"><span class="panel-title">Nouveau Ticket Réparation / SAV</span></div>
                  <form id="form-new-sav" class="panel-body" style="display:flex;flex-direction:column;gap:10px">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                      <div><label class="field-label">Client *</label><input name="customer_name" required class="input" placeholder="Nom complet" /></div>
                      <div><label class="field-label">Téléphone</label><input name="customer_phone" class="input mono" placeholder="06..." /></div>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                      <div><label class="field-label">Appareil / Modèle *</label><input name="device_name" required class="input" placeholder="Ex: Trottinette KuKirin G2 / TV TCL" /></div>
                      <div><label class="field-label">N° Série / IMEI</label><input name="serial_number" class="input mono" /></div>
                    </div>
                    <div><label class="field-label">Panne / Problème constaté</label><textarea name="issue_description" rows="2" class="input" placeholder="Décrivez la panne..."></textarea></div>
                    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
                      <div><label class="field-label">Coût Pièces (MAD)</label><input name="parts_cost" type="number" step="0.01" class="input mono" value="0" /></div>
                      <div><label class="field-label">Main d'œuvre (MAD)</label><input name="labor_price" type="number" step="0.01" class="input mono" value="150" /></div>
                      <div><label class="field-label">Avance payée (MAD)</label><input name="paid_amount" type="number" step="0.01" class="input mono" value="0" /></div>
                    </div>
                    <button type="submit" class="btn btn-dark" style="justify-content:center">Créer Ticket SAV Atelier</button>
                  </form>
                </div>

                <div class="panel">
                  <div class="panel-header"><span class="panel-title">Suivi Atelier SAV (${state.serviceJobs.length})</span></div>
                  <div class="table-wrap">
                    <table>
                      <thead><tr><th>Ticket / Client</th><th>Appareil</th><th>Statut</th><th style="text-align:end">Total / Payé</th></tr></thead>
                      <tbody>
                        ${state.serviceJobs
                          .map((j) => {
                            const st = statusLabels[j.status] || statusLabels.pending;
                            return `
                              <tr>
                                <td>
                                  <div class="mono" style="font-weight:700;color:var(--ink-900)">${j.ticket_number}</div>
                                  <div style="font-size:12px;font-weight:600">${j.customer_name}</div>
                                  <div class="mono" style="font-size:10.5px;color:var(--ink-400)">${j.customer_phone}</div>
                                </td>
                                <td>
                                  <div style="font-weight:600;color:var(--ink-900)">${j.device_name}</div>
                                  <div style="font-size:11px;color:var(--ink-400)">${j.issue_description || ''}</div>
                                </td>
                                <td>
                                  <span class="tag ${st.cls}" style="margin-bottom:4px;display:inline-flex">${st.text}</span>
                                  <select class="input sel-sav-status" data-id="${j.id}" style="height:28px;font-size:11px;margin-top:4px">
                                    <option value="pending" ${j.status === 'pending' ? 'selected' : ''}>En attente</option>
                                    <option value="in_progress" ${j.status === 'in_progress' ? 'selected' : ''}>En réparation</option>
                                    <option value="ready" ${j.status === 'ready' ? 'selected' : ''}>Prêt</option>
                                    <option value="delivered" ${j.status === 'delivered' ? 'selected' : ''}>Livré & Payé</option>
                                  </select>
                                </td>
                                <td class="num" style="text-align:end">
                                  <div style="font-weight:700">${fmtMoney(j.total_price)}</div>
                                  <div style="font-size:11px;color:#267d39">Payé: ${fmtMoney(j.paid_amount)}</div>
                                </td>
                              </tr>
                            `;
                          })
                          .join('') || '<tr><td colspan="4" style="color:var(--ink-400);text-align:center;padding:24px">Aucun ticket SAV en cours.</td></tr>'}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>`
        }
      </div>
    `;
  }

  // 3C. RAPPORTS P&L & AJUSTEMENTS / CASSE STOCK
  if (state.activeTab === 'reports') {
    const rep = state.pnlReport;
    const rangePills = [
      { id: 'today', label: "Aujourd'hui" },
      { id: '7d', label: '7J' },
      { id: '30d', label: '30J' },
      { id: 'mtd', label: 'Mois (MTD)' },
      { id: 'ytd', label: 'Année (YTD)' },
      { id: 'all', label: 'Tout' },
    ];
    return `
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="panel" style="padding:12px 18px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
          <div class="segmented">
            <button type="button" class="seg-btn ${state.reportsSubTab === 'pnl' ? 'active' : ''}" data-rsub="pnl">Compte de Résultat (Profit & Pertes)</button>
            <button type="button" class="seg-btn ${state.reportsSubTab === 'adjustments' ? 'active' : ''}" data-rsub="adjustments">Ajustements & Pertes Stock (${state.stockAdjustments.length})</button>
          </div>
          <div class="segmented">
            ${rangePills
              .map(
                (rp) => `<button type="button" class="seg-btn ${state.pnlRange === rp.id ? 'active' : ''}" data-pnl-range="${rp.id}">${rp.label}</button>`
              )
              .join('')}
          </div>
        </div>

        ${
          state.reportsSubTab === 'pnl' && rep
            ? `<div style="display:flex;flex-direction:column;gap:14px">
                <div class="hero-card-indigo">
                  <div class="hero-icon-glass">${ICONS.reports}</div>
                  <div>
                    <div style="font-size:12px;font-weight:700;opacity:0.9">RÉSULTAT NET FINAL (${rep.bounds.start} → ${rep.bounds.end})</div>
                    <div class="num" style="font-size:28px;font-weight:800;margin:2px 0;letter-spacing:-0.02em">${isAdmin ? fmtMoney(rep.netProfit) : '•••••• MAD'}</div>
                    <div style="font-size:12px;opacity:0.86">Ventes Nettes + Profit SAV − Coût Marchandises − Charges − Pertes Stock</div>
                  </div>
                </div>
                <div class="grid-2">
                  <div class="hero-card-emerald">
                    <div class="hero-icon-glass">${ICONS.pos}</div>
                    <div>
                      <div style="font-size:12px;font-weight:700;opacity:0.9">MARGE BRUTE MARCHANDISES</div>
                      <div class="num" style="font-size:24px;font-weight:800;margin:2px 0">${isAdmin ? fmtMoney(rep.grossProfit) : '•••••• MAD'}</div>
                      <div style="font-size:11.5px;opacity:0.88">Ventes Nettes (${fmtMoney(rep.salesAgg.netSales)}) − COGS (${isAdmin ? fmtMoney(rep.salesAgg.cogs) : '•••'})</div>
                    </div>
                  </div>
                  <div class="hero-card-emerald" style="background:linear-gradient(135deg,#047857,#0d9488)">
                    <div class="hero-icon-glass">${ICONS.expenses}</div>
                    <div>
                      <div style="font-size:12px;font-weight:700;opacity:0.9">TRÉSORERIE NETTE PÉRIODE & SAV</div>
                      <div class="num" style="font-size:24px;font-weight:800;margin:2px 0">${fmtMoney((rep.salesAgg.cashInSales || 0) + (rep.serviceAgg.serviceRevenue || 0) - (rep.totalExpenses || 0))}</div>
                      <div style="font-size:11.5px;opacity:0.88">Encaissé Ventes + SAV (${fmtMoney(rep.serviceAgg.serviceRevenue)}) − Charges (${fmtMoney(rep.totalExpenses)})</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="grid-2">
                <div class="panel">
                  <div class="panel-header"><span class="panel-title">Compte de Résultat Détaillé</span></div>
                  <div class="table-wrap">
                    <table>
                      <tbody>
                        <tr><td>Ventes Brutes (${rep.salesAgg.invoicesCount} factures)</td><td class="num" style="text-align:end;font-weight:700">${fmtMoney(rep.salesAgg.grossSales)}</td></tr>
                        <tr><td>(-) Remises accordées</td><td class="num" style="text-align:end;color:#d97706">-${fmtMoney(rep.salesAgg.totalDiscounts)}</td></tr>
                        <tr><td><strong>Chiffre d'Affaires Net</strong></td><td class="num" style="text-align:end;font-weight:800">${fmtMoney(rep.salesAgg.netSales)}</td></tr>
                        <tr><td>(-) Coût des Marchandises Vendues (COGS)</td><td class="num" style="text-align:end;color:#e21b1b">-${isAdmin ? fmtMoney(rep.salesAgg.cogs) : '••••'}</td></tr>
                        <tr><td>(+) Recettes Atelier SAV (${rep.serviceAgg.jobsCount} tickets)</td><td class="num" style="text-align:end;color:#267d39">+${fmtMoney(rep.serviceAgg.serviceRevenue)}</td></tr>
                        <tr><td>(-) Coût Pièces SAV</td><td class="num" style="text-align:end;color:#e21b1b">-${fmtMoney(rep.serviceAgg.servicePartsCost)}</td></tr>
                        <tr><td>(-) Pertes / Casse Stock</td><td class="num" style="text-align:end;color:#e21b1b">-${fmtMoney(rep.damageCost)}</td></tr>
                        <tr><td>(-) Charges & Frais Généraux</td><td class="num" style="text-align:end;color:#e21b1b">-${fmtMoney(rep.totalExpenses)}</td></tr>
                        <tr style="background:var(--primary-4)"><td><strong>RÉSULTAT NET</strong></td><td class="num" style="text-align:end;font-weight:800;color:var(--primary)">${isAdmin ? fmtMoney(rep.netProfit) : '••••'}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="panel">
                  <div class="panel-header"><span class="panel-title">Charges par Poste</span></div>
                  <div class="table-wrap">
                    <table>
                      <thead><tr><th>Catégorie</th><th style="text-align:end">Montant</th></tr></thead>
                      <tbody>
                        ${(rep.expByCategory || []).map((c) => `<tr><td style="font-weight:600">${c.category}</td><td class="num" style="text-align:end;color:#e21b1b">-${fmtMoney(c.total)}</td></tr>`).join('') || '<tr><td colspan="2" style="color:var(--ink-400)">Aucune charge sur cette période</td></tr>'}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>`
            : `<div class="grid-2" style="align-items:start">
                <div class="panel">
                  <div class="panel-header"><span class="panel-title">Nouvel Ajustement / Casse Stock</span></div>
                  <form id="form-stock-adj" class="panel-body" style="display:flex;flex-direction:column;gap:10px">
                    <div>
                      <label class="field-label">Produit *</label>
                      <select name="product_id" required class="input" style="text-overflow:ellipsis">
                        ${state.products.map((p) => { const n = getProdName(p); return `<option value="${p.id}">${p.brand} — ${n.length > 52 ? n.slice(0, 52) + '…' : n} (${p.stock_quantity} u.)</option>`; }).join('')}
                      </select>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                      <div>
                        <label class="field-label">Type de Mouvement</label>
                        <select name="adj_type" class="input">
                          <option value="add">Correction (+) Entrée Inventaire</option>
                          <option value="sub">Correction (-) Écart Inventaire</option>
                          <option value="damage">Casse / Produit Endommagé (-)</option>
                        </select>
                      </div>
                      <div><label class="field-label">Quantité *</label><input name="quantity" type="number" min="1" required value="1" class="input mono" /></div>
                    </div>
                    <div><label class="field-label">Motif / Observation</label><input name="reason" class="input" placeholder="Ex: Inventaire physique, appareil abîmé..." /></div>
                    <button type="submit" class="btn btn-dark" style="justify-content:center">Valider Mouvement Stock</button>
                  </form>
                </div>
                <div class="panel">
                  <div class="panel-header"><span class="panel-title">Journal des Ajustements Stock</span></div>
                  <div class="table-wrap">
                    <table>
                      <thead><tr><th>N° Pièce</th><th>Article</th><th>Variation</th><th>Motif</th></tr></thead>
                      <tbody>
                        ${state.stockAdjustments
                          .map(
                            (a) => `<tr>
                              <td class="mono" style="font-size:11.5px;font-weight:700">${a.adj_number}<div style="font-size:10px;color:var(--ink-400)">${String(a.created_at || '').slice(0, 10)}</div></td>
                              <td style="font-size:12px;font-weight:600">${a.product_name}</td>
                              <td><span class="tag ${a.quantity_delta > 0 ? 'tag-ok' : 'tag-danger'} mono">${a.quantity_delta > 0 ? '+' : ''}${a.quantity_delta} (${a.stock_before} → ${a.stock_after})</span></td>
                              <td style="font-size:11.5px;color:var(--ink-500)">${a.adj_type === 'damage' ? 'Casse: ' : ''}${a.reason || '—'}</td>
                            </tr>`
                          )
                          .join('') || '<tr><td colspan="4" style="color:var(--ink-400);text-align:center;padding:24px">Aucun ajustement manuel enregistré.</td></tr>'}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>`
        }
      </div>
    `;
  }

  return '';
}

function renderInspectorModal(t) {
  if (!state.inspectorOpen) return '';
  const data = state.inspectorData;
  const p = data?.product;
  const history = data?.priceHistory || [];
  const serials = data?.serialItems || [];

  return `
    <div class="modal-backdrop">
      <div class="modal-box">
        <div class="modal-header">
          <div style="font-weight:600;font-size:13.5px;color:#09090b">${t.quickScanBtn} (Code-Barres / Historique des Coûts / Numéros de Série)</div>
          <button class="btn btn-sm" id="btn-close-inspector">Fermer (Esc)</button>
        </div>
        <div class="modal-body" style="display:flex;flex-direction:column;gap:14px">
          <form id="form-modal-scan" style="display:flex;gap:8px">
            <input class="input mono" id="input-modal-scan" value="${state.inspectorBarcode}" placeholder="Scanner ou saisir code-barres EAN..." />
            <button type="submit" class="btn btn-dark">Consulter</button>
          </form>

          <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">
            <span style="font-size:11px;color:#71717a">Articles :</span>
            ${state.products
              .slice(0, 6)
              .map(
                (prod) => `
              <button class="btn btn-sm btn-inspect-code" data-barcode="${prod.barcode}">${prod.brand} (${prod.model_number})</button>
            `
              )
              .join('')}
          </div>

          ${
            p
              ? `
                <div style="padding:12px 14px;background:var(--panel-subtle);border:1px solid var(--border);border-radius:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
                  <div style="display:flex;align-items:center;gap:12px">
                    ${
                      p.image_url
                        ? `<img src="${p.image_url}" class="prod-thumb-lg" alt="" />`
                        : ''
                    }
                    <div>
                      <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
                        <span class="site-badge site-badge-ez">${p.category || 'ELECTROZEN'}</span>
                        <span class="mono" style="font-size:11px;color:var(--ink-400)">${p.brand} • EAN: ${p.barcode} • Modèle: ${p.model_number}</span>
                      </div>
                      <div style="font-size:15px;font-weight:700;color:var(--ink-900);margin-top:2px">${getProdName(p)}</div>
                      ${p.description_fr ? `<div style="font-size:11.5px;color:var(--ink-500);margin-top:3px;max-width:560px">${p.description_fr.slice(0, 140)}</div>` : ''}
                    </div>
                  </div>
                  <div class="action-group">
                    <button class="btn btn-sm btn-pos btn-inspector-pos" data-id="${p.id}" data-tier="retail">+ Vendre Détail</button>
                    <button class="btn btn-sm btn-dark btn-inspector-pos" data-id="${p.id}" data-tier="wholesale">+ Vendre Gros</button>
                  </div>
                </div>

                <!-- 4 Price Columns -->
                <div class="kpi-strip">
                  <div class="kpi-cell">
                    <div class="kpi-label">${t.retailPrice}</div>
                    <div class="kpi-val num">${fmtMoney(p.retail_price)}</div>
                    <div class="kpi-sub">Marge : +${fmtMoney(p.retail_price - p.current_cost_price)}</div>
                  </div>
                  <div class="kpi-cell">
                    <div class="kpi-label">${t.wholesalePrice}</div>
                    <div class="kpi-val num">${fmtMoney(p.wholesale_price)}</div>
                    <div class="kpi-sub">Prix min : ${fmtMoney(p.min_selling_price)}</div>
                  </div>
                  <div class="kpi-cell">
                    <div class="kpi-label">${t.currentBuyingPrice}</div>
                    <div class="kpi-val num">${fmtMoney(p.current_cost_price)}</div>
                    <div class="kpi-sub">Stock disponible : ${p.stock_quantity} u.</div>
                  </div>
                  <div class="kpi-cell">
                    <div class="kpi-label">${t.lastBuyingPrice}</div>
                    <div class="kpi-val num" style="color:#52525b">${fmtMoney(p.last_cost_price)}</div>
                    <div class="kpi-sub">Arrivage précédent</div>
                  </div>
                </div>

                <!-- Price History Table -->
                <div class="panel">
                  <div class="panel-header">
                    <span class="panel-title">${t.priceHistoryTitle} (${history.length})</span>
                  </div>
                  <div class="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Fournisseur / Pièce</th>
                          <th style="text-align:end">Coût Précédent</th>
                          <th style="text-align:end">Coût Entrée</th>
                          <th style="text-align:end">Tarif Gros</th>
                          <th style="text-align:end">Tarif Détail</th>
                          <th style="text-align:center">Qté</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${history
                          .map(
                            (h) => `
                          <tr>
                            <td class="mono" style="font-size:11.5px;color:#71717a">${h.recorded_at.slice(0, 16)}</td>
                            <td><strong style="color:#09090b">${h.supplier_name}</strong> <span class="mono" style="color:#71717a">(${h.invoice_ref})</span></td>
                            <td class="num" style="text-align:end;color:#71717a">${fmtMoney(h.previous_buying_price)}</td>
                            <td class="num" style="text-align:end;font-weight:700;color:#09090b">${fmtMoney(h.buying_price)}</td>
                            <td class="num" style="text-align:end">${fmtMoney(h.wholesale_price_at_time)}</td>
                            <td class="num" style="text-align:end;font-weight:600">${fmtMoney(h.retail_price_at_time)}</td>
                            <td style="text-align:center"><span class="tag num">+${h.quantity_added}</span></td>
                          </tr>
                        `
                          )
                          .join('')}
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- Serial Numbers Management -->
                <div class="panel">
                  <div class="panel-header">
                    <span class="panel-title">Numéros de Série / IMEI (${serials.length})</span>
                    <form id="form-add-serial" data-prod-id="${p.id}" style="display:flex;gap:6px">
                      <input id="input-new-serial" required class="input mono" placeholder="Scanner nouveau N° Série..." style="height:26px;width:210px" />
                      <button type="submit" class="btn btn-sm btn-dark">+ Ajouter S/N</button>
                    </form>
                  </div>
                  <div class="panel-body" style="display:flex;gap:6px;flex-wrap:wrap">
                    ${
                      serials.length === 0
                        ? `<span style="color:#71717a;font-size:12px">Aucun numéro de série enregistré pour cet article.</span>`
                        : serials
                            .map(
                              (s) => `
                            <span class="tag ${s.status === 'in_stock' ? 'tag-ok' : ''} mono">
                              <span>${s.serial_number} (${s.status === 'in_stock' ? 'En stock' : 'Vendu'})</span>
                              <button type="button" class="btn-del-serial" data-id="${s.id}" data-barcode="${p.barcode}" style="border:none;background:none;cursor:pointer;color:#71717a;margin-inline-start:4px">✕</button>
                            </span>
                          `
                            )
                            .join('')
                    }
                  </div>
                </div>
              `
              : `<div style="padding:16px;background:var(--panel-subtle);border:1px solid var(--border);border-radius:10px;display:flex;flex-direction:column;gap:10px">
                  <div style="color:#b91c1c;font-weight:700">${data?.error || 'Code-barres non trouvé dans le catalogue'}</div>
                  ${
                    state.inspectorBarcode
                      ? `<div class="action-group" style="justify-content:flex-start">
                          <button type="button" class="btn btn-dark" id="btn-inspector-internet-create" data-code="${state.inspectorBarcode}">Chercher sur Internet & Créer</button>
                          <button type="button" class="btn" id="btn-inspector-manual-create" data-code="${state.inspectorBarcode}">+ Saisir Manuellement</button>
                        </div>`
                      : ''
                  }
                </div>`
          }
        </div>
      </div>
    </div>
  `;
}

function renderProductModal() {
  if (!state.productModalOpen) return '';
  const ep = state.editingProduct || state.prefillProduct;
  const randomBarcode = ep?.barcode || '';
  const aiEngine = (state.settings?.ai_provider || 'gemini').toUpperCase();

  return `
    <div class="modal-backdrop">
      <div class="modal-box">
        <div class="modal-header">
          <span style="font-weight:600;font-size:13.5px;color:var(--ink-900)">
            ${state.editingProduct ? `Modifier l'article : ${state.editingProduct.name_fr}` : 'Nouvel Article (Scan / Internet / Manuel)'}
          </span>
          <button class="btn btn-sm" id="btn-close-prod-modal">Fermer</button>
        </div>
        <form id="form-product-modal" class="modal-body" style="display:flex;flex-direction:column;gap:14px">
          <div style="padding:12px;background:var(--panel-subtle);border:1px solid var(--border);border-radius:10px;display:flex;flex-direction:column;gap:8px">
            <label class="field-label" style="margin:0">Scanner ou Saisir le Code-Barres EAN *</label>
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
              <input name="barcode" id="prod-barcode" required class="input mono" style="flex:1;min-width:200px" placeholder="Scannez (douchette/caméra) ou saisissez EAN..." value="${randomBarcode}" />
              <button type="button" class="btn btn-dark" id="btn-internet-lookup">${ICONS.sync}<span>Chercher sur Internet</span></button>
              <button type="button" class="btn" id="btn-camera-barcode-modal">${ICONS.barcode}<span>${state.cameraScanActive ? 'Fermer Caméra' : 'Scanner Caméra'}</span></button>
              <button type="button" class="btn" id="btn-gen-ean">Générer EAN</button>
            </div>
            ${
              state.cameraScanActive
                ? `<div style="border:2px solid var(--secondary);border-radius:10px;overflow:hidden;background:#101828;max-height:190px;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative">
                    <video id="prod-camera-video" autoplay playsinline muted style="width:100%;max-height:190px;object-fit:cover"></video>
                    <div style="position:absolute;bottom:6px;background:rgba(16,24,40,0.75);color:#fff;padding:3px 10px;border-radius:999px;font-size:11px">Visez le code-barres avec la caméra...</div>
                  </div>`
                : ''
            }
            ${
              state.internetLookupBanner
                ? `<div style="padding:8px 10px;border-radius:8px;font-size:12px;font-weight:600;background:${state.internetLookupBanner.ok ? 'rgba(57,174,82,0.12)' : 'rgba(255,193,8,0.16)'};color:${state.internetLookupBanner.ok ? '#166534' : '#92400e'};border:1px solid ${state.internetLookupBanner.ok ? 'rgba(57,174,82,0.35)' : 'rgba(255,193,8,0.4)'}">
                    ${state.internetLookupBanner.msg}
                  </div>`
                : ''
            }
          </div>

          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
            <div>
              <label class="field-label">Marque *</label>
              <input name="brand" id="prod-brand" required class="input" placeholder="Ex: Samsung, TCL..." value="${ep?.brand || ''}" />
            </div>
            <div>
              <label class="field-label">Référence Modèle</label>
              <input name="model_number" id="prod-model" class="input mono" placeholder="Ex: 55C655" value="${ep?.model_number || ''}" />
            </div>
            <div>
              <label class="field-label">Famille / Catégorie</label>
              <input name="category" id="prod-category" class="input" value="${ep?.category || 'Gros Électroménager'}" />
            </div>
          </div>

          <div style="padding:12px;background:var(--panel-subtle);border:1px solid var(--border);border-radius:10px;display:grid;grid-template-columns:repeat(6,1fr);gap:10px">
            <div>
              <label class="field-label">Coût Achat *</label>
              <input name="current_cost_price" type="number" step="0.01" required class="input mono" value="${ep?.current_cost_price ?? 0}" />
            </div>
            <div>
              <label class="field-label">Dernier Coût</label>
              <input name="last_cost_price" type="number" step="0.01" class="input mono" value="${ep?.last_cost_price ?? 0}" />
            </div>
            <div>
              <label class="field-label">Prix Gros *</label>
              <input name="wholesale_price" type="number" step="0.01" required class="input mono" value="${ep?.wholesale_price ?? 0}" />
            </div>
            <div>
              <label class="field-label">Prix Détail *</label>
              <input name="retail_price" type="number" step="0.01" required class="input mono" value="${ep?.retail_price ?? 0}" />
            </div>
            <div>
              <label class="field-label">Stock</label>
              <input name="stock_quantity" type="number" required class="input mono" value="${ep?.stock_quantity ?? 1}" />
            </div>
            <div>
              <label class="field-label">Garantie (Mois)</label>
              <input name="warranty_months" type="number" required class="input mono" value="${ep?.warranty_months ?? 12}" />
            </div>
          </div>

          <div style="padding:12px;border:1px solid var(--border);border-radius:10px;display:flex;flex-direction:column;gap:10px">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
              <span style="font-weight:600;font-size:12px;color:var(--ink-900)">Désignations & Fiche Technique (FR / AR / EN)</span>
              <button type="button" class="btn btn-sm btn-dark" id="btn-ai-fill">Pré-remplir via IA (${aiEngine})</button>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
              <div>
                <label class="field-label">Désignation (FR) *</label>
                <input name="name_fr" id="prod-name-fr" required class="input" value="${ep?.name_fr || ''}" />
              </div>
              <div dir="rtl">
                <label class="field-label">الاسم بالعربية</label>
                <input name="name_ar" id="prod-name-ar" class="input" value="${ep?.name_ar || ''}" />
              </div>
              <div>
                <label class="field-label">English Name</label>
                <input name="name_en" id="prod-name-en" class="input" value="${ep?.name_en || ''}" />
              </div>
            </div>
            <div>
              <label class="field-label">Description Technique (WooCommerce)</label>
              <textarea name="description_fr" id="prod-desc-fr" rows="2" class="input">${ep?.description_fr || ''}</textarea>
            </div>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:8px">
            <button type="submit" class="btn btn-dark">Enregistrer l'Article</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderPrintableInvoiceModal() {
  const s = state.printableSale;
  if (!s) return '';
  const isThermal = state.printFormat === 'thermal';

  return `
    <div class="modal-backdrop">
      <div class="modal-box" style="max-width:740px">
        <div class="modal-header">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-weight:600;color:#09090b">Document — ${s.invoice_number}</span>
            <div class="segmented">
              <button type="button" class="seg-btn ${!isThermal ? 'active' : ''}" id="btn-fmt-a4">Facture A4 + Garantie</button>
              <button type="button" class="seg-btn ${isThermal ? 'active' : ''}" id="btn-fmt-thermal">Ticket 80mm</button>
            </div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-sm btn-dark" id="btn-trigger-print">${ICONS.print} Imprimer</button>
            <button class="btn btn-sm" id="btn-close-print">Fermer</button>
          </div>
        </div>
        <div class="modal-body" style="background:#f4f4f5;display:flex;justify-content:center">
          <div id="printable-invoice" style="background:#fff;color:#09090b;padding:${isThermal ? '16px' : '28px'};width:${isThermal ? '310px' : '100%'};border:1px solid #e4e4e7">
            <div style="display:flex;flex-direction:${isThermal ? 'column' : 'row'};justify-content:space-between;border-bottom:2px solid #09090b;padding-bottom:12px;gap:8px">
              <div>
                <h2 style="font-size:${isThermal ? '15px' : '18px'};font-weight:800">${state.settings.store_name}</h2>
                <div style="font-size:11px;color:#52525b">${state.settings.store_address} • Tél: ${state.settings.store_phone}</div>
              </div>
              <div style="text-align:${isThermal ? 'left' : 'right'}">
                <div style="font-weight:700;font-size:12px">FACTURE / BON DE GARANTIE</div>
                <div class="mono" style="font-weight:700">${s.invoice_number}</div>
                <div class="mono" style="font-size:11px;color:#52525b">Date : ${s.created_at.slice(0, 16)}</div>
              </div>
            </div>

            <div style="margin:12px 0;padding:8px 10px;background:#fafafa;border:1px solid #e4e4e7;display:flex;justify-content:space-between;font-size:11.5px">
              <div><strong>Client :</strong> ${s.customer_name}</div>
              <div><strong>Tarif :</strong> ${s.price_tier === 'wholesale' ? 'Gros' : 'Détail'}</div>
            </div>

            <table style="width:100%;border-collapse:collapse;margin:12px 0;font-size:${isThermal ? '11px' : '12px'}">
              <thead>
                <tr>
                  <th>Désignation & S/N</th>
                  ${!isThermal ? `<th>Garantie</th>` : ''}
                  <th style="text-align:center">Qté</th>
                  <th style="text-align:end">Total</th>
                </tr>
              </thead>
              <tbody>
                ${(s.items || [])
                  .map(
                    (i) => `
                  <tr>
                    <td>
                      <div style="font-weight:600;color:#09090b">${i.product_name}</div>
                      <div class="mono" style="font-size:10.5px;color:#52525b">${i.barcode} ${i.serial_number ? `| S/N: ${i.serial_number}` : ''}</div>
                    </td>
                    ${!isThermal ? `<td style="font-size:11px">${i.warranty_months}m (Fin: ${i.warranty_expires_at || ''})</td>` : ''}
                    <td class="num" style="text-align:center;font-weight:600">${i.quantity}</td>
                    <td class="num" style="text-align:end;font-weight:700">${fmtMoney(i.subtotal)}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>

            <div style="text-align:right;margin-top:14px;font-size:12px" class="num">
              ${(() => {
                const tvaRate = Number(state.settings.tva_rate || 20);
                const ttc = Number(s.total_amount || 0);
                const ht = ttc / (1 + tvaRate / 100);
                const tva = ttc - ht;
                return !isThermal
                  ? `<div>Total HT : ${fmtMoney(ht)}</div><div>TVA (${tvaRate}%) : ${fmtMoney(tva)}</div>`
                  : '';
              })()}
              <div style="font-size:14px;margin-top:4px"><strong>Total TTC : ${fmtMoney(s.total_amount)}</strong></div>
              <div>Montant Réglé : ${fmtMoney(s.paid_amount)}</div>
              ${s.remaining_debt > 0 ? `<div style="color:#b45309"><strong>Reste à Payer : ${fmtMoney(s.remaining_debt)}</strong></div>` : ''}
            </div>
            ${
              !isThermal
                ? `<div style="margin-top:12px;padding:8px 10px;background:#f9fafb;border:1px solid #e4e7ec;font-size:11px;color:#101828">
                    Arrêté la présente facture à la somme de : <strong>${numberToFrenchWords(s.total_amount)}</strong> TTC.
                  </div>
                  <div style="margin-top:14px;padding-top:10px;border-top:1px solid #e4e4e7;font-size:10.5px;color:#52525b;text-align:center">
                    ICE: ${state.settings.store_ice || '002849123000045'} • IF: ${state.settings.store_if || '51829402'} • RC: ${state.settings.store_rc || '512840'} • Patente: ${state.settings.store_patente || '34789210'}
                  </div>`
                : ''
            }
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderBarcodeLabelModal() {
  const p = state.barcodeLabelProduct;
  if (!p) return '';
  return `
    <div class="modal-backdrop">
      <div class="modal-box" style="max-width:460px">
        <div class="modal-header">
          <span style="font-weight:600;color:#09090b">Étiquette Code-Barres & Prix</span>
          <div style="display:flex;gap:8px">
            <button class="btn btn-sm btn-dark" onclick="window.print()">${ICONS.print} Imprimer Étiquette</button>
            <button class="btn btn-sm" id="btn-close-label">Fermer</button>
          </div>
        </div>
        <div class="modal-body" style="background:#f4f4f5;display:flex;justify-content:center">
          <div id="printable-invoice" style="background:#fff;color:#09090b;padding:18px;border:1px solid #d4d4d8;width:320px;text-align:center">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:#52525b">${p.brand} • ${p.model_number || p.sku}</div>
            <div style="font-size:13px;font-weight:700;margin:4px 0 8px;color:#09090b">${getProdName(p)}</div>
            <div style="display:flex;justify-content:center;margin:6px 0">
              ${renderLinearBarcodeSvg(p.barcode)}
            </div>
            <div class="mono" style="font-size:11.5px;letter-spacing:2px;font-weight:600">${p.barcode}</div>
            <div class="num" style="font-size:20px;font-weight:800;margin-top:8px;border-top:1px solid #e4e4e7;padding-top:6px">
              ${fmtMoney(p.retail_price)}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderQuickCustomerModal() {
  if (!state.quickCustomerModalOpen) return '';
  return `
    <div class="modal-backdrop">
      <div class="modal-box" style="max-width:480px">
        <div class="modal-header">
          <span style="font-weight:600;color:#09090b">Nouveau Client (Ajout Rapide Caisse)</span>
          <button class="btn btn-sm" id="btn-close-quick-cust">Fermer</button>
        </div>
        <form id="form-quick-cust" class="modal-body" style="display:flex;flex-direction:column;gap:12px">
          <div>
            <label class="field-label">Nom complet ou Société *</label>
            <input name="name" required class="input" placeholder="ex: Karim Alaoui" autofocus />
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
            <div>
              <label class="field-label">Téléphone *</label>
              <input name="phone" required class="input mono" placeholder="0661..." />
            </div>
            <div>
              <label class="field-label">CIN / ICE</label>
              <input name="national_id" class="input mono" placeholder="BK..." />
            </div>
          </div>
          <div>
            <label class="field-label">Type de Client</label>
            <select name="customer_type" class="input">
              <option value="retail">Particulier (Tarif Détail)</option>
              <option value="wholesale">Revendeur (Tarif Gros)</option>
            </select>
          </div>
          <button type="submit" class="btn btn-dark" style="justify-content:center">Créer & Sélectionner dans la Caisse</button>
        </form>
      </div>
    </div>
  `;
}

function renderPinAndCashModals() {
  if (state.pinModalOpen) {
    return `
      <div class="modal-backdrop">
        <div class="modal-box" style="max-width:400px">
          <div class="modal-header">
            <span style="font-weight:700">Changement d'Opérateur (Code PIN)</span>
            <button class="btn btn-sm" id="btn-close-pin">Fermer</button>
          </div>
          <form id="form-pin-login" class="modal-body" style="display:flex;flex-direction:column;gap:12px">
            <div>
              <label class="field-label">Opérateur</label>
              <select name="userId" class="input">
                ${(state.users.length ? state.users : [{ id: 1, full_name: 'Admin ELECTROZEN', role: 'admin' }, { id: 2, full_name: 'Caissier Comptoir', role: 'caissier' }])
                  .map((u) => `<option value="${u.id}" ${Number(state.currentUser?.id) === Number(u.id) ? 'selected' : ''}>${u.full_name} (${u.role.toUpperCase()})</option>`)
                  .join('')}
              </select>
            </div>
            <div>
              <label class="field-label">Code PIN (Défaut Admin: 1234 • Caissier: 0000)</label>
              <input name="pin" type="password" inputmode="numeric" required class="input mono" placeholder="••••" autofocus />
            </div>
            <button type="submit" class="btn btn-dark" style="justify-content:center">Valider & Basculer</button>
          </form>
        </div>
      </div>
    `;
  }

  if (state.cashModalMode) {
    const isOpenMode = state.cashModalMode === 'open';
    const cs = state.cashSession?.openSession;
    return `
      <div class="modal-backdrop">
        <div class="modal-box" style="max-width:440px">
          <div class="modal-header">
            <span style="font-weight:700">${isOpenMode ? 'Ouverture de Caisse' : 'Clôture de Caisse (Rapport Z)'}</span>
            <button class="btn btn-sm" id="btn-close-cash-modal">Fermer</button>
          </div>
          <form id="form-cash-session" class="modal-body" style="display:flex;flex-direction:column;gap:12px">
            ${
              !isOpenMode && cs
                ? `<div style="padding:10px;background:var(--panel-subtle);border:1px solid var(--border);border-radius:6px;font-size:12px">
                    <div>Fond initial : <strong class="mono">${fmtMoney(cs.opening_float)}</strong></div>
                    <div>Espèces encaissées : <strong class="mono">${fmtMoney(cs.cashSalesToday)}</strong></div>
                    <div>Dépenses espèces : <strong class="mono">${fmtMoney(cs.cashExpensesToday)}</strong></div>
                    <div style="margin-top:4px;font-size:13.5px">Montant attendu en tiroir : <strong class="mono" style="color:#10b981">${fmtMoney(cs.expected_cash)}</strong></div>
                  </div>`
                : ''
            }
            <div>
              <label class="field-label">${isOpenMode ? 'Fond de Caisse Initial (MAD)' : 'Montant Compté en Tiroir (MAD)'}</label>
              <input name="amount" type="number" step="0.01" required class="input mono" value="${isOpenMode ? '500' : (cs?.expected_cash ?? 0)}" autofocus />
            </div>
            ${
              !isOpenMode
                ? `<div>
                    <label class="field-label">Observations (Écart, remise en banque...)</label>
                    <input name="notes" class="input" placeholder="RAS" />
                  </div>`
                : ''
            }
            <button type="submit" class="btn ${isOpenMode ? 'btn-pos' : 'btn-dark'}" style="justify-content:center">
              ${isOpenMode ? 'Ouvrir la Session de Caisse' : 'Clôturer & Enregistrer Rapport Z'}
            </button>
          </form>
        </div>
      </div>
    `;
  }
  if (state.resetModalOpen) {
    return `
      <div class="modal-backdrop">
        <div class="modal-box" style="max-width:480px">
          <div class="modal-header">
            <span style="font-weight:700;color:#e21b1b">Initialisation Production (Vider Données Démo)</span>
            <button class="btn btn-sm" id="btn-close-reset">Fermer</button>
          </div>
          <form id="form-reset-store" class="modal-body" style="display:flex;flex-direction:column;gap:10px">
            <div style="font-size:12px;color:var(--ink-500)">
              Cette action supprime les articles, ventes et clients de démonstration pour démarrer avec votre véritable base magasin.
            </div>
            <div>
              <label class="field-label">Nom de votre Enseigne *</label>
              <input name="store_name" required class="input" value="${state.settings.store_name || 'ELECTROZEN'}" />
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
              <div><label class="field-label">ICE</label><input name="store_ice" class="input mono" value="${state.settings.store_ice || ''}" /></div>
              <div><label class="field-label">IF</label><input name="store_if" class="input mono" value="${state.settings.store_if || ''}" /></div>
            </div>
            <div>
              <label class="field-label">Nouveau Code PIN Admin (min 4 chiffres)</label>
              <input name="admin_pin" type="password" class="input mono" value="1234" />
            </div>
            <button type="submit" class="btn btn-dark" style="background:#e21b1b;border-color:#e21b1b;justify-content:center">
              Confirmer & Vider les Données Démo
            </button>
          </form>
        </div>
      </div>
    `;
  }

  return '';
}

function getPosTotals() {
  const posSubtotal = state.posCart.reduce((s, i) => s + i.subtotal, 0);
  const discVal = Number(state.posDiscount || 0);
  const effectiveDiscount =
    state.posDiscountMode === 'pct'
      ? Math.round(posSubtotal * (Math.min(100, Math.max(0, discVal)) / 100) * 100) / 100
      : Math.max(0, discVal);
  const posTotal = Math.max(0, posSubtotal - effectiveDiscount);
  return { posSubtotal, effectiveDiscount, posTotal };
}

function renderPosExtraModals() {
  if (state.todaySalesModalOpen) {
    const today = new Date().toISOString().slice(0, 10);
    const todaySales = state.sales.filter((s) => String(s.created_at || '').startsWith(today) && s.status !== 'canceled');
    const sumBy = (m) => todaySales.filter((s) => s.payment_method === m).reduce((a, s) => a + Number(s.paid_amount || 0), 0);
    const tot = todaySales.reduce((a, s) => a + Number(s.total_amount || 0), 0);
    return `
      <div class="modal-backdrop">
        <div class="modal-box" style="max-width:520px">
          <div class="modal-header">
            <span style="font-weight:700">Ventes d'Aujourd'hui (${today})</span>
            <button class="btn btn-sm" id="btn-close-today-sales">Fermer</button>
          </div>
          <div class="modal-body" style="display:flex;flex-direction:column;gap:10px">
            <div class="kpi-strip" style="grid-template-columns:1fr 1fr">
              <div class="kpi-cell"><div class="kpi-label">Factures Jour</div><div class="kpi-val num">${todaySales.length}</div></div>
              <div class="kpi-cell"><div class="kpi-label">Total Ventes Jour</div><div class="kpi-val num">${fmtMoney(tot)}</div></div>
            </div>
            <table>
              <tbody>
                <tr><td>Espèces (Cash)</td><td class="num" style="text-align:end;font-weight:700">${fmtMoney(sumBy('cash'))}</td></tr>
                <tr><td>Carte / TPE</td><td class="num" style="text-align:end;font-weight:700">${fmtMoney(sumBy('card'))}</td></tr>
                <tr><td>Virement Bancaire</td><td class="num" style="text-align:end;font-weight:700">${fmtMoney(sumBy('transfer'))}</td></tr>
                <tr><td>Chèque</td><td class="num" style="text-align:end;font-weight:700">${fmtMoney(sumBy('check'))}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
  if (state.posDraftModalOpen) {
    return `
      <div class="modal-backdrop">
        <div class="modal-box" style="max-width:520px">
          <div class="modal-header">
            <span style="font-weight:700">Tickets en Attente / Brouillons (${state.posDrafts.length})</span>
            <button class="btn btn-sm" id="btn-close-drafts">Fermer</button>
          </div>
          <div class="modal-body" style="display:flex;flex-direction:column;gap:8px">
            ${state.posDrafts
              .map(
                (dr, i) => `
              <div style="padding:10px;border:1px solid var(--border);border-radius:8px;display:flex;justify-content:space-between;align-items:center;gap:10px">
                <div>
                  <div style="font-weight:700;font-size:12.5px">${dr.label} • ${dr.cart.length} article(s)</div>
                  <div class="mono" style="font-size:11px;color:var(--ink-400)">${dr.savedAt} • Total: ${fmtMoney(dr.total)}</div>
                </div>
                <div class="action-group">
                  <button class="btn btn-sm btn-pos btn-resume-draft" data-idx="${i}">Reprendre</button>
                  <button class="btn btn-sm btn-icon btn-del-draft" data-idx="${i}" style="color:#e21b1b">${ICONS.trash}</button>
                </div>
              </div>
            `
              )
              .join('') || '<div style="text-align:center;color:var(--ink-400);padding:20px">Aucun ticket mis en attente.</div>'}
          </div>
        </div>
      </div>
    `;
  }
  if (state.posCalcOpen) {
    const keys = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'];
    return `
      <div class="modal-backdrop">
        <div class="modal-box" style="max-width:300px">
          <div class="modal-header">
            <span style="font-weight:700">Calculatrice POS</span>
            <button class="btn btn-sm" id="btn-close-calc">Fermer</button>
          </div>
          <div class="modal-body" style="display:flex;flex-direction:column;gap:10px">
            <div class="mono" style="padding:12px;background:var(--panel-subtle);border:1px solid var(--border);border-radius:8px;text-align:right;font-size:20px;font-weight:800">${state.posCalcDisplay}</div>
            <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">
              ${keys.map((k) => `<button type="button" class="btn calc-key" data-k="${k}" style="height:38px;justify-content:center;font-weight:700">${k}</button>`).join('')}
              <button type="button" class="btn calc-key" data-k="C" style="grid-column:span 4;justify-content:center;color:#e21b1b">Effacer (C)</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  if (state.printableQuote) {
    const q = state.printableQuote;
    return `
      <div class="modal-backdrop">
        <div class="modal-box" style="max-width:740px">
          <div class="modal-header">
            <span style="font-weight:700">Devis Proforma — ${q.quote_number}</span>
            <div class="action-group">
              <button class="btn btn-sm btn-dark" id="btn-print-quote-now">${ICONS.print} Imprimer Devis</button>
              <button class="btn btn-sm" id="btn-close-quote-print">Fermer</button>
            </div>
          </div>
          <div class="modal-body" style="background:#f4f4f5">
            <div id="printable-invoice" style="background:#fff;color:#09090b;padding:28px;border:1px solid #e4e4e7">
              <div style="display:flex;justify-content:space-between;border-bottom:2px solid #203361;padding-bottom:12px">
                <div><h2 style="font-size:18px;font-weight:800">${state.settings.store_name}</h2><div style="font-size:11px;color:#52525b">${state.settings.store_address} • Tél: ${state.settings.store_phone}</div></div>
                <div style="text-align:right"><div style="font-weight:800;color:#203361">DEVIS / PROFORMA</div><div class="mono">${q.quote_number}</div><div class="mono" style="font-size:11px">Valable jusqu'au ${q.valid_until}</div></div>
              </div>
              <div style="margin:12px 0;font-size:12px"><strong>Client :</strong> ${q.customer_name} • <strong>Grille :</strong> ${q.price_tier === 'wholesale' ? 'Gros' : 'Détail'}</div>
              <table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:12px">
                <thead><tr><th>Désignation</th><th style="text-align:center">Qté</th><th style="text-align:end">P.U</th><th style="text-align:end">Total</th></tr></thead>
                <tbody>${(q.items || []).map((i) => `<tr><td>${i.product_name}</td><td style="text-align:center">${i.quantity}</td><td class="num" style="text-align:end">${fmtMoney(i.unit_price)}</td><td class="num" style="text-align:end">${fmtMoney(Number(i.unit_price) * Number(i.quantity))}</td></tr>`).join('')}</tbody>
              </table>
              <div style="text-align:right;margin-top:12px;font-size:14px"><strong>Total Devis TTC : ${fmtMoney(q.total_amount)}</strong></div>
              <div style="margin-top:10px;font-size:11px">Arrêté le présent devis à : <strong>${numberToFrenchWords(q.total_amount)}</strong> TTC.</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  return '';
}

function attachEvents() {
  document.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.onclick = () => {
      state.activeTab = btn.getAttribute('data-tab');
      render();
    };
  });

  document.querySelectorAll('[data-goto]').forEach((btn) => {
    btn.onclick = () => {
      state.activeTab = btn.getAttribute('data-goto');
      render();
    };
  });

  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.onclick = () => {
      state.lang = btn.getAttribute('data-lang');
      render();
    };
  });

  const btnOpenScanner = document.getElementById('btn-open-scanner');
  if (btnOpenScanner) btnOpenScanner.onclick = () => openBarcodeInspector('');

  const btnOpenPin = document.getElementById('btn-open-pin');
  if (btnOpenPin) {
    btnOpenPin.onclick = () => {
      state.pinModalOpen = true;
      render();
    };
  }
  const btnClosePin = document.getElementById('btn-close-pin');
  if (btnClosePin) {
    btnClosePin.onclick = () => {
      state.pinModalOpen = false;
      render();
    };
  }
  const formPinLogin = document.getElementById('form-pin-login');
  if (formPinLogin) {
    formPinLogin.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(formPinLogin);
      const res = await fetch('/api/auth/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: fd.get('userId'), pin: fd.get('pin') }),
      });
      if (res.ok) {
        state.currentUser = await res.json();
        localStorage.setItem('ez_current_user', JSON.stringify(state.currentUser));
        state.pinModalOpen = false;
        showToast(`Connecté : ${state.currentUser.full_name} (${state.currentUser.role.toUpperCase()})`);
      } else {
        showToast('Code PIN incorrect');
      }
    };
  }

  const btnCashOpen = document.getElementById('btn-cash-open');
  if (btnCashOpen) btnCashOpen.onclick = () => { state.cashModalMode = 'open'; render(); };
  const btnCashClose = document.getElementById('btn-cash-close');
  if (btnCashClose) btnCashClose.onclick = () => { state.cashModalMode = 'close'; render(); };
  const btnCloseCashModal = document.getElementById('btn-close-cash-modal');
  if (btnCloseCashModal) btnCloseCashModal.onclick = () => { state.cashModalMode = null; render(); };

  const formCashSession = document.getElementById('form-cash-session');
  if (formCashSession) {
    formCashSession.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(formCashSession);
      const isOpenMode = state.cashModalMode === 'open';
      const endpoint = isOpenMode ? '/api/cash-session/open' : '/api/cash-session/close';
      const payload = isOpenMode
        ? { opening_float: Number(fd.get('amount') || 0), opened_by: state.currentUser?.full_name || 'Admin' }
        : { counted_cash: Number(fd.get('amount') || 0), closed_by: state.currentUser?.full_name || 'Admin', notes: fd.get('notes') || '' };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        state.cashModalMode = null;
        await loadAllData();
        showToast(isOpenMode ? 'Caisse ouverte' : 'Caisse clôturée (Rapport Z enregistré)');
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Erreur session de caisse');
      }
    };
  }

  const btnToggleTheme = document.getElementById('btn-toggle-theme');
  if (btnToggleTheme) {
    btnToggleTheme.onclick = () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('ez_theme_v2', state.theme);
      render();
    };
  }

  const btnExportCsv = document.getElementById('btn-export-csv');
  if (btnExportCsv) {
    btnExportCsv.onclick = () => {
      window.open('/api/export/products.csv', '_blank');
    };
  }

  const btnBackupDb = document.getElementById('btn-backup-db');
  if (btnBackupDb) {
    btnBackupDb.onclick = async () => {
      if (window.electronAPI?.backupDatabase) {
        const res = await window.electronAPI.backupDatabase();
        if (res?.success) showToast(`Sauvegarde SQLite enregistrée`);
      } else {
        window.open('/api/backup/sqlite', '_blank');
      }
    };
  }

  const btnNewProd = document.getElementById('btn-new-product');
  if (btnNewProd) {
    btnNewProd.onclick = () => {
      state.editingProduct = null;
      state.productModalOpen = true;
      render();
    };
  }

  const btnSyncWoo = document.getElementById('btn-sync-woo');
  if (btnSyncWoo) {
    btnSyncWoo.onclick = async () => {
      const res = await fetch('/api/woocommerce/sync', { method: 'POST' });
      if (res.ok) {
        const d = await res.json();
        await loadAllData();
        showToast(`Synchronisation WooCommerce terminée (${d.syncedCount} articles)`);
      }
    };
  }

  document.querySelectorAll('.btn-inspect-code').forEach((btn) => {
    btn.onclick = () => openBarcodeInspector(btn.getAttribute('data-barcode'));
  });

  const btnCloseInspector = document.getElementById('btn-close-inspector');
  if (btnCloseInspector) {
    btnCloseInspector.onclick = () => {
      state.inspectorOpen = false;
      render();
    };
  }

  const formModalScan = document.getElementById('form-modal-scan');
  if (formModalScan) {
    formModalScan.onsubmit = (e) => {
      e.preventDefault();
      openBarcodeInspector(document.getElementById('input-modal-scan').value);
    };
  }

  const formAddSerial = document.getElementById('form-add-serial');
  if (formAddSerial) {
    formAddSerial.onsubmit = async (e) => {
      e.preventDefault();
      const prodId = Number(formAddSerial.getAttribute('data-prod-id'));
      const sn = document.getElementById('input-new-serial').value.trim();
      if (!sn) return;
      const res = await fetch(`/api/products/${prodId}/serials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serial_number: sn }),
      });
      if (res.ok) {
        await openBarcodeInspector(state.inspectorBarcode);
        await loadAllData();
        showToast(`N° Série ${sn} ajouté`);
      }
    };
  }

  document.querySelectorAll('.btn-del-serial').forEach((btn) => {
    btn.onclick = async () => {
      const id = Number(btn.getAttribute('data-id'));
      const code = btn.getAttribute('data-barcode');
      await fetch(`/api/serials/${id}`, { method: 'DELETE' });
      await openBarcodeInspector(code);
      await loadAllData();
    };
  });

  document.querySelectorAll('.btn-inspector-pos').forEach((btn) => {
    btn.onclick = () => {
      const id = Number(btn.getAttribute('data-id'));
      const tier = btn.getAttribute('data-tier');
      const prod = state.products.find((p) => p.id === id);
      if (prod) {
        state.inspectorOpen = false;
        addToPosCart(prod, tier);
      }
    };
  });

  document.querySelectorAll('.btn-print-barcode').forEach((btn) => {
    btn.onclick = () => {
      const id = Number(btn.getAttribute('data-id'));
      state.barcodeLabelProduct = state.products.find((p) => p.id === id) || null;
      render();
    };
  });

  const btnCloseLabel = document.getElementById('btn-close-label');
  if (btnCloseLabel) {
    btnCloseLabel.onclick = () => {
      state.barcodeLabelProduct = null;
      render();
    };
  }

  document.querySelectorAll('.btn-edit-prod').forEach((btn) => {
    btn.onclick = () => {
      const id = Number(btn.getAttribute('data-id'));
      state.editingProduct = state.products.find((p) => p.id === id) || null;
      state.productModalOpen = true;
      render();
    };
  });

  document.querySelectorAll('.btn-delete-prod').forEach((btn) => {
    btn.onclick = async () => {
      const id = Number(btn.getAttribute('data-id'));
      const prod = state.products.find((p) => p.id === id);
      if (!prod || !confirm(`Supprimer définitivement "${getProdName(prod)}" ?`)) return;
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadAllData();
        showToast('Article supprimé');
      }
    };
  });

  const btnCloseProdModal = document.getElementById('btn-close-prod-modal');
  if (btnCloseProdModal) {
    btnCloseProdModal.onclick = () => {
      if (window.__ezProdCamStream) {
        window.__ezProdCamStream.getTracks().forEach((tr) => tr.stop());
        window.__ezProdCamStream = null;
      }
      state.cameraScanActive = false;
      state.productModalOpen = false;
      state.prefillProduct = null;
      state.internetLookupBanner = null;
      render();
    };
  }

  const runInternetLookupInModal = async (codeOverride) => {
    const codeEl = document.getElementById('prod-barcode');
    const barcode = String(codeOverride ?? codeEl?.value ?? '').trim();
    if (!barcode) {
      showToast('Scannez ou saisissez un code-barres d\'abord');
      return;
    }
    state.internetLookupBanner = { ok: true, msg: `Recherche Internet pour ${barcode} en cours...` };
    render();
    try {
      const res = await fetch(`/api/products/internet-lookup/${encodeURIComponent(barcode)}`);
      const data = await res.json();
      if (data.found) {
        if (data.existsLocally && data.product) {
          state.editingProduct = data.product;
          state.prefillProduct = null;
          state.internetLookupBanner = { ok: true, msg: `Produit déjà enregistré dans votre base locale (${data.product.name_fr}).` };
        } else {
          state.prefillProduct = {
            barcode,
            brand: data.brand || '',
            model_number: data.model_number || '',
            category: data.category || 'Petit Électroménager',
            name_fr: data.name_fr || '',
            name_ar: data.name_ar || '',
            name_en: data.name_en || '',
            description_fr: data.description_fr || data.specs_text || '',
          };
          state.internetLookupBanner = { ok: true, msg: `Infos récupérées depuis ${data.source || 'Internet'} — vérifiez et complétez les prix.` };
        }
      } else {
        state.prefillProduct = { ...(state.prefillProduct || {}), barcode };
        state.internetLookupBanner = { ok: false, msg: data.message || 'Introuvable sur Internet — saisissez manuellement ou complétez par IA.' };
      }
    } catch {
      state.internetLookupBanner = { ok: false, msg: 'Hors ligne ou erreur recherche Internet — saisie manuelle active.' };
    }
    render();
  };

  const btnInternetLookup = document.getElementById('btn-internet-lookup');
  if (btnInternetLookup) btnInternetLookup.onclick = () => runInternetLookupInModal();

  const prodBarcodeInp = document.getElementById('prod-barcode');
  if (prodBarcodeInp) {
    prodBarcodeInp.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        runInternetLookupInModal(prodBarcodeInp.value);
      }
    };
  }

  const btnGenEan = document.getElementById('btn-gen-ean');
  if (btnGenEan) {
    btnGenEan.onclick = () => {
      const el = document.getElementById('prod-barcode');
      if (el) el.value = `611${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    };
  }

  const btnCamBarcodeModal = document.getElementById('btn-camera-barcode-modal');
  if (btnCamBarcodeModal) {
    btnCamBarcodeModal.onclick = async () => {
      if (state.cameraScanActive) {
        if (window.__ezProdCamStream) {
          window.__ezProdCamStream.getTracks().forEach((tr) => tr.stop());
          window.__ezProdCamStream = null;
        }
        state.cameraScanActive = false;
        render();
        return;
      }
      if (!navigator.mediaDevices?.getUserMedia || !('BarcodeDetector' in window)) {
        showToast('Caméra web/BarcodeDetector non disponible : utilisez une douchette USB ou votre téléphone Android.');
        document.getElementById('prod-barcode')?.focus();
        return;
      }
      state.cameraScanActive = true;
      render();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        window.__ezProdCamStream = stream;
        const vid = document.getElementById('prod-camera-video');
        if (vid) {
          vid.srcObject = stream;
          const detector = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39', 'qr_code'] });
          const tick = async () => {
            if (!state.cameraScanActive || !vid) return;
            try {
              const codes = await detector.detect(vid);
              if (codes && codes.length > 0 && codes[0].rawValue) {
                const scanned = codes[0].rawValue;
                stream.getTracks().forEach((tr) => tr.stop());
                window.__ezProdCamStream = null;
                state.cameraScanActive = false;
                await runInternetLookupInModal(scanned);
                return;
              }
            } catch {}
            if (state.cameraScanActive) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      } catch (err) {
        state.cameraScanActive = false;
        render();
        showToast('Accès caméra refusé ou indisponible.');
      }
    };
  }

  const btnScanAddProd = document.getElementById('btn-scan-add-product');
  if (btnScanAddProd) {
    btnScanAddProd.onclick = () => {
      state.editingProduct = null;
      state.prefillProduct = { barcode: '' };
      state.internetLookupBanner = { ok: true, msg: 'Scannez le code-barres (douchette ou caméra) puis Entrée pour rechercher automatiquement sur Internet.' };
      state.productModalOpen = true;
      render();
      setTimeout(() => document.getElementById('prod-barcode')?.focus(), 50);
    };
  }

  const btnInspInternetCreate = document.getElementById('btn-inspector-internet-create');
  if (btnInspInternetCreate) {
    btnInspInternetCreate.onclick = async () => {
      const code = btnInspInternetCreate.getAttribute('data-code') || '';
      state.inspectorOpen = false;
      state.editingProduct = null;
      state.prefillProduct = { barcode: code };
      state.productModalOpen = true;
      render();
      await runInternetLookupInModal(code);
    };
  }

  const btnInspManualCreate = document.getElementById('btn-inspector-manual-create');
  if (btnInspManualCreate) {
    btnInspManualCreate.onclick = () => {
      const code = btnInspManualCreate.getAttribute('data-code') || '';
      state.inspectorOpen = false;
      state.editingProduct = null;
      state.prefillProduct = { barcode: code };
      state.internetLookupBanner = { ok: false, msg: 'Mode saisie manuelle — complétez les informations du produit.' };
      state.productModalOpen = true;
      render();
    };
  }

  const btnAiFill = document.getElementById('btn-ai-fill');
  if (btnAiFill) {
    btnAiFill.onclick = async () => {
      const barcode = document.getElementById('prod-barcode')?.value || '';
      const brand = document.getElementById('prod-brand').value;
      const model = document.getElementById('prod-model').value;
      const category = document.getElementById('prod-category').value;
      const hintName = document.getElementById('prod-name-fr').value;
      const res = await fetch('/api/ai/generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode, brand, model_number: model, category, hint_name: hintName }),
      });
      if (res.ok) {
        const ai = await res.json();
        if (ai.brand && !document.getElementById('prod-brand').value) document.getElementById('prod-brand').value = ai.brand;
        if (ai.model_number && !document.getElementById('prod-model').value) document.getElementById('prod-model').value = ai.model_number;
        document.getElementById('prod-name-fr').value = ai.name_fr || '';
        document.getElementById('prod-name-ar').value = ai.name_ar || '';
        document.getElementById('prod-name-en').value = ai.name_en || '';
        document.getElementById('prod-desc-fr').value = ai.description_fr || '';
        showToast(`Fiches générées (${String(ai.source || 'template').toUpperCase()})`);
      }
    };
  }

  const formProdModal = document.getElementById('form-product-modal');
  if (formProdModal) {
    formProdModal.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(formProdModal);
      const payload = Object.fromEntries(fd.entries());
      const url = state.editingProduct
        ? `/api/products/${state.editingProduct.id}`
        : '/api/products';
      const method = state.editingProduct ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        if (window.__ezProdCamStream) {
          window.__ezProdCamStream.getTracks().forEach((tr) => tr.stop());
          window.__ezProdCamStream = null;
        }
        state.cameraScanActive = false;
        state.productModalOpen = false;
        state.prefillProduct = null;
        state.internetLookupBanner = null;
        await loadAllData();
        showToast('Article enregistré');
      }
    };
  }

  let prodSearchTimer = null;
  const inputProdSearch = document.getElementById('input-prod-search');
  if (inputProdSearch) {
    inputProdSearch.oninput = (e) => {
      state.productSearch = e.target.value;
      clearTimeout(prodSearchTimer);
      prodSearchTimer = setTimeout(() => {
        const tbody = document.getElementById('products-catalog-tbody');
        if (tbody) {
          tbody.innerHTML = renderCatalogRows(getFilteredProducts());
          attachEvents();
        } else {
          render();
        }
      }, 120);
    };
  }

  const selectProdCat = document.getElementById('select-prod-cat');
  if (selectProdCat) {
    selectProdCat.onchange = (e) => {
      state.selectedCategory = e.target.value;
      render();
    };
  }

  const btnTierRetail = document.getElementById('btn-tier-retail');
  if (btnTierRetail) btnTierRetail.onclick = () => switchPosTier('retail');

  const btnTierWholesale = document.getElementById('btn-tier-wholesale');
  if (btnTierWholesale) btnTierWholesale.onclick = () => switchPosTier('wholesale');

  document.querySelectorAll('.btn-add-pos').forEach((btn) => {
    btn.onclick = () => {
      const id = Number(btn.getAttribute('data-id'));
      const p = state.products.find((prod) => prod.id === id);
      if (p) addToPosCart(p);
    };
  });

  const formPosBarcode = document.getElementById('form-pos-barcode');
  if (formPosBarcode) {
    formPosBarcode.onsubmit = (e) => {
      e.preventDefault();
      const code = document.getElementById('input-pos-barcode').value.trim();
      const found = state.products.find(
        (p) =>
          p.barcode === code ||
          p.sku.toLowerCase() === code.toLowerCase() ||
          p.model_number.toLowerCase() === code.toLowerCase()
      );
      if (found) addToPosCart(found);
      else showToast(`Référence introuvable : ${code}`);
    };
  }

  const btnClearCart = document.getElementById('btn-clear-cart');
  if (btnClearCart) {
    btnClearCart.onclick = () => {
      state.posCart = [];
      render();
    };
  }

  document.querySelectorAll('.btn-remove-cart').forEach((btn) => {
    btn.onclick = () => {
      const idx = Number(btn.getAttribute('data-idx'));
      state.posCart.splice(idx, 1);
      render();
    };
  });

  document.querySelectorAll('.input-cart-qty').forEach((inp) => {
    inp.onchange = (e) => {
      const idx = Number(inp.getAttribute('data-idx'));
      const q = Math.max(1, Number(e.target.value));
      state.posCart[idx].quantity = q;
      state.posCart[idx].subtotal = q * state.posCart[idx].unit_price;
      render();
    };
  });

  document.querySelectorAll('.input-cart-price').forEach((inp) => {
    inp.onchange = (e) => {
      const idx = Number(inp.getAttribute('data-idx'));
      const p = Number(e.target.value);
      state.posCart[idx].unit_price = p;
      state.posCart[idx].subtotal = state.posCart[idx].quantity * p;
      render();
    };
  });

  document.querySelectorAll('.input-cart-sn').forEach((inp) => {
    inp.onchange = (e) => {
      const idx = Number(inp.getAttribute('data-idx'));
      state.posCart[idx].serial_number = e.target.value;
    };
  });

  const btnPosNewCust = document.getElementById('btn-pos-new-customer');
  if (btnPosNewCust) {
    btnPosNewCust.onclick = () => {
      state.quickCustomerModalOpen = true;
      render();
    };
  }

  const btnCloseQuickCust = document.getElementById('btn-close-quick-cust');
  if (btnCloseQuickCust) {
    btnCloseQuickCust.onclick = () => {
      state.quickCustomerModalOpen = false;
      render();
    };
  }

  const formQuickCust = document.getElementById('form-quick-cust');
  if (formQuickCust) {
    formQuickCust.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(formQuickCust);
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      if (res.ok) {
        const created = await res.json();
        state.quickCustomerModalOpen = false;
        await loadAllData();
        state.posCustomerId = created.id;
        if (created.customer_type === 'wholesale') switchPosTier('wholesale');
        render();
        showToast(`Client ${created.name} sélectionné`);
      }
    };
  }

  const selPosCust = document.getElementById('select-pos-customer');
  if (selPosCust) {
    selPosCust.onchange = (e) => {
      state.posCustomerId = e.target.value;
      const cust = state.customers.find((c) => c.id === Number(e.target.value));
      if (cust && cust.customer_type === 'wholesale') switchPosTier('wholesale');
      render();
    };
  }

  const selPosMethod = document.getElementById('select-pos-method');
  if (selPosMethod) {
    selPosMethod.onchange = (e) => {
      state.posPaymentMethod = e.target.value;
    };
  }

  const inpDiscount = document.getElementById('input-pos-discount');
  if (inpDiscount) {
    inpDiscount.onchange = (e) => {
      state.posDiscount = Number(e.target.value);
      render();
    };
  }

  const inpPaid = document.getElementById('input-pos-paid');
  if (inpPaid) {
    inpPaid.onchange = (e) => {
      state.posPaidAmount = e.target.value;
      render();
    };
  }

  const selInst = document.getElementById('select-pos-installments');
  if (selInst) {
    selInst.onchange = (e) => {
      state.posInstallmentsCount = Number(e.target.value);
      render();
    };
  }

  const btnCompleteSale = document.getElementById('btn-complete-sale');
  if (btnCompleteSale) {
    btnCompleteSale.onclick = async () => {
      const cust = state.customers.find((c) => c.id === Number(state.posCustomerId));
      const { effectiveDiscount, posTotal } = getPosTotals();
      const paid = state.posPaidAmount === '' ? posTotal : Number(state.posPaidAmount);
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: cust ? cust.id : null,
          customer_name: cust ? cust.name : 'Client Comptoir',
          price_tier: state.posPriceTier,
          items: state.posCart,
          discount: effectiveDiscount,
          paid_amount: paid,
          payment_method: paid < posTotal ? 'installment' : state.posPaymentMethod,
          installments_count: paid < posTotal ? state.posInstallmentsCount : 0,
        }),
      });
      if (res.ok) {
        const sale = await res.json();
        state.posCart = [];
        state.posDiscount = 0;
        state.posPaidAmount = '';
        state.printableSale = sale;
        await loadAllData();
        showToast(`Facture ${sale.invoice_number} enregistrée`);
      }
    };
  }

  document.querySelectorAll('.btn-print-sale').forEach((btn) => {
    btn.onclick = () => {
      const id = Number(btn.getAttribute('data-sale-id'));
      state.printableSale = state.sales.find((s) => s.id === id) || null;
      render();
    };
  });

  document.querySelectorAll('.btn-cancel-sale').forEach((btn) => {
    btn.onclick = async () => {
      const id = Number(btn.getAttribute('data-sale-id'));
      const sale = state.sales.find((s) => s.id === id);
      if (!sale || !confirm(`Annuler la vente ${sale.invoice_number} et réintégrer les articles en stock ?`)) return;
      const res = await fetch(`/api/sales/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadAllData();
        showToast(`Vente ${sale.invoice_number} annulée et stock restauré`);
      }
    };
  });

  const btnFmtA4 = document.getElementById('btn-fmt-a4');
  if (btnFmtA4) {
    btnFmtA4.onclick = () => {
      state.printFormat = 'a4';
      render();
    };
  }

  const btnFmtThermal = document.getElementById('btn-fmt-thermal');
  if (btnFmtThermal) {
    btnFmtThermal.onclick = () => {
      state.printFormat = 'thermal';
      render();
    };
  }

  const btnTriggerPrint = document.getElementById('btn-trigger-print');
  if (btnTriggerPrint) {
    btnTriggerPrint.onclick = () => {
      if (window.electronAPI?.printDocument) {
        window.electronAPI.printDocument();
      } else {
        window.print();
      }
    };
  }

  const btnClosePrint = document.getElementById('btn-close-print');
  if (btnClosePrint) {
    btnClosePrint.onclick = () => {
      state.printableSale = null;
      render();
    };
  }

  // Purchases & Suppliers events
  document.querySelectorAll('.btn-add-pur-item').forEach((btn) => {
    btn.onclick = () => {
      const id = Number(btn.getAttribute('data-id'));
      const p = state.products.find((prod) => prod.id === id);
      if (p && !state.purchaseItems.some((i) => i.product_id === p.id)) {
        state.purchaseItems.push({
          product_id: p.id,
          quantity: 5,
          unit_cost: p.current_cost_price,
          new_wholesale_price: p.wholesale_price,
          new_retail_price: p.retail_price,
        });
        render();
      }
    };
  });

  document.querySelectorAll('.btn-remove-pur-item').forEach((btn) => {
    btn.onclick = () => {
      state.purchaseItems.splice(Number(btn.getAttribute('data-idx')), 1);
      render();
    };
  });

  document.querySelectorAll('.pur-qty').forEach((inp) => {
    inp.onchange = (e) => {
      state.purchaseItems[Number(inp.getAttribute('data-idx'))].quantity = Number(e.target.value);
      render();
    };
  });
  document.querySelectorAll('.pur-cost').forEach((inp) => {
    inp.onchange = (e) => {
      state.purchaseItems[Number(inp.getAttribute('data-idx'))].unit_cost = Number(e.target.value);
      render();
    };
  });
  document.querySelectorAll('.pur-wholesale').forEach((inp) => {
    inp.onchange = (e) => {
      state.purchaseItems[Number(inp.getAttribute('data-idx'))].new_wholesale_price = Number(e.target.value);
    };
  });
  document.querySelectorAll('.pur-retail').forEach((inp) => {
    inp.onchange = (e) => {
      state.purchaseItems[Number(inp.getAttribute('data-idx'))].new_retail_price = Number(e.target.value);
    };
  });

  const inpPurPaid = document.getElementById('input-pur-paid');
  if (inpPurPaid) {
    inpPurPaid.onchange = (e) => {
      state.purchasePaidAmount = e.target.value;
    };
  }

  const btnSubmitPurchase = document.getElementById('btn-submit-purchase');
  if (btnSubmitPurchase) {
    btnSubmitPurchase.onclick = async () => {
      const supId = Number(document.getElementById('select-pur-supplier')?.value || 1);
      const ref = document.getElementById('input-pur-ref')?.value || '';
      const paid = document.getElementById('input-pur-paid')?.value ?? '';
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplier_id: supId,
          invoice_number: ref,
          paid_amount: paid,
          items: state.purchaseItems,
        }),
      });
      if (res.ok) {
        state.purchaseItems = [];
        state.purchasePaidAmount = '';
        await loadAllData();
        showToast('Réception enregistrée et historique des prix mis à jour');
      }
    };
  }

  document.querySelectorAll('.btn-pay-supplier').forEach((btn) => {
    btn.onclick = async () => {
      const id = Number(btn.getAttribute('data-id'));
      const owed = Number(btn.getAttribute('data-owed'));
      const amtStr = prompt(`Montant à régler au fournisseur (Solde dû: ${owed} MAD) :`, String(owed));
      if (!amtStr) return;
      const res = await fetch(`/api/suppliers/${id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amtStr) }),
      });
      if (res.ok) {
        await loadAllData();
        showToast('Règlement fournisseur enregistré');
      }
    };
  });

  const formNewSup = document.getElementById('form-new-supplier');
  if (formNewSup) {
    formNewSup.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(formNewSup);
      await fetch('/api/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      await loadAllData();
      showToast('Fournisseur ajouté');
    };
  }

  // Customers & Installments
  document.querySelectorAll('.btn-open-ledger').forEach((el) => {
    el.onclick = async () => {
      const id = Number(el.getAttribute('data-id'));
      const res = await fetch(`/api/customers/${id}/ledger`);
      if (res.ok) {
        state.customerLedger = await res.json();
        render();
      }
    };
  });

  const formAddCustTab = document.getElementById('form-add-customer-tab');
  if (formAddCustTab) {
    formAddCustTab.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(formAddCustTab);
      await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      await loadAllData();
      showToast('Client enregistré');
    };
  }

  const formFreePayment = document.getElementById('form-free-payment');
  if (formFreePayment) {
    formFreePayment.onsubmit = async (e) => {
      e.preventDefault();
      const amount = Number(document.getElementById('input-free-payment').value);
      if (!amount || amount <= 0 || !state.customerLedger) return;
      const custId = state.customerLedger.customer.id;
      const res = await fetch(`/api/customers/${custId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, notes: 'Versement sur compte client' }),
      });
      if (res.ok) {
        state.freePaymentAmount = '';
        const ledgerRes = await fetch(`/api/customers/${custId}/ledger`);
        state.customerLedger = await ledgerRes.json();
        await loadAllData();
        showToast('Versement enregistré');
      }
    };
  }

  document.querySelectorAll('.btn-pay-inst').forEach((btn) => {
    btn.onclick = async () => {
      const instId = Number(btn.getAttribute('data-inst-id'));
      const amount = Number(btn.getAttribute('data-amount'));
      const custId = state.customerLedger.customer.id;
      const res = await fetch(`/api/customers/${custId}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, installment_id: instId, notes: `Règlement traite #${instId}` }),
      });
      if (res.ok) {
        const ledgerRes = await fetch(`/api/customers/${custId}/ledger`);
        state.customerLedger = await ledgerRes.json();
        await loadAllData();
        showToast('Échéance encaissée');
      }
    };
  });

  // Expenses
  const formExpense = document.getElementById('form-add-expense');
  if (formExpense) {
    formExpense.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(formExpense);
      await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      await loadAllData();
      showToast('Dépense enregistrée');
    };
  }

  document.querySelectorAll('.btn-del-expense').forEach((btn) => {
    btn.onclick = async () => {
      const id = Number(btn.getAttribute('data-id'));
      await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      await loadAllData();
      showToast('Dépense supprimée');
    };
  });

  const btnSimPair = document.getElementById('btn-sim-android-pair');
  if (btnSimPair) {
    btnSimPair.onclick = async () => {
      await fetch('/api/android/pair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: 'TERMINAL-ANDROID-01',
          deviceName: 'Terminal Scanner Magasin (Android)',
          token: state.networkInfo?.pairingToken,
        }),
      });
      await loadAllData();
      showToast('Terminal Android appairé');
    };
  }

  const btnSimScan = document.getElementById('btn-sim-android-scan');
  if (btnSimScan) {
    btnSimScan.onclick = () => openBarcodeInspector('8806094892154');
  }

  const btnPosViewTable = document.getElementById('btn-pos-view-table');
  if (btnPosViewTable) btnPosViewTable.onclick = () => { state.posViewMode = 'table'; render(); };
  const btnPosViewGrid = document.getElementById('btn-pos-view-grid');
  if (btnPosViewGrid) btnPosViewGrid.onclick = () => { state.posViewMode = 'grid'; render(); };

  document.querySelectorAll('[data-pos-cat]').forEach((btn) => {
    btn.onclick = () => {
      state.selectedCategory = btn.getAttribute('data-pos-cat') || 'ALL';
      render();
    };
  });

  const inpCashRecv = document.getElementById('input-pos-cash-received');
  if (inpCashRecv) {
    inpCashRecv.onchange = (e) => {
      state.posCashReceived = e.target.value;
      render();
    };
  }
  document.querySelectorAll('.btn-quick-bill').forEach((btn) => {
    btn.onclick = () => {
      state.posCashReceived = btn.getAttribute('data-bill') || '';
      render();
    };
  });

  const formSettings = document.getElementById('form-save-settings');
  if (formSettings) {
    formSettings.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(formSettings);
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      await loadAllData();
      showToast('Paramètres sauvegardés');
    };
  }

  const btnBackupNow = document.getElementById('btn-backup-now');
  if (btnBackupNow) {
    btnBackupNow.onclick = async () => {
      const res = await fetch('/api/backups/now', { method: 'POST' });
      if (res.ok) {
        await loadAllData();
        showToast('Sauvegarde SQLite créée dans data/backups/');
      }
    };
  }

  const inputImportCsv = document.getElementById('input-import-csv');
  if (inputImportCsv) {
    inputImportCsv.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        showToast('CSV vide');
        return;
      }
      const sep = lines[0].includes(';') ? ';' : ',';
      const headers = lines[0].split(sep).map((h) => h.trim().toLowerCase().replace(/^"|"$/g, ''));
      const rows = lines.slice(1).map((line) => {
        const cols = line.split(sep).map((c) => c.trim().replace(/^"|"$/g, ''));
        const obj = {};
        headers.forEach((h, idx) => { obj[h] = cols[idx] || ''; });
        return {
          barcode: obj.barcode || obj.code_barres || obj.ean || '',
          sku: obj.sku || obj.ref || '',
          model_number: obj.model_number || obj.modele || obj.model || '',
          brand: obj.brand || obj.marque || '',
          category: obj.category || obj.categorie || 'Gros Électroménager',
          name_fr: obj.name_fr || obj.designation_fr || obj.name || obj.nom || '',
          current_cost_price: Number(obj.current_cost_price || obj.cout_actuel_mad || obj.cost || 0),
          wholesale_price: Number(obj.wholesale_price || obj.prix_gros_mad || obj.wholesale || 0),
          retail_price: Number(obj.retail_price || obj.prix_detail_mad || obj.retail || obj.price || 0),
          stock_quantity: Number(obj.stock_quantity || obj.stock || 0),
          warranty_months: Number(obj.warranty_months || obj.garantie_mois || 12),
        };
      });
      const res = await fetch('/api/import/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows }),
      });
      if (res.ok) {
        const d = await res.json();
        await loadAllData();
        showToast(`Import CSV terminé : ${d.imported} articles importés / mis à jour`);
      }
    };
  }

  const btnOpenResetStore = document.getElementById('btn-open-reset-store');
  if (btnOpenResetStore) {
    btnOpenResetStore.onclick = () => {
      state.resetModalOpen = true;
      render();
    };
  }
  const btnCloseReset = document.getElementById('btn-close-reset');
  if (btnCloseReset) {
    btnCloseReset.onclick = () => {
      state.resetModalOpen = false;
      render();
    };
  }
  const formResetStore = document.getElementById('form-reset-store');
  if (formResetStore) {
    formResetStore.onsubmit = async (e) => {
      e.preventDefault();
      if (!confirm('Confirmez-vous la suppression définitive des données de démonstration ?')) return;
      const fd = new FormData(formResetStore);
      const res = await fetch('/api/setup/reset-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      if (res.ok) {
        state.resetModalOpen = false;
        await loadAllData();
        showToast('Base réinitialisée pour la mise en production');
      }
    };
  }

  // Dashboard Range Pills & Quick Add Product
  document.querySelectorAll('[data-dash-range]').forEach((btn) => {
    btn.onclick = async () => {
      state.dashRange = btn.getAttribute('data-dash-range') || 'all';
      await loadAllData();
    };
  });
  const btnDashAddProd = document.getElementById('btn-dash-add-product');
  if (btnDashAddProd) btnDashAddProd.onclick = () => { state.editingProduct = null; state.productModalOpen = true; render(); };

  // POS Extras: Hold / Drafts / Calculator / Today Sales / % Discount / Create Devis
  const btnToggleDiscMode = document.getElementById('btn-toggle-disc-mode');
  if (btnToggleDiscMode) {
    btnToggleDiscMode.onclick = () => {
      state.posDiscountMode = state.posDiscountMode === 'pct' ? 'mad' : 'pct';
      state.posDiscount = 0;
      render();
    };
  }
  const btnPosHold = document.getElementById('btn-pos-hold');
  if (btnPosHold) {
    btnPosHold.onclick = () => {
      if (!state.posCart.length) return;
      const { posTotal } = getPosTotals();
      const cust = state.customers.find((c) => c.id === Number(state.posCustomerId));
      state.posDrafts.unshift({
        label: cust ? cust.name : 'Client Comptoir',
        savedAt: new Date().toLocaleTimeString('fr-MA', { hour: '2-digit', minute: '2-digit' }),
        total: posTotal,
        customerId: state.posCustomerId,
        tier: state.posPriceTier,
        discount: state.posDiscount,
        cart: JSON.parse(JSON.stringify(state.posCart)),
      });
      localStorage.setItem('ez_pos_drafts', JSON.stringify(state.posDrafts.slice(0, 15)));
      state.posCart = [];
      state.posDiscount = 0;
      state.posPaidAmount = '';
      render();
      showToast('Ticket mis en attente dans Brouillons');
    };
  }
  const btnPosDrafts = document.getElementById('btn-pos-drafts');
  if (btnPosDrafts) btnPosDrafts.onclick = () => { state.posDraftModalOpen = true; render(); };
  const btnCloseDrafts = document.getElementById('btn-close-drafts');
  if (btnCloseDrafts) btnCloseDrafts.onclick = () => { state.posDraftModalOpen = false; render(); };
  document.querySelectorAll('.btn-resume-draft').forEach((b) => {
    b.onclick = () => {
      const idx = Number(b.getAttribute('data-idx'));
      const dr = state.posDrafts[idx];
      if (!dr) return;
      state.posCart = dr.cart || [];
      state.posCustomerId = dr.customerId || '';
      state.posPriceTier = dr.tier || 'retail';
      state.posDiscount = dr.discount || 0;
      state.posDrafts.splice(idx, 1);
      localStorage.setItem('ez_pos_drafts', JSON.stringify(state.posDrafts));
      state.posDraftModalOpen = false;
      render();
    };
  });
  document.querySelectorAll('.btn-del-draft').forEach((b) => {
    b.onclick = () => {
      state.posDrafts.splice(Number(b.getAttribute('data-idx')), 1);
      localStorage.setItem('ez_pos_drafts', JSON.stringify(state.posDrafts));
      render();
    };
  });

  const btnPosToday = document.getElementById('btn-pos-today');
  if (btnPosToday) btnPosToday.onclick = () => { state.todaySalesModalOpen = true; render(); };
  const btnCloseToday = document.getElementById('btn-close-today-sales');
  if (btnCloseToday) btnCloseToday.onclick = () => { state.todaySalesModalOpen = false; render(); };

  const btnPosCalc = document.getElementById('btn-pos-calc');
  if (btnPosCalc) btnPosCalc.onclick = () => { state.posCalcOpen = true; render(); };
  const btnCloseCalc = document.getElementById('btn-close-calc');
  if (btnCloseCalc) btnCloseCalc.onclick = () => { state.posCalcOpen = false; render(); };
  document.querySelectorAll('.calc-key').forEach((b) => {
    b.onclick = () => {
      const k = b.getAttribute('data-k');
      if (k === 'C') state.posCalcDisplay = '0';
      else if (k === '=') {
        try {
          const clean = String(state.posCalcDisplay).replace(/[^0-9+\-*/.]/g, '');
          const val = Function(`"use strict";return (${clean || '0'})`)();
          state.posCalcDisplay = Number.isFinite(val) ? String(Math.round(val * 100) / 100) : 'Erreur';
        } catch {
          state.posCalcDisplay = 'Erreur';
        }
      } else {
        state.posCalcDisplay = state.posCalcDisplay === '0' || state.posCalcDisplay === 'Erreur' ? k : state.posCalcDisplay + k;
      }
      render();
    };
  });

  const btnSaveQuote = document.getElementById('btn-save-quotation');
  if (btnSaveQuote) {
    btnSaveQuote.onclick = async () => {
      if (!state.posCart.length) return;
      const cust = state.customers.find((c) => c.id === Number(state.posCustomerId));
      const { effectiveDiscount } = getPosTotals();
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: cust ? cust.id : null,
          customer_name: cust ? cust.name : 'Client Comptoir',
          price_tier: state.posPriceTier,
          discount: effectiveDiscount,
          items: state.posCart,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        state.posCart = [];
        state.posDiscount = 0;
        await loadAllData();
        state.activeTab = 'quotations';
        state.quotationsSubTab = 'quotes';
        showToast(`Devis ${created.quote_number} enregistré`);
      }
    };
  }

  // Quotations & SAV Sub-tabs & Actions
  document.querySelectorAll('[data-qsub]').forEach((b) => {
    b.onclick = () => { state.quotationsSubTab = b.getAttribute('data-qsub'); render(); };
  });
  document.querySelectorAll('.btn-print-quote').forEach((b) => {
    b.onclick = () => {
      state.printableQuote = state.quotations.find((q) => q.id === Number(b.getAttribute('data-id'))) || null;
      render();
    };
  });
  const btnCloseQPrint = document.getElementById('btn-close-quote-print');
  if (btnCloseQPrint) btnCloseQPrint.onclick = () => { state.printableQuote = null; render(); };
  const btnQPrintNow = document.getElementById('btn-print-quote-now');
  if (btnQPrintNow) btnQPrintNow.onclick = () => window.print();
  document.querySelectorAll('.btn-convert-quote').forEach((b) => {
    b.onclick = async () => {
      const id = b.getAttribute('data-id');
      const res = await fetch(`/api/quotations/${id}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_method: 'cash' }),
      });
      if (res.ok) {
        const sale = await res.json();
        await loadAllData();
        state.printableSale = sale;
        showToast(`Devis converti en facture ${sale.invoice_number}`);
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || 'Conversion impossible');
      }
    };
  });
  document.querySelectorAll('.btn-del-quote').forEach((b) => {
    b.onclick = async () => {
      await fetch(`/api/quotations/${b.getAttribute('data-id')}`, { method: 'DELETE' });
      await loadAllData();
    };
  });

  const formSav = document.getElementById('form-new-sav');
  if (formSav) {
    formSav.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(formSav);
      const res = await fetch('/api/service-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      if (res.ok) {
        await loadAllData();
        showToast('Ticket SAV créé');
      }
    };
  }
  document.querySelectorAll('.sel-sav-status').forEach((s) => {
    s.onchange = async () => {
      await fetch(`/api/service-jobs/${s.getAttribute('data-id')}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: s.value }),
      });
      await loadAllData();
      showToast('Statut SAV mis à jour');
    };
  });

  // Reports Sub-tabs, P&L Period & Stock Adjustments
  document.querySelectorAll('[data-rsub]').forEach((b) => {
    b.onclick = () => { state.reportsSubTab = b.getAttribute('data-rsub'); render(); };
  });
  document.querySelectorAll('[data-pnl-range]').forEach((b) => {
    b.onclick = async () => {
      state.pnlRange = b.getAttribute('data-pnl-range') || '30d';
      await loadAllData();
    };
  });
  const formAdj = document.getElementById('form-stock-adj');
  if (formAdj) {
    formAdj.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(formAdj);
      const res = await fetch('/api/stock-adjustments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...Object.fromEntries(fd.entries()), user_name: state.currentUser?.full_name || 'Admin' }),
      });
      if (res.ok) {
        await loadAllData();
        showToast('Ajustement de stock enregistré');
      }
    };
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'F2') {
    e.preventDefault();
    if (state.inspectorOpen) {
      state.inspectorOpen = false;
      render();
    } else {
      openBarcodeInspector('');
    }
  } else if (e.key === 'F9' && state.activeTab === 'pos') {
    e.preventDefault();
    document.getElementById('btn-complete-sale')?.click();
  } else if (e.key === 'Escape') {
    if (
      state.inspectorOpen ||
      state.productModalOpen ||
      state.printableSale ||
      state.barcodeLabelProduct ||
      state.quickCustomerModalOpen ||
      state.pinModalOpen ||
      state.cashModalMode ||
      state.resetModalOpen ||
      state.posDraftModalOpen ||
      state.posCalcOpen ||
      state.todaySalesModalOpen ||
      state.printableQuote
    ) {
      state.inspectorOpen = false;
      state.productModalOpen = false;
      state.printableSale = null;
      state.barcodeLabelProduct = null;
      state.quickCustomerModalOpen = false;
      state.pinModalOpen = false;
      state.cashModalMode = null;
      state.resetModalOpen = false;
      state.posDraftModalOpen = false;
      state.posCalcOpen = false;
      state.todaySalesModalOpen = false;
      state.printableQuote = null;
      render();
    }
  }
});

const evtSource = new EventSource('/api/events');
evtSource.onmessage = (event) => {
  try {
    const msg = JSON.parse(event.data);
    if (msg.type === 'REMOTE_BARCODE_SCANNED' && msg.data?.barcode) {
      openBarcodeInspector(msg.data.barcode);
      showToast(`Code scanné (${msg.data.barcode})`);
    } else if (msg.type !== 'CONNECTED') {
      loadAllData();
    }
  } catch {
    // ignore
  }
};

loadAllData();
