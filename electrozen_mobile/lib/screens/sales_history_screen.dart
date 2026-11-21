import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/models.dart';
import '../services/api_service.dart';
import '../services/print_service.dart';

class SalesHistoryScreen extends StatefulWidget {
  final ElectroZenApiService api;
  final bool embedded;

  const SalesHistoryScreen({
    super.key,
    required this.api,
    this.embedded = false,
  });

  @override
  State<SalesHistoryScreen> createState() => _SalesHistoryScreenState();
}

class _SalesHistoryScreenState extends State<SalesHistoryScreen> {
  final TextEditingController _searchCtrl = TextEditingController();
  List<SaleRecord> _sales = [];
  Map<String, String> _settings = {};
  String _statusFilter = 'all'; // 'all' | 'completed' | 'canceled'
  bool _loading = true;
  String? _error;

  final NumberFormat _madFmt = NumberFormat('#,##0.00', 'fr_FR');
  String _fmt(double v) => '${_madFmt.format(v)} MAD';

  void _onSync() {
    if (mounted) _loadData();
  }

  @override
  void initState() {
    super.initState();
    widget.api.syncRevision.addListener(_onSync);
    _loadData();
  }

  @override
  void dispose() {
    widget.api.syncRevision.removeListener(_onSync);
    _searchCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final results = await Future.wait([
        widget.api.fetchSales(),
        widget.api.fetchSettings(),
      ]);
      if (!mounted) return;
      setState(() {
        _sales = results[0] as List<SaleRecord>;
        _settings = results[1] as Map<String, String>;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.toString();
        _loading = false;
      });
    }
  }

  List<SaleRecord> get _filteredSales {
    final q = _searchCtrl.text.trim().toLowerCase();
    return _sales.where((s) {
      if (_statusFilter == 'completed' && s.status == 'canceled') return false;
      if (_statusFilter == 'canceled' && s.status != 'canceled') return false;
      if (q.isEmpty) return true;
      final itemsMatch = s.items.any((i) =>
          i.productName.toLowerCase().contains(q) ||
          i.serialNumber.toLowerCase().contains(q) ||
          i.barcode.toLowerCase().contains(q));
      return s.invoiceNumber.toLowerCase().contains(q) ||
          s.customerName.toLowerCase().contains(q) ||
          s.sourceDevice.toLowerCase().contains(q) ||
          itemsMatch;
    }).toList();
  }

  Future<void> _confirmCancelSale(SaleRecord sale) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Annuler ${sale.invoiceNumber} ?'),
        content: const Text('Un avoir sera émis et les produits / numéros de série seront réintégrés au stock.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Non')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFE11D48), foregroundColor: Colors.white),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Oui, Annuler'),
          ),
        ],
      ),
    );
    if (ok != true) return;
    try {
      await widget.api.cancelSale(sale.id);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Vente ${sale.invoiceNumber} annulée et stock réintégré.')),
      );
      _loadData();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? const Color(0xFF101828) : Colors.white;
    final subtleBg = isDark ? const Color(0xFF161F33) : const Color(0xFFF8FAFC);
    final borderCol = isDark ? const Color(0xFF1D2939) : const Color(0xFFE4E7EC);
    final inkPrimary = isDark ? const Color(0xFFF9FAFB) : const Color(0xFF101828);
    final inkMuted = isDark ? const Color(0xFF98A2B3) : const Color(0xFF667085);

    final list = _filteredSales;

    return Scaffold(
      appBar: widget.embedded
          ? null
          : AppBar(
              backgroundColor: const Color(0xFF203361),
              foregroundColor: Colors.white,
              elevation: 0,
              title: const Text('Historique des Ventes & Garanties', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
              leading: IconButton(
                icon: const Icon(Icons.arrow_back),
                tooltip: 'Retour',
                onPressed: () => Navigator.of(context).pop(),
              ),
              actions: [
                IconButton(
                  icon: const Icon(Icons.refresh),
                  tooltip: 'Actualiser',
                  onPressed: _loadData,
                ),
              ],
            ),
      body: Column(
        children: [
          if (widget.embedded)
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 10, 8, 0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'HISTORIQUE DES VENTES & GARANTIES',
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: Color(0xFF667085), letterSpacing: 0.4),
                  ),
                  IconButton(
                    icon: const Icon(Icons.refresh, size: 20),
                    tooltip: 'Actualiser',
                    onPressed: _loadData,
                    visualDensity: VisualDensity.compact,
                  ),
                ],
              ),
            ),
          Container(
            padding: const EdgeInsets.fromLTRB(14, 12, 14, 10),
            color: cardBg,
            child: Column(
              children: [
                TextField(
                  controller: _searchCtrl,
                  onChanged: (_) => setState(() {}),
                  decoration: InputDecoration(
                    hintText: 'Rechercher N° Facture, Client, Produit, S/N...',
                    prefixIcon: const Icon(Icons.search, size: 19),
                    suffixIcon: _searchCtrl.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.close, size: 18),
                            onPressed: () {
                              _searchCtrl.clear();
                              setState(() {});
                            },
                          )
                        : null,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    ChoiceChip(
                      label: Text('Toutes (${_sales.length})'),
                      selected: _statusFilter == 'all',
                      onSelected: (_) => setState(() => _statusFilter = 'all'),
                    ),
                    const SizedBox(width: 6),
                    ChoiceChip(
                      label: const Text('Validées'),
                      selected: _statusFilter == 'completed',
                      onSelected: (_) => setState(() => _statusFilter = 'completed'),
                    ),
                    const SizedBox(width: 6),
                    ChoiceChip(
                      label: const Text('Annulées'),
                      selected: _statusFilter == 'canceled',
                      onSelected: (_) => setState(() => _statusFilter = 'canceled'),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _error != null
                    ? Center(
                        child: Padding(
                          padding: const EdgeInsets.all(20),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(_error!, style: const TextStyle(color: Color(0xFFE11D48))),
                              const SizedBox(height: 10),
                              ElevatedButton(onPressed: _loadData, child: const Text('Réessayer')),
                            ],
                          ),
                        ),
                      )
                    : list.isEmpty
                        ? Center(
                            child: Text('Aucune vente trouvée.', style: TextStyle(color: inkMuted)),
                          )
                        : RefreshIndicator(
                            onRefresh: _loadData,
                            child: ListView.separated(
                              padding: const EdgeInsets.all(14),
                              itemCount: list.length,
                              separatorBuilder: (_, __) => const SizedBox(height: 10),
                              itemBuilder: (ctx, idx) {
                                final s = list[idx];
                                final isCanceled = s.status == 'canceled';
                                final payLabel = s.paymentMethod == 'credit'
                                    ? 'Crédit'
                                    : s.paymentMethod == 'card'
                                        ? 'Carte'
                                        : 'Espèces';
                                return Container(
                                  decoration: BoxDecoration(
                                    color: cardBg,
                                    border: Border.all(color: borderCol),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: ExpansionTile(
                                    tilePadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                    childrenPadding: const EdgeInsets.fromLTRB(14, 0, 14, 14),
                                    title: Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Expanded(
                                          child: Text(
                                            s.invoiceNumber,
                                            style: TextStyle(
                                              fontFamily: 'monospace',
                                              fontWeight: FontWeight.w800,
                                              fontSize: 13.5,
                                              color: isCanceled ? const Color(0xFFE11D48) : const Color(0xFF203361),
                                            ),
                                          ),
                                        ),
                                        Text(
                                          _fmt(s.totalAmount),
                                          style: TextStyle(
                                            fontFamily: 'monospace',
                                            fontWeight: FontWeight.w800,
                                            fontSize: 14,
                                            color: inkPrimary,
                                          ),
                                        ),
                                      ],
                                    ),
                                    subtitle: Padding(
                                      padding: const EdgeInsets.only(top: 4),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            '${s.customerName} • $payLabel (${s.priceTier == 'wholesale' ? 'Gros' : 'Détail'})',
                                            style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: inkPrimary),
                                          ),
                                          const SizedBox(height: 2),
                                          Row(
                                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                            children: [
                                              Text(
                                                '${s.createdAt.length >= 16 ? s.createdAt.substring(0, 16) : s.createdAt} • ${s.items.length} art.',
                                                style: TextStyle(fontSize: 11, color: inkMuted),
                                              ),
                                              if (isCanceled)
                                                Text('ANNULÉE • ${s.creditNoteNumber}', style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, color: Color(0xFFE11D48)))
                                              else if (s.remainingDebt > 0)
                                                Text('Reste: ${_fmt(s.remainingDebt)}', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFFD97706))),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                    children: [
                                      const Divider(height: 12),
                                      ...s.items.map((item) => Container(
                                            margin: const EdgeInsets.only(bottom: 6),
                                            padding: const EdgeInsets.all(8),
                                            decoration: BoxDecoration(
                                              color: subtleBg,
                                              borderRadius: BorderRadius.circular(8),
                                              border: Border.all(color: borderCol),
                                            ),
                                            child: Row(
                                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                              children: [
                                                Expanded(
                                                  child: Column(
                                                    crossAxisAlignment: CrossAxisAlignment.start,
                                                    children: [
                                                      Text(
                                                        '${item.quantity}x ${item.productName}',
                                                        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: inkPrimary),
                                                      ),
                                                      if (item.serialNumber.isNotEmpty)
                                                        Text('S/N: ${item.serialNumber}', style: const TextStyle(fontFamily: 'monospace', fontSize: 10.5, color: Color(0xFF6D28D9))),
                                                      Text(
                                                        'Garantie: ${item.warrantyMonths} mois${item.warrantyExpiresAt.isNotEmpty ? ' (Fin: ${item.warrantyExpiresAt})' : ''}',
                                                        style: TextStyle(fontSize: 10.5, color: inkMuted),
                                                      ),
                                                    ],
                                                  ),
                                                ),
                                                Text(
                                                  _fmt(item.subtotal),
                                                  style: TextStyle(fontFamily: 'monospace', fontWeight: FontWeight.w700, fontSize: 12, color: inkPrimary),
                                                ),
                                              ],
                                            ),
                                          )),
                                      const SizedBox(height: 8),
                                      Wrap(
                                        spacing: 8,
                                        runSpacing: 8,
                                        children: [
                                          ElevatedButton.icon(
                                            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF203361), foregroundColor: Colors.white),
                                            onPressed: () => ElectroZenPrintService.printInvoiceA4(s, _settings),
                                            icon: const Icon(Icons.picture_as_pdf_outlined, size: 16),
                                            label: const Text('Facture A4'),
                                          ),
                                          ElevatedButton.icon(
                                            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6D28D9), foregroundColor: Colors.white),
                                            onPressed: () => ElectroZenPrintService.printWarrantyCertificate(s, _settings),
                                            icon: const Icon(Icons.verified_user_outlined, size: 16),
                                            label: const Text('Bon Garantie'),
                                          ),
                                          OutlinedButton.icon(
                                            onPressed: () => ElectroZenPrintService.printThermalReceipt(s, _settings),
                                            icon: const Icon(Icons.receipt_long_outlined, size: 16),
                                            label: const Text('Ticket 80mm'),
                                          ),
                                          ElevatedButton.icon(
                                            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF059669), foregroundColor: Colors.white),
                                            onPressed: () => ElectroZenPrintService.shareInvoicePdf(s, _settings),
                                            icon: const Icon(Icons.share_outlined, size: 16),
                                            label: const Text('WhatsApp PDF'),
                                          ),
                                          if (!isCanceled)
                                            OutlinedButton.icon(
                                              style: OutlinedButton.styleFrom(foregroundColor: const Color(0xFFE11D48)),
                                              onPressed: () => _confirmCancelSale(s),
                                              icon: const Icon(Icons.delete_outline, size: 16),
                                              label: const Text('Annuler'),
                                            ),
                                        ],
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),
                          ),
          ),
        ],
      ),
    );
  }
}
