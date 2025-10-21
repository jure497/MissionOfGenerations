import React, { useEffect, useState } from "react";
import { useLanguage } from "../../LanguageContext";
import { pickByLang, getExpectedAnswers } from "../../utils/pickByLang";

export default function RiddleGuess({ question, onAnswered }) {
  const { lang, t } = useLanguage();
  const [value, setValue] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [answered, setAnswered] = useState(false); // track if user has submitted
  const [isCorrect, setIsCorrect] = useState(null); // Track if the answer was correct or not

  useEffect(() => {
    setValue("");
    setRevealed(false);
    setAnswered(false);
    setIsCorrect(null); // Reset the correctness state for a new question
  }, [question?.id, lang]);

  const text =
    pickByLang(question?.question, lang) ||
    pickByLang(question?.prompt, lang) ||
    "";
  const expected = getExpectedAnswers(question, lang);

  const submit = () => {
    const norm = (s) => String(s).trim().toLowerCase();
    const ok = expected.includes(norm(value));
    setAnswered(true);
    setIsCorrect(!!ok); // Set the isCorrect state based on the result
    onAnswered(!!ok);
  };

  const reveal = () => {
    setRevealed(true);
    // showing answer doesn't count as wrong
  };

  
const showAnswer =
  (pickByLang(question?.answer, lang) ||
    pickByLang(question?.correctAnswer, lang) ||
    expected ||
    []
  )[0] || "";
  
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
        disabled={answered} // optional: prevent retyping after submission
      />

      <div className="mt-3 flex gap-2">
        {!answered && (
          <button
            onClick={submit}
            className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-[#4a5f2f]"
          >
            {t?.("submit") || "Submit"}
          </button>
        )}

        {answered && !revealed && !isCorrect && (
          <button
            onClick={reveal}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-yellow-300"
          >
            {t?.("show_answer") || "Show Answer"}
          </button>
        )}
      </div>

      {revealed && (
        <div className="mt-3 p-3 rounded bg-yellow-50 border border-yellow-300">
          <b>{t?.("correct_answer") || "Correct answer"}:</b> {showAnswer}
          
        </div>
      )}
    </div>
  );
}
