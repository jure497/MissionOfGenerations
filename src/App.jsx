import React, { useState } from "react";
import QuestionRenderer from "./components/QuestionRenderer.jsx";
import grandchildQuestions from "./data/grandchildQuestions.js";
import grandparentQuestions from "./data/grandparentQuestions.js";

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get("role"); // "grandchild" or "grandparent"

  const questions =
    role === "grandparent" ? grandparentQuestions : grandchildQuestions;

  const [current, setCurrent] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-300 via-pink-200 to-yellow-200 p-6">
      <h1 className="text-3xl font-bold text-purple-800 mb-6">
        Mission of Generations 🚀
      </h1>

      {questions[current] ? (
        <>
          <QuestionRenderer question={questions[current]} />
          <button
            onClick={() => setCurrent((prev) => prev + 1)}
            className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700"
          >
            Next Question
          </button>
        </>
      ) : (
        <p className="text-lg font-semibold text-green-700">
          🎉 You finished all questions!
        </p>
      )}
    </div>
  );
}
