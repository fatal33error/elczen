import 'package:intl/intl.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import '../models/models.dart';

class ElectroZenPrintService {
  static final NumberFormat _madFmt = NumberFormat('#,##0.00', 'fr_FR');

  static String _fmt(double v) => '${_madFmt.format(v)} MAD';

  static Future<pw.Document> _buildInvoicePdfDoc(SaleRecord sale, Map<String, String> settings) async {
    final storeName = settings['store_name'] ?? 'ELECTROZEN';
    final storePhone = settings['store_phone'] ?? '+212 522 48 91 00';
    final storeAddr = settings['store_address'] ?? 'Quartier Maarif, Casablanca';
    final storeIce = settings['store_ice'] ?? '002849123000045';
    final storeIf = settings['store_if'] ?? '51829402';
    final storeRc = settings['store_rc'] ?? '512840';
    final storePatente = settings['store_patente'] ?? '34789210';
    final tvaRate = double.tryParse(settings['tva_rate'] ?? '20') ?? 20.0;

    final ttc = sale.totalAmount;
    final ht = ttc / (1 + tvaRate / 100);
    final tva = ttc - ht;

    final doc = pw.Document();
    doc.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(28),
        build: (ctx) => [
          pw.Row(
            mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              pw.Column(
                crossAxisAlignment: pw.CrossAxisAlignment.start,
                children: [
                  pw.Text(storeName, style: pw.TextStyle(fontSize: 20, fontWeight: pw.FontWeight.bold, color: PdfColor.fromHex('#203361'))),
                  pw.SizedBox(height: 3),
                  pw.Text(storeAddr, style: const pw.TextStyle(fontSize: 9.5, color: PdfColors.grey700)),
                  pw.Text('Tél: $storePhone', style: const pw.TextStyle(fontSize: 9.5, color: PdfColors.grey700)),
                ],
              ),
              pw.Column(
                crossAxisAlignment: pw.CrossAxisAlignment.end,
                children: [
                  pw.Text('FACTURE / BON DE GARANTIE', style: pw.TextStyle(fontSize: 12, fontWeight: pw.FontWeight.bold)),
                  pw.Text(sale.invoiceNumber, style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold, color: PdfColor.fromHex('#203361'))),
                  pw.Text('Date : ${sale.createdAt.length >= 16 ? sale.createdAt.substring(0, 16) : sale.createdAt}', style: const pw.TextStyle(fontSize: 9.5, color: PdfColors.grey700)),
                  if (sale.status == 'canceled')
                    pw.Text('ANNULÉE (${sale.creditNoteNumber})', style: pw.TextStyle(fontSize: 10, fontWeight: pw.FontWeight.bold, color: PdfColors.red)),
                ],
              ),
            ],
          ),
          pw.Divider(thickness: 1.5, color: PdfColor.fromHex('#203361')),
          pw.SizedBox(height: 8),
          pw.Container(
            padding: const pw.EdgeInsets.all(10),
            decoration: pw.BoxDecoration(
              color: PdfColors.grey100,
              border: pw.Border.all(color: PdfColors.grey300),
              borderRadius: pw.BorderRadius.circular(4),
            ),
            child: pw.Row(
              mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
              children: [
                pw.Text('Client : ${sale.customerName}', style: pw.TextStyle(fontSize: 10.5, fontWeight: pw.FontWeight.bold)),
                pw.Text('Tarif : ${sale.priceTier == 'wholesale' ? 'Gros' : 'Détail'} • Mode : ${sale.paymentMethod.toUpperCase()}', style: const pw.TextStyle(fontSize: 10)),
              ],
            ),
          ),
          pw.SizedBox(height: 14),
          pw.TableHelper.fromTextArray(
            headerStyle: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 9.5, color: PdfColors.white),
            headerDecoration: pw.BoxDecoration(color: PdfColor.fromHex('#203361')),
            cellStyle: const pw.TextStyle(fontSize: 9),
            cellPadding: const pw.EdgeInsets.symmetric(horizontal: 6, vertical: 6),
            headers: ['Désignation & N° Série', 'Garantie', 'Qté', 'P.U TTC', 'Total TTC'],
            data: sale.items.map((item) {
              final snPart = item.serialNumber.isNotEmpty ? '\nS/N: ${item.serialNumber}' : '';
              final barPart = item.barcode.isNotEmpty ? '\nEAN: ${item.barcode}' : '';
              final warPart = '${item.warrantyMonths} mois${item.warrantyExpiresAt.isNotEmpty ? '\nFin: ${item.warrantyExpiresAt}' : ''}';
              return [
                '${item.productName}$barPart$snPart',
                warPart,
                '${item.quantity}',
                _fmt(item.unitPrice),
                _fmt(item.subtotal),
              ];
            }).toList(),
          ),
          pw.SizedBox(height: 16),
          pw.Align(
            alignment: pw.Alignment.centerRight,
            child: pw.Container(
              width: 220,
              padding: const pw.EdgeInsets.all(10),
              decoration: pw.BoxDecoration(
                border: pw.Border.all(color: PdfColors.grey300),
                borderRadius: pw.BorderRadius.circular(4),
              ),
              child: pw.Column(
                crossAxisAlignment: pw.CrossAxisAlignment.stretch,
                children: [
                  _totalRow('Total HT', _fmt(ht)),
                  _totalRow('TVA (${tvaRate.toStringAsFixed(0)}%)', _fmt(tva)),
                  if (sale.discount > 0) _totalRow('Remise', '-${_fmt(sale.discount)}'),
                  pw.Divider(color: PdfColors.grey400),
                  _totalRow('Total TTC', _fmt(ttc), bold: true),
                  _totalRow('Montant Réglé', _fmt(sale.paidAmount)),
                  if (sale.remainingDebt > 0) _totalRow('Reste à Payer', _fmt(sale.remainingDebt), bold: true, color: PdfColors.orange800),
                ],
              ),
            ),
          ),
          pw.Spacer(),
          pw.Divider(color: PdfColors.grey300),
          pw.Text(
            'ICE: $storeIce • IF: $storeIf • RC: $storeRc • Patente: $storePatente',
            textAlign: pw.TextAlign.center,
            style: const pw.TextStyle(fontSize: 8.5, color: PdfColors.grey600),
          ),
          pw.SizedBox(height: 4),
          pw.Text(
            'Merci pour votre confiance ! Conservez ce document pour toute prise en charge SAV sous garantie.',
            textAlign: pw.TextAlign.center,
            style: const pw.TextStyle(fontSize: 8.5, color: PdfColors.grey700),
          ),
        ],
      ),
    );
    return doc;
  }

  static Future<void> printInvoiceA4(SaleRecord sale, Map<String, String> settings) async {
    final doc = await _buildInvoicePdfDoc(sale, settings);
    await Printing.layoutPdf(
      name: 'Facture_${sale.invoiceNumber}',
      onLayout: (format) async => doc.save(),
    );
  }

  static Future<void> shareInvoicePdf(SaleRecord sale, Map<String, String> settings) async {
    final doc = await _buildInvoicePdfDoc(sale, settings);
    await Printing.sharePdf(
      bytes: await doc.save(),
      filename: 'Facture_Garantie_${sale.invoiceNumber}.pdf',
    );
  }

  static Future<void> printBarcodeSticker(Product product, Map<String, String> settings, {int copies = 1}) async {
    final code = product.barcode.isNotEmpty ? product.barcode : (product.sku.isNotEmpty ? product.sku : 'EZ${product.id}');
    final doc = pw.Document();
    const stickerFmt = PdfPageFormat(50 * PdfPageFormat.mm, 30 * PdfPageFormat.mm);
    for (int i = 0; i < copies.clamp(1, 20); i++) {
      doc.addPage(
        pw.Page(
          pageFormat: stickerFmt,
          margin: const pw.EdgeInsets.all(4),
          build: (ctx) => pw.Column(
            mainAxisAlignment: pw.MainAxisAlignment.center,
            crossAxisAlignment: pw.CrossAxisAlignment.center,
            children: [
              pw.Text(
                '${product.brand.toUpperCase()} • ${product.modelNumber.isNotEmpty ? product.modelNumber : product.sku}',
                maxLines: 1,
                style: pw.TextStyle(fontSize: 6.5, fontWeight: pw.FontWeight.bold, color: PdfColors.grey700),
              ),
              pw.SizedBox(height: 1.5),
              pw.Text(
                product.nameFr,
                maxLines: 1,
                textAlign: pw.TextAlign.center,
                style: pw.TextStyle(fontSize: 7.5, fontWeight: pw.FontWeight.bold),
              ),
              pw.SizedBox(height: 3),
              pw.BarcodeWidget(
                barcode: pw.Barcode.code128(),
                data: code,
                width: 112,
                height: 26,
                drawText: false,
              ),
              pw.SizedBox(height: 1.5),
              pw.Text(code, style: const pw.TextStyle(fontSize: 7)),
              pw.SizedBox(height: 2),
              pw.Text(
                _fmt(product.retailPrice),
                style: pw.TextStyle(fontSize: 10.5, fontWeight: pw.FontWeight.bold),
              ),
            ],
          ),
        ),
      );
    }
    await Printing.layoutPdf(
      name: 'Etiquette_${product.sku.isNotEmpty ? product.sku : product.barcode}',
      onLayout: (format) async => doc.save(),
    );
  }

  static Future<void> printWarrantyCertificate(SaleRecord sale, Map<String, String> settings) async {
    final storeName = settings['store_name'] ?? 'ELECTROZEN';
    final storePhone = settings['store_phone'] ?? '+212 522 48 91 00';
    final storeAddr = settings['store_address'] ?? 'Quartier Maarif, Casablanca';

    final doc = pw.Document();
    doc.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(28),
        build: (ctx) => pw.Container(
          padding: const pw.EdgeInsets.all(20),
          decoration: pw.BoxDecoration(
            border: pw.Border.all(color: PdfColor.fromHex('#203361'), width: 2),
            borderRadius: pw.BorderRadius.circular(8),
          ),
          child: pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.stretch,
            children: [
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text(storeName, style: pw.TextStyle(fontSize: 22, fontWeight: pw.FontWeight.bold, color: PdfColor.fromHex('#203361'))),
                      pw.Text(storeAddr, style: const pw.TextStyle(fontSize: 10, color: PdfColors.grey700)),
                      pw.Text('Service SAV : $storePhone', style: const pw.TextStyle(fontSize: 10, color: PdfColors.grey700)),
                    ],
                  ),
                  pw.Container(
                    padding: const pw.EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: pw.BoxDecoration(
                      color: PdfColor.fromHex('#203361'),
                      borderRadius: pw.BorderRadius.circular(6),
                    ),
                    child: pw.Text('BON DE GARANTIE', style: pw.TextStyle(fontSize: 13, fontWeight: pw.FontWeight.bold, color: PdfColors.white)),
                  ),
                ],
              ),
              pw.SizedBox(height: 16),
              pw.Container(
                padding: const pw.EdgeInsets.all(12),
                decoration: pw.BoxDecoration(color: PdfColors.grey100, borderRadius: pw.BorderRadius.circular(6)),
                child: pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [
                    pw.Column(
                      crossAxisAlignment: pw.CrossAxisAlignment.start,
                      children: [
                        pw.Text('Bénéficiaire (Client) :', style: const pw.TextStyle(fontSize: 9, color: PdfColors.grey600)),
                        pw.Text(sale.customerName, style: pw.TextStyle(fontSize: 13, fontWeight: pw.FontWeight.bold)),
                      ],
                    ),
                    pw.Column(
                      crossAxisAlignment: pw.CrossAxisAlignment.end,
                      children: [
                        pw.Text('Facture Réf. : ${sale.invoiceNumber}', style: pw.TextStyle(fontSize: 11, fontWeight: pw.FontWeight.bold)),
                        pw.Text('Date d\'achat : ${sale.createdAt.length >= 10 ? sale.createdAt.substring(0, 10) : sale.createdAt}', style: const pw.TextStyle(fontSize: 10)),
                      ],
                    ),
                  ],
                ),
              ),
              pw.SizedBox(height: 18),
              pw.Text('APPAREILS COUVERTS PAR LA GARANTIE', style: pw.TextStyle(fontSize: 11, fontWeight: pw.FontWeight.bold, color: PdfColor.fromHex('#203361'))),
              pw.SizedBox(height: 8),
              pw.TableHelper.fromTextArray(
                headerStyle: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 10, color: PdfColors.white),
                headerDecoration: pw.BoxDecoration(color: PdfColor.fromHex('#203361')),
                cellStyle: const pw.TextStyle(fontSize: 9.5),
                cellPadding: const pw.EdgeInsets.all(8),
                headers: ['Produit / Modèle', 'N° Série / IMEI', 'Qté', 'Durée', 'Date d\'expiration'],
                data: sale.items.map((item) {
                  return [
                    item.productName,
                    item.serialNumber.isNotEmpty ? item.serialNumber : (item.barcode.isNotEmpty ? 'EAN: ${item.barcode}' : 'Standard'),
                    '${item.quantity}',
                    '${item.warrantyMonths} mois',
                    item.warrantyExpiresAt.isNotEmpty ? item.warrantyExpiresAt : 'Voir facture',
                  ];
                }).toList(),
              ),
              pw.SizedBox(height: 22),
              pw.Container(
                padding: const pw.EdgeInsets.all(12),
                decoration: pw.BoxDecoration(
                  border: pw.Border.all(color: PdfColors.grey300),
                  borderRadius: pw.BorderRadius.circular(6),
                ),
                child: pw.Column(
                  crossAxisAlignment: pw.CrossAxisAlignment.start,
                  children: [
                    pw.Text('CONDITIONS GÉNÉRALES DE GARANTIE', style: pw.TextStyle(fontSize: 10, fontWeight: pw.FontWeight.bold)),
                    pw.SizedBox(height: 6),
                    pw.Text(
                      '1. La présente garantie couvre les défauts de fabrication (pièces et main-d\'œuvre) durant la période indiquée ci-dessus à compter de la date d\'achat.\n'
                      '2. La présentation de ce Bon de Garantie et de la facture originale est obligatoire pour toute intervention SAV.\n'
                      '3. Sont exclus de la garantie : les chocs physiques, dégâts liquides, surtensions électriques, mauvaise utilisation ou intervention par un tiers non agréé.\n'
                      '4. Le numéro de série (S/N / IMEI) de l\'appareil doit rester lisible et intact.',
                      style: const pw.TextStyle(fontSize: 9, lineSpacing: 3, color: PdfColors.grey800),
                    ),
                  ],
                ),
              ),
              pw.Spacer(),
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text('Signature Client', style: pw.TextStyle(fontSize: 10, fontWeight: pw.FontWeight.bold)),
                      pw.SizedBox(height: 36),
                      pw.Container(width: 140, height: 1, color: PdfColors.grey400),
                    ],
                  ),
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.end,
                    children: [
                      pw.Text('Cachet & Signature $storeName', style: pw.TextStyle(fontSize: 10, fontWeight: pw.FontWeight.bold)),
                      pw.SizedBox(height: 36),
                      pw.Container(width: 160, height: 1, color: PdfColors.grey400),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );

    await Printing.layoutPdf(
      name: 'Garantie_${sale.invoiceNumber}',
      onLayout: (format) async => doc.save(),
    );
  }

  static Future<void> printThermalReceipt(SaleRecord sale, Map<String, String> settings) async {
    final storeName = settings['store_name'] ?? 'ELECTROZEN';
    final storePhone = settings['store_phone'] ?? '+212 522 48 91 00';
    final storeAddr = settings['store_address'] ?? 'Quartier Maarif, Casablanca';

    final doc = pw.Document();
    doc.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.roll80,
        margin: const pw.EdgeInsets.symmetric(horizontal: 10, vertical: 14),
        build: (ctx) => pw.Column(
          crossAxisAlignment: pw.CrossAxisAlignment.stretch,
          children: [
            pw.Text(storeName, textAlign: pw.TextAlign.center, style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold)),
            pw.Text(storeAddr, textAlign: pw.TextAlign.center, style: const pw.TextStyle(fontSize: 8)),
            pw.Text('Tél: $storePhone', textAlign: pw.TextAlign.center, style: const pw.TextStyle(fontSize: 8)),
            pw.SizedBox(height: 6),
            pw.Divider(borderStyle: pw.BorderStyle.dashed),
            pw.Text('TICKET : ${sale.invoiceNumber}', style: pw.TextStyle(fontSize: 9.5, fontWeight: pw.FontWeight.bold)),
            pw.Text('Date : ${sale.createdAt.length >= 16 ? sale.createdAt.substring(0, 16) : sale.createdAt}', style: const pw.TextStyle(fontSize: 8.5)),
            pw.Text('Client : ${sale.customerName}', style: const pw.TextStyle(fontSize: 8.5)),
            pw.Divider(borderStyle: pw.BorderStyle.dashed),
            ...sale.items.map((item) => pw.Padding(
              padding: const pw.EdgeInsets.only(bottom: 5),
              child: pw.Column(
                crossAxisAlignment: pw.CrossAxisAlignment.start,
                children: [
                  pw.Text(item.productName, style: pw.TextStyle(fontSize: 8.5, fontWeight: pw.FontWeight.bold)),
                  pw.Row(
                    mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                    children: [
                      pw.Text('${item.quantity} x ${_fmt(item.unitPrice)}', style: const pw.TextStyle(fontSize: 8)),
                      pw.Text(_fmt(item.subtotal), style: pw.TextStyle(fontSize: 8.5, fontWeight: pw.FontWeight.bold)),
                    ],
                  ),
                  if (item.serialNumber.isNotEmpty)
                    pw.Text('S/N: ${item.serialNumber}', style: const pw.TextStyle(fontSize: 7.5)),
                  pw.Text('Garantie: ${item.warrantyMonths} mois', style: const pw.TextStyle(fontSize: 7.5, color: PdfColors.grey700)),
                ],
              ),
            )),
            pw.Divider(borderStyle: pw.BorderStyle.dashed),
            if (sale.discount > 0) _totalRow('Remise', '-${_fmt(sale.discount)}', fontSize: 8.5),
            _totalRow('TOTAL TTC', _fmt(sale.totalAmount), bold: true, fontSize: 10.5),
            _totalRow('Payé', _fmt(sale.paidAmount), fontSize: 8.5),
            if (sale.remainingDebt > 0) _totalRow('Reste dû', _fmt(sale.remainingDebt), bold: true, fontSize: 8.5),
            pw.SizedBox(height: 8),
            pw.Text('Merci pour votre visite !', textAlign: pw.TextAlign.center, style: pw.TextStyle(fontSize: 9, fontWeight: pw.FontWeight.bold)),
          ],
        ),
      ),
    );

    await Printing.layoutPdf(
      name: 'Ticket_${sale.invoiceNumber}',
      onLayout: (format) async => doc.save(),
    );
  }

  static pw.Widget _totalRow(String label, String val, {bool bold = false, double fontSize = 9.5, PdfColor? color}) {
    final style = pw.TextStyle(
      fontSize: fontSize,
      fontWeight: bold ? pw.FontWeight.bold : pw.FontWeight.normal,
      color: color ?? PdfColors.black,
    );
    return pw.Padding(
      padding: const pw.EdgeInsets.symmetric(vertical: 1.5),
      child: pw.Row(
        mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
        children: [
          pw.Text(label, style: style),
          pw.Text(val, style: style),
        ],
      ),
    );
  }
}
