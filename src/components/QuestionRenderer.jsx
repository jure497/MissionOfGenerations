// QuestionRenderer.jsx
import React, { useState } from "react";
import MultipleChoice from "./questions/MultipleChoice.jsx";
import TextInput from "./questions/TextInput.jsx";
import PictureSelect from "./questions/PictureSelect.jsx";
import FeedbackOverlay from "./FeedbackOverlay.jsx"; 
import Mascot from "./Mascot.jsx"; // 👈 new mascot

export default function QuestionRenderer({ question, onAnswered }) {
  const [feedbackTrigger, setFeedbackTrigger] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mascotMood, setMascotMood] = useState("idle"); // 👈 mood state

  if (!question || !question.type) {
    return <div>Invalid question</div>;
  }

  const type = (question.type || "").toLowerCase().trim();

  const handleAnswered = (isCorrect) => {
    if (isCorrect) {
      setStreak((s) => s + 1);
      setFeedbackTrigger((n) => n + 1);

      if (streak + 1 > 0 && (streak + 1) % 3 === 0) {
        setMascotMood("celebrate"); // 🎉 streak celebration
      } else {
        setMascotMood("happy"); // 😀 normal correct
      }
    } else {
      setStreak(0); 
      setMascotMood("sad"); // 😢 wrong answer
    }

    // reset mascot back to idle after 2s
    setTimeout(() => setMascotMood("idle"), 2000);

    onAnswered(isCorrect);
  };

  return (
    <div className="relative w-full">
      {type === "multiple_choice" && (
        <MultipleChoice question={question} onAnswered={handleAnswered} />
      )}
      {type === "text_input" && (
        <TextInput question={question} onAnswered={handleAnswered} />
      )}
      {type === "picture_select" && (
        <PictureSelect question={question} onAnswered={handleAnswered} />
      )}

      {/* 🎉 Base feedback animations */}
      <FeedbackOverlay trigger={feedbackTrigger} streak={streak} />

      {/* 👾 Mascot helper */}
      <Mascot visible={true} mood={mascotMood} />
    </div>
  );
}
