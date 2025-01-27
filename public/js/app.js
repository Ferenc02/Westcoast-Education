var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { validateUser, signUpUser } from "./authentication.js";
import showMessageBox from "./errorHandling.js";
let endpointTest = () => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield fetch("http://localhost:3000/test");
    let output = yield response.json();
    let h1Element = document.querySelector("h1");
    if (h1Element) {
        h1Element.innerText = `Hello, ${output.name}! You are ${output.age} years old.`;
    }
    else {
        console.error("No <h1> element found in the document.");
    }
});
let init = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let checkAuthToken = yield validateUser();
    console.log(checkAuthToken);
    (_a = document.querySelector(".test-button")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        showMessageBox("This is an error message", "error");
    });
    (_b = document.querySelector(".test-button2")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        showMessageBox("This is an success message", "success");
    });
    (_c = document.querySelector(".test-button3")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
        // setCookie();
        console.log("hi?");
    });
    let formElement = document.querySelector(".authentication-form");
    formElement === null || formElement === void 0 ? void 0 : formElement.addEventListener("submit", (event) => {
        event.preventDefault();
        signUpUser(formElement);
    });
});
init();
