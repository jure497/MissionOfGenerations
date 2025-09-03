//app.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Home from "./Home.jsx";
import QuestionRenderer from "./components/QuestionRenderer.jsx";
import useQuestions from "./hooks/useQuestions.js";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import AdminWrapper from "./AdminWrapper";
import { AnimatePresence, motion } from "framer-motion";

function Quiz() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const params = new URLSearchParams(useLocation().search);
  const role = params.get("role");

  const { questions, loading, error } = useQuestions(role);

  const [order, setOrder] = React.useState([]);
  const [index, setIndex] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [answered, setAnswered] = React.useState(false);
  const [streak, setStreak] = React.useState(0);
  const [lastCorrect, setLastCorrect] = React.useState(null);
  const [finished, setFinished] = React.useState(false);
  const [brokenStreak, setBrokenStreak] = React.useState(false);

  // NEW: track if current question's streak has been counted
  const [hasCountedStreak, setHasCountedStreak] = React.useState(false);

  React.useEffect(() => {
    if (!role) return;
    const saved = localStorage.getItem(`quiz_state_${role}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setOrder(parsed.order || []);
        setIndex(parsed.index || 0);
        setScore(parsed.score || 0);
        setStreak(parsed.streak || 0);
        setAnswered(false);
        setLastCorrect(null);
        setFinished(parsed.finished || false);
        setHasCountedStreak(false);
        return;
      } catch {}
    }
    setOrder([]);
    setIndex(0);
    setScore(0);
    setStreak(0);
    setAnswered(false);
    setLastCorrect(null);
    setFinished(false);
    setHasCountedStreak(false);
  }, [role]);

  React.useEffect(() => {
    if (!role) return;
    localStorage.setItem(
      `quiz_state_${role}`,
      JSON.stringify({ order, index, score, streak, finished })
    );
  }, [role, order, index, score, streak, finished]);

  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  React.useEffect(() => {
    if (questions.length > 0 && order.length === 0) {
      setOrder(shuffleArray(questions.map((q) => q.id)));
    }
  }, [questions, order]);

  const roleLabel =
    role === "grandparent" ? t("role_grandparent") : t("role_grandchild");

  const currentQuestionId = order[index];
  const currentQuestion = questions.find((q) => q.id === currentQuestionId);

 const onAnswered = (result) => {
  let isCorrect = result;
  if (typeof result === "object" && result !== null && "isCorrect" in result) {
    isCorrect = result.isCorrect;
  }

  // Only count streak once per question
  if ((isCorrect === true || isCorrect === "success") && !hasCountedStreak) {
    setScore((s) => s + 1);
    setStreak((s) => s + 1);
    setHasCountedStreak(true); // lock this question's streak
  } 
  // Only reset streak if user hasn't already counted this question
  else if ((isCorrect === false || isCorrect === "encourage") && !hasCountedStreak) {
    if (streak > 0) {
      setBrokenStreak(true);
      setTimeout(() => setBrokenStreak(false), 1000);
    }
    setStreak(0);
    setHasCountedStreak(true); // mark as counted so wrongs can't reset it again
  }

  setAnswered(true);
  setLastCorrect(isCorrect);
};


  const next = () => {
    if (index + 1 < order.length) {
      setIndex((i) => i + 1);
      setAnswered(false);
      setLastCorrect(null);
      setHasCountedStreak(false); // reset for next question
    } else {
      setOrder(shuffleArray(questions.map((q) => q.id)));
      setIndex(0);
      setAnswered(false);
      setLastCorrect(null);
      setFinished(true);
      setHasCountedStreak(false);
    }
  };

  const restart = () => {
    setOrder(shuffleArray(questions.map((q) => q.id)));
    setIndex(0);
    setScore(0);
    setAnswered(false);
    setLastCorrect(null);
    setFinished(false);
    setStreak(0);
    setHasCountedStreak(false);
  };

  const progressPct = order.length
    ? Math.round(((Math.min(index + 1, order.length)) / order.length) * 100)
    : 0;

  const shouldShowFeedback =
    answered && lastCorrect !== null && lastCorrect !== "neutral";

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-400 via-purple-400 to-sky-400 p-4">
      <div className="max-w-xl mx-auto relative">
        <div className="absolute top-2 left-2 flex gap-2">
          <button
            onClick={() => navigate("/")}
            className="px-3 py-2 rounded-lg bg-white/90 border shadow"
          >
            🏠 {t("home")}
          </button>
          <button
            onClick={restart}
            className="px-3 py-2 rounded-lg bg-white/90 border shadow"
          >
            🔄 {t("refresh")}
          </button>
        </div>

        <div className="pt-14" />

        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-purple-800">
              {roleLabel} • {t("app_title")}
            </h2>
          </div>

          {/* Progress + streak */}
          <div className="flex items-center justify-between mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
              <div
                className="bg-purple-600 h-2 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="relative w-16 h-8 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {streak > 0 && (
                  <motion.div
                    key={streak}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{
                      opacity: 1,
                      scale: streak >= 10 ? [1, 1.2, 0.9, 1] : 1.1,
                      rotate: streak >= 10 ? [-5, 5, -5, 5, 0] : 0,
                      color: streak >= 10 ? "#FFD700" : "#fff",
                    }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="font-bold text-lg select-none"
                  >
                    🔥 {streak}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {brokenStreak && (
                  <motion.div
                    key="broken"
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{
                      opacity: 0,
                      scale: 0.5,
                      rotate: [-10, 10, -10, 10, 0],
                      y: 50,
                    }}
                    transition={{ duration: 1 }}
                    className="absolute text-red-500 font-bold text-lg select-none"
                  >
                    ❌
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {error && (
            <div className="p-3 mb-3 rounded border border-red-300 bg-red-50 text-red-800">
              Error: {String(error.message || error)}
            </div>
          )}

          {loading ? (
            <div>{t("loading")}</div>
          ) : !questions.length ? (
            <div>
              <p className="mb-2">
                {t("no_questions_found_for")} <b>{roleLabel}</b>.
              </p>
              <p className="text-sm text-gray-600">{t("add_in_firestore_hint")}</p>
            </div>
          ) : !finished ? (
            <>
              {currentQuestion && (
                <QuestionRenderer
                  question={currentQuestion}
                  onAnswered={onAnswered}
                  streak={streak}
                />
              )}

              {/* Only show "encourage" feedback */}
              {shouldShowFeedback && lastCorrect === "encourage" && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`feedback-${lastCorrect}`}
                    initial={{ opacity: 0, y: 10, scale: 0.85 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: { type: "spring", stiffness: 300, damping: 20 },
                    }}
                    exit={{
                      opacity: 0,
                      y: 10,
                      scale: 0.85,
                      transition: { duration: 0.2 },
                    }}
                    className="relative mt-4 p-3 rounded-lg border flex items-center justify-center text-center
                      bg-yellow-50 border-yellow-300 text-yellow-800"
                  >
                    <span className="mr-2">✨</span>
                    {t("encourage")}
                  </motion.div>
                </AnimatePresence>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  onClick={next}
                  disabled={!answered}
                  className={`px-5 py-2 rounded-xl font-medium shadow ${
                    answered
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                >
                  {t("next")}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h3 className="text-2xl font-extrabold text-purple-800">
                🎉 {t("finished")}
              </h3>

              <button
                onClick={restart}
                className="mt-4 px-5 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 shadow"
              >
                {t("play_again")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/admin" element={<AdminWrapper />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}
