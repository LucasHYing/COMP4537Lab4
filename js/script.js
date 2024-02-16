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

  // Check for empty input fields and display an error message if any are found.
  if (!word || !definition) {
    responseDiv.innerText = MISSING_FIELDS_MESSAGE;
    return;
  }

  // Validate the word against the regular expression.
  if (!validWordRegex.test(word)) {
    responseDiv.innerText = ONLY_ALPHABETICS_MESSAGE;
    return;
  }

  // Attempt to send a POST request to the server with the new word and definition.
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word, definition }),
    });

    // Handle non-OK responses by throwing an error.
    if (!response.ok) {
      throw new Error(NETWORK_ERROR_MESSAGE);
    }

    // Parse the JSON response and display a success message.
    const data = await response.json();
    responseDiv.innerText = data.message || SUBMIT_SUCCESS_MESSAGE;
  } catch (error) {
    // Catch and log any errors, displaying a failure message to the user.
    console.error("Error:", error);
    responseDiv.innerText = SUBMIT_FAIL_MESSAGE;
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

  // Validate the input for the search term.
  if (!word) {
    responseDiv.innerText = MISSING_SEARCH_WORD_MESSAGE;
    return;
  }

  if (!validWordRegex.test(word)) {
    responseDiv.innerText = ONLY_ALPHABETICS_MESSAGE;
    return;
  }
  
  // Display a searching message to inform the user that the operation is in progress.
  responseDiv.innerText = SEARCHING_MESSAGE;

  // Attempt to fetch the definition of the word from the server.
  try {
    const response = await fetch(`${apiUrl}/?word=${word}`, { method: "GET" });

    // Handle non-OK responses by throwing an error.
    if (!response.ok) {
      throw new Error(NETWORK_ERROR_MESSAGE);
    }

    // Parse the JSON response and display the definition or a not-found message.
    const data = await response.json();
    if (data.definition) {
      responseDiv.innerText = `"${word}": ${data.definition}`;
    } else {
      responseDiv.innerText = data.message || NOT_FOUND_MESSAGE;
    }
  } catch (error) {
    // Catch and log any errors, displaying an error message to the user.
    console.error("Error:", error);
    responseDiv.innerText = ERROR_MESSAGE;
  }
}

// Attaching the searchDefinition event handler to the search button after the DOM is loaded.
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("searchButton")
    .addEventListener("click", searchDefinition);
});
