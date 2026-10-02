# Cloudflare setup without a terminal

This Worker uses the existing V0.3 APK protocol. No APK update is required. It calls OpenAI, not Cloudflare Workers AI, and needs no AI, database or storage binding.

1. In Workers & Pages create a Worker with Start with Hello World. Name it scrutineering-ai.
2. Open Edit code and replace the entire default worker.js with this folder's worker.js. Deploy.
3. Open Settings > Variables and Secrets > Add. Select Secret and set OPENAI_API_KEY to your OpenAI API key.
4. Add a second Secret named APP_ACCESS_TOKEN. Generate a unique random token of at least 32 characters with your password manager. Save it privately before submitting: Cloudflare hides saved secret values. Never use your OpenAI key as the app token.
5. Deploy the settings. The model defaults to gpt-4.1-mini-2025-04-14; no extra model variable is needed. APP_ORIGIN defaults to the Android app origin.
6. Open your Worker's public workers.dev address. The JSON should show ok:true and configured:true. This confirms the code and secrets are present, not that the provider key/billing is valid.
7. In the V0.3 app's AI answer connection enter the base HTTPS Worker URL (no /api/answer suffix) and the exact APP_ACCESS_TOKEN. Save and Test AI connection. This is an authenticated gateway test, not a paid provider call.
8. Search and tap Explain with AI to make a real model request. OpenAI credits/billing are required. Only your question, event date and up to eight retrieved passages/source metadata are sent. PDFs stay in the APK/device.

The app's token lasts for the current session; reenter after a cold restart. Leave secrets out of source code, GitHub, screenshots and chat. Use Cloudflare's production workers.dev URL, not the editor preview URL. API costs remain separate from free hosting.

The endpoint enforces authentication, bounded body size, schema validation, unique source IDs and rejection of invented citation IDs. It trusts passages supplied by the authenticated personal app. Its basic per-isolate request limit is not global and does not enforce an account spending cap. Source-ID validation does not establish correct interpretation, amendment precedence, completeness or applicability. Mocked-provider tests cover the protocol; live deployment/provider testing requires your configured account.
