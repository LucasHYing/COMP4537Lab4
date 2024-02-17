/*ChatGPT-3.5 (https://chat.openai.com/) was used to code solutions presented in this assignment. */
import {
  ERROR_MESSAGE,
  MISSING_FIELDS_MESSAGE,
  MISSING_SEARCH_WORD_MESSAGE,
  SEARCHING_MESSAGE,
  SUBMIT_SUCCESS_MESSAGE,
  NOT_FOUND_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  SUBMIT_FAIL_MESSAGE,
  ONLY_ALPHABETICS_MESSAGE,
} from "../lang/en/en.js";

const apiUrl = "https://nainzhou.com/COMP4537/labs/4/api/definitions";

/**
 * Submits a new word and its definition to the server.
 */
export async function submitDefinition() {
  // Retrieving user inputs from the DOM.
  const word = document.getElementById("word").value;
  const definition = document.getElementById("definition").value;
  const responseDiv = document.getElementById("response");

  // Regular expression to ensure word contains only letters (and hyphens for compound words).
  const validWordRegex = /^[A-Za-z]+(-[A-Za-z]+)*$/;

  // Attempt to send a POST request to the server with the new word and definition.
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word, definition }),
    });

    const data = await response.json(); // Parse JSON response in all cases.
    
    if (!response.ok) {
      // Handle server-side errors by displaying the server's error message.
      throw new Error(data.message || NETWORK_ERROR_MESSAGE);
    }

    // Check for empty input fields and display an error message if any are found.
    if (!word || !definition) {
      const errMsg = { message: MISSING_FIELDS_MESSAGE };
      responseDiv.innerText = data.message || errMsg.message;
      return;
    }

    // Validate the word against the regular expression.
    if (!validWordRegex.test(word)) {
      const errMsg = { message: ONLY_ALPHABETICS_MESSAGE };
      responseDiv.innerText = data.message || errMsg.message;
      return;
    }
    
    // Display a success message from the server or a default success message.
    responseDiv.innerText = data.message || SUBMIT_SUCCESS_MESSAGE;
  } catch (error) {
    console.error("Error:", error);
    // Display the error message from the catch block or a default failure message.
    responseDiv.innerText = error.message || SUBMIT_FAIL_MESSAGE;
  }
}

// Event listener for DOMContentLoaded to ensure the DOM is fully loaded before attaching event handlers.
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("submitDefinition")
    .addEventListener("click", submitDefinition);
});

/**
 * Searches for the definition of a word from the server.
 */
export async function searchDefinition() {
  const word = document.getElementById("searchWord").value;
  const responseDiv = document.getElementById("response");
  const validWordRegex = /^[A-Za-z]+(-[A-Za-z]+)*$/;
  
  // Display a searching message to inform the user that the operation is in progress.
  responseDiv.innerText = SEARCHING_MESSAGE;

    // Attempt to fetch the definition of the word from the server.
    try {
      const response = await fetch(`${apiUrl}/?word=${word}`, { method: "GET" });
  
      const data = await response.json(); // Parse JSON response in all cases.
      
      if (!response.ok) {
        // Handle server-side errors by displaying the server's error message.
        throw new Error(data.message || NOT_FOUND_MESSAGE);
      }

      // Validate the input for the search term.
      if (!word) {
        const errMsg = { message: MISSING_SEARCH_WORD_MESSAGE };
        responseDiv.innerText = data.message || errMsg.message;
        return;
      }

      if (!validWordRegex.test(word)) {
        const errMsg = { message: ONLY_ALPHABETICS_MESSAGE };
        responseDiv.innerText = data.message || errMsg.message;
        return;
      }
      
      // Display the found definition or a default message if not found.
      if (data.definition) {
        responseDiv.innerText = `"${word}": ${data.definition}`;
      } else {
        responseDiv.innerText = data.message || NOT_FOUND_MESSAGE;
      }
    } catch (error) {
      console.error("Error:", error);
      // Display the error message from the catch block or a default error message.
      responseDiv.innerText = error.message || ERROR_MESSAGE;
    }
}

// Attaching the searchDefinition event handler to the search button after the DOM is loaded.
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("searchButton")
    .addEventListener("click", searchDefinition);
});
