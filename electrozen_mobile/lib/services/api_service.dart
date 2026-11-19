import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/models.dart';

class ElectroZenApiService {
  static const String _prefHostKey = 'electrozen_host';
  static const String _prefPortKey = 'electrozen_port';
  static const String _prefTokenKey = 'electrozen_token';
  static const String _prefBearerKey = 'electrozen_bearer_token';
  static const String _prefDeviceKey = 'electrozen_device_name';
  static const String _prefLangKey = 'electrozen_lang';
  static const String _prefProductsCacheKey = 'electrozen_cached_products';

  String host = '192.168.100.38';
  int port = 4000;
  String pairingToken = 'ELECTROZEN-POS-2026';
  String bearerToken = '';
  String deviceName = 'Terminal Flutter Android';
  String lang = 'fr';

  final ValueNotifier<bool> isOnline = ValueNotifier<bool>(false);
  final ValueNotifier<int?> lastLatencyMs = ValueNotifier<int?>(null);
  final ValueNotifier<int> syncRevision = ValueNotifier<int>(0);
  Future<Map<String, dynamic>>? _pairingInFlight;

  String get baseUrl => 'http://$host:$port';

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (bearerToken.isNotEmpty) 'Authorization': 'Bearer $bearerToken',
      };

  Future<void> _ensurePaired({bool force = false}) async {
    if (!force && bearerToken.isNotEmpty) return;
    _pairingInFlight ??= pairDevice().whenComplete(() => _pairingInFlight = null);
    await _pairingInFlight;
  }

  Future<http.Response> _authorizedRequest(Future<http.Response> Function() makeReq) async {
    if (bearerToken.isEmpty) {
      await _ensurePaired();
    }
    var res = await makeReq();
    if (res.statusCode == 401) {
      bearerToken = '';
      await _ensurePaired(force: true);
      res = await makeReq();
    }
    return res;
  }

  Future<String?> discoverLanServer() async {
    final candidates = <String>{};
    if (host.isNotEmpty) candidates.add(host);
    final parts = host.split('.');
    if (parts.length == 4) {
      final prefix = '${parts[0]}.${parts[1]}.${parts[2]}';
      for (int i = 1; i <= 254; i++) {
        candidates.add('$prefix.$i');
      }
    }
    for (final p in ['192.168.100', '192.168.1', '192.168.0']) {
      for (int i = 2; i <= 60; i++) {
        candidates.add('$p.$i');
      }
    }

    Future<String?> probe(String ip) async {
      try {
        final res = await http
            .get(Uri.parse('http://$ip:$port/api/network-info'))
            .timeout(const Duration(milliseconds: 550));
        if (res.statusCode == 200) {
          final body = jsonDecode(res.body);
          if (body is Map && body['storeName'] != null) {
            return ip;
          }
        }
      } catch (_) {}
      return null;
    }

    final list = candidates.toList();
    for (int i = 0; i < list.length; i += 28) {
      final chunk = list.sublist(i, (i + 28).clamp(0, list.length));
      final results = await Future.wait(chunk.map(probe));
      final hit = results.whereType<String>().firstOrNull;
      if (hit != null) return hit;
    }
    return null;
  }

  Future<void> loadConfig() async {
    final prefs = await SharedPreferences.getInstance();
    host = prefs.getString(_prefHostKey) ?? '192.168.100.38';
    port = prefs.getInt(_prefPortKey) ?? 4000;
    pairingToken = prefs.getString(_prefTokenKey) ?? 'ELECTROZEN-POS-2026';
    bearerToken = prefs.getString(_prefBearerKey) ?? '';
    deviceName = prefs.getString(_prefDeviceKey) ?? 'Terminal Flutter Android';
    lang = prefs.getString(_prefLangKey) ?? 'fr';
  }

  Future<void> saveConfig({
    required String newHost,
    required int newPort,
    required String newToken,
    required String newDeviceName,
    String? newLang,
    String? newBearerToken,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    host = newHost.trim();
    port = newPort;
    pairingToken = newToken.trim();
    deviceName = newDeviceName.trim();
    if (newLang != null) lang = newLang;
    if (newBearerToken != null) bearerToken = newBearerToken;

    await prefs.setString(_prefHostKey, host);
    await prefs.setInt(_prefPortKey, port);
    await prefs.setString(_prefTokenKey, pairingToken);
    await prefs.setString(_prefBearerKey, bearerToken);
    await prefs.setString(_prefDeviceKey, deviceName);
    await prefs.setString(_prefLangKey, lang);
  }

  Future<void> _cacheProductsJson(String rawJson) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_prefProductsCacheKey, rawJson);
    } catch (_) {}
  }

  Future<List<Product>> _loadCachedProducts() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_prefProductsCacheKey);
      if (raw == null || raw.isEmpty) return [];
      final dynamic decoded = jsonDecode(raw);
      if (decoded is! List) return [];
      final products = <Product>[];
      for (var item in decoded) {
        if (item is String) {
          try {
            item = jsonDecode(item);
          } catch (_) {}
        }
        if (item is Map) {
          try {
            products.add(Product.fromJson(Map<String, dynamic>.from(item)));
          } catch (_) {}
        }
      }
      return products;
    } catch (_) {
      return [];
    }
  }

  Future<Map<String, dynamic>> pairDevice() async {
    final stopwatch = Stopwatch()..start();
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/api/android/pair'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'deviceId': 'flutter-${deviceName.hashCode.abs()}',
              'deviceName': deviceName,
              'token': pairingToken,
            }),
          )
          .timeout(const Duration(seconds: 5));
      stopwatch.stop();

      if (response.statusCode != 200) {
        isOnline.value = false;
        throw Exception('Pairing failed (${response.statusCode}): ${response.body}');
      }
      isOnline.value = true;
      lastLatencyMs.value = stopwatch.elapsedMilliseconds;
      final dynamic decoded = jsonDecode(response.body);
      final Map<String, dynamic> data = decoded is Map
          ? Map<String, dynamic>.from(decoded)
          : <String, dynamic>{};
      final issuedToken = (data['accessToken'] ?? '').toString();
      if (issuedToken.isNotEmpty) {
        await saveConfig(
          newHost: host,
          newPort: port,
          newToken: pairingToken,
          newDeviceName: deviceName,
          newBearerToken: issuedToken,
        );
      }
      syncRevision.value += 1;
      data['latencyMs'] = stopwatch.elapsedMilliseconds;
      return data;
    } catch (e) {
      isOnline.value = false;
      rethrow;
    }
  }

  Future<Product?> lookupBarcode(String barcode) async {
    final clean = barcode.trim();
    final encoded = Uri.encodeComponent(clean);
    final sw = Stopwatch()..start();
    try {
      final response = await _authorizedRequest(
        () => http
            .get(Uri.parse('$baseUrl/api/products/barcode/$encoded'), headers: _headers)
            .timeout(const Duration(seconds: 5)),
      );
      sw.stop();
      isOnline.value = true;
      lastLatencyMs.value = sw.elapsedMilliseconds;

      if (response.statusCode == 404) {
        return null;
      }
      if (response.statusCode != 200) {
        throw Exception('Server error (${response.statusCode})');
      }
      final dynamic decoded = jsonDecode(response.body);
      if (decoded is! Map) return null;
      return Product.fromJson(Map<String, dynamic>.from(decoded));
    } catch (_) {
      isOnline.value = false;
      // Offline fallback from local catalog cache
      final cached = await _loadCachedProducts();
      for (final p in cached) {
        if (p.barcode.toLowerCase() == clean.toLowerCase() ||
            p.sku.toLowerCase() == clean.toLowerCase() ||
            p.modelNumber.toLowerCase() == clean.toLowerCase()) {
          return p;
        }
      }
      rethrow;
    }
  }

  Future<List<Product>> fetchProducts({String search = '', String category = '', int? limit}) async {
    final query = <String, String>{};
    if (search.trim().isNotEmpty) query['search'] = search.trim();
    if (category.trim().isNotEmpty && category != 'ALL') query['category'] = category.trim();
    if (limit != null && limit > 0) query['limit'] = '$limit';

    final uri = Uri.parse('$baseUrl/api/products').replace(
      queryParameters: query.isEmpty ? null : query,
    );
    try {
      final response = await _authorizedRequest(
        () => http.get(uri, headers: _headers).timeout(const Duration(seconds: 8)),
      );
      if (response.statusCode != 200) {
        throw Exception('HTTP ${response.statusCode}: impossible de charger les produits');
      }
      isOnline.value = true;
      if (query.isEmpty) {
        await _cacheProductsJson(response.body);
      }
      final dynamic decoded = jsonDecode(response.body);
      if (decoded is! List) {
        throw Exception('Réponse inattendue: format de liste attendu');
      }
      final products = <Product>[];
      for (var item in decoded) {
        if (item is String) {
          try {
            item = jsonDecode(item);
          } catch (_) {}
        }
        if (item is Map) {
          try {
            products.add(Product.fromJson(Map<String, dynamic>.from(item)));
          } catch (_) {}
        }
      }
      return products;
    } catch (e) {
      isOnline.value = false;
      final cached = await _loadCachedProducts();
      if (cached.isNotEmpty) {
        final q = search.trim().toLowerCase();
        return cached
            .where((p) =>
                q.isEmpty ||
                p.nameFr.toLowerCase().contains(q) ||
                p.brand.toLowerCase().contains(q) ||
                p.barcode.toLowerCase().contains(q) ||
                p.modelNumber.toLowerCase().contains(q))
            .toList();
      }
      rethrow;
    }
  }

  Future<Product> saveProduct(Map<String, dynamic> payload, {int? editId}) async {
    final isEdit = editId != null && editId > 0;
    final uri = Uri.parse(isEdit ? '$baseUrl/api/products/$editId' : '$baseUrl/api/products');
    final response = await _authorizedRequest(
      () => (isEdit
              ? http.put(uri, headers: _headers, body: jsonEncode(payload))
              : http.post(uri, headers: _headers, body: jsonEncode(payload)))
          .timeout(const Duration(seconds: 6)),
    );

    if (response.statusCode != 200 && response.statusCode != 201) {
      final err = jsonDecode(response.body);
      throw Exception(err['error'] ?? 'Failed to save product');
    }
    syncRevision.value += 1;
    final data = jsonDecode(response.body) as Map<String, dynamic>;
    return Product.fromJson(data);
  }

  Future<void> addSerialNumbers(int productId, List<String> serials, {String notes = ''}) async {
    final response = await _authorizedRequest(
      () => http
          .post(
            Uri.parse('$baseUrl/api/products/$productId/serials'),
            headers: _headers,
            body: jsonEncode({
              'serial_numbers': serials,
              'notes': notes,
            }),
          )
          .timeout(const Duration(seconds: 5)),
    );

    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('Failed to register serial numbers');
    }
  }

  Future<Map<String, dynamic>> lookupBarcodeOnInternet(String barcode) async {
    final clean = barcode.trim();
    final encoded = Uri.encodeComponent(clean);
    final response = await _authorizedRequest(
      () => http
          .get(Uri.parse('$baseUrl/api/products/internet-lookup/$encoded'), headers: _headers)
          .timeout(const Duration(seconds: 12)),
    );
    if (response.statusCode != 200) {
      throw Exception('Internet lookup error (${response.statusCode})');
    }
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> generateAiProductInfo({
    String barcode = '',
    required String brand,
    required String modelNumber,
    required String category,
    String hintName = '',
  }) async {
    final response = await _authorizedRequest(
      () => http
          .post(
            Uri.parse('$baseUrl/api/ai/generate-product'),
            headers: _headers,
            body: jsonEncode({
              'barcode': barcode,
              'brand': brand,
              'model_number': modelNumber,
              'category': category,
              'hint_name': hintName,
            }),
          )
          .timeout(const Duration(seconds: 15)),
    );

    if (response.statusCode != 200) {
      throw Exception('AI generation failed');
    }
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  Future<List<Customer>> fetchCustomers() async {
    final response = await _authorizedRequest(
      () => http.get(Uri.parse('$baseUrl/api/customers'), headers: _headers).timeout(const Duration(seconds: 5)),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to load customers (${response.statusCode})');
    }
    final dynamic decoded = jsonDecode(response.body);
    if (decoded is! List) return [];
    final customers = <Customer>[];
    for (final e in decoded) {
      if (e is Map) {
        customers.add(Customer.fromJson(Map<String, dynamic>.from(e)));
      }
    }
    return customers;
  }

  Future<Customer> createCustomer({
    required String fullName,
    required String phone,
    String nationalId = '',
    String address = '',
  }) async {
    final response = await _authorizedRequest(
      () => http
          .post(
            Uri.parse('$baseUrl/api/customers'),
            headers: _headers,
            body: jsonEncode({
              'name': fullName,
              'phone': phone,
              'national_id': nationalId,
              'address': address,
            }),
          )
          .timeout(const Duration(seconds: 5)),
    );

    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('Failed to create customer');
    }
    final dynamic decoded = jsonDecode(response.body);
    return Customer.fromJson(decoded is Map ? Map<String, dynamic>.from(decoded) : <String, dynamic>{});
  }

  Future<Map<String, dynamic>> submitMobileSale({
    required String saleType,
    int? customerId,
    required List<MobileCartItem> items,
    required double discountAmount,
    required double paidAmount,
    required String paymentMethod,
    required int installmentsCount,
  }) async {
    final response = await _authorizedRequest(
      () => http
          .post(
            Uri.parse('$baseUrl/api/sales'),
            headers: _headers,
            body: jsonEncode({
              'price_tier': saleType,
              'customer_id': customerId,
              'discount': discountAmount,
              'paid_amount': paidAmount,
              'payment_method': paymentMethod,
              'installments_count': installmentsCount,
              'source_device': deviceName,
              'items': items
                  .map((item) => {
                        'product_id': item.product.id,
                        'quantity': item.quantity,
                        'unit_price': item.unitPrice,
                        'serial_number': item.serialNumber,
                      })
                  .toList(),
            }),
          )
          .timeout(const Duration(seconds: 6)),
    );

    if (response.statusCode != 200 && response.statusCode != 201) {
      final err = jsonDecode(response.body);
      throw Exception(err['error'] ?? 'Failed to complete sale');
    }
    syncRevision.value += 1;
    final dynamic decoded = jsonDecode(response.body);
    return decoded is Map ? Map<String, dynamic>.from(decoded) : <String, dynamic>{};
  }

  Future<Map<String, dynamic>> fetchDashboard({String range = 'all'}) async {
    try {
      final response = await _authorizedRequest(
        () => http
            .get(
              Uri.parse('$baseUrl/api/dashboard?range=$range'),
              headers: _headers,
            )
            .timeout(const Duration(seconds: 4)),
      );
      if (response.statusCode == 200) {
        final dynamic decoded = jsonDecode(response.body);
        return decoded is Map ? Map<String, dynamic>.from(decoded) : <String, dynamic>{};
      }
    } catch (_) {}
    return {};
  }

  Future<List<Map<String, dynamic>>> fetchSales() async {
    try {
      final response = await _authorizedRequest(
        () => http
            .get(
              Uri.parse('$baseUrl/api/sales'),
              headers: _headers,
            )
            .timeout(const Duration(seconds: 6)),
      );
      if (response.statusCode == 200) {
        final dynamic decoded = jsonDecode(response.body);
        if (decoded is List) {
          final list = <Map<String, dynamic>>[];
          for (final e in decoded) {
            if (e is Map) {
              list.add(Map<String, dynamic>.from(e));
            }
          }
          return list;
        }
      }
    } catch (_) {}
    return [];
  }

  Future<Map<String, String>> fetchStoreSettings() async {
    try {
      final response = await _authorizedRequest(
        () => http
            .get(
              Uri.parse('$baseUrl/api/settings'),
              headers: _headers,
            )
            .timeout(const Duration(seconds: 4)),
      );
      if (response.statusCode == 200) {
        final dynamic decoded = jsonDecode(response.body);
        final map = <String, String>{};
        if (decoded is List) {
          for (final item in decoded) {
            if (item is Map && item['key'] != null) {
              map[item['key'].toString()] = item['value']?.toString() ?? '';
            }
          }
        }
        return map;
      }
    } catch (_) {}
    return {};
  }

  Future<Map<String, dynamic>> scanProviderBill({String? imageBase64, String? rawText, String? mimeType}) async {
    final response = await _authorizedRequest(
      () => http
          .post(
            Uri.parse('$baseUrl/api/ai/scan-bill'),
            headers: _headers,
            body: jsonEncode({
              'imageBase64': imageBase64,
              'rawText': rawText,
              'mimeType': mimeType ?? 'image/jpeg',
            }),
          )
          .timeout(const Duration(seconds: 25)),
    );
    if (response.statusCode != 200) {
      final err = jsonDecode(response.body);
      throw Exception(err['error'] ?? 'Échec de l\'analyse de la facture');
    }
    final dynamic decoded = jsonDecode(response.body);
    return decoded is Map ? Map<String, dynamic>.from(decoded) : <String, dynamic>{};
  }

  Future<List<Map<String, dynamic>>> fetchSuppliers() async {
    try {
      final response = await _authorizedRequest(
        () => http
            .get(
              Uri.parse('$baseUrl/api/suppliers'),
              headers: _headers,
            )
            .timeout(const Duration(seconds: 4)),
      );
      if (response.statusCode == 200) {
        final dynamic decoded = jsonDecode(response.body);
        if (decoded is List) {
          final list = <Map<String, dynamic>>[];
          for (final e in decoded) {
            if (e is Map) {
              list.add(Map<String, dynamic>.from(e));
            }
          }
          return list;
        }
      }
    } catch (_) {}
    return [];
  }

  Future<Map<String, dynamic>> submitPurchase(Map<String, dynamic> payload) async {
    final response = await _authorizedRequest(
      () => http
          .post(
            Uri.parse('$baseUrl/api/purchases'),
            headers: _headers,
            body: jsonEncode(payload),
          )
          .timeout(const Duration(seconds: 8)),
    );
    if (response.statusCode != 200 && response.statusCode != 201) {
      final err = jsonDecode(response.body);
      throw Exception(err['error'] ?? 'Échec de l\'enregistrement de l\'achat');
    }
    syncRevision.value += 1;
    final dynamic decoded = jsonDecode(response.body);
    return decoded is Map ? Map<String, dynamic>.from(decoded) : <String, dynamic>{};
  }
}
