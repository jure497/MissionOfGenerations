// Mascot.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Mascot({ visible, mood }) {
  // mood = "idle" | "happy" | "sad" | "celebrate"

  const getFace = () => {
    switch (mood) {
      case "happy":
        return "😃";
      case "sad":
        return "😢";
      case "celebrate":
        return "🤩";
      default:
        return "🤖"; // idle robot face
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={mood}
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 40 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 left-6 z-50 flex flex-col items-center"
        >
          <motion.div
            animate={{
              y: [0, -8, 0], // bounce loop
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="text-6xl"
          >
            {getFace()}
          </motion.div>

          {/* Speech bubble */}
          {mood !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
              className="mt-2 bg-white/90 text-gray-800 px-4 py-2 rounded-xl shadow-lg text-sm"
            >
              {mood === "happy" && "Nice job!"}
              {mood === "sad" && "Oops, try again!"}
              {mood === "celebrate" && "Amazing streak! 🎉"}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
