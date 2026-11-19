import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/models.dart';
import '../services/api_service.dart';
import '../services/printing_service.dart';
import '../widgets/barcode_scanner_modal.dart';

class MobilePosScreen extends StatefulWidget {
  final ElectroZenApiService api;
  final List<MobileCartItem> cart;
  final VoidCallback onCartUpdated;
  final VoidCallback? onOpenSalesHistory;

  const MobilePosScreen({
    super.key,
    required this.api,
    required this.cart,
    required this.onCartUpdated,
    this.onOpenSalesHistory,
  });

  @override
  State<MobilePosScreen> createState() => _MobilePosScreenState();
}

class _MobilePosScreenState extends State<MobilePosScreen> {
  String _priceTier = 'retail'; // 'retail' | 'wholesale'
  String _paymentMethod = 'cash'; // 'cash' | 'card' | 'credit'
  String _discountMode = 'mad'; // 'mad' | 'pct'
  int _installmentsCount = 3;
  int? _selectedCustomerId;
  List<Customer> _customers = [];
  final List<List<MobileCartItem>> _heldCarts = [];
  bool _submitting = false;

  final TextEditingController _barcodeScanCtrl = TextEditingController();
  final TextEditingController _discountCtrl = TextEditingController(text: '0');
  final TextEditingController _paidAmountCtrl = TextEditingController();

  final NumberFormat _madFmt = NumberFormat('#,##0.00', 'fr_FR');

  @override
  void initState() {
    super.initState();
    widget.api.syncRevision.addListener(_onSyncTriggered);
    _loadCustomers();
  }

  void _onSyncTriggered() {
    if (mounted) _loadCustomers();
  }

  @override
  void dispose() {
    widget.api.syncRevision.removeListener(_onSyncTriggered);
    _barcodeScanCtrl.dispose();
    _discountCtrl.dispose();
    _paidAmountCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadCustomers() async {
    try {
      final list = await widget.api.fetchCustomers();
      if (!mounted) return;
      setState(() => _customers = list);
    } catch (_) {}
  }

  double get _subtotal => widget.cart.fold(0.0, (sum, item) => sum + item.subtotal);
  double get _rawDiscount => double.tryParse(_discountCtrl.text.replaceAll(',', '.')) ?? 0.0;
  double get _discount => _discountMode == 'pct'
      ? (_subtotal * (_rawDiscount.clamp(0.0, 100.0) / 100.0))
      : _rawDiscount.clamp(0.0, _subtotal);
  double get _totalAfterDiscount => (_subtotal - _discount).clamp(0.0, double.infinity);

  void _holdCurrentCart() {
    if (widget.cart.isEmpty) return;
    setState(() {
      _heldCarts.add(
        widget.cart
            .map((e) => MobileCartItem(
                  product: e.product,
                  quantity: e.quantity,
                  unitPrice: e.unitPrice,
                  serialNumber: e.serialNumber,
                ))
            .toList(),
      );
      widget.cart.clear();
    });
    widget.onCartUpdated();
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Panier mis en attente (Brouillons).')),
    );
  }

  void _showHeldCartsModal() {
    showModalBottomSheet(
      context: context,
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text('Paniers en attente (${_heldCarts.length})', style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
              const SizedBox(height: 10),
              if (_heldCarts.isEmpty)
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 18),
                  child: Center(child: Text('Aucun panier en attente.')),
                )
              else
                ..._heldCarts.asMap().entries.map((entry) {
                  final i = entry.key;
                  final items = entry.value;
                  final tot = items.fold(0.0, (s, x) => s + x.subtotal);
                  return ListTile(
                    dense: true,
                    title: Text('Brouillon #${i + 1} • ${items.length} article(s)'),
                    subtitle: Text('${_madFmt.format(tot)} MAD'),
                    trailing: ElevatedButton(
                      onPressed: () {
                        setState(() {
                          widget.cart
                            ..clear()
                            ..addAll(_heldCarts.removeAt(i));
                        });
                        widget.onCartUpdated();
                        Navigator.pop(ctx);
                      },
                      child: const Text('Reprendre'),
                    ),
                  );
                }),
            ],
          ),
        ),
      ),
    );
  }

  void _applyPriceTier(String tier) {
    setState(() {
      _priceTier = tier;
      for (final item in widget.cart) {
        item.unitPrice = tier == 'wholesale' ? item.product.wholesalePrice : item.product.retailPrice;
      }
    });
    widget.onCartUpdated();
  }

  Future<void> _scanAndAddBarcode(String rawCode) async {
    final code = rawCode.trim();
    if (code.isEmpty) return;

    try {
      final prod = await widget.api.lookupBarcode(code);
      if (!mounted) return;
      if (prod == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Code-barres introuvable: $code')),
        );
        return;
      }
      if (prod.stockQuantity <= 0) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Rupture de stock: ${prod.nameFr}')),
        );
        return;
      }
      final existingIdx = widget.cart.indexWhere((c) => c.product.id == prod.id);
      setState(() {
        if (existingIdx >= 0) {
          widget.cart[existingIdx].quantity += 1;
        } else {
          widget.cart.add(
            MobileCartItem(
              product: prod,
              quantity: 1,
              unitPrice: _priceTier == 'wholesale' ? prod.wholesalePrice : prod.retailPrice,
              serialNumber: prod.availableSerials.isNotEmpty ? prod.availableSerials.first.serialNumber : '',
            ),
          );
        }
        _barcodeScanCtrl.clear();
      });
      widget.onCartUpdated();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur: $e')));
    }
  }

  Future<void> _showNewCustomerDialog() async {
    final nameCtrl = TextEditingController();
    final phoneCtrl = TextEditingController();
    final cinCtrl = TextEditingController();

    final created = await showDialog<Customer>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Nouveau Client', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameCtrl,
              decoration: const InputDecoration(labelText: 'Nom Complet', isDense: true),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: phoneCtrl,
              decoration: const InputDecoration(labelText: 'Téléphone (+212...)', isDense: true),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: cinCtrl,
              decoration: const InputDecoration(labelText: 'CIN (Optionnel)', isDense: true),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Annuler')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF18181B), foregroundColor: Colors.white),
            onPressed: () async {
              if (nameCtrl.text.trim().isEmpty) return;
              final c = await widget.api.createCustomer(
                fullName: nameCtrl.text.trim(),
                phone: phoneCtrl.text.trim(),
                nationalId: cinCtrl.text.trim(),
              );
              if (ctx.mounted) Navigator.pop(ctx, c);
            },
            child: const Text('Créer'),
          ),
        ],
      ),
    );

    if (created != null && mounted) {
      await _loadCustomers();
      setState(() => _selectedCustomerId = created.id);
    }
  }

  Future<void> _completeCheckout() async {
    if (widget.cart.isEmpty) return;
    if (_paymentMethod == 'credit' && _selectedCustomerId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Sélectionnez un client pour une vente à Crédit / Facilité.')),
      );
      return;
    }

    final total = _totalAfterDiscount;
    final paid = _paymentMethod == 'credit'
        ? (double.tryParse(_paidAmountCtrl.text) ?? 0.0)
        : total;

    setState(() => _submitting = true);
    try {
      final res = await widget.api.submitMobileSale(
        saleType: _priceTier,
        customerId: _selectedCustomerId,
        items: widget.cart,
        discountAmount: _discount,
        paidAmount: paid,
        paymentMethod: _paymentMethod,
        installmentsCount: _paymentMethod == 'credit' ? _installmentsCount : 0,
      );
      if (!mounted) return;
      setState(() {
        _submitting = false;
        widget.cart.clear();
        _discountCtrl.text = '0';
        _paidAmountCtrl.clear();
      });
      widget.onCartUpdated();
      _showPrintReceiptDialog(res);
    } catch (e) {
      if (!mounted) return;
      setState(() => _submitting = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur vente: $e')));
    }
  }

  Future<void> _showPrintReceiptDialog(Map<String, dynamic> sale) async {
    final settings = await widget.api.fetchStoreSettings();
    if (!mounted) return;

    showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: Row(
            children: [
              const Icon(Icons.check_circle, color: Color(0xFF10B981), size: 24),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Vente validée (${sale["invoice_number"] ?? "FAC"})',
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
                ),
              ),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text('La transaction a été synchronisée sur ELECTROZEN Windows.'),
              SizedBox(height: 10),
              Text('Souhaitez-vous imprimer le ticket client ?', style: TextStyle(fontWeight: FontWeight.w700)),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Fermer'),
            ),
            OutlinedButton.icon(
              onPressed: () async {
                Navigator.pop(ctx);
                try {
                  await PrintingService.printA4Invoice(sale: sale, storeSettings: settings);
                } catch (e) {
                  if (!mounted) return;
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur impression: $e')));
                }
              },
              icon: const Icon(Icons.print, size: 16),
              label: const Text('Facture A4'),
            ),
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF203361),
                foregroundColor: Colors.white,
              ),
              onPressed: () async {
                Navigator.pop(ctx);
                try {
                  await PrintingService.printThermalReceipt(sale: sale, storeSettings: settings);
                } catch (e) {
                  if (!mounted) return;
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur impression: $e')));
                }
              },
              icon: const Icon(Icons.receipt_long, size: 16),
              label: const Text('Ticket 80mm'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(14),
      children: [
        // Scan to Cart + Retail / Wholesale Toggle
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Theme.of(context).brightness == Brightness.dark ? const Color(0xFF101828) : Colors.white,
            border: Border.all(color: Theme.of(context).dividerColor),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'CAISSE POS MOBILE',
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF71717A)),
                  ),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (widget.onOpenSalesHistory != null) ...[
                        TextButton.icon(
                          style: TextButton.styleFrom(visualDensity: VisualDensity.compact, padding: EdgeInsets.zero),
                          onPressed: widget.onOpenSalesHistory,
                          icon: const Icon(Icons.receipt_long_outlined, size: 16),
                          label: const Text('Historique', style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700)),
                        ),
                        const SizedBox(width: 6),
                      ],
                      SegmentedButton<String>(
                        segments: const [
                          ButtonSegment(value: 'retail', label: Text('Détail', style: TextStyle(fontSize: 11.5))),
                          ButtonSegment(value: 'wholesale', label: Text('Gros', style: TextStyle(fontSize: 11.5))),
                        ],
                        selected: {_priceTier},
                        onSelectionChanged: (s) => _applyPriceTier(s.first),
                        style: const ButtonStyle(visualDensity: VisualDensity.compact),
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 6,
                children: [
                  OutlinedButton.icon(
                    onPressed: _heldCarts.isEmpty && widget.cart.isEmpty ? null : _showHeldCartsModal,
                    icon: const Icon(Icons.pause_circle_outline, size: 16),
                    label: Text('Brouillons (${_heldCarts.length})'),
                  ),
                  if (widget.cart.isNotEmpty)
                    OutlinedButton.icon(
                      onPressed: _holdCurrentCart,
                      icon: const Icon(Icons.bookmark_add_outlined, size: 16),
                      label: const Text('Mettre en Attente'),
                    ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _barcodeScanCtrl,
                      style: const TextStyle(fontFamily: 'monospace', fontSize: 13),
                      decoration: const InputDecoration(
                        hintText: 'Scanner code-barres pour ajouter au panier...',
                        isDense: true,
                        contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 10),
                        border: OutlineInputBorder(),
                      ),
                      onSubmitted: _scanAndAddBarcode,
                    ),
                  ),
                  const SizedBox(width: 8),
                  OutlinedButton.icon(
                    onPressed: () async {
                      final code = await BarcodeScannerModal.scan(context, title: 'Ajouter au Panier POS');
                      if (code != null && code.isNotEmpty) {
                        _scanAndAddBarcode(code);
                      }
                    },
                    icon: const Icon(Icons.qr_code_scanner, size: 17),
                    label: const Text('Caméra'),
                  ),
                ],
              ),
            ],
          ),
        ),

        const SizedBox(height: 12),

        // Cart Items Panel
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Theme.of(context).brightness == Brightness.dark ? const Color(0xFF101828) : Colors.white,
            border: Border.all(color: Theme.of(context).dividerColor),
            borderRadius: BorderRadius.circular(12),
          ),
          child: widget.cart.isEmpty
              ? const Padding(
                  padding: EdgeInsets.symmetric(vertical: 24),
                  child: Center(
                    child: Text(
                      'Panier vide. Scannez un produit ou ajoutez-le depuis le catalogue.',
                      style: TextStyle(color: Color(0xFF71717A), fontSize: 12.5),
                    ),
                  ),
                )
              : Column(
                  children: widget.cart.asMap().entries.map((entry) {
                    final idx = entry.key;
                    final item = entry.value;
                    return Container(
                      padding: const EdgeInsets.symmetric(vertical: 8),
                      decoration: const BoxDecoration(
                        border: Border(bottom: BorderSide(color: Color(0xFFF4F4F5))),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  item.product.localizedName(widget.api.lang),
                                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                                ),
                              ),
                              IconButton(
                                visualDensity: VisualDensity.compact,
                                icon: const Icon(Icons.close, size: 16),
                                onPressed: () {
                                  setState(() => widget.cart.removeAt(idx));
                                  widget.onCartUpdated();
                                },
                              ),
                            ],
                          ),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  IconButton(
                                    visualDensity: VisualDensity.compact,
                                    onPressed: item.quantity > 1
                                        ? () {
                                            setState(() => item.quantity -= 1);
                                            widget.onCartUpdated();
                                          }
                                        : null,
                                    icon: const Icon(Icons.remove_circle_outline, size: 18),
                                  ),
                                  Text(
                                    '${item.quantity}',
                                    style: const TextStyle(fontFamily: 'monospace', fontWeight: FontWeight.w700),
                                  ),
                                  IconButton(
                                    visualDensity: VisualDensity.compact,
                                    onPressed: item.quantity < item.product.stockQuantity
                                        ? () {
                                            setState(() => item.quantity += 1);
                                            widget.onCartUpdated();
                                          }
                                        : null,
                                    icon: const Icon(Icons.add_circle_outline, size: 18),
                                  ),
                                ],
                              ),
                              Text(
                                '${_madFmt.format(item.subtotal)} MAD',
                                style: const TextStyle(
                                  fontFamily: 'monospace',
                                  fontWeight: FontWeight.w700,
                                  fontSize: 13.5,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          TextFormField(
                            key: ValueKey('sn-${item.product.id}'),
                            initialValue: item.serialNumber,
                            style: const TextStyle(fontFamily: 'monospace', fontSize: 11.5),
                            decoration: const InputDecoration(
                              labelText: 'N° Série / IMEI (Garantie)',
                              isDense: true,
                              border: OutlineInputBorder(),
                            ),
                            onChanged: (v) => item.serialNumber = v.trim(),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
        ),

        const SizedBox(height: 12),

        // Customer & Payment Panel
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: Theme.of(context).brightness == Brightness.dark ? const Color(0xFF101828) : Colors.white,
            border: Border.all(color: Theme.of(context).dividerColor),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                children: [
                  Expanded(
                    child: DropdownButtonFormField<int?>(
                      value: _selectedCustomerId,
                      isExpanded: true,
                      decoration: const InputDecoration(
                        labelText: 'Client',
                        isDense: true,
                        border: OutlineInputBorder(),
                      ),
                      items: [
                        const DropdownMenuItem<int?>(
                          value: null,
                          child: Text('Client Comptoir (Anonyme)', overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 12.5)),
                        ),
                        ..._customers.map(
                          (c) => DropdownMenuItem<int?>(
                            value: c.id,
                            child: Text('${c.fullName} (${c.phone})', overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 12.5)),
                          ),
                        ),
                      ],
                      onChanged: (v) => setState(() => _selectedCustomerId = v),
                    ),
                  ),
                  const SizedBox(width: 8),
                  OutlinedButton(
                    onPressed: _showNewCustomerDialog,
                    child: const Text('+ Client'),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              DropdownButtonFormField<String>(
                value: _paymentMethod,
                isExpanded: true,
                decoration: const InputDecoration(
                  labelText: 'Mode de Règlement',
                  isDense: true,
                  border: OutlineInputBorder(),
                ),
                items: const [
                  DropdownMenuItem(value: 'cash', child: Text('Espèces (Cash)', overflow: TextOverflow.ellipsis)),
                  DropdownMenuItem(value: 'card', child: Text('Carte Bancaire / Virement', overflow: TextOverflow.ellipsis)),
                  DropdownMenuItem(value: 'credit', child: Text('Crédit / Facilité de Paiement', overflow: TextOverflow.ellipsis)),
                ],
                onChanged: (v) {
                  if (v != null) setState(() => _paymentMethod = v);
                },
              ),
              if (_paymentMethod == 'credit') ...[
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _paidAmountCtrl,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        style: const TextStyle(fontFamily: 'monospace'),
                        decoration: const InputDecoration(
                          labelText: 'Acompte Versé (MAD)',
                          isDense: true,
                          border: OutlineInputBorder(),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: DropdownButtonFormField<int>(
                        value: _installmentsCount,
                        decoration: const InputDecoration(
                          labelText: 'Mensualités',
                          isDense: true,
                          border: OutlineInputBorder(),
                        ),
                        items: const [
                          DropdownMenuItem(value: 2, child: Text('2 Mois')),
                          DropdownMenuItem(value: 3, child: Text('3 Mois')),
                          DropdownMenuItem(value: 4, child: Text('4 Mois')),
                          DropdownMenuItem(value: 6, child: Text('6 Mois')),
                          DropdownMenuItem(value: 12, child: Text('12 Mois')),
                        ],
                        onChanged: (v) {
                          if (v != null) setState(() => _installmentsCount = v);
                        },
                      ),
                    ),
                  ],
                ),
              ],
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _discountCtrl,
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                      style: const TextStyle(fontFamily: 'monospace'),
                      onChanged: (_) => setState(() {}),
                      decoration: InputDecoration(
                        labelText: _discountMode == 'pct' ? 'Remise (%)' : 'Remise (MAD)',
                        isDense: true,
                        border: const OutlineInputBorder(),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  SegmentedButton<String>(
                    segments: const [
                      ButtonSegment(value: 'mad', label: Text('MAD')),
                      ButtonSegment(value: 'pct', label: Text('%')),
                    ],
                    selected: {_discountMode},
                    onSelectionChanged: (s) => setState(() {
                      _discountMode = s.first;
                      _discountCtrl.text = '0';
                    }),
                    style: const ButtonStyle(visualDensity: VisualDensity.compact),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('TOTAL À PAYER', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
                  Text(
                    '${_madFmt.format(_totalAfterDiscount)} MAD',
                    style: const TextStyle(
                      fontFamily: 'monospace',
                      fontWeight: FontWeight.w800,
                      fontSize: 18,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF39AE52),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                onPressed: (widget.cart.isEmpty || _submitting) ? null : _completeCheckout,
                child: Text(
                  _submitting ? 'Validation en cours...' : 'Valider la Vente sur ELECTROZEN',
                  style: const TextStyle(fontWeight: FontWeight.w700),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
