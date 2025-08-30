// src/utils/pickByLang.js
export function pickByLang(val, lang) {
  if (val == null) return val;
  if (typeof val === "string" || Array.isArray(val)) return val;
  if (typeof val === "object") {
    if (Array.isArray(val[lang])) return val[lang];
    if (typeof val[lang] === "string") return val[lang];
    return val.en ?? val.sl ?? Object.values(val)[0];
  }
  return val;
}

// normalize expected answers into array of strings
export function getExpectedAnswers(question, lang) {
  let expected = [];
  const ca = pickByLang(question.correctAnswers, lang);
  const ans = pickByLang(question.answer, lang);

  if (Array.isArray(ca)) expected.push(...ca);
  else if (ca != null) expected.push(ca);

  if (Array.isArray(ans)) expected.push(...ans);
  else if (ans != null) expected.push(ans);

  // fallback: use values from object if nothing else
  if (!expected.length && typeof question.answer === "object") {
    expected.push(...Object.values(question.answer));
  }

  return expected.map((s) => String(s).trim().toLowerCase());
}
