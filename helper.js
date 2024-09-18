// ==UserScript==
// @name         quiz helper
// @namespace    https://github.com/0guanhua0/pmp-quiz-helper
// @version      2.3
// @description  highlight answer
// @author       guanhua
// @match        *://www.ucertify.com/*
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @require      https://raw.githubusercontent.com/0guanhua0/pmp-quiz-helper/main/quiz.js
// ==/UserScript==

(function () {
  "use strict";

  console.log("Script started"); // Check if the script is loaded

  let alreadyRun = false; // Flag to check if the script has already run

  // Function to replace special characters in the question text
  function normalizeText(text) {
    console.log("Normalizing text:", text); // Log the text being normalized
    return text.replace(/’/g, "'"); // Replace special right single quotation mark with regular apostrophe
  }

  // Function to find a quiz key that matches part of the question
  function findMatchingQuizKey(question, quiz) {
    console.log("Looking for matching quiz key in question:", question); // Log question
    for (let key in quiz) {
      if (question.includes(key)) {
        console.log("Found matching key:", key); // Log the matching key
        return key; // Return the matching key if found
      }
    }
    console.log("No matching key found"); // Log when no matching key is found
    return null; // Return null if no match is found
  }

  // Function to highlight correct answers on the page
  function highlightCorrectAnswers(correctAnswers) {
    // Find all labels within the options
    const options = document.querySelectorAll("label.radio_label");

    options.forEach((option) => {
      // Locate the <seq> element inside the label which holds the answer text
      const answerText = option.querySelector(".answer seq").innerText.trim();

      // If the answerText matches any in the correctAnswers array, highlight it
      if (correctAnswers.includes(answerText)) {
        // Add a highlight style (you can customize this as needed)
        option.style.backgroundColor = "#00ff00"; // Or use a class for better styling control
      }
    });
  }

  // Main logic to run quiz helper
  function runQuizLogic() {
    if (alreadyRun) {
      console.log("Script already ran, skipping execution"); // Log if the script has already run
      return;
    }
    alreadyRun = true; // Set flag to true after running

    const questionElement = document.querySelector(
      '[data-itemtype="question"]',
    );
    if (!questionElement) {
      console.log("Question element not found"); // Log if no question element is found
      return;
    }

    let question = questionElement.innerText.trim();
    question = normalizeText(question); // Normalize special characters

    // Find a quiz key that matches part of the question
    const matchingKey = findMatchingQuizKey(question, quiz);
    if (!matchingKey) {
      console.log("No matching question in quiz"); // Log when no matching key is found
      return;
    }

    // Get the correct answers from the quiz
    const correctAnswers = quiz[matchingKey];
    highlightCorrectAnswers(correctAnswers); // Highlight correct answers
  }

  // Observe page changes when clicking "Next" button
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        alreadyRun = false; // Reset flag when new content is added
        console.log("New content loaded, running quiz logic"); // Log when new content is loaded
        runQuizLogic(); // Run the script logic again
      }
    });
  });

  // Run the script when the page is loaded
  window.addEventListener("load", function () {
    console.log("Page loaded, running quiz logic"); // Log when the page loads
    const nextButton = document.getElementById("next");
    if (nextButton) {
      console.log("Next button found, adding event listener"); // Log if the next button is found
      nextButton.addEventListener("click", () => {
        setTimeout(() => {
          console.log("Next button clicked, observing page changes"); // Log next button click
          observer.observe(document.body, { childList: true, subtree: true });
        }, 500); // Delay to allow new content to load
      });
    } else {
      console.log("Next button not found"); // Log if no next button is found
    }
    runQuizLogic(); // Run initially when the page is first loaded
  });
})();
