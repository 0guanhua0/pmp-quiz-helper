// ==UserScript==
// @name         Highlight Correct Answers
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Highlight correct answers and store them in a quiz object
// @author       Your Name
// @match        https://www.ucertify.com/*  // Update the URL to match your site
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  // Function to run when the page has loaded
  function highlightCorrectAnswers() {
    const quiz = {}; // Object to store questions and correct answers

    // Try to locate the question
    const questionElement = document.querySelector(
      '[data-itemtype="question"]',
    );
    if (!questionElement) {
      console.log("Question not found");
      return;
    }

    // Extract the question text
    const question = questionElement.innerText.trim().substring(0, 128);

    // Extract answers and highlight the correct ones
    const answers = [];
    const answerLabels = document.querySelectorAll(".radio_label");
    if (!answerLabels.length) {
      console.log("No answer options found");
      return;
    }

    answerLabels.forEach((label) => {
      const answerText = label.querySelector(".answer").innerText.trim();

      // Check if the answer is correct by aria-checked="true"
      const isCorrect = label.getAttribute("aria-checked") === "true";

      if (isCorrect) {
        // Highlight correct answer with background color #00ff00
        label.style.backgroundColor = "#00ff00";

        // Add the correct answer to the array
        answers.push(answerText);
      }
    });

    // Store the question and correct answers in the quiz object
    quiz[question] = answers;

    // Log the quiz object to the console for debugging
    console.log("Quiz:", quiz);
  }

  // Wait for the DOM content to fully load before running the script
  window.addEventListener("load", function () {
    // Run the function to highlight correct answers
    highlightCorrectAnswers();
  });
})();
