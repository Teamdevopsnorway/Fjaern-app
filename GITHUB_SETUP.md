# 🚀 Fjærn - GitHub Pages Setup Guide

## ✅ Status: Filer er klare!

Alle juridiske dokumenter er nå klare med din e-post: **kontakt@fjaern.no**

---

## 📋 Steg 1: Opprett nytt GitHub Repository

1. Gå til https://github.com/teamdevopsnorway
2. Klikk på **"New"** (grønn knapp øverst til høyre)
3. Fyll ut:
   - **Repository name**: `fjaern-app`
   - **Description**: "Legal documents and landing page for Fjærn app"
   - **Visibility**: **Public** (må være public for gratis GitHub Pages)
   - **DO NOT** initialize with README, .gitignore eller license
4. Klikk **"Create repository"**

---

## 📤 Steg 2: Push filene til GitHub

Kjør disse kommandoene i terminalen:

```bash
cd /home/user/workspace

# Legg til GitHub remote
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/teamdevopsnorway/fjaern-app.git

# Push docs til GitHub
git push -u origin main
```

**Viktig**: Du vil bli bedt om GitHub credentials:
- Username: `teamdevopsnorway`
- Password: Bruk en **Personal Access Token** (ikke passord)

### Hvordan lage Personal Access Token:
1. Gå til https://github.com/settings/tokens
2. Klikk "Generate new token" → "Generate new token (classic)"
3. Note: "Fjærn app upload"
4. Expiration: 90 days
5. Scopes: ✅ **repo** (velg hele repo-seksjonen)
6. Klikk "Generate token"
7. **KOPIER TOKEN** (du ser den bare én gang!)

---

## 🌐 Steg 3: Aktiver GitHub Pages

1. Gå til https://github.com/teamdevopsnorway/fjaern-app
2. Klikk **"Settings"** (øverst)
3. Klikk **"Pages"** (venstre meny)
4. Under **"Build and deployment"**:
   - **Source**: Deploy from a branch
   - **Branch**: `main`
   - **Folder**: `/docs`
5. Klikk **"Save"**

---

## ⏰ Steg 4: Vent (1-2 minutter)

GitHub bygger nå nettsiden din. Du vil se:
```
Your site is live at https://teamdevopsnorway.github.io/fjaern-app/
```

---

## 🔗 Dine URL-er

Når GitHub Pages er aktivert, vil du ha:

**Landingsside**:
```
https://teamdevopsnorway.github.io/fjaern-app/
```

**Privacy Policy** (for App Store Connect):
```
https://teamdevopsnorway.github.io/fjaern-app/privacy.html
```

**Terms of Service**:
```
https://teamdevopsnorway.github.io/fjaern-app/terms.html
```

---

## ✅ Verifisering

Når GitHub Pages er aktivert:

1. Åpne: https://teamdevopsnorway.github.io/fjaern-app/
2. Sjekk at landingssiden vises korrekt
3. Klikk på "Personvernerklæring" - skal åpne privacy.html
4. Sjekk at e-posten vises som `kontakt@fjaern.no`

---

## 📱 Bruk i App Store Connect

Når du setter opp appen i App Store Connect, bruk:

**Privacy Policy URL**:
```
https://teamdevopsnorway.github.io/fjaern-app/privacy.html
```

**Support URL**:
```
https://teamdevopsnorway.github.io/fjaern-app/
```

---

## 🔧 Feilsøking

### Problem: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/teamdevopsnorway/fjaern-app.git
```

### Problem: "Authentication failed"
Du bruker gammelt passord. Lag Personal Access Token (se over).

### Problem: "403 error"
Repository er private. Endre til Public i Settings → Danger Zone → Change visibility.

### Problem: "404 on GitHub Pages"
Vent 2-5 minutter. Refresh siden. Sjekk at du valgte `/docs` folder.

---

## 🎉 Neste steg

Når GitHub Pages er live:
✅ **Steg 2 ferdig!**

Neste:
- **Steg 3**: RevenueCat setup
- **Steg 4**: Apple Developer Account

Trenger du hjelp med noen av disse? 🚀
