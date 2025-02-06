/*
 * app.ts - The core Entry point of the application.
 *
 * Inspired by frameworks like React and Svelte, this file serves as the central hub
 * where authentication, navigation, and app initialization are handled.
 *
 *
 * It ensures that:
 * - The correct page is displayed based on the user's authentication status.
 * - User authentication is validated on startup.
 * - Navigation and UI elements are dynamically controlled.
 * - User state is managed across different pages.
 * - Event listeners are set up for login, signup, and toggling UI elements.
 *
 * The app starts by calling `initializeApp()`, which checks if the user is authenticated
 * and redirects them accordingly. It also handles form submissions, button clicks, and
 * initializes the home page.
 *
 * This file acts as the **highest-level controller** of the application, similar to `App.tsx` in React
 * or `App.svelte` in Svelte, managing the core logic and state flow of the project.
 */

// ---- Import from other script files ----
import {
  validateUser,
  signUpUser,
  signUpPage,
  user,
  loginUser,
  toggleSignUp,
} from "./authentication.js";
import showMessageBox from "./errorHandling.js";
import { initializeHome } from "./home.js";

// ---- Global variables ----
export let authenticatedUser: user;

export let currentPage = window.location.pathname;

// Function that checks if an object is empty. I noticed that I was using this function in multiple places so I decided to create a function for it.
function isEmpty(obj: Object) {
  return Object.keys(obj).length === 0;
}

// Function that changes the user details in the database. This function uses the PUT method to update the user details.
// The function takes in a user object as a parameter.
export let updateUserInDatabase = async (userInformation: user) => {
  let checkUserLoggedIn = await validateUser();

  // Added this check to make sure that no other than user can change their own details.
  // Not the most secure way since a user can change the user id in the browser and change someone else's details.
  if (isEmpty(checkUserLoggedIn)) {
    showMessageBox("User not logged in", "error");
    return;
  }
  await fetch(`http://localhost:3001/users/${userInformation.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInformation),
  });
};

// Function that initializes the app. This function checks if the user is authenticated and redirects them accordingly.
let initializeApp = async () => {
  authenticatedUser = (await validateUser()) as user;

  //  Redirect to the home page if the user is already logged in.
  if (currentPage.includes("login.html") && !isEmpty(authenticatedUser)) {
    location.href = "/pages/home.html";
  }

  // Redirect to the login page if the user is not logged in.
  if (currentPage.includes("home.html") && isEmpty(authenticatedUser)) {
    location.href = "/pages/login.html#login";
  }

  // Event listeners for the login page.
  if (currentPage.includes("login.html")) {
    let formElement = document.querySelector(
      ".authentication-form"
    ) as HTMLFormElement;

    formElement?.addEventListener("submit", (event) => {
      event.preventDefault();

      if (signUpPage) {
        signUpUser(formElement);
      } else {
        loginUser(formElement);
      }
    });

    document.querySelector(".login-button")?.addEventListener("click", () => {
      toggleSignUp(formElement);
    });
  }

  // Event listener for the page if the user is not logged in.
  if (location.pathname == "/") {
    document.querySelector("#navbar-toggle")?.addEventListener("click", () => {
      document
        .querySelector("#navbar-default")
        ?.classList.toggle("show-mobile-nav");
    });
  }

  // Tried many different ways to make the login sequence work,
  // but I noticed that this was the easiest way to make it work without needing to change other parts of the code.
  if (location.hash === "#login") {
    (document.querySelector(".login-button") as HTMLButtonElement)?.click();
  }

  // Initialize the home page
  if (location.href.includes("home.html")) {
    initializeHome();
  }
};

// Call the initializeApp function to start the app.
initializeApp();
