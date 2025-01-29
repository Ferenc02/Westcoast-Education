var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { validateUser, signUpUser, signUpPage, loginUser, toggleSignUp, signOutUser, } from "./authentication.js";
import showMessageBox from "./errorHandling.js";
export let authenticatedUser = {};
export let currentPage = window.location.pathname;
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
// Function that changes the user details in the database. This function uses the PUT method to update the user details.
// The function takes in a user object as a parameter.
export let updateUserInDatabase = (userInformation) => __awaiter(void 0, void 0, void 0, function* () {
    let checkUserLoggedIn = yield validateUser();
    // Added this check to make sure that no other than user can change their own details.
    //
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
let init = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    authenticatedUser = yield validateUser();
    console.log(authenticatedUser);
    //  Redirect to the home page if the user is already logged in.
    if (currentPage.includes("login.html") && !isEmpty(authenticatedUser)) {
        location.href = "/";
    }
    (_a = document.querySelector(".test-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        showMessageBox("This is an error message", "error");
    });
    (_b = document.querySelector(".test-button2")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        showMessageBox("This is an success message", "success");
    });
    (_c = document.querySelector(".test-button3")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
        signOutUser();
    });
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
    (_d = document.querySelector(".login-button")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => {
        toggleSignUp(formElement);
    });
    (_e = document.querySelector("#navbar-toggle")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => {
        var _a;
        (_a = document.querySelector("#navbar-default")) === null || _a === void 0 ? void 0 : _a.classList.toggle("hidden");
    });
    if (location.hash === "#login") {
        (_f = document.querySelector(".login-button")) === null || _f === void 0 ? void 0 : _f.click();
    }
});
init();
// updateUserInDatabase({
//   id: "2",
//   name: "hacked :(",
//   email: "admin@gmail.com",
//   password: "604b6f3038b99e3e4e80259bc3fe9c38a46a2f638853e47e616841b05269eef5",
//   phone: "",
//   address: "",
//   courses: [],
//   role: "user",
//   authToken: "j4f3p6dr-4yv8-nl19-7z7k-y61dpf3j8zus",
//   expiresAt: "2025-01-28T12:37:18.466Z",
// });
