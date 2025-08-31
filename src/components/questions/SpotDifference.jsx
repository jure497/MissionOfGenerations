import React, { useEffect, useState } from "react";
import { useLanguage } from "../../LanguageContext";
import { pickByLang } from "../../utils/pickByLang";

export default function SpotDifference({ question, onAnswered }) {
  const { lang, t } = useLanguage();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    setShown(false);
  }, [question?.id, lang]);

  const text =
    pickByLang(question?.question, lang) ||
    pickByLang(question?.prompt, lang) ||
    "";

  const diffs = Array.isArray(question?.differences) ? question.differences : [];

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">{text}</h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
        <img
          src={question?.image1}
          alt="A"
          className="w-full md:w-1/2 border rounded-lg bg-white"
        />
        <img
          src={question?.image2}
          alt="B"
          className="w-full md:w-1/2 border rounded-lg bg-white"
        />
      </div>

      {!shown ? (
        <button
          onClick={() => {
            setShown(true);
            onAnswered(true); // allow Next without showing a red "wrong"
          }}
          className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700"
        >
          {t?.("show_differences") || "Show differences"}
        </button>
      ) : (
        <ul className="mt-4 list-disc list-inside text-left">
          {diffs.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
