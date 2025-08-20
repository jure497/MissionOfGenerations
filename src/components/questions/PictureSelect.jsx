import React, { useState } from "react";

export default function PictureSelect({ question }) {
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const checkAnswer = (value) => {
    setSelected(value);
    if (value === question.answer) {
      setFeedback("✅ Correct!");
    } else {
      setFeedback("❌ Try again");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
      <p className="text-lg font-semibold mb-4">{question.question}</p>
      <div className="flex gap-4">
        {question.options.map((option, idx) => (
          <img
            key={idx}
            src={option.src}
            alt={option.value}
            onClick={() => checkAnswer(option.value)}
            className={`w-24 h-24 object-contain border-2 rounded-lg cursor-pointer ${
              selected === option.value
                ? option.value === question.answer
                  ? "border-green-500 bg-green-100"
                  : "border-red-500 bg-red-100"
                : "border-gray-300 hover:border-blue-400"
            }`}
          />
        ))}
      </div>
      {feedback && <p className="mt-4 font-medium">{feedback}</p>}
    </div>
  );
}
