export default [
    {
    id: "1",
    type: "multiple_choice",
    prompt: "Which planet is closest to the Sun?",
    choices: ["Venus", "Mercury", "Earth", "Mars"],
    correctIndex: 1,
    roles: ["grandchild"]
    },
    {
    id: "2",
    type: "text_input",
    prompt: "Type the capital of Slovenia.",
    correctAnswers: ["Ljubljana"],
    roles: ["grandchild"]
    },
    {
    id: "3",
    type: "picture_select",
    prompt: "Which one is an apple?",
    choices: [
    { image: "https://via.placeholder.com/150?text=Banana", label: "Banana" },
    { image: "https://via.placeholder.com/150?text=Apple", label: "Apple" },
    { image: "https://via.placeholder.com/150?text=Orange", label: "Orange" },
    { image: "https://via.placeholder.com/150?text=Pear", label: "Pear" }
    ],
    correctIndex: 1,
    roles: ["grandchild"]
    },
    {
    id: "4",
    type: "multiple_choice",
    prompt: "What year were you born?",
    choices: ["1940s", "1950s", "1960s", "1970s"],
    correctIndex: 2,
    roles: ["grandparent"]
    }
    ];