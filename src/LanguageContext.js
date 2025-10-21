import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// --- Translations (extend as needed) ---
const DICT = {
  en: {
    app_title: "Mission of Generations",
    pick_language: "Pick a language",
    english: "English",
    slovenian: "Slovenščina",
    select_role: "Select a role",
    role_grandchild: "Kid",
    role_grandparent: "Adult",
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
    correct: "🎉 Correct!",
    wrong: "❌ Not quite",
    your_answer_placeholder: "Your answer…",
    submit: "Submit",
    done: "Done!",
    congratulations: "Congratulations! 🎉",
    encourage: "Nice try — keep going!",
    didGood:"I succeeded",
    didPoor:"I Failed",
    show_differences: "Show differences",
    correct_answer: "Correct answer",
    show_answer: "Show answer",
    play:"Play",
    pool:"",
    check: "Check",
    dragExplain: "Drag and drop each picture into the correct category.",
    all_rights_reserved: "© 2024-2025 Mission of Generations. All rights reserved."


  },
  sl: {
    app_title: "Misija Generacij",
    pick_language: "Izberi jezik",
    english: "English",
    slovenian: "Slovenščina",
    select_role: "Izberi vlogo",
    role_grandchild: "Otrok",
    role_grandparent: "Odrasel",
    start_quiz: "Začni kviz",
    loading: "Nalagam…",
    question: "Vprašanje",
    next: "Naprej",
    home: "Domov",
    refresh: "Zamenjaj izziv",
    no_role: "Vloga ni izbrana.",
    go_home: "Nazaj domov",
    no_questions_found_for: "Ni najdenih vprašanj za",
    add_in_firestore_hint:
      "Dodajte vprašanja v Firestore (zbirka questions) ali pojdite na /admin, če ga zgradite.",
    finished: "Končano!",
    your_score: "Tvoj rezultat",
    play_again: "Igraj znova",
    correct: "Pravilno! 🎉",
    wrong: "Ni pravilno. ❌",
    your_answer_placeholder: "Tvoj odgovor…",
    submit: "Preveri",
    done: "Narejeno!",
    congratulations: "Čestitke! 🎉",
    encourage: "Dober poskus — nadaljuj!",
    didGood: "Uspelo mi je",
    didPoor:"Ni mi uspelo",
    show_differences: "Pokaži razlike",
    correct_answer: "Pravilen odgovor",
    show_answer: "Prikaži odgovor",
    play:"Igraj zvok",
    pool:"",
    check: "Preveri",
    dragExplain: "Povleci in spusti vsako sliko v ustrezno kategorijo.",
    all_rights_reserved: "© 2024-2025 Misija Generacij. Vse pravice pridržane."
  },
};

const LanguageContext = createContext({ lang: "en", t: (k) => k, setLang: () => {} });

export const LanguageProvider = ({ children }) => {
  const initial = "sl";
    // (typeof window !== "undefined" && localStorage.getItem("lang")) ||
    // (typeof navigator !== "undefined" && navigator.language?.startsWith("sl")
    //   ? "sl"
    //   : "en");

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
