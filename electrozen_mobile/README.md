# ELECTROZEN Mobile (Flutter — Android & iOS)

Mobile companion app for **ELECTROZEN** connecting over local Wi-Fi to the Windows Master Application (`http://<WINDOWS_LAN_IP>:4000`).

## Features
1. **Scanner & 4-Tier Price Inspector** ([lib/screens/scanner_screen.dart](lib/screens/scanner_screen.dart)):
   - Scan product barcodes (`EAN-13`, `Code-128`, `QR`) with the phone camera (`mobile_scanner`) or external Bluetooth scanner.
   - Displays **Retail Price (`Prix Détail`)**, **Wholesale Price (`Prix Gros`)**, **Current Buying Cost (`Coût Actuel`)**, and **Last Buying Cost (`Dernier Coût`)** in `MAD`.
   - Includes a one-tap **Customer Privacy Mode (`Mode Client`)** that hides buying costs and margins when showing the screen to a customer.
   - Displays the complete **Historical Buying Prices Timeline (`price_history`)** and available **Serial Numbers / IMEI (`serial_items`)**.
2. **Product Catalog & Stock Manager** ([lib/screens/catalog_form_screen.dart](lib/screens/catalog_form_screen.dart)):
   - Scan an unknown barcode to immediately create a new product.
   - Edit 4-tier prices, stock quantities, warranty duration, and serial numbers from the store aisle.
   - One-tap **AI Product Sheet Generator** (`FR`/`AR` titles & technical specifications).
3. **Mobile POS Checkout** ([lib/screens/mobile_pos_screen.dart](lib/screens/mobile_pos_screen.dart)):
   - Scan items into the mobile cart, switch between **Retail** and **Wholesale** pricing, assign Serial Numbers, select or create a Customer, and complete sales via **Cash**, **Card**, or **Credit / Monthly Installments (`Facilité`)**.
4. **Wi-Fi Sync & QR Pairing** ([lib/screens/pairing_screen.dart](lib/screens/pairing_screen.dart)):
   - Scan the QR code displayed on the ELECTROZEN Windows desktop app or enter the Windows LAN IP (`192.168.100.38:4000`) and pairing token (`ELECTROZEN-POS-2026`).

## Building the Android APK
1. Install the Flutter SDK (`>= 3.3.0`) and Android Studio SDK.
2. From `electrozen_mobile/`, run:
   ```bash
   flutter create . --platforms=android,ios
   flutter pub get
   ```
3. Ensure `<application android:usesCleartextTraffic="true" ...>` and `<uses-permission android:name="android.permission.CAMERA" />` are enabled in `android/app/src/main/AndroidManifest.xml` so the app can scan barcodes and communicate over local LAN HTTP (`http://192.168.x.x:4000`).
4. Build or run on your phone:
   ```bash
   flutter run
   # or build a standalone APK:
   flutter build apk --release
   ```
