import React, { useState, useEffect } from "react";
import { useLanguage } from "../../LanguageContext";
import { pickByLang, getExpectedAnswers } from "../../utils/pickByLang";

export default function MultipleChoice({ question, onAnswered }) {
  const { lang } = useLanguage();
  const [picked, setPicked] = useState(null);

  // Reset picked when question (or language) changes
  useEffect(() => {
    setPicked(null);
  }, [question?.id, lang]);

  const text = pickByLang(question?.question, lang) || "";
  const optionsRaw = pickByLang(question?.options, lang) || [];
  const options = Array.isArray(optionsRaw) ? optionsRaw : [];

  const expected = getExpectedAnswers(question, lang);

  const choose = (value) => {
    setPicked(value);
    const ok = expected.includes(String(value).trim().toLowerCase());
    onAnswered(!!ok);
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">{text}</h2>
      <div className="grid gap-2">
        {options.map((opt, i) => {
          const value =
            typeof opt === "string" ? opt : opt?.value ?? opt?.label ?? String(opt);
          const label =
            typeof opt === "string" ? opt : opt?.label ?? opt?.value ?? String(opt);
          const selected = picked === value;
          return (
            <button
              key={i}
              onClick={() => choose(value)}
              className={`px-4 py-2 rounded-lg border text-left ${
                selected ? "bg-purple-600 text-white" : "bg-white hover:bg-purple-50"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
