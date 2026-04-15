# TWA / Google Play — Instrukcja

Aplikacja Loszki jako TWA (Trusted Web Activity) w Google Play.

## KROK 1 — Poczekaj na działający deploy na Vercel

Zanim ruszysz dalej, upewnij się że nowa wersja (z Auth) działa na https://loszkiapp.vercel.app i możesz się zalogować mailowo.

## KROK 2 — Wygeneruj APK przez PWA Builder

**Najprostsza droga (bez instalacji narzędzi):**

1. Wejdź na https://www.pwabuilder.com
2. Wpisz: `https://loszkiapp.vercel.app`
3. Kliknij **"Start"** — przejdzie audit PWA (manifest, service worker, HTTPS)
4. Kliknij **"Package For Stores"** → **"Android"**
5. Ustaw:
   - Package ID: `app.loszki.twa`
   - App name: `Loszki`
   - Launcher name: `Loszki`
   - Monochrome icon: upload `icon-192x192.png` (wersja monochrom)
   - Status bar color: `#18181b`
6. **Generate** → pobierasz ZIP

W ZIPie znajdziesz:
- `app-release-signed.aab` — do Google Play
- `app-release-signed.apk` — do bezpośredniej instalacji (sideload dla testerów)
- `signing-key-info.txt` — ZACHOWAJ, zawiera hasła do keystore
- `assetlinks.json` — TO MA SHA256 fingerprint

## KROK 3 — Podmień assetlinks.json

1. Otwórz `assetlinks.json` z ZIPa
2. Skopiuj całą zawartość
3. Wklej do `public/.well-known/assetlinks.json` w projekcie (zamieniając placeholder)
4. `bash deploy.sh "twa: assetlinks z prawdziwym fingerprintem"`
5. Po deploy sprawdź: https://loszkiapp.vercel.app/.well-known/assetlinks.json

## KROK 4 — Test APK na telefonie (testerzy)

Dla 3 testerów:
1. Wyślij im `app-release-signed.apk` (np. przez Google Drive)
2. Na Androidzie muszą włączyć "Instalacja z nieznanych źródeł" dla przeglądarki/Drive
3. Otwierają APK → Install
4. Uruchamiają Loszki → widzą ekran logowania

## KROK 5 — Google Play Store (opcjonalnie, ~$25 + 1-7 dni review)

1. Google Play Console: https://play.google.com/console (jednorazowa opłata $25)
2. Create app → wybierz typ "App"
3. Wypełnij wymagane:
   - Privacy policy URL (TRZEBA ZROBIĆ — wymagane)
   - Screenshots (min 2, format 16:9 lub 9:16)
   - Ikona 512x512
   - Krótki opis (80 znaków)
   - Pełny opis
   - Kategoria: Productivity lub Lifestyle
4. Upload `app-release-signed.aab`
5. Closed Testing → dodaj emaile testerów (zamiast production release na starcie)
6. Submit for review (1-7 dni)

## CZEGO NIE ZAPOMNIEĆ

- Privacy policy — wymagane przez Google. Mogę wygenerować template.
- Play Store dostęp do push: w `strings.xml` (PWA Builder generuje) jest `web_manifest_url` — musi być `https://loszkiapp.vercel.app/manifest.json`
- Testerzy MUSZĄ zaakceptować invite link PRZED pierwszym logowaniem w APK (inaczej dostaną własny pusty household)
