# ELECTROZEN — Guide d'Utilisation & Mise en Production (Windows + Android)

## 1. Installation sur PC Windows (Poste Caisse Principal)
1. Exécutez l'installateur **`ELECTROZEN-Setup-1.0.0.exe`** (situé dans `D:\electrozen_dist\`) — aucune installation préalable de Node.js n'est requise.
2. Lancez **ELECTROZEN** depuis le Bureau ou le Menu Démarrer.
3. **Données & Sauvegardes Automatiques :**
   - En mode installé, votre base SQLite se trouve dans `%APPDATA%\ELECTROZEN\data\electromanager.sqlite` (accessible via **Fichier → Ouvrir le dossier Base de Données**).
   - Une sauvegarde quotidienne automatique (`VACUUM INTO`) est enregistrée dans `%APPDATA%\ELECTROZEN\data\backups\` (les 30 derniers jours sont conservés).

---

## 2. Mise en Production (Supprimer les Données de Démonstration)
Avant d'utiliser le logiciel avec vos vraies ventes :
1. Ouvrez l'onglet **Sync Android & Woo** → section **Sauvegardes Automatiques SQLite, Import Catalogue CSV & Journal d'Audit**.
2. Cliquez sur **Vider Données Démo (Mise en Production)**, renseignez le **Nom de votre enseigne**, votre **ICE**, **IF**, **RC**, et définissez un **nouveau Code PIN Admin**.
3. Cliquez sur **Importer Catalogue CSV** pour importer votre vrai catalogue (colonnes supportées : `Code_Barres`, `SKU`, `Modele`, `Marque`, `Categorie`, `Designation_FR`, `Cout_Actuel_MAD`, `Prix_Gros_MAD`, `Prix_Detail_MAD`, `Stock`, `Garantie_Mois`).

---

## 3. Rôles & Codes PIN par Défaut
Cliquez sur le badge opérateur en haut à droite (`ADMIN` / `CAISSIER`) pour changer d'utilisateur :
- **Admin (`admin`)** : PIN par défaut **`1234`** *(accès complet : coûts d'achat, marges, annulations / avoirs, paramètres)*.
- **Caissier (`caissier`)** : PIN par défaut **`0000`** *(masque les coûts d'achat et bénéfices, bloque les suppressions et annulations)*.

---

## 4. Opérations Quotidiennes (Caisse, POS & Factures Maroc)
- **Ouverture / Clôture de Caisse :** Sur le **Tableau de Bord**, cliquez sur **Ouvrir la Caisse** le matin avec votre fond de caisse, et **Clôturer Caisse (Rapport Z)** le soir pour vérifier l'écart de caisse.
- **Raccourcis Clavier POS :**
  - `F2` : Scanner rapide / Historique des prix d'achat & Numéros de série
  - `F9` : Valider la vente et ouvrir la Facture / Garantie (A4 avec HT / TVA 20% / TTC, montant en lettres, ICE/IF/RC, ou Ticket thermique 80mm)
  - `Échap` : Fermer la fenêtre active
- **Avoir / Annulation :** L'annulation d'une facture émet automatiquement un numéro séquentiel **AV-YYYY-XXXXXX**, restaure le stock, les numéros de série et la dette client.

---

## 5. Connexion de l'Application Android (`ELECTROZEN-Android.apk`)
1. Assurez-vous que le téléphone et le PC Windows sont sur le **même réseau Wi-Fi** (et que le profil Wi-Fi Windows est en mode **Privé**).
2. Depuis le téléphone, téléchargez et installez : `http://<IP-DU-PC>:4000/download/ELECTROZEN-Android.apk` (ou installez [ELECTROZEN-Android.apk](file:///c:/Users/zlmat/Documents/antigravity/beautiful-hawking/ELECTROZEN-Android.apk) via câble USB).
3. Ouvrez **ELECTROZEN** sur le téléphone → onglet **Wi-Fi Sync** → cliquez sur **Scanner QR Windows** (affichez l'onglet **Sync Android & Woo** sur le PC) ou saisissez l'IP locale du PC et la clé d'appairage (`ELECTROZEN-POS-2026`).
4. Par défaut, le scanner mobile masque les coûts d'achat (**Mode Client**) pour que vous puissiez montrer le prix au client sans dévoiler votre marge. Appuyez sur le bouton pour révéler les coûts et l'historique fournisseur.

---

## دليل الاستخدام السريع (بالعربية)
1. **تشغيل برنامج الويندوز:** شغّل ملف التثبيت `ELECTROZEN-Setup-1.0.0.exe`. يتم حفظ قاعدة البيانات والنسخ الاحتياطية تلقائياً كل يوم.
2. **الحسابات والصلاحيات (PIN):**
   - حساب المدير (Admin): الرمز الافتراضي **`1234`** (يرى تكلفة الشراء والأرباح ويدير الإعدادات).
   - حساب البائع / أمين الصندوق (Caissier): الرمز **`0000`** (يُخفي ثمن الشراء والربح ويمنع الحذف).
3. **فتح وإغلاق الصندوق:** من لوحة القيادة افتح الصندوق عند بداية اليوم وأغلقه عند النهاية لمطابقة النقدية (Rapport Z).
4. **ربط تطبيق الأندرويد عبر الواي فاي:** ثبّت ملف `ELECTROZEN-Android.apk` على الهاتف المتصل بنفس شبكة الواي فاي، ثم امسح رمز QR من تبويب الربط في الويندوز للبدء في مسح الباركود، معرفة ثمن البيع والتقسيط وآخر أثمنة الشراء، وإجراء المبيعات مباشرة.
