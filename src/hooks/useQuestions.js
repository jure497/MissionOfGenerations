// src/hooks/useQuestions.js
import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.js";

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

function normalizeDoc(docSnap) {
  const data = docSnap.data ? docSnap.data() : docSnap;
  const raw = { ...data };

  // --- TYPE ---
  let typeRaw = data.type || data.questionType || data.qtype || "";
  if (Array.isArray(typeRaw)) typeRaw = typeRaw[0];
  if (typeof typeRaw !== "string") typeRaw = String(typeRaw || "");
  const type = typeRaw.trim().toLowerCase().replace(/[-\s]/g, "_");

  // --- QUESTION / PROMPT ---
  let question =
    data.question ?? data.prompt ?? data.text ?? data.q ?? "";

  // --- OPTIONS ---
  let options = data.options ?? data.choices ?? data.answers ?? [];
  if (!(options && typeof options === "object" && !Array.isArray(options))) {
    options = parseArrayField(options);
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

  // --- ANSWER(S) ---
  // Support: answer, correct, correctAnswer, correctAnswers
  let answer = data.answer ?? data.correct ?? data.correctAnswer ?? null;

  let correctAnswers = data.correctAnswers || data.correct_answers || data.corrects || null;
  if (typeof correctAnswers === "string") {
    try {
      const p = JSON.parse(correctAnswers);
      correctAnswers = Array.isArray(p) ? p : [p];
    } catch {
      correctAnswers = [correctAnswers];
    }
  }
  // If only single correctAnswer provided, fold it into correctAnswers too
  if (!correctAnswers && data.correctAnswer) {
    correctAnswers = [data.correctAnswer];
  }

  // --- ROLES ---
  const roles = parseArrayField(data.roles || data.role).map((r) =>
    String(r).toLowerCase()
  );

  // --- PASS THROUGH ALL EXTRA FIELDS (soundUrl, items, categories, image1, image2, differences, etc.) ---
  const known = new Set([
    "type","questionType","qtype",
    "question","prompt","text","q",
    "options","choices","answers",
    "answer","correct","correctAnswer","correctAnswers","correct_answers","corrects",
    "roles","role"
  ]);
  const extras = {};
  Object.keys(data).forEach((k) => {
    if (!known.has(k)) extras[k] = data[k];
  });

  return {
    id: docSnap.id ?? data.id ?? null,
    type,
    question,
    options,
    answer,
    correctAnswers,
    roles,
    raw,
    ...extras, // expose extra fields directly on the question object
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
