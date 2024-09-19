// ==UserScript==
// @name         quiz helper
// @namespace    https://github.com/0guanhua0/pmp-quiz-helper
// @version      7
// @description  highlight answer
// @author       guanhua
// @match        *://www.ucertify.com/*
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @require      https://raw.githubusercontent.com/0guanhua0/pmp-quiz-helper/main/quiz.js
// ==/UserScript==

(function () {
  "use strict";

  let alreadyRun = false;

  function normalizeText(text) {
    console.log("Normalizing text:", text);

    // Normalize actual special characters
    return text.replace(/’/g, "'").replace(/–/g, "-");
  }

  // Function to find a quiz key that matches part of the question
  function findMatchingQuizKey(question, quiz) {
    console.log("Looking for matching quiz key in question:", question);
    for (let key in quiz) {
      if (question.includes(key)) {
        console.log("Found matching key:", key);
        return key;
      }
    }
    console.log("No matching key found");
    return null;
  }

  // Main logic to run quiz helper
  function runQuizLogic() {
    if (alreadyRun) {
      console.log("Script already ran, skipping execution");
      return;
    }
    alreadyRun = true;

    const questionElement = document.querySelector(
      '[data-itemtype="question"]',
    );
    if (!questionElement) {
      console.log("Question element not found");
      return;
    }

    let question = questionElement.innerText.trim();
    question = normalizeText(question);

    // Find a quiz key that matches part of the question
    const matchingKey = findMatchingQuizKey(question, quiz);
    if (!matchingKey) {
      console.log("No matching question in quiz");
      return;
    }

    const ans = quiz[matchingKey];
    const elements = document.querySelectorAll("#item_answer seq");

    ans.forEach((value) => {
      for (let element of elements) {
        let text = element.innerText.trim();
        text = normalizeText(text);
        if (text.includes(value)) {
          element.style.backgroundColor = "#00ff00";
          console.log("Highlighted smallest matching answer:", value);
          break; // Stop after highlighting the first smallest matching element
        }
      }
    });
  }

  // Observe DOM changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        alreadyRun = false; // Reset the alreadyRun flag
        console.log("New content loaded, running quiz logic");
        runQuizLogic();
      }
    });
  });

  // Start observing the body for DOM changes
  observer.observe(document.body, { childList: true, subtree: true });

  // Run the script when the page is loaded
  window.addEventListener("load", function () {
    console.log("Page loaded, running quiz logic");
    runQuizLogic(); // Initial logic run when the page is first loaded
  });
})();
