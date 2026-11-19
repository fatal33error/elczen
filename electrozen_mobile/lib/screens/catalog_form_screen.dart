import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
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
  State<CatalogFormScreen> createState() => CatalogFormScreenState();
}

class CatalogFormScreenState extends State<CatalogFormScreen> {
  final TextEditingController _searchCtrl = TextEditingController();
  List<Product> _products = [];
  String _selectedCategory = 'ALL';
  bool _loadingList = false;
  bool _lookingUpInternet = false;
  String? _internetStatusMsg;
  bool _internetStatusOk = true;
  String? _loadError;
  bool _showForm = false;
  bool _expandedDetails = false; // Quick Add by default, Expand shows all infos
  bool _busyPhotoAi = false;
  bool _enhancingAi = false;
  int? _editingId;
  String _imageUrl = '';
  final ImagePicker _picker = ImagePicker();
  final List<Map<String, String>> _capturedBoxPhotos = [];

  bool get isShowingForm => _showForm;

  bool handleBack() {
    if (_showForm) {
      setState(() {
        _showForm = false;
        _editingId = null;
      });
      return true;
    }
    return false;
  }

  // Form controllers
  final _barcodeCtrl = TextEditingController();
  final _skuCtrl = TextEditingController();
  final _modelCtrl = TextEditingController();
  final _brandCtrl = TextEditingController();
  String _category = 'Gros Électroménager';
  final _nameFrCtrl = TextEditingController();
  final _nameArCtrl = TextEditingController();
  final _nameEnCtrl = TextEditingController();
  final _specsCtrl = TextEditingController();
  final _descArCtrl = TextEditingController();
  final _descEnCtrl = TextEditingController();
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
    _nameEnCtrl.dispose();
    _specsCtrl.dispose();
    _descArCtrl.dispose();
    _descEnCtrl.dispose();
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
      _expandedDetails = false; // Quick Add Product by default
      _editingId = null;
      _imageUrl = (prefill?['image_url'] ?? '').toString();
      _capturedBoxPhotos.clear();
      _barcodeCtrl.text = barcode;
      _skuCtrl.text = 'EZ-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}';
      _modelCtrl.text = (prefill?['model_number'] ?? '').toString();
      _brandCtrl.text = (prefill?['brand'] ?? '').toString();
      final cat = (prefill?['category'] ?? '').toString().trim();
      if (cat.isNotEmpty) _category = cat;
      _nameFrCtrl.text = (prefill?['name_fr'] ?? '').toString();
      _nameArCtrl.text = (prefill?['name_ar'] ?? '').toString();
      _nameEnCtrl.text = (prefill?['name_en'] ?? '').toString();
      _specsCtrl.text = (prefill?['description_fr'] ?? prefill?['specs_text'] ?? '').toString();
      _descArCtrl.text = (prefill?['description_ar'] ?? '').toString();
      _descEnCtrl.text = (prefill?['description_en'] ?? '').toString();
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
          _internetStatusMsg = 'Introuvable sur Internet — saisissez manuellement ou utilisez les Photos IA.';
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
      _expandedDetails = false;
      _editingId = p.id;
      _imageUrl = p.imageUrl;
      _capturedBoxPhotos.clear();
      _barcodeCtrl.text = p.barcode;
      _skuCtrl.text = p.sku;
      _modelCtrl.text = p.modelNumber;
      _brandCtrl.text = p.brand;
      _category = p.category.trim().isNotEmpty ? p.category.trim() : _categories.first;
      _nameFrCtrl.text = p.nameFr;
      _nameArCtrl.text = p.nameAr;
      _nameEnCtrl.text = p.nameEn;
      _specsCtrl.text = p.specsText;
      _descArCtrl.text = '';
      _descEnCtrl.text = '';
      _costPriceCtrl.text = p.currentCostPrice.toStringAsFixed(2);
      _wholesalePriceCtrl.text = p.wholesalePrice.toStringAsFixed(2);
      _retailPriceCtrl.text = p.retailPrice.toStringAsFixed(2);
      _stockCtrl.text = p.stockQuantity.toString();
      _warrantyCtrl.text = p.warrantyMonths.toString();
    });
  }

  Future<void> _uploadProductPhoto(ImageSource source) async {
    try {
      final file = await _picker.pickImage(source: source, maxWidth: 1400, maxHeight: 1400, imageQuality: 85);
      if (file == null) return;
      setState(() {
        _busyPhotoAi = true;
        _internetStatusOk = true;
        _internetStatusMsg = 'Envoi de la photo produit au serveur...';
      });
      final bytes = await file.readAsBytes();
      final b64 = base64Encode(bytes);
      final mime = file.name.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
      _capturedBoxPhotos
        ..clear()
        ..add({'imageBase64': b64, 'mimeType': mime});
      final uploadedUrl = await widget.api.uploadProductImage(b64, mimeType: mime);
      if (!mounted) return;
      setState(() {
        _imageUrl = uploadedUrl;
        _busyPhotoAi = false;
        _internetStatusOk = true;
        _internetStatusMsg = 'Photo ajoutée ! Appuyez sur "Photo Pro Studio" pour générer le détourage sur fond blanc.';
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _busyPhotoAi = false;
        _internetStatusOk = false;
        _internetStatusMsg = 'Erreur photo: ${e.toString().replaceFirst("Exception: ", "")}';
      });
    }
  }

  Future<void> _generateProPhoto() async {
    if (_capturedBoxPhotos.isEmpty && _imageUrl.isEmpty) {
      await _openMultiPhotoExtractorSheet();
      return;
    }
    setState(() {
      _busyPhotoAi = true;
      _internetStatusOk = true;
      _internetStatusMsg = 'Génération de la photo produit studio sur fond blanc...';
    });
    try {
      final res = await widget.api.generateProProductPhoto(
        images: _capturedBoxPhotos,
        imageUrl: _imageUrl,
        productName: _nameFrCtrl.text.trim(),
        brand: _brandCtrl.text.trim(),
      );
      if (!mounted) return;
      final newUrl = (res['image_url'] ?? '').toString();
      setState(() {
        _busyPhotoAi = false;
        if (newUrl.isNotEmpty) _imageUrl = newUrl;
        _internetStatusOk = true;
        _internetStatusMsg = res['method'] == 'ai_studio_gen'
            ? 'Photo Pro Studio générée par IA !'
            : 'Photo Pro Studio détourée sur fond blanc avec succès !';
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _busyPhotoAi = false;
        _internetStatusOk = false;
        _internetStatusMsg = e.toString().replaceFirst('Exception: ', '');
      });
    }
  }

  Future<void> _openMultiPhotoExtractorSheet() async {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) {
          Future<void> addCameraPhoto() async {
            final file = await _picker.pickImage(source: ImageSource.camera, maxWidth: 1600, maxHeight: 1600, imageQuality: 85);
            if (file == null) return;
            final bytes = await file.readAsBytes();
            final mime = file.name.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
            setSheetState(() {
              _capturedBoxPhotos.add({'imageBase64': base64Encode(bytes), 'mimeType': mime});
            });
          }

          Future<void> addGalleryPhotos() async {
            final files = await _picker.pickMultiImage(maxWidth: 1600, maxHeight: 1600, imageQuality: 85);
            if (files.isEmpty) return;
            for (final file in files.take(4 - _capturedBoxPhotos.length)) {
              final bytes = await file.readAsBytes();
              final mime = file.name.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
              _capturedBoxPhotos.add({'imageBase64': base64Encode(bytes), 'mimeType': mime});
            }
            setSheetState(() {});
          }

          Future<void> runVisionExtract() async {
            if (_capturedBoxPhotos.isEmpty) return;
            Navigator.pop(ctx);
            setState(() {
              _busyPhotoAi = true;
              _internetStatusOk = true;
              _internetStatusMsg = 'Extraction fiche + Création Photo Pro Studio depuis ${_capturedBoxPhotos.length} photo(s)...';
            });
            try {
              final extractFuture = widget.api.extractProductFromImages(
                _capturedBoxPhotos,
                hintName: _nameFrCtrl.text.trim(),
              );
              final proPhotoFuture = widget.api
                  .generateProProductPhoto(
                    images: _capturedBoxPhotos,
                    productName: _nameFrCtrl.text.trim(),
                    brand: _brandCtrl.text.trim(),
                  )
                  .catchError((_) => <String, dynamic>{});

              final results = await Future.wait([extractFuture, proPhotoFuture]);
              final res = results[0];
              final proRes = results[1];
              if (!mounted) return;
              final proUrl = (proRes['image_url'] ?? '').toString();
              if (proUrl.isNotEmpty) {
                _imageUrl = proUrl;
              } else if (_imageUrl.isEmpty) {
                try {
                  final first = _capturedBoxPhotos.first;
                  _imageUrl = await widget.api.uploadProductImage(first['imageBase64']!, mimeType: first['mimeType'] ?? 'image/jpeg');
                } catch (_) {}
              }
              if (!mounted) return;
              setState(() {
                _busyPhotoAi = false;
                if ((res['brand'] ?? '').toString().isNotEmpty) _brandCtrl.text = res['brand'].toString();
                if ((res['model_number'] ?? '').toString().isNotEmpty) _modelCtrl.text = res['model_number'].toString();
                if ((res['barcode'] ?? '').toString().isNotEmpty && _barcodeCtrl.text.trim().isEmpty) {
                  _barcodeCtrl.text = res['barcode'].toString();
                }
                final cat = (res['category'] ?? '').toString().trim();
                if (cat.isNotEmpty) _category = cat;
                if ((res['name_fr'] ?? '').toString().isNotEmpty) _nameFrCtrl.text = res['name_fr'].toString();
                if ((res['name_ar'] ?? '').toString().isNotEmpty) _nameArCtrl.text = res['name_ar'].toString();
                if ((res['name_en'] ?? '').toString().isNotEmpty) _nameEnCtrl.text = res['name_en'].toString();
                final desc = (res['description_fr'] ?? res['specs_text'] ?? '').toString();
                if (desc.isNotEmpty) _specsCtrl.text = desc;
                if ((res['description_ar'] ?? '').toString().isNotEmpty) _descArCtrl.text = res['description_ar'].toString();
                if ((res['description_en'] ?? '').toString().isNotEmpty) _descEnCtrl.text = res['description_en'].toString();
                if ((res['warranty_months'] as num?) != null) _warrantyCtrl.text = '${(res['warranty_months'] as num).toInt()}';
                _internetStatusOk = true;
                _internetStatusMsg = proUrl.isNotEmpty
                    ? 'Infos extraites + Photo Pro Studio créée (${res['source']?.toString().toUpperCase()}) !'
                    : 'Fiche extraite depuis ${_capturedBoxPhotos.length} photo(s) (${res['source']?.toString().toUpperCase()}) !';
              });
            } catch (e) {
              if (!mounted) return;
              setState(() {
                _busyPhotoAi = false;
                _internetStatusOk = false;
                _internetStatusMsg = e.toString().replaceFirst('Exception: ', '');
              });
            }
          }

          return SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const Text(
                    'Extraire Infos Produit depuis Photos (Boîte / Étiquette)',
                    style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
                  ),
                  const SizedBox(height: 6),
                  const Text(
                    'Prenez 1 à 4 photos (face avant avec marque/modèle + côté avec caractéristiques). La 1ère photo sera aussi attachée comme image du produit.',
                    style: TextStyle(fontSize: 12, color: Color(0xFF667085)),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF203361), foregroundColor: Colors.white),
                          onPressed: _capturedBoxPhotos.length >= 4 ? null : addCameraPhoto,
                          icon: const Icon(Icons.camera_alt_outlined, size: 18),
                          label: const Text('Prendre Photo'),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: _capturedBoxPhotos.length >= 4 ? null : addGalleryPhotos,
                          icon: const Icon(Icons.photo_library_outlined, size: 18),
                          label: const Text('Galerie (Multi)'),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  if (_capturedBoxPhotos.isNotEmpty) ...[
                    SizedBox(
                      height: 82,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: _capturedBoxPhotos.length,
                        separatorBuilder: (_, __) => const SizedBox(width: 8),
                        itemBuilder: (_, i) {
                          final bytes = base64Decode(_capturedBoxPhotos[i]['imageBase64']!);
                          return Stack(
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(8),
                                child: Image.memory(bytes, width: 82, height: 82, fit: BoxFit.cover),
                              ),
                              Positioned(
                                right: 2,
                                top: 2,
                                child: InkWell(
                                  onTap: () => setSheetState(() => _capturedBoxPhotos.removeAt(i)),
                                  child: const CircleAvatar(
                                    radius: 11,
                                    backgroundColor: Colors.black87,
                                    child: Icon(Icons.close, size: 13, color: Colors.white),
                                  ),
                                ),
                              ),
                            ],
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 12),
                  ],
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF6D28D9), foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(vertical: 13)),
                    onPressed: _capturedBoxPhotos.isEmpty ? null : runVisionExtract,
                    icon: const Icon(Icons.auto_awesome, size: 18),
                    label: Text('Extraire Fiche Produit (${_capturedBoxPhotos.length} photo${_capturedBoxPhotos.length > 1 ? "s" : ""})'),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Future<void> _runAiEnhance() async {
    if (_nameFrCtrl.text.trim().isEmpty && _specsCtrl.text.trim().isEmpty && _brandCtrl.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Extrayez ou saisissez au moins un nom, marque ou caractéristique avant d\'améliorer.')),
      );
      return;
    }
    setState(() => _enhancingAi = true);
    try {
      final res = await widget.api.enhanceProductWithAi(
        nameFr: _nameFrCtrl.text.trim(),
        nameAr: _nameArCtrl.text.trim(),
        brand: _brandCtrl.text.trim(),
        modelNumber: _modelCtrl.text.trim(),
        category: _category,
        specsText: _specsCtrl.text.trim(),
        descriptionFr: _specsCtrl.text.trim(),
      );
      if (!mounted) return;
      setState(() {
        _enhancingAi = false;
        if ((res['brand'] ?? '').toString().isNotEmpty) _brandCtrl.text = res['brand'].toString();
        if ((res['model_number'] ?? '').toString().isNotEmpty) _modelCtrl.text = res['model_number'].toString();
        final cat = (res['category'] ?? '').toString().trim();
        if (cat.isNotEmpty) _category = cat;
        if ((res['name_fr'] ?? '').toString().isNotEmpty) _nameFrCtrl.text = res['name_fr'].toString();
        if ((res['name_ar'] ?? '').toString().isNotEmpty) _nameArCtrl.text = res['name_ar'].toString();
        if ((res['name_en'] ?? '').toString().isNotEmpty) _nameEnCtrl.text = res['name_en'].toString();
        final enhancedDesc = (res['description_fr'] ?? res['specs_text'] ?? '').toString();
        if (enhancedDesc.isNotEmpty) _specsCtrl.text = enhancedDesc;
        if ((res['description_ar'] ?? '').toString().isNotEmpty) _descArCtrl.text = res['description_ar'].toString();
        if ((res['description_en'] ?? '').toString().isNotEmpty) _descEnCtrl.text = res['description_en'].toString();
        _internetStatusOk = true;
        _internetStatusMsg = 'Caractéristiques & descriptions améliorées par ${res['source']?.toString().toUpperCase() ?? 'IA'} !';
      });
    } catch (e) {
      if (!mounted) return;
      setState(() => _enhancingAi = false);
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Erreur IA Enhance: ${e.toString().replaceFirst("Exception: ", "")}')));
    }
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
    final retailVal = double.tryParse(_retailPriceCtrl.text.replaceAll(',', '.')) ?? 0;
    final wholesaleParsed = double.tryParse(_wholesalePriceCtrl.text.replaceAll(',', '.')) ?? 0;
    final wholesaleVal = wholesaleParsed > 0 ? wholesaleParsed : retailVal;
    final costVal = double.tryParse(_costPriceCtrl.text.replaceAll(',', '.')) ?? 0;

    final payload = {
      'barcode': _barcodeCtrl.text.trim(),
      'sku': _skuCtrl.text.trim(),
      'model_number': _modelCtrl.text.trim(),
      'brand': _brandCtrl.text.trim(),
      'category': _category,
      'name_fr': _nameFrCtrl.text.trim(),
      'name_ar': _nameArCtrl.text.trim(),
      'name_en': _nameEnCtrl.text.trim(),
      'description_fr': _specsCtrl.text.trim(),
      'description_ar': _descArCtrl.text.trim(),
      'description_en': _descEnCtrl.text.trim(),
      'specs_text': _specsCtrl.text.trim(),
      'image_url': _imageUrl.trim(),
      'current_cost_price': costVal,
      'last_cost_price': costVal,
      'wholesale_price': wholesaleVal,
      'retail_price': retailVal,
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
                // Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.arrow_back),
                          tooltip: 'Retour au catalogue',
                          padding: EdgeInsets.zero,
                          constraints: const BoxConstraints(),
                          onPressed: () => setState(() => _showForm = false),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          _editingId == null ? 'AJOUT RAPIDE PRODUIT' : 'MODIFIER PRODUIT #$_editingId',
                          style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13),
                        ),
                      ],
                    ),
                    TextButton.icon(
                      onPressed: () => setState(() => _showForm = false),
                      icon: const Icon(Icons.close, size: 16),
                      label: const Text('Fermer'),
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // Product Image + Vision Box Photos Card
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF161F33) : const Color(0xFFF5F3FF),
                    border: Border.all(color: isDark ? const Color(0xFF3730A3) : const Color(0xFFDDD6FE)),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 58,
                            height: 58,
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: borderColor),
                            ),
                            child: _imageUrl.isNotEmpty
                                ? ClipRRect(
                                    borderRadius: BorderRadius.circular(8),
                                    child: Image.network(
                                      _imageUrl.startsWith('http') ? _imageUrl : '${widget.api.baseUrl}$_imageUrl',
                                      fit: BoxFit.contain,
                                      errorBuilder: (_, __, ___) => const Icon(Icons.image_outlined, color: Colors.grey),
                                    ),
                                  )
                                : const Icon(Icons.add_a_photo_outlined, color: Color(0xFF6D28D9)),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Photo Produit & Lecture Boîte IA',
                                  style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12.5, color: Color(0xFF5B21B6)),
                                ),
                                const SizedBox(height: 2),
                                const Text(
                                  'Ajoutez une image ou photographiez la boîte pour remplir marque, modèle et fiche.',
                                  style: TextStyle(fontSize: 11, color: Color(0xFF667085)),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 6,
                        runSpacing: 6,
                        children: [
                          ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF6D28D9),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                            ),
                            onPressed: _busyPhotoAi ? null : _openMultiPhotoExtractorSheet,
                            icon: const Icon(Icons.auto_awesome, size: 16),
                            label: const Text('Lire Photos Boîte (IA)', style: TextStyle(fontSize: 12)),
                          ),
                          ElevatedButton.icon(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF1C61E7),
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                            ),
                            onPressed: _busyPhotoAi ? null : _generateProPhoto,
                            icon: const Icon(Icons.wallpaper_outlined, size: 16),
                            label: const Text('Photo Pro Studio', style: TextStyle(fontSize: 12)),
                          ),
                          OutlinedButton.icon(
                            style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8)),
                            onPressed: _busyPhotoAi ? null : () => _uploadProductPhoto(ImageSource.camera),
                            icon: const Icon(Icons.camera_alt_outlined, size: 16),
                            label: const Text('Caméra', style: TextStyle(fontSize: 12)),
                          ),
                          OutlinedButton.icon(
                            style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8)),
                            onPressed: _busyPhotoAi ? null : () => _uploadProductPhoto(ImageSource.gallery),
                            icon: const Icon(Icons.photo_library_outlined, size: 16),
                            label: const Text('Galerie', style: TextStyle(fontSize: 12)),
                          ),
                        ],
                      ),
                      if (_busyPhotoAi) ...[
                        const SizedBox(height: 8),
                        const LinearProgressIndicator(),
                      ],
                    ],
                  ),
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

                // QUICK ADD CORE FIELDS
                _field(_nameFrCtrl, 'Désignation Produit (FR) *'),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(child: _field(_brandCtrl, 'Marque *')),
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
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(child: _field(_costPriceCtrl, 'Coût Achat (MAD)', numeric: true, mono: true)),
                    const SizedBox(width: 8),
                    Expanded(child: _field(_retailPriceCtrl, 'Prix Détail (MAD)', numeric: true, mono: true)),
                    const SizedBox(width: 8),
                    Expanded(child: _field(_stockCtrl, 'Stock', numeric: true, mono: true)),
                  ],
                ),
                const SizedBox(height: 10),

                // AI Enhance + Features Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Caractéristiques & Description', style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700, color: Color(0xFF667085))),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF1C61E7),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        minimumSize: const Size(0, 32),
                      ),
                      onPressed: _enhancingAi ? null : _runAiEnhance,
                      icon: _enhancingAi
                          ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                          : const Icon(Icons.auto_fix_high, size: 15),
                      label: Text(_enhancingAi ? 'IA...' : 'Améliorer IA', style: const TextStyle(fontSize: 11.5)),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                _field(_specsCtrl, 'Caractéristiques extraites / Description FR', maxLines: 3),

                const SizedBox(height: 10),

                // EXPAND / COLLAPSE ALL OTHER INFOS BUTTON
                OutlinedButton.icon(
                  style: OutlinedButton.styleFrom(
                    foregroundColor: const Color(0xFF5B21B6),
                    side: const BorderSide(color: Color(0xFFD8B4FE)),
                    backgroundColor: isDark ? const Color(0xFF1E1B4B) : const Color(0xFFFAF5FF),
                  ),
                  onPressed: () => setState(() => _expandedDetails = !_expandedDetails),
                  icon: Icon(_expandedDetails ? Icons.expand_less : Icons.expand_more, size: 20),
                  label: Text(
                    _expandedDetails
                        ? 'Réduire (Mode Ajout Rapide)'
                        : 'Afficher toutes les infos (Prix Gros, AR/EN, SKU, Garantie, Séries)',
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
                  ),
                ),

                if (_expandedDetails) ...[
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(child: _field(_wholesalePriceCtrl, 'Prix Gros (MAD)', numeric: true, mono: true)),
                      const SizedBox(width: 8),
                      Expanded(child: _field(_warrantyCtrl, 'Garantie (Mois)', numeric: true, mono: true)),
                    ],
                  ),
                  const SizedBox(height: 10),
                  _field(_skuCtrl, 'SKU Interne', mono: true),
                  const SizedBox(height: 10),
                  Align(
                    alignment: Alignment.centerRight,
                    child: OutlinedButton.icon(
                      onPressed: _runAiGenerate,
                      icon: const Icon(Icons.translate, size: 16),
                      label: const Text('Générer Titres FR/AR/EN par IA'),
                    ),
                  ),
                  const SizedBox(height: 8),
                  _field(_nameArCtrl, 'Désignation Produit (AR)'),
                  const SizedBox(height: 10),
                  _field(_nameEnCtrl, 'English Name'),
                  const SizedBox(height: 10),
                  _field(_descArCtrl, 'Description (AR)', maxLines: 2),
                  const SizedBox(height: 10),
                  _field(_descEnCtrl, 'Description (EN)', maxLines: 2),
                  const SizedBox(height: 10),
                  _field(
                    _newSerialCtrl,
                    'Ajouter Numéros de Série / IMEI (séparés par virgule)',
                    mono: true,
                  ),
                ],

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
