import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const chooseRole = (role) => {
    navigate(`/quiz?role=${role}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Mission of Generations</h1>
      <p className="mb-6">Choose who you are to begin:</p>
      <div className="flex gap-4">
        <button
          onClick={() => chooseRole("grandchild")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          👦 Grandchild
        </button>
        <button
          onClick={() => chooseRole("grandparent")}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          👴 Grandparent
        </button>
      </div>
    </div>
  );
}
