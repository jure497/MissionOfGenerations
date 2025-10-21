import React, { useState, useEffect } from "react";
import { useLanguage } from "../../LanguageContext";
import { pickByLang, getExpectedAnswers } from "../../utils/pickByLang";

export default function TextInput({ question, onAnswered }) {
  const { t, lang } = useLanguage();
  const [value, setValue] = useState("");

  // Reset input when question (or language) changes
  useEffect(() => {
    setValue("");
  }, [question?.id, lang]);

  const text = pickByLang(question?.question, lang) || "";
  const expected = getExpectedAnswers(question, lang);

  const submit = () => {
    const norm = (s) => String(s).trim().toLowerCase();
    const ok = expected.includes(norm(value));
    onAnswered(!!ok);
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">{text}</h2>
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
        className="mt-3 px-4 py-2 rounded-lg bg-[#577137] text-white hover:bg-[#4a5f2f]"
      >
        {t("submit")}
      </button>
    </div>
  );
}
