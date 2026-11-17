import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/models.dart';
import '../services/api_service.dart';
import '../widgets/barcode_scanner_modal.dart';

class CatalogFormScreen extends StatefulWidget {
  final ElectroZenApiService api;
  final Product? initialEditProduct;
  final String? initialScannedBarcode;
  final Map<String, dynamic>? initialInternetPrefill;
  final void Function(Product product) onAddToCart;

  const CatalogFormScreen({
    super.key,
    required this.api,
    this.initialEditProduct,
    this.initialScannedBarcode,
    this.initialInternetPrefill,
    required this.onAddToCart,
  });

  @override
  State<CatalogFormScreen> createState() => _CatalogFormScreenState();
}

class _CatalogFormScreenState extends State<CatalogFormScreen> {
  final TextEditingController _searchCtrl = TextEditingController();
  List<Product> _products = [];
  String _selectedCategory = 'ALL';
  bool _loadingList = false;
  bool _lookingUpInternet = false;
  String? _internetStatusMsg;
  bool _internetStatusOk = true;
  String? _loadError;
  bool _showForm = false;
  int? _editingId;

  // Form controllers
  final _barcodeCtrl = TextEditingController();
  final _skuCtrl = TextEditingController();
  final _modelCtrl = TextEditingController();
  final _brandCtrl = TextEditingController();
  String _category = 'Gros Électroménager';
  final _nameFrCtrl = TextEditingController();
  final _nameArCtrl = TextEditingController();
  final _specsCtrl = TextEditingController();
  final _costPriceCtrl = TextEditingController();
  final _wholesalePriceCtrl = TextEditingController();
  final _retailPriceCtrl = TextEditingController();
  final _stockCtrl = TextEditingController(text: '1');
  final _warrantyCtrl = TextEditingController(text: '12');
  final _newSerialCtrl = TextEditingController();

  final NumberFormat _madFmt = NumberFormat('#,##0.00', 'fr_FR');

  static const List<String> _categories = [
    'Gros Électroménager',
    'TV & Audio',
    'Climatisation & Chauffage',
    'Petit Électroménager',
    'Informatique & Smartphones',
    'Accessoires & Pièces',
  ];

  @override
  void initState() {
    super.initState();
    widget.api.syncRevision.addListener(_onSyncTriggered);
    if (widget.initialEditProduct != null) {
      _populateForm(widget.initialEditProduct!);
    } else if (widget.initialScannedBarcode != null && widget.initialScannedBarcode!.isNotEmpty) {
      _openNewWithBarcode(widget.initialScannedBarcode!, prefill: widget.initialInternetPrefill);
    }
    _loadCatalog();
  }

  void _onSyncTriggered() {
    if (mounted) _loadCatalog();
  }

  @override
  void dispose() {
    widget.api.syncRevision.removeListener(_onSyncTriggered);
    _searchCtrl.dispose();
    _barcodeCtrl.dispose();
    _skuCtrl.dispose();
    _modelCtrl.dispose();
    _brandCtrl.dispose();
    _nameFrCtrl.dispose();
    _nameArCtrl.dispose();
    _specsCtrl.dispose();
    _costPriceCtrl.dispose();
    _wholesalePriceCtrl.dispose();
    _retailPriceCtrl.dispose();
    _stockCtrl.dispose();
    _warrantyCtrl.dispose();
    _newSerialCtrl.dispose();
    super.dispose();
  }

  Future<void> _loadCatalog() async {
    setState(() {
      _loadingList = true;
      _loadError = null;
    });
    try {
      final list = await widget.api.fetchProducts(
        search: _searchCtrl.text,
        category: _selectedCategory,
      );
      if (!mounted) return;
      setState(() {
        _products = list;
        _loadingList = false;
        _loadError = null;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _loadingList = false;
        _loadError = e.toString().replaceFirst('Exception: ', '');
      });
    }
  }

  void _openNewWithBarcode(String barcode, {Map<String, dynamic>? prefill}) {
    setState(() {
      _showForm = true;
      _editingId = null;
      _barcodeCtrl.text = barcode;
      _skuCtrl.text = 'EZ-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}';
      _modelCtrl.text = (prefill?['model_number'] ?? '').toString();
      _brandCtrl.text = (prefill?['brand'] ?? '').toString();
      final cat = (prefill?['category'] ?? '').toString().trim();
      if (cat.isNotEmpty) _category = cat;
      _nameFrCtrl.text = (prefill?['name_fr'] ?? '').toString();
      _nameArCtrl.text = (prefill?['name_ar'] ?? '').toString();
      _specsCtrl.text = (prefill?['description_fr'] ?? prefill?['specs_text'] ?? '').toString();
      _costPriceCtrl.text = '0';
      _wholesalePriceCtrl.text = '0';
      _retailPriceCtrl.text = '0';
      _stockCtrl.text = '1';
      _warrantyCtrl.text = '12';
      if (prefill != null) {
        if (prefill['found'] == true) {
          _internetStatusOk = true;
          _internetStatusMsg = 'Infos trouvées (${prefill['source'] ?? 'Internet'}). Complétez les prix et enregistrez.';
        } else {
          _internetStatusOk = false;
          _internetStatusMsg = 'Introuvable sur Internet — saisissez les informations manuellement ou utilisez l\'IA.';
        }
      } else {
        _internetStatusMsg = null;
      }
    });
  }

  Future<void> _scanAndLookupForForm({bool openFormFirst = false}) async {
    final code = await BarcodeScannerModal.scan(context, title: 'Scanner Code-Barres Produit');
    if (code == null || code.isEmpty || !mounted) return;
    if (openFormFirst) {
      _openNewWithBarcode(code);
    } else {
      setState(() => _barcodeCtrl.text = code);
    }
    await _lookupBarcodeOnline(code);
  }

  Future<void> _lookupBarcodeOnline(String rawCode) async {
    final code = rawCode.trim();
    if (code.isEmpty) return;
    setState(() {
      _lookingUpInternet = true;
      _internetStatusMsg = 'Recherche sur Internet pour $code...';
      _internetStatusOk = true;
    });
    try {
      final res = await widget.api.lookupBarcodeOnInternet(code);
      if (!mounted) return;
      if (res['found'] == true) {
        if (res['existsLocally'] == true && res['product'] is Map) {
          final existing = Product.fromJson(Map<String, dynamic>.from(res['product'] as Map));
          _populateForm(existing);
          setState(() {
            _lookingUpInternet = false;
            _internetStatusOk = true;
            _internetStatusMsg = 'Déjà présent dans votre base locale (#${existing.id}).';
          });
          return;
        }
        setState(() {
          _lookingUpInternet = false;
          _internetStatusOk = true;
          _internetStatusMsg = 'Infos trouvées depuis ${res['source'] ?? 'Internet'}. Vérifiez et saisissez vos prix.';
          if (_brandCtrl.text.trim().isEmpty || _editingId == null) _brandCtrl.text = (res['brand'] ?? '').toString();
          if (_modelCtrl.text.trim().isEmpty || _editingId == null) _modelCtrl.text = (res['model_number'] ?? '').toString();
          final cat = (res['category'] ?? '').toString().trim();
          if (cat.isNotEmpty) _category = cat;
          if ((res['name_fr'] ?? '').toString().isNotEmpty) _nameFrCtrl.text = res['name_fr'].toString();
          if ((res['name_ar'] ?? '').toString().isNotEmpty) _nameArCtrl.text = res['name_ar'].toString();
          if ((res['description_fr'] ?? '').toString().isNotEmpty) _specsCtrl.text = res['description_fr'].toString();
        });
      } else {
        setState(() {
          _lookingUpInternet = false;
          _internetStatusOk = false;
          _internetStatusMsg = (res['message'] ?? 'Code-barres introuvable sur Internet — veuillez saisir manuellement.').toString();
        });
      }
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _lookingUpInternet = false;
        _internetStatusOk = false;
        _internetStatusMsg = 'Recherche Internet impossible ($e) — saisie manuelle active.';
      });
    }
  }

  void _populateForm(Product p) {
    setState(() {
      _showForm = true;
      _editingId = p.id;
      _barcodeCtrl.text = p.barcode;
      _skuCtrl.text = p.sku;
      _modelCtrl.text = p.modelNumber;
      _brandCtrl.text = p.brand;
      _category = p.category.trim().isNotEmpty ? p.category.trim() : _categories.first;
      _nameFrCtrl.text = p.nameFr;
      _nameArCtrl.text = p.nameAr;
      _specsCtrl.text = p.specsText;
      _costPriceCtrl.text = p.currentCostPrice.toStringAsFixed(2);
      _wholesalePriceCtrl.text = p.wholesalePrice.toStringAsFixed(2);
      _retailPriceCtrl.text = p.retailPrice.toStringAsFixed(2);
      _stockCtrl.text = p.stockQuantity.toString();
      _warrantyCtrl.text = p.warrantyMonths.toString();
    });
  }

  Future<void> _runAiGenerate() async {
    if (_brandCtrl.text.trim().isEmpty || _modelCtrl.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Renseignez la Marque et le Modèle pour la génération IA.')),
      );
      return;
    }
    try {
      final res = await widget.api.generateAiProductInfo(
        barcode: _barcodeCtrl.text.trim(),
        brand: _brandCtrl.text.trim(),
        modelNumber: _modelCtrl.text.trim(),
        category: _category,
        hintName: _nameFrCtrl.text.trim(),
      );
      setState(() {
        _nameFrCtrl.text = (res['name_fr'] ?? _nameFrCtrl.text).toString();
        _nameArCtrl.text = (res['name_ar'] ?? _nameArCtrl.text).toString();
        _specsCtrl.text = (res['specs_text'] ?? _specsCtrl.text).toString();
        _internetStatusOk = true;
        _internetStatusMsg = 'Fiche générée via ${res['source']?.toString().toUpperCase() ?? 'IA'}';
      });
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur IA: $e')));
    }
  }

  Future<void> _saveProduct() async {
    final payload = {
      'barcode': _barcodeCtrl.text.trim(),
      'sku': _skuCtrl.text.trim(),
      'model_number': _modelCtrl.text.trim(),
      'brand': _brandCtrl.text.trim(),
      'category': _category,
      'name_fr': _nameFrCtrl.text.trim(),
      'name_ar': _nameArCtrl.text.trim(),
      'specs_text': _specsCtrl.text.trim(),
      'current_cost_price': double.tryParse(_costPriceCtrl.text) ?? 0,
      'last_cost_price': double.tryParse(_costPriceCtrl.text) ?? 0,
      'wholesale_price': double.tryParse(_wholesalePriceCtrl.text) ?? 0,
      'retail_price': double.tryParse(_retailPriceCtrl.text) ?? 0,
      'stock_quantity': int.tryParse(_stockCtrl.text) ?? 0,
      'warranty_months': int.tryParse(_warrantyCtrl.text) ?? 12,
    };

    try {
      final saved = await widget.api.saveProduct(payload, editId: _editingId);
      if (_newSerialCtrl.text.trim().isNotEmpty) {
        final serials = _newSerialCtrl.text
            .split(RegExp(r'[,;\n]+'))
            .map((s) => s.trim())
            .where((s) => s.isNotEmpty)
            .toList();
        if (serials.isNotEmpty) {
          await widget.api.addSerialNumbers(saved.id, serials);
        }
        _newSerialCtrl.clear();
      }
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Produit synchronisé avec le serveur Windows ELECTROZEN')),
      );
      setState(() => _showForm = false);
      _loadCatalog();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardColor = isDark ? const Color(0xFF101828) : Colors.white;
    final borderColor = isDark ? const Color(0xFF1D2939) : const Color(0xFFE4E7EC);
    final categoryOptions = <String>{..._categories, _category}.toList();

    if (_showForm) {
      return ListView(
        padding: const EdgeInsets.all(14),
        children: [
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: cardColor,
              border: Border.all(color: borderColor),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      _editingId == null ? 'NOUVEAU PRODUIT' : 'MODIFIER PRODUIT #$_editingId',
                      style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                    ),
                    TextButton(
                      onPressed: () => setState(() => _showForm = false),
                      child: const Text('Retour Catalogue'),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(child: _field(_barcodeCtrl, 'Code-Barres EAN', mono: true)),
                    const SizedBox(width: 6),
                    IconButton.outlined(
                      tooltip: 'Scanner avec la caméra',
                      onPressed: () => _scanAndLookupForForm(openFormFirst: false),
                      icon: const Icon(Icons.qr_code_scanner, size: 19),
                    ),
                    const SizedBox(width: 4),
                    IconButton.outlined(
                      tooltip: 'Chercher sur Internet',
                      onPressed: _lookingUpInternet ? null : () => _lookupBarcodeOnline(_barcodeCtrl.text),
                      icon: _lookingUpInternet
                          ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2))
                          : const Icon(Icons.public, size: 19),
                    ),
                  ],
                ),
                if (_internetStatusMsg != null) ...[
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    decoration: BoxDecoration(
                      color: _internetStatusOk ? const Color(0xFFECFDF5) : const Color(0xFFFFFBEB),
                      border: Border.all(color: _internetStatusOk ? const Color(0xFFA7F3D0) : const Color(0xFFFDE68A)),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      _internetStatusMsg!,
                      style: TextStyle(
                        fontSize: 11.5,
                        fontWeight: FontWeight.w600,
                        color: _internetStatusOk ? const Color(0xFF065F46) : const Color(0xFF92400E),
                      ),
                    ),
                  ),
                ],
                const SizedBox(height: 10),
                _field(_skuCtrl, 'SKU Interne', mono: true),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(child: _field(_brandCtrl, 'Marque (ex: Samsung, LG)')),
                    const SizedBox(width: 8),
                    Expanded(child: _field(_modelCtrl, 'Modèle Exact', mono: true)),
                  ],
                ),
                const SizedBox(height: 10),
                DropdownButtonFormField<String>(
                  value: _category,
                  isExpanded: true,
                  decoration: const InputDecoration(
                    labelText: 'Catégorie',
                    isDense: true,
                    border: OutlineInputBorder(),
                  ),
                  items: categoryOptions
                      .map(
                        (c) => DropdownMenuItem(
                          value: c,
                          child: Text(c, overflow: TextOverflow.ellipsis, style: const TextStyle(fontSize: 13)),
                        ),
                      )
                      .toList(),
                  onChanged: (v) {
                    if (v != null) setState(() => _category = v);
                  },
                ),
                const SizedBox(height: 8),
                Align(
                  alignment: Alignment.centerRight,
                  child: OutlinedButton(
                    onPressed: _runAiGenerate,
                    child: const Text('Générer Fiche FR/AR par IA'),
                  ),
                ),
                const SizedBox(height: 8),
                _field(_nameFrCtrl, 'Désignation Produit (FR)'),
                const SizedBox(height: 10),
                _field(_nameArCtrl, 'Désignation Produit (AR)'),
                const SizedBox(height: 10),
                _field(_specsCtrl, 'Caractéristiques Techniques', maxLines: 2),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(child: _field(_costPriceCtrl, 'Coût Achat (MAD)', numeric: true, mono: true)),
                    const SizedBox(width: 8),
                    Expanded(child: _field(_wholesalePriceCtrl, 'Prix Gros (MAD)', numeric: true, mono: true)),
                    const SizedBox(width: 8),
                    Expanded(child: _field(_retailPriceCtrl, 'Prix Détail (MAD)', numeric: true, mono: true)),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(child: _field(_stockCtrl, 'Stock Quantité', numeric: true, mono: true)),
                    const SizedBox(width: 8),
                    Expanded(child: _field(_warrantyCtrl, 'Garantie (Mois)', numeric: true, mono: true)),
                  ],
                ),
                const SizedBox(height: 10),
                _field(
                  _newSerialCtrl,
                  'Ajouter Numéros de Série / IMEI (séparés par virgule)',
                  mono: true,
                ),
                const SizedBox(height: 14),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF203361),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 13),
                  ),
                  onPressed: _saveProduct,
                  child: const Text('Enregistrer sur le Serveur ELECTROZEN', style: TextStyle(fontWeight: FontWeight.w700)),
                ),
              ],
            ),
          ),
        ],
      );
    }

    return Column(
      children: [
        Container(
          padding: const EdgeInsets.fromLTRB(12, 12, 12, 10),
          decoration: BoxDecoration(
            color: cardColor,
            border: Border(bottom: BorderSide(color: borderColor)),
          ),
          child: Column(
            children: [
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _searchCtrl,
                      decoration: const InputDecoration(
                        hintText: 'Filtrer nom, marque, modèle, code...',
                        isDense: true,
                        prefixIcon: Icon(Icons.search, size: 18),
                      ),
                      onSubmitted: (_) => _loadCatalog(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  IconButton.outlined(
                    tooltip: 'Scanner & Ajouter un produit',
                    onPressed: () => _scanAndLookupForForm(openFormFirst: true),
                    icon: const Icon(Icons.qr_code_scanner, size: 19),
                  ),
                  const SizedBox(width: 6),
                  IconButton.outlined(
                    tooltip: 'Actualiser',
                    onPressed: _loadCatalog,
                    icon: const Icon(Icons.refresh, size: 19),
                  ),
                  const SizedBox(width: 6),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF203361),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 11),
                    ),
                    onPressed: () => _openNewWithBarcode(''),
                    icon: const Icon(Icons.add, size: 17),
                    label: const Text('Produit'),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              SizedBox(
                height: 32,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(right: 6),
                      child: ChoiceChip(
                        label: Text('Tous (${_products.length})', style: const TextStyle(fontSize: 11.5)),
                        selected: _selectedCategory == 'ALL',
                        onSelected: (_) {
                          setState(() => _selectedCategory = 'ALL');
                          _loadCatalog();
                        },
                      ),
                    ),
                    ..._categories.map(
                      (c) => Padding(
                        padding: const EdgeInsets.only(right: 6),
                        child: ChoiceChip(
                          label: Text(c, style: const TextStyle(fontSize: 11.5)),
                          selected: _selectedCategory == c,
                          onSelected: (_) {
                            setState(() => _selectedCategory = c);
                            _loadCatalog();
                          },
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        if (_loadError != null)
          Container(
            width: double.infinity,
            margin: const EdgeInsets.fromLTRB(12, 10, 12, 0),
            padding: const EdgeInsets.all(11),
            decoration: BoxDecoration(
              color: const Color(0xFFFEF2F2),
              border: Border.all(color: const Color(0xFFFECACA)),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              children: [
                const Icon(Icons.wifi_off, color: Color(0xFFB91C1C), size: 18),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Serveur Wi-Fi (${widget.api.baseUrl}): $_loadError',
                    style: const TextStyle(color: Color(0xFF991B1B), fontSize: 11.5, fontWeight: FontWeight.w600),
                  ),
                ),
                TextButton(
                  onPressed: _loadCatalog,
                  child: const Text('Réessayer'),
                ),
              ],
            ),
          ),
        Expanded(
          child: _loadingList
              ? const Center(child: CircularProgressIndicator(strokeWidth: 2))
              : _products.isEmpty
                  ? RefreshIndicator(
                      onRefresh: _loadCatalog,
                      child: ListView(
                        padding: const EdgeInsets.all(24),
                        children: [
                          const SizedBox(height: 40),
                          const Icon(Icons.inventory_2_outlined, size: 42, color: Color(0xFF98A2B3)),
                          const SizedBox(height: 10),
                          const Center(
                            child: Text(
                              'Aucun produit affiché',
                              style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                            ),
                          ),
                          const SizedBox(height: 6),
                          Center(
                            child: Text(
                              'Vérifiez l\'onglet Wi-Fi (${widget.api.baseUrl}) ou tirez pour actualiser.',
                              textAlign: TextAlign.center,
                              style: const TextStyle(fontSize: 12, color: Color(0xFF667085)),
                            ),
                          ),
                          const SizedBox(height: 14),
                          Center(
                            child: ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFF203361),
                                foregroundColor: Colors.white,
                              ),
                              onPressed: _loadCatalog,
                              icon: const Icon(Icons.sync, size: 17),
                              label: const Text('Synchroniser les Produits'),
                            ),
                          ),
                        ],
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _loadCatalog,
                      child: ListView.separated(
                        padding: const EdgeInsets.all(12),
                        itemCount: _products.length,
                        separatorBuilder: (_, __) => const SizedBox(height: 8),
                        itemBuilder: (context, idx) {
                          final p = _products[idx];
                          final lowStock = p.stockQuantity <= p.minStockAlert;
                          return Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: cardColor,
                              border: Border.all(color: borderColor),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    if (p.imageUrl.isNotEmpty) ...[
                                      ClipRRect(
                                        borderRadius: BorderRadius.circular(8),
                                        child: Container(
                                          width: 52,
                                          height: 52,
                                          decoration: BoxDecoration(
                                            color: Colors.white,
                                            border: Border.all(color: borderColor),
                                          ),
                                          child: Image.network(
                                            p.imageUrl.startsWith('http') ? p.imageUrl : '${widget.api.baseUrl}${p.imageUrl}',
                                            fit: BoxFit.contain,
                                            errorBuilder: (_, __, ___) => const Icon(Icons.inventory_2_outlined, size: 20, color: Colors.grey),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 10),
                                    ],
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            p.localizedName(widget.api.lang),
                                            maxLines: 2,
                                            overflow: TextOverflow.ellipsis,
                                            style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5),
                                          ),
                                          const SizedBox(height: 3),
                                          Text(
                                            '${p.brand} • ${p.modelNumber.isNotEmpty ? p.modelNumber : p.sku} • EAN ${p.barcode}',
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            style: const TextStyle(fontFamily: 'monospace', fontSize: 11, color: Color(0xFF667085)),
                                          ),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                                      decoration: BoxDecoration(
                                        color: (lowStock ? const Color(0xFFE11D48) : const Color(0xFF10B981)).withValues(alpha: 0.12),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Text(
                                        '${p.stockQuantity} u.',
                                        style: TextStyle(
                                          fontFamily: 'monospace',
                                          fontWeight: FontWeight.w700,
                                          fontSize: 11.5,
                                          color: lowStock ? const Color(0xFFE11D48) : const Color(0xFF10B981),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 10),
                                Row(
                                  children: [
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            'Détail: ${_madFmt.format(p.retailPrice)} MAD',
                                            style: const TextStyle(
                                              fontFamily: 'monospace',
                                              fontSize: 12.5,
                                              fontWeight: FontWeight.w800,
                                              color: Color(0xFF203361),
                                            ),
                                          ),
                                          Text(
                                            'Gros: ${_madFmt.format(p.wholesalePrice)} MAD',
                                            style: const TextStyle(
                                              fontFamily: 'monospace',
                                              fontSize: 11,
                                              fontWeight: FontWeight.w600,
                                              color: Color(0xFF667085),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    OutlinedButton(
                                      style: OutlinedButton.styleFrom(
                                        minimumSize: const Size(0, 34),
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                      ),
                                      onPressed: () => _populateForm(p),
                                      child: const Text('Modifier'),
                                    ),
                                    const SizedBox(width: 6),
                                    ElevatedButton(
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: const Color(0xFF203361),
                                        foregroundColor: Colors.white,
                                        minimumSize: const Size(0, 34),
                                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                      ),
                                      onPressed: p.stockQuantity > 0 ? () => widget.onAddToCart(p) : null,
                                      child: const Text('+ POS'),
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
    );
  }

  Widget _field(
    TextEditingController ctrl,
    String label, {
    bool numeric = false,
    bool mono = false,
    int maxLines = 1,
  }) {
    return TextField(
      controller: ctrl,
      maxLines: maxLines,
      keyboardType: numeric ? const TextInputType.numberWithOptions(decimal: true) : TextInputType.text,
      style: TextStyle(
        fontFamily: mono ? 'monospace' : null,
        fontSize: 13,
      ),
      decoration: InputDecoration(
        labelText: label,
        isDense: true,
        border: const OutlineInputBorder(),
      ),
    );
  }
}
