import React, { useState } from "react";
import { db } from "../firebase.js";
import { collection, addDoc } from "firebase/firestore";

export default function AdminPage() {
  const [question, setQuestion] = useState("");
  const [roles, setRoles] = useState(["grandchild"]);
  const [language, setLanguage] = useState("en");
  const [type, setType] = useState("multiple_choice");
  const [answer, setAnswer] = useState("");

  // For multiple choice
  const [options, setOptions] = useState("");

  // For picture-select
  const [pictureOptions, setPictureOptions] = useState([
    { src: "", value: "" },
  ]);

  const [status, setStatus] = useState(null);

  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setRoles([...roles, value]);
    } else {
      setRoles(roles.filter((r) => r !== value));
    }
  };

  const handlePictureOptionChange = (index, field, value) => {
    const newOptions = [...pictureOptions];
    newOptions[index][field] = value;
    setPictureOptions(newOptions);
  };

  const addPictureOption = () => {
    setPictureOptions([...pictureOptions, { src: "", value: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let docData = {
        question,
        type,
        roles,
        language,
        answer,
      };

      if (type === "multiple_choice") {
        docData.options = options.split(",").map((o) => o.trim());
      }

      if (type === "picture-select") {
        docData.options = pictureOptions.map((o) => ({
          src: o.src.trim(),
          value: o.value.trim(),
        }));
      }

      await addDoc(collection(db, "questions"), docData);

      setStatus("✅ Question saved!");
      setQuestion("");
      setAnswer("");
      setOptions("");
      setPictureOptions([{ src: "", value: "" }]);
    } catch (err) {
      console.error("Error adding document: ", err);
      setStatus("❌ Error saving question");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 p-6">
      <div className="bg-white/90 rounded-2xl shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Admin – Add Question</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Roles */}
          <div>
            <label className="block font-medium">Roles</label>
            <div className="flex gap-4">
              <label>
                <input
                  type="checkbox"
                  value="grandchild"
                  checked={roles.includes("grandchild")}
                  onChange={handleRoleChange}
                />
                Grandchild
              </label>
              <label>
                <input
                  type="checkbox"
                  value="grandparent"
                  checked={roles.includes("grandparent")}
                  onChange={handleRoleChange}
                />
                Grandparent
              </label>
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block font-medium">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="en">English</option>
              <option value="sl">Slovenian</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block font-medium">Question Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="multiple_choice">Multiple Choice</option>
              <option value="text_input">Text Input</option>
              <option value="picture-select">Picture Select</option>
            </select>
          </div>

          {/* Question */}
          <div>
            <label className="block font-medium">Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Answer */}
          <div>
            <label className="block font-medium">Correct Answer</label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Options (multiple choice only) */}
          {type === "multiple_choice" && (
            <div>
              <label className="block font-medium">
                Options (comma separated)
              </label>
              <input
                type="text"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="e.g. Dog, Eagle, Cat"
              />
            </div>
          )}

          {/* Picture Select */}
          {type === "picture-select" && (
            <div>
              <label className="block font-medium">Picture Options</label>
              {pictureOptions.map((opt, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={opt.src}
                    onChange={(e) =>
                      handlePictureOptionChange(index, "src", e.target.value)
                    }
                    className="w-1/2 border rounded p-2"
                    placeholder="Image URL"
                  />
                  <input
                    type="text"
                    value={opt.value}
                    onChange={(e) =>
                      handlePictureOptionChange(index, "value", e.target.value)
                    }
                    className="w-1/2 border rounded p-2"
                    placeholder="Value (e.g. bicycle)"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addPictureOption}
                className="px-3 py-1 mt-2 bg-blue-500 text-white rounded"
              >
                + Add Option
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
          >
            Save Question
          </button>
        </form>

        {status && <p className="mt-4 text-center">{status}</p>}
      </div>
    </div>
  );
}
