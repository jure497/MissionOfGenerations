// src/hooks/useQuestions.js
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.js";

// helper to turn possible stringified arrays into real arrays
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

// normalize one firestore docSnapshot into canonical shape
function normalizeDoc(docSnap) {
  const data = docSnap.data ? docSnap.data() : docSnap;
  const raw = { ...data };

  let typeRaw = data.type || data.questionType || data.qtype || "";
  if (Array.isArray(typeRaw)) typeRaw = typeRaw[0];
  if (typeof typeRaw !== "string") typeRaw = String(typeRaw || "");
  const type = typeRaw.trim().toLowerCase().replace(/[-\s]/g, "_");

  // Question text: store the plain string as fallback; renderer will prefer localized raw.question if present
  let questionText = "";
  if (typeof data.prompt === "string" && data.prompt.trim()) questionText = data.prompt;
  else if (typeof data.question === "string" && data.question.trim()) questionText = data.question;
  else if (typeof data.text === "string" && data.text.trim()) questionText = data.text;
  else if (typeof data.q === "string" && data.q.trim()) questionText = data.q;

  const roles = parseArrayField(data.roles || data.role);

  let options = data.options || data.choices || data.answers || [];
  options = parseArrayField(options);

  let answer = data.answer ?? data.correct ?? null;
  if ((answer === null || answer === undefined) && data.correctIndex !== undefined) {
    const idx = Number(data.correctIndex);
    if (!Number.isNaN(idx) && Array.isArray(options) && options.length > idx) {
      const val = options[idx];
      answer = typeof val === "string" ? val : val?.value || "";
    }
  }

  let correctAnswers = data.correctAnswers || data.correct_answers || data.corrects || null;
  if (typeof correctAnswers === "string") {
    try {
      const p = JSON.parse(correctAnswers);
      correctAnswers = Array.isArray(p) ? p : [p];
    } catch {
      correctAnswers = [correctAnswers];
    }
  }
  if (!correctAnswers && answer != null) {
    correctAnswers = [String(answer)];
  }

  options = options.map((opt) => {
    if (typeof opt === "string") {
      try {
        const p = JSON.parse(opt);
        return p;
      } catch {}
    }
    return opt;
  });

  return {
    id: docSnap.id ?? data.id ?? null,
    type,
    question: questionText, // fallback only; renderer will check raw.question for {en,sl}
    options,
    answer,
    correctAnswers,
    roles: roles.map((r) => String(r).toLowerCase()),
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
