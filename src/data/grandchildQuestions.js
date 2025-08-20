const grandchildQuestions = [
    {
      id: "gc1",
      type: "multiple-choice",
      question: "Which of these animals can fly?",
      options: ["Dog", "Eagle", "Cat"],
      answer: "Eagle",
    },
    {
      id: "gc2",
      type: "text-input",
      question: "Type the capital of France:",
      answer: "Paris",
    },
    {
      id: "gc3",
      type: "picture-select",
      question: "Which one is a bicycle?",
      options: [
        { src: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png", value: "car" },
        { src: "https://cdn-icons-png.flaticon.com/512/2972/2972187.png", value: "bicycle" },
      ],
      answer: "bicycle",
    },
  ];
  
  export default grandchildQuestions;
  