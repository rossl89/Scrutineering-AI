export const PDF_URL = "https://www.motorsportuk.org/wp-content/uploads/2025/03/NCR-Edition-4.pdf";
export const CHANGES_URL = "https://www.motorsportuk.org/resource-centre/national-competition-rules/approved-changes/";

export const entries = [
  {
    id: "extinguisher",
    title: "Fire extinguisher requirements",
    keywords: ["fire", "extinguisher", "system", "bottle", "plumbed", "handheld"],
    question: "Does my fire extinguisher need to be in date?",
    answer: "Yes. The extinguisher must be within the manufacturer’s service period, securely mounted and accessible. For a plumbed-in system, check that the tell-tale gauge is in the operating range and that both internal and external triggers are marked and operable.",
    reference: "NCR Ch. 7, App. 6, Art. 1.2",
    page: 158,
    checklist: ["Check service label and date", "Confirm mount and retaining straps", "Test both trigger controls without discharging"],
    amendment: { state: "current", label: "Current in Edition 4", date: "1 Jan 2026" }
  },
  {
    id: "helmet",
    title: "Helmet standards",
    keywords: ["helmet", "head", "snell", "fia", "standard", "expiry"],
    question: "Which helmet standards can I use?",
    answer: "Use a helmet carrying a standard listed as accepted for your discipline, with its label intact and legible. It must be in sound condition and must not have been modified outside the manufacturer’s instructions. Acceptance can vary by discipline, so check the event regulations too.",
    reference: "NCR Ch. 7, App. 4, Art. 1",
    page: 147,
    checklist: ["Match the approval label to the accepted list", "Inspect shell, lining and strap", "Check discipline-specific event regulations"],
    amendment: { state: "future", label: "Future change approved", date: "Effective 1 Jan 2027" }
  },
  {
    id: "tow",
    title: "Towing points",
    keywords: ["tow", "towing", "eye", "recovery", "strap", "hook"],
    question: "How should my towing points be marked?",
    answer: "Fit a clearly visible towing point at the front and rear. It should be strong enough for recovery, readily accessible without tools, and identified by a contrasting arrow or colour so marshals can locate it quickly.",
    reference: "NCR Ch. 7, App. 5, Art. 1.6",
    page: 154,
    checklist: ["Fit front and rear recovery points", "Make each point immediately accessible", "Apply a contrasting tow arrow"],
    amendment: { state: "current", label: "Current in Edition 4", date: "1 Jan 2026" }
  },
  {
    id: "battery",
    title: "Battery security and isolation",
    keywords: ["battery", "isolator", "electrical", "master", "switch", "terminal"],
    question: "What will be checked on my battery isolator?",
    answer: "The battery must be securely retained and its live terminals protected against short circuits. Where a master switch is required, it must isolate the electrical circuits and be operable from the prescribed internal and external positions, with the external control clearly marked.",
    reference: "NCR Ch. 7, App. 5, Art. 1.3",
    page: 152,
    checklist: ["Try to move the battery in its mount", "Cover live terminals", "Check the external OFF symbol and operation"],
    amendment: { state: "current", label: "Current in Edition 4", date: "1 Jan 2026" }
  },
  {
    id: "harness",
    title: "Safety harness condition",
    keywords: ["harness", "seatbelt", "belt", "strap", "expiry", "date"],
    question: "Can I use an out-of-date harness?",
    answer: "A harness must meet the specification and validity requirements for the discipline. Inspect webbing, stitching, buckles and mounting points; damage or an expired validity label may make it unacceptable even if it appears serviceable.",
    reference: "NCR Ch. 7, App. 4, Art. 2",
    page: 149,
    checklist: ["Read every homologation label", "Check webbing and stitching for damage", "Confirm mounting angles and hardware"],
    amendment: { state: "unverified", label: "Amendments not verified", date: "Review required" }
  }
];

const stopWords = new Set(["a", "an", "and", "are", "can", "do", "does", "for", "how", "i", "is", "it", "my", "of", "on", "the", "to", "what", "which", "with"]);
export function searchKnowledge(query) {
  const terms = query.toLowerCase().match(/[a-z0-9]+/g)?.filter(word => !stopWords.has(word) && word.length > 2) ?? [];
  if (!terms.length) return null;
  const ranked = entries.map(entry => {
    const haystack = `${entry.title} ${entry.question} ${entry.keywords.join(" ")}`.toLowerCase();
    const score = terms.reduce((sum, term) => sum + (entry.keywords.some(k => k === term) ? 4 : haystack.includes(term) ? 1 : 0), 0);
    return { entry, score };
  }).sort((a, b) => b.score - a.score);
  return ranked[0].score >= 3 ? ranked[0].entry : null;
}

export function pdfPageLink(page) { return `${PDF_URL}#page=${page}`; }
