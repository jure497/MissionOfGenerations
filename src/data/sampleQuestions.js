const sampleQuestions = [
    {
      id: 1,
      type: "multiple-choice",
      question: "What is 2 + 2?",
      options: ["3", "4", "5"],
      answer: "4",
    },
    {
      id: 2,
      type: "text-input",
      question: "Type the capital of France",
      answer: "Paris",
    },
    {
      id: 3,
      type: "picture-select",
      question: "Which one is a cat?",
      options: [
        { image: "https://placekitten.com/100/100", value: "cat" },
        { image: "https://placedog.net/100/100", value: "dog" },
      ],
      answer: "cat",
    },
  ];
  
  export default sampleQuestions;
  