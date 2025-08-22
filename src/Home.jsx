import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";

export default function Home() {
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-400 via-purple-400 to-sky-400 p-6">
      <div className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-extrabold text-purple-800 mb-6 text-center">
          {t("app_title")}
        </h1>

        {/* Language Picker */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("pick_language")}
          </label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option value="en">{t("english")}</option>
            <option value="sl">{t("slovenian")}</option>
          </select>
        </div>

        {/* Role Selection */}
        <p className="text-gray-700 font-medium mb-3">{t("select_role")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/quiz?role=grandchild")}
            className="px-4 py-3 rounded-xl bg-fuchsia-600 text-white font-semibold shadow hover:bg-fuchsia-700"
          >
            {t("role_grandchild")}
          </button>
          <button
            onClick={() => navigate("/quiz?role=grandparent")}
            className="px-4 py-3 rounded-xl bg-sky-600 text-white font-semibold shadow hover:bg-sky-700"
          >
            {t("role_grandparent")}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
          {t("start_quiz")} 
        </p>
      </div>
    </div>
  );
}
