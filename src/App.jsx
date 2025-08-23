import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from "./Home.jsx";
import QuestionRenderer from "./components/QuestionRenderer.jsx";
import useQuestions from "./hooks/useQuestions.js";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import AdminWrapper from "./AdminWrapper";
import { getAvailableQuestions, markQuestionUsed } from "./utils/questionUtils";


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
    const [lastCorrect, setLastCorrect] = React.useState(null);
    const [finished, setFinished] = React.useState(false);
  
    // 🔑 Load persistent state from localStorage
    React.useEffect(() => {
      if (!role) return;
      const saved = localStorage.getItem(`quiz_state_${role}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setOrder(parsed.order || []);
          setIndex(parsed.index || 0);
          setScore(parsed.score || 0);
          setAnswered(false);
          setLastCorrect(null);
          setFinished(parsed.finished || false);
          return;
        } catch {}
      }
      setOrder([]);
      setIndex(0);
      setScore(0);
      setAnswered(false);
      setLastCorrect(null);
      setFinished(false);
    }, [role]);
  
    // 🔑 Persist state to localStorage
    React.useEffect(() => {
      if (!role) return;
      localStorage.setItem(
        `quiz_state_${role}`,
        JSON.stringify({ order, index, score, finished })
      );
    }, [role, order, index, score, finished]);
  
    // 🔑 Shuffle function
    function shuffleArray(arr) {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }
  
    // 🔑 Ensure we always have a shuffled order
    React.useEffect(() => {
      if (questions.length > 0 && order.length === 0) {
        setOrder(shuffleArray(questions.map((q) => q.id)));
      }
    }, [questions, order]);
  
    if (!role) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-400 via-purple-400 to-sky-400 p-6">
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8 text-center">
            <p className="mb-4">{t("no_role")}</p>
            <button onClick={() => navigate("/")} className="px-4 py-2 rounded-lg bg-gray-800 text-white">
              {t("go_home")}
            </button>
          </div>
        </div>
      );
    }
  
    const roleLabel = role === "grandparent" ? t("role_grandparent") : t("role_grandchild");
  
    const currentQuestionId = order[index];
    const currentQuestion = questions.find((q) => q.id === currentQuestionId);
  
    const onAnswered = (isCorrect) => {
      setAnswered(true);
      setLastCorrect(isCorrect);
      if (isCorrect) setScore((s) => s + 1);
    };
  
    const next = () => {
      if (index + 1 < order.length) {
        setIndex((i) => i + 1);
        setAnswered(false);
        setLastCorrect(null);
      } else {
        // all questions used up → shuffle again for next round
        setOrder(shuffleArray(questions.map((q) => q.id)));
        setIndex(0);
        setAnswered(false);
        setLastCorrect(null);
        setFinished(true);
      }
    };
  
    const restart = () => {
      setOrder(shuffleArray(questions.map((q) => q.id)));
      setIndex(0);
      setScore(0);
      setAnswered(false);
      setLastCorrect(null);
      setFinished(false);
    };
  
    const progressPct = order.length
      ? Math.round(((Math.min(index + 1, order.length)) / order.length) * 100)
      : 0;
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-fuchsia-400 via-purple-400 to-sky-400 p-4">
        <div className="max-w-xl mx-auto relative">
          <div className="absolute top-2 left-2 flex gap-2">
            <button onClick={() => navigate("/")} className="px-3 py-2 rounded-lg bg-white/90 border shadow">
              🏠 {t("home")}
            </button>
            <button onClick={restart} className="px-3 py-2 rounded-lg bg-white/90 border shadow">
              🔄 {t("refresh")}
            </button>
          </div>
  
          <div className="pt-14" />
  
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-purple-800">{roleLabel} • {t("app_title")}</h2>
              <div className="text-sm text-gray-600">
                {loading ? t("loading") : `${t("question")} ${Math.min(index + 1, order.length)} / ${order.length}`}
              </div>
            </div>
  
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${progressPct}%` }} />
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
                  <QuestionRenderer question={currentQuestion} onAnswered={onAnswered} />
                )}
  
                {answered && (
                  <div
                    className={`mt-4 p-3 rounded-lg border ${
                      lastCorrect
                        ? "bg-green-50 border-green-300 text-green-800"
                        : "bg-red-50 border-red-300 text-red-800"
                    }`}
                  >
                    {lastCorrect ? t("correct") : t("wrong")}
                  </div>
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
                <h3 className="text-2xl font-extrabold text-purple-800">🎉 {t("finished")}</h3>
                <p className="mt-2">
                  {t("your_score")}: <span className="font-semibold">{score}</span> / {order.length}
                </p>
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
