import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';

class _EditableInvoiceItem {
  int? matchedProductId;
  String? matchedProductName;
  final double previousCost;
  final TextEditingController nameCtrl;
  final TextEditingController skuCtrl;
  final TextEditingController brandCtrl;
  final TextEditingController qtyCtrl;
  final TextEditingController costCtrl;
  final TextEditingController retailCtrl;

  _EditableInvoiceItem({
    this.matchedProductId,
    this.matchedProductName,
    this.previousCost = 0.0,
    required String name,
    required String sku,
    required String brand,
    required int qty,
    required double cost,
    required double retail,
  })  : nameCtrl = TextEditingController(text: name),
        skuCtrl = TextEditingController(text: sku),
        brandCtrl = TextEditingController(text: brand),
        qtyCtrl = TextEditingController(text: '$qty'),
        costCtrl = TextEditingController(text: cost > 0 ? '$cost' : ''),
        retailCtrl = TextEditingController(text: retail > 0 ? '$retail' : '');

  void dispose() {
    nameCtrl.dispose();
    skuCtrl.dispose();
    brandCtrl.dispose();
    qtyCtrl.dispose();
    costCtrl.dispose();
    retailCtrl.dispose();
  }
}

class InvoiceScannerScreen extends StatefulWidget {
  final ElectroZenApiService api;
  final bool embedded;
  final VoidCallback? onCompleted;

  const InvoiceScannerScreen({
    super.key,
    required this.api,
    this.embedded = false,
    this.onCompleted,
  });

  @override
  State<InvoiceScannerScreen> createState() => _InvoiceScannerScreenState();
}

class _InvoiceScannerScreenState extends State<InvoiceScannerScreen> {
  final ImagePicker _picker = ImagePicker();
  final TextEditingController _rawTextCtrl = TextEditingController();
  final TextEditingController _providerCtrl = TextEditingController();
  final TextEditingController _providerPhoneCtrl = TextEditingController();
  final TextEditingController _invoiceRefCtrl = TextEditingController();
  final TextEditingController _paidAmountCtrl = TextEditingController();

  int? _matchedSupplierId;
  bool _scanning = false;
  bool _submitting = false;
  String? _statusMsg;
  bool _statusOk = true;
  final List<_EditableInvoiceItem> _items = [];

  final NumberFormat _madFmt = NumberFormat('#,##0.00', 'fr_FR');

  @override
  void dispose() {
    _rawTextCtrl.dispose();
    _providerCtrl.dispose();
    _providerPhoneCtrl.dispose();
    _invoiceRefCtrl.dispose();
    _paidAmountCtrl.dispose();
    for (final it in _items) {
      it.dispose();
    }
    super.dispose();
  }

  Future<void> _pickAndScanImage(ImageSource source) async {
    try {
      final file = await _picker.pickImage(
        source: source,
        maxWidth: 1600,
        maxHeight: 1600,
        imageQuality: 85,
      );
      if (file == null) return;
      final bytes = await file.readAsBytes();
      final b64 = base64Encode(bytes);
      final lowerName = file.name.toLowerCase();
      final mime = lowerName.endsWith('.png') ? 'image/png' : 'image/jpeg';
      await _runScan(imageBase64: b64, mimeType: mime);
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _statusMsg = 'Erreur caméra/galerie: $e';
        _statusOk = false;
      });
    }
  }

  Future<void> _runScan({String imageBase64 = '', String mimeType = 'image/jpeg', String rawText = ''}) async {
    setState(() {
      _scanning = true;
      _statusMsg = 'Extraction IA de la facture en cours...';
      _statusOk = true;
    });

    try {
      final res = await widget.api.scanSupplierInvoice(
        imageBase64: imageBase64,
        mimeType: mimeType,
        rawText: rawText,
      );
      if (!mounted) return;

      for (final it in _items) {
        it.dispose();
      }
      _items.clear();

      _matchedSupplierId = (res['matched_supplier_id'] as num?)?.toInt();
      _providerCtrl.text = (res['provider_name'] ?? '').toString();
      _providerPhoneCtrl.text = (res['provider_phone'] ?? '').toString();
      _invoiceRefCtrl.text = (res['invoice_number'] ?? '').toString();

      final rawItems = (res['items'] as List?) ?? [];
      double computedTotal = 0;
      for (final raw in rawItems) {
        if (raw is! Map) continue;
        final qty = (raw['quantity'] as num?)?.toInt() ?? 1;
        final cost = (raw['unit_cost'] as num?)?.toDouble() ?? 0.0;
        final retail = (raw['suggested_retail_price'] as num?)?.toDouble() ?? 0.0;
        computedTotal += qty * cost;
        _items.add(
          _EditableInvoiceItem(
            matchedProductId: (raw['matched_product_id'] as num?)?.toInt(),
            matchedProductName: raw['matched_product_name']?.toString(),
            previousCost: (raw['previous_cost_price'] as num?)?.toDouble() ??
                (raw['current_cost_price'] as num?)?.toDouble() ??
                0.0,
            name: (raw['product_name'] ?? '').toString(),
            sku: (raw['sku_or_ref'] ?? '').toString(),
            brand: (raw['brand'] ?? '').toString(),
            qty: qty,
            cost: cost,
            retail: retail,
          ),
        );
      }

      _paidAmountCtrl.text = computedTotal > 0 ? computedTotal.toStringAsFixed(0) : '';
      setState(() {
        _scanning = false;
        _statusMsg = 'Extraction réussie (${res['source']?.toString().toUpperCase()}) : ${_items.length} article(s) trouvé(s).';
        _statusOk = true;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _scanning = false;
        _statusMsg = e.toString().replaceFirst('Exception: ', '');
        _statusOk = false;
      });
    }
  }

  double get _computedTotal {
    double sum = 0;
    for (final it in _items) {
      final q = int.tryParse(it.qtyCtrl.text.trim()) ?? 1;
      final c = double.tryParse(it.costCtrl.text.trim().replaceAll(',', '.')) ?? 0;
      sum += q * c;
    }
    return sum;
  }

  void _addEmptyItem() {
    setState(() {
      _items.add(
        _EditableInvoiceItem(
          name: '',
          sku: '',
          brand: '',
          qty: 1,
          cost: 0,
          retail: 0,
        ),
      );
    });
  }

  Future<void> _submitPurchase() async {
    if (_items.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Ajoutez ou scannez au moins un article.')),
      );
      return;
    }

    setState(() => _submitting = true);
    try {
      final payloadItems = _items.map((it) {
        final cost = double.tryParse(it.costCtrl.text.trim().replaceAll(',', '.')) ?? 0;
        final retail = double.tryParse(it.retailCtrl.text.trim().replaceAll(',', '.')) ?? (cost * 1.25).roundToDouble();
        return {
          'product_id': it.matchedProductId,
          'product_name': it.nameCtrl.text.trim(),
          'sku_or_ref': it.skuCtrl.text.trim(),
          'brand': it.brandCtrl.text.trim(),
          'quantity': int.tryParse(it.qtyCtrl.text.trim()) ?? 1,
          'unit_cost': cost,
          'new_retail_price': retail,
          'new_wholesale_price': (cost * 1.12).roundToDouble(),
        };
      }).toList();

      final total = _computedTotal;
      final paid = double.tryParse(_paidAmountCtrl.text.trim().replaceAll(',', '.')) ?? total;

      final res = await widget.api.submitSupplierPurchase(
        supplierId: _matchedSupplierId,
        providerName: _providerCtrl.text.trim(),
        providerPhone: _providerPhoneCtrl.text.trim(),
        invoiceNumber: _invoiceRefCtrl.text.trim(),
        paidAmount: paid,
        items: payloadItems,
        notes: 'Importé via Scanner Facture Mobile',
      );

      if (!mounted) return;
      setState(() => _submitting = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Réception ${res["invoice_number"]} enregistrée ! Stock et tarifs mis à jour.'),
        ),
      );
      if (widget.embedded) {
        setState(() {
          for (final item in _items) {
            item.dispose();
          }
          _items.clear();
          _rawTextCtrl.clear();
          _providerCtrl.clear();
          _invoiceRefCtrl.clear();
          _paidAmountCtrl.clear();
          _matchedSupplierId = null;
          _statusMsg = null;
        });
        widget.onCompleted?.call();
      } else {
        Navigator.of(context).pop(true);
      }
    } catch (e) {
      if (!mounted) return;
      setState(() => _submitting = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? const Color(0xFF101828) : Colors.white;
    final subtleBg = isDark ? const Color(0xFF161F33) : const Color(0xFFF8FAFC);
    final borderCol = isDark ? const Color(0xFF1D2939) : const Color(0xFFE4E7EC);

    final Widget content = ListView(
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
                const Text(
                  'CAPTURE OU IMPORT FACTURE',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF6D28D9)),
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF203361), foregroundColor: Colors.white),
                        onPressed: _scanning ? null : () => _pickAndScanImage(ImageSource.camera),
                        icon: const Icon(Icons.camera_alt_outlined, size: 18),
                        label: const Text('Photo Facture'),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: _scanning ? null : () => _pickAndScanImage(ImageSource.gallery),
                        icon: const Icon(Icons.photo_library_outlined, size: 18),
                        label: const Text('Galerie'),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: _rawTextCtrl,
                  maxLines: 2,
                  style: const TextStyle(fontSize: 12),
                  decoration: const InputDecoration(
                    labelText: 'Ou collez le texte de la facture (compatible DeepSeek / Gemini / OpenAI)',
                  ),
                ),
                const SizedBox(height: 8),
                OutlinedButton.icon(
                  onPressed: _scanning
                      ? null
                      : () {
                          if (_rawTextCtrl.text.trim().isEmpty) return;
                          _runScan(rawText: _rawTextCtrl.text.trim());
                        },
                  icon: const Icon(Icons.auto_awesome, size: 17),
                  label: const Text('Extraire depuis le texte'),
                ),
                if (_scanning)
                  const Padding(
                    padding: EdgeInsets.only(top: 10),
                    child: LinearProgressIndicator(),
                  ),
                if (_statusMsg != null) ...[
                  const SizedBox(height: 10),
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: (_statusOk ? const Color(0xFF10B981) : const Color(0xFFE11D48)).withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      _statusMsg!,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: _statusOk ? const Color(0xFF059669) : const Color(0xFFE11D48),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),

          const SizedBox(height: 12),

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
                    const Text('FOURNISSEUR & RÉFÉRENCE', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF667085))),
                    if (_matchedSupplierId != null)
                      const Text('Fournisseur reconnu', style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, color: Color(0xFF10B981))),
                  ],
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: _providerCtrl,
                  decoration: const InputDecoration(labelText: 'Nom du Fournisseur *'),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _invoiceRefCtrl,
                        style: const TextStyle(fontFamily: 'monospace'),
                        decoration: const InputDecoration(labelText: 'N° Facture / BL'),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: TextField(
                        controller: _paidAmountCtrl,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        style: const TextStyle(fontFamily: 'monospace'),
                        decoration: const InputDecoration(labelText: 'Montant Payé (MAD)'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('ARTICLES EXTRAITS (${_items.length})', style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700, color: Color(0xFF667085))),
              TextButton.icon(
                onPressed: _addEmptyItem,
                icon: const Icon(Icons.add, size: 17),
                label: const Text('Ajouter Ligne'),
              ),
            ],
          ),

          ..._items.asMap().entries.map((entry) {
            final idx = entry.key;
            final it = entry.value;
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: cardBg,
                border: Border.all(color: borderCol),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                        decoration: BoxDecoration(
                          color: (it.matchedProductId != null ? const Color(0xFF10B981) : const Color(0xFF1C61E7)).withValues(alpha: 0.14),
                          borderRadius: BorderRadius.circular(5),
                        ),
                        child: Text(
                          it.matchedProductId != null ? 'Produit lié (#${it.matchedProductId})' : 'Nouveau Produit (sera créé)',
                          style: TextStyle(
                            fontSize: 10.5,
                            fontWeight: FontWeight.w700,
                            color: it.matchedProductId != null ? const Color(0xFF059669) : const Color(0xFF1C61E7),
                          ),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete_outline, color: Color(0xFFE11D48), size: 19),
                        onPressed: () {
                          setState(() {
                            _items.removeAt(idx).dispose();
                          });
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  TextField(
                    controller: it.nameCtrl,
                    decoration: const InputDecoration(labelText: 'Nom du Produit *'),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: it.qtyCtrl,
                          keyboardType: TextInputType.number,
                          style: const TextStyle(fontFamily: 'monospace'),
                          onChanged: (_) => setState(() {}),
                          decoration: const InputDecoration(labelText: 'Qté'),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: TextField(
                          controller: it.costCtrl,
                          keyboardType: const TextInputType.numberWithOptions(decimal: true),
                          style: const TextStyle(fontFamily: 'monospace'),
                          onChanged: (_) => setState(() {}),
                          decoration: const InputDecoration(labelText: 'Prix Achat (MAD)'),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: TextField(
                          controller: it.retailCtrl,
                          keyboardType: const TextInputType.numberWithOptions(decimal: true),
                          style: const TextStyle(fontFamily: 'monospace'),
                          onChanged: (_) => setState(() {}),
                          decoration: const InputDecoration(labelText: 'Prix Détail'),
                        ),
                      ),
                    ],
                  ),
                  Builder(
                    builder: (_) {
                      final currCost = double.tryParse(it.costCtrl.text.trim().replaceAll(',', '.')) ?? 0;
                      final currRetail = double.tryParse(it.retailCtrl.text.trim().replaceAll(',', '.')) ?? 0;
                      final costIncreased = it.previousCost > 0 && currCost > it.previousCost;
                      final marginPct = currRetail > 0 ? ((currRetail - currCost) / currRetail) * 100 : 0.0;
                      final lowMargin = currCost > 0 && currRetail > 0 && marginPct < 12;
                      if (!costIncreased && !lowMargin) return const SizedBox.shrink();
                      return Container(
                        margin: const EdgeInsets.only(top: 8),
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF59E0B).withValues(alpha: 0.14),
                          borderRadius: BorderRadius.circular(7),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.warning_amber_rounded, size: 16, color: Color(0xFFB45309)),
                            const SizedBox(width: 6),
                            Expanded(
                              child: Text(
                                costIncreased
                                    ? 'Hausse coût vs ${_madFmt.format(it.previousCost)} MAD (Marge ${marginPct.toStringAsFixed(0)}%)'
                                    : 'Marge faible (${marginPct.toStringAsFixed(0)}%)',
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF92400E)),
                              ),
                            ),
                            TextButton(
                              onPressed: () {
                                setState(() {
                                  it.retailCtrl.text = (currCost * 1.25).round().toString();
                                });
                              },
                              style: TextButton.styleFrom(
                                visualDensity: VisualDensity.compact,
                                foregroundColor: const Color(0xFF92400E),
                              ),
                              child: const Text('Ajuster +25%', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800)),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ],
              ),
            );
          }),

          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(color: subtleBg, borderRadius: BorderRadius.circular(10), border: Border.all(color: borderCol)),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Total Facture Calculé :', style: TextStyle(fontWeight: FontWeight.w700)),
                Text('${_madFmt.format(_computedTotal)} MAD', style: const TextStyle(fontFamily: 'monospace', fontWeight: FontWeight.w800, fontSize: 16, color: Color(0xFF203361))),
              ],
            ),
          ),
          const SizedBox(height: 12),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF10B981),
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 14),
            ),
            onPressed: _submitting ? null : _submitPurchase,
            icon: _submitting
                ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                : const Icon(Icons.check_circle_outline),
            label: Text(_submitting ? 'Enregistrement...' : 'Valider Réception & Mettre à Jour Stock'),
          ),
        ],
      );

    if (widget.embedded) {
      return content;
    }

    return Scaffold(
      appBar: AppBar(
        backgroundColor: const Color(0xFF203361),
        foregroundColor: Colors.white,
        elevation: 0,
        title: const Text('Scanner Facture Fournisseur (IA)', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          tooltip: 'Retour',
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: content,
    );
  }
}
