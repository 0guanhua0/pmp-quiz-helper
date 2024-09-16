// ==UserScript==
// @name         quiz helper
// @namespace    https://github.com/0guanhua0/pmp-quiz-helper
// @version      1.1
// @description  highlight answer
// @author       guanhua
// @match        *://www.ucertify.com/*
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @require      https://raw.githubusercontent.com/0guanhua0/pmp-quiz-helper/main/quiz.js
// ==/UserScript==

(function () {
  "use strict";

  // Function to show notifications using Tampermonkey's GM_notification or fallback to alert()
  function notify(message, title = "Tampermonkey Notification") {
    if (typeof GM_notification === "function") {
      GM_notification({ title: title, text: message, timeout: 5000 });
    } else {
      alert(message); // Fallback for browsers not supporting GM_notification
    }
  }

  // Function to find the question element
  function findQuestion() {
    const elements = document.querySelectorAll("p, div, span"); // General search for elements containing text

    // Search through elements for the question text
    for (let element of elements) {
      const questionText = element.textContent.trim();
      if (quiz[questionText]) {
        // Look for the question in the quiz database
        console.log("Question found:", questionText);
        return { element, questionText };
      }
    }

    notify("No matching question found on this page.", "Question Not Found");
    console.log("Question not found.");
    return null;
  }

  // Function to highlight correct answers from the quiz database
  function highlightAnswers(questionElement, correctAnswers) {
    if (!questionElement) return;

    const answerElements = document.querySelectorAll("div.answer seq");
    answerElements.forEach((seq) => {
      const answerText = seq.textContent.trim();

      // Highlight only the correct answers from the quiz database
      if (correctAnswers.includes(answerText)) {
        const parentDiv = seq.closest("div.answer");
        if (parentDiv) {
          // Change background color to #00ff00 (bright green) for correct answers
          parentDiv.style.backgroundColor = "#00ff00";
          console.log("Answer found and highlighted:", answerText);
        }
      }
    });
  }

  // Run the script when the page is loaded
  window.addEventListener("load", function () {
    if (document.body.textContent.includes("Project Management Professional")) {
      const questionObject = findQuestion();
      if (questionObject) {
        const { element, questionText } = questionObject;
        const answer = quiz[questionText]; // Fetch answers from the quiz database

        if (answer) {
          highlightAnswers(element, answer); // Highlight answers from the database
        } else {
          // Notify if the question isn't in the quiz database
          notify(
            `Question not in database. File issue at https://github.com/0guanhua0/pmp-quiz-helper/issues`,
            "Question Missing",
          );
          console.log("Question not in database:", questionText);
        }
      }
    } else {
      console.log(
        "Project Management Professional not found on the page. Script will not run.",
      );
    }
  });
})();
