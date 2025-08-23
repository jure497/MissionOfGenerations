// AdminDashboard.js
import { useState } from "react";
import { db } from "./firebase"; // Firestore setup
import { collection, addDoc } from "firebase/firestore";

export default function AdminDashboard() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const addQuestion = async () => {
    if (!question || !answer) return;
    await addDoc(collection(db, "questions"), {
      question,
      answer,
      createdAt: new Date()
    });
    setQuestion("");
    setAnswer("");
    alert("Question added!");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Add New Question</h2>
      <input
        type="text"
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="border p-2 block mb-2 w-full"
      />
      <input
        type="text"
        placeholder="Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="border p-2 block mb-2 w-full"
      />
      <button
        onClick={addQuestion}
        className="p-2 bg-green-500 text-white rounded"
      >
        Add Question
      </button>
    </div>
  );
}
