// src/components/questions/ChallengeTask.jsx
import React, { useEffect } from "react";
import { useLanguage } from "../../LanguageContext";
import { pickByLang } from "../../utils/pickByLang";

/**
 * ChallengeTask
 *
 * - "I succeeded" => onAnswered("success")
 * - "I failed"    => onAnswered("encourage")
 *
 * The rest of the app (Quiz/App or QuestionRenderer) should display:
 *  - congratulations for "success"
 *  - a friendly encouragement for "encourage"
 *  - and treat null/"neutral" as no feedback
 */
export default function ChallengeTask({ question, onAnswered }) {
  const { lang, t } = useLanguage();
  const text =
    pickByLang(question?.question, lang) ||
    pickByLang(question?.prompt, lang) ||
    "";

  useEffect(() => {
    // Reset / no auto-answer — wait for user choice
  }, [question?.id, lang]);

  return (
    <div className="w-full text-center">
      <h2 className="text-lg font-semibold mb-6">{text}</h2>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => onAnswered("success")}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          {t("didGood") || "I succeeded"}
        </button>

        <button
          onClick={() => onAnswered("encourage")}
          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-yellow-600"
        >
          {t("didPoor") || "I failed"}
        </button>
      </div>
    </div>
  );
}
