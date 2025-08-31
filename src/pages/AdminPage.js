import React, { useState } from "react";
import { db } from "../firebase.js";
import { collection, addDoc } from "firebase/firestore";

export default function AdminPage() {
  const [question, setQuestion] = useState({ en: "", sl: "" });
  const [type, setType] = useState("multiple_choice");
  const [roles, setRoles] = useState([]);
  const [options, setOptions] = useState({ en: [""], sl: [""] });
  const [answer, setAnswer] = useState({ en: "", sl: "" });
  const [media, setMedia] = useState(""); // for audio or images

  const handleRoleChange = (role) => {
    setRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleAddQuestion = async () => {
    try {
      const newQuestion = {
        question,
        type,
        roles,
        options:
          ["multiple_choice", "picture_select", "sound_choice"].includes(type)
            ? options
            : undefined,
        answer:
          ["text_input", "guessing_game", "find_difference"].includes(type) ||
          type === "sound_choice"
            ? answer
            : undefined,
        media: type === "sound_choice" || type === "find_difference" ? media : undefined,
      };
      await addDoc(collection(db, "questions"), newQuestion);
      alert("Question added!");
      setQuestion({ en: "", sl: "" });
      setOptions({ en: [""], sl: [""] });
      setAnswer({ en: "", sl: "" });
      setRoles([]);
      setMedia("");
    } catch (err) {
      console.error("Error adding question: ", err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Question</h2>

      {/* Question fields */}
      <input
        type="text"
        placeholder="Question (English)"
        value={question.en}
        onChange={(e) => setQuestion({ ...question, en: e.target.value })}
        className="border p-2 w-full mb-2"
      />
      <input
        type="text"
        placeholder="Vprašanje (Slovensko)"
        value={question.sl}
        onChange={(e) => setQuestion({ ...question, sl: e.target.value })}
        className="border p-2 w-full mb-2"
      />

      {/* Type selector */}
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
        <option value="riddle_guess">Guessing Game</option>
        <option value="spot_difference">Find the Difference</option>
      </select>

      {/* Roles */}
      <div className="mb-2">
        <label>
          <input
            type="checkbox"
            checked={roles.includes("grandchild")}
            onChange={() => handleRoleChange("grandchild")}
          />
          Grandchild
        </label>
        <label className="ml-4">
          <input
            type="checkbox"
            checked={roles.includes("grandparent")}
            onChange={() => handleRoleChange("grandparent")}
          />
          Grandparent
        </label>
      </div>

      {/* Options (only for certain types) */}
      {["multiple_choice", "picture_select", "sound_choice"].includes(type) && (
        <>
          <h3 className="font-semibold">Options (English)</h3>
          {options.en.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              value={opt}
              onChange={(e) => {
                const newOpts = [...options.en];
                newOpts[idx] = e.target.value;
                setOptions({ ...options, en: newOpts });
              }}
              placeholder={`Option ${idx + 1} (English)`}
              className="border p-2 w-full mb-2"
            />
          ))}
          <button
            onClick={() => setOptions({ ...options, en: [...options.en, ""] })}
            className="bg-blue-500 text-white px-2 py-1 rounded mb-4"
          >
            Add Option (EN)
          </button>

          <h3 className="font-semibold">Options (Slovenian)</h3>
          {options.sl.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              value={opt}
              onChange={(e) => {
                const newOpts = [...options.sl];
                newOpts[idx] = e.target.value;
                setOptions({ ...options, sl: newOpts });
              }}
              placeholder={`Možnost ${idx + 1} (Slovenščina)`}
              className="border p-2 w-full mb-2"
            />
          ))}
          <button
            onClick={() => setOptions({ ...options, sl: [...options.sl, ""] })}
            className="bg-blue-500 text-white px-2 py-1 rounded mb-4"
          >
            Dodaj možnost (SL)
          </button>
        </>
      )}

      {/* Media field (sound/pictures) */}
      {(type === "sound_choice" || type === "find_difference") && (
        <input
          type="text"
          placeholder="Media URL (audio or image)"
          value={media}
          onChange={(e) => setMedia(e.target.value)}
          className="border p-2 w-full mb-2"
        />
      )}

      {/* Answer (if needed) */}
      {["text_input", "guessing_game", "find_difference", "sound_choice"].includes(type) && (
        <>
          <input
            type="text"
            placeholder="Answer (English)"
            value={answer.en}
            onChange={(e) => setAnswer({ ...answer, en: e.target.value })}
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            placeholder="Odgovor (Slovenščina)"
            value={answer.sl}
            onChange={(e) => setAnswer({ ...answer, sl: e.target.value })}
            className="border p-2 w-full mb-2"
          />
        </>
      )}

      {/* Submit */}
      <button
        onClick={handleAddQuestion}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Question
      </button>
    </div>
  );
}
