import React, { useState, useEffect } from "react";
import { useLanguage } from "../../LanguageContext";
import { pickByLang, getExpectedAnswers } from "../../utils/pickByLang";

export default function PictureSelect({ question, onAnswered }) {
  const { lang } = useLanguage();
  const [picked, setPicked] = useState(null);

  // Reset picked when question (or language) changes
  useEffect(() => {
    setPicked(null);
  }, [question?.id, lang]);

  const text = pickByLang(question?.question, lang) || "";
  const optsRaw = pickByLang(question?.options, lang) || [];
  const options = Array.isArray(optsRaw) ? optsRaw : [];

  const expected = getExpectedAnswers(question, lang);

  const choose = (opt) => {
    const value = typeof opt === "string" ? opt : opt.value;
    setPicked(value);
    const ok = expected.includes(String(value).trim().toLowerCase());
    onAnswered(!!ok);
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">{text}</h2>
      <div className="grid grid-cols-2 gap-4">
        {options.map((opt, i) => {
          const src = typeof opt === "string" ? opt : opt.src;
          const value = typeof opt === "string" ? opt : opt.value;
          const selected = picked === value;
          return (
            <button
              key={i}
              onClick={() => choose(opt)}
              className={`rounded-xl border-2 overflow-hidden ${
                selected ? "border-[#405631]" : "border-transparent"
              }`}
            >
              <img src={src} alt={String(value)} className="w-full h-32 object-contain bg-white" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
