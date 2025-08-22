import React, { useState } from "react";

export default function PictureSelect({ question, onAnswered }) {
  const [picked, setPicked] = useState(null);

  const choose = (opt) => {
    const value = typeof opt === "string" ? opt : opt.value;
    setPicked(value);
    onAnswered(String(value) === String(question.answer));
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">{question.question}</h2>
      <div className="grid grid-cols-2 gap-4">
        {question.options.map((opt, i) => {
          const src = typeof opt === "string" ? opt : opt.src;
          const value = typeof opt === "string" ? opt : opt.value;
          const selected = picked === value;
          return (
            <button
              key={i}
              onClick={() => choose(opt)}
              className={`rounded-xl border-2 overflow-hidden ${
                selected ? "border-purple-600" : "border-transparent"
              }`}
            >
              <img src={src} alt={value} className="w-full h-32 object-contain bg-white" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
