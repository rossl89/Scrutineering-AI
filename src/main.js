import { CHANGES_URL, PDF_URL, entries, pdfPageLink, searchKnowledge } from "./knowledge.js";

const app = document.querySelector("#app");
let active = null;

app.innerHTML = `
  <header class="topbar">
    <a class="brand" href="#" aria-label="Scrutineering Assistant home"><span class="brand-mark">S</span><span>SCRUTINEERING<br><b>ASSISTANT</b></span></a>
    <button class="source-button" id="sourceButton" aria-expanded="false"><span class="pulse"></span> Source status</button>
  </header>
  <main>
    <section class="hero">
      <div class="eyebrow"><span></span> MOTORSPORT UK · NCR EDITION 4</div>
      <h1>Find the regulation.<br><em>Check the requirement.</em></h1>
      <p>For scrutineers: ask a regulation question and find the relevant NCR reference and source page. This prototype searches a limited set of indexed topics.</p>
      <form class="ask" id="askForm">
        <label for="question">ASK A SCRUTINEERING QUESTION</label>
        <div class="input-wrap"><input id="question" autocomplete="off" placeholder="e.g. What must I check on an extinguisher?" /><button aria-label="Ask question">→</button></div>
        <div class="suggestions" id="suggestions">
          ${entries.slice(0,3).map(e => `<button type="button" data-question="${e.question}">${e.question.replace("?","")}</button>`).join("")}
        </div>
      </form>
      <div class="meta-row"><span><b>01</b> Plain English</span><span><b>02</b> Source backed</span><span><b>03</b> Source references</span></div>
    </section>
    <section class="result" id="result" aria-live="polite" hidden></section>
    <section class="topics">
      <div class="section-head"><div><span>QUICK CHECKS</span><h2>Common inspection points</h2></div><p>Find requirements for common vehicle and driver equipment checks.</p></div>
      <div class="topic-grid">${entries.slice(0,4).map((e,i) => `<button class="topic-card" data-id="${e.id}"><span class="topic-num">0${i+1}</span><span class="topic-icon">${["◉","⌁","↗","ϟ"][i]}</span><strong>${e.title}</strong><small>${e.reference}</small><i>View guidance →</i></button>`).join("")}</div>
    </section>
  </main>
  <footer><div class="footer-brand"><span class="brand-mark">S</span><div><b>SCRUTINEERING ASSISTANT</b><small>NCR reference for scrutineers.</small></div></div><p>Guidance only. The NCR and event officials remain authoritative.</p><div class="footer-links"><a href="${PDF_URL}" target="_blank">NCR Edition 4 ↗</a><a href="${CHANGES_URL}" target="_blank">Approved changes ↗</a></div></footer>
  <aside class="status-panel" id="statusPanel" aria-label="Source status">
    <button id="closeStatus" aria-label="Close">×</button><span class="panel-kicker">SOURCE REGISTER</span><h2>Rules, with a paper trail.</h2>
    <div class="source-item ok"><span>✓</span><div><b>NCR Edition 4</b><small>Limited prototype topics · references need verification</small></div></div>
    <div class="source-item warn"><span>!</span><div><b>Approved changes</b><small>Amendments not verified · manual review required</small></div></div>
    <p class="panel-note">Coverage is limited to indexed topics, not the full NCR. Amendment labels are supplied with each entry; current applicability has not been verified. Check championship and event documents where relevant.</p>
    <a class="panel-link" href="${PDF_URL}" target="_blank">Open primary PDF →</a><a class="panel-link" href="${CHANGES_URL}" target="_blank">Review approved changes →</a>
  </aside><div class="scrim" id="scrim"></div>`;

function statusClass(state) { return state === "current" ? "current" : state === "future" ? "future" : "unverified"; }
function showResult(entry, query = entry.question) {
  active = entry;
  const result = document.querySelector("#result");
  if (!entry) {
    result.innerHTML = `<div class="answer-card unsupported"><span class="answer-label">NO SUPPORTED ANSWER</span><h2>We couldn’t find this in the indexed guidance.</h2><p>Try a question about helmets, harnesses, extinguishers, batteries or towing points. We won’t guess when the source does not support an answer.</p><a href="${PDF_URL}" target="_blank">Search the full NCR Edition 4 PDF →</a></div>`;
  } else {
    result.innerHTML = `<div class="answer-query">YOUR QUESTION <b>“${escapeHtml(query)}”</b></div><article class="answer-card"><div class="answer-top"><span class="answer-label">ANSWER</span><span class="amendment unverified">Reference and applicability not verified</span></div><h2>${entry.title}</h2><p class="answer-copy">${entry.answer}</p><div class="reference"><div><small>NCR REFERENCE · VERIFY IN SOURCE</small><strong>${entry.reference}</strong></div><a href="${pdfPageLink(entry.page)}" target="_blank">Open PDF · page ${entry.page} ↗</a></div><div class="checklist"><small>INSPECTION CHECKS</small>${entry.checklist.map(item => `<label><span>✓</span>${item}</label>`).join("")}</div><p class="caveat">Guidance only — check discipline and event-specific regulations. Source wording takes precedence.</p></article>`;
  }
  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth", block: "start" });
}
function escapeHtml(value) { const node=document.createElement("div"); node.textContent=value; return node.innerHTML; }
document.querySelector("#askForm").addEventListener("submit", event => { event.preventDefault(); const q=document.querySelector("#question").value.trim(); if(q) showResult(searchKnowledge(q), q); });
document.querySelectorAll("[data-question]").forEach(button => button.addEventListener("click", () => { document.querySelector("#question").value=button.dataset.question; showResult(searchKnowledge(button.dataset.question),button.dataset.question); }));
document.querySelectorAll("[data-id]").forEach(button => button.addEventListener("click", () => showResult(entries.find(e=>e.id===button.dataset.id))));
const panel=document.querySelector("#statusPanel"), scrim=document.querySelector("#scrim"), sourceButton=document.querySelector("#sourceButton");
function togglePanel(open){ panel.classList.toggle("open",open);scrim.classList.toggle("open",open);sourceButton.setAttribute("aria-expanded",String(open)); }
sourceButton.addEventListener("click",()=>togglePanel(true));document.querySelector("#closeStatus").addEventListener("click",()=>togglePanel(false));scrim.addEventListener("click",()=>togglePanel(false));

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(error => {
      console.warn("Offline support could not be enabled:", error);
    });
  });
}
