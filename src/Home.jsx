import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";

export default function Home() {
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#577137] via-[#4a5f2f] to-[#3d4f28] p-6 flex">
      {/* Logo */}
      <div className="mb-6 h-12">
        <img src="/img/logo.svg" alt="Logo" className="mx-auto h-full" />
      </div>
      {/* Main Content */}
      <div className="w-full max-w-md mx-auto">
        <div className="mx-auto bg-white/90 backdrop-blur rounded-2xl shadow-2xl p-8 w-full max-w-lg">
          <h1 className="text-3xl font-extrabold text-black mb-6 text-center">
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

          {/* Role Selection - Modern Card Style, Icon Only */}
          <p className="text-gray-700 font-medium mb-3 text-left">{t("select_role")}</p>
          <div className="flex flex-row gap-6 justify-center items-center w-full">
            <button
              onClick={() => navigate("/quiz?role=grandchild")}
              className="group flex-1 min-w-0 max-w-xs aspect-[4/5] rounded-2xl shadow-2xl flex flex-col items-center justify-center transition-transform hover:scale-105 focus:scale-105 border-4 border-transparent focus:border-fuchsia-300 outline-none relative overflow-hidden"
              aria-label={t("role_grandchild")}
            >
              {/* Background image for kids */}
              <img
                src="/img/kids.jpg"
                alt="Kids background"
                className="absolute inset-0 w-full h-full object-cover z-0"
                draggable="false"
              />

            </button>
            <button
              onClick={() => navigate("/quiz?role=grandparent")}
              className="group flex-1 min-w-0 max-w-xs aspect-[4/5] rounded-2xl shadow-2xl flex flex-col items-center justify-center transition-transform hover:scale-105 focus:scale-105 border-4 border-transparent focus:border-green-300 outline-none relative overflow-hidden"
              aria-label={t("role_grandparent")}
            >
              {/* Background image for adults */}
              <img
                src="/img/adults.jpg"
                alt="Adults background"
                className="absolute inset-0 w-full h-full object-cover z-0"
                draggable="false"
              />
            </button>
          </div>
        </div>
      </div>

      {/* All rights reserved */}
      <footer className="mt-10 text-center text-white/50 text-sm">
        <p>{t("all_rights_reserved")}</p>
      </footer>
    </div>
  );
}
