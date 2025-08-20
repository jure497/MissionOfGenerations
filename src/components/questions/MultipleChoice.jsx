import React, { useState } from "react";

export default function MultipleChoice({ question }) {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const checkAnswer = (option) => {
    setSelected(option);
    if (option === question.answer) {
      setFeedback("✅ Correct!");
    } else {
      setFeedback("❌ Try again");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
      <p className="text-lg font-semibold mb-4">{question.question}</p>
      <div className="space-y-2">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => checkAnswer(option)}
            className={`w-full px-4 py-2 rounded-lg border ${
              selected === option
                ? option === question.answer
                  ? "bg-green-200 border-green-600"
                  : "bg-red-200 border-red-600"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      {feedback && <p className="mt-4 font-medium">{feedback}</p>}
    </div>
  );
}
