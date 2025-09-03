// FeedbackOverlay.jsx
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { AnimatePresence, motion } from "framer-motion";

/**
 * trigger: can be:
 *  - boolean true/false
 *  - "success" | "encourage" | "neutral"
 *  - or an object: { key: <unique>, isCorrect: true|false|null|"encourage"|"success" }
 *
 * streak: number (used only to show streak milestone messages/confetti)
 */

export default function FeedbackOverlay({ trigger, streak }) {
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState(null); // "correct" | "wrong" | null
  const [confettiPieces, setConfettiPieces] = useState(0);
  const [emojiBurst, setEmojiBurst] = useState([]); // particles for star/emoji burst
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

    // emoji burst only for correct
    if (val === true || val === "success") {
      const emojis = ["⭐️", "✨", "🌟", "🎉"];
      const burst = Array.from({ length: 10 }).map(() => ({
        id: Math.random().toString(36).slice(2),
        symbol: emojis[Math.floor(Math.random() * emojis.length)],
        x: Math.random() * 340 - 170,
        y: Math.random() * 180 - 90,
        rotate: -30 + Math.random() * 60,
        scale: 0.8 + Math.random() * 0.8,
      }));
      setEmojiBurst(burst);
    } else {
      setEmojiBurst([]);
    }

    // confetti: random chance, but always when big streaks (>=5)
    if (val === true || val === "success") {
      const doConfetti = streak >= 5 ? true : Math.random() < 0.35;
      if (doConfetti) {
        setConfettiPieces(streak >= 10 ? 500 : 220);
        setTimeout(() => setConfettiPieces(0), 1400);
      } else {
        setConfettiPieces(0);
      }
    } else {
      setConfettiPieces(0);
    }

    // streak message for milestone (3,5,10)
    if (val === true || val === "success") {
      if (streak === 3) setStreakMessage("🔥 Amazing! 3 in a row!");
      else if (streak === 5) setStreakMessage("🏆 Incredible! 5 correct in a row!");
      else if (streak === 10) setStreakMessage("👑 Unstoppable! 10 streak!");
      else setStreakMessage(null);
    } else {
      setStreakMessage(null);
    }

    // hide overlay after short timeout
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setEmojiBurst([]);
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

      {/* Floating emoji burst */}
      <AnimatePresence>
        {emojiBurst.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, x: 0, y: 0, scale: p.scale, rotate: p.rotate }}
            animate={{ opacity: 0, x: p.x, y: p.y - 80, scale: p.scale + 0.6, rotate: p.rotate }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 text-3xl select-none"
            style={{ transform: "translate(-50%,-50%)" }}
          >
            {p.symbol}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Streak milestone banner */}
      <AnimatePresence>
        {streakMessage && (
          <motion.div
            key={`streakMsg-${streakMessage}`}
            initial={{ opacity: 0, y: -24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg pointer-events-none"
          >
            <div className="text-center text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">
              {streakMessage}
            </div>
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
