import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'models/models.dart';
import 'services/api_service.dart';
import 'screens/scanner_screen.dart';
import 'screens/catalog_form_screen.dart';
import 'screens/mobile_pos_screen.dart';
import 'screens/pairing_screen.dart';
import 'screens/sales_history_screen.dart';
import 'screens/invoice_scanner_screen.dart';

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

  final GlobalKey<ScannerScreenState> _scannerKey = GlobalKey<ScannerScreenState>();
  final GlobalKey<CatalogFormScreenState> _catalogKey = GlobalKey<CatalogFormScreenState>();
  DateTime? _lastBackPressTime;

  @override
  void initState() {
    super.initState();
    widget.api.pairDevice().catchError((_) => <String, dynamic>{});
  }

  void _handleBack() {
    // 1. If inside Catalog tab and the create/edit form is showing, close form first
    if (_selectedIndex == 1 && _catalogKey.currentState?.isShowingForm == true) {
      _catalogKey.currentState?.handleBack();
      return;
    }
    // 2. If inside Scanner tab and a scanned product inspector is showing, clear it first
    if (_selectedIndex == 0 && _scannerKey.currentState?.hasScannedProduct == true) {
      _scannerKey.currentState?.clearScannedProduct();
      return;
    }
    // 3. If in another tab (Products or POS), go back to Scanner / Dashboard tab
    if (_selectedIndex != 0) {
      setState(() {
        _pendingEditProduct = null;
        _pendingNewBarcode = null;
        _selectedIndex = 0;
      });
      return;
    }
    // 4. If already on Tab 0 home, double-back to exit application safely
    final now = DateTime.now();
    if (_lastBackPressTime == null || now.difference(_lastBackPressTime!) > const Duration(seconds: 2)) {
      _lastBackPressTime = now;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Appuyez à nouveau pour quitter ELECTROZEN'),
          duration: Duration(seconds: 2),
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }
    SystemNavigator.pop();
  }

  void _openPairingModal(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (ctx) => Scaffold(
          appBar: AppBar(
            backgroundColor: const Color(0xFF203361),
            foregroundColor: Colors.white,
            elevation: 0,
            title: const Text('Wi-Fi Sync & Appairage Serveur', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
            leading: IconButton(
              icon: const Icon(Icons.arrow_back),
              tooltip: 'Retour',
              onPressed: () => Navigator.of(ctx).pop(),
            ),
          ),
          body: PairingScreen(
            api: widget.api,
            onConfigChanged: () => setState(() {}),
          ),
        ),
      ),
    );
  }

  void _openSalesHistory(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => SalesHistoryScreen(api: widget.api),
      ),
    );
  }

  void _openInvoiceScanner(BuildContext context) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => InvoiceScannerScreen(api: widget.api),
      ),
    );
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
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _catalogKey.currentState?.openProductEditor(product, scannedBarcode, internetPrefill);
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
      home: Builder(
        builder: (homeContext) {
          final isScanningProduct = _selectedIndex == 0 && _scannerKey.currentState?.hasScannedProduct == true;
          final isEditingCatalog = _selectedIndex == 1 && _catalogKey.currentState?.isShowingForm == true;
          final showBackArrow = _selectedIndex != 0 || isScanningProduct || isEditingCatalog;

          return PopScope(
            canPop: false,
            onPopInvokedWithResult: (didPop, result) async {
              if (didPop) return;
              _handleBack();
            },
            child: Scaffold(
              appBar: AppBar(
                backgroundColor: const Color(0xFF203361),
                foregroundColor: Colors.white,
                elevation: 0,
                titleSpacing: 8,
                leading: showBackArrow
                    ? IconButton(
                        icon: const Icon(Icons.arrow_back),
                        tooltip: 'Retour',
                        onPressed: _handleBack,
                      )
                    : IconButton(
                        icon: const Icon(Icons.more_vert),
                        tooltip: 'Wi-Fi Sync & Connexion Serveur',
                        onPressed: () => _openPairingModal(homeContext),
                      ),
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
                    const SizedBox(width: 8),
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
                            style: const TextStyle(fontFamily: 'monospace', fontSize: 10, color: Color(0xFFBFC8DC)),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                actions: [
                  InkWell(
                    onTap: () => _openPairingModal(homeContext),
                    borderRadius: BorderRadius.circular(12),
                    child: ValueListenableBuilder<bool>(
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
                    key: _scannerKey,
                    api: widget.api,
                    onAddToCart: _addToCart,
                    onOpenProductForm: _openProductForm,
                    onOpenPos: () => setState(() => _selectedIndex = 2),
                    onOpenCatalog: () => setState(() => _selectedIndex = 1),
                    onOpenPairing: () => _openPairingModal(homeContext),
                    onOpenSalesHistory: () => _openSalesHistory(homeContext),
                    onOpenInvoiceScanner: () => _openInvoiceScanner(homeContext),
                  ),
                  CatalogFormScreen(
                    key: _catalogKey,
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
                    onOpenSalesHistory: () => _openSalesHistory(homeContext),
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
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
