import React, { useState } from "react";

function TextInput({ question }) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{question.question}</h2>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="border rounded px-2 py-1 w-full"
      />
      <button
        onClick={() => setSubmitted(true)}
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Submit
      </button>
      {submitted && (
        <p className="mt-2">
          {answer.toLowerCase() === question.answer.toLowerCase()
            ? "✅ Correct!"
            : "❌ Try again"}
        </p>
      )}
    </div>
  );
}

export default TextInput;
