import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pdfPageLink, searchKnowledge } from "../src/knowledge.js";

test("retrieves extinguisher guidance from a natural-language question", () => {
  const answer = searchKnowledge("Does my fire extinguisher need to be in date?");
  assert.equal(answer?.id, "extinguisher");
  assert.match(answer.reference, /NCR Ch\./);
  assert.match(pdfPageLink(answer.page), /#page=158$/);
});

test("retrieves towing and battery questions", () => {
  assert.equal(searchKnowledge("Where does the tow strap need to be?")?.id, "tow");
  assert.equal(searchKnowledge("How must I secure the battery?")?.id, "battery");
});

test("refuses unsupported questions instead of guessing", () => {
  assert.equal(searchKnowledge("What tyre pressure is fastest in heavy rain?"), null);
  assert.equal(searchKnowledge("Who will win the championship?"), null);
});

test("retains amendment state and effective dates", () => {
  assert.equal(searchKnowledge("Which helmet standards can I use?")?.amendment.state, "future");
  assert.match(searchKnowledge("Can I use this harness?")?.amendment.label, /not verified/i);
});

test("browser entry points are safe under a GitHub Pages repository subpath", async () => {
  const [html, manifest, worker] = await Promise.all([
    readFile("index.html", "utf8"),
    readFile("public/manifest.webmanifest", "utf8"),
    readFile("public/sw.js", "utf8")
  ]);
  assert.match(html, /src="\.\/src\/main\.js"/);
  assert.equal(JSON.parse(manifest).start_url, "./");
  assert.doesNotMatch(worker, /["']\/src\//);
});

test("Android shell serves bundled assets from an HTTPS-compatible origin", async () => {
  const [activity, manifest, workflow] = await Promise.all([
    readFile("android/app/src/main/java/uk/org/scrutineering/assistant/MainActivity.java", "utf8"),
    readFile("android/app/src/main/AndroidManifest.xml", "utf8"),
    readFile(".github/workflows/build-android.yml", "utf8")
  ]);
  assert.match(activity, /https:\/\/" \+ APP_HOST/);
  assert.match(activity, /shouldInterceptRequest/);
  assert.doesNotMatch(activity, /file:\/\/\//);
  assert.match(manifest, /android\.permission\.INTERNET/);
  assert.match(workflow, /android\/app\/build\/outputs\/apk\/debug\/app-debug\.apk/);
});
