// src/pages/AdminPage.js
import React, { useState } from "react";
import { db } from "../firebase.js";
import { collection, addDoc } from "firebase/firestore";

export default function AdminPage() {
  // Basic
  const [question, setQuestion] = useState({ en: "", sl: "" });
  const [type, setType] = useState("multiple_choice");
  const [roles, setRoles] = useState([]);

  // Multiple / Sound options (strings)
  const [options, setOptions] = useState({ en: [""], sl: [""] });

  // Picture select: arrays of { src, value }
  const [picOptions, setPicOptions] = useState({
    en: [{ src: "", value: "" }],
    sl: [{ src: "", value: "" }],
  });

  // Sound / media (audio url) and general answer object
  const [media, setMedia] = useState("");
  const [answer, setAnswer] = useState({ en: "", sl: "" });

  // Drag & Drop schema requested: items + categories
  const [ddItems, setDdItems] = useState([""]);
  const [categories, setCategories] = useState([{ name: "", items: [""] }]);

  // Spot the difference
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [differences, setDifferences] = useState([""]);

  const handleRoleChange = (role) => {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  // Add document to Firestore with the correct shape depending on type
  const handleAddQuestion = async () => {
    try {
      const base = {
        question,
        type,
        roles,
      };

      let doc = { ...base };

      // Multiple-choice / sound_choice / generic options (as object-of-arrays)
      if (type === "multiple_choice" || type === "sound_choice") {
        doc.options = options;
      }

      // Picture-select expects options object with arrays of { src, value }
      if (type === "picture_select") {
        doc.options = picOptions;
      }

      // Sound: store media field (audio url)
      if (type === "sound_choice") {
        doc.media = media;
        // also set answer as localized correct answer
        doc.answer = answer;
      }

      // Text input & riddle (guessing) store answer
      if (type === "text_input" || type === "riddle_guess" || type === "challenge_task") {
        // challenge_task may not require answer, but allow if provided
        if (answer.en || answer.sl) doc.answer = answer;
      }

      // Drag & Drop: EXACT schema requested:
      // items: array of item URLs (strings)
      // categories: [ { name: "...", items: [ ... ] }, ... ]
      if (type === "drag_drop") {
        const itemsClean = ddItems.map((s) => (s || "")).filter(Boolean);
        const catsClean = categories.map((c) => ({
          name: (c.name || "").trim(),
          items: (c.items || []).map((it) => it || "").filter(Boolean),
        })).filter(c => c.name || c.items.length); // drop empty
        doc.items = itemsClean;
        doc.categories = catsClean;
        if (answer.en || answer.sl) doc.answer = answer;
      }

      // Spot the difference:
      if (type === "spot_difference") {
        doc.image1 = image1;
        doc.image2 = image2;
        doc.differences = differences.map((d) => d || "").filter(Boolean);
        if (answer.en || answer.sl) doc.answer = answer;
      }

      // Finally write the doc
      await addDoc(collection(db, "questions"), doc);
      alert("Question added!");

      // reset form state
      setQuestion({ en: "", sl: "" });
      setType("multiple_choice");
      setRoles([]);
      setOptions({ en: [""], sl: [""] });
      setPicOptions({ en: [{ src: "", value: "" }], sl: [{ src: "", value: "" }] });
      setMedia("");
      setAnswer({ en: "", sl: "" });
      setDdItems([""]);
      setCategories([{ name: "", items: [""] }]);
      setImage1("");
      setImage2("");
      setDifferences([""]);
    } catch (err) {
      console.error("Error adding question: ", err);
      alert("Failed to add question: " + (err.message || err));
    }
  };

  // Helpers to update nested structures (small UI helpers)
  const updateOption = (lang, idx, val) => {
    const newOpts = [...options[lang]];
    newOpts[idx] = val;
    setOptions({ ...options, [lang]: newOpts });
  };
  const addOption = (lang) => setOptions({ ...options, [lang]: [...options[lang], ""] });
  const removeOption = (lang, idx) => {
    const arr = options[lang].filter((_, i) => i !== idx);
    setOptions({ ...options, [lang]: arr.length ? arr : [""] });
  };

  const updatePicOption = (lang, idx, field, val) => {
    const arr = [...picOptions[lang]];
    arr[idx] = { ...arr[idx], [field]: val };
    setPicOptions({ ...picOptions, [lang]: arr });
  };
  const addPicOption = (lang) => setPicOptions({ ...picOptions, [lang]: [...picOptions[lang], { src: "", value: "" }] });
  const removePicOption = (lang, idx) => {
    const arr = picOptions[lang].filter((_, i) => i !== idx);
    setPicOptions({ ...picOptions, [lang]: arr.length ? arr : [{ src: "", value: "" }] });
  };

  // Drag & Drop helpers
  const updateDdItem = (idx, val) => {
    const arr = [...ddItems];
    arr[idx] = val;
    setDdItems(arr);
  };
  const addDdItem = () => setDdItems([...ddItems, ""]);
  const removeDdItem = (idx) => {
    const arr = ddItems.filter((_, i) => i !== idx);
    setDdItems(arr.length ? arr : [""]);
    // also remove from categories items references (best effort)
    setCategories((prev) =>
      prev.map((c) => ({ ...c, items: c.items.filter((it) => it !== ddItems[idx]) }))
    );
  };

  const updateCategory = (catIdx, field, val) => {
    const arr = [...categories];
    arr[catIdx] = { ...arr[catIdx], [field]: val };
    setCategories(arr);
  };
  const updateCategoryItem = (catIdx, itemIdx, val) => {
    const arr = categories.map((c) => ({ ...c }));
    arr[catIdx].items[itemIdx] = val;
    setCategories(arr);
  };
  const addCategory = () => setCategories([...categories, { name: "", items: [""] }]);
  const removeCategory = (idx) => {
    const arr = categories.filter((_, i) => i !== idx);
    setCategories(arr.length ? arr : [{ name: "", items: [""] }]);
  };
  const addCategoryItem = (catIdx) => {
    const arr = [...categories];
    arr[catIdx].items = [...(arr[catIdx].items || []), ""];
    setCategories(arr);
  };
  const removeCategoryItem = (catIdx, itemIdx) => {
    const arr = categories.map((c) => ({ ...c }));
    arr[catIdx].items = arr[catIdx].items.filter((_, i) => i !== itemIdx);
    if (!arr[catIdx].items.length) arr[catIdx].items = [""];
    setCategories(arr);
  };

  // Differences helpers
  const updateDifference = (idx, val) => {
    const arr = [...differences];
    arr[idx] = val;
    setDifferences(arr);
  };
  const addDifference = () => setDifferences([...differences, ""]);
  const removeDifference = (idx) => {
    const arr = differences.filter((_, i) => i !== idx);
    setDifferences(arr.length ? arr : [""]);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Add New Question</h2>

      <div>
        <label className="block font-medium">Question (EN)</label>
        <input
          type="text"
          value={question.en}
          onChange={(e) => setQuestion({ ...question, en: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <label className="block font-medium">Question (SL)</label>
        <input
          type="text"
          value={question.sl}
          onChange={(e) => setQuestion({ ...question, sl: e.target.value })}
          className="border p-2 w-full mb-2"
        />
      </div>

      <div>
        <label className="block font-medium">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 w-full mb-2"
        >
          <option value="multiple_choice">Multiple Choice</option>
          <option value="text_input">Text Input</option>
          <option value="picture_select">Picture Select</option>
          <option value="challenge_task">Challenge Task</option>
          <option value="sound_choice">Sound Choice</option>
          <option value="drag_drop">Drag & Drop</option>
          <option value="riddle_guess">Guessing Game (Riddle)</option>
          <option value="spot_difference">Find the Difference</option>
        </select>
      </div>

      <div>
        <label className="block font-medium">Roles</label>
        <div className="flex gap-4 mt-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={roles.includes("grandchild")} onChange={() => handleRoleChange("grandchild")} />
            Grandchild
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={roles.includes("grandparent")} onChange={() => handleRoleChange("grandparent")} />
            Grandparent
          </label>
        </div>
      </div>

      {/* Multiple / Sound options */}
      {["multiple_choice", "sound_choice"].includes(type) && (
        <div className="mt-3">
          <h3 className="font-semibold">Options (EN)</h3>
          {options.en.map((opt, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                className="border p-2 flex-1"
                value={opt}
                onChange={(e) => updateOption("en", idx, e.target.value)}
                placeholder={`Option ${idx + 1} (EN)`}
              />
              <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => removeOption("en", idx)}>Remove</button>
            </div>
          ))}
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => addOption("en")}>Add Option (EN)</button>

          <h3 className="font-semibold mt-3">Options (SL)</h3>
          {options.sl.map((opt, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                className="border p-2 flex-1"
                value={opt}
                onChange={(e) => updateOption("sl", idx, e.target.value)}
                placeholder={`Option ${idx + 1} (SL)`}
              />
              <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => removeOption("sl", idx)}>Remove</button>
            </div>
          ))}
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => addOption("sl")}>Add Option (SL)</button>
        </div>
      )}

      {/* Picture select */}
      {type === "picture_select" && (
        <div className="mt-3">
          <h3 className="font-semibold">Picture Options (EN)</h3>
          {picOptions.en.map((o, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input className="border p-2 flex-1" placeholder="Image src" value={o.src} onChange={(e) => updatePicOption("en", idx, "src", e.target.value)} />
              <input className="border p-2 w-40" placeholder="value" value={o.value} onChange={(e) => updatePicOption("en", idx, "value", e.target.value)} />
              <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => removePicOption("en", idx)}>Remove</button>
            </div>
          ))}
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => addPicOption("en")}>Add Pic Option (EN)</button>

          <h3 className="font-semibold mt-3">Picture Options (SL)</h3>
          {picOptions.sl.map((o, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input className="border p-2 flex-1" placeholder="Image src" value={o.src} onChange={(e) => updatePicOption("sl", idx, "src", e.target.value)} />
              <input className="border p-2 w-40" placeholder="value" value={o.value} onChange={(e) => updatePicOption("sl", idx, "value", e.target.value)} />
              <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => removePicOption("sl", idx)}>Remove</button>
            </div>
          ))}
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={() => addPicOption("sl")}>Add Pic Option (SL)</button>
        </div>
      )}

      {/* Media (sound) */}
      {type === "sound_choice" && (
        <div className="mt-3">
          <label className="block font-medium">Audio URL</label>
          <input className="border p-2 w-full mb-2" value={media} onChange={(e) => setMedia(e.target.value)} placeholder="/sounds/dog.mp3 or https://..." />
        </div>
      )}

      {/* Drag & Drop */}
      {type === "drag_drop" && (
        <div className="mt-3">
          <h3 className="font-semibold">Items (image URLs)</h3>
          {ddItems.map((it, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input className="border p-2 flex-1" value={it} onChange={(e) => updateDdItem(idx, e.target.value)} placeholder={`Item ${idx + 1} (image URL)`} />
              <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => removeDdItem(idx)}>Remove</button>
            </div>
          ))}
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={addDdItem}>Add Item</button>

          <h3 className="font-semibold mt-4">Categories</h3>
          {categories.map((cat, cIdx) => (
            <div key={cIdx} className="border rounded p-3 mb-3">
              <div className="flex gap-2 items-center mb-2">
                <input className="border p-2 flex-1" value={cat.name} onChange={(e) => updateCategory(cIdx, "name", e.target.value)} placeholder="Category name (e.g. Green)" />
                <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => removeCategory(cIdx)}>Remove Category</button>
              </div>

              <div className="ml-2">
                <p className="text-sm font-medium mb-2">Category items (image URLs)</p>
                {cat.items.map((it, iIdx) => (
                  <div key={iIdx} className="flex gap-2 mb-2">
                    <input className="border p-2 flex-1" value={it} onChange={(e) => updateCategoryItem(cIdx, iIdx, e.target.value)} placeholder={`Item ${iIdx + 1} URL`} />
                    <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => removeCategoryItem(cIdx, iIdx)}>Remove</button>
                  </div>
                ))}
                <button className="px-2 py-1 bg-blue-600 text-white rounded" onClick={() => addCategoryItem(cIdx)}>Add Category Item</button>
              </div>
            </div>
          ))}
          <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={addCategory}>Add Category</button>

          <div className="mt-3">
            <label className="block font-medium">Answer Summary (optional)</label>
            <input className="border p-2 w-full mb-2" placeholder="Answer (EN)" value={answer.en} onChange={(e) => setAnswer({ ...answer, en: e.target.value })} />
            <input className="border p-2 w-full mb-2" placeholder="Answer (SL)" value={answer.sl} onChange={(e) => setAnswer({ ...answer, sl: e.target.value })} />
          </div>
        </div>
      )}

      {/* Spot the difference */}
      {type === "spot_difference" && (
        <div className="mt-3">
          <h3 className="font-semibold">Images</h3>
          <input className="border p-2 w-full mb-2" placeholder="Image 1 URL" value={image1} onChange={(e) => setImage1(e.target.value)} />
          <input className="border p-2 w-full mb-2" placeholder="Image 2 URL" value={image2} onChange={(e) => setImage2(e.target.value)} />

          <h3 className="font-semibold mt-3">Differences</h3>
          {differences.map((d, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input className="border p-2 flex-1" value={d} onChange={(e) => updateDifference(idx, e.target.value)} placeholder={`Difference ${idx + 1}`} />
              <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => removeDifference(idx)}>Remove</button>
            </div>
          ))}
          <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={addDifference}>Add Difference</button>

          <h3 className="font-semibold mt-3">Answer Summary</h3>
          <input className="border p-2 w-full mb-2" placeholder="Answer (EN)" value={answer.en} onChange={(e) => setAnswer({ ...answer, en: e.target.value })} />
          <input className="border p-2 w-full mb-2" placeholder="Answer (SL)" value={answer.sl} onChange={(e) => setAnswer({ ...answer, sl: e.target.value })} />
        </div>
      )}

      {/* Generic answer fields (for riddle, text input, sound correct answer etc.) */}
      {["text_input", "riddle_guess"].includes(type) && (
        <div className="mt-3">
          <label className="block font-medium">Correct Answer (EN)</label>
          <input className="border p-2 w-full mb-2" value={answer.en} onChange={(e) => setAnswer({ ...answer, en: e.target.value })} />
          <label className="block font-medium">Correct Answer (SL)</label>
          <input className="border p-2 w-full mb-2" value={answer.sl} onChange={(e) => setAnswer({ ...answer, sl: e.target.value })} />
        </div>
      )}

      <div className="mt-6">
        <button onClick={handleAddQuestion} className="bg-indigo-600 text-white px-4 py-2 rounded">
          Add Question
        </button>
      </div>
    </div>
  );
}
