// src/utils/questionUtils.js

// Shuffle array in place
export function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }
  
  // Generate a stable ID from the question text
  export function generateIdForQuestion(question) {
    return btoa(question.question).slice(0, 12); // Base64 short hash
  }
  
  // Get available (not yet used) questions
  export function getAvailableQuestions(allQuestions) {
    const usedIds = JSON.parse(localStorage.getItem("usedQuestions")) || [];
  
    // Add generated IDs
    const withIds = allQuestions.map(q => ({
      ...q,
      id: generateIdForQuestion(q)
    }));
  
    let available = withIds.filter(q => !usedIds.includes(q.id));
  
    if (available.length === 0) {
      // All used → reset
      localStorage.removeItem("usedQuestions");
      available = shuffleArray(withIds);
    } else {
      available = shuffleArray(available);
    }
  
    return available;
  }
  
  // Mark question as used
  export function markQuestionUsed(question) {
    const used = JSON.parse(localStorage.getItem("usedQuestions")) || [];
    const id = generateIdForQuestion(question);
    if (!used.includes(id)) {
      used.push(id);
      localStorage.setItem("usedQuestions", JSON.stringify(used));
    }
  }
  