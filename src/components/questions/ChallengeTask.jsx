import React, { useEffect } from "react";
import { useLanguage } from "../../LanguageContext";
import { pickByLang } from "../../utils/pickByLang";

export default function ChallengeTask({ question, onAnswered }) {
  const { lang, t } = useLanguage();
  // support both `question` and `prompt`
  const text =
    pickByLang(question?.question, lang) ||
    pickByLang(question?.prompt, lang) ||
    "";

  // In case the admin configured it as a “free-pass” task, allow Next only after a click.
  useEffect(() => {
    // do nothing on mount; we want the user to click
  }, [question?.id, lang]);

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">{text}</h2>
      <button
        onClick={() => onAnswered(true)}
        className="mt-3 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
      >
        
        {t("done")}
      </button>
    </div>
  );
}
