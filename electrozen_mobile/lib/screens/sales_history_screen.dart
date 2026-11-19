import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../services/api_service.dart';
import '../services/printing_service.dart';

class SalesHistoryScreen extends StatefulWidget {
  final ElectroZenApiService api;

  const SalesHistoryScreen({super.key, required this.api});

  @override
  State<SalesHistoryScreen> createState() => _SalesHistoryScreenState();
}

class _SalesHistoryScreenState extends State<SalesHistoryScreen> {
  final TextEditingController _searchCtrl = TextEditingController();
  List<Map<String, dynamic>> _sales = [];
  Map<String, String> _storeSettings = {};
  bool _loading = false;
  String _filterMethod = 'ALL';
  String? _errorMsg;

  final NumberFormat _madFmt = NumberFormat('#,##0.00', 'fr_FR');
  String _formatMad(num val) => '${_madFmt.format(val)} MAD';

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() {
      _loading = true;
      _errorMsg = null;
    });
    try {
      final salesFuture = widget.api.fetchSales();
      final settingsFuture = widget.api.fetchStoreSettings();
      final results = await Future.wait([salesFuture, settingsFuture]);
      if (!mounted) return;
      setState(() {
        _sales = results[0] as List<Map<String, dynamic>>;
        _storeSettings = results[1] as Map<String, String>;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _loading = false;
        _errorMsg = e.toString();
      });
    }
  }

  List<Map<String, dynamic>> get _filteredSales {
    final q = _searchCtrl.text.trim().toLowerCase();
    return _sales.where((s) {
      final inv = (s['invoice_number'] ?? '').toString().toLowerCase();
      final cust = (s['customer_name'] ?? '').toString().toLowerCase();
      final method = (s['payment_method'] ?? 'cash').toString();

      final matchesSearch = q.isEmpty || inv.contains(q) || cust.contains(q);
      final matchesMethod = _filterMethod == 'ALL' || method == _filterMethod;

      return matchesSearch && matchesMethod;
    }).toList();
  }

  void _showSaleDetails(Map<String, dynamic> sale) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? const Color(0xFF101828) : Colors.white;
    final subtleBg = isDark ? const Color(0xFF161F33) : const Color(0xFFF8F9FC);
    final borderCol = isDark ? const Color(0xFF1D2939) : const Color(0xFFE4E7EC);
    final inkPrimary = isDark ? const Color(0xFFF9FAFB) : const Color(0xFF101828);
    final inkMuted = isDark ? const Color(0xFF98A2B3) : const Color(0xFF667085);

    final items = (sale['items'] as List<dynamic>?) ?? [];
    final inv = sale['invoice_number'] ?? 'FAC-0000';
    final cust = sale['customer_name'] ?? 'Client Comptoir';
    final total = (sale['total_amount'] as num?)?.toDouble() ?? 0.0;
    final discount = (sale['discount'] as num?)?.toDouble() ?? 0.0;
    final paid = (sale['paid_amount'] as num?)?.toDouble() ?? total;
    final debt = (sale['remaining_debt'] as num?)?.toDouble() ?? 0.0;
    final dateStr = (sale['created_at'] ?? '').toString().split('.').first;
    final method = (sale['payment_method'] ?? 'cash').toString().toUpperCase();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          height: MediaQuery.of(context).size.height * 0.85,
          decoration: BoxDecoration(
            color: cardBg,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
          ),
          child: Column(
            children: [
              // Modal Header
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                decoration: BoxDecoration(
                  color: subtleBg,
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                  border: Border(bottom: BorderSide(color: borderCol)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'FACTURE $inv',
                          style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: inkPrimary, fontFamily: 'monospace'),
                        ),
                        Text('$dateStr • Client: $cust', style: TextStyle(fontSize: 11.5, color: inkMuted)),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
              ),

              // Items List
              Expanded(
                child: ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    Text('ARTICLES DU TICKET (${items.length})', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: inkMuted)),
                    const SizedBox(height: 8),
                    ...items.map((it) {
                      final name = it['product_name'] ?? 'Article';
                      final qty = it['quantity'] ?? 1;
                      final price = (it['unit_price'] as num?)?.toDouble() ?? 0.0;
                      final subtotal = (it['subtotal'] as num?)?.toDouble() ?? (qty * price);
                      final serial = it['serial_number']?.toString() ?? '';

                      return Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: subtleBg,
                          border: Border.all(color: borderCol),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(name, style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: inkPrimary)),
                                  if (serial.isNotEmpty)
                                    Text('N° Série: $serial', style: const TextStyle(fontFamily: 'monospace', fontSize: 10.5, color: Color(0xFF6D28D9))),
                                  Text('$qty x ${_formatMad(price)}', style: TextStyle(fontSize: 11, color: inkMuted)),
                                ],
                              ),
                            ),
                            Text(
                              _formatMad(subtotal),
                              style: TextStyle(fontFamily: 'monospace', fontWeight: FontWeight.w800, fontSize: 13, color: inkPrimary),
                            ),
                          ],
                        ),
                      );
                    }),

                    const SizedBox(height: 12),
                    Divider(color: borderCol),
                    const SizedBox(height: 8),

                    // Financial summary
                    if (discount > 0) ...[
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Remise accordée :', style: TextStyle(color: inkMuted, fontSize: 12)),
                          Text('-${_formatMad(discount)}', style: const TextStyle(color: Color(0xFFE11D48), fontWeight: FontWeight.w700, fontSize: 12)),
                        ],
                      ),
                      const SizedBox(height: 4),
                    ],
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Total TTC :', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: inkPrimary)),
                        Text(_formatMad(total), style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 16, color: Color(0xFF10B981))),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Montant réglé ($method) :', style: TextStyle(color: inkMuted, fontSize: 12)),
                        Text(_formatMad(paid), style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: inkPrimary)),
                      ],
                    ),
                    if (debt > 0) ...[
                      const SizedBox(height: 4),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Reste à payer :', style: TextStyle(color: Color(0xFFE11D48), fontWeight: FontWeight.w700, fontSize: 13)),
                          Text(_formatMad(debt), style: const TextStyle(color: Color(0xFFE11D48), fontWeight: FontWeight.w800, fontSize: 14)),
                        ],
                      ),
                    ],
                  ],
                ),
              ),

              // Printing Action Buttons Bar
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: subtleBg,
                  border: Border(top: BorderSide(color: borderCol)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF203361),
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        onPressed: () async {
                          try {
                            await PrintingService.printThermalReceipt(
                              sale: sale,
                              storeSettings: _storeSettings,
                            );
                          } catch (e) {
                            if (!mounted) return;
                            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur impression: $e')));
                          }
                        },
                        icon: const Icon(Icons.receipt_long, size: 18),
                        label: const Text('Ticket 80mm', style: TextStyle(fontWeight: FontWeight.w700)),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        ),
                        onPressed: () async {
                          try {
                            await PrintingService.printA4Invoice(
                              sale: sale,
                              storeSettings: _storeSettings,
                            );
                          } catch (e) {
                            if (!mounted) return;
                            ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur impression: $e')));
                          }
                        },
                        icon: const Icon(Icons.print, size: 18),
                        label: const Text('Facture A4', style: TextStyle(fontWeight: FontWeight.w700)),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
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

    final filtered = _filteredSales;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Historique des Ventes & Factures', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700)),
        backgroundColor: const Color(0xFF203361),
        foregroundColor: Colors.white,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          tooltip: 'Retour',
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            tooltip: 'Actualiser',
            onPressed: _loading ? null : _loadData,
          ),
        ],
      ),
      body: Column(
        children: [
          // Filter & Search Header
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: cardBg,
              border: Border(bottom: BorderSide(color: borderCol)),
            ),
            child: Column(
              children: [
                TextField(
                  controller: _searchCtrl,
                  decoration: InputDecoration(
                    hintText: 'Rechercher facture (ex: FAC-2026-0001) ou client...',
                    prefixIcon: const Icon(Icons.search, size: 20),
                    suffixIcon: _searchCtrl.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear, size: 18),
                            onPressed: () {
                              _searchCtrl.clear();
                              setState(() {});
                            },
                          )
                        : null,
                    isDense: true,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  onChanged: (_) => setState(() {}),
                ),
                const SizedBox(height: 8),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _filterChip('Tous', 'ALL'),
                      const SizedBox(width: 6),
                      _filterChip('Espèces', 'cash'),
                      const SizedBox(width: 6),
                      _filterChip('Carte Bancaire', 'card'),
                      const SizedBox(width: 6),
                      _filterChip('Crédit / Facilité', 'credit'),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // List of Sales
          Expanded(
            child: _loading
                ? const Center(child: CircularProgressIndicator())
                : _errorMsg != null
                    ? Center(
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(_errorMsg!, style: const TextStyle(color: Colors.red)),
                            const SizedBox(height: 10),
                            ElevatedButton(onPressed: _loadData, child: const Text('Réessayer')),
                          ],
                        ),
                      )
                    : filtered.isEmpty
                        ? Center(
                            child: Text(
                              'Aucune vente trouvée',
                              style: TextStyle(color: inkMuted, fontSize: 13),
                            ),
                          )
                        : RefreshIndicator(
                            onRefresh: _loadData,
                            child: ListView.separated(
                              padding: const EdgeInsets.all(12),
                              itemCount: filtered.length,
                              separatorBuilder: (_, __) => const SizedBox(height: 8),
                              itemBuilder: (ctx, i) {
                                final s = filtered[i];
                                final inv = s['invoice_number'] ?? 'FAC-0000';
                                final cust = s['customer_name'] ?? 'Client Comptoir';
                                final total = (s['total_amount'] as num?)?.toDouble() ?? 0.0;
                                final debt = (s['remaining_debt'] as num?)?.toDouble() ?? 0.0;
                                final method = (s['payment_method'] ?? 'cash').toString().toUpperCase();
                                final dateStr = (s['created_at'] ?? '').toString().split('.').first;
                                final itemCount = (s['items'] as List<dynamic>?)?.length ?? 0;

                                return InkWell(
                                  onTap: () => _showSaleDetails(s),
                                  borderRadius: BorderRadius.circular(10),
                                  child: Container(
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: cardBg,
                                      border: Border.all(color: borderCol),
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Row(
                                                children: [
                                                  Text(
                                                    inv,
                                                    style: TextStyle(
                                                      fontFamily: 'monospace',
                                                      fontWeight: FontWeight.w800,
                                                      fontSize: 13.5,
                                                      color: inkPrimary,
                                                    ),
                                                  ),
                                                  const SizedBox(width: 8),
                                                  Container(
                                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                                    decoration: BoxDecoration(
                                                      color: subtleBg,
                                                      borderRadius: BorderRadius.circular(4),
                                                    ),
                                                    child: Text(
                                                      method,
                                                      style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w700, color: inkMuted),
                                                    ),
                                                  ),
                                                ],
                                              ),
                                              const SizedBox(height: 4),
                                              Text(
                                                '$cust • $itemCount article(s)',
                                                style: TextStyle(fontSize: 11.5, color: inkMuted),
                                              ),
                                              Text(
                                                dateStr,
                                                style: TextStyle(fontFamily: 'monospace', fontSize: 10, color: inkMuted.withValues(alpha: 0.8)),
                                              ),
                                            ],
                                          ),
                                        ),
                                        Column(
                                          crossAxisAlignment: CrossAxisAlignment.end,
                                          children: [
                                            Text(
                                              _formatMad(total),
                                              style: const TextStyle(
                                                fontFamily: 'monospace',
                                                fontWeight: FontWeight.w900,
                                                fontSize: 14.5,
                                                color: Color(0xFF1C61E7),
                                              ),
                                            ),
                                            const SizedBox(height: 4),
                                            if (debt > 0)
                                              Container(
                                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                                decoration: BoxDecoration(
                                                  color: const Color(0xFFE11D48).withValues(alpha: 0.12),
                                                  borderRadius: BorderRadius.circular(4),
                                                ),
                                                child: Text(
                                                  'Dû: ${_formatMad(debt)}',
                                                  style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: Color(0xFFE11D48)),
                                                ),
                                              )
                                            else
                                              const Icon(Icons.print_outlined, size: 18, color: Color(0xFF10B981)),
                                          ],
                                        ),
                                      ],
                                    ),
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

  Widget _filterChip(String label, String value) {
    final selected = _filterMethod == value;
    return ChoiceChip(
      label: Text(label),
      selected: selected,
      onSelected: (_) => setState(() => _filterMethod = value),
      visualDensity: VisualDensity.compact,
      labelStyle: TextStyle(
        fontSize: 11,
        fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
      ),
    );
  }
}
