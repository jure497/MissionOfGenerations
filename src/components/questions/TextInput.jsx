import React, { useState } from "react";
import { useLanguage } from "../../LanguageContext";

export default function TextInput({ question, onAnswered }) {
  const { t } = useLanguage();
  const [value, setValue] = useState("");

  const submit = () => {
    const expected =
      question.correctAnswers && Array.isArray(question.correctAnswers) && question.correctAnswers.length
        ? question.correctAnswers
        : [question.answer].filter(Boolean);

    const ok = expected
      .map((s) => String(s).trim().toLowerCase())
      .includes(String(value).trim().toLowerCase());

    onAnswered(!!ok);
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">{question.question}</h2>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full border rounded-lg px-3 py-2"
        placeholder={t("your_answer_placeholder")}
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
      <button
        onClick={submit}
        className="mt-3 px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700"
      >
        {t("submit")}
      </button>
    </div>
  );
}
