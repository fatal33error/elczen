import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'package:intl/intl.dart';

class PrintingService {
  static final NumberFormat _madFmt = NumberFormat('#,##0.00', 'fr_FR');
  static String formatMad(num value) => '${_madFmt.format(value)} MAD';

  /// Prints an 80mm POS Thermal Receipt
  static Future<void> printThermalReceipt({
    required Map<String, dynamic> sale,
    required Map<String, String> storeSettings,
  }) async {
    final doc = pw.Document();

    final storeName = storeSettings['store_name'] ?? 'ELECTROZEN';
    final storePhone = storeSettings['store_phone'] ?? '+212 522 48 91 00';
    final storeAddress = storeSettings['store_address'] ?? 'Casablanca, Maroc';
    final storeIce = storeSettings['store_ice'] ?? '002849123000045';

    final invoiceNum = sale['invoice_number'] ?? 'FAC-0000';
    final createdAt = sale['created_at']?.toString().split('.').first ?? DateTime.now().toString().split('.').first;
    final customerName = sale['customer_name'] ?? 'Client Comptoir';
    final paymentMethod = sale['payment_method'] ?? 'cash';
    final totalAmount = (sale['total_amount'] as num?)?.toDouble() ?? 0.0;
    final discount = (sale['discount'] as num?)?.toDouble() ?? 0.0;
    final paidAmount = (sale['paid_amount'] as num?)?.toDouble() ?? totalAmount;
    final remainingDebt = (sale['remaining_debt'] as num?)?.toDouble() ?? 0.0;
    final items = (sale['items'] as List<dynamic>?) ?? [];

    doc.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.roll80,
        margin: const pw.EdgeInsets.symmetric(horizontal: 8, vertical: 12),
        build: (pw.Context context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.center,
            children: [
              // Store Header
              pw.Text(
                storeName,
                style: pw.TextStyle(fontSize: 16, fontWeight: pw.FontWeight.bold),
                textAlign: pw.TextAlign.center,
              ),
              pw.SizedBox(height: 2),
              pw.Text(
                'Électroménager & High-Tech',
                style: const pw.TextStyle(fontSize: 9),
                textAlign: pw.TextAlign.center,
              ),
              pw.Text(
                storeAddress,
                style: const pw.TextStyle(fontSize: 8),
                textAlign: pw.TextAlign.center,
              ),
              pw.Text(
                'Tél: $storePhone | ICE: $storeIce',
                style: const pw.TextStyle(fontSize: 8),
                textAlign: pw.TextAlign.center,
              ),
              pw.SizedBox(height: 6),
              pw.Divider(thickness: 0.8),
              pw.SizedBox(height: 4),

              // Invoice Metadata
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Text('Ticket: $invoiceNum', style: pw.TextStyle(fontSize: 9, fontWeight: pw.FontWeight.bold)),
                  pw.Text(createdAt.toString().split('.').first, style: const pw.TextStyle(fontSize: 8)),
                ],
              ),
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Text('Client: $customerName', style: const pw.TextStyle(fontSize: 8.5)),
                  pw.Text('Règlement: ${paymentMethod.toString().toUpperCase()}', style: const pw.TextStyle(fontSize: 8)),
                ],
              ),
              pw.SizedBox(height: 6),
              pw.Divider(thickness: 0.5, borderStyle: pw.BorderStyle.dashed),
              pw.SizedBox(height: 4),

              // Items Header
              pw.Row(
                children: [
                  pw.Expanded(flex: 5, child: pw.Text('Désignation', style: pw.TextStyle(fontSize: 8, fontWeight: pw.FontWeight.bold))),
                  pw.Expanded(flex: 1, child: pw.Text('Qté', textAlign: pw.TextAlign.center, style: pw.TextStyle(fontSize: 8, fontWeight: pw.FontWeight.bold))),
                  pw.Expanded(flex: 2, child: pw.Text('P.U', textAlign: pw.TextAlign.right, style: pw.TextStyle(fontSize: 8, fontWeight: pw.FontWeight.bold))),
                  pw.Expanded(flex: 2, child: pw.Text('Total', textAlign: pw.TextAlign.right, style: pw.TextStyle(fontSize: 8, fontWeight: pw.FontWeight.bold))),
                ],
              ),
              pw.SizedBox(height: 4),

              // Items List
              ...items.map((it) {
                final name = it['product_name'] ?? 'Article';
                final qty = it['quantity'] ?? 1;
                final unitPrice = (it['unit_price'] as num?)?.toDouble() ?? 0.0;
                final subtotal = (it['subtotal'] as num?)?.toDouble() ?? (qty * unitPrice);
                final serial = it['serial_number']?.toString() ?? '';

                return pw.Padding(
                  padding: const pw.EdgeInsets.symmetric(vertical: 2),
                  child: pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Row(
                        crossAxisAlignment: pw.CrossAxisAlignment.start,
                        children: [
                          pw.Expanded(
                            flex: 5,
                            child: pw.Text(name, style: const pw.TextStyle(fontSize: 8)),
                          ),
                          pw.Expanded(
                            flex: 1,
                            child: pw.Text('$qty', textAlign: pw.TextAlign.center, style: const pw.TextStyle(fontSize: 8)),
                          ),
                          pw.Expanded(
                            flex: 2,
                            child: pw.Text(_madFmt.format(unitPrice), textAlign: pw.TextAlign.right, style: const pw.TextStyle(fontSize: 8)),
                          ),
                          pw.Expanded(
                            flex: 2,
                            child: pw.Text(_madFmt.format(subtotal), textAlign: pw.TextAlign.right, style: pw.TextStyle(fontSize: 8, fontWeight: pw.FontWeight.bold)),
                          ),
                        ],
                      ),
                      if (serial.isNotEmpty)
                        pw.Padding(
                          padding: const pw.EdgeInsets.only(left: 4, top: 1),
                          child: pw.Text('S/N: $serial', style: const pw.TextStyle(fontSize: 7, color: PdfColors.grey700)),
                        ),
                    ],
                  ),
                );
              }),

              pw.SizedBox(height: 6),
              pw.Divider(thickness: 0.8),
              pw.SizedBox(height: 4),

              // Totals
              if (discount > 0)
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [
                    pw.Text('Remise commerciale:', style: const pw.TextStyle(fontSize: 8.5)),
                    pw.Text('-${_madFmt.format(discount)} MAD', style: const pw.TextStyle(fontSize: 8.5)),
                  ],
                ),
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Text('TOTAL TTC:', style: pw.TextStyle(fontSize: 11, fontWeight: pw.FontWeight.bold)),
                  pw.Text('${_madFmt.format(totalAmount)} MAD', style: pw.TextStyle(fontSize: 12, fontWeight: pw.FontWeight.bold)),
                ],
              ),
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Text('Montant Payé:', style: const pw.TextStyle(fontSize: 8.5)),
                  pw.Text('${_madFmt.format(paidAmount)} MAD', style: const pw.TextStyle(fontSize: 8.5)),
                ],
              ),
              if (remainingDebt > 0)
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [
                    pw.Text('Reste à payer:', style: pw.TextStyle(fontSize: 8.5, fontWeight: pw.FontWeight.bold, color: PdfColors.red700)),
                    pw.Text('${_madFmt.format(remainingDebt)} MAD', style: pw.TextStyle(fontSize: 8.5, fontWeight: pw.FontWeight.bold, color: PdfColors.red700)),
                  ],
                ),

              pw.SizedBox(height: 10),
              pw.BarcodeWidget(
                barcode: pw.Barcode.code128(),
                data: invoiceNum,
                width: 140,
                height: 28,
                drawText: false,
              ),
              pw.SizedBox(height: 6),
              pw.Text(
                'Garantie matériel selon conditions constructeur.\nConservez ce ticket pour le SAV.\nMerci de votre confiance !',
                textAlign: pw.TextAlign.center,
                style: const pw.TextStyle(fontSize: 7.5, color: PdfColors.grey800),
              ),
            ],
          );
        },
      ),
    );

    await Printing.layoutPdf(
      onLayout: (PdfPageFormat format) async => doc.save(),
      name: 'Ticket-$invoiceNum.pdf',
    );
  }

  /// Prints an A4 Official Store Invoice
  static Future<void> printA4Invoice({
    required Map<String, dynamic> sale,
    required Map<String, String> storeSettings,
  }) async {
    final doc = pw.Document();

    final storeName = storeSettings['store_name'] ?? 'ELECTROZEN';
    final storePhone = storeSettings['store_phone'] ?? '+212 522 48 91 00';
    final storeAddress = storeSettings['store_address'] ?? 'Casablanca, Maroc';
    final storeIce = storeSettings['store_ice'] ?? '002849123000045';
    final storeIf = storeSettings['store_if'] ?? '51829402';
    final storeRc = storeSettings['store_rc'] ?? '512840 (Casablanca)';
    final storePatente = storeSettings['store_patente'] ?? '34789210';

    final invoiceNum = sale['invoice_number'] ?? 'FAC-0000';
    final createdAt = sale['created_at']?.toString().split('.').first ?? DateTime.now().toString().split('.').first;
    final customerName = sale['customer_name'] ?? 'Client Comptoir';
    final paymentMethod = sale['payment_method'] ?? 'cash';
    final totalAmount = (sale['total_amount'] as num?)?.toDouble() ?? 0.0;
    final discount = (sale['discount'] as num?)?.toDouble() ?? 0.0;
    final paidAmount = (sale['paid_amount'] as num?)?.toDouble() ?? totalAmount;
    final remainingDebt = (sale['remaining_debt'] as num?)?.toDouble() ?? 0.0;
    final items = (sale['items'] as List<dynamic>?) ?? [];

    doc.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(32),
        build: (pw.Context context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              // Header
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                crossAxisAlignment: pw.CrossAxisAlignment.start,
                children: [
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text(storeName, style: pw.TextStyle(fontSize: 22, fontWeight: pw.FontWeight.bold, color: PdfColors.blue900)),
                      pw.SizedBox(height: 2),
                      pw.Text('Électroménager, Climatisation & High-Tech', style: const pw.TextStyle(fontSize: 10, color: PdfColors.grey700)),
                      pw.Text(storeAddress, style: const pw.TextStyle(fontSize: 9, color: PdfColors.grey700)),
                      pw.Text('Tél: $storePhone', style: const pw.TextStyle(fontSize: 9, color: PdfColors.grey700)),
                      pw.SizedBox(height: 4),
                      pw.Text('ICE: $storeIce | IF: $storeIf | RC: $storeRc | Patente: $storePatente', style: const pw.TextStyle(fontSize: 8, color: PdfColors.grey600)),
                    ],
                  ),
                  pw.Container(
                    padding: const pw.EdgeInsets.all(10),
                    decoration: pw.BoxDecoration(
                      border: pw.Border.all(color: PdfColors.grey300),
                      borderRadius: pw.BorderRadius.circular(6),
                    ),
                    child: pw.Column(
                      crossAxisAlignment: pw.CrossAxisAlignment.end,
                      children: [
                        pw.Text('FACTURE CLIENT', style: pw.TextStyle(fontSize: 14, fontWeight: pw.FontWeight.bold, color: PdfColors.blue900)),
                        pw.SizedBox(height: 4),
                        pw.Text('Réf: $invoiceNum', style: pw.TextStyle(fontSize: 10, fontWeight: pw.FontWeight.bold)),
                        pw.Text('Date: ${createdAt.toString().split(".").first}', style: const pw.TextStyle(fontSize: 9)),
                        pw.Text('Règlement: ${paymentMethod.toString().toUpperCase()}', style: const pw.TextStyle(fontSize: 9)),
                      ],
                    ),
                  ),
                ],
              ),
              pw.SizedBox(height: 18),

              // Customer Info Box
              pw.Container(
                width: double.infinity,
                padding: const pw.EdgeInsets.all(10),
                decoration: pw.BoxDecoration(
                  color: PdfColors.grey100,
                  borderRadius: pw.BorderRadius.circular(6),
                ),
                child: pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [
                    pw.Column(
                      crossAxisAlignment: pw.CrossAxisAlignment.start,
                      children: [
                        pw.Text('Facturé à :', style: pw.TextStyle(fontSize: 9, fontWeight: pw.FontWeight.bold, color: PdfColors.grey700)),
                        pw.SizedBox(height: 2),
                        pw.Text(customerName, style: pw.TextStyle(fontSize: 12, fontWeight: pw.FontWeight.bold)),
                      ],
                    ),
                    pw.Column(
                      crossAxisAlignment: pw.CrossAxisAlignment.end,
                      children: [
                        pw.Text('Devise: Dirham Marocain (MAD)', style: const pw.TextStyle(fontSize: 9)),
                        pw.Text('TVA: 20% incluse (TTC)', style: const pw.TextStyle(fontSize: 9)),
                      ],
                    ),
                  ],
                ),
              ),
              pw.SizedBox(height: 14),

              // Table
              pw.Table(
                border: pw.TableBorder.all(color: PdfColors.grey300, width: 0.5),
                columnWidths: {
                  0: const pw.FlexColumnWidth(4.5),
                  1: const pw.FlexColumnWidth(1.2),
                  2: const pw.FlexColumnWidth(2.0),
                  3: const pw.FlexColumnWidth(2.3),
                },
                children: [
                  pw.TableRow(
                    decoration: const pw.BoxDecoration(color: PdfColors.blue50),
                    children: [
                      pw.Padding(padding: const pw.EdgeInsets.all(6), child: pw.Text('Désignation de l\'article', style: pw.TextStyle(fontSize: 9, fontWeight: pw.FontWeight.bold))),
                      pw.Padding(padding: const pw.EdgeInsets.all(6), child: pw.Text('Qté', textAlign: pw.TextAlign.center, style: pw.TextStyle(fontSize: 9, fontWeight: pw.FontWeight.bold))),
                      pw.Padding(padding: const pw.EdgeInsets.all(6), child: pw.Text('Prix Unitaire TTC', textAlign: pw.TextAlign.right, style: pw.TextStyle(fontSize: 9, fontWeight: pw.FontWeight.bold))),
                      pw.Padding(padding: const pw.EdgeInsets.all(6), child: pw.Text('Total TTC', textAlign: pw.TextAlign.right, style: pw.TextStyle(fontSize: 9, fontWeight: pw.FontWeight.bold))),
                    ],
                  ),
                  ...items.map((it) {
                    final name = it['product_name'] ?? 'Article';
                    final qty = it['quantity'] ?? 1;
                    final unitPrice = (it['unit_price'] as num?)?.toDouble() ?? 0.0;
                    final subtotal = (it['subtotal'] as num?)?.toDouble() ?? (qty * unitPrice);
                    final serial = it['serial_number']?.toString() ?? '';

                    return pw.TableRow(
                      children: [
                        pw.Padding(
                          padding: const pw.EdgeInsets.all(6),
                          child: pw.Column(
                            crossAxisAlignment: pw.CrossAxisAlignment.start,
                            children: [
                              pw.Text(name, style: const pw.TextStyle(fontSize: 9)),
                              if (serial.isNotEmpty)
                                pw.Text('Numéro de série: $serial', style: const pw.TextStyle(fontSize: 7.5, color: PdfColors.grey700)),
                            ],
                          ),
                        ),
                        pw.Padding(padding: const pw.EdgeInsets.all(6), child: pw.Text('$qty', textAlign: pw.TextAlign.center, style: const pw.TextStyle(fontSize: 9))),
                        pw.Padding(padding: const pw.EdgeInsets.all(6), child: pw.Text(_madFmt.format(unitPrice), textAlign: pw.TextAlign.right, style: const pw.TextStyle(fontSize: 9))),
                        pw.Padding(padding: const pw.EdgeInsets.all(6), child: pw.Text(_madFmt.format(subtotal), textAlign: pw.TextAlign.right, style: pw.TextStyle(fontSize: 9, fontWeight: pw.FontWeight.bold))),
                      ],
                    );
                  }),
                ],
              ),
              pw.SizedBox(height: 14),

              // Summary Box
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.end,
                children: [
                  pw.Container(
                    width: 220,
                    child: pw.Column(
                      children: [
                        if (discount > 0)
                          pw.Row(
                            mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                            children: [
                              pw.Text('Remise commerciale :', style: const pw.TextStyle(fontSize: 9)),
                              pw.Text('-${_madFmt.format(discount)} MAD', style: const pw.TextStyle(fontSize: 9)),
                            ],
                          ),
                        pw.Divider(thickness: 0.5),
                        pw.Row(
                          mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                          children: [
                            pw.Text('TOTAL NET TTC :', style: pw.TextStyle(fontSize: 12, fontWeight: pw.FontWeight.bold, color: PdfColors.blue900)),
                            pw.Text('${_madFmt.format(totalAmount)} MAD', style: pw.TextStyle(fontSize: 13, fontWeight: pw.FontWeight.bold, color: PdfColors.blue900)),
                          ],
                        ),
                        pw.SizedBox(height: 2),
                        pw.Row(
                          mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                          children: [
                            pw.Text('Montant Réglé :', style: const pw.TextStyle(fontSize: 9)),
                            pw.Text('${_madFmt.format(paidAmount)} MAD', style: const pw.TextStyle(fontSize: 9)),
                          ],
                        ),
                        if (remainingDebt > 0)
                          pw.Row(
                            mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                            children: [
                              pw.Text('Solde Restant Dû :', style: pw.TextStyle(fontSize: 9, fontWeight: pw.FontWeight.bold, color: PdfColors.red700)),
                              pw.Text('${_madFmt.format(remainingDebt)} MAD', style: pw.TextStyle(fontSize: 9, fontWeight: pw.FontWeight.bold, color: PdfColors.red700)),
                            ],
                          ),
                      ],
                    ),
                  ),
                ],
              ),
              pw.Spacer(),

              // Footer
              pw.Divider(thickness: 0.8),
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Text('Garantie légale et constructeur selon conditions applicables.', style: const pw.TextStyle(fontSize: 8, color: PdfColors.grey700)),
                  pw.Text('ELECTROZEN POS System', style: const pw.TextStyle(fontSize: 8, color: PdfColors.grey700)),
                ],
              ),
            ],
          );
        },
      ),
    );

    await Printing.layoutPdf(
      onLayout: (PdfPageFormat format) async => doc.save(),
      name: 'Facture-$invoiceNum.pdf',
    );
  }
}
