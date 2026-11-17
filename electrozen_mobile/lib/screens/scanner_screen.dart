import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/models.dart';
import '../services/api_service.dart';
import '../widgets/barcode_scanner_modal.dart';

class ScannerScreen extends StatefulWidget {
  final ElectroZenApiService api;
  final void Function(Product product) onAddToCart;
  final void Function(Product? product, String? scannedBarcode, [Map<String, dynamic>? prefill]) onOpenProductForm;

  const ScannerScreen({
    super.key,
    required this.api,
    required this.onAddToCart,
    required this.onOpenProductForm,
  });

  @override
  State<ScannerScreen> createState() => _ScannerScreenState();
}

class _ScannerScreenState extends State<ScannerScreen> {
  final TextEditingController _barcodeInputCtrl = TextEditingController();

  bool _loading = false;
  bool _hideBuyingCosts = true; // Customer-safe by default
  String? _errorMsg;
  String? _notFoundBarcode;
  Product? _scannedProduct;

  final NumberFormat _madFmt = NumberFormat('#,##0.00', 'fr_FR');

  String _formatMad(double value) => '${_madFmt.format(value)} MAD';

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

    return ListView(
      padding: const EdgeInsets.all(14),
      children: [
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
        const SizedBox(height: 12),
        if (_loading)
          const Center(
            child: Padding(
              padding: EdgeInsets.all(24),
              child: CircularProgressIndicator(strokeWidth: 2),
            ),
          ),
        if (_errorMsg != null)
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
        if (_notFoundBarcode != null)
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
                Text(
                  'Code-barres non trouvé : $_notFoundBarcode',
                  style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14, color: inkPrimary),
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
        if (_scannedProduct != null)
          _buildProductInspectorCard(_scannedProduct!, isDark, cardBg, subtleBg, borderCol, inkPrimary, inkMuted),
      ],
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
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    if (p.imageUrl.isNotEmpty) ...[
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
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF10B981),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        onPressed: p.stockQuantity > 0 ? () => widget.onAddToCart(p) : null,
                        child: const Text('Ajouter au Panier POS', style: TextStyle(fontWeight: FontWeight.w700)),
                      ),
                    ),
                    const SizedBox(width: 8),
                    OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      onPressed: () => widget.onOpenProductForm(p, null),
                      child: const Text('Modifier'),
                    ),
                  ],
                ),
                if (!_hideBuyingCosts && p.priceHistory.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  Text(
                    'HISTORIQUE DES DERNIERS PRIX D\'ACHAT (ARRIVAGES)',
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
                                    Text(h.supplierName, style: TextStyle(fontWeight: FontWeight.w600, fontSize: 12, color: inkPrimary)),
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
