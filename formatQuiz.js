const fs = require("fs");
const path = require("path");

const MAX_LEN = 128;

// Function to truncate and trim a string to MAX_LEN characters
function truncateAndTrim(str) {
  return str.trim().slice(0, MAX_LEN);
}

// Function to sort and format the quiz
function formatQuiz(quiz) {
  const sortedQuiz = {};

  // Sort keys alphabetically, trim, and truncate them
  const sortedKeys = Object.keys(quiz).map(truncateAndTrim).sort();

  // Process each key-value pair
  sortedKeys.forEach((key) => {
    // Sort, trim, and truncate the array of values
    let values = quiz[key].map(truncateAndTrim).sort();

    // Add sorted key-value pair to the result
    sortedQuiz[key] = values;
  });

  return sortedQuiz;
}

// Read and format quiz.js file
const filePath = path.join(__dirname, "quiz.js");
fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  // Remove the `quiz =` part and convert the file content into a valid JavaScript object using eval
  let quiz;
  try {
    // Extract and evaluate the quiz object (quiz = {...})
    const quizCode = data
      .replace(/^quiz\s*=\s*/, "")
      .trim()
      .replace(/;$/, ""); // Clean up the syntax
    quiz = eval(`(${quizCode})`); // Safely evaluate the JavaScript object
  } catch (error) {
    console.error("Error parsing quiz object:", error);
    return;
  }

  // Format the quiz
  const formattedQuiz = formatQuiz(quiz);

  // Write the formatted quiz back to the file as JSON-like JS code
  const formattedQuizString = `quiz = ${JSON.stringify(formattedQuiz, null, 2)};`;
  fs.writeFile(filePath, formattedQuizString, "utf8", (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }

    console.log("quiz.js has been formatted, sorted, trimmed, and truncated.");
  });
});
