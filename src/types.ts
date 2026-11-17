export type Language = 'fr' | 'ar' | 'en';

export interface Product {
  id: number;
  barcode: string;
  sku: string;
  model_number: string;
  brand: string;
  category: string;
  name_fr: string;
  name_ar: string;
  name_en: string;
  description_fr: string;
  description_ar: string;
  description_en: string;
  specs_json: string;
  retail_price: number;
  wholesale_price: number;
  min_selling_price: number;
  current_cost_price: number;
  last_cost_price: number;
  stock_quantity: number;
  min_stock_alert: number;
  warranty_months: number;
  has_serial: number;
  image_url: string;
  woo_id: number | null;
  woo_sync_status: 'synced' | 'pending' | 'failed';
  woo_last_synced: string | null;
  created_at: string;
  updated_at: string;
}

export interface PriceHistoryItem {
  id: number;
  product_id: number;
  supplier_id: number | null;
  supplier_name: string;
  buying_price: number;
  previous_buying_price: number;
  retail_price_at_time: number;
  wholesale_price_at_time: number;
  quantity_added: number;
  invoice_ref: string;
  notes: string;
  recorded_at: string;
}

export interface SerialItem {
  id: number;
  product_id: number;
  serial_number: string;
  status: 'in_stock' | 'sold' | 'returned' | 'repair';
  purchase_id: number | null;
  sale_id: number | null;
  customer_id: number | null;
  sold_at: string | null;
  warranty_expires_at: string | null;
  notes: string;
}

export interface Supplier {
  id: number;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  balance_owed: number;
  notes: string;
  created_at: string;
}

export interface Purchase {
  id: number;
  invoice_number: string;
  supplier_id: number;
  supplier_name?: string;
  supplier_company?: string;
  total_amount: number;
  paid_amount: number;
  remaining_owed: number;
  notes: string;
  created_at: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
  national_id: string;
  customer_type: 'retail' | 'wholesale';
  total_spent: number;
  total_debt: number;
  notes: string;
  created_at: string;
}

export interface SaleItem {
  id?: number;
  sale_id?: number;
  product_id: number;
  product_name: string;
  barcode: string;
  quantity: number;
  unit_price: number;
  unit_cost: number;
  serial_number: string;
  warranty_months: number;
  warranty_expires_at?: string;
  subtotal: number;
}

export interface Sale {
  id: number;
  invoice_number: string;
  customer_id: number | null;
  customer_name: string;
  price_tier: 'retail' | 'wholesale';
  subtotal: number;
  discount: number;
  total_amount: number;
  paid_amount: number;
  remaining_debt: number;
  total_cost: number;
  payment_method: string;
  source_device: string;
  notes: string;
  created_at: string;
  items?: SaleItem[];
}

export interface Installment {
  id: number;
  sale_id: number;
  customer_id: number;
  customer_name?: string;
  customer_phone?: string;
  invoice_number?: string;
  installment_number: number;
  due_date: string;
  amount: number;
  paid_amount: number;
  status: 'pending' | 'paid' | 'overdue';
  paid_at: string | null;
}

export interface Expense {
  id: number;
  title: string;
  category: string;
  amount: number;
  payment_method: string;
  expense_date: string;
  notes: string;
}

export interface NetworkInfo {
  ips: string[];
  primaryIp: string;
  port: number;
  pairingToken: string;
  storeName: string;
  qrPayload: string;
  pairedDevices: {
    id: number;
    device_id: string;
    device_name: string;
    ip_address: string;
    last_seen: string;
    status: string;
  }[];
}
