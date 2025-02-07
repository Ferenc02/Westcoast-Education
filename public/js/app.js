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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// ---- Import from other script files ----
import { validateUser, signUpUser, signUpPage, loginUser, toggleSignUp, } from "./authentication.js";
import showMessageBox from "./errorHandling.js";
import { initializeHome } from "./home.js";
// ---- Global variables ----
export let authenticatedUser;
export let currentPage = window.location.pathname;
// Function that checks if an object is empty. I noticed that I was using this function in multiple places so I decided to create a function for it.
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
// Function that changes the user details in the database. This function uses the PUT method to update the user details.
// The function takes in a user object as a parameter.
export let updateUserInDatabase = (userInformation) => __awaiter(void 0, void 0, void 0, function* () {
    let checkUserLoggedIn = yield validateUser();
    // Added this check to make sure that no other than user can change their own details.
    // Not the most secure way since a user can change the user id in the browser and change someone else's details.
    if (isEmpty(checkUserLoggedIn)) {
        showMessageBox("User not logged in", "error");
        return;
    }
    yield fetch(`http://localhost:3001/users/${userInformation.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userInformation),
    });
});
// Function that initializes the app. This function checks if the user is authenticated and redirects them accordingly.
let initializeApp = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    authenticatedUser = (yield validateUser());
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
        let formElement = document.querySelector(".authentication-form");
        formElement === null || formElement === void 0 ? void 0 : formElement.addEventListener("submit", (event) => {
            event.preventDefault();
            if (signUpPage) {
                signUpUser(formElement);
            }
            else {
                loginUser(formElement);
            }
        });
        (_a = document.querySelector(".login-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            toggleSignUp(formElement);
        });
    }
    // Event listener for the page if the user is not logged in.
    if (location.pathname == "/") {
        (_b = document.querySelector("#navbar-toggle")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            var _a;
            (_a = document
                .querySelector("#navbar-default")) === null || _a === void 0 ? void 0 : _a.classList.toggle("show-mobile-nav");
        });
    }
    // Tried many different ways to make the login sequence work,
    // but I noticed that this was the easiest way to make it work without needing to change other parts of the code.
    if (location.hash === "#login") {
        (_c = document.querySelector(".login-button")) === null || _c === void 0 ? void 0 : _c.click();
    }
    // Initialize the home page
    if (location.href.includes("home.html")) {
        initializeHome();
    }
});
// Call the initializeApp function to start the app.
initializeApp();
