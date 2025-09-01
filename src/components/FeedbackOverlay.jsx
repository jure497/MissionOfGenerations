import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { AnimatePresence, motion } from "framer-motion";

export default function FeedbackOverlay({ trigger, streak }) {
  const [confettiPieces, setConfettiPieces] = useState(0);
  const [emojis, setEmojis] = useState([]);
  const [streakMessage, setStreakMessage] = useState(null);

  useEffect(() => {
    if (!trigger) return;

    // Normalize in case trigger is boolean/null accidentally
    const isCorrect =
      typeof trigger === "object" && trigger !== null && "isCorrect" in trigger
        ? trigger.isCorrect
        : trigger;

    // 🟢 Ignore neutral
    if (isCorrect === null) {
      setConfettiPieces(0);
      setEmojis([]);
      setStreakMessage(null);
      return;
    }

    if (isCorrect === false) {
      // ❌ Wrong answer → clear everything
      setConfettiPieces(0);
      setEmojis([]);
      setStreakMessage(null);
      return;
    }

    // ✅ Correct answer
    let doConfetti = Math.random() < 0.4;
    let doEmoji = Math.random() < 0.6;
    let newEmoji = null;
    let newMessage = null;

    if (streak === 3) {
      newEmoji = "🔥";
      newMessage = "🔥 Amazing! 3 in a row!";
      doEmoji = true;
    }
    if (streak === 5) {
      newEmoji = "🏆";
      newMessage = "🏆 Incredible! 5 correct in a row!";
      doConfetti = true;
      doEmoji = true;
    }
    if (streak === 10) {
      newEmoji = "👑";
      newMessage = "👑 Unstoppable! 10 streak!";
      doConfetti = true;
      doEmoji = true;
    }

    if (!newEmoji && doEmoji) {
      const emojiList = ["🎉", "🌟", "🔥", "💯", "😺", "🎯", "👏", "🚀"];
      newEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];
    }

    if (doConfetti) {
      setConfettiPieces(streak >= 5 ? 400 : 200);
      setTimeout(() => setConfettiPieces(0), 1500);
    }

    if (newEmoji) setEmojis([{ id: Date.now(), symbol: newEmoji }]);
    if (newMessage) setStreakMessage({ id: Date.now(), text: newMessage });

    const timer = setTimeout(() => {
      setEmojis([]);
      setStreakMessage(null);
    }, 1200);

    return () => clearTimeout(timer);
  }, [trigger, streak]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={confettiPieces}
        gravity={0.25}
      />

      <AnimatePresence>
        {emojis.map((e) => (
          <motion.div
            key={e.id}
            initial={{
              opacity: 0,
              y: window.innerHeight - 100,
              x: Math.random() * window.innerWidth,
              scale: 0.6,
              rotate: -30 + Math.random() * 60,
            }}
            animate={{
              opacity: 1,
              y: window.innerHeight / 2 - 300,
              scale: 1.4,
              rotate: 0,
            }}
            exit={{ opacity: 0, y: -200 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute text-6xl"
          >
            {e.symbol}
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {streakMessage && (
          <motion.div
            key={streakMessage.id}
            initial={{ opacity: 0, y: -40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="fixed top-8 left-1/2 transform -translate-x-1/2 
                       bg-white/20 backdrop-blur-md px-6 py-3 
                       rounded-2xl shadow-lg text-center"
          >
            <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent drop-shadow-md">
              {streakMessage.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
