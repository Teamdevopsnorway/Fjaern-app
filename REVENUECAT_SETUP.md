# 💰 Fjærn - RevenueCat Setup Guide

RevenueCat håndterer abonnementer for Fjærn (49 kr/mnd og 399 kr/år).

**Kostnad**: GRATIS opp til $10,000 MTR (Monthly Tracked Revenue)

---

## 📋 Steg 1: Opprett RevenueCat-konto

1. Gå til https://www.revenuecat.com/
2. Klikk **"Get Started Free"**
3. Registrer med:
   - E-post: `kontakt@fjaern.no` (eller din)
   - Passord: (velg et sterkt passord)
4. Bekreft e-post

---

## 🎯 Steg 2: Opprett nytt prosjekt

1. Etter innlogging, klikk **"Create a project"**
2. Fyll ut:
   - **Project name**: `Fjærn`
   - **App name**: `Fjærn`
3. Klikk **"Create"**

---

## 📱 Steg 3: Legg til iOS-appen

1. I RevenueCat dashboard, klikk **"Add app"**
2. Velg **iOS**
3. Fyll ut:
   - **App name**: `Fjærn`
   - **Bundle ID**: `no.fjaern.app` (VIKTIG: Må matche app.json!)
4. **App Store Connect In-App Purchase Key Configuration**:
   - Velg "I'll do this later" for nå
   - (Vi setter opp dette etter at appen er i App Store Connect)
5. Klikk **"Save"**

---

## 🔑 Steg 4: Få API Keys

1. I RevenueCat dashboard, gå til **Project Settings** (⚙️ ikon)
2. Klikk **"API keys"** i venstre meny
3. Du vil se:
   ```
   Public App-Specific API Keys

   iOS (Fjærn)
   appl_XXXXXXXXXXXXXXXXXXXXXXXX
   ```
4. **KOPIER** denne iOS API-nøkkelen

---

## 💻 Steg 5: Legg til API Key i appen

Åpne filen `/home/user/workspace/src/utils/revenueCat.ts` og erstatt:

```typescript
// FØR (linje 20-23):
const REVENUECAT_API_KEY = {
  ios: "appl_XXXXXXXXXXXXXXXXXXXXXXXX",
  android: "goog_XXXXXXXXXXXXXXXXXXXXXXXX",
};

// ETTER:
const REVENUECAT_API_KEY = {
  ios: "appl_DIN_FAKTISKE_KEY_HER", // ← Lim inn din key her
  android: "goog_XXXXXXXXXXXXXXXXXXXXXXXX", // La stå hvis du ikke har Android
};
```

---

## 📦 Steg 6: Opprett Entitlement

1. I RevenueCat dashboard, gå til **"Entitlements"**
2. Klikk **"+ New"**
3. Fyll ut:
   - **Identifier**: `pro`
   - **Display name**: `Fjærn Pro`
4. Klikk **"Add"**

---

## 🛒 Steg 7: Opprett Produkter (kommer senere)

⚠️ **VIKTIG**: Du kan IKKE legge til produkter i RevenueCat før de er opprettet i App Store Connect først!

**Workflow**:
1. Først → Opprett produkter i **App Store Connect** (Steg 4)
2. Deretter → Koble dem til RevenueCat

Vi gjør dette i neste steg!

---

## ✅ Steg 8: Verifiser at alt er satt opp

Sjekk at du har:
- ✅ RevenueCat-konto opprettet
- ✅ Prosjekt "Fjærn" opprettet
- ✅ iOS app lagt til med Bundle ID: `no.fjaern.app`
- ✅ API key kopiert og limt inn i `src/utils/revenueCat.ts`
- ✅ Entitlement "pro" opprettet

---

## 🔄 Fullstendig workflow (Oversikt)

Slik ser hele flyten ut:

```
1. Apple Developer Account → Opprett App ID
                ↓
2. App Store Connect → Opprett app + IAP-produkter
                ↓
3. RevenueCat → Koble til App Store Connect
                ↓
4. RevenueCat → Legg til produkter
                ↓
5. Appen → Test kjøp
```

---

## 📦 Produkter som skal opprettes (i App Store Connect)

Når du kommer til App Store Connect, opprett disse:

### Månedlig abonnement
- **Product ID**: `no.fjaern.app.monthly`
- **Reference name**: `Fjærn Pro Monthly`
- **Type**: Auto-Renewable Subscription
- **Duration**: 1 Month
- **Price**: 49 NOK

### Årlig abonnement
- **Product ID**: `no.fjaern.app.yearly`
- **Reference name**: `Fjærn Pro Yearly`
- **Type**: Auto-Renewable Subscription
- **Duration**: 1 Year
- **Price**: 399 NOK

---

## 🧪 Testing (kommer senere)

Når alt er satt opp:

1. **Sandbox testing** (gratis test-abonnementer):
   - Opprett sandbox tester i App Store Connect
   - Test kjøp i appen
   - Verifiser at RevenueCat registrerer transaksjonen

2. **TestFlight** (beta-testing):
   - Last opp build til TestFlight
   - Inviter beta-testere
   - La dem teste abonnementer

---

## 💡 Tips

**Viktige RevenueCat-features**:
- **Charts**: Se inntekter, MRR (Monthly Recurring Revenue), churn
- **Customers**: Se alle brukere og deres abonnementsstatus
- **Webhooks**: Få notifikasjoner om nye/kansellerte abonnementer
- **Experiments**: A/B-test priser og pakker

**Prising**:
- Gratis: $0-10k MTR per måned
- Growth: $0.50 per $1k MTR over $10k
- Eksempel: Med 1000 betalende brukere à 49 kr/mnd = 49k kr = ~$4.5k = GRATIS

---

## 🔗 Nyttige lenker

- RevenueCat Dashboard: https://app.revenuecat.com/
- RevenueCat Docs: https://www.revenuecat.com/docs
- iOS IAP Testing Guide: https://www.revenuecat.com/docs/apple-app-store/sandbox-testing

---

## 🎉 Neste steg

✅ **RevenueCat er satt opp!**

Neste:
- **Apple Developer Account** (kommer i neste guide)
- Opprett IAP-produkter i App Store Connect
- Koble produkter til RevenueCat
- Test abonnementer

---

## ❓ Vanlige spørsmål

**Q: Trenger jeg kredittkort for RevenueCat?**
A: Nei! Gratis opp til $10k MTR.

**Q: Hva skjer hvis jeg går over $10k MTR?**
A: Du betaler kun for det du går over. Eksempel: $11k MTR = $0.50 gebyr.

**Q: Kan jeg bytte fra RevenueCat senere?**
A: Ja, men det er komplisert. RevenueCat er bransjestandarder og anbefalt.

**Q: Støtter RevenueCat Android?**
A: Ja! Samme kodebase fungerer for iOS og Android.

**Q: Må jeg håndtere abonnementsfornyelse manuelt?**
A: Nei! Apple og RevenueCat håndterer alt automatisk.

---

Klar for neste steg? 🚀
