// FeedbackOverlay.jsx
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { AnimatePresence, motion } from "framer-motion";

/**
 * trigger: can be:
 * - boolean true/false
 * - "success" | "encourage" | "neutral"
 * - or an object: { key: <unique>, isCorrect: true|false|null|"encourage"|"success" }
 *
 * streak: number (used only to show streak milestone messages/confetti)
 */

export default function FeedbackOverlay({ trigger, streak }) {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState(null); // "correct" | "wrong" | null
  const [confettiPieces, setConfettiPieces] = useState(0);
  const [emojis, setEmojis] = useState([]);
  const [streakMessage, setStreakMessage] = useState(null);

  // normalize trigger value to one of: true, false, null, "encourage", "success", "neutral"
  const normalizeTrigger = (t) => {
    if (t == null) return null;
    if (typeof t === "object" && t !== null && "isCorrect" in t) return t.isCorrect;
    return t;
  };

  useEffect(() => {
    if (!trigger) {
      setVisible(false);
      setMode(null);
      return;
    }

    const val = normalizeTrigger(trigger);

    // Ignore neutral or encourage completely (App handles those)
    if (val === null || val === "neutral" || val === "encourage") {
      setVisible(false);
      setMode(null);
      return;
    }

    // set mode based on normalized value
    if (val === true || val === "success") {
      setMode("correct");
    } else if (val === false) {
      setMode("wrong");
    } else {
      setMode(null);
      setVisible(false);
      return;
    }

    setVisible(true);

    let doConfetti = false;
    let newEmoji = null;
    let newMessage = null;
    let doEmoji = false;

    if (val === true || val === "success") {
      doConfetti = streak >= 5 ? true : Math.random() < 0.35;
      doEmoji = Math.random() < 0.8;
      
      // 🌟 Streak bonuses
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

      // 🎲 Normal random emojis
      if (!newEmoji && doEmoji) {
        const emojiList = ["🎉", "🌟", "🔥", "💯", "😺", "🎯", "👏", "🚀"];
        newEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];
      }

      if (doConfetti) {
        setConfettiPieces(streak >= 5 ? 400 : 200);
        setTimeout(() => setConfettiPieces(0), 2000);
      } else {
        setConfettiPieces(0);
      }

      if (newEmoji) {
        setEmojis([{ id: Date.now(), symbol: newEmoji }]);
      }
      
      if (newMessage) {
        setStreakMessage({ id: Date.now(), text: newMessage });
      }

    } else { // Handle wrong answer case
      setConfettiPieces(0);
      setEmojis([]);
      setStreakMessage(null);
    }
    
    // hide overlay after short timeout
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setEmojis([]);
      setStreakMessage(null);
    }, 1500);

    return () => clearTimeout(hideTimer);
  }, [trigger, streak]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Confetti */}
      <Confetti
        width={typeof window !== "undefined" ? window.innerWidth : 800}
        height={typeof window !== "undefined" ? window.innerHeight : 600}
        recycle={false}
        numberOfPieces={confettiPieces}
        gravity={0.25}
      />

      {/* Floating Emojis */}
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
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute text-6xl"
          >
            {e.symbol}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Streak milestone banner */}
      <AnimatePresence>
        {streakMessage && (
          <motion.div
            key={streakMessage.id}
            initial={{ opacity: 0, y: -40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
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

      {/* Bottom-center feedback box (Correct / Not quite) */}
      <div className="absolute inset-0 flex items-end justify-center pb-28 pointer-events-none">
        <AnimatePresence>
          {visible && mode && (
            <motion.div
              key={`feedback-${mode}-${String(trigger && trigger.key ? trigger.key : Date.now())}`}
              initial={{ opacity: 0, y: 28, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 28, scale: 0.92 }}
              transition={{ duration: 0.32, ease: "easeInOut" }}
              className={`px-6 py-3 rounded-2xl shadow-lg text-lg font-semibold pointer-events-none
                ${mode === "correct" ? "bg-green-500 text-white" : ""}
                ${mode === "wrong" ? "bg-red-500 text-white" : ""}
              `}
            >
              {mode === "correct" && "🎉 Correct!"}
              {mode === "wrong" && "❌ Not quite"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}