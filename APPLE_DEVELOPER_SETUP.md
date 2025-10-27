# 🍎 Fjærn - Apple Developer Setup Guide

Dette er den viktigste delen - her oppretter du appen i Apple's systemer og sender den til App Store.

**Kostnad**: $99/år (USD, ca 1050 NOK)

---

## 📋 Steg 1: Meld deg inn i Apple Developer Program

1. Gå til https://developer.apple.com/programs/enroll/
2. Klikk **"Start Your Enrollment"**
3. Logg inn med din Apple ID (eller opprett en)
4. Velg **"Enroll as an Individual"** (ikke Company)
5. Fyll ut personlig informasjon
6. Betaling: **$99/år** (kredittkort)
7. Aksepter vilkår
8. **Vent på godkjenning** (24-48 timer, vanligvis raskere)

---

## 🔔 Steg 2: Bekreft godkjenning

Du får e-post fra Apple når du er godkjent:
```
Subject: Your enrollment in the Apple Developer Program is complete
```

Når godkjent:
- Logg inn på https://developer.apple.com/
- Du skal nå se "Account" med full tilgang

---

## 📱 Steg 3: Opprett App ID

1. Gå til https://developer.apple.com/account/resources/identifiers/list
2. Klikk **"+"** (øverst til venstre)
3. Velg **"App IDs"** → Continue
4. Velg **"App"** → Continue
5. Fyll ut:
   - **Description**: `Fjærn - Photo Cleanup App`
   - **Bundle ID**: `no.fjaern.app` (VIKTIG: Må matche app.json!)
   - **Explicit** (velg dette, ikke Wildcard)
6. Under **Capabilities**, aktiver:
   - ✅ **In-App Purchase** (viktig!)
   - ✅ **iCloud** (valgfritt, for fremtidig backup)
7. Klikk **"Continue"** → **"Register"**

---

## 🏪 Steg 4: App Store Connect - Opprett app

1. Gå til https://appstoreconnect.apple.com/
2. Klikk **"My Apps"**
3. Klikk **"+"** → **"New App"**
4. Fyll ut:

   **Platforms**: ✅ iOS

   **Name**: `Fjærn`

   **Primary Language**: `Norwegian`

   **Bundle ID**: Velg `no.fjaern.app` (den du nettopp opprettet)

   **SKU**: `fjaern-2024` (unik ID, brukes kun internt)

   **User Access**: `Full Access`

5. Klikk **"Create"**

---

## 💳 Steg 5: Opprett In-App Purchase produkter

### 5.1 Opprett Subscription Group

1. I App Store Connect, gå til din app → **"Subscriptions"**
2. Klikk **"Create"** (under Subscription Groups)
3. Fyll ut:
   - **Reference Name**: `Fjærn Pro Subscriptions`
4. Klikk **"Create"**

### 5.2 Opprett Månedlig abonnement

1. Under subscription group, klikk **"+"**
2. Fyll ut:

   **Reference Name**: `Fjærn Pro Monthly`

   **Product ID**: `no.fjaern.app.monthly` ⚠️ KAN IKKE ENDRES SENERE!

   **Subscription Duration**: `1 month`

3. Under **Subscription Prices**:
   - Klikk **"+"**
   - Velg **Norway (NOK)**
   - Price: **49 kr**
   - Klikk **"Next"** → **"Add"**

4. Under **Localization**:
   - Language: **Norwegian**
   - Display Name: `Pro Månedlig`
   - Description: `Ubegrenset bildesletting og alle Pro-funksjoner`

5. Under **Review Information**:
   - Screenshot: Last opp screenshot av paywall (kan være fra appen)
   - Review Notes: "Subscription gives unlimited photo deletion"

6. Klikk **"Save"**

### 5.3 Opprett Årlig abonnement

1. Klikk **"+"** igjen i subscription group
2. Fyll ut:

   **Reference Name**: `Fjærn Pro Yearly`

   **Product ID**: `no.fjaern.app.yearly` ⚠️ KAN IKKE ENDRES SENERE!

   **Subscription Duration**: `1 year`

3. Under **Subscription Prices**:
   - Norway (NOK): **399 kr**

4. Under **Localization**:
   - Display Name: `Pro Årlig`
   - Description: `Ubegrenset bildesletting - spar 32%`

5. Klikk **"Save"**

### 5.4 Submit for Review

1. Klikk **"Submit"** på begge produktene
2. Apple vil reviewe IAP-produktene (tar 1-2 dager)

---

## 🔗 Steg 6: Koble RevenueCat til App Store Connect

### 6.1 Opprett App Store Connect API Key

1. Gå til https://appstoreconnect.apple.com/access/api
2. Klikk **"+"** (Keys)
3. Fyll ut:
   - **Name**: `RevenueCat`
   - **Access**: **App Manager** (eller Admin)
4. Klikk **"Generate"**
5. **Last ned** API Key filen (.p8)
6. Notér:
   - **Issuer ID** (øverst på siden)
   - **Key ID** (i tabellen)

### 6.2 Last opp til RevenueCat

1. Gå til https://app.revenuecat.com/
2. Velg **Fjærn**-prosjektet
3. Gå til **Project Settings** → **Apple App Store**
4. Klikk **"App Store Connect API"**
5. Last opp:
   - **API Key file** (.p8 filen)
   - **Issuer ID**
   - **Key ID**
   - **Bundle ID**: `no.fjaern.app`
6. Klikk **"Save"**

---

## 📦 Steg 7: Legg til produkter i RevenueCat

1. I RevenueCat, gå til **"Products"**
2. Klikk **"+ Add Product"**

### Månedlig:
- **Store product identifier**: `no.fjaern.app.monthly`
- **Type**: Subscription
- Klikk **"Add"**
- Under **Entitlements**, velg **"pro"**

### Årlig:
- **Store product identifier**: `no.fjaern.app.yearly`
- **Type**: Subscription
- Klikk **"Add"**
- Under **Entitlements**, velg **"pro"**

---

## 📋 Steg 8: Fyll ut app-informasjon

Tilbake i App Store Connect, fyll ut all app-info:

### 8.1 App Information

1. **Category**:
   - Primary: **Utilities**
   - Secondary: **Productivity**

2. **Privacy Policy URL**:
   ```
   https://teamdevopsnorway.github.io/fjaern-app/privacy.html
   ```

3. **Support URL**:
   ```
   https://teamdevopsnorway.github.io/fjaern-app/
   ```

### 8.2 Pricing and Availability

- **Price**: **Free** (appen er gratis med IAP)
- **Availability**: Norway (eller flere land)

### 8.3 App Privacy

Klikk **"Get Started"** og svar:

**Do you or your third-party partners collect data from this app?**
→ **No**

(Dette er sant - appen samler ikke inn data!)

### 8.4 Age Rating

- **Made for Kids**: No
- **Alcohol**: No
- **Gambling**: No
- ...behold alle på "No"
- **Age Rating**: 4+

---

## 🎨 Steg 9: Forbered screenshots og metadata

### Screenshots (obligatorisk)

Du trenger screenshots for:
- **iPhone 6.7"** (Pro Max): 1290 x 2796 px (minimum 3, maks 10)
- **iPhone 6.5"** (tidligere Pro Max): 1242 x 2688 px

**Tips**: Bruk Vibecode-appen til å ta screenshots av:
1. Velkomstskjerm med troll
2. Smart kategorier-oversikt
3. Swipe-interface i aksjon
4. Freemium paywall
5. Suksess-feiring

### App Description (norsk)

```
Fjærn - Den enkleste måten å rydde bildene dine på! 🧹

SMART AI-OPPRYDDING
• Finn automatisk duplikater
• Identifiser alle skjermbilder
• Grupper bildeserier
• Spar plass på sekunder

100% PERSONVERN
• Alt skjer lokalt på din iPhone
• Ingen data sendes til internett
• Ingen sporing eller analyser

MORSOM & ENKEL
• Swipe som Tinder
• Vakker norsk design
• Motiverende feiringer
• Se hvor mye plass du sparer

FREEMIUM
• Gratis: 30 bilder/dag
• Pro: Ubegrenset rydding
• 49 kr/mnd eller 399 kr/år

Laget i Norge 🇳🇴

### Keywords (norsk)

```
foto,bilder,rydde,lagringsplass,duplikater,skjermbilder,organisere,slette,opprydding,album
```

### Promotional Text (valgfritt)

```
🎉 Lansering! Få Pro gratis i 7 dager ved registrering nå!
```

---

## 🏗️ Steg 10: Bygg appen med EAS

### 10.1 Installer EAS CLI

```bash
npm install -g eas-cli
eas login
```

Logg inn med e-post og passord.

### 10.2 Bygg for App Store

```bash
cd /home/user/workspace
eas build --platform ios --profile production
```

Dette tar **15-30 minutter**. EAS bygger appen i skyen.

### 10.3 Submit til App Store

```bash
eas submit --platform ios --latest
```

---

## 📝 Steg 11: Submit for review

1. Gå til App Store Connect
2. Velg build, legg til screenshots
3. Fyll ut app review notes
4. Klikk **"Submit to App Review"** 🎉

---

## ⏰ Timeline

- Day 1-2: "Waiting for Review"
- Day 2-3: "In Review"
- Day 3-4: **Approved!** ✅

---

## 🎉 Gratulerer!

Din app er nå klar for App Store! 🚀

