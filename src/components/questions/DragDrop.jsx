import React, { useMemo, useState, useEffect } from "react";
import { useLanguage } from "../../LanguageContext";
import { pickByLang } from "../../utils/pickByLang";

export default function DragDrop({ question, onAnswered }) {
  const { lang, t } = useLanguage();

  const text =
    pickByLang(question?.question, lang) ||
    pickByLang(question?.prompt, lang) ||
    "";

  // items: array of strings (ids or image URLs)
  const items = Array.isArray(question?.items) ? question.items : [];
  // categories: [{ name, items: [] }]
  const categories = Array.isArray(question?.categories) ? question.categories : [];

  const initialBins = useMemo(() => {
    const obj = {};
    categories.forEach((c) => (obj[c.name] = []));
    return obj;
  }, [question?.id]);

  const [bins, setBins] = useState(initialBins);

  useEffect(() => {
    setBins(initialBins);
  }, [initialBins, question?.id, lang]);

  const onDragStart = (e, item) => {
    e.dataTransfer.setData("text/plain", item);
  };

  const onDrop = (e, catName) => {
    e.preventDefault();
    const item = e.dataTransfer.getData("text/plain");
    if (!item) return;
    setBins((prev) => {
      // remove from any other bin
      const copy = Object.fromEntries(
        Object.entries(prev).map(([k, arr]) => [k, arr.filter((x) => x !== item)])
      );
      // add to the dropped bin
      copy[catName] = [...copy[catName], item];
      return copy;
    });
  };

  const check = () => {
    // correctness: each category must contain exactly the expected set (order-agnostic)
    const ok = categories.every((c) => {
      const expected = [...(c.items || [])].sort();
      const got = [...(bins[c.name] || [])].sort();
      return JSON.stringify(expected) === JSON.stringify(got);
    });
    onAnswered(ok);
  };

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">{text}</h2>

      <div className="flex flex-wrap gap-3 mb-6">
        {items.map((src, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={(e) => onDragStart(e, src)}
            className="p-2 border rounded-lg bg-white shadow-sm cursor-grab"
            title="Drag me"
          >
            <img src={src} alt={`item-${idx}`} className="w-16 h-16 object-contain" />
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {categories.map((c) => (
          <div
            key={c.name}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, c.name)}
            className="min-h-[8rem] rounded-xl border-2 border-dashed p-3 bg-white"
          >
            <div className="font-semibold mb-2">{c.name}</div>
            <div className="flex flex-wrap gap-2">
              {(bins[c.name] || []).map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`in-${c.name}-${i}`}
                  className="w-12 h-12 object-contain border rounded"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={check}
        className="mt-4 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
      >
        {t?.("check") || "Check"}
      </button>
    </div>
  );
}
