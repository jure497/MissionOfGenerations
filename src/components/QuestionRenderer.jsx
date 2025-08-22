import React from "react";
import MultipleChoice from "./questions/MultipleChoice.jsx";
import TextInput from "./questions/TextInput.jsx";
import PictureSelect from "./questions/PictureSelect.jsx";

export default function QuestionRenderer({ question, onAnswered }) {
  if (!question || !question.type) {
    return <div>Invalid question</div>;
  }

  const type = (question.type || "").toLowerCase().trim();

  switch (type) {
    case "multiple_choice":
      return <MultipleChoice question={question} onAnswered={onAnswered} />;

    case "text_input":
      return <TextInput question={question} onAnswered={onAnswered} />;

    case "picture_select":
      return <PictureSelect question={question} onAnswered={onAnswered} />;

    default:
      return (
        <div className="p-3 rounded-lg border bg-yellow-50 border-yellow-300 text-yellow-900">
          ⚠️ Unknown question type: <b>{question.type}</b>
        </div>
      );
  }
}
