# 🚀 Fjærn - Komplett lanseringsguide

## ✅ Hva som er FERDIG:

- ✅ **App er MVP-klar**
- ✅ **E-post oppdatert** til `kontakt@fjaern.no`
- ✅ **App-ikoner generert** (icon.png, splash.png, adaptive-icon.png)
- ✅ **app.json konfigurert** med Bundle ID `no.fjaern.app`
- ✅ **Juridiske dokumenter** (Privacy Policy + Terms of Service)
- ✅ **Landingsside** (index.html)
- ✅ **RevenueCat kode** implementert (venter på API keys)

---

## 📋 NESTE STEG - Fullstendig roadmap:

### **STEG 1: GitHub Pages (5 minutter)** 📄
**Status**: Venter på deg
**Guide**: `GITHUB_SETUP.md`

**Quick steps**:
1. Opprett repo på https://github.com/teamdevopsnorway
2. Push docs-mappen
3. Aktiver GitHub Pages
4. Få URL: `https://teamdevopsnorway.github.io/fjaern-app/`

**Resultat**: Juridiske docs hostet og klar for App Store

---

### **STEG 2: RevenueCat (10 minutter)** 💰
**Status**: Venter på deg
**Guide**: `REVENUECAT_SETUP.md`

**Quick steps**:
1. Opprett konto på https://www.revenuecat.com/
2. Lag prosjekt "Fjærn"
3. Legg til iOS app med Bundle ID: `no.fjaern.app`
4. Kopier iOS API key
5. Lim inn i `/src/utils/revenueCat.ts` (linje 21)
6. Opprett entitlement "pro"

**Resultat**: Abonnementsystem klar (produkter legges til senere)

---

### **STEG 3: Apple Developer Account (1-2 dager)** 🍎
**Status**: Venter på deg
**Guide**: `APPLE_DEVELOPER_SETUP.md`
**Kostnad**: $99/år

**Quick steps**:
1. Meld deg inn på https://developer.apple.com/programs/enroll/
2. Betal $99
3. Vent på godkjenning (24-48 timer)

**Resultat**: Tilgang til Apple Developer Portal og App Store Connect

---

### **STEG 4: Opprett app i App Store Connect (30 minutter)** 📱
**Status**: Venter på Apple-godkjenning
**Guide**: `APPLE_DEVELOPER_SETUP.md` (Steg 3-5)

**Quick steps**:
1. Opprett App ID (`no.fjaern.app`)
2. Opprett app i App Store Connect
3. Opprett IAP-produkter:
   - Månedlig: `no.fjaern.app.monthly` (49 kr)
   - Årlig: `no.fjaern.app.yearly` (399 kr)
4. Submit IAP for review (1-2 dager)

**Resultat**: App og abonnementer opprettet i Apple's systemer

---

### **STEG 5: Koble RevenueCat til Apple (15 minutter)** 🔗
**Status**: Venter på STEG 4
**Guide**: `REVENUECAT_SETUP.md` + `APPLE_DEVELOPER_SETUP.md` (Steg 6-7)

**Quick steps**:
1. Opprett App Store Connect API key
2. Last opp til RevenueCat
3. Legg til produkter i RevenueCat
4. Koble til "pro" entitlement

**Resultat**: RevenueCat kan nå håndtere dine abonnementer

---

### **STEG 6: Forbered metadata (1 time)** 📸
**Status**: Kan gjøres når som helst
**Guide**: `APPLE_DEVELOPER_SETUP.md` (Steg 9)

**Quick steps**:
1. Ta screenshots av appen (minimum 3)
   - Bruk Vibecode-appen til å ta screenshots
2. Fyll ut app description (allerede skrevet i guiden!)
3. Velg keywords
4. Lag promotional text

**Resultat**: All metadata klar for submission

---

### **STEG 7: Bygg appen (30 minutter)** 🏗️
**Status**: Venter på RevenueCat API key
**Guide**: `APPLE_DEVELOPER_SETUP.md` (Steg 10)

**Quick steps**:
```bash
npm install -g eas-cli
eas login
eas build --platform ios
```

**Resultat**: `.ipa` fil klar for App Store

---

### **STEG 8: Submit til App Store (15 minutter)** 📤
**Status**: Venter på STEG 7
**Guide**: `APPLE_DEVELOPER_SETUP.md` (Steg 10-11)

**Quick steps**:
```bash
eas submit --platform ios --latest
```

Eller bruk Transporter app manuelt.

**Resultat**: Build uploaded til App Store Connect

---

### **STEG 9: Fullfør submission (30 minutter)** 📝
**Status**: Venter på STEG 8
**Guide**: `APPLE_DEVELOPER_SETUP.md` (Steg 11)

**Quick steps**:
1. Velg build i App Store Connect
2. Last opp screenshots
3. Fyll ut description
4. Legg til app review notes
5. Klikk "Submit to App Review"

**Resultat**: Appen er sendt til Apple for review

---

### **STEG 10: Vent på godkjenning (2-4 dager)** ⏰
**Status**: Venter på Apple

**Timeline**:
- Day 1-2: "Waiting for Review"
- Day 2-3: "In Review"
- Day 3-4: Approved ✅ eller Rejected ❌

**Hvis approved**: Appen går live!
**Hvis rejected**: Fix problemet og submit på nytt

---

### **STEG 11: LANSERING! 🎉**
**Status**: Venter på STEG 10

Klikk "Release this version" i App Store Connect.

**Appen er nå LIVE i App Store!** 🚀

---

## 📊 TIDSESTIMATE

| Aktivitet | Tid | Avhengighet |
|-----------|-----|-------------|
| GitHub Pages | 5 min | - |
| RevenueCat signup | 10 min | - |
| Apple Developer signup | 5 min | Kredittkort |
| → Venter på godkjenning | 1-2 dager | Apple |
| App Store Connect setup | 30 min | Apple-godkjenning |
| IAP-produkter | 15 min | App Store Connect |
| → Venter på IAP review | 1-2 dager | Apple |
| Koble RevenueCat | 15 min | IAP godkjent |
| Screenshots | 1 time | - |
| EAS build | 30 min | RevenueCat key |
| Submit | 15 min | Build ferdig |
| → Venter på app review | 2-4 dager | Apple |
| **TOTALT** | **~5-7 dager** | |

**Aktiv arbeidstid**: 3-4 timer
**Venting på Apple**: 3-6 dager

---

## 💰 TOTALE KOSTNADER

| Post | Pris | Nødvendig? |
|------|------|------------|
| Apple Developer | $99/år (~1050 NOK) | ✅ Obligatorisk |
| RevenueCat | Gratis | ✅ Ja |
| GitHub Pages | Gratis | ✅ Ja |
| App-ikon (valgfritt) | $20-100 | ⚠️ Anbefalt senere |
| **TOTALT** | **~1050 NOK** | |

---

## 🎯 START HER

**Din umiddelbare action list**:

1. ⏸️ **GitHub Pages** → Åpne `GITHUB_SETUP.md` og følg stegene
2. ⏸️ **RevenueCat** → Åpne `REVENUECAT_SETUP.md` når GitHub er ferdig
3. ⏸️ **Apple Developer** → Meld deg inn (kan gjøres parallelt)

**Start med disse 3, så veileder jeg deg videre!** 🚀

---

## 📂 FILER DU HAR

- `GITHUB_SETUP.md` - Komplett GitHub Pages guide
- `REVENUECAT_SETUP.md` - Komplett RevenueCat guide
- `APPLE_DEVELOPER_SETUP.md` - Komplett Apple Developer guide
- `docs/` - Alle juridiske dokumenter (privacy, terms, landing page)
- `assets/` - App-ikoner (icon.png, splash.png, adaptive-icon.png)
- `app.json` - Konfigurert med Bundle ID og iOS permissions
- `src/utils/revenueCat.ts` - RevenueCat kode (venter på API key)

---

## ❓ SPØRSMÅL?

Jeg er her for å hjelpe! Start med STEG 1 (GitHub Pages) og gi meg beskjed når du er klar for neste steg. 💪

---

**Lykke til med lanseringen av Fjærn! 🧹🇳🇴**
