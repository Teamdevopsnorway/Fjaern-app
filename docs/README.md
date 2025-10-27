# Fjærn - Juridiske dokumenter

Denne mappen inneholder alle juridiske dokumenter for Fjærn-appen, klar for hosting på GitHub Pages.

## 📁 Innhold

- **index.html** - Landingsside for Fjærn
- **privacy.html** - Personvernerklæring (Privacy Policy)
- **terms.html** - Vilkår for bruk (Terms of Service)
- **PRIVACY_POLICY.md** - Personvernerklæring i Markdown-format
- **TERMS_OF_SERVICE.md** - Vilkår for bruk i Markdown-format

## 🌐 Hosting på GitHub Pages

### Trinn 1: Opprett GitHub Repository

1. Gå til [github.com](https://github.com) og logg inn
2. Klikk "New repository" (grønn knapp)
3. Navn: `fjaern-legal` eller `fjaern-app`
4. Velg "Public"
5. Klikk "Create repository"

### Trinn 2: Last opp filer

```bash
# I prosjektmappen din
git init
git add docs/
git commit -m "Add legal documents"
git branch -M main
git remote add origin https://github.com/DITT-BRUKERNAVN/fjaern-legal.git
git push -u origin main
```

### Trinn 3: Aktiver GitHub Pages

1. Gå til repository settings
2. Scroll ned til "Pages" (venstre meny)
3. Under "Source", velg "Deploy from a branch"
4. Velg branch: **main**
5. Velg folder: **/docs**
6. Klikk "Save"

### Trinn 4: Få URL

GitHub genererer en URL på formatet:
```
https://DITT-BRUKERNAVN.github.io/fjaern-legal/
```

Dine sider vil være tilgjengelige på:
- Landingsside: `https://DITT-BRUKERNAVN.github.io/fjaern-legal/`
- Privacy: `https://DITT-BRUKERNAVN.github.io/fjaern-legal/privacy.html`
- Terms: `https://DITT-BRUKERNAVN.github.io/fjaern-legal/terms.html`

## 📝 Oppdatering nødvendig

**VIKTIG**: Før du publiserer, oppdater følgende:

### I ALLE HTML-filer:
- `kontakt@fjaern.no` → Din faktiske e-post

### I app.json:
Legg til denne URLen i App Store Connect når du søker om godkjenning.

## 🎨 Tilpasning

Alle HTML-filer bruker inline CSS og er:
- ✅ Responsiv (fungerer på mobil og desktop)
- ✅ Profesjonell design
- ✅ Norske farger (rød, blå, hvit)
- ✅ Klar til App Store-godkjenning

## 🔗 Bruk i App Store Connect

Når du fyller ut app-informasjon i App Store Connect:
1. Privacy Policy URL: `https://DITT-BRUKERNAVN.github.io/fjaern-legal/privacy.html`
2. Terms URL (valgfritt): `https://DITT-BRUKERNAVN.github.io/fjaern-legal/terms.html`
3. Support URL: `https://DITT-BRUKERNAVN.github.io/fjaern-legal/` eller din e-post

## ✅ Apple-godkjenning

Disse dokumentene oppfyller Apples krav for:
- ✓ Personvernpolicy (obligatorisk)
- ✓ GDPR-samsvar
- ✓ Tydelig kommunikasjon om databruk
- ✓ Abonnementsvilkår
- ✓ Kontaktinformasjon

## 🆓 Gratis hosting

GitHub Pages er:
- ✅ 100% gratis
- ✅ Ingen reklame
- ✅ God oppetid (99.9%+)
- ✅ SSL/HTTPS inkludert
- ✅ Ingen begrensninger for små sider som dette

## 📧 Kontakt

For spørsmål om disse dokumentene, kontakt kontakt@fjaern.no
