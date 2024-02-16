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
} from "../lang/en/en.js";

const apiUrl = "https://nainzhou.com/COMP4537/labs/4/api/definitions";

// submitDefinition
export async function submitDefinition() {
  const word = document.getElementById("word").value;
  const definition = document.getElementById("definition").value;
  const responseDiv = document.getElementById("response");

  if (!word || !definition) {
    responseDiv.innerText = MISSING_FIELDS_MESSAGE;
    return;
  }

  // Check if the word or definition contains numbers or special characters
  if (!/^[a-zA-Z]+$/.test(word) || !/^[a-zA-Z]+$/.test(definition)) {
    responseDiv.innerText = ONLY_ALPHABETICS_MESSAGE;
    return;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word, definition }),
    });

    if (!response.ok) {
      throw new Error(NETWORK_ERROR_MESSAGE);
    }

    const data = await response.json();
    responseDiv.innerText = data.message || SUBMIT_SUCCESS_MESSAGE;
  } catch (error) {
    console.error("Error:", error);
    responseDiv.innerText = SUBMIT_FAIL_MESSAGE;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("submitDefinition")
    .addEventListener("click", submitDefinition);
});

// searchDefinition
export async function searchDefinition() {
  const word = document.getElementById("searchWord").value;
  const responseDiv = document.getElementById("response");

  if (!word) {
    responseDiv.innerText = MISSING_SEARCH_WORD_MESSAGE;
    return;
  }

  if (!/^[a-zA-Z]+$/.test(word)) {
    responseDiv.innerText = ONLY_ALPHABETICS_MESSAGE;
    return;
  }

  responseDiv.innerText = SEARCHING_MESSAGE;

  try {
    const response = await fetch(`${apiUrl}/?word=${word}`, { method: "GET" });

    if (!response.ok) {
      throw new Error(NETWORK_ERROR_MESSAGE);
    }

    const data = await response.json();
    if (data.definition) {
      responseDiv.innerText = `"${word}": ${data.definition}`;
    } else {
      responseDiv.innerText = data.message || NOT_FOUND_MESSAGE;
    }
  } catch (error) {
    console.error("Error:", error);
    responseDiv.innerText = ERROR_MESSAGE;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("searchButton")
    .addEventListener("click", searchDefinition);
});
