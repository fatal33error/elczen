import 'dart:convert';
import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../widgets/barcode_scanner_modal.dart';

class PairingScreen extends StatefulWidget {
  final ElectroZenApiService api;
  final VoidCallback onConfigChanged;

  const PairingScreen({
    super.key,
    required this.api,
    required this.onConfigChanged,
  });

  @override
  State<PairingScreen> createState() => _PairingScreenState();
}

class _PairingScreenState extends State<PairingScreen> {
  late final TextEditingController _hostCtrl;
  late final TextEditingController _portCtrl;
  late final TextEditingController _tokenCtrl;
  late final TextEditingController _deviceCtrl;

  bool _testing = false;
  bool _scanningWifi = false;
  String? _statusMessage;
  bool _statusSuccess = false;

  @override
  void initState() {
    super.initState();
    _hostCtrl = TextEditingController(text: widget.api.host);
    _portCtrl = TextEditingController(text: widget.api.port.toString());
    _tokenCtrl = TextEditingController(text: widget.api.pairingToken);
    _deviceCtrl = TextEditingController(text: widget.api.deviceName);
  }

  Future<void> _autoDiscoverServer() async {
    setState(() {
      _scanningWifi = true;
      _statusMessage = 'Recherche du serveur ELECTROZEN sur le Wi-Fi...';
      _statusSuccess = true;
    });
    final foundIp = await widget.api.discoverLanServer();
    if (!mounted) return;
    if (foundIp != null) {
      setState(() {
        _scanningWifi = false;
        _hostCtrl.text = foundIp;
      });
      await _saveAndPair();
    } else {
      setState(() {
        _scanningWifi = false;
        _statusSuccess = false;
        _statusMessage =
            'Aucun serveur trouvé sur le Wi-Fi. Vérifiez que ELECTROZEN Windows est ouvert et sur le même réseau Wi-Fi.';
      });
    }
  }

  Future<void> _saveAndPair() async {
    setState(() {
      _testing = true;
      _statusMessage = null;
    });

    await widget.api.saveConfig(
      newHost: _hostCtrl.text,
      newPort: int.tryParse(_portCtrl.text) ?? 4000,
      newToken: _tokenCtrl.text,
      newDeviceName: _deviceCtrl.text,
    );
    widget.onConfigChanged();

    try {
      final res = await widget.api.pairDevice();
      final prods = await widget.api.fetchProducts();
      if (!mounted) return;
      setState(() {
        _testing = false;
        _statusSuccess = true;
        _statusMessage =
            'Connecté à ${res["storeName"] ?? "ELECTROZEN"} (${widget.api.baseUrl}) • ${prods.length} articles synchronisés (${res["latencyMs"]} ms)';
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _testing = false;
        _statusSuccess = false;
        _statusMessage = 'Échec de connexion (${widget.api.baseUrl}): $e';
      });
    }
  }

  void _handleQrPayload(String raw) {
    try {
      final dynamic decoded = jsonDecode(raw);
      if (decoded is Map && decoded['host'] != null) {
        setState(() {
          _hostCtrl.text = decoded['host'].toString();
          _portCtrl.text = (decoded['port'] ?? 4000).toString();
          _tokenCtrl.text = (decoded['token'] ?? 'ELECTROZEN-POS-2026').toString();
        });
        _saveAndPair();
        return;
      }
    } catch (_) {}
    final uri = Uri.tryParse(raw.trim());
    if (uri != null && uri.host.isNotEmpty) {
      setState(() {
        _hostCtrl.text = uri.host;
        if (uri.port > 0) _portCtrl.text = uri.port.toString();
      });
      _saveAndPair();
      return;
    }
    if (mounted) {
      setState(() {
        _statusSuccess = false;
        _statusMessage = 'QR code non reconnu pour ELECTROZEN.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(14),
      children: [
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
              const Text(
                'CONNEXION WI-FI LOCAL AU SERVEUR WINDOWS ELECTROZEN',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF71717A)),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    flex: 3,
                    child: TextField(
                      controller: _hostCtrl,
                      style: const TextStyle(fontFamily: 'monospace'),
                      decoration: const InputDecoration(
                        labelText: 'Adresse IP LAN Windows',
                        isDense: true,
                        border: OutlineInputBorder(),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    flex: 1,
                    child: TextField(
                      controller: _portCtrl,
                      keyboardType: TextInputType.number,
                      style: const TextStyle(fontFamily: 'monospace'),
                      decoration: const InputDecoration(
                        labelText: 'Port',
                        isDense: true,
                        border: OutlineInputBorder(),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              TextField(
                controller: _tokenCtrl,
                style: const TextStyle(fontFamily: 'monospace'),
                decoration: const InputDecoration(
                  labelText: 'Clé d\'appairage (Pairing Token)',
                  isDense: true,
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: _deviceCtrl,
                decoration: const InputDecoration(
                  labelText: 'Nom du Terminal Mobile',
                  isDense: true,
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 14),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF203361),
                  foregroundColor: Colors.white,
                  minimumSize: const Size.fromHeight(44),
                ),
                onPressed: (_testing || _scanningWifi) ? null : _saveAndPair,
                icon: const Icon(Icons.sync, size: 18),
                label: Text(_testing ? 'Connexion & Synchronisation...' : 'Connecter & Appairer'),
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () async {
                        final raw = await BarcodeScannerModal.scan(context, title: 'Scanner QR Appairage Windows');
                        if (raw != null && raw.isNotEmpty) {
                          _handleQrPayload(raw);
                        }
                      },
                      icon: const Icon(Icons.qr_code_2, size: 17),
                      label: const Text('Scanner QR', overflow: TextOverflow.ellipsis),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: (_testing || _scanningWifi) ? null : _autoDiscoverServer,
                      icon: const Icon(Icons.wifi_find, size: 17),
                      label: Text(_scanningWifi ? 'Recherche...' : 'Auto-Wi-Fi', overflow: TextOverflow.ellipsis),
                    ),
                  ),
                ],
              ),
              if (_statusMessage != null) ...[
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: _statusSuccess ? const Color(0xFFECFDF5) : const Color(0xFFFEF2F2),
                    border: Border.all(
                      color: _statusSuccess ? const Color(0xFFA7F3D0) : const Color(0xFFFECACA),
                    ),
                    borderRadius: BorderRadius.circular(5),
                  ),
                  child: Text(
                    _statusMessage!,
                    style: TextStyle(
                      fontFamily: 'monospace',
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: _statusSuccess ? const Color(0xFF065F46) : const Color(0xFF991B1B),
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ],
    );
  }
}
