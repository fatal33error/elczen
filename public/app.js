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
  image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="11" x2="14" y2="11"/><line x1="6" y1="14" x2="11" y2="14"/><line x1="16" y1="11" x2="19" y2="11"/></svg>`,
  transfer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
};

const I18N = {
  fr: {
    dashboard: 'Tableau de Bord & Caisse',
    pos: 'Caisse & Facturation',
    sales: 'Ventes & Garanties',
    products: 'Catalogue, Photos & Stock',
    quotations: 'Devis & Atelier SAV',
    purchases: 'Achats & Factures IA',
    customers: 'Clients & Crédits',
    expenses: 'Trésorerie, Chèques & Charges',
    reports: 'Rapports P&L & Marges',
    connect: 'WooCommerce & Terminaux',
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
    dashboard: 'لوحة القيادة والصندوق',
    pos: 'نقطة البيع والفوترة',
    sales: 'المبيعات والضمانات',
    products: 'المنتجات، الصور والمخزون',
    quotations: 'عروض الأسعار والصيانة',
    purchases: 'المشتريات وفواتير الذكاء',
    customers: 'الزبائن والائتمان',
    expenses: 'المصاريف والخزينة',
    reports: 'التقارير والأرباح',
    connect: 'ووكومرس والأجهزة',
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
    dashboard: 'Dashboard & Cash',
    pos: 'Point of Sale',
    sales: 'Sales & Warranties',
    products: 'Catalog, Photos & Stock',
    quotations: 'Quotations & Repair',
    purchases: 'Purchases & AI Invoices',
    customers: 'Customers & Credit',
    expenses: 'Expenses & Cashflow',
    reports: 'Profit & Margins',
    connect: 'WooCommerce & Devices',
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
  productsSubTab: 'list', // 'list' | 'gallery' | 'adjustments'
  productsFilterMode: 'all', // 'all' | 'low_stock' | 'no_photo' | 'woo_pending'
  connectSubTab: 'woo', // 'woo' | 'orders' | 'android' | 'settings'
  expensesSubTab: 'checks', // 'checks' | 'expenses'
  dashboard: null,
  quotations: [],
  serviceJobs: [],
  stockAdjustments: [],
  stockTransfers: [],
  bankChecks: [],
  checksStats: { totalIssuedPending: 0, totalReceivedPending: 0, overdueCount: 0, dueSoonCount: 0 },
  wooOrders: [],
  wooOrdersPullLoading: false,
  warrantyLookupQuery: '',
  warrantyLookupResults: null,
  savPrefill: null,
  printableSav: null,
  barcodeLabelCopies: 1,
  barcodeLabelFormat: '50x30',
  checkForm: {
    id: null,
    bank_code: 'cam',
    bank_name: 'Crédit Agricole du Maroc',
    direction: 'issued',
    instrument_type: 'check',
    check_number: '',
    beneficiary_or_issuer: '',
    amount: '',
    issue_city: 'Casablanca',
    issue_date: new Date().toISOString().slice(0, 10),
    due_date: new Date().toISOString().slice(0, 10),
    is_crossed: true,
    non_endorsable: false,
    protect_marks: true,
    lang: 'fr',
    offsetX: Number(localStorage.getItem('ez_check_offset_x') || 0),
    offsetY: Number(localStorage.getItem('ez_check_offset_y') || 0),
    supplier_id: '',
    customer_id: '',
    record_payment: false,
    notes: '',
  },
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
  purchaseNewProviderName: '',
  purchaseNewProviderPhone: '',
  purchaseInvoiceRef: '',
  purchasePaidAmount: '',
  purchaseItems: [],
  invoiceScanLoading: false,
  invoiceScanText: '',
  invoiceScanMessage: '',
  salesSearch: '',
  salesStatusFilter: 'all',
  salesPayFilter: 'all',
  productModalExpanded: false,
  productPhotoAiLoading: false,
  productProPhotoLoading: false,
  productBoxImages: [],
  productGalleryImages: [],
  productStudioMode: 'clean_crop',
  webImageSearchOpen: false,
  webImageSearchQuery: '',
  webImageSearchLoading: false,
  webImageSearchResults: [],
  picturesModalProduct: null,
  picturesModalImages: [],
  picturesModalStudioMode: 'clean_crop',
  picturesModalSearchQuery: '',
  picturesModalSearchLoading: false,
  picturesModalSearchResults: [],
  picturesModalBusy: false,
  wooTestLoading: false,
  wooTestStatus: null,
  wooSyncFilter: 'all',
  wooSyncSearch: '',
  wooSyncReport: null,
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

const MOROCCO_BANK_PRESETS = {
  cam: { code: 'cam', name: 'Crédit Agricole du Maroc (CAM)', cssClass: '', tag: 'CAM • 175×80mm', accent: '#15803d', amountTop: 12, amountRight: 10, words1Top: 23, wordsLeft: 28, words2Top: 31, payTop: 39, payLeft: 26, cityTop: 48, cityLeft: 95, dateTop: 48, dateLeft: 133 },
  awb: { code: 'awb', name: 'Attijariwafa Bank', cssClass: 'check-bank-awb', tag: 'AWB • 175×80mm', accent: '#b45309', amountTop: 13, amountRight: 10, words1Top: 24, wordsLeft: 28, words2Top: 32, payTop: 40, payLeft: 26, cityTop: 49, cityLeft: 94, dateTop: 49, dateLeft: 132 },
  bp: { code: 'bp', name: 'Banque Populaire (BCP)', cssClass: 'check-bank-bp', tag: 'BP • 175×80mm', accent: '#c2410c', amountTop: 12, amountRight: 10, words1Top: 23, wordsLeft: 28, words2Top: 31, payTop: 39, payLeft: 26, cityTop: 48, cityLeft: 94, dateTop: 48, dateLeft: 132 },
  boa: { code: 'boa', name: 'Bank of Africa (BMCE)', cssClass: 'check-bank-boa', tag: 'BOA • 175×80mm', accent: '#1d4ed8', amountTop: 13, amountRight: 11, words1Top: 24, wordsLeft: 29, words2Top: 32, payTop: 40, payLeft: 27, cityTop: 49, cityLeft: 95, dateTop: 49, dateLeft: 133 },
  cih: { code: 'cih', name: 'CIH Bank', cssClass: 'check-bank-cih', tag: 'CIH • 175×80mm', accent: '#0369a1', amountTop: 13, amountRight: 10, words1Top: 24, wordsLeft: 28, words2Top: 32, payTop: 40, payLeft: 26, cityTop: 49, cityLeft: 94, dateTop: 49, dateLeft: 132 },
  sgmb: { code: 'sgmb', name: 'Société Générale Maroc (SGMB)', cssClass: '', tag: 'SGMB • 175×80mm', accent: '#b91c1c', amountTop: 13, amountRight: 10, words1Top: 24, wordsLeft: 28, words2Top: 32, payTop: 40, payLeft: 26, cityTop: 49, cityLeft: 95, dateTop: 49, dateLeft: 133 },
  cdm: { code: 'cdm', name: 'Crédit du Maroc', cssClass: 'check-bank-boa', tag: 'CDM • 175×80mm', accent: '#1e40af', amountTop: 13, amountRight: 10, words1Top: 24, wordsLeft: 28, words2Top: 32, payTop: 40, payLeft: 26, cityTop: 49, cityLeft: 95, dateTop: 49, dateLeft: 133 },
  abb: { code: 'abb', name: 'Al Barid Bank', cssClass: 'check-bank-awb', tag: 'ABB • 175×80mm', accent: '#a16207', amountTop: 13, amountRight: 10, words1Top: 24, wordsLeft: 28, words2Top: 32, payTop: 40, payLeft: 26, cityTop: 49, cityLeft: 95, dateTop: 49, dateLeft: 133 },
};

function numberToArabicWords(n) {
  const num = Math.floor(Math.abs(Number(n || 0)));
  if (num === 0) return 'صفر درهم';
  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];
  function below1000(x) {
    const h = Math.floor(x / 100);
    const r = x % 100;
    const p = [];
    if (h > 0) p.push(hundreds[h]);
    if (r > 0) {
      if (r < 20) p.push(ones[r]);
      else {
        const u = r % 10;
        const t = Math.floor(r / 10);
        p.push(u > 0 ? `${ones[u]} و${tens[t]}` : tens[t]);
      }
    }
    return p.join(' و');
  }
  const millions = Math.floor(num / 1000000);
  const thousands = Math.floor((num % 1000000) / 1000);
  const rest = num % 1000;
  const out = [];
  if (millions === 1) out.push('مليون');
  else if (millions === 2) out.push('مليونان');
  else if (millions > 2) out.push(`${below1000(millions)} مليون`);
  if (thousands === 1) out.push('ألف');
  else if (thousands === 2) out.push('ألفان');
  else if (thousands > 2 && thousands <= 10) out.push(`${below1000(thousands)} آلاف`);
  else if (thousands > 10) out.push(`${below1000(thousands)} ألف`);
  if (rest > 0) out.push(below1000(rest));
  const dec = Math.round((Math.abs(Number(n || 0)) - num) * 100);
  return out.join(' و') + ' درهم' + (dec > 0 ? ` و${dec} سنتيم` : '');
}

function splitCheckWordsLines(text, maxFirstLine = 46) {
  const s = String(text || '').trim();
  if (s.length <= maxFirstLine) return [s, ''];
  const words = s.split(' ');
  let l1 = '';
  let idx = 0;
  for (; idx < words.length; idx++) {
    const next = l1 ? `${l1} ${words[idx]}` : words[idx];
    if (next.length > maxFirstLine && l1) break;
    l1 = next;
  }
  return [l1, words.slice(idx).join(' ')];
}

function generateInternalEan13() {
  const base12 = `611${Math.floor(100000000 + Math.random() * 900000000)}`;
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(base12[i]) * (i % 2 === 0 ? 1 : 3);
  const chk = (10 - (sum % 10)) % 10;
  return `${base12}${chk}`;
}

function normalizeMoroccanPhone(raw) {
  let digits = String(raw || '').replace(/[^0-9+]/g, '');
  if (!digits) return '';
  if (digits.startsWith('+')) digits = digits.slice(1);
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0') && digits.length === 10) digits = `212${digits.slice(1)}`;
  return digits;
}

function sendWhatsAppMessage(rawPhone, message, fallbackCustomerName = '') {
  let phone = String(rawPhone || '').trim();
  if (!phone) {
    phone = prompt(`Numéro WhatsApp du client ${fallbackCustomerName ? `(${fallbackCustomerName})` : ''} (ex: 0661... ou +212661...) :`, '06') || '';
  }
  const normalized = normalizeMoroccanPhone(phone);
  if (!normalized || normalized.length < 9) {
    showToast('Numéro WhatsApp invalide ou annulé');
    return;
  }
  const url = `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

function buildSaleWhatsAppMessage(sale) {
  const store = state.settings.store_name || 'ELECTROZEN';
  const itemsLines = (sale.items || []).map((i) => `• ${i.quantity}x ${i.product_name} (${fmtMoney(i.subtotal)}) — Garantie ${i.warranty_months} mois`).join('\n');
  return `Bonjour ${sale.customer_name || 'Client'},\nMerci pour votre achat chez *${store}* !\n\n📄 *Facture / Garantie :* ${sale.invoice_number}\n📅 *Date :* ${String(sale.created_at || '').slice(0, 16)}\n${itemsLines}\n\n💰 *Total TTC :* ${fmtMoney(sale.total_amount)}\n✅ *Réglé :* ${fmtMoney(sale.paid_amount)}${Number(sale.remaining_debt || 0) > 0 ? `\n⏳ *Reste dû :* ${fmtMoney(sale.remaining_debt)}` : ''}\n\nConservez ce message et votre facture pour le suivi de garantie SAV.\n${store} • ${state.settings.store_phone || ''}`;
}

function buildQuoteWhatsAppMessage(quote) {
  const store = state.settings.store_name || 'ELECTROZEN';
  const itemsLines = (quote.items || []).map((i) => `• ${i.quantity}x ${i.product_name} — ${fmtMoney(Number(i.unit_price) * Number(i.quantity))}`).join('\n');
  return `Bonjour ${quote.customer_name || 'Client'},\nVoici votre *Devis Proforma* chez *${store}* :\n\n📋 *Réf :* ${quote.quote_number}\n📅 *Valable jusqu'au :* ${quote.valid_until}\n${itemsLines}\n\n💰 *Total TTC :* ${fmtMoney(quote.total_amount)}\n\nN'hésitez pas à nous confirmer votre commande.\n${store} • ${state.settings.store_phone || ''}`;
}

function buildSavWhatsAppMessage(job) {
  const store = state.settings.store_name || 'ELECTROZEN';
  const msgStatus =
    job.status === 'ready'
      ? `✅ Bonne nouvelle ! Votre appareil *${job.device_name}* est *PRÊT à récupérer* au magasin.`
      : job.status === 'delivered'
        ? `🙏 Merci ! Votre dossier SAV *${job.ticket_number}* (*${job.device_name}*) est clôturé et livré.`
        : job.status === 'in_progress'
          ? `🔧 Votre appareil *${job.device_name}* (Ticket *${job.ticket_number}*) est actuellement *en cours de diagnostic / réparation*.`
          : `🛠️ Votre ticket SAV *${job.ticket_number}* pour *${job.device_name}* a bien été enregistré.`;
  return `Bonjour ${job.customer_name},\n${msgStatus}\n${Number(job.total_price || 0) > 0 ? `\n💰 Total intervention : ${fmtMoney(job.total_price)} (Avance payée : ${fmtMoney(job.paid_amount)})` : job.under_warranty ? '\n🛡️ Intervention couverte sous garantie.' : ''}\n\n*${store}* • ${state.settings.store_phone || ''}`;
}

function printBankCheckNow() {
  const styleId = 'ez-check-page-style';
  let st = document.getElementById(styleId);
  if (!st) {
    st = document.createElement('style');
    st.id = styleId;
    document.head.appendChild(st);
  }
  st.textContent = '@media print { @page { size: 175mm 80mm landscape; margin: 0; } }';
  document.body.classList.add('printing-bank-check');
  const cleanup = () => {
    document.body.classList.remove('printing-bank-check');
    if (st) st.textContent = '';
  };
  window.addEventListener('afterprint', cleanup, { once: true });
  setTimeout(() => {
    window.print();
    setTimeout(cleanup, 1200);
  }, 60);
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
  const [dash, prods, sups, purs, custs, sales, exps, net, sets, users, cashSess, backups, auditLogs, quotes, svcJobs, stockAdjs, stockTrans, checksRes, wooOrds, pnlRep] = await Promise.all([
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
    fetch('/api/stock-transfers').then((r) => r.json()).catch(() => []),
    fetch('/api/checks').then((r) => r.json()).catch(() => ({ checks: [], stats: {} })),
    fetch('/api/woocommerce/orders').then((r) => r.json()).catch(() => []),
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
  state.stockTransfers = Array.isArray(stockTrans) ? stockTrans : [];
  state.bankChecks = Array.isArray(checksRes?.checks) ? checksRes.checks : [];
  state.checksStats = checksRes?.stats || { totalIssuedPending: 0, totalReceivedPending: 0, overdueCount: 0, dueSoonCount: 0 };
  state.wooOrders = Array.isArray(wooOrds) ? wooOrds : [];
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
    if (state.productsFilterMode === 'low_stock' && Number(p.stock_quantity || 0) > Number(p.min_stock_alert || 0)) return false;
    if (state.productsFilterMode === 'no_photo' && getProductImages(p).length > 0) return false;
    if (state.productsFilterMode === 'woo_pending' && p.woo_sync_status === 'synced') return false;
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

function getProductImages(p) {
  if (!p) return [];
  const out = [];
  if (Array.isArray(p.images)) {
    p.images.forEach((u) => {
      const s = String(u || '').trim();
      if (s && !out.includes(s)) out.push(s);
    });
  } else if (typeof p.images_json === 'string' && p.images_json.trim()) {
    try {
      const parsed = JSON.parse(p.images_json);
      if (Array.isArray(parsed)) {
        parsed.forEach((u) => {
          const s = String(u || '').trim();
          if (s && !out.includes(s)) out.push(s);
        });
      }
    } catch {}
  }
  const prim = String(p.image_url || '').trim();
  if (prim && !out.includes(prim)) out.unshift(prim);
  return out;
}

function openProductModalWith(ep = null, expanded = false) {
  state.editingProduct = ep && ep.id ? ep : null;
  state.prefillProduct = ep && !ep.id ? ep : null;
  state.productModalExpanded = Boolean(expanded || (ep && ep.id));
  state.productBoxImages = [];
  state.productGalleryImages = getProductImages(ep);
  state.webImageSearchOpen = false;
  state.webImageSearchResults = [];
  state.webImageSearchQuery = [ep?.brand, ep?.model_number, ep?.name_fr].filter(Boolean).join(' ').trim();
  state.productModalOpen = true;
}

function renderCatalogRows(filteredProducts) {
  const isAdmin = (state.currentUser?.role || 'admin') !== 'caissier';
  return filteredProducts
    .map((p) => {
      const imgs = getProductImages(p);
      return `
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
          <div class="btn-open-pictures" data-id="${p.id}" style="position:relative;cursor:pointer" title="Gérer les photos (${imgs.length})">
            ${
              imgs[0]
                ? `<img src="${imgs[0]}" class="prod-thumb" alt="" loading="lazy" />`
                : `<div class="prod-thumb" style="display:flex;align-items:center;justify-content:center;font-weight:700;font-size:10px;color:#64748b">${(p.brand || 'EZ').slice(0, 3)}</div>`
            }
            <span style="position:absolute;bottom:-4px;right:-4px;background:${imgs.length > 0 ? '#4f46e5' : '#94a3b8'};color:#fff;font-size:9px;font-weight:800;padding:0 4px;border-radius:999px;border:1px solid #fff">${imgs.length}</span>
          </div>
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
        ${Number(p.warehouse_quantity || 0) > 0 ? `<div style="font-size:10px;color:var(--ink-400);margin-top:2px" class="mono">Mag: ${Math.max(0, Number(p.stock_quantity || 0) - Number(p.warehouse_quantity || 0))} • Dép: ${p.warehouse_quantity}</div>` : ''}
      </td>
      <td>
        <span class="tag ${p.woo_sync_status === 'synced' ? 'tag-ok' : 'tag-warn'}" title="${p.woo_last_error || ''}">
          ${p.woo_sync_status === 'synced' ? 'Synchronisé' : 'En file'}
        </span>
        ${p.woo_last_error ? `<div style="font-size:9.5px;color:#b91c1c;max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${p.woo_last_error}">${p.woo_last_error}</div>` : ''}
      </td>
      <td style="text-align:end">
        <div class="action-group">
          <button class="btn btn-sm btn-open-pictures" data-id="${p.id}" title="Gérer, ajouter, supprimer ou ordonner les photos">${ICONS.image}<span>${imgs.length}</span></button>
          <button class="btn btn-sm btn-icon btn-print-barcode" data-id="${p.id}" title="Imprimer étiquette code-barres">${ICONS.barcode}</button>
          ${isAdmin ? `<button class="btn btn-sm btn-icon btn-inspect-code" data-barcode="${p.barcode}" title="Historique & S/N">${ICONS.history}</button>` : ''}
          ${isAdmin ? `<button class="btn btn-sm btn-icon btn-edit-prod" data-id="${p.id}" title="Modifier l'article">${ICONS.edit}</button>` : ''}
          ${isAdmin ? `<button class="btn btn-sm btn-icon btn-delete-prod" data-id="${p.id}" title="Supprimer l'article" style="color:#e21b1b">${ICONS.trash}</button>` : ''}
        </div>
      </td>
    </tr>
  `;
    })
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

  const customersWithDebtCount = state.customers.filter((c) => Number(c.total_debt || 0) > 0).length;
  const openSavQuotes = (state.dashboard?.openQuotationsCount || 0) + (state.dashboard?.serviceStats?.openJobs || 0);
  const navGroups = [
    {
      label: 'Comptoir & Ventes',
      items: [
        { id: 'pos', label: t.pos, icon: ICONS.pos, count: state.posCart.length || '', kbd: 'F1' },
        { id: 'sales', label: t.sales, icon: ICONS.history, count: state.sales.length || '' },
        { id: 'quotations', label: t.quotations, icon: ICONS.quotations, count: openSavQuotes || '' },
        { id: 'customers', label: t.customers, icon: ICONS.customers, count: customersWithDebtCount || state.customers.length || '' },
      ],
    },
    {
      label: 'Stocks & Approvisionnement',
      items: [
        { id: 'products', label: t.products, icon: ICONS.products, count: state.products.length },
        { id: 'purchases', label: t.purchases, icon: ICONS.purchases, count: state.purchases.length || '' },
      ],
    },
    {
      label: 'Pilotage & Finances',
      items: [
        { id: 'dashboard', label: t.dashboard, icon: ICONS.dashboard, count: '' },
        { id: 'expenses', label: t.expenses, icon: ICONS.check, count: ((state.checksStats?.overdueCount || 0) + (state.checksStats?.dueSoonCount || 0)) || '' },
        { id: 'reports', label: t.reports, icon: ICONS.reports, count: '' },
      ],
    },
    {
      label: 'Boutique Web & Système',
      items: [
        { id: 'connect', label: t.connect, icon: ICONS.connect, count: ((state.dashboard?.pendingWooSync || 0) + (state.dashboard?.pendingWooOrders || 0)) || '' },
      ],
    },
  ];
  const cashOpen = state.cashSession?.openSession;

  const isElectron = Boolean(window.electronAPI?.isElectron);

  const appEl = document.getElementById('app');
  appEl.innerHTML = `
    <div class="app-shell">
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ''}

      <!-- STRUCTURED BUSINESS GROUPED SIDEBAR -->
      <aside class="sidebar">
        <div style="display:flex;flex-direction:column;min-height:0;flex:1">
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

          <button class="scan-trigger" id="btn-open-scanner" style="width:calc(100% - 28px);flex-shrink:0">
            <span style="display:flex;align-items:center;gap:8px">
              <span style="width:14px;height:14px;display:inline-flex">${ICONS.barcode}</span>
              <span>${t.quickScanBtn}</span>
            </span>
            <span class="kbd">F2</span>
          </button>

          <div class="nav-scroll-region">
            ${navGroups
              .map(
                (grp) => `
              <div class="nav-section-label">${grp.label}</div>
              <nav class="nav-list">
                ${grp.items
                  .map(
                    (item) => `
                  <button class="nav-btn ${state.activeTab === item.id ? 'active' : ''}" data-tab="${item.id}">
                    <span class="nav-btn-left">
                      ${item.icon}
                      <span>${item.label}</span>
                    </span>
                    <span style="display:flex;align-items:center;gap:4px">
                      ${item.kbd ? `<span class="nav-shortcut">${item.kbd}</span>` : ''}
                      ${item.count ? `<span class="nav-count">${item.count}</span>` : ''}
                    </span>
                  </button>
                `
                  )
                  .join('')}
              </nav>
            `
              )
              .join('')}
          </div>
        </div>

        <div style="padding:12px;border-top:1px solid var(--sidebar-border);display:flex;flex-direction:column;gap:8px;flex-shrink:0">
          <div style="padding:8px 10px;background:var(--primary-4);border:1px solid var(--primary-3);border-radius:9px">
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:10.5px;color:var(--primary-2);font-weight:600">
              <span>Serveur Wi-Fi Android</span>
              <span style="color:var(--primary-green);font-weight:800;font-size:10px">ACTIF</span>
            </div>
            <div class="mono" style="font-size:11px;color:var(--primary);font-weight:700;margin-top:2px">
              ${state.networkInfo?.primaryIp || '127.0.0.1'}:${state.networkInfo?.port || 4000}
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;background:var(--primary-4);padding:3px;border-radius:8px;border:1px solid var(--primary-3)">
            ${['fr', 'ar', 'en']
              .map(
                (l) => `
              <button data-lang="${l}" style="border:none;border-radius:6px;padding:4px 0;font-size:11px;font-weight:700;cursor:pointer;background:${state.lang === l ? 'var(--primary)' : 'transparent'};color:${state.lang === l ? '#ffffff' : 'var(--primary-2)'}">
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
            <button type="button" class="btn btn-sm" id="btn-cash-topbar" style="margin-inline-start:8px;border-radius:999px;font-size:11px;padding:3px 10px;border-color:${cashOpen ? 'rgba(57,174,82,0.4)' : 'rgba(217,119,6,0.4)'};background:${cashOpen ? 'rgba(57,174,82,0.1)' : 'rgba(217,119,6,0.1)'};color:${cashOpen ? '#15803d' : '#b45309'}" title="Cliquer pour ouvrir / clôturer la caisse">
              ${cashOpen ? `Caisse Ouverte (${fmtMoney(cashOpen.expected_cash)})` : 'Caisse Fermée • Ouvrir'}
            </button>
          </div>
          <div class="topbar-actions">
            <button class="btn" id="btn-open-scanner-top" title="Vérificateur de Prix & Stock (F2)">
              ${ICONS.barcode}
              <span>Prix (F2)</span>
            </button>
            <button class="btn btn-dark" id="btn-new-product">
              ${ICONS.plus}
              <span>${t.addProductBtn}</span>
            </button>
            <button class="btn" id="btn-sync-woo">
              ${ICONS.sync}
              <span>${t.syncWooBtn}${state.dashboard?.pendingWooSync ? ` (${state.dashboard.pendingWooSync})` : ''}</span>
            </button>
            <button class="btn" id="btn-open-pin" title="Changer d'opérateur (Admin / Caissier)">
              <span class="tag ${state.currentUser?.role === 'admin' ? 'tag-ok' : 'tag-warn'}" style="padding:1px 6px">${(state.currentUser?.role || 'admin').toUpperCase()}</span>
              <span>${state.currentUser?.full_name || 'Admin'}</span>
            </button>
            <button class="btn" id="btn-toggle-theme" title="Basculer Clair / Sombre">
              <span>${state.theme === 'dark' ? 'Clair' : 'Sombre'}</span>
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
    ${renderProductPicturesModal()}
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
          <button class="btn" id="btn-dash-open-check">${ICONS.check}<span>Imprimer Chèque CAM${(state.checksStats?.overdueCount || 0) + (state.checksStats?.dueSoonCount || 0) > 0 ? ` (${(state.checksStats?.overdueCount || 0) + (state.checksStats?.dueSoonCount || 0)})` : ''}</span></button>
          ${Number(d.pendingWooOrders || 0) > 0 ? `<button class="btn btn-pos" id="btn-dash-woo-orders">${ICONS.sync}<span>Commandes Web (${d.pendingWooOrders})</span></button>` : ''}
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

  // 2B. HISTORIQUE DES VENTES (SALES HISTORY)
  if (state.activeTab === 'sales') {
    const q = (state.salesSearch || '').toLowerCase().trim();
    const filteredSales = state.sales.filter((s) => {
      if (state.salesStatusFilter === 'completed' && s.status === 'canceled') return false;
      if (state.salesStatusFilter === 'canceled' && s.status !== 'canceled') return false;
      if (state.salesPayFilter !== 'all' && s.payment_method !== state.salesPayFilter) return false;
      if (!q) return true;
      const itemsText = (s.items || []).map((i) => `${i.product_name || ''} ${i.serial_number || ''} ${i.barcode || ''}`).join(' ').toLowerCase();
      return (
        String(s.invoice_number || '').toLowerCase().includes(q) ||
        String(s.customer_name || '').toLowerCase().includes(q) ||
        String(s.source_device || '').toLowerCase().includes(q) ||
        itemsText.includes(q)
      );
    });
    const activeSales = filteredSales.filter((s) => s.status !== 'canceled');
    const sumTotal = activeSales.reduce((a, b) => a + Number(b.total_amount || 0), 0);
    const sumPaid = activeSales.reduce((a, b) => a + Number(b.paid_amount || 0), 0);
    const sumDebt = activeSales.reduce((a, b) => a + Number(b.remaining_debt || 0), 0);

    return `
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-label">Tickets Affichés</div>
            <div class="kpi-val">${filteredSales.length}</div>
            <div class="kpi-sub">${activeSales.length} validée(s)</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Chiffre d'Affaires TTC</div>
            <div class="kpi-val num" style="color:#1c61e7">${fmtMoney(sumTotal)}</div>
            <div class="kpi-sub">Hors factures annulées</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Montant Encaissé</div>
            <div class="kpi-val num" style="color:#267d39">${fmtMoney(sumPaid)}</div>
            <div class="kpi-sub">Espèces / Carte / Acomptes</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Créances Clients</div>
            <div class="kpi-val num" style="color:#d97706">${fmtMoney(sumDebt)}</div>
            <div class="kpi-sub">Reste à recouvrer</div>
          </div>
        </div>

        <div class="panel">
          <div class="panel-header" style="flex-wrap:wrap;gap:10px">
            <span class="panel-title">Historique Complet des Ventes & Garanties (${filteredSales.length})</span>
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
              <input id="input-sales-search" class="input" style="width:260px" placeholder="N° Facture, Client, Produit, S/N..." value="${state.salesSearch}" />
              <select id="select-sales-status" class="input" style="width:145px">
                <option value="all" ${state.salesStatusFilter === 'all' ? 'selected' : ''}>Tous Statuts</option>
                <option value="completed" ${state.salesStatusFilter === 'completed' ? 'selected' : ''}>Validées</option>
                <option value="canceled" ${state.salesStatusFilter === 'canceled' ? 'selected' : ''}>Annulées (Avoir)</option>
              </select>
              <select id="select-sales-pay" class="input" style="width:140px">
                <option value="all" ${state.salesPayFilter === 'all' ? 'selected' : ''}>Tous Modes</option>
                <option value="cash" ${state.salesPayFilter === 'cash' ? 'selected' : ''}>Espèces</option>
                <option value="card" ${state.salesPayFilter === 'card' ? 'selected' : ''}>Carte / Virement</option>
                <option value="credit" ${state.salesPayFilter === 'credit' ? 'selected' : ''}>Crédit / Facilité</option>
              </select>
            </div>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>N° Facture</th>
                  <th>Date & Heure</th>
                  <th>Client</th>
                  <th>Articles & N° Série</th>
                  <th>Mode</th>
                  <th style="text-align:end">Total TTC</th>
                  <th style="text-align:end">Payé</th>
                  <th style="text-align:end">Reste Dû</th>
                  <th>Terminal</th>
                  <th style="text-align:end">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${
                  filteredSales.length === 0
                    ? `<tr><td colspan="10" style="text-align:center;padding:28px;color:#71717a">Aucune vente correspondante trouvée.</td></tr>`
                    : filteredSales
                        .map((s) => {
                          const payLabel = s.payment_method === 'credit' ? 'Crédit' : s.payment_method === 'card' ? 'Carte' : 'Espèces';
                          const itemsList = (s.items || [])
                            .map((i) => `<div style="font-size:11px;line-height:1.35">• <strong>${i.quantity}x</strong> ${i.product_name}${i.serial_number ? ` <span class="mono" style="color:#6d28d9">(S/N: ${i.serial_number})</span>` : ''}</div>`)
                            .join('');
                          return `
                            <tr>
                              <td class="mono" style="font-weight:700">
                                <div>${s.invoice_number}</div>
                                ${s.status === 'canceled' ? `<span class="tag tag-danger" style="font-size:9.5px">ANNULÉE • ${s.credit_note_number || 'AVOIR'}</span>` : ''}
                              </td>
                              <td class="mono" style="font-size:11.5px;color:#52525b">${(s.created_at || '').slice(0, 16)}</td>
                              <td style="font-weight:600">${s.customer_name || 'Client Comptoir'}</td>
                              <td style="max-width:260px">${itemsList || '—'}</td>
                              <td><span class="tag">${payLabel} • ${s.price_tier === 'wholesale' ? 'Gros' : 'Détail'}</span></td>
                              <td class="num" style="text-align:end;font-weight:700">${fmtMoney(s.total_amount)}</td>
                              <td class="num" style="text-align:end;color:#267d39;font-weight:600">${fmtMoney(s.paid_amount)}</td>
                              <td class="num" style="text-align:end">
                                ${s.remaining_debt > 0 && s.status !== 'canceled' ? `<span class="tag tag-warn num">${fmtMoney(s.remaining_debt)}</span>` : '<span style="color:#a1a1aa">—</span>'}
                              </td>
                              <td style="font-size:11px;color:#71717a">${s.source_device || 'windows_pos'}</td>
                              <td style="text-align:end">
                                <div class="action-group">
                                  <button class="btn btn-sm btn-print-sale" data-sale-id="${s.id}">${ICONS.print}<span>Facture / Garantie</span></button>
                                  <button class="btn btn-sm btn-whatsapp-sale" data-sale-id="${s.id}" style="background:rgba(16,185,129,0.12);border-color:rgba(16,185,129,0.35);color:#047857" title="Envoyer reçu & garantie par WhatsApp">${ICONS.whatsapp}<span>WA</span></button>
                                  ${isAdmin && s.status !== 'canceled' ? `<button class="btn btn-sm btn-icon btn-cancel-sale" data-sale-id="${s.id}" title="Émettre un Avoir (AV) et réintégrer le stock" style="color:#e21b1b">${ICONS.trash}</button>` : ''}
                                </div>
                              </td>
                            </tr>
                          `;
                        })
                        .join('')
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // 3. PRODUCTS, PHOTOS STUDIO & STOCK MANAGEMENT
  if (state.activeTab === 'products') {
    const lowStockCnt = state.products.filter((x) => Number(x.stock_quantity || 0) <= Number(x.min_stock_alert || 0)).length;
    const noPhotoCnt = state.products.filter((x) => getProductImages(x).length === 0).length;
    const wooPendingCnt = state.products.filter((x) => x.woo_sync_status !== 'synced').length;

    return `
      <div style="display:flex;flex-direction:column;gap:14px">
        <!-- Sub-tabs & Quick Actions Bar -->
        <div class="subtab-bar" style="justify-content:space-between">
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <button type="button" class="subtab-btn ${state.productsSubTab === 'list' ? 'active' : ''}" data-psub="list">
              ${ICONS.products}<span>Catalogue & Tarifs (${state.products.length})</span>
            </button>
            <button type="button" class="subtab-btn ${state.productsSubTab === 'gallery' ? 'active' : ''}" data-psub="gallery">
              ${ICONS.image}<span>Studio & Galerie Photos</span>
            </button>
            <button type="button" class="subtab-btn ${state.productsSubTab === 'adjustments' ? 'active' : ''}" data-psub="adjustments">
              ${ICONS.edit}<span>Ajustements Stock & Casse (${state.stockAdjustments.length})</span>
            </button>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <button type="button" class="btn btn-sm" id="btn-export-csv" title="Exporter vers Excel CSV">${ICONS.download}<span>Exporter CSV</span></button>
            <label class="btn btn-sm" style="cursor:pointer;margin:0">
              ${ICONS.plus}<span>Importer CSV</span>
              <input type="file" id="input-import-csv" accept=".csv,.txt" style="display:none" />
            </label>
            <button type="button" class="btn btn-sm btn-dark" id="btn-scan-add-product">${ICONS.barcode}<span>Scanner & Ajouter</span></button>
          </div>
        </div>

        ${
          state.productsSubTab !== 'adjustments'
            ? `<div class="panel">
                <div class="panel-body" style="padding:12px 16px;display:flex;flex-direction:column;gap:10px">
                  <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
                    <input class="input" id="input-prod-search" placeholder="Filtrer par code-barres, modèle, marque ou désignation..." value="${state.productSearch}" style="flex:1;min-width:240px" />
                    <select class="input" id="select-prod-cat" style="width:230px">
                      ${categories
                        .map(
                          (c) => `<option value="${c}" ${state.selectedCategory === c ? 'selected' : ''}>${c === 'ALL' ? 'Toutes les familles' : c}</option>`
                        )
                        .join('')}
                    </select>
                  </div>
                  <div class="segmented" style="align-self:flex-start;flex-wrap:wrap">
                    <button type="button" class="seg-btn ${state.productsFilterMode === 'all' ? 'active' : ''}" data-prod-filter="all">Tous (${state.products.length})</button>
                    <button type="button" class="seg-btn ${state.productsFilterMode === 'low_stock' ? 'active' : ''}" data-prod-filter="low_stock">Stock Critique (${lowStockCnt})</button>
                    <button type="button" class="seg-btn ${state.productsFilterMode === 'no_photo' ? 'active' : ''}" data-prod-filter="no_photo">Sans Photo (${noPhotoCnt})</button>
                    <button type="button" class="seg-btn ${state.productsFilterMode === 'woo_pending' ? 'active' : ''}" data-prod-filter="woo_pending">À Sync Woo (${wooPendingCnt})</button>
                  </div>
                </div>
              </div>`
            : ''
        }

        ${
          state.productsSubTab === 'adjustments'
            ? `<div style="display:flex;flex-direction:column;gap:14px">
                <div class="grid-2" style="align-items:start">
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
                    <div class="panel-header"><span class="panel-title">${ICONS.transfer} Transfert Multi-Dépôt (Magasin ⇄ Dépôt Réserve)</span></div>
                    <form id="form-stock-transfer" class="panel-body" style="display:flex;flex-direction:column;gap:10px">
                      <div>
                        <label class="field-label">Produit *</label>
                        <select name="product_id" required class="input" style="text-overflow:ellipsis">
                          ${state.products.map((p) => { const n = getProdName(p); const dep = Number(p.warehouse_quantity || 0); const shop = Math.max(0, Number(p.stock_quantity || 0) - dep); return `<option value="${p.id}">${p.brand} — ${n.length > 42 ? n.slice(0, 42) + '…' : n} (Mag: ${shop} / Dép: ${dep})</option>`; }).join('')}
                        </select>
                      </div>
                      <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:8px">
                        <div>
                          <label class="field-label">Sens du Transfert</label>
                          <select name="direction" class="input">
                            <option value="shop_to_depot">Magasin Showroom → Dépôt Réserve</option>
                            <option value="depot_to_shop">Dépôt Réserve → Magasin Showroom</option>
                          </select>
                        </div>
                        <div><label class="field-label">Quantité *</label><input name="quantity" type="number" min="1" required value="1" class="input mono" /></div>
                      </div>
                      <div><label class="field-label">Note / Bon de Transfert</label><input name="notes" class="input" placeholder="Ex: Réapprovisionnement vitrine showroom..." /></div>
                      <button type="submit" class="btn btn-pos" style="justify-content:center">Enregistrer Transfert (TRF)</button>
                    </form>
                  </div>
                </div>

                <div class="grid-2" style="align-items:start">
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

                  <div class="panel">
                    <div class="panel-header"><span class="panel-title">Historique Transferts Multi-Dépôt (${state.stockTransfers.length})</span></div>
                    <div class="table-wrap">
                      <table>
                        <thead><tr><th>N° TRF</th><th>Article</th><th>Direction</th><th>Qté</th></tr></thead>
                        <tbody>
                          ${state.stockTransfers
                            .map(
                              (tr) => `<tr>
                                <td class="mono" style="font-size:11.5px;font-weight:700">${tr.transfer_number}<div style="font-size:10px;color:var(--ink-400)">${String(tr.created_at || '').slice(0, 10)}</div></td>
                                <td style="font-size:12px;font-weight:600">${tr.product_name}<div style="font-size:10.5px;color:var(--ink-400)">${tr.notes || ''}</div></td>
                                <td><span class="tag ${tr.direction === 'depot_to_shop' ? 'tag-ok' : ''}">${tr.direction === 'depot_to_shop' ? 'Dépôt → Magasin' : 'Magasin → Dépôt'}</span></td>
                                <td class="mono" style="font-weight:700">${tr.quantity} u.</td>
                              </tr>`
                            )
                            .join('') || '<tr><td colspan="4" style="color:var(--ink-400);text-align:center;padding:24px">Aucun transfert entre Showroom et Dépôt enregistré.</td></tr>'}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>`
            : state.productsSubTab === 'gallery'
              ? `<div class="gallery-card-grid">
                  ${
                    filteredProducts.length === 0
                      ? `<div class="panel" style="grid-column:1 / -1;padding:32px;text-align:center;color:var(--ink-400)">Aucun article dans ce filtre.</div>`
                      : filteredProducts
                          .slice(0, 80)
                          .map((p) => {
                            const imgs = getProductImages(p);
                            return `
                              <div class="panel" style="padding:12px;display:flex;flex-direction:column;justify-content:space-between;gap:10px">
                                <div>
                                  <div class="btn-open-pictures" data-id="${p.id}" style="position:relative;height:145px;background:#fff;border:1px solid var(--border);border-radius:10px;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:8px">
                                    ${
                                      imgs[0]
                                        ? `<img src="${imgs[0]}" style="max-width:100%;max-height:128px;object-fit:contain" loading="lazy" />`
                                        : `<div style="color:var(--ink-400);font-size:11px;text-align:center">Aucune photo</div>`
                                    }
                                    <span style="position:absolute;top:6px;left:6px;background:${imgs.length > 0 ? '#4f46e5' : '#e21b1b'};color:#fff;font-size:9.5px;font-weight:800;padding:2px 7px;border-radius:999px">${imgs.length} photo${imgs.length > 1 ? 's' : ''}</span>
                                  </div>
                                  <div style="margin-top:8px;font-weight:700;font-size:12.5px;color:var(--ink-900);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${getProdName(p)}</div>
                                  <div class="mono" style="font-size:10.5px;color:var(--ink-400);margin-top:2px">${p.brand} • ${p.model_number || p.sku}</div>
                                </div>
                                <div style="display:flex;gap:6px">
                                  <button type="button" class="btn btn-sm btn-dark btn-open-pictures" data-id="${p.id}" style="flex:1;justify-content:center">${ICONS.image}<span>Gérer</span></button>
                                  <button type="button" class="btn btn-sm btn-open-pictures" data-id="${p.id}" data-web="1" title="Photo Web Officielle">${ICONS.search}<span>Web</span></button>
                                </div>
                              </div>
                            `;
                          })
                          .join('')
                  }
                </div>`
              : `<div class="panel">
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
                </div>`
        }
      </div>
    `;
  }

  // 4. PURCHASES & SUPPLIERS
  if (state.activeTab === 'purchases') {
    const purTotal = state.purchaseItems.reduce((s, i) => s + i.quantity * i.unit_cost, 0);
    return `
      <div style="display:flex;flex-direction:column;gap:16px">
        <!-- AI PROVIDER INVOICE SCANNER -->
        <div class="panel" style="border-color:#c4b5fd;background:linear-gradient(135deg,#faf5ff 0%,#ffffff 100%)">
          <div class="panel-header">
            <span class="panel-title" style="color:#5b21b6">Scanner une Facture Fournisseur (Extraction IA Automatique)</span>
            <span class="tag" style="background:#ede9fe;color:#5b21b6;border-color:#c4b5fd">Fournisseur • Produits • Prix • Qtés</span>
          </div>
          <div class="panel-body" style="display:flex;flex-direction:column;gap:10px">
            <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
              <label class="btn btn-dark" style="cursor:pointer;display:inline-flex;align-items:center;gap:6px">
                <input type="file" id="input-scan-invoice-file" accept="image/*" style="display:none" />
                <span>${state.invoiceScanLoading ? 'Analyse IA en cours...' : 'Importer Photo / Scan Facture'}</span>
              </label>
              <span style="font-size:12px;color:#52525b">ou collez le texte brut de la facture ci-dessous (compatible DeepSeek / Gemini / OpenAI) :</span>
            </div>
            <div style="display:flex;gap:8px;align-items:flex-start">
              <textarea id="textarea-scan-invoice-text" class="input" rows="2" style="flex:1;font-size:12px" placeholder="Ex: Facture N° BL-882 Fournisseur ElectroMaroc: 5x TV Samsung 55Q60C à 4800 MAD, 3x Climatiseur Siera 12000 BTU à 2600 MAD...">${state.invoiceScanText || ''}</textarea>
              <button type="button" class="btn btn-primary" id="btn-scan-invoice-text" ${state.invoiceScanLoading ? 'disabled' : ''}>Extraire Texte (IA)</button>
            </div>
            ${state.invoiceScanMessage ? `<div style="font-size:12px;font-weight:600;color:#5b21b6;padding:6px 10px;background:#f3e8ff;border-radius:6px">${state.invoiceScanMessage}</div>` : ''}
          </div>
        </div>

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
                    ${state.purchaseNewProviderName ? `<option value="0" selected>+ Nouveau : ${state.purchaseNewProviderName}</option>` : ''}
                    ${state.suppliers.map((s) => `<option value="${s.id}" ${!state.purchaseNewProviderName && Number(state.purchaseSupplierId) === Number(s.id) ? 'selected' : ''}>${s.company} (${s.name})</option>`).join('')}
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
                          const prevCost = prod ? Number(prod.current_cost_price || 0) : Number(item.previous_cost_price || 0);
                          const uCost = Number(item.unit_cost || 0);
                          const retailVal = Number(item.new_retail_price || 0);
                          const costUp = prevCost > 0 && uCost > prevCost;
                          const deltaPct = costUp ? Math.round(((uCost - prevCost) / prevCost) * 100) : 0;
                          const marginPct = retailVal > 0 ? Math.round(((retailVal - uCost) / retailVal) * 100) : 0;
                          const lowMargin = uCost > 0 && retailVal > 0 && marginPct < 12;
                          return `
                            <div style="padding:12px;border:1px solid ${costUp || lowMargin ? '#f59e0b' : '#e4e4e7'};border-radius:6px;background:${costUp || lowMargin ? '#fffbeb' : '#fafafa'}">
                              <div style="display:flex;justify-content:space-between;font-weight:600;color:#09090b;margin-bottom:8px;gap:8px;align-items:center;flex-wrap:wrap">
                                <span>
                                  ${prod ? getProdName(prod) : `${item.product_name || 'Nouvel Article'} <span class="tag" style="background:#dbeafe;color:#1e40af;font-size:10px">Nouveau Produit</span>`}
                                  <span style="color:#71717a;font-weight:400">${prod ? `(Coût précédent : ${fmtMoney(prod.current_cost_price)})` : '(Sera créé dans le catalogue)'}</span>
                                </span>
                                <div style="display:flex;align-items:center;gap:8px">
                                  <span class="tag ${lowMargin ? 'tag-danger' : 'tag-ok'} mono" style="font-size:10px">Marge: ${marginPct}%</span>
                                  <button type="button" class="btn-remove-pur-item" data-idx="${idx}" style="border:none;background:none;color:#b91c1c;cursor:pointer">Retirer</button>
                                </div>
                              </div>
                              ${
                                costUp || lowMargin
                                  ? `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;padding:6px 10px;margin-bottom:8px;border-radius:6px;background:rgba(245,158,11,0.14);color:#92400e;font-size:11.5px;font-weight:600">
                                      <span>${costUp ? `⚠️ Hausse coût fournisseur (+${deltaPct}% vs ${fmtMoney(prevCost)})` : `⚠️ Marge détail faible (${marginPct}%)`} — Pensez à ajuster vos tarifs de vente.</span>
                                      <button type="button" class="btn btn-sm btn-auto-margin-item" data-idx="${idx}" style="height:24px;font-size:11px;background:#fff;border-color:#d97706;color:#92400e">Ajuster (+25% Détail / +12% Gros)</button>
                                    </div>`
                                  : ''
                              }
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

  // 6. TREASURY, MOROCCAN BANK CHECKS STUDIO (CREDIT AGRICOLE) & EXPENSES
  if (state.activeTab === 'expenses') {
    const d = state.dashboard;
    const esub = state.expensesSubTab || 'checks';
    const cs = state.checksStats || {};
    const cf = state.checkForm || {};
    const preset = MOROCCO_BANK_PRESETS[cf.bank_code || 'cam'] || MOROCCO_BANK_PRESETS.cam;
    const amtNum = Number(cf.amount || 0);
    const wordsText = cf.lang === 'ar' ? numberToArabicWords(amtNum) : numberToFrenchWords(amtNum);
    const [wLine1, wLine2] = splitCheckWordsLines(wordsText, cf.lang === 'ar' ? 42 : 48);
    const ox = Number(cf.offsetX || 0);
    const oy = Number(cf.offsetY || 0);
    const displayAmt = amtNum > 0
      ? (cf.protect_marks ? `#${amtNum.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}#` : amtNum.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
      : '#0,00#';
    const formattedDate = cf.issue_date ? cf.issue_date.split('-').reverse().join(' / ') : '';
    const todayStr = new Date().toISOString().slice(0, 10);
    const plus7 = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

    return `
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="subtab-bar" style="justify-content:space-between">
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <button type="button" class="subtab-btn ${esub === 'checks' ? 'active' : ''}" data-esub="checks">
              ${ICONS.check}<span>Chèques, Effets & Impression Crédit Agricole (${state.bankChecks.length})</span>
            </button>
            <button type="button" class="subtab-btn ${esub === 'expenses' ? 'active' : ''}" data-esub="expenses">
              ${ICONS.expenses}<span>Charges & Dépenses d'Exploitation (${state.expenses.length})</span>
            </button>
          </div>
          <div style="display:flex;gap:8px;align-items:center">
            ${(cs.overdueCount || 0) > 0 ? `<span class="tag tag-danger">${cs.overdueCount} en retard</span>` : ''}
            ${(cs.dueSoonCount || 0) > 0 ? `<span class="tag tag-warn">${cs.dueSoonCount} échéance(s) &lt; 7j</span>` : ''}
          </div>
        </div>

        ${
          esub === 'checks'
            ? `<div style="display:flex;flex-direction:column;gap:14px">
                <div class="kpi-strip">
                  <div class="kpi-cell">
                    <div class="kpi-label">Chèques / Effets Émis en Cours</div>
                    <div class="kpi-val num" style="color:#d97706">${fmtMoney(cs.totalIssuedPending || 0)}</div>
                    <div class="kpi-sub">À provisionner sur compte bancaire</div>
                  </div>
                  <div class="kpi-cell">
                    <div class="kpi-label">Chèques Clients à Encaisser</div>
                    <div class="kpi-val num" style="color:#267d39">${fmtMoney(cs.totalReceivedPending || 0)}</div>
                    <div class="kpi-sub">Portefeuille en attente</div>
                  </div>
                  <div class="kpi-cell">
                    <div class="kpi-label">Alertes Échéances (≤ 7 jours)</div>
                    <div class="kpi-val num" style="color:${(cs.overdueCount || 0) + (cs.dueSoonCount || 0) > 0 ? '#e21b1b' : '#267d39'}">${(cs.overdueCount || 0) + (cs.dueSoonCount || 0)}</div>
                    <div class="kpi-sub">${cs.overdueCount || 0} dépassée(s) • ${cs.dueSoonCount || 0} cette semaine</div>
                  </div>
                  <div class="kpi-cell">
                    <div class="kpi-label">Format Bank Al-Maghrib</div>
                    <div class="kpi-val" style="font-size:16px">175 × 80 mm</div>
                    <div class="kpi-sub">${preset.name}</div>
                  </div>
                </div>

                <!-- MOROCCAN BANK CHECK PRINTER STUDIO -->
                <div class="panel">
                  <div class="panel-header" style="flex-wrap:wrap;gap:8px">
                    <div>
                      <span class="panel-title">Studio d'Impression Chèque & Effet Maroc (${preset.name})</span>
                      <div style="font-size:11px;color:var(--ink-400)">Format officiel Bank Al-Maghrib 175 × 80 mm Paysage — Impression sans fond ni bande CMC7 (Style lbanka.com)</div>
                    </div>
                    <div style="display:flex;gap:8px;flex-wrap:wrap">
                      <button type="button" class="btn btn-sm" id="btn-reset-check-form">Nouveau Chèque</button>
                      <button type="button" class="btn btn-sm btn-dark" id="btn-print-check-only">${ICONS.print}<span>Imprimer sur Chèque</span></button>
                    </div>
                  </div>
                  <div class="panel-body" style="display:flex;flex-direction:column;gap:14px">
                    <div style="display:grid;grid-template-columns:1.2fr 0.9fr 0.9fr 1fr;gap:10px">
                      <div>
                        <label class="field-label">Banque Marocaine (Gabarit)</label>
                        <select id="chk-bank-code" class="input">
                          ${Object.values(MOROCCO_BANK_PRESETS)
                            .map((b) => `<option value="${b.code}" ${cf.bank_code === b.code ? 'selected' : ''}>${b.name}</option>`)
                            .join('')}
                        </select>
                      </div>
                      <div>
                        <label class="field-label">Instrument</label>
                        <select id="chk-inst-type" class="input">
                          <option value="check" ${cf.instrument_type === 'check' ? 'selected' : ''}>Chèque Bancaire</option>
                          <option value="effet" ${cf.instrument_type === 'effet' ? 'selected' : ''}>Effet / Traite (LCN)</option>
                        </select>
                      </div>
                      <div>
                        <label class="field-label">Sens Trésorerie</label>
                        <select id="chk-direction" class="input">
                          <option value="issued" ${cf.direction === 'issued' ? 'selected' : ''}>Émis (Fournisseur / Frais)</option>
                          <option value="received" ${cf.direction === 'received' ? 'selected' : ''}>Reçu (Client)</option>
                        </select>
                      </div>
                      <div>
                        <label class="field-label">N° Chèque / Effet</label>
                        <input id="chk-number" class="input mono" value="${cf.check_number || ''}" placeholder="ex: 4829104" />
                      </div>
                    </div>

                    <div style="display:grid;grid-template-columns:1.4fr 1fr 0.8fr 0.8fr 0.8fr;gap:10px">
                      <div>
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                          <label class="field-label" style="margin:0">${cf.direction === 'received' ? 'Émetteur (Client)' : "À l'ordre de (Bénéficiaire) *"}</label>
                          <select id="chk-quick-party" class="input" style="height:22px;width:145px;font-size:10.5px;padding:0 6px">
                            <option value="">Choisir tiers...</option>
                            ${state.suppliers.map((s) => `<option value="sup:${s.id}">${s.company || s.name}</option>`).join('')}
                            ${state.customers.map((c) => `<option value="cust:${c.id}">${c.name}</option>`).join('')}
                          </select>
                        </div>
                        <input id="chk-beneficiary" class="input" value="${cf.beneficiary_or_issuer || ''}" placeholder="Nom société ou personne..." />
                      </div>
                      <div>
                        <label class="field-label">Montant (MAD) *</label>
                        <input id="chk-amount" type="number" step="0.01" class="input mono" style="font-weight:800" value="${cf.amount || ''}" placeholder="0.00" />
                      </div>
                      <div>
                        <label class="field-label">Fait à (Ville)</label>
                        <input id="chk-city" class="input" value="${cf.issue_city || 'Casablanca'}" />
                      </div>
                      <div>
                        <label class="field-label">Date Création</label>
                        <input id="chk-issue-date" type="date" class="input mono" value="${cf.issue_date || todayStr}" />
                      </div>
                      <div>
                        <label class="field-label">Date Échéance</label>
                        <input id="chk-due-date" type="date" class="input mono" value="${cf.due_date || todayStr}" />
                      </div>
                    </div>

                    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;padding:8px 12px;background:var(--panel-subtle);border:1px solid var(--border);border-radius:8px">
                      <div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center;font-size:12px">
                        <label style="display:flex;align-items:center;gap:5px;cursor:pointer;font-weight:600">
                          <input type="checkbox" id="chk-crossed" ${cf.is_crossed ? 'checked' : ''} /> Chèque Barré (//)
                        </label>
                        <label style="display:flex;align-items:center;gap:5px;cursor:pointer;font-weight:600">
                          <input type="checkbox" id="chk-non-endorsable" ${cf.non_endorsable ? 'checked' : ''} /> Non Endossable
                        </label>
                        <label style="display:flex;align-items:center;gap:5px;cursor:pointer;font-weight:600">
                          <input type="checkbox" id="chk-protect" ${cf.protect_marks ? 'checked' : ''} /> Protection (#...#)
                        </label>
                        <select id="chk-lang" class="input" style="height:28px;width:115px;font-size:11px">
                          <option value="fr" ${cf.lang !== 'ar' ? 'selected' : ''}>Français (Lettres)</option>
                          <option value="ar" ${cf.lang === 'ar' ? 'selected' : ''}>العربية (حروف)</option>
                        </select>
                        ${
                          cf.supplier_id || cf.customer_id
                            ? `<label style="display:flex;align-items:center;gap:5px;cursor:pointer;font-weight:700;color:#267d39">
                                <input type="checkbox" id="chk-record-pay" ${cf.record_payment ? 'checked' : ''} /> Déduire du solde tiers
                              </label>`
                            : ''
                        }
                      </div>
                      <div style="display:flex;gap:8px;align-items:center;font-size:11px">
                        <span style="color:var(--ink-500);font-weight:700">Calibration (mm) :</span>
                        <label>X <input id="chk-off-x" type="number" step="0.5" min="-20" max="20" class="input mono" style="width:58px;height:26px" value="${ox}" /></label>
                        <label>Y <input id="chk-off-y" type="number" step="0.5" min="-20" max="20" class="input mono" style="width:58px;height:26px" value="${oy}" /></label>
                      </div>
                    </div>

                    <!-- LIVE 175 x 80 MM MOROCCAN BANK CHECK CANVAS -->
                    <div class="check-studio-wrap">
                      <div id="printable-check-sheet" class="check-studio-canvas ${preset.cssClass || ''}">
                        <div class="check-preview-chrome" style="position:absolute;top:4mm;left:32mm;display:flex;align-items:center;gap:8px;opacity:0.78">
                          <span style="font-size:11px;font-weight:800;color:${preset.accent};letter-spacing:0.04em">${preset.name.toUpperCase()}</span>
                          <span style="font-size:9px;padding:1px 6px;border-radius:4px;border:1px solid ${preset.accent};color:${preset.accent}">${preset.tag}</span>
                        </div>
                        <div class="check-preview-chrome" style="position:absolute;top:12.5mm;right:49mm;font-size:9.5px;color:#64748b">B.P. DH</div>
                        <div class="check-preview-chrome" style="position:absolute;top:23mm;left:5mm;font-size:8.5px;color:#64748b">Payer contre ce chèque</div>
                        <div class="check-preview-chrome" style="position:absolute;top:39mm;left:5mm;font-size:8.5px;color:#64748b">À l'ordre de</div>
                        <div class="check-preview-chrome" style="position:absolute;top:48.5mm;left:85mm;font-size:8.5px;color:#64748b">À</div>
                        <div class="check-preview-chrome" style="position:absolute;top:48.5mm;left:126mm;font-size:8.5px;color:#64748b">Le</div>

                        ${
                          cf.is_crossed
                            ? `<svg class="check-crossed-lines" style="top:${4 + oy}mm;left:${6 + ox}mm" viewBox="0 0 80 60">
                                <line x1="8" y1="54" x2="62" y2="6" stroke="#000" stroke-width="2.2" />
                                <line x1="20" y1="56" x2="74" y2="8" stroke="#000" stroke-width="2.2" />
                                ${cf.non_endorsable ? `<text x="16" y="42" transform="rotate(-38 35 35)" font-size="7.5" font-weight="800" fill="#000">NON ENDOSSABLE</text>` : ''}
                              </svg>`
                            : ''
                        }

                        <div class="check-field mono" style="top:${preset.amountTop + oy}mm;right:${preset.amountRight - ox}mm;font-size:13.5px;letter-spacing:0.5px">
                          ${displayAmt}
                        </div>

                        <div class="check-field" dir="${cf.lang === 'ar' ? 'rtl' : 'ltr'}" style="top:${preset.words1Top + oy}mm;left:${preset.wordsLeft + ox}mm;font-size:11.5px;max-width:138mm;overflow:hidden">
                          ${wLine1}
                        </div>

                        ${
                          wLine2
                            ? `<div class="check-field" dir="${cf.lang === 'ar' ? 'rtl' : 'ltr'}" style="top:${preset.words2Top + oy}mm;left:${12 + ox}mm;font-size:11.5px;max-width:152mm;overflow:hidden">
                                ${wLine2}
                              </div>`
                            : ''
                        }

                        <div class="check-field" style="top:${preset.payTop + oy}mm;left:${preset.payLeft + ox}mm;font-size:12.5px;text-transform:uppercase">
                          ${cf.beneficiary_or_issuer || '................................................'}
                        </div>

                        <div class="check-field" style="top:${preset.cityTop + oy}mm;left:${preset.cityLeft + ox}mm;font-size:11px">
                          ${cf.issue_city || 'Casablanca'}
                        </div>

                        <div class="check-field mono" style="top:${preset.dateTop + oy}mm;left:${preset.dateLeft + ox}mm;font-size:11px">
                          ${formattedDate}
                        </div>

                        <div class="check-preview-chrome check-cmc7-zone">
                          ZONE MAGNÉTIQUE CMC7 RÉSERVÉE — NE RIEN IMPRIMER ICI • ÉCHELLE 100% (175 × 80 MM)
                        </div>
                      </div>
                    </div>

                    <div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap">
                      <button type="button" class="btn btn-dark" id="btn-save-check">Enregistrer dans l'Échéancier</button>
                      <button type="button" class="btn btn-pos" id="btn-save-and-print-check">${ICONS.print}<span>Enregistrer & Imprimer Chèque CAM</span></button>
                    </div>
                  </div>
                </div>

                <!-- ÉCHÉANCIER TABLE -->
                <div class="panel">
                  <div class="panel-header">
                    <span class="panel-title">Échéancier des Chèques & Effets (${state.bankChecks.length})</span>
                    <span style="font-size:11.5px;color:var(--ink-400)">Suivez les dates d'encaissement / débit Crédit Agricole & évitez les rejets</span>
                  </div>
                  <div class="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Type & N°</th>
                          <th>Banque</th>
                          <th>Bénéficiaire / Émetteur</th>
                          <th>Créé le → Échéance</th>
                          <th style="text-align:end">Montant MAD</th>
                          <th>Statut</th>
                          <th style="text-align:end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${state.bankChecks
                          .map((ch) => {
                            const due = String(ch.due_date || '');
                            const isPending = ch.status === 'pending' || ch.status === 'deposited';
                            const isOverdue = isPending && due < todayStr;
                            const isSoon = isPending && !isOverdue && due <= plus7;
                            return `
                              <tr>
                                <td>
                                  <span class="tag ${ch.direction === 'issued' ? 'tag-warn' : 'tag-ok'}" style="font-size:10px">
                                    ${ch.direction === 'issued' ? 'ÉMIS' : 'REÇU'} • ${ch.instrument_type === 'effet' ? 'Effet' : 'Chèque'}
                                  </span>
                                  <div class="mono" style="font-weight:700;margin-top:2px;font-size:11.5px">N° ${ch.check_number || '—'}</div>
                                </td>
                                <td style="font-size:12px;font-weight:600">${ch.bank_name}</td>
                                <td>
                                  <div style="font-weight:700;color:var(--ink-900)">${ch.beneficiary_or_issuer}</div>
                                  <div style="font-size:10.5px;color:var(--ink-400)">${ch.is_crossed ? 'Barré' : 'Non barré'}${ch.non_endorsable ? ' • N.E' : ''} • ${ch.issue_city}</div>
                                </td>
                                <td class="mono" style="font-size:11.5px">
                                  <div>${ch.issue_date} → <strong>${due}</strong></div>
                                  ${isOverdue ? `<span class="tag tag-danger" style="font-size:9.5px;margin-top:2px">ÉCHÉANCE DÉPASSÉE</span>` : isSoon ? `<span class="tag tag-warn" style="font-size:9.5px;margin-top:2px">ÉCHÉANCE PROCHE</span>` : ''}
                                </td>
                                <td class="num" style="text-align:end;font-weight:800">${fmtMoney(ch.amount)}</td>
                                <td>
                                  <select class="input sel-check-status" data-id="${ch.id}" style="height:28px;font-size:11px;min-width:118px">
                                    <option value="pending" ${ch.status === 'pending' ? 'selected' : ''}>En attente</option>
                                    <option value="deposited" ${ch.status === 'deposited' ? 'selected' : ''}>Remis en banque</option>
                                    <option value="cashed" ${ch.status === 'cashed' ? 'selected' : ''}>Encaissé / Payé</option>
                                    <option value="rejected" ${ch.status === 'rejected' ? 'selected' : ''}>Rejeté / Impayé</option>
                                  </select>
                                </td>
                                <td style="text-align:end">
                                  <div class="action-group">
                                    <button type="button" class="btn btn-sm btn-load-check" data-id="${ch.id}" title="Charger dans le studio d'impression">${ICONS.print}<span>Imprimer</span></button>
                                    <button type="button" class="btn btn-sm btn-icon btn-del-check" data-id="${ch.id}" style="color:#e21b1b">${ICONS.trash}</button>
                                  </div>
                                </td>
                              </tr>
                            `;
                          })
                          .join('') || '<tr><td colspan="7" style="text-align:center;color:var(--ink-400);padding:24px">Aucun chèque ou effet enregistré. Saisissez un chèque ci-dessus pour l’imprimer ou suivre son échéance.</td></tr>'}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>`
            : `<div style="display:flex;flex-direction:column;gap:16px">
                ${
                  d
                    ? `<div class="kpi-strip">
                        <div class="kpi-cell"><div class="kpi-label">Recettes Encaissées</div><div class="kpi-val num">${fmtMoney(d.salesStats.totalCollected)}</div></div>
                        <div class="kpi-cell"><div class="kpi-label">Coût d'Achat Marchandises Vendues</div><div class="kpi-val num">${fmtMoney(d.salesStats.totalCogs)}</div></div>
                        <div class="kpi-cell"><div class="kpi-label">Total Charges & Dépenses</div><div class="kpi-val num" style="color:#b91c1c">-${fmtMoney(d.salesStats.totalExpenses)}</div></div>
                        <div class="kpi-cell"><div class="kpi-label">Bénéfice Net</div><div class="kpi-val num" style="color:#166534">${fmtMoney(d.salesStats.netProfit)}</div></div>
                      </div>`
                    : ''
                }

                <div class="split-pos">
                  <div class="panel">
                    <div class="panel-header"><span class="panel-title">Journal des Charges d'Exploitation (${state.expenses.length})</span></div>
                    <div class="table-wrap">
                      <table>
                        <thead><tr><th>Date</th><th>Libellé</th><th>Poste</th><th style="text-align:end">Montant</th><th style="text-align:end">Action</th></tr></thead>
                        <tbody>
                          ${state.expenses
                            .map(
                              (e) => `
                            <tr>
                              <td class="mono" style="font-size:11.5px;color:var(--ink-400)">${e.expense_date}</td>
                              <td style="font-weight:600;color:var(--ink-900)">${e.title}</td>
                              <td><span class="tag">${e.category}</span></td>
                              <td class="num" style="text-align:end;font-weight:600;color:#b91c1c">-${fmtMoney(e.amount)}</td>
                              <td style="text-align:end"><button class="btn btn-sm btn-icon btn-del-expense" data-id="${e.id}" title="Supprimer" style="color:#b91c1c">${ICONS.trash}</button></td>
                            </tr>`
                            )
                            .join('')}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div class="panel">
                    <div class="panel-header"><span class="panel-title">Saisir une Charge</span></div>
                    <form id="form-add-expense" class="panel-body" style="display:flex;flex-direction:column;gap:12px">
                      <div><label class="field-label">Libellé *</label><input name="title" required class="input" placeholder="ex: Facture Lydec, Loyer, Transport..." /></div>
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
                        <div><label class="field-label">Montant (MAD) *</label><input name="amount" type="number" required class="input mono" placeholder="0.00" /></div>
                      </div>
                      <button type="submit" class="btn btn-dark" style="justify-content:center">Enregistrer la Dépense</button>
                    </form>
                  </div>
                </div>
              </div>`
        }
      </div>
    `;
  }

  // 7. WOOCOMMERCE, ANDROID WI-FI PAIRING & STORE SETTINGS (4 SUB-TABS)
  if (state.activeTab === 'connect') {
    const qrSvg = renderPairingQrSvg(state.networkInfo?.qrPayload || 'ELECTROZEN-POS-2026');
    const csub = state.connectSubTab || 'woo';
    const pendingWooCnt = state.products.filter((x) => x.woo_sync_status !== 'synced').length;
    const pendingOrdersCnt = state.wooOrders.filter((o) => o.local_status !== 'converted').length;

    return `
      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="subtab-bar" style="justify-content:space-between">
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <button type="button" class="subtab-btn ${csub === 'woo' ? 'active' : ''}" data-csub="woo">
              ${ICONS.sync}<span>1. Boutique WooCommerce & Photos (${pendingWooCnt})</span>
            </button>
            <button type="button" class="subtab-btn ${csub === 'orders' ? 'active' : ''}" data-csub="orders">
              ${ICONS.pos}<span>2. Commandes Web (${pendingOrdersCnt})</span>
            </button>
            <button type="button" class="subtab-btn ${csub === 'android' ? 'active' : ''}" data-csub="android">
              ${ICONS.connect}<span>3. Terminaux Android Wi-Fi (${(state.networkInfo?.pairedDevices || []).length})</span>
            </button>
            <button type="button" class="subtab-btn ${csub === 'settings' ? 'active' : ''}" data-csub="settings">
              ${ICONS.edit}<span>4. Enseigne, IA & Sauvegardes</span>
            </button>
          </div>
          <button type="button" class="btn btn-sm" id="btn-backup-db">${ICONS.download}<span>Backup SQLite</span></button>
        </div>

        ${
          csub === 'woo'
            ? `<div style="display:flex;flex-direction:column;gap:16px">
                <div class="panel">
                  <div class="panel-header">
                    <span class="panel-title">Connexion REST API WooCommerce & Médias WordPress (${state.settings.woo_url || 'electrozen.ma'})</span>
                  </div>
                  <form id="form-save-woo-settings" class="panel-body" style="display:flex;flex-direction:column;gap:12px">
                    <div style="display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:10px">
                      <div>
                        <label class="field-label">URL Site WooCommerce / WordPress</label>
                        <input name="woo_url" class="input mono" value="${state.settings.woo_url || ''}" />
                      </div>
                      <div>
                        <label class="field-label">Consumer Key (ck_...)</label>
                        <input name="woo_consumer_key" type="password" class="input mono" value="${state.settings.woo_consumer_key || ''}" />
                      </div>
                      <div>
                        <label class="field-label">Consumer Secret (cs_...)</label>
                        <input name="woo_consumer_secret" type="password" class="input mono" value="${state.settings.woo_consumer_secret || ''}" />
                      </div>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
                      <div>
                        <label class="field-label">Utilisateur WordPress (Upload Médias)</label>
                        <input name="woo_wp_user" class="input mono" placeholder="Optionnel (ex: admin)" value="${state.settings.woo_wp_user || ''}" />
                      </div>
                      <div>
                        <label class="field-label">Mot de passe d'application WP (Médias)</label>
                        <input name="woo_wp_app_password" type="password" class="input mono" placeholder="Optionnel (pour envoyer vos photos caméra locales)" value="${state.settings.woo_wp_app_password || ''}" />
                      </div>
                    </div>
                    <div style="display:flex;gap:8px;flex-wrap:wrap">
                      <button type="submit" class="btn btn-dark">Enregistrer Clés WooCommerce</button>
                      <button type="button" class="btn btn-primary" id="btn-test-woo" ${state.wooTestLoading ? 'disabled' : ''}>
                        ${state.wooTestLoading ? 'Test en cours...' : 'Tester Connexion WooCommerce'}
                      </button>
                    </div>
                    ${
                      state.wooTestStatus
                        ? `<div style="padding:10px 12px;border-radius:8px;font-size:12px;background:${state.wooTestStatus.wc_connected ? 'rgba(57,174,82,0.1)' : 'rgba(226,27,27,0.08)'};border:1px solid ${state.wooTestStatus.wc_connected ? 'rgba(57,174,82,0.35)' : 'rgba(226,27,27,0.3)'};color:${state.wooTestStatus.wc_connected ? '#166534' : '#991b1b'}">
                            <div style="font-weight:700">${state.wooTestStatus.wc_connected ? state.wooTestStatus.message : `Échec connexion WooCommerce : ${state.wooTestStatus.error}`}</div>
                            ${state.wooTestStatus.wp_media_message ? `<div style="font-size:11px;margin-top:4px;opacity:0.9">${state.wooTestStatus.wp_media_message}</div>` : ''}
                          </div>`
                        : ''
                    }
                  </form>
                </div>

                <!-- Pre-Sync Product Pictures Control & WooCommerce Readiness -->
                <div class="panel">
                  <div class="panel-header" style="flex-wrap:wrap;gap:10px">
                    <div>
                      <span class="panel-title">Contrôle & Organisation des Photos avant Synchronisation WooCommerce</span>
                      <div style="font-size:11px;color:var(--ink-400);margin-top:2px">Vérifiez, ajoutez, réordonnez ou remplacez les photos produit (#1 = Image Principale) avant d'envoyer vers electrozen.ma</div>
                    </div>
                    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
                      <input id="input-woo-sync-search" class="input" style="width:210px" placeholder="Filtrer article, marque, SKU..." value="${state.wooSyncSearch || ''}" />
                      <div class="segmented">
                        ${[
                          { id: 'all', label: `Tous (${state.products.length})` },
                          { id: 'pending', label: `À Sync (${pendingWooCnt})` },
                          { id: 'no_photo', label: `Sans Photo (${state.products.filter((x) => getProductImages(x).length === 0).length})` },
                          { id: 'with_photo', label: `Avec Photos (${state.products.filter((x) => getProductImages(x).length > 0).length})` },
                        ]
                          .map(
                            (f) => `<button type="button" class="seg-btn ${state.wooSyncFilter === f.id ? 'active' : ''}" data-woo-filter="${f.id}">${f.label}</button>`
                          )
                          .join('')}
                      </div>
                      <button type="button" class="btn btn-primary" id="btn-sync-woo-panel">${ICONS.sync}<span>Synchroniser Tous (${pendingWooCnt})</span></button>
                    </div>
                  </div>
                  ${
                    state.wooSyncReport
                      ? `<div style="margin:12px 16px 0;padding:10px 12px;border-radius:8px;font-size:12px;background:${state.wooSyncReport.failedCount > 0 || state.wooSyncReport.error ? '#fef2f2' : '#ecfdf5'};border:1px solid ${state.wooSyncReport.failedCount > 0 || state.wooSyncReport.error ? '#fecaca' : '#a7f3d0'};color:${state.wooSyncReport.failedCount > 0 || state.wooSyncReport.error ? '#991b1b' : '#065f46'}">
                          <div style="font-weight:700">${state.wooSyncReport.error ? state.wooSyncReport.error : `Sync WooCommerce : ${state.wooSyncReport.syncedCount} synchronisé(s), ${state.wooSyncReport.failedCount || 0} échec(s).`}</div>
                          ${state.wooSyncReport.localSkippedImagesTotal > 0 ? `<div style="font-size:11px;margin-top:4px">${state.wooSyncReport.localSkippedImagesTotal} photo(s) locale(s) ignorée(s) car aucun Mot de passe d'application WP Médias n'est saisi (utilisez Recherche Photo Web ou ajoutez les identifiants WP ci-dessus).</div>` : ''}
                          ${(state.wooSyncReport.errors || []).slice(0, 4).map((e) => `<div class="mono" style="font-size:11px;margin-top:2px">• ${e.name} (${e.sku}) : ${e.error}</div>`).join('')}
                        </div>`
                      : ''
                  }
                  <div class="table-wrap" style="max-height:460px;overflow-y:auto">
                    <table>
                      <thead>
                        <tr>
                          <th>Article & SKU</th>
                          <th>Galerie Photos (#1 Principale)</th>
                          <th style="text-align:center">Stock</th>
                          <th style="text-align:end">Prix</th>
                          <th>Statut WooCommerce</th>
                          <th style="text-align:end">Actions Avant Sync</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${(() => {
                          const q = String(state.wooSyncSearch || '').toLowerCase().trim();
                          const list = state.products.filter((p) => {
                            const imgs = getProductImages(p);
                            if (state.wooSyncFilter === 'pending' && p.woo_sync_status === 'synced') return false;
                            if (state.wooSyncFilter === 'no_photo' && imgs.length > 0) return false;
                            if (state.wooSyncFilter === 'with_photo' && imgs.length === 0) return false;
                            if (q && !`${p.name_fr} ${p.brand} ${p.model_number} ${p.sku} ${p.barcode}`.toLowerCase().includes(q)) return false;
                            return true;
                          });
                          if (list.length === 0) {
                            return '<tr><td colspan="6" style="text-align:center;color:var(--ink-400);padding:24px">Aucun article dans ce filtre.</td></tr>';
                          }
                          return list
                            .slice(0, 60)
                            .map((p) => {
                              const imgs = getProductImages(p);
                              return `
                                <tr>
                                  <td>
                                    <div style="font-weight:700;color:var(--ink-900);max-width:240px">${getProdName(p)}</div>
                                    <div class="mono" style="font-size:11px;color:var(--ink-400)">SKU: ${p.sku || p.barcode} ${p.woo_id_verified ? `• Woo #${p.woo_id}` : ''}</div>
                                  </td>
                                  <td>
                                    <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                                      ${
                                        imgs.length === 0
                                          ? `<span class="tag tag-danger" style="font-size:10.5px">Aucune photo</span>`
                                          : imgs
                                              .slice(0, 4)
                                              .map(
                                                (u, idx) => `<div style="position:relative;border:2px solid ${idx === 0 ? '#4f46e5' : '#e2e8f0'};border-radius:6px;padding:1px;background:#fff">
                                                    <img src="${u}" style="width:38px;height:38px;object-fit:contain;display:block" loading="lazy" />
                                                    ${idx === 0 ? `<span style="position:absolute;top:-5px;left:-4px;background:#4f46e5;color:#fff;font-size:8px;font-weight:800;padding:0 3px;border-radius:4px">★1</span>` : ''}
                                                  </div>`
                                              )
                                              .join('')
                                      }
                                      ${imgs.length > 4 ? `<span class="tag" style="font-size:10px">+${imgs.length - 4}</span>` : ''}
                                    </div>
                                  </td>
                                  <td style="text-align:center"><span class="tag ${p.stock_quantity > 0 ? 'tag-ok' : 'tag-danger'} num">${p.stock_quantity}</span></td>
                                  <td class="num" style="text-align:end;font-weight:700">${fmtMoney(p.retail_price)}</td>
                                  <td>
                                    <span class="tag ${p.woo_sync_status === 'synced' ? 'tag-ok' : 'tag-warn'}">${p.woo_sync_status === 'synced' ? 'Synchronisé' : 'En attente'}</span>
                                    ${p.woo_last_error ? `<div style="font-size:10px;color:#b91c1c;max-width:170px;margin-top:2px">${p.woo_last_error}</div>` : ''}
                                  </td>
                                  <td style="text-align:end">
                                    <div class="action-group">
                                      <button type="button" class="btn btn-sm btn-open-pictures" data-id="${p.id}">${ICONS.image}<span>Gérer (${imgs.length})</span></button>
                                      <button type="button" class="btn btn-sm btn-open-pictures" data-id="${p.id}" data-web="1" title="Chercher une photo officielle sur le Web">${ICONS.search}</button>
                                      <button type="button" class="btn btn-sm btn-dark btn-sync-single-woo" data-id="${p.id}">Sync</button>
                                    </div>
                                  </td>
                                </tr>
                              `;
                            })
                            .join('');
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>`
            : csub === 'orders'
              ? `<div class="panel">
                  <div class="panel-header" style="flex-wrap:wrap;gap:10px">
                    <div>
                      <span class="panel-title">Synchronisation Commandes Web WooCommerce → Caisse POS (${state.wooOrders.length})</span>
                      <div style="font-size:11px;color:var(--ink-400)">Importez vos commandes clients electrozen.ma, contactez par WhatsApp et convertissez en facture POS avec déduction stock automatique.</div>
                    </div>
                    <button type="button" class="btn btn-primary" id="btn-pull-woo-orders" ${state.wooOrdersPullLoading ? 'disabled' : ''}>
                      ${ICONS.sync}<span>${state.wooOrdersPullLoading ? 'Import en cours...' : 'Importer Commandes WooCommerce'}</span>
                    </button>
                  </div>
                  <div class="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>N° Commande Web</th>
                          <th>Client & Livraison</th>
                          <th>Articles Commandés</th>
                          <th style="text-align:end">Total TTC</th>
                          <th>Statut</th>
                          <th style="text-align:end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${state.wooOrders
                          .map((ord) => {
                            const itemsHtml = (ord.items || [])
                              .map((it) => `<div style="font-size:11.5px">• <strong>${it.quantity}x</strong> ${it.product_name} ${it.product_id ? `<span class="tag tag-ok" style="font-size:9px;padding:0 5px">Lié</span>` : `<span class="tag tag-warn" style="font-size:9px;padding:0 5px">Non lié</span>`}</div>`)
                              .join('');
                            return `
                              <tr>
                                <td class="mono">
                                  <div style="font-weight:800;color:var(--ink-900)">#${ord.order_number}</div>
                                  <div style="font-size:10.5px;color:var(--ink-400)">${String(ord.order_date || '').slice(0, 16)}</div>
                                  <div style="font-size:10px;color:var(--ink-500)">${ord.payment_method_title || ''}</div>
                                </td>
                                <td>
                                  <div style="font-weight:700;color:var(--ink-900)">${ord.customer_name}</div>
                                  <div class="mono" style="font-size:11px;color:var(--ink-500)">${ord.customer_phone || '—'} • ${ord.customer_city || ''}</div>
                                  <div style="font-size:11px;color:var(--ink-400)">${ord.customer_address || ''}</div>
                                </td>
                                <td style="max-width:260px">${itemsHtml || '—'}</td>
                                <td class="num" style="text-align:end;font-weight:800">${fmtMoney(ord.total_amount)}</td>
                                <td>
                                  <span class="tag ${ord.local_status === 'converted' ? 'tag-ok' : 'tag-warn'}">
                                    ${ord.local_status === 'converted' ? 'Validée POS' : `Web: ${ord.status}`}
                                  </span>
                                </td>
                                <td style="text-align:end">
                                  <div class="action-group">
                                    ${ord.customer_phone ? `<button type="button" class="btn btn-sm btn-whatsapp-woo-ord" data-id="${ord.id}" style="background:rgba(16,185,129,0.12);border-color:rgba(16,185,129,0.35);color:#047857">${ICONS.whatsapp}<span>WA</span></button>` : ''}
                                    ${ord.local_status !== 'converted' ? `<button type="button" class="btn btn-sm btn-pos btn-convert-woo-ord" data-id="${ord.id}">Valider → Facture</button>` : ''}
                                  </div>
                                </td>
                              </tr>
                            `;
                          })
                          .join('') || '<tr><td colspan="6" style="text-align:center;color:var(--ink-400);padding:26px">Aucune commande Web importée. Cliquez sur « Imprimer / Importer Commandes WooCommerce » ci-dessus.</td></tr>'}
                      </tbody>
                    </table>
                  </div>
                </div>`
            : csub === 'android'
              ? `<div class="panel">
                  <div class="panel-header">
                    <span class="panel-title">Serveur Local Wi-Fi & Terminaux Android</span>
                  </div>
                  <div class="panel-body" style="display:flex;flex-direction:column;gap:14px">
                    <div style="display:flex;gap:16px;align-items:center;padding:12px;background:var(--panel-subtle);border:1px solid var(--border);border-radius:8px;flex-wrap:wrap">
                      ${qrSvg}
                      <div style="display:flex;flex-direction:column;gap:6px">
                        <div>
                          <span class="field-label">Hôte Local (Même réseau Wi-Fi)</span>
                          <div class="mono" style="font-size:14px;font-weight:700;color:var(--ink-900)">
                            http://${state.networkInfo?.primaryIp || '127.0.0.1'}:${state.networkInfo?.port || 4000}
                          </div>
                        </div>
                        <div>
                          <span class="field-label">Clé d'appairage</span>
                          <div class="mono" style="font-weight:600;color:var(--ink-500)">${state.networkInfo?.pairingToken || 'ELECTROZEN-POS-2026'}</div>
                        </div>
                        <div>
                          <span class="field-label">App Mobile Web (/mobile)</span>
                          <div class="mono" style="font-size:12px;font-weight:700;color:var(--ink-900)">
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
                      <a href="/mobile" target="_blank" class="btn" style="text-decoration:none">Ouvrir l'App Mobile Web (/mobile)</a>
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
                              <td style="font-weight:600;color:var(--ink-900)">${d.device_name}</td>
                              <td class="mono" style="font-size:11.5px;color:var(--ink-400)">${d.last_seen.slice(0, 16)}</td>
                              <td style="text-align:end"><span class="tag tag-ok">En ligne</span></td>
                            </tr>
                          `
                            )
                            .join('') || '<tr><td colspan="3" style="text-align:center;color:var(--ink-400);padding:20px">Aucun terminal connecté pour le moment.</td></tr>'}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>`
              : `<div style="display:flex;flex-direction:column;gap:16px">
                  <div class="panel">
                    <div class="panel-header">
                      <span class="panel-title">Paramètres Enseigne, Fiscalité Maroc (ICE/IF/RC) & Moteur IA</span>
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
                      <div style="display:grid;grid-template-columns:1fr 1.6fr;gap:10px">
                        <div>
                          <label class="field-label">Fournisseur IA (Boîte / Factures / Enhance)</label>
                          <select name="ai_provider" class="input">
                            <option value="deepseek" ${(state.settings.ai_provider || 'gemini') === 'deepseek' ? 'selected' : ''}>DeepSeek API (deepseek-chat)</option>
                            <option value="gemini" ${(state.settings.ai_provider || 'gemini') === 'gemini' ? 'selected' : ''}>Google Gemini (3 Flash Preview)</option>
                            <option value="openai" ${(state.settings.ai_provider || 'gemini') === 'openai' ? 'selected' : ''}>OpenAI (gpt-4o-mini)</option>
                          </select>
                        </div>
                        <div>
                          <label class="field-label">Clé API IA (DeepSeek / Gemini / OpenAI)</label>
                          <input name="ai_api_key" type="password" class="input mono" placeholder="sk-... ou AIza..." value="${state.settings.ai_api_key || ''}" />
                        </div>
                      </div>
                      <button type="submit" class="btn btn-dark" style="align-self:flex-start;padding:8px 20px">Enregistrer Enseigne & IA</button>
                    </form>
                  </div>

                  <div class="panel">
                    <div class="panel-header">
                      <span class="panel-title">Sauvegardes Automatiques SQLite & Journal d'Audit</span>
                      <div style="display:flex;gap:8px;flex-wrap:wrap">
                        <button class="btn btn-sm" id="btn-backup-now">Créer Sauvegarde Maintenant</button>
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
                </div>`
        }
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
                              <button class="btn btn-sm btn-whatsapp-quote" data-id="${q.id}" style="background:rgba(16,185,129,0.12);border-color:rgba(16,185,129,0.35);color:#047857">${ICONS.whatsapp}<span>WA</span></button>
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
            : `<div style="display:flex;flex-direction:column;gap:14px">
                <!-- INSTANT WARRANTY LOOKUP BY S/N, INVOICE OR PHONE -->
                <div class="panel" style="border-color:var(--primary-3);background:var(--primary-4)">
                  <div class="panel-header">
                    <span class="panel-title">Vérificateur Instantané de Garantie SAV (N° Série / IMEI / Facture FAC / Téléphone)</span>
                  </div>
                  <div class="panel-body" style="display:flex;flex-direction:column;gap:10px">
                    <form id="form-warranty-lookup" style="display:flex;gap:8px;flex-wrap:wrap">
                      <input id="input-warranty-query" class="input mono" style="flex:1;min-width:240px" value="${state.warrantyLookupQuery || ''}" placeholder="Ex: FAC-2026-000012, S/N, EAN ou 0661..." />
                      <button type="submit" class="btn btn-dark">${ICONS.search}<span>Vérifier Garantie</span></button>
                    </form>
                    ${
                      Array.isArray(state.warrantyLookupResults)
                        ? state.warrantyLookupResults.length === 0
                          ? `<div style="font-size:12px;color:#b91c1c;font-weight:600">Aucune vente correspondante trouvée pour « ${state.warrantyLookupQuery} ».</div>`
                          : `<div class="table-wrap" style="background:var(--panel-bg);border-radius:8px">
                              <table>
                                <thead><tr><th>Facture & Date</th><th>Client</th><th>Appareil & S/N</th><th>Fin Garantie</th><th style="text-align:end">Action</th></tr></thead>
                                <tbody>
                                  ${state.warrantyLookupResults
                                    .map(
                                      (w, wIdx) => `<tr>
                                        <td class="mono" style="font-size:11.5px;font-weight:700">${w.invoice_number}<div style="font-size:10px;color:var(--ink-400)">${String(w.sold_at || '').slice(0, 10)}</div></td>
                                        <td><div style="font-weight:600">${w.customer_name}</div><div class="mono" style="font-size:10.5px;color:var(--ink-400)">${w.customer_phone || '—'}</div></td>
                                        <td><div style="font-weight:600">${w.product_name}</div><div class="mono" style="font-size:10.5px;color:#6d28d9">${w.serial_number ? `S/N: ${w.serial_number}` : `EAN: ${w.barcode}`}</div></td>
                                        <td><span class="tag ${w.is_under_warranty ? 'tag-ok' : 'tag-danger'}">${w.is_under_warranty ? `SOUS GARANTIE (${w.days_remaining} j)` : `EXPIRÉE (${w.warranty_expires_at || ''})`}</span></td>
                                        <td style="text-align:end"><button type="button" class="btn btn-sm btn-pos btn-prefill-sav" data-widx="${wIdx}">+ Ouvrir Ticket SAV</button></td>
                                      </tr>`
                                    )
                                    .join('')}
                                </tbody>
                              </table>
                            </div>`
                        : ''
                    }
                  </div>
                </div>

                <div class="grid-2" style="align-items:start">
                  <div class="panel">
                    <div class="panel-header"><span class="panel-title">Nouveau Ticket Réparation / SAV</span></div>
                    <form id="form-new-sav" class="panel-body" style="display:flex;flex-direction:column;gap:10px">
                      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                        <div><label class="field-label">Client *</label><input name="customer_name" required class="input" value="${state.savPrefill?.customer_name || ''}" placeholder="Nom complet" /></div>
                        <div><label class="field-label">Téléphone (WhatsApp)</label><input name="customer_phone" class="input mono" value="${state.savPrefill?.customer_phone || ''}" placeholder="06..." /></div>
                      </div>
                      <div style="display:grid;grid-template-columns:1.2fr 1fr 0.8fr;gap:8px">
                        <div><label class="field-label">Appareil / Modèle *</label><input name="device_name" required class="input" value="${state.savPrefill?.device_name || ''}" placeholder="Ex: TV Samsung / Lave-linge" /></div>
                        <div><label class="field-label">N° Série / IMEI</label><input name="serial_number" class="input mono" value="${state.savPrefill?.serial_number || ''}" /></div>
                        <div><label class="field-label">N° Facture Réf.</label><input name="invoice_number" class="input mono" value="${state.savPrefill?.invoice_number || ''}" placeholder="FAC-..." /></div>
                      </div>
                      <div style="display:grid;grid-template-columns:1.3fr 1fr;gap:8px;align-items:end">
                        <div><label class="field-label">Accessoires remis</label><input name="accessories_received" class="input" placeholder="Ex: Télécommande, câble, boîte..." /></div>
                        <label style="display:flex;align-items:center;gap:6px;padding:8px;border:1px solid var(--border);border-radius:8px;cursor:pointer;font-size:12px;font-weight:700">
                          <input type="checkbox" name="under_warranty" ${state.savPrefill?.under_warranty ? 'checked' : ''} /> Sous Garantie (0 MAD)
                        </label>
                      </div>
                      <div><label class="field-label">Panne / Problème constaté</label><textarea name="issue_description" rows="2" class="input" placeholder="Décrivez la panne..."></textarea></div>
                      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
                        <div><label class="field-label">Coût Pièces (MAD)</label><input name="parts_cost" type="number" step="0.01" class="input mono" value="0" /></div>
                        <div><label class="field-label">Main d'œuvre (MAD)</label><input name="labor_price" type="number" step="0.01" class="input mono" value="${state.savPrefill?.under_warranty ? '0' : '150'}" /></div>
                        <div><label class="field-label">Avance payée (MAD)</label><input name="paid_amount" type="number" step="0.01" class="input mono" value="0" /></div>
                      </div>
                      <button type="submit" class="btn btn-dark" style="justify-content:center">Créer Ticket SAV Atelier</button>
                    </form>
                  </div>

                  <div class="panel">
                    <div class="panel-header"><span class="panel-title">Suivi Atelier SAV (${state.serviceJobs.length})</span></div>
                    <div class="table-wrap">
                      <table>
                        <thead><tr><th>Ticket / Client</th><th>Appareil & Garantie</th><th>Atelier / RMA Fournisseur</th><th style="text-align:end">Actions</th></tr></thead>
                        <tbody>
                          ${state.serviceJobs
                            .map((j) => {
                              const st = statusLabels[j.status] || statusLabels.pending;
                              return `
                                <tr>
                                  <td>
                                    <div class="mono" style="font-weight:700;color:var(--ink-900)">${j.ticket_number}</div>
                                    <div style="font-size:12px;font-weight:600">${j.customer_name}</div>
                                    <div class="mono" style="font-size:10.5px;color:var(--ink-400)">${j.customer_phone || ''}</div>
                                  </td>
                                  <td>
                                    <div style="font-weight:600;color:var(--ink-900)">${j.device_name}</div>
                                    <div style="font-size:11px;color:var(--ink-400)">${j.issue_description || ''}</div>
                                    <div style="margin-top:3px;display:flex;gap:4px;flex-wrap:wrap">
                                      ${j.under_warranty ? `<span class="tag tag-ok" style="font-size:9.5px">Sous Garantie</span>` : `<span class="tag" style="font-size:9.5px">${fmtMoney(j.total_price)}</span>`}
                                      ${j.invoice_number ? `<span class="tag mono" style="font-size:9.5px">${j.invoice_number}</span>` : ''}
                                    </div>
                                  </td>
                                  <td>
                                    <span class="tag ${st.cls}" style="margin-bottom:4px;display:inline-flex">${st.text}</span>
                                    <select class="input sel-sav-status" data-id="${j.id}" style="height:26px;font-size:11px;margin-top:3px">
                                      <option value="pending" ${j.status === 'pending' ? 'selected' : ''}>En attente</option>
                                      <option value="in_progress" ${j.status === 'in_progress' ? 'selected' : ''}>En réparation</option>
                                      <option value="ready" ${j.status === 'ready' ? 'selected' : ''}>Prêt</option>
                                      <option value="delivered" ${j.status === 'delivered' ? 'selected' : ''}>Livré & Payé</option>
                                    </select>
                                    <select class="input sel-sav-rma" data-id="${j.id}" style="height:26px;font-size:10.5px;margin-top:4px" title="Suivi retour fournisseur / RMA">
                                      <option value="none" ${(j.supplier_rma_status || 'none') === 'none' ? 'selected' : ''}>RMA: Atelier interne</option>
                                      <option value="sent_supplier" ${j.supplier_rma_status === 'sent_supplier' ? 'selected' : ''}>RMA: Envoyé fournisseur</option>
                                      <option value="replaced" ${j.supplier_rma_status === 'replaced' ? 'selected' : ''}>RMA: Échangé / Remplacé</option>
                                      <option value="returned" ${j.supplier_rma_status === 'returned' ? 'selected' : ''}>RMA: Reçu du fournisseur</option>
                                    </select>
                                  </td>
                                  <td style="text-align:end">
                                    <div class="action-group" style="justify-content:flex-end">
                                      <button type="button" class="btn btn-sm btn-print-sav" data-id="${j.id}" title="Imprimer Reçu Dépôt SAV">${ICONS.print}</button>
                                      <button type="button" class="btn btn-sm btn-whatsapp-sav" data-id="${j.id}" style="background:rgba(16,185,129,0.12);border-color:rgba(16,185,129,0.35);color:#047857" title="Notifier client par WhatsApp">${ICONS.whatsapp}</button>
                                    </div>
                                  </td>
                                </tr>
                              `;
                            })
                            .join('') || '<tr><td colspan="4" style="color:var(--ink-400);text-align:center;padding:24px">Aucun ticket SAV en cours.</td></tr>'}
                        </tbody>
                      </table>
                    </div>
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
                    <button class="btn btn-sm btn-open-pictures" data-id="${p.id}">${ICONS.image}<span>Photos (${getProductImages(p).length})</span></button>
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
  const expanded = Boolean(state.productModalExpanded || state.editingProduct);
  const gallery = state.productGalleryImages || [];

  return `
    <div class="modal-backdrop">
      <div class="modal-box" style="max-width:780px">
        <div class="modal-header">
          <span style="font-weight:600;font-size:13.5px;color:var(--ink-900)">
            ${state.editingProduct ? `Modifier l'article : ${state.editingProduct.name_fr}` : 'Ajout Rapide Article (Quick Add / Galerie Photos & IA)'}
          </span>
          <div style="display:flex;gap:8px;align-items:center">
            <button type="button" class="btn btn-sm" id="btn-toggle-prod-expand" style="background:#f3e8ff;color:#5b21b6;border-color:#d8b4fe;font-weight:700">
              ${expanded ? '▲ Mode Rapide (Réduire)' : '▼ Plus d’infos (AR, EN, Gros, Garantie...)'}
            </button>
            <button class="btn btn-sm" id="btn-close-prod-modal">Fermer</button>
          </div>
        </div>
        <form id="form-product-modal" class="modal-body" style="display:flex;flex-direction:column;gap:12px">
          <input type="hidden" name="image_url" id="prod-image-url" value="${gallery[0] || ''}" />

          <!-- Multi-Image Gallery & 4-Way Photo Studio Card -->
          <div style="padding:12px;background:linear-gradient(135deg,#faf5ff 0%,#f8fafc 100%);border:1px solid #d8b4fe;border-radius:10px;display:flex;flex-direction:column;gap:10px">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">
              <div>
                <div style="font-weight:700;font-size:12.5px;color:#5b21b6">Galerie Photos Produit (${gallery.length}) • Photo Studio & Recherche Web</div>
                <div style="font-size:11px;color:#64748b">La photo #1 (Principale) est affichée en boutique POS et comme image principale WooCommerce.</div>
              </div>
              <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
                <label class="btn btn-sm" style="cursor:pointer;margin:0">
                  <input type="file" id="input-prod-add-gallery" accept="image/*" multiple style="display:none" />
                  <span>+ Ajouter Photo(s)</span>
                </label>
                <label class="btn btn-sm btn-dark" style="cursor:pointer;margin:0">
                  <input type="file" id="input-prod-photos-ai" accept="image/*" multiple style="display:none" />
                  <span>${state.productPhotoAiLoading ? 'Analyse photos...' : 'Lire Boîte + Extraire IA'}</span>
                </label>
                <button type="button" class="btn btn-sm" id="btn-toggle-modal-web-img" style="background:#eff6ff;color:#1d4ed8;border-color:#bfdbfe;font-weight:700">
                  ${ICONS.search}<span>Photo Officielle Web</span>
                </button>
              </div>
            </div>

            <!-- Interactive Gallery Thumbnails Strip -->
            <div style="display:flex;gap:10px;overflow-x:auto;padding:4px 2px">
              ${
                gallery.length === 0
                  ? `<div style="padding:14px 18px;border:1px dashed #cbd5e1;border-radius:8px;background:#fff;font-size:11.5px;color:#64748b;width:100%;text-align:center">Aucune photo ajoutée. Cliquez sur "+ Ajouter Photo(s)", "Photo Officielle Web" ou "Lire Boîte (IA)".</div>`
                  : gallery
                      .map(
                        (url, idx) => `
                    <div style="min-width:112px;background:#fff;border:2px solid ${idx === 0 ? '#5b21b6' : '#e2e8f0'};border-radius:8px;padding:6px;display:flex;flex-direction:column;gap:5px;flex-shrink:0">
                      <div style="position:relative;height:78px;display:flex;align-items:center;justify-content:center;background:#fff">
                        <img src="${url}" style="max-width:100%;max-height:76px;object-fit:contain" />
                        <span style="position:absolute;top:0;left:0;background:${idx === 0 ? '#5b21b6' : '#64748b'};color:#fff;font-size:9px;font-weight:800;padding:1px 5px;border-radius:4px">${idx === 0 ? '★ Principale' : `#${idx + 1}`}</span>
                      </div>
                      <div style="display:flex;justify-content:space-between;gap:3px">
                        <button type="button" class="btn btn-sm btn-modal-img-left" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''} style="height:22px;padding:0 5px;font-size:10px" title="Déplacer à gauche">◀</button>
                        <button type="button" class="btn btn-sm btn-modal-img-primary" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''} style="height:22px;padding:0 6px;font-size:10px;color:#5b21b6" title="Définir Principale">★</button>
                        <button type="button" class="btn btn-sm btn-modal-img-right" data-idx="${idx}" ${idx === gallery.length - 1 ? 'disabled' : ''} style="height:22px;padding:0 5px;font-size:10px" title="Déplacer à droite">▶</button>
                        <button type="button" class="btn btn-sm btn-modal-img-del" data-idx="${idx}" style="height:22px;padding:0 6px;font-size:10px;color:#e21b1b" title="Supprimer">✕</button>
                      </div>
                    </div>`
                      )
                      .join('')
              }
            </div>

            <!-- Studio Mode Toolbar -->
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding-top:6px;border-top:1px solid #ede9fe">
              <select id="select-modal-studio-mode" class="input" style="flex:1;min-width:210px;height:30px;font-size:11.5px">
                <option value="clean_crop" ${state.productStudioMode === 'clean_crop' ? 'selected' : ''}>🖼️ Cadrage Studio Pro (Recommandé — sans détourage destructif)</option>
                <option value="white_cutout" ${state.productStudioMode === 'white_cutout' ? 'selected' : ''}>✂️ Détourage Fond Blanc Intelligent (Edge-Safe)</option>
                <option value="ai_render" ${state.productStudioMode === 'ai_render' ? 'selected' : ''}>✨ Rendu Studio IA 3D (Synthèse propre)</option>
                <option value="original_framed" ${state.productStudioMode === 'original_framed' ? 'selected' : ''}>📐 Format Carré 1000×1000 (Image entière)</option>
              </select>
              <button type="button" class="btn btn-sm btn-primary" id="btn-gen-pro-photo" ${state.productProPhotoLoading ? 'disabled' : ''}>
                ${state.productProPhotoLoading ? 'Traitement Studio...' : 'Appliquer Studio sur Photo #1'}
              </button>
            </div>

            <!-- Inline Web Official Image Finder -->
            ${
              state.webImageSearchOpen
                ? `<div style="padding:10px;background:#fff;border:1px solid #bfdbfe;border-radius:8px;display:flex;flex-direction:column;gap:8px">
                    <div style="display:flex;gap:6px">
                      <input id="input-modal-web-img-q" class="input" style="flex:1" placeholder="Marque + Modèle + Désignation (ex: SONIC Four 45L FE5022SC)..." value="${state.webImageSearchQuery || ''}" />
                      <button type="button" class="btn btn-sm btn-dark" id="btn-run-modal-web-img" ${state.webImageSearchLoading ? 'disabled' : ''}>
                        ${state.webImageSearchLoading ? 'Recherche...' : 'Rechercher'}
                      </button>
                    </div>
                    ${
                      state.webImageSearchResults.length > 0
                        ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:8px;max-height:190px;overflow-y:auto">
                            ${state.webImageSearchResults
                              .map(
                                (r, rIdx) => `
                              <div class="btn-pick-modal-web-img" data-ridx="${rIdx}" style="cursor:pointer;border:1px solid #e2e8f0;border-radius:6px;padding:4px;background:#fff;display:flex;flex-direction:column;align-items:center;gap:4px" title="Cliquer pour télécharger et ajouter à la galerie">
                                <img src="${r.thumb || r.url}" style="width:80px;height:72px;object-fit:contain" />
                                <span style="font-size:9.5px;color:#1d4ed8;font-weight:700">+ Ajouter</span>
                              </div>`
                              )
                              .join('')}
                          </div>`
                        : `<div style="font-size:11px;color:#64748b">${state.webImageSearchLoading ? 'Recherche des photos officielles sur le Web...' : 'Lancez la recherche pour choisir une vraie photo studio constructeur.'}</div>`
                    }
                  </div>`
                : ''
            }
          </div>

          <!-- Barcode Row -->
          <div style="padding:10px 12px;background:var(--panel-subtle);border:1px solid var(--border);border-radius:10px;display:flex;flex-direction:column;gap:8px">
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
              <input name="barcode" id="prod-barcode" required class="input mono" style="flex:1;min-width:190px" placeholder="Code-barres EAN (scan douchette / caméra / manuel)..." value="${randomBarcode}" />
              <button type="button" class="btn btn-sm btn-dark" id="btn-internet-lookup">${ICONS.sync}<span>Internet</span></button>
              <button type="button" class="btn btn-sm" id="btn-camera-barcode-modal">${ICONS.barcode}<span>${state.cameraScanActive ? 'Fermer Caméra' : 'Caméra'}</span></button>
              <button type="button" class="btn btn-sm" id="btn-gen-ean">Auto EAN</button>
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
                ? `<div style="padding:7px 10px;border-radius:8px;font-size:11.5px;font-weight:600;background:${state.internetLookupBanner.ok ? 'rgba(57,174,82,0.12)' : 'rgba(255,193,8,0.16)'};color:${state.internetLookupBanner.ok ? '#166534' : '#92400e'};border:1px solid ${state.internetLookupBanner.ok ? 'rgba(57,174,82,0.35)' : 'rgba(255,193,8,0.4)'}">
                    ${state.internetLookupBanner.msg}
                  </div>`
                : ''
            }
          </div>

          <!-- QUICK ADD CORE FIELDS -->
          <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:10px">
            <div>
              <label class="field-label">Désignation Produit (FR) *</label>
              <input name="name_fr" id="prod-name-fr" required class="input" placeholder="Ex: Four Électrique SONIC 45L FE5022SC..." value="${ep?.name_fr || ''}" />
            </div>
            <div>
              <label class="field-label">Marque *</label>
              <input name="brand" id="prod-brand" required class="input" placeholder="Ex: SONIC, LG, TCL..." value="${ep?.brand || ''}" />
            </div>
            <div>
              <label class="field-label">Modèle</label>
              <input name="model_number" id="prod-model" class="input mono" placeholder="Ex: FE5022SC" value="${ep?.model_number || ''}" />
            </div>
          </div>

          <div style="padding:12px;background:var(--panel-subtle);border:1px solid var(--border);border-radius:10px;display:grid;grid-template-columns:1.4fr 1fr 1fr 0.8fr;gap:10px">
            <div>
              <label class="field-label">Catégorie</label>
              <input name="category" id="prod-category" class="input" value="${ep?.category || 'Petit Électroménager'}" />
            </div>
            <div>
              <label class="field-label">Coût Achat (MAD) *</label>
              <input name="current_cost_price" id="prod-cost-price" type="number" step="0.01" required class="input mono" value="${ep?.current_cost_price ?? 0}" />
            </div>
            <div>
              <label class="field-label">Prix Détail (MAD) *</label>
              <input name="retail_price" id="prod-retail-price" type="number" step="0.01" required class="input mono" value="${ep?.retail_price ?? 0}" />
            </div>
            <div>
              <label class="field-label">Stock *</label>
              <input name="stock_quantity" id="prod-stock-qty" type="number" required class="input mono" value="${ep?.stock_quantity ?? 1}" />
            </div>
          </div>

          <!-- AI Enhance Bar (Always handy even in Quick Mode) -->
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">
            <span style="font-size:11.5px;color:var(--ink-500)">Caractéristiques & Descriptions (FR / AR / EN)</span>
            <div style="display:flex;gap:8px">
              <button type="button" class="btn btn-sm" id="btn-ai-fill">Générer Fiche (${aiEngine})</button>
              <button type="button" class="btn btn-sm btn-primary" id="btn-ai-enhance">Améliorer avec IA (Enhance)</button>
            </div>
          </div>

          <div>
            <textarea name="description_fr" id="prod-desc-fr" rows="2" class="input" placeholder="Caractéristiques extraites ou description (cliquez sur Améliorer avec IA pour enrichir)...">${ep?.description_fr || ''}</textarea>
          </div>

          <!-- EXPANDABLE FULL DETAILS -->
          <div style="display:${expanded ? 'flex' : 'none'};flex-direction:column;gap:10px;padding:12px;border:1px solid var(--border);border-radius:10px;background:var(--panel-subtle)">
            <div style="font-weight:700;font-size:11.5px;color:var(--ink-700)">INFORMATIONS COMPLÉMENTAIRES & TARIFS AVANCÉS</div>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
              <div>
                <label class="field-label">Prix Gros (MAD)</label>
                <input name="wholesale_price" id="prod-wholesale-price" type="number" step="0.01" class="input mono" value="${ep?.wholesale_price ?? 0}" />
              </div>
              <div>
                <label class="field-label">Dernier Coût Achat</label>
                <input name="last_cost_price" type="number" step="0.01" class="input mono" value="${ep?.last_cost_price ?? 0}" />
              </div>
              <div>
                <label class="field-label">Garantie (Mois)</label>
                <input name="warranty_months" id="prod-warranty" type="number" class="input mono" value="${ep?.warranty_months ?? 12}" />
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              <div dir="rtl">
                <label class="field-label">الاسم بالعربية</label>
                <input name="name_ar" id="prod-name-ar" class="input" value="${ep?.name_ar || ''}" />
              </div>
              <div>
                <label class="field-label">English Name</label>
                <input name="name_en" id="prod-name-en" class="input" value="${ep?.name_en || ''}" />
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              <div dir="rtl">
                <label class="field-label">الوصف بالعربية</label>
                <textarea name="description_ar" id="prod-desc-ar" rows="2" class="input">${ep?.description_ar || ''}</textarea>
              </div>
              <div>
                <label class="field-label">English Description</label>
                <textarea name="description_en" id="prod-desc-en" rows="2" class="input">${ep?.description_en || ''}</textarea>
              </div>
            </div>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:4px">
            <button type="submit" class="btn btn-dark" style="padding:10px 20px">Enregistrer l'Article</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function syncProductFormDraftFromDom() {
  const form = document.getElementById('form-product-modal');
  if (!form) return;
  const fd = new FormData(form);
  const patch = Object.fromEntries(fd.entries());
  const base = state.editingProduct || state.prefillProduct || {};
  const merged = {
    ...base,
    ...patch,
    images: [...(state.productGalleryImages || [])],
    image_url: (state.productGalleryImages && state.productGalleryImages[0]) || '',
  };
  if (state.editingProduct) state.editingProduct = merged;
  else state.prefillProduct = merged;
}

window.openProductPicturesModal = async function (productId, autoSearchWeb = false) {
  const prod = state.products.find((p) => Number(p.id) === Number(productId));
  if (!prod) return;
  state.picturesModalProduct = prod;
  state.picturesModalImages = getProductImages(prod);
  state.picturesModalStudioMode = state.productStudioMode || 'clean_crop';
  state.picturesModalSearchQuery = [prod.brand, prod.model_number, prod.name_fr].filter(Boolean).join(' ').trim();
  state.picturesModalSearchResults = [];
  state.picturesModalBusy = false;
  render();
  if (autoSearchWeb && state.picturesModalSearchQuery) {
    state.picturesModalSearchLoading = true;
    render();
    try {
      const r = await fetch(`/api/products/image-search?q=${encodeURIComponent(state.picturesModalSearchQuery)}`);
      const d = await r.json();
      state.picturesModalSearchResults = d.results || [];
    } catch {}
    state.picturesModalSearchLoading = false;
    render();
  }
};

function renderProductPicturesModal() {
  const p = state.picturesModalProduct;
  if (!p) return '';
  const imgs = state.picturesModalImages || [];
  return `
    <div class="modal-backdrop">
      <div class="modal-box" style="max-width:820px">
        <div class="modal-header">
          <div>
            <div style="font-weight:700;font-size:14px;color:var(--ink-900)">Gestionnaire Photos Produit — ${getProdName(p)}</div>
            <div class="mono" style="font-size:11px;color:var(--ink-400)">${p.brand} • SKU: ${p.sku || p.barcode} • Photo #1 = Image Principale POS & WooCommerce</div>
          </div>
          <button type="button" class="btn btn-sm" id="btn-close-pictures-modal">Fermer</button>
        </div>
        <div class="modal-body" style="display:flex;flex-direction:column;gap:14px">
          <!-- Upload & Actions Toolbar -->
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:space-between;padding:10px 12px;background:var(--panel-subtle);border:1px solid var(--border);border-radius:10px">
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
              <label class="btn btn-sm btn-dark" style="cursor:pointer;margin:0">
                <input type="file" id="input-pics-modal-upload" accept="image/*" multiple style="display:none" />
                <span>+ Importer Photo(s) PC</span>
              </label>
              <select id="select-pics-modal-studio-mode" class="input" style="height:30px;font-size:11.5px;width:240px">
                <option value="clean_crop" ${state.picturesModalStudioMode === 'clean_crop' ? 'selected' : ''}>🖼️ Cadrage Studio Pro</option>
                <option value="white_cutout" ${state.picturesModalStudioMode === 'white_cutout' ? 'selected' : ''}>✂️ Détourage Fond Blanc Intelligent</option>
                <option value="ai_render" ${state.picturesModalStudioMode === 'ai_render' ? 'selected' : ''}>✨ Rendu Studio IA 3D</option>
                <option value="original_framed" ${state.picturesModalStudioMode === 'original_framed' ? 'selected' : ''}>📐 Format Carré 1000×1000</option>
              </select>
            </div>
            ${state.picturesModalBusy ? `<span class="tag tag-warn">Traitement en cours...</span>` : `<span class="tag tag-ok">${imgs.length} photo(s) dans la galerie</span>`}
          </div>

          <!-- Current Gallery Grid -->
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px">
            ${
              imgs.length === 0
                ? `<div style="grid-column:1 / -1;padding:24px;text-align:center;color:var(--ink-400);border:1px dashed var(--border);border-radius:8px">Aucune photo enregistrée pour cet article. Importez depuis votre PC ou sélectionnez une photo officielle ci-dessous.</div>`
                : imgs
                    .map(
                      (url, idx) => `
                  <div style="border:2px solid ${idx === 0 ? '#4f46e5' : 'var(--border)'};border-radius:10px;padding:8px;background:#fff;display:flex;flex-direction:column;gap:8px">
                    <div style="position:relative;height:110px;display:flex;align-items:center;justify-content:center;background:#fff">
                      <img src="${url}" style="max-width:100%;max-height:105px;object-fit:contain" />
                      <span style="position:absolute;top:0;left:0;background:${idx === 0 ? '#4f46e5' : '#64748b'};color:#fff;font-size:9.5px;font-weight:800;padding:1px 6px;border-radius:5px">${idx === 0 ? '★ Principale' : `#${idx + 1}`}</span>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:4px">
                      <button type="button" class="btn btn-sm btn-pics-left" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''} style="height:26px;padding:0;justify-content:center" title="Déplacer avant">◀</button>
                      <button type="button" class="btn btn-sm btn-pics-primary" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''} style="height:26px;padding:0;justify-content:center;color:#4f46e5" title="Définir Principale">★</button>
                      <button type="button" class="btn btn-sm btn-pics-right" data-idx="${idx}" ${idx === imgs.length - 1 ? 'disabled' : ''} style="height:26px;padding:0;justify-content:center" title="Déplacer après">▶</button>
                      <button type="button" class="btn btn-sm btn-pics-del" data-idx="${idx}" style="height:26px;padding:0;justify-content:center;color:#e21b1b" title="Supprimer">✕</button>
                    </div>
                    <button type="button" class="btn btn-sm btn-pics-studio-one" data-idx="${idx}" ${state.picturesModalBusy ? 'disabled' : ''} style="height:26px;font-size:11px;justify-content:center">
                      ✨ Studio sur celle-ci
                    </button>
                  </div>`
                    )
                    .join('')
            }
          </div>

          <!-- Official Web Studio Image Search -->
          <div style="padding:12px;border:1px solid #bfdbfe;background:#f8fafc;border-radius:10px;display:flex;flex-direction:column;gap:8px">
            <div style="font-weight:700;font-size:12px;color:#1d4ed8">Rechercher & Ajouter une Photo Officielle Constructeur (Web)</div>
            <div style="display:flex;gap:8px">
              <input id="input-pics-modal-web-q" class="input" style="flex:1" value="${state.picturesModalSearchQuery || ''}" placeholder="Marque + Modèle + Produit..." />
              <button type="button" class="btn btn-sm btn-dark" id="btn-pics-modal-web-search" ${state.picturesModalSearchLoading ? 'disabled' : ''}>
                ${state.picturesModalSearchLoading ? 'Recherche...' : 'Rechercher Web'}
              </button>
            </div>
            ${
              state.picturesModalSearchResults.length > 0
                ? `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px;max-height:195px;overflow-y:auto">
                    ${state.picturesModalSearchResults
                      .map(
                        (r, rIdx) => `
                      <div class="btn-pick-pics-web-img" data-ridx="${rIdx}" style="cursor:pointer;border:1px solid #cbd5e1;border-radius:8px;padding:5px;background:#fff;display:flex;flex-direction:column;align-items:center;gap:4px" title="Cliquer pour télécharger et ajouter">
                        <img src="${r.thumb || r.url}" style="width:88px;height:76px;object-fit:contain" />
                        <span style="font-size:10px;color:#1d4ed8;font-weight:700">+ Ajouter</span>
                      </div>`
                      )
                      .join('')}
                  </div>`
                : `<div style="font-size:11px;color:#64748b">${state.picturesModalSearchLoading ? 'Chargement des photos officielles...' : 'Cliquez sur "Rechercher Web" pour trouver les visuels studio officiels de ce modèle.'}</div>`
            }
          </div>

          <div style="display:flex;justify-content:flex-end;gap:8px;padding-top:4px;border-top:1px solid var(--border)">
            <button type="button" class="btn btn-dark" id="btn-save-pictures-modal" ${state.picturesModalBusy ? 'disabled' : ''}>Enregistrer la Galerie</button>
            <button type="button" class="btn btn-primary" id="btn-save-sync-pictures-modal" ${state.picturesModalBusy ? 'disabled' : ''}>Enregistrer & Sync WooCommerce</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderPrintableInvoiceModal() {
  const s = state.printableSale;
  if (!s) return '';
  const isThermal80 = state.printFormat === 'thermal';
  const isThermal58 = state.printFormat === 'thermal58';
  const isThermal = isThermal80 || isThermal58;

  return `
    <div class="modal-backdrop">
      <div class="modal-box" style="max-width:780px">
        <div class="modal-header" style="flex-wrap:wrap;gap:8px">
          <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
            <span style="font-weight:600;color:#09090b">Document — ${s.invoice_number}</span>
            <div class="segmented">
              <button type="button" class="seg-btn ${state.printFormat === 'a4' ? 'active' : ''}" id="btn-fmt-a4">Facture A4 + Garantie</button>
              <button type="button" class="seg-btn ${isThermal80 ? 'active' : ''}" id="btn-fmt-thermal">Ticket 80mm</button>
              <button type="button" class="seg-btn ${isThermal58 ? 'active' : ''}" id="btn-fmt-thermal58">Ticket 58mm</button>
            </div>
          </div>
          <div style="display:flex;gap:8px">
            <button type="button" class="btn btn-sm" id="btn-whatsapp-invoice" style="background:rgba(16,185,129,0.12);border-color:rgba(16,185,129,0.35);color:#047857">${ICONS.whatsapp}<span>WhatsApp</span></button>
            <button class="btn btn-sm btn-dark" id="btn-trigger-print">${ICONS.print} Imprimer</button>
            <button class="btn btn-sm" id="btn-close-print">Fermer</button>
          </div>
        </div>
        <div class="modal-body" style="background:#f4f4f5;display:flex;justify-content:center">
          <div id="printable-invoice" style="background:#fff;color:#09090b;padding:${isThermal58 ? '10px' : isThermal80 ? '16px' : '28px'};width:${isThermal58 ? '215px' : isThermal80 ? '310px' : '100%'};border:1px solid #e4e4e7">
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
  const copies = Math.max(1, Math.min(40, Number(state.barcodeLabelCopies || 1)));
  const fmt = state.barcodeLabelFormat || '50x30';
  const wPx = fmt === '40x20' ? 230 : 300;
  const stickerHtml = `
    <div class="label-sticker-item" style="width:${wPx}px;padding:${fmt === '40x20' ? '10px' : '16px'}">
      <div style="font-size:${fmt === '40x20' ? '9.5px' : '11px'};font-weight:700;text-transform:uppercase;color:#52525b">${p.brand} • ${p.model_number || p.sku}</div>
      <div style="font-size:${fmt === '40x20' ? '11.5px' : '13px'};font-weight:700;margin:3px 0 6px;color:#09090b">${getProdName(p)}</div>
      <div style="display:flex;justify-content:center;margin:4px 0">
        ${renderLinearBarcodeSvg(p.barcode)}
      </div>
      <div class="mono" style="font-size:${fmt === '40x20' ? '10px' : '11.5px'};letter-spacing:2px;font-weight:600">${p.barcode}</div>
      <div class="num" style="font-size:${fmt === '40x20' ? '16px' : '20px'};font-weight:800;margin-top:6px;border-top:1px solid #e4e4e7;padding-top:5px">
        ${fmtMoney(p.retail_price)}
      </div>
    </div>
  `;
  return `
    <div class="modal-backdrop">
      <div class="modal-box" style="max-width:680px">
        <div class="modal-header" style="flex-wrap:wrap;gap:8px">
          <span style="font-weight:700;color:#09090b">Étiquettes Code-Barres & Prix</span>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <select id="select-label-format" class="input" style="height:28px;width:130px;font-size:11px">
              <option value="50x30" ${fmt === '50x30' ? 'selected' : ''}>Standard 50×30mm</option>
              <option value="40x20" ${fmt === '40x20' ? 'selected' : ''}>Compact 40×20mm</option>
            </select>
            <select id="select-label-copies" class="input mono" style="height:28px;width:95px;font-size:11px">
              ${[1, 2, 4, 6, 10, 20].map((c) => `<option value="${c}" ${copies === c ? 'selected' : ''}>${c} copie${c > 1 ? 's' : ''}</option>`).join('')}
            </select>
            <button type="button" class="btn btn-sm" id="btn-label-gen-ean" title="Générer et sauvegarder un code EAN-13 interne">${ICONS.barcode}<span>Nouv. EAN-13</span></button>
            <button class="btn btn-sm btn-dark" onclick="window.print()">${ICONS.print} Imprimer (${copies})</button>
            <button class="btn btn-sm" id="btn-close-label">Fermer</button>
          </div>
        </div>
        <div class="modal-body" style="background:#f4f4f5;display:flex;justify-content:center">
          <div id="printable-invoice" class="label-sticker-grid" style="background:transparent;padding:8px">
            ${Array.from({ length: copies }).map(() => stickerHtml).join('')}
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
              <button type="button" class="btn btn-sm" id="btn-whatsapp-quote-modal" style="background:rgba(16,185,129,0.12);border-color:rgba(16,185,129,0.35);color:#047857">${ICONS.whatsapp}<span>WhatsApp</span></button>
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
  if (state.printableSav) {
    const j = state.printableSav;
    return `
      <div class="modal-backdrop">
        <div class="modal-box" style="max-width:560px">
          <div class="modal-header">
            <span style="font-weight:700">Reçu de Dépôt Atelier SAV — ${j.ticket_number}</span>
            <div class="action-group">
              <button type="button" class="btn btn-sm btn-dark" id="btn-print-sav-now">${ICONS.print} Imprimer Reçu</button>
              <button type="button" class="btn btn-sm" id="btn-close-sav-print">Fermer</button>
            </div>
          </div>
          <div class="modal-body" style="background:#f4f4f5;display:flex;justify-content:center">
            <div id="printable-invoice" style="background:#fff;color:#09090b;padding:22px;border:1px solid #e4e4e7;width:100%">
              <div style="display:flex;justify-content:space-between;border-bottom:2px solid #203361;padding-bottom:10px">
                <div>
                  <h2 style="font-size:16px;font-weight:800">${state.settings.store_name} — SAV</h2>
                  <div style="font-size:10.5px;color:#52525b">${state.settings.store_address} • Tél: ${state.settings.store_phone}</div>
                </div>
                <div style="text-align:right">
                  <div style="font-weight:800;color:#203361">BON DE DÉPÔT SAV</div>
                  <div class="mono" style="font-weight:700">${j.ticket_number}</div>
                  <div class="mono" style="font-size:10.5px">${String(j.created_at || '').slice(0, 16)}</div>
                </div>
              </div>
              <div style="margin:12px 0;padding:10px;background:#fafafa;border:1px solid #e4e4e7;font-size:12px;line-height:1.5">
                <div><strong>Client :</strong> ${j.customer_name} ${j.customer_phone ? `• Tél: ${j.customer_phone}` : ''}</div>
                <div><strong>Appareil :</strong> ${j.device_name} ${j.serial_number ? `• S/N: <span class="mono">${j.serial_number}</span>` : ''}</div>
                ${j.invoice_number ? `<div><strong>Facture d'achat :</strong> <span class="mono">${j.invoice_number}</span> (${j.under_warranty ? 'SOUS GARANTIE' : 'Hors garantie'})</div>` : ''}
                ${j.accessories_received ? `<div><strong>Accessoires remis :</strong> ${j.accessories_received}</div>` : ''}
                <div><strong>Panne signalée :</strong> ${j.issue_description || 'Diagnostic en cours'}</div>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:12.5px;padding:8px 0;border-top:1px dashed #d4d4d8">
                <span>Estimation / Total : <strong>${fmtMoney(j.total_price)}</strong></span>
                <span>Avance payée : <strong>${fmtMoney(j.paid_amount)}</strong></span>
              </div>
              <div style="margin-top:26px;display:flex;justify-content:space-between;font-size:11px;color:#52525b">
                <span>Signature Client</span>
                <span>Cachet Atelier ${state.settings.store_name}</span>
              </div>
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
  const btnOpenScannerTop = document.getElementById('btn-open-scanner-top');
  if (btnOpenScannerTop) btnOpenScannerTop.onclick = () => openBarcodeInspector('');

  const btnCashTopbar = document.getElementById('btn-cash-topbar');
  if (btnCashTopbar) {
    btnCashTopbar.onclick = () => {
      state.cashModalMode = state.cashSession?.openSession ? 'close' : 'open';
      render();
    };
  }

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
      openProductModalWith(null, false);
      render();
    };
  }

  const runWooBatchSync = async () => {
    showToast('Synchronisation WooCommerce en cours...');
    const res = await fetch('/api/woocommerce/sync', { method: 'POST' });
    const d = await res.json().catch(() => ({}));
    state.wooSyncReport = d;
    await loadAllData();
    if (res.ok && d.success) {
      showToast(`Synchronisation WooCommerce réussie (${d.syncedCount} article(s))`);
    } else if (res.ok) {
      showToast(`WooCommerce : ${d.syncedCount} OK, ${d.failedCount} échec(s)`);
    } else {
      showToast(d.error || 'Échec synchronisation WooCommerce');
    }
  };

  const btnSyncWoo = document.getElementById('btn-sync-woo');
  if (btnSyncWoo) btnSyncWoo.onclick = runWooBatchSync;
  const btnSyncWooPanel = document.getElementById('btn-sync-woo-panel');
  if (btnSyncWooPanel) btnSyncWooPanel.onclick = runWooBatchSync;

  const btnTestWoo = document.getElementById('btn-test-woo');
  if (btnTestWoo) {
    btnTestWoo.onclick = async () => {
      const form = document.getElementById('form-save-woo-settings') || document.getElementById('form-save-settings');
      const fd = form ? new FormData(form) : null;
      const body = fd ? Object.fromEntries(fd.entries()) : {};
      state.wooTestLoading = true;
      render();
      try {
        const res = await fetch('/api/woocommerce/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        state.wooTestStatus = data;
      } catch (err) {
        state.wooTestStatus = { success: false, wc_connected: false, error: err.message };
      }
      state.wooTestLoading = false;
      render();
    };
  }

  document.querySelectorAll('[data-psub]').forEach((b) => {
    b.onclick = () => {
      state.productsSubTab = b.getAttribute('data-psub') || 'list';
      render();
    };
  });
  document.querySelectorAll('[data-prod-filter]').forEach((b) => {
    b.onclick = () => {
      state.productsFilterMode = b.getAttribute('data-prod-filter') || 'all';
      render();
    };
  });
  document.querySelectorAll('[data-csub]').forEach((b) => {
    b.onclick = () => {
      state.connectSubTab = b.getAttribute('data-csub') || 'woo';
      render();
    };
  });

  const formWooSettings = document.getElementById('form-save-woo-settings');
  if (formWooSettings) {
    formWooSettings.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(formWooSettings);
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      await loadAllData();
      showToast('Paramètres WooCommerce sauvegardés');
    };
  }

  document.querySelectorAll('[data-woo-filter]').forEach((b) => {
    b.onclick = () => {
      state.wooSyncFilter = b.getAttribute('data-woo-filter') || 'all';
      render();
    };
  });

  const inpWooSearch = document.getElementById('input-woo-sync-search');
  if (inpWooSearch) {
    inpWooSearch.oninput = (e) => {
      state.wooSyncSearch = e.target.value;
      render();
      const el = document.getElementById('input-woo-sync-search');
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    };
  }

  document.querySelectorAll('.btn-sync-single-woo').forEach((btn) => {
    btn.onclick = async () => {
      const id = Number(btn.getAttribute('data-id'));
      showToast(`Synchronisation article #${id} vers WooCommerce...`);
      const res = await fetch(`/api/woocommerce/sync-single/${id}`, { method: 'POST' });
      const d = await res.json().catch(() => ({}));
      await loadAllData();
      if (res.ok && d.success) {
        showToast(`Article synchronisé (Woo #${d.wooId})`);
      } else {
        showToast(d.error || 'Échec sync WooCommerce');
      }
    };
  });

  document.querySelectorAll('.btn-open-pictures').forEach((btn) => {
    btn.onclick = () => {
      const id = Number(btn.getAttribute('data-id'));
      const autoWeb = btn.getAttribute('data-web') === '1';
      window.openProductPicturesModal(id, autoWeb);
    };
  });

  const btnClosePicsModal = document.getElementById('btn-close-pictures-modal');
  if (btnClosePicsModal) {
    btnClosePicsModal.onclick = () => {
      state.picturesModalProduct = null;
      state.picturesModalSearchResults = [];
      render();
    };
  }

  const selPicsStudioMode = document.getElementById('select-pics-modal-studio-mode');
  if (selPicsStudioMode) {
    selPicsStudioMode.onchange = (e) => {
      state.picturesModalStudioMode = e.target.value;
    };
  }

  const inpPicsUpload = document.getElementById('input-pics-modal-upload');
  if (inpPicsUpload) {
    inpPicsUpload.onchange = async (e) => {
      const files = Array.from(e.target.files || []).slice(0, 6);
      if (!files.length) return;
      state.picturesModalBusy = true;
      render();
      for (const file of files) {
        try {
          const b64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.readAsDataURL(file);
          });
          const upRes = await fetch('/api/products/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: b64, mimeType: file.type || 'image/jpeg' }),
          });
          if (upRes.ok) {
            const d = await upRes.json();
            if (d.image_url && !state.picturesModalImages.includes(d.image_url)) {
              state.picturesModalImages.push(d.image_url);
            }
          }
        } catch {}
      }
      state.picturesModalBusy = false;
      render();
    };
  }

  document.querySelectorAll('.btn-pics-left').forEach((b) => {
    b.onclick = () => {
      const i = Number(b.getAttribute('data-idx'));
      if (i > 0) {
        const arr = [...state.picturesModalImages];
        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
        state.picturesModalImages = arr;
        render();
      }
    };
  });
  document.querySelectorAll('.btn-pics-right').forEach((b) => {
    b.onclick = () => {
      const i = Number(b.getAttribute('data-idx'));
      if (i < state.picturesModalImages.length - 1) {
        const arr = [...state.picturesModalImages];
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        state.picturesModalImages = arr;
        render();
      }
    };
  });
  document.querySelectorAll('.btn-pics-primary').forEach((b) => {
    b.onclick = () => {
      const i = Number(b.getAttribute('data-idx'));
      const url = state.picturesModalImages[i];
      if (url) {
        state.picturesModalImages = [url, ...state.picturesModalImages.filter((_, idx) => idx !== i)];
        render();
      }
    };
  });
  document.querySelectorAll('.btn-pics-del').forEach((b) => {
    b.onclick = () => {
      const i = Number(b.getAttribute('data-idx'));
      state.picturesModalImages = state.picturesModalImages.filter((_, idx) => idx !== i);
      render();
    };
  });
  document.querySelectorAll('.btn-pics-studio-one').forEach((b) => {
    b.onclick = async () => {
      const i = Number(b.getAttribute('data-idx'));
      const url = state.picturesModalImages[i];
      if (!url) return;
      state.picturesModalBusy = true;
      render();
      try {
        const p = state.picturesModalProduct;
        const r = await fetch('/api/ai/generate-pro-product-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_url: url,
            product_name: p?.name_fr || '',
            brand: p?.brand || '',
            mode: state.picturesModalStudioMode || 'clean_crop',
          }),
        });
        const d = await r.json();
        if (r.ok && d.image_url) {
          state.picturesModalImages[i] = d.image_url;
          showToast('Photo Studio générée !');
        } else {
          showToast(d.error || 'Échec Studio Photo');
        }
      } catch (err) {
        showToast(`Erreur: ${err.message}`);
      }
      state.picturesModalBusy = false;
      render();
    };
  });

  const inpPicsWebQ = document.getElementById('input-pics-modal-web-q');
  if (inpPicsWebQ) {
    inpPicsWebQ.oninput = (e) => {
      state.picturesModalSearchQuery = e.target.value;
    };
    inpPicsWebQ.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('btn-pics-modal-web-search')?.click();
      }
    };
  }

  const btnPicsWebSearch = document.getElementById('btn-pics-modal-web-search');
  if (btnPicsWebSearch) {
    btnPicsWebSearch.onclick = async () => {
      const q = (document.getElementById('input-pics-modal-web-q')?.value || state.picturesModalSearchQuery || '').trim();
      if (!q) return;
      state.picturesModalSearchQuery = q;
      state.picturesModalSearchLoading = true;
      render();
      try {
        const r = await fetch(`/api/products/image-search?q=${encodeURIComponent(q)}`);
        const d = await r.json();
        state.picturesModalSearchResults = d.results || [];
      } catch {
        state.picturesModalSearchResults = [];
      }
      state.picturesModalSearchLoading = false;
      render();
    };
  }

  document.querySelectorAll('.btn-pick-pics-web-img').forEach((card) => {
    card.onclick = async () => {
      const idx = Number(card.getAttribute('data-ridx'));
      const item = state.picturesModalSearchResults[idx];
      if (!item) return;
      state.picturesModalBusy = true;
      render();
      try {
        const r = await fetch('/api/products/download-web-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: item.url, thumb: item.thumb }),
        });
        const d = await r.json();
        if (r.ok && d.image_url) {
          state.picturesModalImages.push(d.image_url);
          showToast('Photo officielle ajoutée à la galerie !');
        } else {
          showToast(d.error || 'Téléchargement impossible');
        }
      } catch (err) {
        showToast(`Erreur: ${err.message}`);
      }
      state.picturesModalBusy = false;
      render();
    };
  });

  const savePicturesGallery = async (alsoSyncWoo = false) => {
    const p = state.picturesModalProduct;
    if (!p) return;
    state.picturesModalBusy = true;
    render();
    try {
      const r = await fetch(`/api/products/${p.id}/images`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: state.picturesModalImages }),
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        state.picturesModalBusy = false;
        render();
        showToast(err.error || 'Erreur sauvegarde galerie');
        return;
      }
      if (alsoSyncWoo) {
        const sr = await fetch(`/api/woocommerce/sync-single/${p.id}`, { method: 'POST' });
        const sd = await sr.json().catch(() => ({}));
        state.picturesModalProduct = null;
        state.picturesModalBusy = false;
        await loadAllData();
        showToast(sr.ok && sd.success ? `Galerie enregistrée & synchronisée sur WooCommerce (#${sd.wooId}) !` : `Galerie enregistrée (Sync Woo: ${sd.error || 'échec'})`);
        return;
      }
      state.picturesModalProduct = null;
      state.picturesModalBusy = false;
      await loadAllData();
      showToast('Galerie photos enregistrée');
    } catch (err) {
      state.picturesModalBusy = false;
      render();
      showToast(`Erreur: ${err.message}`);
    }
  };
  const btnSavePics = document.getElementById('btn-save-pictures-modal');
  if (btnSavePics) btnSavePics.onclick = () => savePicturesGallery(false);
  const btnSaveSyncPics = document.getElementById('btn-save-sync-pictures-modal');
  if (btnSaveSyncPics) btnSaveSyncPics.onclick = () => savePicturesGallery(true);

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
  const selLabelFmt = document.getElementById('select-label-format');
  if (selLabelFmt) {
    selLabelFmt.onchange = (e) => {
      state.barcodeLabelFormat = e.target.value;
      render();
    };
  }
  const selLabelCopies = document.getElementById('select-label-copies');
  if (selLabelCopies) {
    selLabelCopies.onchange = (e) => {
      state.barcodeLabelCopies = Number(e.target.value) || 1;
      render();
    };
  }
  const btnLabelGenEan = document.getElementById('btn-label-gen-ean');
  if (btnLabelGenEan) {
    btnLabelGenEan.onclick = async () => {
      const p = state.barcodeLabelProduct;
      if (!p) return;
      const newEan = generateInternalEan13();
      const res = await fetch(`/api/products/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode: newEan }),
      });
      if (res.ok) {
        const updated = await res.json();
        state.barcodeLabelProduct = updated;
        await loadAllData();
        showToast(`Nouveau code EAN-13 assigné : ${newEan}`);
      }
    };
  }

  document.querySelectorAll('.btn-edit-prod').forEach((btn) => {
    btn.onclick = () => {
      const id = Number(btn.getAttribute('data-id'));
      const prod = state.products.find((p) => p.id === id) || null;
      openProductModalWith(prod, true);
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

  const btnToggleProdExpand = document.getElementById('btn-toggle-prod-expand');
  if (btnToggleProdExpand) {
    btnToggleProdExpand.onclick = () => {
      syncProductFormDraftFromDom();
      state.productModalExpanded = !state.productModalExpanded;
      render();
    };
  }

  const selModalStudioMode = document.getElementById('select-modal-studio-mode');
  if (selModalStudioMode) {
    selModalStudioMode.onchange = (e) => {
      state.productStudioMode = e.target.value;
    };
  }

  const inpAddGallery = document.getElementById('input-prod-add-gallery');
  if (inpAddGallery) {
    inpAddGallery.onchange = async (e) => {
      const files = Array.from(e.target.files || []).slice(0, 6);
      if (!files.length) return;
      syncProductFormDraftFromDom();
      state.productProPhotoLoading = true;
      render();
      for (const file of files) {
        try {
          const b64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.readAsDataURL(file);
          });
          const upRes = await fetch('/api/products/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: b64, mimeType: file.type || 'image/jpeg' }),
          });
          if (upRes.ok) {
            const d = await upRes.json();
            if (d.image_url && !state.productGalleryImages.includes(d.image_url)) {
              state.productGalleryImages.push(d.image_url);
            }
          }
        } catch {}
      }
      state.productProPhotoLoading = false;
      render();
    };
  }

  document.querySelectorAll('.btn-modal-img-left').forEach((b) => {
    b.onclick = () => {
      syncProductFormDraftFromDom();
      const i = Number(b.getAttribute('data-idx'));
      if (i > 0) {
        const arr = [...state.productGalleryImages];
        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
        state.productGalleryImages = arr;
        render();
      }
    };
  });
  document.querySelectorAll('.btn-modal-img-right').forEach((b) => {
    b.onclick = () => {
      syncProductFormDraftFromDom();
      const i = Number(b.getAttribute('data-idx'));
      if (i < state.productGalleryImages.length - 1) {
        const arr = [...state.productGalleryImages];
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        state.productGalleryImages = arr;
        render();
      }
    };
  });
  document.querySelectorAll('.btn-modal-img-primary').forEach((b) => {
    b.onclick = () => {
      syncProductFormDraftFromDom();
      const i = Number(b.getAttribute('data-idx'));
      const url = state.productGalleryImages[i];
      if (url) {
        state.productGalleryImages = [url, ...state.productGalleryImages.filter((_, idx) => idx !== i)];
        render();
      }
    };
  });
  document.querySelectorAll('.btn-modal-img-del').forEach((b) => {
    b.onclick = () => {
      syncProductFormDraftFromDom();
      const i = Number(b.getAttribute('data-idx'));
      state.productGalleryImages = state.productGalleryImages.filter((_, idx) => idx !== i);
      render();
    };
  });

  const btnToggleModalWebImg = document.getElementById('btn-toggle-modal-web-img');
  if (btnToggleModalWebImg) {
    btnToggleModalWebImg.onclick = async () => {
      syncProductFormDraftFromDom();
      state.webImageSearchOpen = !state.webImageSearchOpen;
      if (state.webImageSearchOpen) {
        const qGuess = [
          document.getElementById('prod-brand')?.value || '',
          document.getElementById('prod-model')?.value || '',
          document.getElementById('prod-name-fr')?.value || '',
        ]
          .filter(Boolean)
          .join(' ')
          .trim();
        if (qGuess) state.webImageSearchQuery = qGuess;
        if (state.webImageSearchQuery && state.webImageSearchResults.length === 0) {
          state.webImageSearchLoading = true;
          render();
          try {
            const r = await fetch(`/api/products/image-search?q=${encodeURIComponent(state.webImageSearchQuery)}`);
            const d = await r.json();
            state.webImageSearchResults = d.results || [];
          } catch {}
          state.webImageSearchLoading = false;
        }
      }
      render();
    };
  }

  const inpModalWebQ = document.getElementById('input-modal-web-img-q');
  if (inpModalWebQ) {
    inpModalWebQ.oninput = (e) => {
      state.webImageSearchQuery = e.target.value;
    };
    inpModalWebQ.onkeydown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('btn-run-modal-web-img')?.click();
      }
    };
  }

  const btnRunModalWebImg = document.getElementById('btn-run-modal-web-img');
  if (btnRunModalWebImg) {
    btnRunModalWebImg.onclick = async () => {
      syncProductFormDraftFromDom();
      const q = (document.getElementById('input-modal-web-img-q')?.value || state.webImageSearchQuery || '').trim();
      if (!q) return;
      state.webImageSearchQuery = q;
      state.webImageSearchLoading = true;
      render();
      try {
        const r = await fetch(`/api/products/image-search?q=${encodeURIComponent(q)}`);
        const d = await r.json();
        state.webImageSearchResults = d.results || [];
      } catch {
        state.webImageSearchResults = [];
      }
      state.webImageSearchLoading = false;
      render();
    };
  }

  document.querySelectorAll('.btn-pick-modal-web-img').forEach((card) => {
    card.onclick = async () => {
      syncProductFormDraftFromDom();
      const idx = Number(card.getAttribute('data-ridx'));
      const item = state.webImageSearchResults[idx];
      if (!item) return;
      state.productProPhotoLoading = true;
      render();
      try {
        const r = await fetch('/api/products/download-web-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: item.url, thumb: item.thumb }),
        });
        const d = await r.json();
        if (r.ok && d.image_url) {
          if (!state.productGalleryImages.includes(d.image_url)) {
            state.productGalleryImages.unshift(d.image_url);
          }
          state.internetLookupBanner = { ok: true, msg: 'Photo officielle téléchargée et ajoutée comme #1 Principale !' };
        } else {
          showToast(d.error || 'Téléchargement impossible');
        }
      } catch (err) {
        showToast(`Erreur: ${err.message}`);
      }
      state.productProPhotoLoading = false;
      render();
    };
  });

  const inpProdPhotosAi = document.getElementById('input-prod-photos-ai');
  if (inpProdPhotosAi) {
    inpProdPhotosAi.onchange = async (e) => {
      const files = Array.from(e.target.files || []).slice(0, 4);
      if (files.length === 0) return;
      syncProductFormDraftFromDom();
      state.productPhotoAiLoading = true;
      render();
      try {
        const readAsB64 = (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve({ imageBase64: String(reader.result || ''), mimeType: file.type || 'image/jpeg' });
            reader.readAsDataURL(file);
          });
        const images = await Promise.all(files.map(readAsB64));
        state.productBoxImages = images;
        let uploadedImageUrl = state.productGalleryImages[0] || '';
        const proPromise = fetch('/api/ai/generate-pro-product-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            images,
            product_name: document.getElementById('prod-name-fr')?.value || '',
            brand: document.getElementById('prod-brand')?.value || '',
            mode: state.productStudioMode || 'clean_crop',
          }),
        })
          .then((r) => r.json())
          .catch(() => null);

        const exRes = await fetch('/api/ai/extract-product-from-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ images }),
        });
        const exData = await exRes.json();
        const proData = await proPromise;
        if (proData?.success && proData.image_url) {
          uploadedImageUrl = proData.image_url;
        } else {
          try {
            const upRes = await fetch('/api/products/upload-image', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(images[0]),
            });
            if (upRes.ok) {
              const upData = await upRes.json();
              if (upData.image_url) uploadedImageUrl = upData.image_url;
            }
          } catch {}
        }
        if (uploadedImageUrl && !state.productGalleryImages.includes(uploadedImageUrl)) {
          state.productGalleryImages.unshift(uploadedImageUrl);
        }
        state.productPhotoAiLoading = false;
        if (exRes.ok && exData.success) {
          const targetObj = state.editingProduct || state.prefillProduct || {};
          const updated = {
            ...targetObj,
            barcode: exData.barcode || targetObj.barcode || document.getElementById('prod-barcode')?.value || '',
            brand: exData.brand || targetObj.brand || '',
            model_number: exData.model_number || targetObj.model_number || '',
            category: exData.category || targetObj.category || 'Petit Électroménager',
            name_fr: exData.name_fr || targetObj.name_fr || '',
            name_ar: exData.name_ar || targetObj.name_ar || '',
            name_en: exData.name_en || targetObj.name_en || '',
            description_fr: exData.description_fr || exData.specs_text || targetObj.description_fr || '',
            description_ar: exData.description_ar || targetObj.description_ar || '',
            description_en: exData.description_en || targetObj.description_en || '',
            warranty_months: exData.warranty_months || targetObj.warranty_months || 12,
            image_url: state.productGalleryImages[0] || uploadedImageUrl,
            images: [...state.productGalleryImages],
          };
          if (state.editingProduct) state.editingProduct = updated;
          else state.prefillProduct = updated;
          state.webImageSearchQuery = [updated.brand, updated.model_number, updated.name_fr].filter(Boolean).join(' ').trim();
          state.internetLookupBanner = {
            ok: true,
            msg: `Extraction Vision (${String(exData.source || 'AI').toUpperCase()}) réussie depuis ${images.length} photo(s) !`,
          };
        } else {
          state.internetLookupBanner = {
            ok: false,
            msg: `Photo enregistrée. Note IA : ${exData.error || 'complétez manuellement.'}`,
          };
        }
      } catch (err) {
        state.productPhotoAiLoading = false;
        state.internetLookupBanner = { ok: false, msg: `Erreur analyse photo : ${err.message}` };
      }
      render();
    };
  }

  const btnGenProPhoto = document.getElementById('btn-gen-pro-photo');
  if (btnGenProPhoto) {
    btnGenProPhoto.onclick = async () => {
      syncProductFormDraftFromDom();
      const currentImgUrl = state.productGalleryImages[0] || document.getElementById('prod-image-url')?.value || '';
      if (state.productBoxImages.length === 0 && !currentImgUrl) {
        document.getElementById('input-prod-photos-ai')?.click();
        return;
      }
      state.productProPhotoLoading = true;
      render();
      try {
        const res = await fetch('/api/ai/generate-pro-product-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            images: state.productBoxImages,
            image_url: currentImgUrl,
            product_name: document.getElementById('prod-name-fr')?.value || '',
            brand: document.getElementById('prod-brand')?.value || '',
            mode: state.productStudioMode || 'clean_crop',
          }),
        });
        const data = await res.json();
        state.productProPhotoLoading = false;
        if (res.ok && data.image_url) {
          state.productGalleryImages = [data.image_url, ...state.productGalleryImages.filter((u) => u !== data.image_url)];
          state.internetLookupBanner = {
            ok: true,
            msg: `Photo Studio créée (${data.method || state.productStudioMode}) et définie comme #1 Principale !`,
          };
        } else {
          state.internetLookupBanner = { ok: false, msg: data.error || 'Échec création photo studio.' };
        }
      } catch (err) {
        state.productProPhotoLoading = false;
        state.internetLookupBanner = { ok: false, msg: `Erreur photo pro : ${err.message}` };
      }
      render();
    };
  }

  const btnCloseProdModal = document.getElementById('btn-close-prod-modal');
  if (btnCloseProdModal) {
    btnCloseProdModal.onclick = () => {
      if (window.__ezProdCamStream) {
        window.__ezProdCamStream.getTracks().forEach((tr) => tr.stop());
        window.__ezProdCamStream = null;
      }
      state.cameraScanActive = false;
      state.productModalOpen = false;
      state.productModalExpanded = false;
      state.productBoxImages = [];
      state.productGalleryImages = [];
      state.webImageSearchOpen = false;
      state.webImageSearchResults = [];
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
          state.productGalleryImages = getProductImages(data.product);
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
            image_url: data.image_url || '',
          };
          if (data.image_url && !state.productGalleryImages.includes(data.image_url)) {
            state.productGalleryImages.unshift(data.image_url);
          }
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
      openProductModalWith({ barcode: '' }, false);
      state.internetLookupBanner = { ok: true, msg: 'Scannez le code-barres (douchette ou caméra) puis Entrée pour rechercher automatiquement sur Internet.' };
      render();
      setTimeout(() => document.getElementById('prod-barcode')?.focus(), 50);
    };
  }

  const btnInspInternetCreate = document.getElementById('btn-inspector-internet-create');
  if (btnInspInternetCreate) {
    btnInspInternetCreate.onclick = async () => {
      const code = btnInspInternetCreate.getAttribute('data-code') || '';
      state.inspectorOpen = false;
      openProductModalWith({ barcode: code }, false);
      render();
      await runInternetLookupInModal(code);
    };
  }

  const btnInspManualCreate = document.getElementById('btn-inspector-manual-create');
  if (btnInspManualCreate) {
    btnInspManualCreate.onclick = () => {
      const code = btnInspManualCreate.getAttribute('data-code') || '';
      state.inspectorOpen = false;
      openProductModalWith({ barcode: code }, false);
      state.internetLookupBanner = { ok: false, msg: 'Mode saisie manuelle — complétez les informations du produit.' };
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
        if (document.getElementById('prod-name-ar')) document.getElementById('prod-name-ar').value = ai.name_ar || '';
        if (document.getElementById('prod-name-en')) document.getElementById('prod-name-en').value = ai.name_en || '';
        document.getElementById('prod-desc-fr').value = ai.description_fr || '';
        if (document.getElementById('prod-desc-ar')) document.getElementById('prod-desc-ar').value = ai.description_ar || '';
        if (document.getElementById('prod-desc-en')) document.getElementById('prod-desc-en').value = ai.description_en || '';
        showToast(`Fiches générées (${String(ai.source || 'template').toUpperCase()})`);
      }
    };
  }

  const btnAiEnhance = document.getElementById('btn-ai-enhance');
  if (btnAiEnhance) {
    btnAiEnhance.onclick = async () => {
      const origText = btnAiEnhance.textContent;
      btnAiEnhance.textContent = 'Amélioration IA...';
      btnAiEnhance.disabled = true;
      try {
        const res = await fetch('/api/ai/enhance-product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name_fr: document.getElementById('prod-name-fr')?.value || '',
            name_ar: document.getElementById('prod-name-ar')?.value || '',
            brand: document.getElementById('prod-brand')?.value || '',
            model_number: document.getElementById('prod-model')?.value || '',
            category: document.getElementById('prod-category')?.value || '',
            description_fr: document.getElementById('prod-desc-fr')?.value || '',
            specs_text: document.getElementById('prod-desc-fr')?.value || '',
          }),
        });
        const ai = await res.json();
        if (res.ok && ai.success) {
          if (ai.brand) document.getElementById('prod-brand').value = ai.brand;
          if (ai.model_number) document.getElementById('prod-model').value = ai.model_number;
          if (ai.category) document.getElementById('prod-category').value = ai.category;
          if (ai.name_fr) document.getElementById('prod-name-fr').value = ai.name_fr;
          if (ai.name_ar && document.getElementById('prod-name-ar')) document.getElementById('prod-name-ar').value = ai.name_ar;
          if (ai.name_en && document.getElementById('prod-name-en')) document.getElementById('prod-name-en').value = ai.name_en;
          document.getElementById('prod-desc-fr').value = ai.description_fr || ai.specs_text || '';
          if (ai.description_ar && document.getElementById('prod-desc-ar')) document.getElementById('prod-desc-ar').value = ai.description_ar;
          if (ai.description_en && document.getElementById('prod-desc-en')) document.getElementById('prod-desc-en').value = ai.description_en;
          showToast(`Descriptions & caractéristiques améliorées par ${String(ai.source || 'IA').toUpperCase()} !`);
        } else {
          showToast(ai.error || 'Impossible d’améliorer via IA');
        }
      } catch (err) {
        showToast('Erreur réseau IA');
      } finally {
        btnAiEnhance.textContent = origText;
        btnAiEnhance.disabled = false;
      }
    };
  }

  const formProdModal = document.getElementById('form-product-modal');
  if (formProdModal) {
    formProdModal.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(formProdModal);
      const payload = Object.fromEntries(fd.entries());
      payload.images = [...(state.productGalleryImages || [])];
      payload.image_url = payload.images[0] || '';
      if (!Number(payload.wholesale_price)) {
        payload.wholesale_price = payload.retail_price;
      }
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
        state.productModalExpanded = false;
        state.productGalleryImages = [];
        state.webImageSearchOpen = false;
        state.webImageSearchResults = [];
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

  document.querySelectorAll('.btn-whatsapp-sale').forEach((btn) => {
    btn.onclick = () => {
      const id = Number(btn.getAttribute('data-sale-id'));
      const sale = state.sales.find((s) => s.id === id);
      if (!sale) return;
      sendWhatsAppMessage(sale.customer_phone || '', buildSaleWhatsAppMessage(sale), sale.customer_name);
    };
  });

  const btnWaInvoice = document.getElementById('btn-whatsapp-invoice');
  if (btnWaInvoice) {
    btnWaInvoice.onclick = () => {
      const sale = state.printableSale;
      if (!sale) return;
      const cust = state.customers.find((c) => Number(c.id) === Number(sale.customer_id));
      sendWhatsAppMessage(sale.customer_phone || cust?.phone || '', buildSaleWhatsAppMessage(sale), sale.customer_name);
    };
  }

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

  const btnFmtThermal58 = document.getElementById('btn-fmt-thermal58');
  if (btnFmtThermal58) {
    btnFmtThermal58.onclick = () => {
      state.printFormat = 'thermal58';
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

  document.querySelectorAll('.btn-auto-margin-item').forEach((btn) => {
    btn.onclick = () => {
      const idx = Number(btn.getAttribute('data-idx'));
      const it = state.purchaseItems[idx];
      if (!it) return;
      const cost = Number(it.unit_cost || 0);
      it.new_wholesale_price = Math.round(cost * 1.12);
      it.new_retail_price = Math.round(cost * 1.25);
      render();
      showToast('Tarifs Détail (+25%) & Gros (+12%) recalculés');
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

  // Sales History filters
  const inpSalesSearch = document.getElementById('input-sales-search');
  if (inpSalesSearch) {
    inpSalesSearch.oninput = (e) => {
      state.salesSearch = e.target.value;
      render();
      const el = document.getElementById('input-sales-search');
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    };
  }
  const selSalesStatus = document.getElementById('select-sales-status');
  if (selSalesStatus) {
    selSalesStatus.onchange = (e) => {
      state.salesStatusFilter = e.target.value;
      render();
    };
  }
  const selSalesPay = document.getElementById('select-sales-pay');
  if (selSalesPay) {
    selSalesPay.onchange = (e) => {
      state.salesPayFilter = e.target.value;
      render();
    };
  }

  // AI Provider Invoice Scanner handlers
  async function runInvoiceAiScan({ imageBase64 = '', mimeType = 'image/jpeg', rawText = '' }) {
    state.invoiceScanLoading = true;
    state.invoiceScanMessage = 'Analyse de la facture par IA en cours...';
    render();
    try {
      const res = await fetch('/api/ai/scan-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mimeType, rawText }),
      });
      const data = await res.json();
      state.invoiceScanLoading = false;
      if (!res.ok || !data.success) {
        state.invoiceScanMessage = `Erreur : ${data.error || 'Échec extraction'}`;
        render();
        return;
      }
      if (data.matched_supplier_id) {
        state.purchaseSupplierId = data.matched_supplier_id;
        state.purchaseNewProviderName = '';
        state.purchaseNewProviderPhone = '';
      } else if (data.provider_name) {
        state.purchaseSupplierId = 0;
        state.purchaseNewProviderName = data.provider_name;
        state.purchaseNewProviderPhone = data.provider_phone || '';
      }
      state.purchaseInvoiceRef = data.invoice_number || '';
      state.purchaseItems = (data.items || []).map((it) => ({
        product_id: it.matched_product_id || null,
        product_name: it.product_name,
        sku_or_ref: it.sku_or_ref || '',
        brand: it.brand || '',
        quantity: Number(it.quantity) || 1,
        unit_cost: Number(it.unit_cost) || 0,
        new_wholesale_price: Math.round((Number(it.unit_cost) || 0) * 1.12),
        new_retail_price: Number(it.suggested_retail_price) || Math.round((Number(it.unit_cost) || 0) * 1.25),
      }));
      state.invoiceScanMessage = `Facture analysée (${data.source.toUpperCase()}) : ${state.purchaseItems.length} article(s) détecté(s) pour ${data.provider_name || 'Fournisseur'}.`;
      render();
    } catch (err) {
      state.invoiceScanLoading = false;
      state.invoiceScanMessage = `Erreur réseau : ${err.message}`;
      render();
    }
  }

  const inpScanInvoiceFile = document.getElementById('input-scan-invoice-file');
  if (inpScanInvoiceFile) {
    inpScanInvoiceFile.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        runInvoiceAiScan({
          imageBase64: String(reader.result || ''),
          mimeType: file.type || 'image/jpeg',
          rawText: document.getElementById('textarea-scan-invoice-text')?.value || '',
        });
      };
      reader.readAsDataURL(file);
    };
  }

  const txtScanInvoice = document.getElementById('textarea-scan-invoice-text');
  if (txtScanInvoice) {
    txtScanInvoice.oninput = (e) => {
      state.invoiceScanText = e.target.value;
    };
  }

  const btnScanInvoiceText = document.getElementById('btn-scan-invoice-text');
  if (btnScanInvoiceText) {
    btnScanInvoiceText.onclick = () => {
      const rawText = document.getElementById('textarea-scan-invoice-text')?.value || '';
      if (!rawText.trim()) {
        showToast('Veuillez importer une photo ou coller le texte de la facture.');
        return;
      }
      runInvoiceAiScan({ rawText });
    };
  }

  const btnSubmitPurchase = document.getElementById('btn-submit-purchase');
  if (btnSubmitPurchase) {
    btnSubmitPurchase.onclick = async () => {
      const supId = Number(document.getElementById('select-pur-supplier')?.value || 0);
      const ref = document.getElementById('input-pur-ref')?.value || '';
      const paid = document.getElementById('input-pur-paid')?.value ?? '';
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplier_id: supId,
          provider_name: supId === 0 ? state.purchaseNewProviderName : '',
          provider_phone: supId === 0 ? state.purchaseNewProviderPhone : '',
          invoice_number: ref,
          paid_amount: paid,
          items: state.purchaseItems,
        }),
      });
      if (res.ok) {
        state.purchaseItems = [];
        state.purchasePaidAmount = '';
        state.purchaseNewProviderName = '';
        state.purchaseNewProviderPhone = '';
        state.invoiceScanMessage = '';
        state.invoiceScanText = '';
        await loadAllData();
        showToast('Réception enregistrée, produits et historique des prix mis à jour');
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
  if (btnDashAddProd) btnDashAddProd.onclick = () => { openProductModalWith(null, false); render(); };
  const btnDashOpenCheck = document.getElementById('btn-dash-open-check');
  if (btnDashOpenCheck) {
    btnDashOpenCheck.onclick = () => {
      state.activeTab = 'expenses';
      state.expensesSubTab = 'checks';
      render();
    };
  }
  const btnDashWooOrders = document.getElementById('btn-dash-woo-orders');
  if (btnDashWooOrders) {
    btnDashWooOrders.onclick = () => {
      state.activeTab = 'connect';
      state.connectSubTab = 'orders';
      render();
    };
  }

  // Treasury Checks Studio (Crédit Agricole du Maroc 175x80mm) & WooCommerce Web Orders
  document.querySelectorAll('[data-esub]').forEach((b) => {
    b.onclick = () => {
      state.expensesSubTab = b.getAttribute('data-esub') || 'checks';
      render();
    };
  });

  const bindCheckField = (id, key, opts = {}) => {
    const el = document.getElementById(id);
    if (!el) return;
    const handler = () => {
      const val = opts.checkbox ? el.checked : opts.number ? Number(el.value || 0) : el.value;
      state.checkForm[key] = val;
      if (key === 'bank_code') {
        state.checkForm.bank_name = MOROCCO_BANK_PRESETS[val]?.name || 'Crédit Agricole du Maroc';
      }
      if (key === 'offsetX') localStorage.setItem('ez_check_offset_x', String(val));
      if (key === 'offsetY') localStorage.setItem('ez_check_offset_y', String(val));
      if (!opts.liveText) render();
      else {
        const activeId = document.activeElement?.id;
        const pos = document.activeElement?.selectionStart;
        render();
        const restored = activeId ? document.getElementById(activeId) : null;
        if (restored) {
          restored.focus();
          if (typeof pos === 'number' && restored.setSelectionRange) {
            try { restored.setSelectionRange(pos, pos); } catch {}
          }
        }
      }
    };
    if (opts.liveText) el.oninput = handler;
    else el.onchange = handler;
  };
  bindCheckField('chk-bank-code', 'bank_code');
  bindCheckField('chk-inst-type', 'instrument_type');
  bindCheckField('chk-direction', 'direction');
  bindCheckField('chk-number', 'check_number', { liveText: true });
  bindCheckField('chk-beneficiary', 'beneficiary_or_issuer', { liveText: true });
  bindCheckField('chk-amount', 'amount', { liveText: true });
  bindCheckField('chk-city', 'issue_city', { liveText: true });
  bindCheckField('chk-issue-date', 'issue_date');
  bindCheckField('chk-due-date', 'due_date');
  bindCheckField('chk-crossed', 'is_crossed', { checkbox: true });
  bindCheckField('chk-non-endorsable', 'non_endorsable', { checkbox: true });
  bindCheckField('chk-protect', 'protect_marks', { checkbox: true });
  bindCheckField('chk-lang', 'lang');
  bindCheckField('chk-record-pay', 'record_payment', { checkbox: true });
  bindCheckField('chk-off-x', 'offsetX', { number: true });
  bindCheckField('chk-off-y', 'offsetY', { number: true });

  const selChkParty = document.getElementById('chk-quick-party');
  if (selChkParty) {
    selChkParty.onchange = () => {
      const v = selChkParty.value || '';
      if (v.startsWith('sup:')) {
        const s = state.suppliers.find((x) => Number(x.id) === Number(v.slice(4)));
        if (s) {
          state.checkForm.direction = 'issued';
          state.checkForm.supplier_id = s.id;
          state.checkForm.customer_id = '';
          state.checkForm.beneficiary_or_issuer = s.company || s.name;
          if (!Number(state.checkForm.amount) && Number(s.balance_owed) > 0) state.checkForm.amount = s.balance_owed;
          render();
        }
      } else if (v.startsWith('cust:')) {
        const c = state.customers.find((x) => Number(x.id) === Number(v.slice(5)));
        if (c) {
          state.checkForm.direction = 'received';
          state.checkForm.customer_id = c.id;
          state.checkForm.supplier_id = '';
          state.checkForm.beneficiary_or_issuer = c.name;
          if (!Number(state.checkForm.amount) && Number(c.total_debt) > 0) state.checkForm.amount = c.total_debt;
          render();
        }
      }
    };
  }

  const resetCheckFormBtn = document.getElementById('btn-reset-check-form');
  if (resetCheckFormBtn) {
    resetCheckFormBtn.onclick = () => {
      const today = new Date().toISOString().slice(0, 10);
      state.checkForm = {
        ...state.checkForm,
        id: null,
        bank_code: 'cam',
        bank_name: 'Crédit Agricole du Maroc',
        check_number: '',
        beneficiary_or_issuer: '',
        amount: '',
        issue_date: today,
        due_date: today,
        supplier_id: '',
        customer_id: '',
        record_payment: false,
      };
      render();
    };
  }

  const saveBankCheck = async (andPrint = false) => {
    const cf = state.checkForm;
    if (!cf.beneficiary_or_issuer?.trim() || !(Number(cf.amount) > 0)) {
      showToast('Veuillez saisir le bénéficiaire et un montant > 0');
      return;
    }
    const amt = Number(cf.amount);
    const words = cf.lang === 'ar' ? numberToArabicWords(amt) : numberToFrenchWords(amt);
    const res = await fetch('/api/checks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...cf, amount: amt, amount_words: words }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      showToast(data.error || 'Erreur enregistrement chèque');
      return;
    }
    await loadAllData();
    showToast(`Chèque N° ${data.check_number || ''} enregistré dans l'échéancier`);
    if (andPrint) printBankCheckNow();
  };
  const btnSaveChk = document.getElementById('btn-save-check');
  if (btnSaveChk) btnSaveChk.onclick = () => saveBankCheck(false);
  const btnSavePrintChk = document.getElementById('btn-save-and-print-check');
  if (btnSavePrintChk) btnSavePrintChk.onclick = () => saveBankCheck(true);
  const btnPrintChkOnly = document.getElementById('btn-print-check-only');
  if (btnPrintChkOnly) btnPrintChkOnly.onclick = () => printBankCheckNow();

  document.querySelectorAll('.sel-check-status').forEach((s) => {
    s.onchange = async () => {
      await fetch(`/api/checks/${s.getAttribute('data-id')}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: s.value }),
      });
      await loadAllData();
      showToast('Statut du chèque mis à jour');
    };
  });
  document.querySelectorAll('.btn-load-check').forEach((b) => {
    b.onclick = () => {
      const ch = state.bankChecks.find((x) => Number(x.id) === Number(b.getAttribute('data-id')));
      if (!ch) return;
      state.checkForm = {
        ...state.checkForm,
        bank_code: ch.bank_code || 'cam',
        bank_name: ch.bank_name || 'Crédit Agricole du Maroc',
        direction: ch.direction || 'issued',
        instrument_type: ch.instrument_type || 'check',
        check_number: ch.check_number || '',
        beneficiary_or_issuer: ch.beneficiary_or_issuer || '',
        amount: ch.amount || '',
        issue_city: ch.issue_city || 'Casablanca',
        issue_date: ch.issue_date || new Date().toISOString().slice(0, 10),
        due_date: ch.due_date || new Date().toISOString().slice(0, 10),
        is_crossed: Boolean(ch.is_crossed),
        non_endorsable: Boolean(ch.non_endorsable),
      };
      render();
      printBankCheckNow();
    };
  });
  document.querySelectorAll('.btn-del-check').forEach((b) => {
    b.onclick = async () => {
      if (!confirm('Supprimer cet effet / chèque de l’échéancier ?')) return;
      await fetch(`/api/checks/${b.getAttribute('data-id')}`, { method: 'DELETE' });
      await loadAllData();
      showToast('Chèque supprimé');
    };
  });

  // WooCommerce Two-Way Orders handlers
  const btnPullWooOrders = document.getElementById('btn-pull-woo-orders');
  if (btnPullWooOrders) {
    btnPullWooOrders.onclick = async () => {
      state.wooOrdersPullLoading = true;
      render();
      try {
        const res = await fetch('/api/woocommerce/orders/pull', { method: 'POST' });
        const d = await res.json().catch(() => ({}));
        state.wooOrdersPullLoading = false;
        if (res.ok && d.success) {
          await loadAllData();
          showToast(`${d.pulledCount} commande(s) WooCommerce synchronisée(s)`);
        } else {
          render();
          showToast(d.error || 'Échec import commandes WooCommerce');
        }
      } catch (err) {
        state.wooOrdersPullLoading = false;
        render();
        showToast(`Erreur: ${err.message}`);
      }
    };
  }
  document.querySelectorAll('.btn-whatsapp-woo-ord').forEach((b) => {
    b.onclick = () => {
      const ord = state.wooOrders.find((o) => Number(o.id) === Number(b.getAttribute('data-id')));
      if (!ord) return;
      const msg = `Bonjour ${ord.customer_name},\nNous avons bien reçu votre commande web *#${ord.order_number}* chez *${state.settings.store_name || 'ELECTROZEN'}* (Total: ${fmtMoney(ord.total_amount)}).\nNous préparons votre colis pour livraison vers ${ord.customer_city || ord.customer_address || 'votre adresse'}. Merci !`;
      sendWhatsAppMessage(ord.customer_phone, msg, ord.customer_name);
    };
  });
  document.querySelectorAll('.btn-convert-woo-ord').forEach((b) => {
    b.onclick = async () => {
      const id = Number(b.getAttribute('data-id'));
      const res = await fetch(`/api/woocommerce/orders/${id}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_method: 'cash' }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.success) {
        await loadAllData();
        state.printableSale = d.sale;
        render();
        showToast(`Commande convertie en facture ${d.sale.invoice_number} (stock déduit)`);
      } else {
        showToast(d.error || 'Impossible de convertir cette commande');
      }
    };
  });

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
  document.querySelectorAll('.btn-whatsapp-quote').forEach((b) => {
    b.onclick = () => {
      const q = state.quotations.find((x) => x.id === Number(b.getAttribute('data-id')));
      if (q) sendWhatsAppMessage(q.customer_phone || '', buildQuoteWhatsAppMessage(q), q.customer_name);
    };
  });
  const btnWaQuoteModal = document.getElementById('btn-whatsapp-quote-modal');
  if (btnWaQuoteModal) {
    btnWaQuoteModal.onclick = () => {
      const q = state.printableQuote;
      if (q) sendWhatsAppMessage(q.customer_phone || '', buildQuoteWhatsAppMessage(q), q.customer_name);
    };
  }
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

  const formWarrantyLookup = document.getElementById('form-warranty-lookup');
  if (formWarrantyLookup) {
    formWarrantyLookup.onsubmit = async (e) => {
      e.preventDefault();
      const q = document.getElementById('input-warranty-query')?.value || '';
      state.warrantyLookupQuery = q;
      const res = await fetch(`/api/warranty/lookup?q=${encodeURIComponent(q)}`);
      state.warrantyLookupResults = res.ok ? await res.json() : [];
      render();
    };
  }
  document.querySelectorAll('.btn-prefill-sav').forEach((b) => {
    b.onclick = () => {
      const item = (state.warrantyLookupResults || [])[Number(b.getAttribute('data-widx'))];
      if (!item) return;
      state.savPrefill = {
        customer_name: item.customer_name || '',
        customer_phone: item.customer_phone || '',
        device_name: item.product_name || '',
        serial_number: item.serial_number || '',
        invoice_number: item.invoice_number || '',
        under_warranty: Boolean(item.is_under_warranty),
      };
      render();
      showToast('Champs SAV pré-remplis depuis la facture !');
    };
  });

  const formSav = document.getElementById('form-new-sav');
  if (formSav) {
    formSav.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(formSav);
      const payload = Object.fromEntries(fd.entries());
      payload.under_warranty = fd.get('under_warranty') === 'on';
      const res = await fetch('/api/service-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const created = await res.json();
        state.savPrefill = null;
        state.printableSav = created;
        await loadAllData();
        showToast(`Ticket SAV ${created.ticket_number} créé`);
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
  document.querySelectorAll('.sel-sav-rma').forEach((s) => {
    s.onchange = async () => {
      await fetch(`/api/service-jobs/${s.getAttribute('data-id')}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplier_rma_status: s.value }),
      });
      await loadAllData();
      showToast('Suivi RMA fournisseur mis à jour');
    };
  });
  document.querySelectorAll('.btn-print-sav').forEach((b) => {
    b.onclick = () => {
      state.printableSav = state.serviceJobs.find((j) => Number(j.id) === Number(b.getAttribute('data-id'))) || null;
      render();
    };
  });
  const btnCloseSavPrint = document.getElementById('btn-close-sav-print');
  if (btnCloseSavPrint) btnCloseSavPrint.onclick = () => { state.printableSav = null; render(); };
  const btnPrintSavNow = document.getElementById('btn-print-sav-now');
  if (btnPrintSavNow) btnPrintSavNow.onclick = () => window.print();
  document.querySelectorAll('.btn-whatsapp-sav').forEach((b) => {
    b.onclick = () => {
      const job = state.serviceJobs.find((j) => Number(j.id) === Number(b.getAttribute('data-id')));
      if (job) sendWhatsAppMessage(job.customer_phone || '', buildSavWhatsAppMessage(job), job.customer_name);
    };
  });

  const formTransfer = document.getElementById('form-stock-transfer');
  if (formTransfer) {
    formTransfer.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(formTransfer);
      const res = await fetch('/api/stock-transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...Object.fromEntries(fd.entries()), operator_name: state.currentUser?.full_name || 'Admin' }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok) {
        await loadAllData();
        showToast(`Transfert ${d.transfer_number} enregistré`);
      } else {
        showToast(d.error || 'Transfert impossible');
      }
    };
  }

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
  if (e.key === 'F1') {
    e.preventDefault();
    state.activeTab = 'pos';
    render();
    setTimeout(() => document.getElementById('input-pos-barcode')?.focus(), 40);
  } else if (e.key === 'F2') {
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
      state.picturesModalProduct ||
      state.printableSale ||
      state.barcodeLabelProduct ||
      state.quickCustomerModalOpen ||
      state.pinModalOpen ||
      state.cashModalMode ||
      state.resetModalOpen ||
      state.posDraftModalOpen ||
      state.posCalcOpen ||
      state.todaySalesModalOpen ||
      state.printableQuote ||
      state.printableSav
    ) {
      state.inspectorOpen = false;
      state.productModalOpen = false;
      state.picturesModalProduct = null;
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
      state.printableSav = null;
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
