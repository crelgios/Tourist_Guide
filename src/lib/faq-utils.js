export function normalizeFaqPayload(input = {}) {
  return {
    category: String(input.category || "General").trim() || "General",
    question: String(input.question || "").trim(),
    answer: String(input.answer || "").trim(),
    sort_order: Number.isFinite(Number(input.sort_order)) ? Number(input.sort_order) : 0
  };
}

export function validateFaqPayload(faq) {
  const errors = [];
  if (!faq.question) errors.push("question is required");
  if (!faq.answer) errors.push("answer is required");
  return errors;
}
