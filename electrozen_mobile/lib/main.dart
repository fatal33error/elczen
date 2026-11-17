import 'package:flutter/material.dart';
import 'models/models.dart';
import 'services/api_service.dart';
import 'screens/scanner_screen.dart';
import 'screens/catalog_form_screen.dart';
import 'screens/mobile_pos_screen.dart';
import 'screens/pairing_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final api = ElectroZenApiService();
  await api.loadConfig();
  runApp(ElectroZenMobileApp(api: api));
}

class ElectroZenMobileApp extends StatefulWidget {
  final ElectroZenApiService api;

  const ElectroZenMobileApp({super.key, required this.api});

  @override
  State<ElectroZenMobileApp> createState() => _ElectroZenMobileAppState();
}

class _ElectroZenMobileAppState extends State<ElectroZenMobileApp> {
  int _selectedIndex = 0;
  bool _obsidianDark = false; // Clean daylight look by default
  final List<MobileCartItem> _cart = [];
  Product? _pendingEditProduct;
  String? _pendingNewBarcode;
  Map<String, dynamic>? _pendingInternetPrefill;

  @override
  void initState() {
    super.initState();
    widget.api.pairDevice().catchError((_) => <String, dynamic>{});
  }

  void _addToCart(Product p) {
    final existingIdx = _cart.indexWhere((c) => c.product.id == p.id);
    setState(() {
      if (existingIdx >= 0) {
        _cart[existingIdx].quantity += 1;
      } else {
        _cart.add(
          MobileCartItem(
            product: p,
            quantity: 1,
            unitPrice: p.retailPrice,
            serialNumber: p.availableSerials.isNotEmpty ? p.availableSerials.first.serialNumber : '',
          ),
        );
      }
      _selectedIndex = 2; // Jump to Mobile POS tab
    });
  }

  void _openProductForm(Product? product, String? scannedBarcode, [Map<String, dynamic>? internetPrefill]) {
    setState(() {
      _pendingEditProduct = product;
      _pendingNewBarcode = scannedBarcode;
      _pendingInternetPrefill = internetPrefill;
      _selectedIndex = 1; // Jump to Stock & Products tab
    });
  }

  @override
  Widget build(BuildContext context) {
    final isRtl = widget.api.lang == 'ar';
    return MaterialApp(
      title: 'ELECTROZEN Mobile',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: _obsidianDark ? Brightness.dark : Brightness.light,
        scaffoldBackgroundColor: _obsidianDark ? const Color(0xFF0C111D) : const Color(0xFFF7F8FA),
        colorScheme: ColorScheme.fromSeed(
          brightness: _obsidianDark ? Brightness.dark : Brightness.light,
          seedColor: const Color(0xFF6D28D9),
          primary: const Color(0xFF203361),
          secondary: const Color(0xFF6D28D9),
        ),
        chipTheme: ChipThemeData(
          selectedColor: _obsidianDark ? const Color(0xFF4F46E5) : const Color(0xFFF3EFFE),
          backgroundColor: _obsidianDark ? const Color(0xFF161F33) : const Color(0xFFF7F8FA),
          labelStyle: TextStyle(
            fontSize: 11.5,
            fontWeight: FontWeight.w600,
            color: _obsidianDark ? Colors.white : const Color(0xFF344054),
          ),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            elevation: 0,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
            textStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
          ),
        ),
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            textStyle: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600),
          ),
        ),
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            textStyle: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          isDense: true,
          filled: true,
          fillColor: _obsidianDark ? const Color(0xFF161F33) : const Color(0xFFF9FAFB),
          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 11),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
        ),
        useMaterial3: true,
      ),
      builder: (context, child) {
        return Directionality(
          textDirection: isRtl ? TextDirection.rtl : TextDirection.ltr,
          child: child!,
        );
      },
      home: Scaffold(
        appBar: AppBar(
          backgroundColor: const Color(0xFF203361),
          foregroundColor: Colors.white,
          elevation: 0,
          titleSpacing: 14,
          title: Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Text(
                  'EZ',
                  style: TextStyle(
                    fontFamily: 'monospace',
                    fontWeight: FontWeight.w900,
                    fontSize: 12,
                    color: Color(0xFF203361),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'ELECTROZEN',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w800, letterSpacing: 0.5),
                    ),
                    Text(
                      'Wi-Fi: ${widget.api.host}:${widget.api.port}',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontFamily: 'monospace', fontSize: 10.5, color: Color(0xFFBFC8DC)),
                    ),
                  ],
                ),
              ),
            ],
          ),
          actions: [
            ValueListenableBuilder<bool>(
              valueListenable: widget.api.isOnline,
              builder: (_, online, __) => Container(
                margin: const EdgeInsets.symmetric(vertical: 14),
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                decoration: BoxDecoration(
                  color: (online ? const Color(0xFF39AE52) : const Color(0xFFE21B1B)).withValues(alpha: 0.2),
                  border: Border.all(color: online ? const Color(0xFF39AE52) : const Color(0xFFE21B1B)),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  online ? 'EN LIGNE' : 'HORS LIGNE',
                  style: const TextStyle(fontFamily: 'monospace', fontSize: 9.5, fontWeight: FontWeight.w800),
                ),
              ),
            ),
            IconButton(
              tooltip: 'Mode Clair / Mode Sombre',
              onPressed: () => setState(() => _obsidianDark = !_obsidianDark),
              icon: Icon(_obsidianDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined, size: 19),
            ),
            PopupMenuButton<String>(
              initialValue: widget.api.lang,
              icon: Text(
                widget.api.lang.toUpperCase(),
                style: const TextStyle(fontFamily: 'monospace', fontWeight: FontWeight.w700, fontSize: 12),
              ),
              onSelected: (lang) async {
                await widget.api.saveConfig(
                  newHost: widget.api.host,
                  newPort: widget.api.port,
                  newToken: widget.api.pairingToken,
                  newDeviceName: widget.api.deviceName,
                  newLang: lang,
                );
                setState(() {});
              },
              itemBuilder: (_) => const [
                PopupMenuItem(value: 'fr', child: Text('Français (FR)')),
                PopupMenuItem(value: 'ar', child: Text('العربية (AR)')),
                PopupMenuItem(value: 'en', child: Text('English (EN)')),
              ],
            ),
          ],
        ),
        body: IndexedStack(
          index: _selectedIndex,
          children: [
            ScannerScreen(
              api: widget.api,
              onAddToCart: _addToCart,
              onOpenProductForm: _openProductForm,
            ),
            CatalogFormScreen(
              key: ValueKey('${_pendingEditProduct?.id}-${_pendingNewBarcode ?? ""}-${_pendingInternetPrefill?.hashCode ?? 0}'),
              api: widget.api,
              initialEditProduct: _pendingEditProduct,
              initialScannedBarcode: _pendingNewBarcode,
              initialInternetPrefill: _pendingInternetPrefill,
              onAddToCart: _addToCart,
            ),
            MobilePosScreen(
              api: widget.api,
              cart: _cart,
              onCartUpdated: () => setState(() {}),
            ),
            PairingScreen(
              api: widget.api,
              onConfigChanged: () => setState(() {}),
            ),
          ],
        ),
        bottomNavigationBar: Container(
          decoration: BoxDecoration(
            border: Border(top: BorderSide(color: _obsidianDark ? const Color(0xFF1D2939) : const Color(0xFFE4E7EC))),
          ),
          child: BottomNavigationBar(
            currentIndex: _selectedIndex,
            type: BottomNavigationBarType.fixed,
            backgroundColor: _obsidianDark ? const Color(0xFF101828) : Colors.white,
            selectedItemColor: _obsidianDark ? Colors.white : const Color(0xFF203361),
            unselectedItemColor: const Color(0xFF667085),
            selectedLabelStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 11.5),
            unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.w500, fontSize: 11),
            onTap: (idx) {
              setState(() {
                if (idx != 1) {
                  _pendingEditProduct = null;
                  _pendingNewBarcode = null;
                }
                _selectedIndex = idx;
              });
            },
            items: [
              const BottomNavigationBarItem(
                icon: Icon(Icons.qr_code_scanner, size: 20),
                label: 'Scanner & Prix',
              ),
              const BottomNavigationBarItem(
                icon: Icon(Icons.inventory_2_outlined, size: 20),
                label: 'Produits & Stock',
              ),
              BottomNavigationBarItem(
                icon: Badge(
                  isLabelVisible: _cart.isNotEmpty,
                  label: Text('${_cart.length}'),
                  child: const Icon(Icons.point_of_sale_outlined, size: 20),
                ),
                label: 'POS Mobile',
              ),
              const BottomNavigationBarItem(
                icon: Icon(Icons.wifi_tethering, size: 20),
                label: 'Wi-Fi Sync',
              ),
            ],
          ),
        ),
      ),
    );
  }
}
