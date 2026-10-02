# Scrutineering Assistant V0.2

Reference tool for scrutineers. V0.2 replaces the five-answer demo with on-device PDF import, full-text passage retrieval, source/page links, source hashes, chapter filters, event-date filtering for explicitly confirmed source dates, and optional grounded AI explanations.

## On your Pixel

Install the debug APK. Download the official NCR PDF using the app's link. In Source documents select NCR base edition, name it NCR 2026 Edition 4, choose the downloaded PDF, and import. The 834-page import runs on the phone and may take a minute. Keep the app open. Search works offline after import. Download and import Approved Changes PDFs separately, retaining document names and only entering effective dates that are explicitly confirmed. The source register is stored in IndexedDB on the device; uninstalling clears it.

The official documents are not redistributed in this public repository or the APK. Imports are personal copies processed on the device. Scanned documents need OCR before import. No confidential vehicle/homologation documents are uploaded automatically.

## What this version does not establish

Search matches are not a compliance decision, complete answer, or proof that no other rule applies. The parser attaches chapter/appendix/article labels where detected; PDF wording and page links remain authoritative. Diagrams and tables require checking the source PDF. Future Chapter 22 provisions are excluded by default. Approved Changes are searched as separate sources, not silently treated as overrides. No human-reviewed article-level supersession graph is supplied; the app flags this limitation. Historical queries require the correct historical edition. Publication dates must not be used as effective dates. Championship and event documents can be imported, but automatic precedence is not inferred.

## Local development

Node 22: `npm ci`, `npm test`, `npm run dev`. Production: `npm run build`. Android: `npm run android:build` with SDK Platform 35, Java 17 and Gradle 8.11.1. GitHub Actions builds the APK on pull requests; its artifacts contain the installable test APK. CI debug signing keys can change, requiring uninstall/reinstall.

## Optional AI server

`server/index.js` is a Node 22 HTTPS-proxy-backend application. Host it behind managed HTTPS. Set environment variables on the host:

- OPENAI_API_KEY: your server-side OpenAI key, never in the app or repository.
- OPENAI_MODEL: a Responses API model supporting structured outputs.
- APP_ACCESS_TOKEN: a randomly generated private application access token.
- APP_ORIGIN: `https://appassets.androidplatform.net` for Android, or the deployed web app origin.
- PORT: optional, defaults to 8080.

Start with `npm start`. Enter the HTTPS server URL and application access token in the phone's AI connection settings. The token is session-only on the phone. The OpenAI key stays on the server. Only explicitly requested questions and up to eight retrieved passages are sent. The server applies request-size limits, authentication, a basic process-local rate limit, a structured schema and exact source-ID validation. Citation validation verifies provenance, not whether every claim is entailed. Real AI reliability has not been evaluated without a configured API key. GitHub Pages hosts only the offline frontend, not this server.

## Next acceptance gates

Before trackside reliance: review extraction on tables/diagrams, create and review amendment effective-date/supersession mappings, test natural-language paraphrases against a human-checked question set, evaluate grounded AI with the configured model, and confirm scope/precedence for the selected championship/event. Version checking against the official Approved Changes page is manual in V0.2.
