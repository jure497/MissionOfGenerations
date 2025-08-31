import React, { useRef, useEffect, useState } from "react";
import { useLanguage } from "../../LanguageContext";
import { pickByLang, getExpectedAnswers } from "../../utils/pickByLang";

export default function SoundChoice({ question, onAnswered }) {
  const { lang } = useLanguage();
  const audioRef = useRef(null);
  const [picked, setPicked] = useState(null);

  useEffect(() => {
    setPicked(null);
  }, [question?.id, lang]);

  const text =
    pickByLang(question?.question, lang) ||
    pickByLang(question?.prompt, lang) ||
    "";

  const optsRaw = pickByLang(question?.options, lang) || [];
  const options = Array.isArray(optsRaw) ? optsRaw : [];
  const expected = getExpectedAnswers(question, lang);
  const soundUrl = question?.soundUrl || question?.audio || "";

  const choose = (value) => {
    setPicked(value);
    const ok = expected.includes(String(value).trim().toLowerCase());
    onAnswered(!!ok);
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">{text}</h2>

      {soundUrl ? (
        <div className="mb-4 flex items-center gap-2">
          <button
            onClick={() => audioRef.current?.play()}
            className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700"
          >
            🔊 Play
          </button>
          <audio ref={audioRef} src={soundUrl} preload="auto" />
        </div>
      ) : (
        <div className="text-sm text-red-600 mb-4">
          Missing soundUrl on this question.
        </div>
      )}

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
