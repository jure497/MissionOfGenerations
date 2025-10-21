import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);
  const [mascotMood, setMascotMood] = useState("idle");

  if (!question || !question.type) {
    return <div>Invalid question</div>;
  }

  // 🔊 helper to play short sounds
  const playSound = (file) => {
    const audio = new Audio(file);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };

  const type = (question.type || "").toLowerCase().trim();

  const typeKey =
    ({
      multiple_choice: "multiple_choice",
      picture_select: "picture_select",
      text_input: "text_input",

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

  const handleAnswered = (result) => {
    let isCorrect = result;
    if (typeof result === "object" && result !== null && "isCorrect" in result) {
      isCorrect = result.isCorrect;
    }

    const nowKey = Date.now();

    if (isCorrect === true) {
      setStreak((s) => s + 1);
      setFeedback({ key: nowKey, isCorrect: true });
      setMascotMood((prev) => ((streak + 1) % 3 === 0 ? "celebrate" : "happy"));
      playSound("/sounds/correct.mp3");
      setTimeout(() => setMascotMood("idle"), 2000);
    } else if (isCorrect === false) {
      setStreak(0);
      setFeedback({ key: nowKey, isCorrect: false });
      setMascotMood("sad");
      // Play incorrect sound at full volume
      const incorrectAudio = new Audio("/sounds/incorrect.mp3");
      incorrectAudio.volume = 1.0;
      incorrectAudio.play().catch(() => {});
      setTimeout(() => setMascotMood("idle"), 2000);
    } else {
      setFeedback({ key: nowKey, isCorrect: null });
      setMascotMood("idle");
    }

    onAnswered(isCorrect);
  };

  const renderQuestion = () => {
    switch (typeKey) {
      case "multiple_choice":
        return <MultipleChoice question={question} onAnswered={handleAnswered} />;
      case "text_input":
        return <TextInput question={question} onAnswered={handleAnswered} />;
      case "picture_select":
        return <PictureSelect question={question} onAnswered={handleAnswered} />;
      case "challenge_task":
        return <ChallengeTask question={question} onAnswered={handleAnswered} />;
      case "sound_choice":
        return <SoundChoice question={question} onAnswered={handleAnswered} />;
      case "drag_drop":
        return <DragDrop question={question} onAnswered={handleAnswered} />;
      case "riddle_guess":
        return <RiddleGuess question={question} onAnswered={handleAnswered} />;
      case "spot_difference":
        return <SpotDifference question={question} onAnswered={handleAnswered} />;
      default:
        return <div>Unknown question type</div>;
    }
  };

  return (
    <div className="relative w-full min-h-[200px] flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          className="w-full" // ⬅️ removed absolute, let content define height
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {renderQuestion()}
        </motion.div>
      </AnimatePresence>

      {/* Feedback stays on top without affecting layout */}
      <div className="absolute inset-0 pointer-events-none flex items-start justify-center">
        <FeedbackOverlay trigger={feedback} streak={streak} />
      </div>

      <Mascot visible={false} mood={mascotMood} />
    </div>
  );
}
