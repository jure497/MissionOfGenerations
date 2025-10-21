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
import { FaHome, FaRedo } from "react-icons/fa";

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
  const [isLoaded, setIsLoaded] = React.useState(false);


  // NEW: track if current question's streak has been counted
  const [hasCountedStreak, setHasCountedStreak] = React.useState(false);

  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // This is the new, combined useEffect hook. It now handles both loading from
  // localStorage and initializing a new game if no saved state is found.
  React.useEffect(() => {
    // Only proceed if we have a role, the questions have been loaded, and we haven't already processed the state
    if (!role || questions.length === 0 || isLoaded) {
      return;
    }

    const saved = localStorage.getItem(`quiz_state_${role}`);
    let loadedState = null;

    if (saved) {
      try {
        loadedState = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved state from localStorage:", e);
      }
    }

    // A list of question IDs from the newly fetched questions to validate the saved state.
    const fetchedQuestionIds = new Set(questions.map(q => q.id));

    // If we successfully loaded a state AND it has a valid order, use it.
    // The order is valid only if all saved question IDs exist in the new questions array.
    if (
      loadedState &&
      loadedState.order &&
      loadedState.order.length > 0 &&
      loadedState.order.every(id => fetchedQuestionIds.has(id))
    ) {
      setOrder(loadedState.order);
      setIndex(loadedState.index || 0);
      setScore(loadedState.score || 0);
      setStreak(loadedState.streak || 0);
      setFinished(loadedState.finished || false);
      
      // We always reset these ephemeral states on load
      setAnswered(false);
      setLastCorrect(null);
      setHasCountedStreak(false);
      
    } else {
      // Otherwise, no saved state was found or it was invalid, so we start a new game.
      setOrder(shuffleArray(questions.map((q) => q.id)));
      setIndex(0);
      setScore(0);
      setStreak(0);
      setFinished(false);
      setAnswered(false);
      setLastCorrect(null);
      setHasCountedStreak(false);
    }

    // Mark as loaded once the initial state has been determined
    setIsLoaded(true);
  }, [role, questions, isLoaded]); // Now depends on `role` and `questions`

  // This useEffect still correctly saves the state whenever it changes.
  React.useEffect(() => {
    if (!role || !isLoaded) return;
    localStorage.setItem(
      `quiz_state_${role}`,
      JSON.stringify({ order, index, score, streak, finished })
    );
  }, [role, order, index, score, streak, finished, isLoaded]);

  React.useEffect(() => {
    if (lastCorrect !== null && lastCorrect !== "neutral") {
      const timer = setTimeout(() => {
        setLastCorrect(null);
      }, 1900); // Hide after 1.5 seconds
      return () => clearTimeout(timer);
    }
  }, [lastCorrect]);

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
      // When finished, we need to completely reset the state to avoid
      // saving a finished state that would immediately load as finished again.
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
    // Explicitly clear the localStorage to ensure a fresh start
    localStorage.removeItem(`quiz_state_${role}`);
  };

  const progressPct = order.length
    ? Math.round(((Math.min(index + 1, order.length)) / order.length) * 100)
    : 0;

  const shouldShowFeedback =
    answered && lastCorrect !== null && lastCorrect !== "neutral";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#577137] via-[#4a5f2f] to-[#3d4f28] p-4 overflow-x-hidden">
      <div className="max-w-xl mx-auto relative">
        {/* Logo */}
        <div className="mb-6 h-12">
          <img src="/img/logo.svg" alt="Logo" className="mx-auto h-full" />
        </div>
        <div className="relative flex gap-3 justify-between my-5">
          <button
            onClick={() => navigate("/")}
            className="btn-white flex items-center gap-3 text-lg px-4 py-2 rounded-xl border-1 border-white bg-white/10 shadow focus:outline-none focus:ring-4 focus:ring-white/40 transition-all"
            style={{ minWidth: 120 }}
          >
            <FaHome className="text-white text-xl" aria-hidden="true" />
            <span className="font-normal text-white text-base hover:">{t("home")}</span>
          </button>
          <button
            onClick={restart}
            className="btn-white flex items-center gap-3 text-lg px-4 py-2 rounded-xl border-1 border-white bg-white/10 shadow focus:outline-none focus:ring-4 focus:ring-white/40 transition-all"
            style={{ minWidth: 120 }}
          >
            <FaRedo className="text-white text-base" aria-hidden="true" />
            <span className="font-normal text-white text-base">{t("refresh")}</span>
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6 relative m-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-black">
              {roleLabel}
            </h2>
          </div>

          {/* Progress + streak */}
          <div className="flex items-center justify-between mb-4 border-b pb-4 border-gray-400/60">
            <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
              <div
                className="bg-[#405631] h-2 rounded-full"
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
                      color: streak >= 10 ? "#FFD700" : "#000",
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

          {loading || !isLoaded ? (
            <div className="text-center p-8 text-lg font-medium">
              {t("loading")}...
            </div>
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
              
              {/* This is the new container for the feedback to prevent layout shift */}
              <div className="absolute inset-x-0 bottom-40 w-full flex justify-center pointer-events-none">
                {/* Success Feedback */}
                {shouldShowFeedback && lastCorrect === "success" && (
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
                      className="p-3 rounded-lg border flex items-center justify-center text-center
                        bg-green-50 border-green-300 text-green-800 pointer-events-auto"
                    >
                      <span className="mr-2">🎉</span>
                      {t("congratulations")}
                    </motion.div>
                  </AnimatePresence>
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
                      className="p-3 rounded-lg border flex items-center justify-center text-center
                        bg-yellow-50 border-yellow-300 text-yellow-800 pointer-events-auto"
                    >
                      <span className="mr-2">✨</span>
                      {t("encourage")}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
  
              <div className="mt-4 flex justify-end border-t pt-4 border-gray-400/60">
                <button
                  onClick={next}
                  disabled={!answered}
                  className={`px-5 py-2 rounded-xl font-medium shadow ${
                    answered
                      ? "bg-[#405631] text-white hover:bg-[#4a5f2f]"
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
                className="mt-4 px-5 py-2 rounded-xl bg-[#405631] text-white hover:bg-[#4a5f2f] shadow"
              >
                {t("play_again")}
              </button>
            </div>
          )}
        </div>

        {/* All rights reserved */}
        <div className="text-center text-sm text-white/50 mt-10">
          <p>{t("all_rights_reserved")}</p>
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
