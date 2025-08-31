import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// --- Translations (extend as needed) ---
const DICT = {
  en: {
    app_title: "Mission of Generations",
    pick_language: "Pick a language",
    english: "English",
    slovenian: "Slovenščina",
    select_role: "Select a role",
    role_grandchild: "Grandchild",
    role_grandparent: "Grandparent",
    start_quiz: "Start Quiz",
    loading: "Loading…",
    question: "Question",
    next: "Next",
    home: "Home",
    refresh: "Refresh",
    no_role: "No role selected.",
    go_home: "Go Home",
    no_questions_found_for: "No questions found for",
    add_in_firestore_hint:
      "Add some in Firestore (collection questions) or go to /admin if you build the admin page.",
    finished: "Finished!",
    your_score: "Your score",
    play_again: "Play again",
    correct: "Correct! ✅",
    wrong: "Not quite. ❌",
    your_answer_placeholder: "Your answer…",
    submit: "Submit",
    done: "Done!"
  },
  sl: {
    app_title: "Misija Generacij",
    pick_language: "Izberi jezik",
    english: "English",
    slovenian: "Slovenščina",
    select_role: "Izberi vlogo",
    role_grandchild: "Vnuk/Vnukinja",
    role_grandparent: "Stari starš",
    start_quiz: "Začni kviz",
    loading: "Nalagam…",
    question: "Vprašanje",
    next: "Naprej",
    home: "Domov",
    refresh: "Osveži",
    no_role: "Vloga ni izbrana.",
    go_home: "Nazaj domov",
    no_questions_found_for: "Ni najdenih vprašanj za",
    add_in_firestore_hint:
      "Dodajte vprašanja v Firestore (zbirka questions) ali pojdite na /admin, če ga zgradite.",
    finished: "Končano!",
    your_score: "Tvoj rezultat",
    play_again: "Igraj znova",
    correct: "Pravilno! ✅",
    wrong: "Ni čisto. ❌",
    your_answer_placeholder: "Tvoj odgovor…",
    submit: "Pošlji",
    done: "Narejeno!"
  },
};

const LanguageContext = createContext({ lang: "en", t: (k) => k, setLang: () => {} });

export const LanguageProvider = ({ children }) => {
  const initial =
    (typeof window !== "undefined" && localStorage.getItem("lang")) ||
    (typeof navigator !== "undefined" && navigator.language?.startsWith("sl")
      ? "sl"
      : "en");

  const [lang, setLang] = useState(initial);

  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
    } catch {}
  }, [lang]);

  const t = useMemo(() => {
    const dict = DICT[lang] || DICT.en;
    return (key) => dict[key] ?? key;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
