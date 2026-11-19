import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';

class ProviderBillScreen extends StatefulWidget {
  final ElectroZenApiService api;

  const ProviderBillScreen({super.key, required this.api});

  @override
  State<ProviderBillScreen> createState() => _ProviderBillScreenState();
}

class _ProviderBillScreenState extends State<ProviderBillScreen> {
  final TextEditingController _rawTextCtrl = TextEditingController();
  final TextEditingController _invoiceNumCtrl = TextEditingController();
  final TextEditingController _dateCtrl = TextEditingController(text: DateTime.now().toString().split(' ').first);
  final TextEditingController _paidAmountCtrl = TextEditingController();

  bool _analyzing = false;
  bool _submitting = false;
  String? _errorMsg;
  String? _successMsg;

  int? _selectedSupplierId;
  String _supplierName = '';
  List<Map<String, dynamic>> _availableSuppliers = [];
  List<Map<String, dynamic>> _billItems = [];

  final NumberFormat _madFmt = NumberFormat('#,##0.00', 'fr_FR');
  String _formatMad(num val) => '${_madFmt.format(val)} MAD';

  @override
  void initState() {
    super.initState();
    _loadSuppliers();
  }

  @override
  void dispose() {
    _rawTextCtrl.dispose();
    _invoiceNumCtrl.dispose();
    _dateCtrl.dispose();
    _paidAmountCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadSuppliers() async {
    try {
      final list = await widget.api.fetchSuppliers();
      if (!mounted) return;
      setState(() {
        _availableSuppliers = list;
        if (list.isNotEmpty && _selectedSupplierId == null) {
          _selectedSupplierId = list.first['id'] as int?;
          _supplierName = (list.first['company'] ?? list.first['name'] ?? '').toString();
        }
      });
    } catch (_) {}
  }

  Future<void> _scanBill({String? imageBase64, String? rawText}) async {
    setState(() {
      _analyzing = true;
      _errorMsg = null;
      _successMsg = null;
    });

    try {
      final res = await widget.api.scanProviderBill(
        imageBase64: imageBase64,
        rawText: rawText,
      );
      if (!mounted) return;

      final rawItems = res['items'];
      final items = <Map<String, dynamic>>[];
      if (rawItems is List) {
        for (final e in rawItems) {
          if (e is Map) {
            items.add(Map<String, dynamic>.from(e));
          }
        }
      }
      final suppId = res['supplier_id'] as int?;
      final provName = (res['provider_name'] ?? '').toString();

      setState(() {
        _analyzing = false;
        _billItems = items;
        _invoiceNumCtrl.text = (res['invoice_number'] ?? '').toString();
        _dateCtrl.text = (res['invoice_date'] ?? DateTime.now().toString().split(' ').first).toString();
        _supplierName = provName;
        if (suppId != null) {
          _selectedSupplierId = suppId;
        }
        _paidAmountCtrl.text = _calculateTotal().toStringAsFixed(2);
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _analyzing = false;
        _errorMsg = e.toString();
      });
    }
  }

  double _calculateTotal() {
    double sum = 0;
    for (final it in _billItems) {
      final qty = (it['quantity'] as num?)?.toDouble() ?? 1.0;
      final cost = (it['unit_cost'] as num?)?.toDouble() ?? 0.0;
      sum += (qty * cost);
    }
    return sum;
  }

  Future<void> _submitArrival() async {
    if (_billItems.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Aucun article à enregistrer.')));
      return;
    }

    final total = _calculateTotal();
    final paid = double.tryParse(_paidAmountCtrl.text) ?? total;

    setState(() => _submitting = true);
    try {
      final payload = {
        'supplier_id': _selectedSupplierId,
        'supplier_name': _supplierName,
        'invoice_number': _invoiceNumCtrl.text.trim(),
        'paid_amount': paid,
        'notes': 'Scanné automatiquement depuis la facture / BL',
        'items': _billItems.map((it) {
          return {
            'product_id': it['product_id'],
            'product_name': it['product_name'],
            'quantity': it['quantity'],
            'unit_cost': it['unit_cost'],
            'new_retail_price': it['new_retail_price'],
            'new_wholesale_price': it['new_wholesale_price'],
            'barcode': it['barcode'],
            'brand': it['brand'],
            'model_number': it['model_number'],
          };
        }).toList(),
      };

      await widget.api.submitPurchase(payload);
      if (!mounted) return;
      setState(() {
        _submitting = false;
        _successMsg = 'Arrivage enregistré avec succès ! Stock mis à jour.';
        _billItems.clear();
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(_successMsg!), backgroundColor: const Color(0xFF10B981)),
      );
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _submitting = false;
        _errorMsg = 'Erreur enregistrement: $e';
      });
    }
  }

  void _showPasteTextDialog() {
    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: const Text('Coller le texte de la Facture / BL'),
          content: TextField(
            controller: _rawTextCtrl,
            maxLines: 8,
            decoration: const InputDecoration(
              hintText: 'Collez le texte brut de la facture (Désignations, Prix, Quantités, Fournisseur)...',
            ),
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Annuler')),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(ctx);
                if (_rawTextCtrl.text.trim().isNotEmpty) {
                  _scanBill(rawText: _rawTextCtrl.text.trim());
                }
              },
              child: const Text('Analyser avec l\'IA'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? const Color(0xFF101828) : Colors.white;
    final subtleBg = isDark ? const Color(0xFF161F33) : const Color(0xFFEEF2F8);
    final borderCol = isDark ? const Color(0xFF1D2939) : const Color(0xFFE4E7EC);
    final inkPrimary = isDark ? const Color(0xFFF9FAFB) : const Color(0xFF101828);
    final inkMuted = isDark ? const Color(0xFF98A2B3) : const Color(0xFF667085);

    final total = _calculateTotal();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Scanner Facture Fournisseur', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
        backgroundColor: const Color(0xFF203361),
        foregroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          tooltip: 'Retour',
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(14),
        children: [
          // Scan / Upload Action Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: cardBg,
              border: Border.all(color: borderCol),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1C61E7).withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(Icons.document_scanner_outlined, color: Color(0xFF1C61E7), size: 24),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('EXTRACTION AUTOMATIQUE PAR IA', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: inkPrimary)),
                          Text('Factures d\'achat, Bons de livraison & Arrivages', style: TextStyle(fontSize: 11, color: inkMuted)),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF203361),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        onPressed: _analyzing
                            ? null
                            : () {
                                // Paste or sample OCR trigger
                                _showPasteTextDialog();
                              },
                        icon: const Icon(Icons.paste_outlined, size: 18),
                        label: const Text('Coller Texte Facture', style: TextStyle(fontWeight: FontWeight.w700)),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        ),
                        onPressed: _analyzing
                            ? null
                            : () {
                                // Simulate or load sample invoice for instant verification
                                _scanBill(
                                  rawText: '''FACTURE FOURNISSEUR: Samsung & LG Maroc Distribution
Date: 18/11/2026 - Réf: FAC-SAM-2026-904
1) Téléviseur Samsung 55 QLED 4K - 2 pcs - 4900 MAD
2) Réfrigérateur LG NoFrost 420L Inox - 1 pcs - 5400 MAD
3) Machine à Laver Bosch Série 6 - 3 pcs - 4600 MAD
Total Facture: 29000 MAD''',
                                );
                              },
                        icon: const Icon(Icons.auto_awesome, size: 18, color: Color(0xFF6D28D9)),
                        label: const Text('Exemple Démo', style: TextStyle(fontWeight: FontWeight.w700)),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          if (_analyzing) ...[
            const SizedBox(height: 20),
            Center(
              child: Column(
                children: [
                  const CircularProgressIndicator(),
                  const SizedBox(height: 12),
                  Text('Analyse des prix, quantités et articles en cours...', style: TextStyle(color: inkMuted, fontSize: 13)),
                ],
              ),
            ),
          ],

          if (_errorMsg != null) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFE11D48).withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFFE11D48)),
              ),
              child: Text(_errorMsg!, style: const TextStyle(color: Color(0xFFE11D48), fontSize: 12.5)),
            ),
          ],

          // Parsed Invoice Data Form
          if (_billItems.isNotEmpty && !_analyzing) ...[
            const SizedBox(height: 16),
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
                      Text('INFORMATIONS FOURNISSEUR', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 11, color: inkMuted)),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981).withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text('${_billItems.length} article(s) détecté(s)', style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 10.5, color: Color(0xFF10B981))),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  DropdownButtonFormField<int>(
                    initialValue: _selectedSupplierId,
                    decoration: const InputDecoration(
                      labelText: 'Fournisseur associé',
                      isDense: true,
                    ),
                    items: _availableSuppliers.map((s) {
                      return DropdownMenuItem<int>(
                        value: s['id'] as int,
                        child: Text(s['company']?.toString().isNotEmpty == true ? s['company'] : s['name']),
                      );
                    }).toList(),
                    onChanged: (val) {
                      setState(() {
                        _selectedSupplierId = val;
                        final found = _availableSuppliers.firstWhere((s) => s['id'] == val, orElse: () => {});
                        _supplierName = (found['company'] ?? found['name'] ?? '').toString();
                      });
                    },
                  ),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _invoiceNumCtrl,
                          decoration: const InputDecoration(labelText: 'Réf. Facture / BL', isDense: true),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: TextField(
                          controller: _dateCtrl,
                          decoration: const InputDecoration(labelText: 'Date Facture', isDense: true),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 14),

            // Line Items List
            Text('ARTICLES EXTRAITS & MISE À JOUR STOCK', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 11, color: inkMuted)),
            const SizedBox(height: 8),
            ..._billItems.asMap().entries.map((entry) {
              final idx = entry.key;
              final it = entry.value;
              final name = it['product_name'] ?? '';
              final isNew = it['is_new_product'] == true;
              final qty = (it['quantity'] as num?)?.toInt() ?? 1;
              final cost = (it['unit_cost'] as num?)?.toDouble() ?? 0.0;
              final retail = (it['new_retail_price'] as num?)?.toDouble() ?? ((cost * 1.25).round().toDouble());

              return Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: cardBg,
                  border: Border.all(color: isNew ? const Color(0xFF6D28D9) : borderCol),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            name,
                            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: inkPrimary),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: (isNew ? const Color(0xFF6D28D9) : const Color(0xFF10B981)).withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            isNew ? 'NOUVEAU PRODUIT' : 'PRODUIT CATALOGUE',
                            style: TextStyle(
                              fontSize: 9.5,
                              fontWeight: FontWeight.w800,
                              color: isNew ? const Color(0xFF6D28D9) : const Color(0xFF10B981),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Expanded(
                          flex: 2,
                          child: TextFormField(
                            initialValue: '$qty',
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(labelText: 'Qté Reçue', isDense: true),
                            onChanged: (v) {
                              setState(() {
                                it['quantity'] = int.tryParse(v) ?? 1;
                                it['total_price'] = (it['quantity'] as int) * (it['unit_cost'] as num).toDouble();
                                _paidAmountCtrl.text = _calculateTotal().toStringAsFixed(2);
                              });
                            },
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          flex: 3,
                          child: TextFormField(
                            initialValue: '$cost',
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(labelText: 'Coût Achat (MAD)', isDense: true),
                            onChanged: (v) {
                              setState(() {
                                it['unit_cost'] = double.tryParse(v) ?? 0.0;
                                it['total_price'] = (it['quantity'] as int) * (it['unit_cost'] as num).toDouble();
                                _paidAmountCtrl.text = _calculateTotal().toStringAsFixed(2);
                              });
                            },
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          flex: 3,
                          child: TextFormField(
                            initialValue: '$retail',
                            keyboardType: TextInputType.number,
                            decoration: const InputDecoration(labelText: 'Prix Vente Détail', isDense: true),
                            onChanged: (v) {
                              it['new_retail_price'] = double.tryParse(v) ?? retail;
                            },
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.delete_outline, color: Colors.red, size: 20),
                          onPressed: () {
                            setState(() {
                              _billItems.removeAt(idx);
                              _paidAmountCtrl.text = _calculateTotal().toStringAsFixed(2);
                            });
                          },
                        ),
                      ],
                    ),
                  ],
                ),
              );
            }),

            const SizedBox(height: 14),

            // Summary & Confirm Card
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: subtleBg,
                border: Border.all(color: borderCol),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('TOTAL FACTURE D\'ACHAT :', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: inkPrimary)),
                      Text(_formatMad(total), style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 17, color: Color(0xFF10B981))),
                    ],
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _paidAmountCtrl,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      labelText: 'Montant Réglé au Fournisseur (MAD)',
                      isDense: true,
                    ),
                  ),
                  const SizedBox(height: 14),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF10B981),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    onPressed: _submitting ? null : _submitArrival,
                    icon: _submitting
                        ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : const Icon(Icons.check_circle_outline, size: 20),
                    label: Text(
                      _submitting ? 'Enregistrement...' : 'Valider l\'Arrivage & Mettre à Jour le Stock',
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
