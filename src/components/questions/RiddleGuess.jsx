import React, { useEffect, useState } from "react";
import { useLanguage } from "../../LanguageContext";
import { pickByLang, getExpectedAnswers } from "../../utils/pickByLang";

export default function RiddleGuess({ question, onAnswered }) {
  const { lang, t } = useLanguage();
  const [value, setValue] = useState("");
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setValue("");
    setRevealed(false);
  }, [question?.id, lang]);

  const text =
    pickByLang(question?.question, lang) ||
    pickByLang(question?.prompt, lang) ||
    "";
  const expected = getExpectedAnswers(question, lang);

  const submit = () => {
    const norm = (s) => String(s).trim().toLowerCase();
    const ok = expected.includes(norm(value));
    onAnswered(!!ok);
  };

  const reveal = () => {
    setRevealed(true);
    // Let them move on even if they didn't guess it.
    onAnswered(false);
  };

  const showAnswer =
    pickByLang(question?.answer, lang) ||
    pickByLang(question?.correctAnswer, lang) ||
    expected[0] ||
    "";

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">{text}</h2>

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border rounded-lg px-3 py-2"
        placeholder={t?.("your_answer_placeholder") || "Your answer"}
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />

      <div className="mt-3 flex gap-2">
        <button
          onClick={submit}
          className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700"
        >
          {t?.("submit") || "Submit"}
        </button>
        <button
          onClick={reveal}
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
        >
          {t?.("show_answer") || "Show Answer"}
        </button>
      </div>

      {revealed && (
        <div className="mt-3 p-3 rounded bg-yellow-50 border border-yellow-300">
          <b>{t?.("correct_answer") || "Correct answer"}:</b> {showAnswer}
        </div>
      )}
    </div>
  );
}
