@echo off
echo Configuration du reseau Wi-Fi en mode Prive (Domicile/Magasin) et ouverture du port 4000...
powershell -NoProfile -Command "Set-NetConnectionProfile -InterfaceAlias 'Wi-Fi' -NetworkCategory Private -ErrorAction SilentlyContinue"
netsh advfirewall firewall add rule name="ELECTROZEN Wi-Fi Server (TCP 4000)" dir=in action=allow protocol=TCP localport=4000 profile=any
netsh advfirewall firewall add rule name="ELECTROZEN Node.js Server" dir=in action=allow program="C:\Program Files\nodejs\node.exe" profile=any
echo.
echo Termine ! Si vous utilisez Avast Antivirus :
echo Ouvrez Avast -> Protection -> Pare-feu (Firewall) et passez le reseau "ELECTROZEN 5G" en mode "Prive / Reseau de confiance" (Trusted).
echo Ensuite ouvrez sur votre telephone : http://192.168.100.38:4000/mobile
pause
