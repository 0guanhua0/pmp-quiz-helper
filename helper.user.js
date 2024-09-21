// ==UserScript==
// @name         quiz helper
// @namespace    https://github.com/0guanhua0/pmp-quiz-helper
// @version      1.0
// @description  quiz helper for ucertify Project Management Professional (PMP)
// @author       guanhua
// @match        *://www.ucertify.com/*
// @grant        GM_notification
// @require      https://raw.githubusercontent.com/0guanhua0/pmp-quiz-helper/main/quiz.js
// ==/UserScript==

(function () {
  "use strict";

  let alreadyRun = false;

  function normalizeText(text) {
    console.log("Normalizing text:", text);
    return text.replace(/’/g, "'").replace(/–/g, "-");
  }

  // find a quiz key that matches part of the question
  function matchKey(question, quiz) {
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
  function runHelper() {
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
    const matchingKey = matchKey(question, quiz);
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
        if (text === value) {
          element.style.backgroundColor = "#00ff00";
          console.log("Highlight answer:", value);
          break;
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
        runHelper();
      }
    });
  });

  // Start observing the body for DOM changes
  observer.observe(document.body, { childList: true, subtree: true });

  // Run the script when the page is loaded
  window.addEventListener("load", function () {
    console.log("Page loaded, running quiz logic");
    runHelper();
  });
})();
