# Scrutineering Assistant V0.1

A mobile-first, source-backed question interface for common Motorsport UK scrutineering checks.

## Run locally

```bash
npm run dev
```

Then open [http://localhost:4173](http://localhost:4173). The development server
binds to all interfaces, so hosted workspaces can expose port `4173` as a preview.

## Create a manual-deployment ZIP

```bash
npm run package:zip
```

This creates `Scrutineering-Assistant-V0.1.zip` with the contents of `dist/`
directly at the archive root, including `index.html` at the ZIP root.

## Deploy with GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` tests and builds the app,
uploads `dist/`, and deploys it with GitHub's official Pages actions. In the
repository settings, choose **Settings → Pages → Source → GitHub Actions**.
Merge this branch into `main` (or push it to `work`) to deploy, or open the
workflow under **Actions → Deploy to GitHub Pages** and select **Run workflow**.

The deployed URL is shown in the workflow's `deploy` job and in the repository
**Deployments** section. All local assets, manifest URLs, and service-worker
cache entries are relative so the site works at `https://OWNER.github.io/REPO/`.

## Build the Android app

The Android project is a small native WebView shell that bundles the complete
web build, so the core guidance remains available offline. To build locally,
install Android SDK Platform 35 and then run:

```bash
npm run android:build
```

The debug APK is written to
`android/app/build/outputs/apk/debug/app-debug.apk`. Alternatively, run the
**Build Android APK** workflow in GitHub Actions and download the
`scrutineering-assistant-debug-apk` artifact from the completed workflow run.
External source and PDF links open in the device's browser.

The V0.1 knowledge set is deliberately bounded. Unsupported questions return no answer rather than an invented rule. Regulation answers include their NCR reference, source PDF page, amendment status, and practical pre-checks.
