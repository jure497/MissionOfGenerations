// src/components/questions/ChallengeTask.jsx
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../LanguageContext";
import { pickByLang } from "../../utils/pickByLang";
import confetti from "canvas-confetti";

export default function ChallengeTask({ question, onAnswered }) {
  const { lang, t } = useLanguage();
  const text =
    pickByLang(question?.question, lang) ||
    pickByLang(question?.prompt, lang) ||
    "";

  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    setAnswered(false);
  }, [question?.id, lang]);

 const triggerConfetti = () => {
  // Trigger only 80% of the time
  if (Math.random() < 0.8) {
    // Simple confetti burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });

    // Optional emoji burst (🎉 ❤️ 🥳)
    const emojis = ["🎉", "✨", "🥳", "💪"];
    for (let i = 0; i < 20; i++) {
      const emoji = document.createElement("div");
      emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      emoji.style.position = "fixed";
      emoji.style.left = Math.random() * 100 + "vw";
      emoji.style.top = "100vh";
      emoji.style.fontSize = Math.random() * 24 + 24 + "px";
      emoji.style.animation = `flyUp ${3 + Math.random() * 2}s ease-out forwards`;
      document.body.appendChild(emoji);
      setTimeout(() => emoji.remove(), 5000);
    }
  }
};

  const handleAnswer = (type) => {
    setAnswered(true);
    if (type === "success") {
      triggerConfetti();
    }
    onAnswered(type);
  };

  return (
    <div className="w-full text-center">
      <h2 className="text-lg font-semibold mb-6">{text}</h2>

      {!answered && (
        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleAnswer("success")}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            {t("didGood") || "I succeeded"}
          </button>

          <button
            onClick={() => handleAnswer("encourage")}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-yellow-600"
          >
            {t("didPoor") || "I failed"}
          </button>
        </div>
      )}

      {/* Add animation for emojis */}
      <style jsx>{`
        @keyframes flyUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-120vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
