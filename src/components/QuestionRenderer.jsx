import React from "react";
import MultipleChoice from "./questions/MultipleChoice";
import TextInput from "./questions/TextInput";
import PictureSelect from "./questions/PictureSelect";

export default function QuestionRenderer({ question, onNext }) {
  const handleAnswer = (isCorrect) => {
    setTimeout(() => {
      onNext(isCorrect);
    }, 1000); // small delay for feedback
  };

  if (!question) return null;

  switch (question.type) {
    case "multiple-choice":
      return <MultipleChoice question={question} onAnswered={handleAnswer} />;
    case "text-input":
      return <TextInput question={question} onAnswered={handleAnswer} />;
    case "picture-select":
      return <PictureSelect question={question} onAnswered={handleAnswer} />;
    default:
      return <p>Unknown question type</p>;
  }
}
