class PriceHistoryEntry {
  final int id;
  final String supplierName;
  final double buyingPrice;
  final double previousBuyingPrice;
  final double retailPriceAtTime;
  final double wholesalePriceAtTime;
  final int quantityAdded;
  final String invoiceRef;
  final String recordedAt;

  PriceHistoryEntry({
    required this.id,
    required this.supplierName,
    required this.buyingPrice,
    required this.previousBuyingPrice,
    required this.retailPriceAtTime,
    required this.wholesalePriceAtTime,
    required this.quantityAdded,
    required this.invoiceRef,
    required this.recordedAt,
  });

  factory PriceHistoryEntry.fromJson(Map<String, dynamic> json) {
    return PriceHistoryEntry(
      id: (json['id'] as num?)?.toInt() ?? 0,
      supplierName: (json['supplier_name'] ?? 'Stock Initial').toString(),
      buyingPrice: (json['buying_price'] as num?)?.toDouble() ?? 0.0,
      previousBuyingPrice: (json['previous_buying_price'] as num?)?.toDouble() ?? 0.0,
      retailPriceAtTime: (json['retail_price_at_time'] as num?)?.toDouble() ?? 0.0,
      wholesalePriceAtTime: (json['wholesale_price_at_time'] as num?)?.toDouble() ?? 0.0,
      quantityAdded: (json['quantity_added'] as num?)?.toInt() ?? 0,
      invoiceRef: (json['invoice_ref'] ?? '').toString(),
      recordedAt: (json['recorded_at'] ?? '').toString(),
    );
  }
}

class SerialItem {
  final int id;
  final int productId;
  final String serialNumber;
  final String status;

  SerialItem({
    required this.id,
    required this.productId,
    required this.serialNumber,
    required this.status,
  });

  factory SerialItem.fromJson(Map<String, dynamic> json) {
    return SerialItem(
      id: (json['id'] as num?)?.toInt() ?? 0,
      productId: (json['product_id'] as num?)?.toInt() ?? 0,
      serialNumber: (json['serial_number'] ?? '').toString(),
      status: (json['status'] ?? 'in_stock').toString(),
    );
  }
}

class Product {
  final int id;
  final String barcode;
  final String sku;
  final String modelNumber;
  final String brand;
  final String category;
  final String nameFr;
  final String nameAr;
  final String nameEn;
  final String specsText;
  final double lastCostPrice;
  final double currentCostPrice;
  final double wholesalePrice;
  final double retailPrice;
  final double regularPrice;
  final int stockQuantity;
  final int minStockAlert;
  final int warrantyMonths;
  final String imageUrl;
  final String sourceSite;
  final List<PriceHistoryEntry> priceHistory;
  final List<SerialItem> availableSerials;

  Product({
    required this.id,
    required this.barcode,
    required this.sku,
    required this.modelNumber,
    required this.brand,
    required this.category,
    required this.nameFr,
    required this.nameAr,
    required this.nameEn,
    required this.specsText,
    required this.lastCostPrice,
    required this.currentCostPrice,
    required this.wholesalePrice,
    required this.retailPrice,
    this.regularPrice = 0.0,
    required this.stockQuantity,
    required this.minStockAlert,
    required this.warrantyMonths,
    this.imageUrl = '',
    this.sourceSite = 'electrozen.ma',
    this.priceHistory = const [],
    this.availableSerials = const [],
  });

  String localizedName(String lang) {
    if (lang == 'ar' && nameAr.trim().isNotEmpty) return nameAr;
    if (lang == 'en' && nameEn.trim().isNotEmpty) return nameEn;
    return nameFr;
  }

  double get retailMarginMad => retailPrice - currentCostPrice;
  double get retailMarginPercent =>
      currentCostPrice > 0 ? ((retailPrice - currentCostPrice) / currentCostPrice) * 100.0 : 0.0;

  double get wholesaleMarginMad => wholesalePrice - currentCostPrice;

  factory Product.fromJson(Map<String, dynamic> json) {
    final rawHistory = (json['price_history'] as List?) ?? const [];
    final rawSerials = (json['available_serials'] as List?) ?? const [];
    return Product(
      id: (json['id'] as num?)?.toInt() ?? 0,
      barcode: (json['barcode'] ?? '').toString(),
      sku: (json['sku'] ?? '').toString(),
      modelNumber: (json['model_number'] ?? '').toString(),
      brand: (json['brand'] ?? '').toString(),
      category: (json['category'] ?? '').toString(),
      nameFr: (json['name_fr'] ?? '').toString(),
      nameAr: (json['name_ar'] ?? '').toString(),
      nameEn: (json['name_en'] ?? '').toString(),
      specsText: (json['specs_text'] ?? '').toString(),
      lastCostPrice: (json['last_cost_price'] as num?)?.toDouble() ?? 0.0,
      currentCostPrice: (json['current_cost_price'] as num?)?.toDouble() ?? 0.0,
      wholesalePrice: (json['wholesale_price'] as num?)?.toDouble() ?? 0.0,
      retailPrice: (json['retail_price'] as num?)?.toDouble() ?? 0.0,
      regularPrice: (json['regular_price'] as num?)?.toDouble() ?? 0.0,
      stockQuantity: (json['stock_quantity'] as num?)?.toInt() ?? 0,
      minStockAlert: (json['min_stock_alert'] as num?)?.toInt() ?? 2,
      warrantyMonths: (json['warranty_months'] as num?)?.toInt() ?? 12,
      imageUrl: (json['image_url'] ?? '').toString(),
      sourceSite: (json['source_site'] ?? 'electrozen.ma').toString(),
      priceHistory: rawHistory
          .whereType<Map>()
          .map((e) => PriceHistoryEntry.fromJson(Map<String, dynamic>.from(e)))
          .toList(),
      availableSerials: rawSerials.map((e) {
        if (e is Map) {
          return SerialItem.fromJson(Map<String, dynamic>.from(e));
        }
        return SerialItem(
          id: 0,
          productId: (json['id'] as num?)?.toInt() ?? 0,
          serialNumber: e.toString(),
          status: 'in_stock',
        );
      }).toList(),
    );
  }
}

class Customer {
  final int id;
  final String fullName;
  final String phone;
  final String nationalId;
  final String address;
  final double totalDebt;

  Customer({
    required this.id,
    required this.fullName,
    required this.phone,
    required this.nationalId,
    required this.address,
    required this.totalDebt,
  });

  factory Customer.fromJson(Map<String, dynamic> json) {
    return Customer(
      id: (json['id'] as num?)?.toInt() ?? 0,
      fullName: (json['name'] ?? json['full_name'] ?? '').toString(),
      phone: (json['phone'] ?? '').toString(),
      nationalId: (json['national_id'] ?? '').toString(),
      address: (json['address'] ?? '').toString(),
      totalDebt: (json['total_debt'] as num?)?.toDouble() ?? 0.0,
    );
  }
}

class MobileCartItem {
  final Product product;
  int quantity;
  double unitPrice;
  String serialNumber;

  MobileCartItem({
    required this.product,
    this.quantity = 1,
    required this.unitPrice,
    this.serialNumber = '',
  });

  double get subtotal => unitPrice * quantity;
}

class SaleItemRecord {
  final int id;
  final int productId;
  final String productName;
  final String barcode;
  final String serialNumber;
  final int quantity;
  final double unitPrice;
  final double subtotal;
  final int warrantyMonths;
  final String warrantyExpiresAt;

  SaleItemRecord({
    required this.id,
    required this.productId,
    required this.productName,
    required this.barcode,
    required this.serialNumber,
    required this.quantity,
    required this.unitPrice,
    required this.subtotal,
    required this.warrantyMonths,
    required this.warrantyExpiresAt,
  });

  factory SaleItemRecord.fromJson(Map<String, dynamic> json) {
    return SaleItemRecord(
      id: (json['id'] as num?)?.toInt() ?? 0,
      productId: (json['product_id'] as num?)?.toInt() ?? 0,
      productName: (json['product_name'] ?? '').toString(),
      barcode: (json['barcode'] ?? '').toString(),
      serialNumber: (json['serial_number'] ?? '').toString(),
      quantity: (json['quantity'] as num?)?.toInt() ?? 1,
      unitPrice: (json['unit_price'] as num?)?.toDouble() ?? 0.0,
      subtotal: (json['subtotal'] as num?)?.toDouble() ?? 0.0,
      warrantyMonths: (json['warranty_months'] as num?)?.toInt() ?? 12,
      warrantyExpiresAt: (json['warranty_expires_at'] ?? '').toString(),
    );
  }
}

class SaleRecord {
  final int id;
  final String invoiceNumber;
  final int? customerId;
  final String customerName;
  final String priceTier;
  final double subtotal;
  final double discount;
  final double totalAmount;
  final double paidAmount;
  final double remainingDebt;
  final String paymentMethod;
  final String sourceDevice;
  final String status;
  final String creditNoteNumber;
  final String createdAt;
  final List<SaleItemRecord> items;

  SaleRecord({
    required this.id,
    required this.invoiceNumber,
    this.customerId,
    required this.customerName,
    required this.priceTier,
    required this.subtotal,
    required this.discount,
    required this.totalAmount,
    required this.paidAmount,
    required this.remainingDebt,
    required this.paymentMethod,
    required this.sourceDevice,
    required this.status,
    required this.creditNoteNumber,
    required this.createdAt,
    required this.items,
  });

  factory SaleRecord.fromJson(Map<String, dynamic> json) {
    final rawItems = (json['items'] as List?) ?? [];
    return SaleRecord(
      id: (json['id'] as num?)?.toInt() ?? 0,
      invoiceNumber: (json['invoice_number'] ?? '').toString(),
      customerId: (json['customer_id'] as num?)?.toInt(),
      customerName: (json['customer_name'] ?? 'Client Comptoir').toString(),
      priceTier: (json['price_tier'] ?? 'retail').toString(),
      subtotal: (json['subtotal'] as num?)?.toDouble() ?? 0.0,
      discount: (json['discount'] as num?)?.toDouble() ?? 0.0,
      totalAmount: (json['total_amount'] as num?)?.toDouble() ?? 0.0,
      paidAmount: (json['paid_amount'] as num?)?.toDouble() ?? 0.0,
      remainingDebt: (json['remaining_debt'] as num?)?.toDouble() ?? 0.0,
      paymentMethod: (json['payment_method'] ?? 'cash').toString(),
      sourceDevice: (json['source_device'] ?? 'windows_pos').toString(),
      status: (json['status'] ?? 'completed').toString(),
      creditNoteNumber: (json['credit_note_number'] ?? '').toString(),
      createdAt: (json['created_at'] ?? '').toString(),
      items: rawItems
          .whereType<Map>()
          .map((e) => SaleItemRecord.fromJson(Map<String, dynamic>.from(e)))
          .toList(),
    );
  }
}
