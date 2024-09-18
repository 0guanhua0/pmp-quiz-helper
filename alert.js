// ==UserScript==
// @name         Extract Explanation and Alert
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Extract explanation text and display it in an alert
// @author       Your Name
// @match        *://www.ucertify.com/*
// @grant        GM_notification
// ==/UserScript==

(function () {
  "use strict";

  // Function to extract and alert explanation content
  function extractExplanation() {
    // Select the explanation content
    const explanationElement = document.querySelector(
      '.explanation_content[data-itemtype="explanation"]',
    );

    // Check if the element exists
    if (explanationElement) {
      console.log("Explanation element found:", explanationElement); // Log the found element
      // Extract the inner text
      const explanationText = explanationElement.innerText.trim();
      console.log("Extracted text:", explanationText); // Log the extracted text
      // Show the explanation in a popup alert
      alert(explanationText);
    } else {
      console.warn("Explanation element not found."); // Log a warning if not found
    }
  }

  // Wait for the page to load initially
  window.addEventListener("load", () => {
    console.log("Page loaded"); // Log when the page is loaded
    extractExplanation(); // Run extraction on page load
  });

  // Add an event listener to the "Next" button
  const nextButton = document.querySelector("#next");
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      console.log('"Next" button clicked'); // Log when the button is clicked

      // Wait for the page content to update
      setTimeout(() => {
        console.log("Checking for updated content");
        extractExplanation(); // Run extraction again after content updates
      }, 1000); // Adjust timeout as needed for content load
    });
  } else {
    console.warn("Next button not found."); // Log a warning if not found
  }
})();
