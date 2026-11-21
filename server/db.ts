import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

export function hashPin(pin: string): string {
  return crypto.createHash('sha256').update('ELECTROZEN_PIN_' + String(pin || '').trim()).digest('hex');
}

const dataDir = process.env.ELECTROZEN_DATA_DIR || path.resolve(import.meta.dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const dbPath = path.join(dataDir, 'electromanager.sqlite');
export const backupDir = path.join(dataDir, 'backups');
export const db = new DatabaseSync(dbPath);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  PRAGMA busy_timeout = 5000;
`);

export function withTransaction<T>(fn: () => T): T {
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = fn();
    db.exec('COMMIT');
    return result;
  } catch (err) {
    try {
      db.exec('ROLLBACK');
    } catch {}
    throw err;
  }
}

export function getNextInvoiceNumber(prefix: 'FAC' | 'AV' | 'DEV' | 'SAV' | 'ADJ' | 'TRF' | 'CHK' = 'FAC'): string {
  const year = new Date().getFullYear();
  db.prepare(`
    INSERT INTO invoice_counters (prefix, year, last_seq)
    VALUES (?, ?, 0)
    ON CONFLICT(prefix, year) DO NOTHING
  `).run(prefix, year);
  db.prepare(`
    UPDATE invoice_counters SET last_seq = last_seq + 1
    WHERE prefix = ? AND year = ?
  `).run(prefix, year);
  const row = db.prepare(`
    SELECT last_seq FROM invoice_counters WHERE prefix = ? AND year = ?
  `).get(prefix, year) as { last_seq: number };
  return `${prefix}-${year}-${String(row.last_seq).padStart(6, '0')}`;
}

export function runDailyBackupIfNeeded() {
  try {
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    const today = new Date().toISOString().slice(0, 10);
    const dest = path.join(backupDir, `electrozen-${today}.sqlite`);
    if (!fs.existsSync(dest)) {
      const escaped = dest.replace(/'/g, "''");
      db.exec(`VACUUM INTO '${escaped}'`);
    }
    const files = fs
      .readdirSync(backupDir)
      .filter((f) => f.startsWith('electrozen-') && f.endsWith('.sqlite'))
      .sort()
      .reverse();
    for (const old of files.slice(30)) {
      try {
        fs.unlinkSync(path.join(backupDir, old));
      } catch {}
    }
  } catch (err) {
    console.error('Daily backup warning:', err);
  }
}

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      barcode TEXT UNIQUE NOT NULL,
      sku TEXT NOT NULL,
      model_number TEXT DEFAULT '',
      brand TEXT NOT NULL,
      category TEXT NOT NULL,
      name_fr TEXT NOT NULL,
      name_ar TEXT NOT NULL,
      name_en TEXT NOT NULL,
      description_fr TEXT DEFAULT '',
      description_ar TEXT DEFAULT '',
      description_en TEXT DEFAULT '',
      specs_json TEXT DEFAULT '{}',
      retail_price REAL NOT NULL DEFAULT 0,
      wholesale_price REAL NOT NULL DEFAULT 0,
      min_selling_price REAL NOT NULL DEFAULT 0,
      current_cost_price REAL NOT NULL DEFAULT 0,
      last_cost_price REAL NOT NULL DEFAULT 0,
      stock_quantity INTEGER NOT NULL DEFAULT 0,
      min_stock_alert INTEGER NOT NULL DEFAULT 2,
      warranty_months INTEGER NOT NULL DEFAULT 12,
      has_serial INTEGER NOT NULL DEFAULT 0,
      image_url TEXT DEFAULT '',
      images_json TEXT DEFAULT '[]',
      woo_id INTEGER DEFAULT NULL,
      woo_id_verified INTEGER DEFAULT 0,
      woo_sync_status TEXT NOT NULL DEFAULT 'pending',
      woo_last_synced TEXT DEFAULT NULL,
      woo_last_error TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS price_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      supplier_id INTEGER DEFAULT NULL,
      supplier_name TEXT DEFAULT 'Stock Initial',
      buying_price REAL NOT NULL,
      previous_buying_price REAL NOT NULL DEFAULT 0,
      retail_price_at_time REAL NOT NULL DEFAULT 0,
      wholesale_price_at_time REAL NOT NULL DEFAULT 0,
      quantity_added INTEGER NOT NULL DEFAULT 0,
      invoice_ref TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      recorded_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS serial_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      serial_number TEXT UNIQUE NOT NULL,
      status TEXT NOT NULL DEFAULT 'in_stock',
      purchase_id INTEGER DEFAULT NULL,
      sale_id INTEGER DEFAULT NULL,
      customer_id INTEGER DEFAULT NULL,
      sold_at TEXT DEFAULT NULL,
      warranty_expires_at TEXT DEFAULT NULL,
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      company TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      email TEXT DEFAULT '',
      address TEXT DEFAULT '',
      balance_owed REAL NOT NULL DEFAULT 0,
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_number TEXT NOT NULL,
      supplier_id INTEGER NOT NULL,
      total_amount REAL NOT NULL DEFAULT 0,
      paid_amount REAL NOT NULL DEFAULT 0,
      remaining_owed REAL NOT NULL DEFAULT 0,
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
    );

    CREATE TABLE IF NOT EXISTS purchase_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      purchase_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      unit_cost REAL NOT NULL,
      new_retail_price REAL NOT NULL,
      new_wholesale_price REAL NOT NULL,
      subtotal REAL NOT NULL,
      FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT DEFAULT '',
      address TEXT DEFAULT '',
      national_id TEXT DEFAULT '',
      customer_type TEXT NOT NULL DEFAULT 'retail',
      total_spent REAL NOT NULL DEFAULT 0,
      total_debt REAL NOT NULL DEFAULT 0,
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_number TEXT UNIQUE NOT NULL,
      customer_id INTEGER DEFAULT NULL,
      customer_name TEXT NOT NULL DEFAULT 'Client Comptoir',
      price_tier TEXT NOT NULL DEFAULT 'retail',
      subtotal REAL NOT NULL DEFAULT 0,
      discount REAL NOT NULL DEFAULT 0,
      total_amount REAL NOT NULL DEFAULT 0,
      paid_amount REAL NOT NULL DEFAULT 0,
      remaining_debt REAL NOT NULL DEFAULT 0,
      total_cost REAL NOT NULL DEFAULT 0,
      payment_method TEXT NOT NULL DEFAULT 'cash',
      source_device TEXT NOT NULL DEFAULT 'windows_pos',
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      barcode TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      unit_cost REAL NOT NULL,
      serial_number TEXT DEFAULT '',
      warranty_months INTEGER NOT NULL DEFAULT 12,
      warranty_expires_at TEXT DEFAULT NULL,
      subtotal REAL NOT NULL,
      FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS installments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER NOT NULL,
      customer_id INTEGER NOT NULL,
      installment_number INTEGER NOT NULL,
      due_date TEXT NOT NULL,
      amount REAL NOT NULL,
      paid_amount REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pending',
      paid_at TEXT DEFAULT NULL,
      FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS customer_payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      sale_id INTEGER DEFAULT NULL,
      amount REAL NOT NULL,
      payment_method TEXT NOT NULL DEFAULT 'cash',
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      payment_method TEXT NOT NULL DEFAULT 'cash',
      expense_date TEXT NOT NULL DEFAULT (date('now')),
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS woo_sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      action TEXT NOT NULL,
      payload_json TEXT NOT NULL DEFAULT '{}',
      status TEXT NOT NULL DEFAULT 'pending',
      error_message TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      synced_at TEXT DEFAULT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS paired_devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT UNIQUE NOT NULL,
      device_name TEXT NOT NULL,
      ip_address TEXT DEFAULT '',
      access_token TEXT DEFAULT '',
      last_seen TEXT NOT NULL DEFAULT (datetime('now')),
      status TEXT NOT NULL DEFAULT 'online'
    );

    CREATE TABLE IF NOT EXISTS invoice_counters (
      prefix TEXT NOT NULL,
      year INTEGER NOT NULL,
      last_seq INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (prefix, year)
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'caissier',
      pin_hash TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS cash_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      opened_by TEXT NOT NULL,
      closed_by TEXT DEFAULT '',
      opening_float REAL NOT NULL DEFAULT 0,
      expected_cash REAL NOT NULL DEFAULT 0,
      counted_cash REAL NOT NULL DEFAULT 0,
      difference REAL NOT NULL DEFAULT 0,
      notes TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'open',
      opened_at TEXT NOT NULL DEFAULT (datetime('now')),
      closed_at TEXT DEFAULT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_name TEXT NOT NULL DEFAULT 'Admin',
      user_role TEXT NOT NULL DEFAULT 'admin',
      action TEXT NOT NULL,
      entity TEXT NOT NULL,
      entity_id TEXT DEFAULT '',
      details_json TEXT DEFAULT '{}',
      source_device TEXT DEFAULT 'windows_pos',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS quotations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quote_number TEXT UNIQUE NOT NULL,
      customer_id INTEGER DEFAULT NULL,
      customer_name TEXT NOT NULL DEFAULT 'Client Comptoir',
      price_tier TEXT NOT NULL DEFAULT 'retail',
      subtotal REAL NOT NULL DEFAULT 0,
      discount REAL NOT NULL DEFAULT 0,
      total_amount REAL NOT NULL DEFAULT 0,
      valid_until TEXT NOT NULL DEFAULT (date('now', '+15 days')),
      status TEXT NOT NULL DEFAULT 'open',
      converted_sale_id INTEGER DEFAULT NULL,
      notes TEXT DEFAULT '',
      items_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS service_jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_number TEXT UNIQUE NOT NULL,
      customer_id INTEGER DEFAULT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT DEFAULT '',
      product_id INTEGER DEFAULT NULL,
      device_name TEXT NOT NULL,
      serial_number TEXT DEFAULT '',
      issue_description TEXT NOT NULL DEFAULT '',
      diagnosis_notes TEXT DEFAULT '',
      technician TEXT DEFAULT 'Atelier ELECTROZEN',
      parts_cost REAL NOT NULL DEFAULT 0,
      labor_price REAL NOT NULL DEFAULT 0,
      total_price REAL NOT NULL DEFAULT 0,
      paid_amount REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS stock_adjustments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      adj_number TEXT UNIQUE NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      adj_type TEXT NOT NULL DEFAULT 'add',
      quantity_delta INTEGER NOT NULL,
      unit_cost REAL NOT NULL DEFAULT 0,
      stock_before INTEGER NOT NULL DEFAULT 0,
      stock_after INTEGER NOT NULL DEFAULT 0,
      reason TEXT DEFAULT '',
      user_name TEXT DEFAULT 'Admin',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bank_checks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      direction TEXT NOT NULL DEFAULT 'issued',
      instrument_type TEXT NOT NULL DEFAULT 'check',
      check_number TEXT NOT NULL DEFAULT '',
      bank_code TEXT NOT NULL DEFAULT 'cam',
      bank_name TEXT NOT NULL DEFAULT 'Crédit Agricole du Maroc',
      beneficiary_or_issuer TEXT NOT NULL,
      amount REAL NOT NULL DEFAULT 0,
      amount_words TEXT DEFAULT '',
      issue_city TEXT NOT NULL DEFAULT 'Casablanca',
      issue_date TEXT NOT NULL DEFAULT (date('now')),
      due_date TEXT NOT NULL DEFAULT (date('now')),
      is_crossed INTEGER NOT NULL DEFAULT 1,
      non_endorsable INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'pending',
      supplier_id INTEGER DEFAULT NULL,
      customer_id INTEGER DEFAULT NULL,
      sale_id INTEGER DEFAULT NULL,
      purchase_id INTEGER DEFAULT NULL,
      notes TEXT DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS woo_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      woo_order_id INTEGER UNIQUE NOT NULL,
      order_number TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'processing',
      local_status TEXT NOT NULL DEFAULT 'pending',
      customer_name TEXT NOT NULL DEFAULT '',
      customer_phone TEXT DEFAULT '',
      customer_email TEXT DEFAULT '',
      customer_address TEXT DEFAULT '',
      customer_city TEXT DEFAULT '',
      payment_method_title TEXT DEFAULT 'Paiement à la livraison (COD)',
      total_amount REAL NOT NULL DEFAULT 0,
      items_json TEXT NOT NULL DEFAULT '[]',
      converted_sale_id INTEGER DEFAULT NULL,
      order_date TEXT NOT NULL DEFAULT (datetime('now')),
      synced_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS stock_transfers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transfer_number TEXT UNIQUE NOT NULL,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      direction TEXT NOT NULL DEFAULT 'depot_to_shop',
      quantity INTEGER NOT NULL,
      notes TEXT DEFAULT '',
      operator_name TEXT DEFAULT 'Admin',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
    CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
    CREATE INDEX IF NOT EXISTS idx_products_model ON products(model_number);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
    CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);
    CREATE INDEX IF NOT EXISTS idx_price_history_prod ON price_history(product_id);
    CREATE INDEX IF NOT EXISTS idx_serial_items_prod_status ON serial_items(product_id, status);
  `);

  const devCols = (db.prepare('PRAGMA table_info(paired_devices)').all() as { name: string }[]).map((c) => c.name);
  if (!devCols.includes('access_token')) {
    db.exec("ALTER TABLE paired_devices ADD COLUMN access_token TEXT DEFAULT ''");
  }

  const pCols = (db.prepare('PRAGMA table_info(products)').all() as { name: string }[]).map((c) => c.name);
  if (!pCols.includes('regular_price')) {
    db.exec('ALTER TABLE products ADD COLUMN regular_price REAL NOT NULL DEFAULT 0');
  }
  if (!pCols.includes('source_site')) {
    db.exec("ALTER TABLE products ADD COLUMN source_site TEXT DEFAULT 'electrozen.ma'");
  }
  if (!pCols.includes('permalink')) {
    db.exec("ALTER TABLE products ADD COLUMN permalink TEXT DEFAULT ''");
  }
  if (!pCols.includes('images_json')) {
    db.exec("ALTER TABLE products ADD COLUMN images_json TEXT DEFAULT '[]'");
  }
  if (!pCols.includes('woo_last_error')) {
    db.exec("ALTER TABLE products ADD COLUMN woo_last_error TEXT DEFAULT ''");
  }
  if (!pCols.includes('woo_id_verified')) {
    db.exec("ALTER TABLE products ADD COLUMN woo_id_verified INTEGER DEFAULT 0");
  }

  // Backfill images_json from legacy image_url where empty
  const rowsToBackfill = db
    .prepare(
      `SELECT id, image_url FROM products WHERE (images_json IS NULL OR images_json = '' OR images_json = '[]') AND image_url IS NOT NULL AND image_url != ''`
    )
    .all() as { id: number; image_url: string }[];
  if (rowsToBackfill.length > 0) {
    const updBackfill = db.prepare(`UPDATE products SET images_json = ? WHERE id = ?`);
    for (const r of rowsToBackfill) {
      updBackfill.run(JSON.stringify([r.image_url]), r.id);
    }
  }

  const sCols = (db.prepare('PRAGMA table_info(sales)').all() as { name: string }[]).map((c) => c.name);
  if (!sCols.includes('status')) {
    db.exec("ALTER TABLE sales ADD COLUMN status TEXT NOT NULL DEFAULT 'completed'");
  }
  if (!sCols.includes('credit_note_number')) {
    db.exec("ALTER TABLE sales ADD COLUMN credit_note_number TEXT DEFAULT ''");
  }

  if (!pCols.includes('warehouse_quantity')) {
    db.exec('ALTER TABLE products ADD COLUMN warehouse_quantity INTEGER NOT NULL DEFAULT 0');
  }

  const sjCols = (db.prepare('PRAGMA table_info(service_jobs)').all() as { name: string }[]).map((c) => c.name);
  if (!sjCols.includes('invoice_number')) {
    db.exec("ALTER TABLE service_jobs ADD COLUMN invoice_number TEXT DEFAULT ''");
  }
  if (!sjCols.includes('under_warranty')) {
    db.exec('ALTER TABLE service_jobs ADD COLUMN under_warranty INTEGER NOT NULL DEFAULT 0');
  }
  if (!sjCols.includes('supplier_rma_status')) {
    db.exec("ALTER TABLE service_jobs ADD COLUMN supplier_rma_status TEXT DEFAULT 'none'");
  }
  if (!sjCols.includes('accessories_received')) {
    db.exec("ALTER TABLE service_jobs ADD COLUMN accessories_received TEXT DEFAULT ''");
  }

  const integrity = db.prepare('PRAGMA integrity_check').get() as { integrity_check: string } | undefined;
  if (integrity && integrity.integrity_check !== 'ok') {
    console.error('SQLite integrity warning:', integrity.integrity_check);
  }

  seedInitialData();
  seedUsersAndFiscalSettings();
  runDailyBackupIfNeeded();
}

export function logAudit(
  userName: string,
  userRole: string,
  action: string,
  entity: string,
  entityId: string | number = '',
  details: unknown = {},
  sourceDevice = 'windows_pos'
) {
  try {
    db.prepare(`
      INSERT INTO audit_log (user_name, user_role, action, entity, entity_id, details_json, source_device)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(userName, userRole, action, entity, String(entityId), JSON.stringify(details || {}), sourceDevice);
  } catch {}
}

function seedUsersAndFiscalSettings() {
  const uCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (uCount.count === 0) {
    const insUser = db.prepare(`
      INSERT INTO users (username, full_name, role, pin_hash) VALUES (?, ?, ?, ?)
    `);
    insUser.run('admin', 'Admin ELECTROZEN', 'admin', hashPin('1234'));
    insUser.run('caissier', 'Caissier Comptoir', 'caissier', hashPin('0000'));
  }

  const fiscalDefaults: Record<string, string> = {
    store_ice: '002849123000045',
    store_if: '51829402',
    store_rc: '512840 (Casablanca)',
    store_patente: '34789210',
    tva_rate: '20',
    woo_wp_user: '',
    woo_wp_app_password: '',
    woo_media_map_json: '{}',
  };
  const insSet = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
  for (const [k, v] of Object.entries(fiscalDefaults)) {
    insSet.run(k, v);
  }
}

export function listBackups() {
  try {
    if (!fs.existsSync(backupDir)) return [];
    return fs
      .readdirSync(backupDir)
      .filter((f) => f.endsWith('.sqlite'))
      .sort()
      .reverse()
      .map((f) => {
        const st = fs.statSync(path.join(backupDir, f));
        return { name: f, size: st.size, mtime: st.mtime.toISOString() };
      });
  } catch {
    return [];
  }
}

export function resetStoreForProduction(cfg: Record<string, string> = {}) {
  withTransaction(() => {
    db.exec(`
      PRAGMA foreign_keys = OFF;
      DELETE FROM installments;
      DELETE FROM customer_payments;
      DELETE FROM sale_items;
      DELETE FROM sales;
      DELETE FROM purchase_items;
      DELETE FROM purchases;
      DELETE FROM serial_items;
      DELETE FROM price_history;
      DELETE FROM woo_sync_queue;
      DELETE FROM products;
      DELETE FROM suppliers;
      DELETE FROM customers;
      DELETE FROM expenses;
      DELETE FROM cash_sessions;
      DELETE FROM quotations;
      DELETE FROM service_jobs;
      DELETE FROM stock_adjustments;
      DELETE FROM bank_checks;
      DELETE FROM woo_orders;
      DELETE FROM stock_transfers;
      DELETE FROM invoice_counters;
      DELETE FROM sqlite_sequence WHERE name NOT IN ('users');
      PRAGMA foreign_keys = ON;
    `);
    const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    upsert.run('setup_completed', 'true');
    if (cfg.store_name) upsert.run('store_name', cfg.store_name);
    if (cfg.store_phone) upsert.run('store_phone', cfg.store_phone);
    if (cfg.store_address) upsert.run('store_address', cfg.store_address);
    if (cfg.store_ice) upsert.run('store_ice', cfg.store_ice);
    if (cfg.store_if) upsert.run('store_if', cfg.store_if);
    if (cfg.store_rc) upsert.run('store_rc', cfg.store_rc);
    if (cfg.admin_pin && cfg.admin_pin.trim().length >= 4) {
      db.prepare("UPDATE users SET pin_hash = ? WHERE username = 'admin'").run(hashPin(cfg.admin_pin.trim()));
    }
  });
}

function seedInitialData() {
  const setupDone = db.prepare("SELECT value FROM settings WHERE key = 'setup_completed'").get() as { value: string } | undefined;
  if (setupDone?.value === 'true') return;
  // Check if currency is still old 'DA' or if products table is empty and upgrade to 'MAD' with Moroccan data
  const currRow = db.prepare("SELECT value FROM settings WHERE key = 'currency'").get() as { value: string } | undefined;
  const prodCountRow = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if ((currRow && currRow.value === 'DA') || prodCountRow.count === 0) {
    db.exec(`
      PRAGMA foreign_keys = OFF;
      DELETE FROM installments;
      DELETE FROM customer_payments;
      DELETE FROM sale_items;
      DELETE FROM sales;
      DELETE FROM purchase_items;
      DELETE FROM purchases;
      DELETE FROM serial_items;
      DELETE FROM price_history;
      DELETE FROM woo_sync_queue;
      DELETE FROM products;
      DELETE FROM suppliers;
      DELETE FROM customers;
      DELETE FROM expenses;
      DELETE FROM settings;
      DELETE FROM sqlite_sequence;
      PRAGMA foreign_keys = ON;
    `);
  }

  const existingSettings = db.prepare('SELECT COUNT(*) as count FROM settings').get() as { count: number };
  if (existingSettings.count === 0) {
    const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
    const defaultSettings: Record<string, string> = {
      store_name: 'ELECTROZEN',
      store_phone: '+212 522 48 91 00',
      store_address: 'Quartier Maarif / Derb Ghallef, Casablanca',
      currency: 'MAD',
      default_language: 'fr',
      pairing_token: 'ELECTROZEN-POS-2026',
      woo_url: 'https://electrozen.ma',
      woo_consumer_key: '',
      woo_consumer_secret: '',
      woo_wp_user: '',
      woo_wp_app_password: '',
      woo_media_map_json: '{}',
      woo_auto_sync: 'true',
      ai_provider: 'gemini',
      ai_api_key: '',
    };
    for (const [k, v] of Object.entries(defaultSettings)) {
      insertSetting.run(k, v);
    }
  } else {
    db.prepare("UPDATE settings SET value = 'ELECTROZEN' WHERE key = 'store_name' AND value LIKE 'Atlas%'").run();
    db.prepare("UPDATE settings SET value = 'ELECTROZEN-POS-2026' WHERE key = 'pairing_token' AND value = 'ATLAS-POS-2026'").run();
    db.prepare("UPDATE settings SET value = 'https://electrozen.ma' WHERE key = 'woo_url' AND value = 'https://atlas-electro.ma'").run();
  }

  const existingProducts = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (existingProducts.count > 0) return;

  const seedProductsPath = path.resolve(dataDir, 'seeds', 'products-seed.json');
  const fallbackSeedsPath = path.resolve(import.meta.dirname, '..', 'data', 'seeds', 'products-seed.json');
  const actualSeedPath = fs.existsSync(seedProductsPath) ? seedProductsPath : (fs.existsSync(fallbackSeedsPath) ? fallbackSeedsPath : null);

  if (actualSeedPath) {
    try {
      const seedProducts = JSON.parse(fs.readFileSync(actualSeedPath, 'utf-8'));
      if (Array.isArray(seedProducts) && seedProducts.length > 0) {
        const insProduct = db.prepare(`
          INSERT INTO products (
            barcode, sku, model_number, brand, category,
            name_fr, name_ar, name_en,
            description_fr, description_ar, description_en,
            specs_json, retail_price, wholesale_price, min_selling_price,
            current_cost_price, last_cost_price, stock_quantity, min_stock_alert,
            warranty_months, has_serial, image_url, woo_id, woo_sync_status,
            regular_price, source_site, permalink
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const p of seedProducts) {
          insProduct.run(
            p.barcode || '',
            p.sku || '',
            p.model_number || '',
            p.brand || '',
            p.category || 'Général',
            p.name_fr || '',
            p.name_ar || '',
            p.name_en || '',
            p.description_fr || '',
            p.description_ar || '',
            p.description_en || '',
            p.specs_json || '{}',
            p.retail_price || 0,
            p.wholesale_price || 0,
            p.min_selling_price || 0,
            p.current_cost_price || 0,
            p.last_cost_price || 0,
            p.stock_quantity || 0,
            p.min_stock_alert || 2,
            p.warranty_months || 12,
            p.has_serial || 0,
            p.image_url || '',
            p.woo_id || null,
            p.woo_sync_status || 'synced',
            p.regular_price || 0,
            p.source_site || 'electrozen.ma',
            p.permalink || ''
          );
        }
        return;
      }
    } catch (err) {
      console.error('Failed to seed from JSON:', err);
    }
  }

  // Seed Suppliers (Morocco)
  const insertSupplier = db.prepare(`
    INSERT INTO suppliers (name, company, phone, email, address, balance_owed, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertSupplier.run('Youssef El Amrani', 'Samsung & LG Maroc Distribution', '0661 18 42 90', 'commandes@samlg.ma', 'Zone Industrielle Ain Sebaa, Casablanca', 14500, 'Livraison hebdomadaire');
  insertSupplier.run('Rachid Berrada', 'Siera & Bosch Électroménager Maroc', '0662 74 11 33', 'b2b@siera-bosch.ma', 'Sidi Maarouf, Casablanca', 0, 'Grossiste officiel');
  insertSupplier.run('Hamza Tazi', 'Petit Électroménager Import (Tefal / DeLonghi)', '0670 95 20 14', 'sales@pem-maroc.ma', 'Zone Franche, Tanger', 4200, 'Tarifs grossistes');

  // Seed Products in MAD (Moroccan Dirham)
  const insertProduct = db.prepare(`
    INSERT INTO products (
      barcode, sku, model_number, brand, category,
      name_fr, name_ar, name_en,
      description_fr, description_ar, description_en,
      specs_json, retail_price, wholesale_price, min_selling_price,
      current_cost_price, last_cost_price, stock_quantity, min_stock_alert,
      warranty_months, has_serial, woo_id, woo_sync_status, woo_last_synced
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const sampleProducts = [
    {
      barcode: '8806094892154',
      sku: 'TV-SAM-55Q60C',
      model: 'QA55Q60CAUXMV',
      brand: 'Samsung',
      category: 'Téléviseurs & Audio',
      name_fr: 'Téléviseur Samsung 55" QLED 4K Smart TV (Q60C)',
      name_ar: 'تلفزيون سامسونج 55 بوصة QLED 4K سمارت (Q60C)',
      name_en: 'Samsung 55" QLED 4K Smart TV (Q60C Series)',
      desc_fr: 'Processeur Quantum Lite 4K, 100% Volume Couleur Quantum Dot, Design AirSlim, Smart Hub Tizen.',
      desc_ar: 'معالج كوانتوم لايت 4K، ألوان غنية بتقنية Quantum Dot، تصميم نحيف ونظام سمارت Tizen.',
      desc_en: 'Quantum Processor Lite 4K, 100% Color Volume with Quantum Dot, AirSlim Design, Tizen OS.',
      specs: JSON.stringify({ resolution: '4K UHD', screen: '55" QLED', hdmi: '3x HDMI, 2x USB' }),
      retail: 6490,
      wholesale: 5950,
      min_price: 5850,
      cost: 5350,
      last_cost: 5200,
      stock: 6,
      alert: 2,
      warranty: 24,
      has_serial: 1,
      woo_id: 1041,
      woo_status: 'synced',
    },
    {
      barcode: '8806091452108',
      sku: 'REF-LG-GNB422',
      model: 'GN-B422SQCL',
      brand: 'LG',
      category: 'Réfrigérateurs & Congélateurs',
      name_fr: 'Réfrigérateur LG NoFrost 420L Smart Inverter Inox',
      name_ar: 'ثلاجة إل جي نو فروست 420 لتر سمارت إنفرتر إينوكس',
      name_en: 'LG 420L NoFrost Smart Inverter Refrigerator Inox',
      desc_fr: 'Compresseur Smart Inverter garanti 10 ans, LinearCooling, DoorCooling+ refroidissement uniforme.',
      desc_ar: 'ضاغط سمارت إنفرتر بضمان 10 سنوات، تبريد سريع ومتساوي بتقنية DoorCooling+.',
      desc_en: 'Smart Inverter Compressor with 10-year warranty, LinearCooling and DoorCooling+.',
      specs: JSON.stringify({ capacity: '420L', technology: 'NoFrost Inverter', energy: 'A++' }),
      retail: 8790,
      wholesale: 8150,
      min_price: 7990,
      cost: 7300,
      last_cost: 7450,
      stock: 4,
      alert: 2,
      warranty: 24,
      has_serial: 1,
      woo_id: 1042,
      woo_status: 'synced',
    },
    {
      barcode: '4242005289141',
      sku: 'LAV-BOS-9KG',
      model: 'WGG24400MA',
      brand: 'Bosch',
      category: 'Lavage & Séchage',
      name_fr: 'Machine à Laver Bosch Série 6 9Kg 1400 Tr/min EcoSilence',
      name_ar: 'غسالة ملابس بوش الفئة السادسة 9 كغ 1400 دورة',
      name_en: 'Bosch Series 6 9Kg Washing Machine 1400 RPM EcoSilence',
      desc_fr: 'Moteur EcoSilence Drive ultra-silencieux, SpeedPerfect, AntiStain et ActiveWater Plus.',
      desc_ar: 'محرك EcoSilence Drive هادئ للغاية واقتصادي في استهلاك الماء والكهرباء.',
      desc_en: 'EcoSilence Drive brushless motor, SpeedPerfect and ActiveWater Plus.',
      specs: JSON.stringify({ capacity: '9 Kg', spin: '1400 RPM', motor: 'EcoSilence Drive' }),
      retail: 5490,
      wholesale: 4990,
      min_price: 4900,
      cost: 4450,
      last_cost: 4350,
      stock: 8,
      alert: 3,
      warranty: 24,
      has_serial: 1,
      woo_id: 1043,
      woo_status: 'synced',
    },
    {
      barcode: '6111245001928',
      sku: 'CLIM-SIE-12K',
      model: 'AC-SIERA-12INV',
      brand: 'Siera',
      category: 'Climatisation & Chauffage',
      name_fr: 'Climatiseur Split Siera 12000 BTU Inverter Chaud/Froid',
      name_ar: 'مكيف هواء سييرا 12000 وحدة إنفرتر بارد/ساخن',
      name_en: 'Siera 12000 BTU Inverter Split Air Conditioner',
      desc_fr: 'Technologie DC Inverter économique, gaz écologique R410A, mode Turbo silencieux.',
      desc_ar: 'تقنية DC إنفرتر اقتصادية، غاز R410A صديق للبيئة، تبريد وتدفئة سريعة.',
      desc_en: 'DC Inverter energy-saving compressor, R410A eco gas, quiet Turbo mode.',
      specs: JSON.stringify({ power: '12000 BTU', technology: 'DC Inverter', gas: 'R410A' }),
      retail: 4390,
      wholesale: 3990,
      min_price: 3900,
      cost: 3500,
      last_cost: 3400,
      stock: 2,
      alert: 4,
      warranty: 24,
      has_serial: 1,
      woo_id: 1044,
      woo_status: 'pending',
    },
    {
      barcode: '3045380021549',
      sku: 'AF-TEF-XXL',
      model: 'EY701D15',
      brand: 'Tefal',
      category: 'Petit Électroménager',
      name_fr: 'Friteuse Sans Huile Air Fryer Tefal Easy Fry XXL 5.6L',
      name_ar: 'قلاية هوائية بدون زيت تيفال إيزي فراي XXL سعة 5.6 لتر',
      name_en: 'Tefal Easy Fry XXL 5.6L Digital Air Fryer',
      desc_fr: 'Capacité XXL 5.6L (8 portions), panneau numérique tactile, 8 programmes automatiques.',
      desc_ar: 'سعة كبيرة 5.6 لتر، شاشة لمس رقمية و8 برامج طهي.',
      desc_en: 'XXL 5.6L capacity, digital touchscreen, 8 preset cooking modes.',
      specs: JSON.stringify({ capacity: '5.6L', power: '1700W', programs: '8 Modes' }),
      retail: 1690,
      wholesale: 1450,
      min_price: 1400,
      cost: 1220,
      last_cost: 1180,
      stock: 14,
      alert: 4,
      warranty: 12,
      has_serial: 0,
      woo_id: 1045,
      woo_status: 'synced',
    },
    {
      barcode: '8004399325074',
      sku: 'CAF-DEL-DEDICA',
      model: 'EC685.M',
      brand: "De'Longhi",
      category: 'Petit Électroménager',
      name_fr: "Machine à Café Expresso De'Longhi Dedica 15 Bars Inox",
      name_ar: 'ماكينة قهوة إسبريسو ديلونجي ديديكا 15 بار إينوكس',
      name_en: "De'Longhi Dedica EC685.M 15-Bar Espresso Machine",
      desc_fr: 'Pression 15 bars, système Thermoblock, buse vapeur Cappuccino, format compact 15 cm.',
      desc_ar: 'ضغط 15 بار، نظام تسخين ثيرموبلوك سريع، عصا تبخير الحليب.',
      desc_en: '15-bar pressure, Thermoblock heating system, adjustable milk frother.',
      specs: JSON.stringify({ pressure: '15 Bars', body: 'Inox', width: '15 cm' }),
      retail: 2290,
      wholesale: 1980,
      min_price: 1920,
      cost: 1680,
      last_cost: 1650,
      stock: 7,
      alert: 3,
      warranty: 12,
      has_serial: 0,
      woo_id: null,
      woo_status: 'pending',
    },
  ];

  const insertPriceHistory = db.prepare(`
    INSERT INTO price_history (
      product_id, supplier_id, supplier_name,
      buying_price, previous_buying_price, retail_price_at_time, wholesale_price_at_time,
      quantity_added, invoice_ref, notes, recorded_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertSerial = db.prepare(`
    INSERT INTO serial_items (product_id, serial_number, status, notes)
    VALUES (?, ?, 'in_stock', ?)
  `);

  for (const p of sampleProducts) {
    const res = insertProduct.run(
      p.barcode, p.sku, p.model, p.brand, p.category,
      p.name_fr, p.name_ar, p.name_en,
      p.desc_fr, p.desc_ar, p.desc_en,
      p.specs, p.retail, p.wholesale, p.min_price,
      p.cost, p.last_cost, p.stock, p.alert,
      p.warranty, p.has_serial, p.woo_id, p.woo_status,
      p.woo_status === 'synced' ? new Date().toISOString() : null
    );
    const productId = Number(res.lastInsertRowid);

    insertPriceHistory.run(
      productId, 1, 'Samsung & LG Maroc Distribution',
      p.last_cost - 100, 0, p.retail - 200, p.wholesale - 150,
      5, 'BL-2026-014', 'Arrivage Q3', '2026-09-12 10:15:00'
    );
    insertPriceHistory.run(
      productId, 1, 'Samsung & LG Maroc Distribution',
      p.last_cost, p.last_cost - 100, p.retail - 100, p.wholesale - 100,
      4, 'BL-2026-051', 'Arrivage Octobre', '2026-10-18 14:30:00'
    );
    insertPriceHistory.run(
      productId, 2, 'Siera & Bosch Électroménager Maroc',
      p.cost, p.last_cost, p.retail, p.wholesale,
      p.stock, 'BL-2026-092', 'Dernier arrivage en stock', '2026-11-05 09:45:00'
    );

    if (p.has_serial) {
      for (let i = 1; i <= Math.min(p.stock, 4); i++) {
        insertSerial.run(
          productId,
          `${p.model}-SN260${productId}0${i}`,
          'Scellé usine'
        );
      }
    }
  }

  // Seed Customers (Morocco)
  const insertCustomer = db.prepare(`
    INSERT INTO customers (name, phone, address, national_id, customer_type, total_spent, total_debt, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertCustomer.run('Mehdi Benjelloun', '0661 32 45 78', 'Bourgogne, Casablanca', 'BK492810', 'retail', 8790, 2790, 'Acompte 6000 MAD + 2 échéances');
  insertCustomer.run('Ste Electro Habous SARL', '0663 90 12 44', 'Quartier Habous, Casablanca', 'ICE-002948192000045', 'wholesale', 28400, 4500, 'Revendeur partenaire');
  insertCustomer.run('Salma Chraibi', '0671 55 88 21', 'Agdal, Rabat', 'AE109482', 'retail', 6490, 0, 'Paiement comptant');

  // Seed Sample Sales & Installments in MAD
  const insertSale = db.prepare(`
    INSERT INTO sales (
      invoice_number, customer_id, customer_name, price_tier,
      subtotal, discount, total_amount, paid_amount, remaining_debt,
      total_cost, payment_method, source_device, notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertSaleItem = db.prepare(`
    INSERT INTO sale_items (
      sale_id, product_id, product_name, barcode, quantity,
      unit_price, unit_cost, serial_number, warranty_months, warranty_expires_at, subtotal
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertInstallment = db.prepare(`
    INSERT INTO installments (
      sale_id, customer_id, installment_number, due_date, amount, paid_amount, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const sale1 = insertSale.run(
    'FAC-2026-0001', 1, 'Mehdi Benjelloun', 'retail',
    8790, 0, 8790, 6000, 2790,
    7300, 'installment', 'windows_pos',
    'Avance 6 000 MAD + 2 traites de 1 395 MAD',
    '2026-11-08 11:20:00'
  );
  const sale1Id = Number(sale1.lastInsertRowid);
  insertSaleItem.run(
    sale1Id, 2, 'Réfrigérateur LG NoFrost 420L Smart Inverter Inox', '8806091452108', 1,
    8790, 7300, 'GN-B422SQCL-SN260200', 24, '2028-11-08', 8790
  );
  insertInstallment.run(sale1Id, 1, 1, '2026-12-08', 1395, 0, 'pending');
  insertInstallment.run(sale1Id, 1, 2, '2027-01-08', 1395, 0, 'pending');

  const sale2 = insertSale.run(
    'FAC-2026-0002', 2, 'Ste Electro Habous SARL', 'wholesale',
    12880, 180, 12700, 12700, 0,
    11340, 'transfer', 'android_app',
    'Commande préparée via scanner Android',
    '2026-11-10 16:40:00'
  );
  const sale2Id = Number(sale2.lastInsertRowid);
  insertSaleItem.run(
    sale2Id, 3, 'Machine à Laver Bosch Série 6 9Kg 1400 Tr/min EcoSilence', '4242005289141', 2,
    4990, 4450, 'WGG24400MA-LOT2', 24, '2028-11-10', 9980
  );
  insertSaleItem.run(
    sale2Id, 5, 'Friteuse Sans Huile Air Fryer Tefal Easy Fry XXL 5.6L', '3045380021549', 2,
    1450, 1220, '', 12, '2027-11-10', 2900
  );

  // Seed Store Expenses in MAD
  const insertExpense = db.prepare(`
    INSERT INTO expenses (title, category, amount, payment_method, expense_date, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertExpense.run('Facture Lydec (Électricité & Eau Showroom)', 'utilities', 680, 'cash', '2026-11-03', 'Mensuel Showroom');
  insertExpense.run('Carburant & Livraison Clients (Utilitaire)', 'transport', 350, 'cash', '2026-11-07', 'Livraisons Casablanca');
  insertExpense.run('Campagne Meta Ads (Promotions Électroménager)', 'marketing', 450, 'card', '2026-11-09', 'Ciblage Casablanca & Rabat');
}
