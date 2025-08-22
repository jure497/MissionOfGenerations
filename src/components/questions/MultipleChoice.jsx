import React, { useState } from "react";

export default function MultipleChoice({ question, onAnswered }) {
  const [picked, setPicked] = useState(null);

  const choose = (value) => {
    setPicked(value);
    const ok = String(value) === String(question.answer);
    onAnswered(ok);
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">{question.question}</h2>
      <div className="grid gap-2">
        {(question.options || []).map((opt, i) => {
          const value = typeof opt === "string" ? opt : opt?.value ?? opt?.label ?? String(opt);
          const selected = picked === value;
          return (
            <button
              key={i}
              onClick={() => choose(value)}
              className={`px-4 py-2 rounded-lg border text-left ${
                selected ? "bg-purple-600 text-white" : "bg-white hover:bg-purple-50"
              }`}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
