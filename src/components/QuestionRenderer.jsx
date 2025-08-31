// QuestionRenderer.jsx
import React, { useState } from "react";
import MultipleChoice from "./questions/MultipleChoice.jsx";
import TextInput from "./questions/TextInput.jsx";
import PictureSelect from "./questions/PictureSelect.jsx";
import FeedbackOverlay from "./FeedbackOverlay.jsx";
import Mascot from "./Mascot.jsx";

import ChallengeTask from "./questions/ChallengeTask.jsx";
import SoundChoice from "./questions/SoundChoice.jsx";
import DragDrop from "./questions/DragDrop.jsx";
import RiddleGuess from "./questions/RiddleGuess.jsx";
import SpotDifference from "./questions/SpotDifference.jsx";

export default function QuestionRenderer({ question, onAnswered }) {
  const [feedbackTrigger, setFeedbackTrigger] = useState(0);
  const [streak, setStreak] = useState(0);
  const [mascotMood, setMascotMood] = useState("idle");

  if (!question || !question.type) {
    return <div>Invalid question</div>;
  }

  const type = (question.type || "").toLowerCase().trim();

  // Map aliases to our component keys
  const typeKey = ({
    multiple_choice: "multiple_choice",
    picture_select: "picture_select",
    text_input: "text_input",

    // new + aliases
    challenge_task: "challenge_task",
    challenge: "challenge_task",

    sound_choice: "sound_choice",
    sound_question: "sound_choice",
    audio_choice: "sound_choice",

    drag_drop: "drag_drop",
    drag_and_drop: "drag_drop",

    riddle_guess: "riddle_guess",
    riddle: "riddle_guess",

    spot_difference: "spot_difference",
    find_differences: "spot_difference",
  }[type]) || type;

  const handleAnswered = (isCorrect) => {
    if (isCorrect) {
      setStreak((s) => s + 1);
      setFeedbackTrigger((n) => n + 1);
      setMascotMood((streak + 1) % 3 === 0 ? "celebrate" : "happy");
    } else {
      setStreak(0);
      setMascotMood("sad");
    }
    setTimeout(() => setMascotMood("idle"), 2000);
    onAnswered(isCorrect);
  };

  return (
    <div className="relative w-full">
      {typeKey === "multiple_choice" && (
        <MultipleChoice question={question} onAnswered={handleAnswered} />
      )}
      {typeKey === "text_input" && (
        <TextInput question={question} onAnswered={handleAnswered} />
      )}
      {typeKey === "picture_select" && (
        <PictureSelect question={question} onAnswered={handleAnswered} />
      )}

      {typeKey === "challenge_task" && (
        <ChallengeTask question={question} onAnswered={handleAnswered} />
      )}
      {typeKey === "sound_choice" && (
        <SoundChoice question={question} onAnswered={handleAnswered} />
      )}
      {typeKey === "drag_drop" && (
        <DragDrop question={question} onAnswered={handleAnswered} />
      )}
      {typeKey === "riddle_guess" && (
        <RiddleGuess question={question} onAnswered={handleAnswered} />
      )}
      {typeKey === "spot_difference" && (
        <SpotDifference question={question} onAnswered={handleAnswered} />
      )}

      <FeedbackOverlay trigger={feedbackTrigger} streak={streak} />
      <Mascot visible={true} mood={mascotMood} />
    </div>
  );
}
