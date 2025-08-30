// src/hooks/useQuestions.js
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.js";

// helper to turn possible stringified arrays into real arrays (kept for older data)
function parseArrayField(val) {
  if (Array.isArray(val)) return val;
  if (!val && val !== 0) return [];
  if (typeof val === "string") {
    try {
      const p = JSON.parse(val);
      if (Array.isArray(p)) return p;
    } catch {}
    return val.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [val];
}

// normalize one firestore docSnapshot into canonical shape, but keep multilingual objects
function normalizeDoc(docSnap) {
  const data = docSnap.data ? docSnap.data() : docSnap;
  const raw = { ...data };

  // type (supports variants)
  let typeRaw = data.type || data.questionType || data.qtype || "";
  if (Array.isArray(typeRaw)) typeRaw = typeRaw[0];
  if (typeof typeRaw !== "string") typeRaw = String(typeRaw || "");
  const type = typeRaw.trim().toLowerCase().replace(/[-\s]/g, "_");

  // question: allow string or object { en, sl, ... }
  let question = data.question ?? data.prompt ?? data.text ?? data.q ?? "";
  // options: allow array OR object-of-arrays { en: [], sl: [] }
  let options = data.options ?? data.choices ?? data.answers ?? [];
  // If options looks like an object with language keys, keep as-is; else normalize to array
  if (!(options && typeof options === "object" && !Array.isArray(options))) {
    options = parseArrayField(options);
    // try to JSON.parse any stringified option rows
    if (Array.isArray(options)) {
      options = options.map((opt) => {
        if (typeof opt === "string") {
          try {
            const p = JSON.parse(opt);
            return p;
          } catch {}
        }
        return opt;
      });
    }
  }

  // answer: allow string OR object { en, sl, ... }
  let answer = data.answer ?? data.correct ?? null;

  // correctAnswers: allow array, string, or object-of-arrays
  let correctAnswers = data.correctAnswers || data.correct_answers || data.corrects || null;
  if (typeof correctAnswers === "string") {
    try {
      const p = JSON.parse(correctAnswers);
      correctAnswers = Array.isArray(p) ? p : [p];
    } catch {
      correctAnswers = [correctAnswers];
    }
  }

  // roles
  const roles = parseArrayField(data.roles || data.role).map((r) => String(r).toLowerCase());

  return {
    id: docSnap.id ?? data.id ?? null,
    type,
    question,        // string OR { en, sl, ... }
    options,         // array OR { en: [], sl: [] }
    answer,          // string OR { en, sl, ... }
    correctAnswers,  // array OR { en: [], sl: [] }
    roles,
    raw,
  };
}

export default function useQuestions(role) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!role) {
      setQuestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const q = query(collection(db, "questions"), where("roles", "array-contains", role));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const normalized = snapshot.docs.map((d) => normalizeDoc(d));
        setQuestions(normalized);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [role]);

  return { questions, loading, error };
}
