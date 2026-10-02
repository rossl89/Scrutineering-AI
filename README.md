# Scrutineering Assistant V0.3

Reference tool for scrutineers. V0.2 replaces the five-answer demo with on-device PDF import, full-text passage retrieval, source/page links, source hashes, chapter filters, event-date filtering for explicitly confirmed source dates, and optional grounded AI explanations.

## On your Pixel

Install the debug APK and open it. Four included sources become searchable automatically: the NCR 2026 Edition 4 and January, March and June 2026 approved changes. Original source pages can be read offline. Use Source documents to import additional event or championship PDFs. Uninstalling clears personal imports and settings.

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

Before trackside reliance: review extraction on tables/diagrams, create and review amendment effective-date/supersession mappings, test natural-language paraphrases against a human-checked question set, evaluate grounded AI with the configured model, and confirm scope/precedence for the selected championship/event. Version checking against the official Approved Changes page is manual in V0.3.

## V0.3: sources included at installation

The Android build packages the original NCR 2026 Edition 4 (834 pages) and the January (41), March (20), and June (39) 2026 approved-change PDFs, plus their extracted search index: 934 PDF pages total. They load into device storage automatically at first launch and original pages can be viewed offline. No manual import is needed. Additional documents can still be imported.

`sources.json` pins official URLs, page counts and SHA-256 digests for the 2 October 2026 snapshot. The build downloads and verifies these originals, and fails if a source changes. PDFs and extracted corpus remain in ignored build/cache directories; they are not committed to the public repository. Updating a source requires reviewing the official edition, hash and index. The snapshot is not an automatic updating service. Change packs include dated and future provisions; some changes may already be incorporated in Edition 4. The app does not yet resolve amendment precedence or supply a verified historical ruleset.

### Set up the private AI server without a terminal

Open https://render.com/deploy?repo=https://github.com/rossl89/Scrutineering-AI/tree/codex/build-scrutineering-assistant-v0.1 and select the work branch `codex/build-scrutineering-assistant-v0.1` if asked. The `render.yaml` Blueprint creates a Node web service. Supply `OPENAI_API_KEY` in Render's secret field. The Blueprint sets a pinned Responses-compatible model and generates `APP_ACCESS_TOKEN`. Never put an OpenAI key in the app or repository. API usage is billed by your API provider; Render availability and pricing are governed by your selected plan.

After deployment, copy the service's HTTPS URL and the generated `APP_ACCESS_TOKEN` from Render's Environment panel into the app's AI answer connection fields. Save, then Test AI connection. A successful test checks the authenticated gateway, not a paid model request. Search a question and tap Explain with AI to invoke the model. The app access token lasts for the current session and must be reentered after a cold restart. Free hosting may need time to wake; retry a timed-out request after it starts.

The gateway receives the question, event date, retrieved passages and source metadata, uses strict JSON output, rejects unknown citation IDs, and returns an explicit context-needed/not-established status when appropriate. Passages are treated as untrusted input. Citation checking proves the cited passage was supplied, not that a generated interpretation is correct. Read the original PDF page before making an officiating decision. Offline document search and PDF viewing work without the server.

Validation covers gateway authentication, structured request settings and refusal of fabricated citations using a mocked provider. A live provider test and an on-device PDF rendering test still require credentials and a phone. No live AI deployment is included in the APK.
