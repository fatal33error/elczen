import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/models.dart';
import '../services/api_service.dart';
import '../widgets/barcode_scanner_modal.dart';

class ScannerScreen extends StatefulWidget {
  final ElectroZenApiService api;
  final void Function(Product product) onAddToCart;
  final void Function(Product? product, String? scannedBarcode, [Map<String, dynamic>? prefill]) onOpenProductForm;
  final VoidCallback? onOpenPos;
  final VoidCallback? onOpenCatalog;
  final VoidCallback? onOpenPairing;
  final VoidCallback? onOpenSalesHistory;
  final VoidCallback? onOpenInvoiceScanner;

  const ScannerScreen({
    super.key,
    required this.api,
    required this.onAddToCart,
    required this.onOpenProductForm,
    this.onOpenPos,
    this.onOpenCatalog,
    this.onOpenPairing,
    this.onOpenSalesHistory,
    this.onOpenInvoiceScanner,
  });

  @override
  State<ScannerScreen> createState() => ScannerScreenState();
}

class ScannerScreenState extends State<ScannerScreen> {
  final TextEditingController _barcodeInputCtrl = TextEditingController();

  bool _loading = false;
  bool _hideBuyingCosts = true; // Customer-safe by default
  String? _errorMsg;
  String? _notFoundBarcode;
  Product? _scannedProduct;

  bool _loadingDashboard = false;
  Map<String, dynamic> _dashboardStats = {};
  List<Product> _dashboardRecentProducts = [];

  final NumberFormat _madFmt = NumberFormat('#,##0.00', 'fr_FR');

  String _formatMad(double value) => '${_madFmt.format(value)} MAD';

  bool get hasScannedProduct => _scannedProduct != null || _notFoundBarcode != null;

  bool clearScannedProduct() {
    if (_scannedProduct != null || _notFoundBarcode != null) {
      setState(() {
        _scannedProduct = null;
        _notFoundBarcode = null;
        _barcodeInputCtrl.clear();
      });
      return true;
    }
    return false;
  }

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
  }

  Future<void> _loadDashboardData() async {
    if (_loadingDashboard) return;
    setState(() => _loadingDashboard = true);
    try {
      final dashFuture = widget.api.fetchDashboard();
      final prodsFuture = widget.api.fetchProducts(limit: 6);
      final results = await Future.wait([dashFuture, prodsFuture]);
      if (!mounted) return;
      setState(() {
        _dashboardStats = results[0] as Map<String, dynamic>;
        _dashboardRecentProducts = results[1] as List<Product>;
        _loadingDashboard = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _loadingDashboard = false);
    }
  }

  Future<void> _openCamera() async {
    final code = await BarcodeScannerModal.scan(context, title: 'Scanner Code-Barres Produit');
    if (code != null && code.isNotEmpty) {
      await _lookupCode(code);
    }
  }

  Future<void> _lookupCode(String rawCode) async {
    final code = rawCode.trim();
    if (code.isEmpty) return;

    setState(() {
      _loading = true;
      _errorMsg = null;
      _notFoundBarcode = null;
      _barcodeInputCtrl.text = code;
    });

    try {
      final prod = await widget.api.lookupBarcode(code);
      if (!mounted) return;
      setState(() {
        _loading = false;
        _scannedProduct = prod;
        if (prod == null) {
          _notFoundBarcode = code;
        }
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _errorMsg = e.toString();
      });
    }
  }

  @override
  void dispose() {
    _barcodeInputCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? const Color(0xFF101828) : Colors.white;
    final subtleBg = isDark ? const Color(0xFF161F33) : const Color(0xFFEEF2F8);
    final borderCol = isDark ? const Color(0xFF1D2939) : const Color(0xFFE4E7EC);
    final inkPrimary = isDark ? const Color(0xFFF9FAFB) : const Color(0xFF101828);
    final inkMuted = isDark ? const Color(0xFF98A2B3) : const Color(0xFF667085);

    return RefreshIndicator(
      onRefresh: _loadDashboardData,
      child: ListView(
        padding: const EdgeInsets.all(14),
        children: [
          // 1. SCANNER BARCODE CARD
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: cardBg,
              border: Border.all(color: borderCol),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'SCANNER CODE-BARRES & PRIX',
                      style: TextStyle(
                        fontSize: 10.5,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.6,
                        color: inkMuted,
                      ),
                    ),
                    InkWell(
                      onTap: () => setState(() => _hideBuyingCosts = !_hideBuyingCosts),
                      borderRadius: BorderRadius.circular(6),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
                        decoration: BoxDecoration(
                          color: _hideBuyingCosts ? const Color(0xFF1C61E7) : subtleBg,
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(
                            color: _hideBuyingCosts ? const Color(0xFF3B82F6) : borderCol,
                          ),
                        ),
                        child: Text(
                          _hideBuyingCosts ? 'Mode Client (Coûts Masqués)' : 'Coûts & Marges Visibles',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: _hideBuyingCosts ? Colors.white : inkPrimary,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _barcodeInputCtrl,
                        keyboardType: TextInputType.text,
                        style: TextStyle(
                          fontFamily: 'monospace',
                          fontSize: 13.5,
                          fontWeight: FontWeight.w600,
                          color: inkPrimary,
                        ),
                        decoration: InputDecoration(
                          hintText: 'Code-barres EAN / SKU / Modèle...',
                          isDense: true,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 11, vertical: 12),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        onSubmitted: _lookupCode,
                      ),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1C61E7),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      onPressed: () => _lookupCode(_barcodeInputCtrl.text),
                      child: const Text('Chercher', style: TextStyle(fontWeight: FontWeight.w600)),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF203361),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  onPressed: _openCamera,
                  icon: const Icon(Icons.qr_code_scanner, size: 19),
                  label: const Text('Ouvrir Caméra Scanner', style: TextStyle(fontWeight: FontWeight.w700)),
                ),
              ],
            ),
          ),

          if (_loading)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(20),
                child: CircularProgressIndicator(strokeWidth: 2),
              ),
            ),

          if (_errorMsg != null) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFF7F1D1D).withValues(alpha: 0.15),
                border: Border.all(color: const Color(0xFFEF4444).withValues(alpha: 0.4)),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                _errorMsg!,
                style: const TextStyle(color: Color(0xFFF87171), fontSize: 12.5, fontWeight: FontWeight.w600),
              ),
            ),
          ],

          if (_notFoundBarcode != null) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: cardBg,
                border: Border.all(color: borderCol),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          'Code-barres non trouvé : $_notFoundBarcode',
                          style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: inkPrimary),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, size: 18),
                        onPressed: clearScannedProduct,
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Ce produit n\'existe pas encore dans la base SQLite ELECTROZEN.',
                    style: TextStyle(color: inkMuted, fontSize: 12.5),
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF1C61E7),
                          foregroundColor: Colors.white,
                        ),
                        onPressed: () async {
                          final code = _notFoundBarcode!;
                          setState(() => _loading = true);
                          try {
                            final prefill = await widget.api.lookupBarcodeOnInternet(code);
                            if (!mounted) return;
                            setState(() => _loading = false);
                            widget.onOpenProductForm(null, code, prefill);
                          } catch (_) {
                            if (!mounted) return;
                            setState(() => _loading = false);
                            widget.onOpenProductForm(null, code, {'found': false});
                          }
                        },
                        icon: const Icon(Icons.public, size: 17),
                        label: const Text('Chercher sur Internet & Créer'),
                      ),
                      OutlinedButton(
                        onPressed: () => widget.onOpenProductForm(null, _notFoundBarcode),
                        child: const Text('+ Saisie Manuelle'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],

          if (_scannedProduct != null) ...[
            const SizedBox(height: 12),
            _buildProductInspectorCard(_scannedProduct!, isDark, cardBg, subtleBg, borderCol, inkPrimary, inkMuted),
          ],

          const SizedBox(height: 16),

          // 2. DASHBOARD SECTION
          _buildDashboardSection(isDark, cardBg, subtleBg, borderCol, inkPrimary, inkMuted),
        ],
      ),
    );
  }

  Widget _quickActionTile({
    required IconData icon,
    required Color accentColor,
    required String title,
    required String subtitle,
    required Color subtleBg,
    required Color borderCol,
    required Color inkPrimary,
    required Color inkMuted,
    VoidCallback? onTap,
  }) {
    return Material(
      color: subtleBg,
      borderRadius: BorderRadius.circular(11),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(11),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 11),
          decoration: BoxDecoration(
            border: Border.all(color: borderCol),
            borderRadius: BorderRadius.circular(11),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: accentColor.withValues(alpha: 0.14),
                  borderRadius: BorderRadius.circular(9),
                ),
                child: Icon(icon, size: 19, color: accentColor),
              ),
              const SizedBox(width: 9),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(fontSize: 12.2, fontWeight: FontWeight.w800, color: inkPrimary),
                    ),
                    const SizedBox(height: 1),
                    Text(
                      subtitle,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(fontSize: 10, color: inkMuted),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDashboardSection(
    bool isDark,
    Color cardBg,
    Color subtleBg,
    Color borderCol,
    Color inkPrimary,
    Color inkMuted,
  ) {
    final prodStats = (_dashboardStats['productStats'] as Map<String, dynamic>?) ?? {};
    final salesStats = (_dashboardStats['salesStats'] as Map<String, dynamic>?) ?? {};

    final totalProducts = (prodStats['totalProducts'] as num?)?.toInt() ?? _dashboardRecentProducts.length;
    final totalUnits = (prodStats['totalUnits'] as num?)?.toInt() ?? 0;
    final stockValueRetail = (prodStats['stockValueRetail'] as num?)?.toDouble() ?? 0.0;
    final lowStockCount = (prodStats['lowStockCount'] as num?)?.toInt() ?? 0;
    final totalRevenue = (salesStats['totalRevenue'] as num?)?.toDouble() ?? 0.0;
    final totalSalesCount = (salesStats['totalSalesCount'] as num?)?.toInt() ?? 0;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: cardBg,
        border: Border.all(color: borderCol),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: const Color(0xFF6D28D9).withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(Icons.dashboard_outlined, size: 18, color: Color(0xFF6D28D9)),
                  ),
                  const SizedBox(width: 8),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'TABLEAU DE BORD DU MAGASIN',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.4,
                          color: inkPrimary,
                        ),
                      ),
                      Text(
                        'Activité & Métriques en direct',
                        style: TextStyle(fontSize: 10.5, color: inkMuted),
                      ),
                    ],
                  ),
                ],
              ),
              IconButton(
                icon: _loadingDashboard
                    ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2))
                    : Icon(Icons.refresh, size: 19, color: inkMuted),
                tooltip: 'Actualiser les statistiques',
                onPressed: _loadingDashboard ? null : _loadDashboardData,
              ),
            ],
          ),

          const SizedBox(height: 12),

          // 2x2 Ergonomic Quick-Action Grid
          Text(
            'ACTIONS RAPIDES',
            style: TextStyle(
              fontSize: 10.5,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.5,
              color: inkMuted,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: _quickActionTile(
                  icon: Icons.add_box_outlined,
                  accentColor: const Color(0xFF1C61E7),
                  title: '+ Ajout Rapide',
                  subtitle: 'Fiche ou photo IA',
                  subtleBg: subtleBg,
                  borderCol: borderCol,
                  inkPrimary: inkPrimary,
                  inkMuted: inkMuted,
                  onTap: () => widget.onOpenProductForm(null, null),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _quickActionTile(
                  icon: Icons.document_scanner_outlined,
                  accentColor: const Color(0xFF059669),
                  title: 'Facture Achat IA',
                  subtitle: 'Scanner & stock',
                  subtleBg: subtleBg,
                  borderCol: borderCol,
                  inkPrimary: inkPrimary,
                  inkMuted: inkMuted,
                  onTap: widget.onOpenInvoiceScanner,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: _quickActionTile(
                  icon: Icons.point_of_sale_outlined,
                  accentColor: const Color(0xFF6D28D9),
                  title: 'Caisse POS',
                  subtitle: 'Encaisser & ticket',
                  subtleBg: subtleBg,
                  borderCol: borderCol,
                  inkPrimary: inkPrimary,
                  inkMuted: inkMuted,
                  onTap: widget.onOpenPos,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _quickActionTile(
                  icon: Icons.receipt_long_outlined,
                  accentColor: const Color(0xFFD97706),
                  title: 'Ventes & Garanties',
                  subtitle: 'Historique & PDF',
                  subtleBg: subtleBg,
                  borderCol: borderCol,
                  inkPrimary: inkPrimary,
                  inkMuted: inkMuted,
                  onTap: widget.onOpenSalesHistory,
                ),
              ),
            ],
          ),

          const SizedBox(height: 14),

          // 4 KPI Cards Grid (2 rows x 2 columns)
          Row(
            children: [
              Expanded(
                child: _kpiCard(
                  title: 'CATALOGUE',
                  value: '$totalProducts',
                  unit: 'Articles',
                  subtext: totalUnits > 0 ? '$totalUnits unités en stock' : 'Stock géré',
                  icon: Icons.inventory_2_outlined,
                  iconColor: const Color(0xFF203361),
                  badgeBg: const Color(0xFF203361).withValues(alpha: 0.1),
                  subtleBg: subtleBg,
                  borderCol: borderCol,
                  inkPrimary: inkPrimary,
                  inkMuted: inkMuted,
                  onTap: widget.onOpenCatalog,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _kpiCard(
                  title: 'VALEUR VENTE',
                  value: _formatMad(stockValueRetail),
                  unit: '',
                  subtext: 'Tarif public TTC',
                  icon: Icons.point_of_sale_outlined,
                  iconColor: const Color(0xFF10B981),
                  badgeBg: const Color(0xFF10B981).withValues(alpha: 0.1),
                  subtleBg: subtleBg,
                  borderCol: borderCol,
                  inkPrimary: inkPrimary,
                  inkMuted: inkMuted,
                  isMonetary: true,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: _kpiCard(
                  title: 'ALERTES STOCK',
                  value: '$lowStockCount',
                  unit: 'Seuil min',
                  subtext: lowStockCount > 0 ? 'Articles à réapprovisionner' : 'Stock en bon état',
                  icon: Icons.warning_amber_rounded,
                  iconColor: lowStockCount > 0 ? const Color(0xFFE11D48) : const Color(0xFF10B981),
                  badgeBg: (lowStockCount > 0 ? const Color(0xFFE11D48) : const Color(0xFF10B981)).withValues(alpha: 0.1),
                  subtleBg: subtleBg,
                  borderCol: borderCol,
                  inkPrimary: inkPrimary,
                  inkMuted: inkMuted,
                  onTap: widget.onOpenCatalog,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _kpiCard(
                  title: 'VENTES COMPTOIR',
                  value: _formatMad(totalRevenue),
                  unit: '',
                  subtext: '$totalSalesCount ventes enregistrées',
                  icon: Icons.receipt_long_outlined,
                  iconColor: const Color(0xFF6D28D9),
                  badgeBg: const Color(0xFF6D28D9).withValues(alpha: 0.1),
                  subtleBg: subtleBg,
                  borderCol: borderCol,
                  inkPrimary: inkPrimary,
                  inkMuted: inkMuted,
                  isMonetary: true,
                  onTap: widget.onOpenPos,
                ),
              ),
            ],
          ),

          // Recent / Quick Access Products
          if (_dashboardRecentProducts.isNotEmpty) ...[
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'APERÇU RAPIDE CATALOGUE',
                  style: TextStyle(
                    fontSize: 10.5,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.5,
                    color: inkMuted,
                  ),
                ),
                TextButton(
                  style: TextButton.styleFrom(
                    visualDensity: VisualDensity.compact,
                    padding: EdgeInsets.zero,
                  ),
                  onPressed: widget.onOpenCatalog,
                  child: const Text('Voir tout >', style: TextStyle(fontSize: 11.5)),
                ),
              ],
            ),
            const SizedBox(height: 8),
            SizedBox(
              height: 145,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _dashboardRecentProducts.length,
                separatorBuilder: (_, __) => const SizedBox(width: 10),
                itemBuilder: (ctx, i) {
                  final p = _dashboardRecentProducts[i];
                  final isLowStock = p.stockQuantity <= p.minStockAlert;
                  return InkWell(
                    onTap: () {
                      setState(() {
                        _scannedProduct = p;
                        _barcodeInputCtrl.text = p.barcode;
                      });
                    },
                    borderRadius: BorderRadius.circular(10),
                    child: Container(
                      width: 140,
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: subtleBg,
                        border: Border.all(color: borderCol),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                p.brand.toUpperCase(),
                                style: TextStyle(
                                  fontSize: 9.5,
                                  fontWeight: FontWeight.w700,
                                  color: inkMuted,
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                                decoration: BoxDecoration(
                                  color: (isLowStock ? const Color(0xFFE11D48) : const Color(0xFF10B981))
                                      .withValues(alpha: 0.15),
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  '${p.stockQuantity} u.',
                                  style: TextStyle(
                                    fontSize: 9.5,
                                    fontWeight: FontWeight.w800,
                                    color: isLowStock ? const Color(0xFFE11D48) : const Color(0xFF10B981),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          Expanded(
                            child: Text(
                              p.localizedName(widget.api.lang),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 11.5,
                                fontWeight: FontWeight.w600,
                                color: inkPrimary,
                                height: 1.2,
                              ),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            _formatMad(p.retailPrice),
                            style: const TextStyle(
                              fontFamily: 'monospace',
                              fontSize: 12,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF1C61E7),
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _kpiCard({
    required String title,
    required String value,
    required String unit,
    required String subtext,
    required IconData icon,
    required Color iconColor,
    required Color badgeBg,
    required Color subtleBg,
    required Color borderCol,
    required Color inkPrimary,
    required Color inkMuted,
    bool isMonetary = false,
    VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.all(11),
        decoration: BoxDecoration(
          color: subtleBg,
          border: Border.all(color: borderCol),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 9.5,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.5,
                    color: inkMuted,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(5),
                  decoration: BoxDecoration(
                    color: badgeBg,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Icon(icon, size: 15, color: iconColor),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              value,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                fontFamily: isMonetary ? 'monospace' : null,
                fontSize: isMonetary ? 13.5 : 17,
                fontWeight: FontWeight.w800,
                color: inkPrimary,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              subtext,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(fontSize: 10, color: inkMuted),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProductInspectorCard(
    Product p,
    bool isDark,
    Color cardBg,
    Color subtleBg,
    Color borderCol,
    Color inkPrimary,
    Color inkMuted,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: cardBg,
        border: Border.all(color: borderCol),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: subtleBg,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(12)),
              border: Border(bottom: BorderSide(color: borderCol)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${p.brand.toUpperCase()} • ${p.category}',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.5,
                        color: inkMuted,
                      ),
                    ),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: (p.stockQuantity > p.minStockAlert ? const Color(0xFF10B981) : const Color(0xFFE11D48))
                                .withValues(alpha: 0.14),
                            border: Border.all(
                              color: (p.stockQuantity > p.minStockAlert ? const Color(0xFF10B981) : const Color(0xFFE11D48))
                                  .withValues(alpha: 0.4),
                            ),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            'Stock: ${p.stockQuantity} u.',
                            style: TextStyle(
                              fontFamily: 'monospace',
                              fontSize: 11.5,
                              fontWeight: FontWeight.w700,
                              color: p.stockQuantity > p.minStockAlert ? const Color(0xFF10B981) : const Color(0xFFE11D48),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        IconButton(
                          icon: const Icon(Icons.close, size: 19),
                          tooltip: 'Fermer l\'aperçu',
                          constraints: const BoxConstraints(),
                          padding: EdgeInsets.zero,
                          onPressed: clearScannedProduct,
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    if (p.imageUrl.isNotEmpty) ...[
                      InkWell(
                        onTap: () => widget.onOpenProductForm(p, null),
                        child: Stack(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: Container(
                                width: 72,
                                height: 72,
                                decoration: BoxDecoration(
                                  color: Colors.white,
                                  border: Border.all(color: borderCol),
                                ),
                                child: Image.network(
                                  p.imageUrl.startsWith('http') ? p.imageUrl : '${widget.api.baseUrl}${p.imageUrl}',
                                  fit: BoxFit.contain,
                                  errorBuilder: (_, __, ___) => const Icon(Icons.image_not_supported_outlined, color: Colors.grey),
                                ),
                              ),
                            ),
                            Positioned(
                              right: 2,
                              bottom: 2,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF4F46E5),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  '${p.images.length}',
                                  style: const TextStyle(color: Colors.white, fontSize: 9.5, fontWeight: FontWeight.w800),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 12),
                    ],
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            p.localizedName(widget.api.lang),
                            style: TextStyle(fontSize: 15.5, fontWeight: FontWeight.w700, color: inkPrimary),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '${p.category} • EAN: ${p.barcode} • Mod: ${p.modelNumber}',
                            style: TextStyle(fontFamily: 'monospace', fontSize: 11, color: inkMuted),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: _priceMetricBox(
                        label: 'PRIX DÉTAIL (PUBLIC)',
                        value: _formatMad(p.retailPrice),
                        subtext: _hideBuyingCosts
                            ? 'TTC Maroc'
                            : 'Marge: +${_formatMad(p.retailMarginMad)} (${p.retailMarginPercent.toStringAsFixed(1)}%)',
                        emphasized: true,
                        subtleBg: subtleBg,
                        borderCol: borderCol,
                        inkPrimary: inkPrimary,
                        inkMuted: inkMuted,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: _priceMetricBox(
                        label: 'PRIX GROS (REVENDEUR)',
                        value: _formatMad(p.wholesalePrice),
                        subtext: _hideBuyingCosts ? 'Tarif Pro / Gros' : 'Marge Gros: +${_formatMad(p.wholesaleMarginMad)}',
                        emphasized: false,
                        subtleBg: subtleBg,
                        borderCol: borderCol,
                        inkPrimary: inkPrimary,
                        inkMuted: inkMuted,
                      ),
                    ),
                  ],
                ),
                if (!_hideBuyingCosts) ...[
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: _priceMetricBox(
                          label: 'COÛT D\'ACHAT ACTUEL',
                          value: _formatMad(p.currentCostPrice),
                          subtext: 'Prix de revient actuel',
                          emphasized: false,
                          subtleBg: subtleBg,
                          borderCol: borderCol,
                          inkPrimary: inkPrimary,
                          inkMuted: inkMuted,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: _priceMetricBox(
                          label: 'DERNIER COÛT D\'ACHAT',
                          value: _formatMad(p.lastCostPrice),
                          subtext: p.currentCostPrice == p.lastCostPrice
                              ? 'Stable vs dernier arrivage'
                              : 'Écart: ${_formatMad(p.currentCostPrice - p.lastCostPrice)}',
                          emphasized: false,
                          subtleBg: subtleBg,
                          borderCol: borderCol,
                          inkPrimary: inkPrimary,
                          inkMuted: inkMuted,
                        ),
                      ),
                    ],
                  ),
                ],
                const SizedBox(height: 14),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF10B981),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        onPressed: () {
                          widget.onAddToCart(p);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text('Ajouté au panier POS : ${p.localizedName(widget.api.lang)}'),
                              duration: const Duration(seconds: 2),
                              behavior: SnackBarBehavior.floating,
                            ),
                          );
                        },
                        icon: const Icon(Icons.add_shopping_cart, size: 18),
                        label: const Text('Ajouter au Panier POS', style: TextStyle(fontWeight: FontWeight.w700)),
                      ),
                    ),
                    const SizedBox(width: 8),
                    OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      onPressed: () => widget.onOpenProductForm(p, null),
                      icon: const Icon(Icons.photo_library_outlined, size: 17),
                      label: Text('Photos (${p.images.length})'),
                    ),
                  ],
                ),
                if (!_hideBuyingCosts && p.priceHistory.isNotEmpty) ...[
                  const SizedBox(height: 14),
                  Text(
                    'HISTORIQUE DES PRIX & ARRIVAGES (${p.priceHistory.length})',
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 0.5, color: inkMuted),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    decoration: BoxDecoration(
                      border: Border.all(color: borderCol),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      children: p.priceHistory.map((h) {
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                          decoration: BoxDecoration(
                            border: Border(bottom: BorderSide(color: borderCol)),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      h.supplierName.isEmpty ? 'Fournisseur Comptoir' : h.supplierName,
                                      style: TextStyle(fontWeight: FontWeight.w700, fontSize: 11.5, color: inkPrimary),
                                    ),
                                    Text(
                                      '${h.recordedAt.split(" ").first} • Réf: ${h.invoiceRef.isEmpty ? "N/A" : h.invoiceRef} (+${h.quantityAdded} u.)',
                                      style: TextStyle(fontSize: 11, color: inkMuted),
                                    ),
                                  ],
                                ),
                              ),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(
                                    'Achat: ${_formatMad(h.buyingPrice)}',
                                    style: TextStyle(fontFamily: 'monospace', fontWeight: FontWeight.w700, fontSize: 12, color: inkPrimary),
                                  ),
                                  Text(
                                    'Détail: ${_formatMad(h.retailPriceAtTime)} | Gros: ${_formatMad(h.wholesalePriceAtTime)}',
                                    style: TextStyle(fontFamily: 'monospace', fontSize: 10.5, color: inkMuted),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ],
                if (p.availableSerials.isNotEmpty) ...[
                  const SizedBox(height: 14),
                  Text(
                    'NUMÉROS DE SÉRIE / IMEI EN STOCK (${p.availableSerials.length})',
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 0.5, color: inkMuted),
                  ),
                  const SizedBox(height: 6),
                  Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: p.availableSerials.map((s) {
                      return Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: subtleBg,
                          border: Border.all(color: borderCol),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          s.serialNumber,
                          style: TextStyle(fontFamily: 'monospace', fontSize: 11.5, fontWeight: FontWeight.w600, color: inkPrimary),
                        ),
                      );
                    }).toList(),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _priceMetricBox({
    required String label,
    required String value,
    required String subtext,
    required bool emphasized,
    required Color subtleBg,
    required Color borderCol,
    required Color inkPrimary,
    required Color inkMuted,
  }) {
    return Container(
      padding: const EdgeInsets.all(11),
      decoration: BoxDecoration(
        color: emphasized ? const Color(0xFF203361) : subtleBg,
        border: Border.all(color: emphasized ? const Color(0xFF203361) : borderCol),
        borderRadius: BorderRadius.circular(9),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.5,
              color: emphasized ? Colors.white.withValues(alpha: 0.8) : inkMuted,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              fontFamily: 'monospace',
              fontSize: 15.5,
              fontWeight: FontWeight.w800,
              color: emphasized ? Colors.white : inkPrimary,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            subtext,
            style: TextStyle(
              fontSize: 10.5,
              color: emphasized ? Colors.white.withValues(alpha: 0.9) : inkMuted,
            ),
          ),
        ],
      ),
    );
  }
}
