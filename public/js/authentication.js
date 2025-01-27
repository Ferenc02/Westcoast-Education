var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import showMessageBox from "./errorHandling.js";
export let signUpPage = true;
let nameField;
// Function that checks if the user has a valid token in the cookie. If the token is valid, the user will be signed in.
// If the token is invalid, the user will be signed out.
//  This is good to implement so that the user doesn't have to sign in every time they visit the website.
export function validateUser() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        let authToken = (_a = document.cookie
            .split(";")
            .find((row) => row.startsWith("authToken="))) === null || _a === void 0 ? void 0 : _a.split("=")[1];
        if (!authToken) {
            // showMessageBox("No token found", "error");
            return {};
        }
        let response = yield fetch("http://localhost:3001/users");
        let users = yield response.json();
        for (const user of users) {
            if (user.authToken === authToken) {
                let expirationDate = new Date(user.expiresAt);
                let currentDate = new Date();
                if (expirationDate < currentDate) {
                    signOutUser();
                    return {};
                }
                showMessageBox(user.email, "success");
                return { user };
            }
        }
        // showMessageBox("Token found :D", "success");
        return {};
    });
}
// The maxAge variable is used to set the max age of the cookie in seconds. This is set to 1 day.
let maxAge = 86400;
// Function that sets a cookie with the name authToken and a random UUID as value.
export let setCookie = (uuid) => {
    document.cookie = `authToken=${uuid}; max-age=${maxAge}; path=/; SameSite=Strict`;
};
// Function that signs out the user by setting the max-age of the cookie to 0.
export let signOutUser = () => {
    document.cookie = `authToken=; max-age=0; path=/; SameSite=Strict`;
    showMessageBox("User signed out", "success");
};
// Function that toggles between the sign up and login page instead of having two separate pages.
export let toggleSignUp = (formElement) => {
    signUpPage = !signUpPage;
    // const formGroups = Array.from(formElement.querySelectorAll(".form-group"));
    // formGroups.unshift(nameField);
    formElement.querySelector("button").textContent = signUpPage
        ? "Sign up"
        : "Login";
    formElement.querySelector("p").textContent = signUpPage
        ? "Already have an account?"
        : "Don't have an account?";
    formElement.querySelector("a").textContent = signUpPage
        ? "Login"
        : "Sign up";
    formElement.querySelectorAll(".form-group")[0].classList.toggle("hidden");
    formElement.querySelector("#name").required =
        signUpPage;
};
// Function that signs in a user by checking if the user exists and if the password is correct.
export let loginUser = (formElement) => __awaiter(void 0, void 0, void 0, function* () {
    let response = yield fetch("http://localhost:3001/users");
    let users = yield response.json();
    let email = formElement.querySelector("#email").value;
    let unhashedPassword = formElement.querySelector("#password").value;
    for (const user of users) {
        if (user.email === email) {
            let hashedPassword = yield hashPassword(unhashedPassword);
            if (hashedPassword === user.password) {
                // if the user is found and the password is correct, change authToken to a new random UUID and set new expiration date.
                // A better implementation of this would be to store it in array so if the user logs in from multiple devices they will still be signed in on all devices.
                user.authToken = createRandomUUID();
                user.expiresAt = new Date(Date.now() + maxAge * 1000).toISOString();
                setCookie(user.authToken);
                //  Had to update manually since the user object is not updated in the database.
                yield fetch(`http://localhost:3001/users/${user.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(user),
                });
                // showMessageBox("User signed in", "success");
                location.href = "/";
                return;
            }
        }
    }
    showMessageBox("Invalid email or password", "error");
});
// Function that signs up a user by creating a new user object and posting it to the server.
export let signUpUser = (formElement) => __awaiter(void 0, void 0, void 0, function* () {
    alert("User created");
    let response = yield fetch("http://localhost:3001/users");
    let users = yield response.json();
    let name = formElement.querySelector("#name").value;
    let email = formElement.querySelector("#email").value;
    let unhashedPassword = formElement.querySelector("#password").value;
    for (const user of users) {
        if (user.email === email && user.email !== "") {
            showMessageBox("User already exists", "error");
            return;
        }
    }
    // Hash the password before storing it in the database.
    let password = yield hashPassword(unhashedPassword);
    let uuid = createRandomUUID();
    setCookie(uuid);
    let newUser = {
        id: users.length + 1,
        name: name,
        email: email,
        password: password,
        phone: "",
        address: "",
        courses: [],
        role: "user",
        authToken: uuid,
        expiresAt: new Date(Date.now() + maxAge * 1000).toISOString(),
    };
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
    };
    let postResponse = yield fetch("http://localhost:3001/users", options);
    let postOutput = yield postResponse.json();
    console.log(postOutput);
    location.href = "/";
});
// Function that hashes a password using SHA-256 and a salt.
// The salt is a string that is added to the end of the password before hashing.
// This makes it harder for attackers to crack the password using a dictionary attack.
// The salt should be unique for each user and should be stored securely. This one is not stored securely and not even unique for each user.
// So if the salt is found then a hacker can still do a dictionary attack😥
let hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const encoder = new TextEncoder();
    let data = encoder.encode(password);
    //  This is a very bad way to store a salt, it should be unique for each user and stored securely.
    // This is just an example of how a salt can be used to make the password more secure.
    const salt = "this is my very secret and secure salt phrase";
    const hashedSalt = encoder.encode(salt);
    data = new Uint8Array([...data, ...hashedSalt]);
    const hashBuffer = yield crypto.subtle.digest("SHA-256", data);
    let hexadecimalString = Array.from(new Uint8Array(hashBuffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
    console.log(hexadecimalString);
    return hexadecimalString;
});
// There is a function called crypto.randomUUID that can be used but, I thought it was fun create my own version of it.
// The chance of two UUIDs from this function colliding? So small that you’d have better odds of finding a needle in a galaxy-sized haystack.
// The chance of having a collision is 1 in 36^36, which equals
// 1 in 4738381338321616896029870078505969039016966697471150738910363830999392
// or approximately 0.00000000000000000000000000000000000000134%.
// Of course, this is not a perfect UUID generator, since it doesn't follow the UUID standard and is not guaranteed to be unique.
export let createRandomUUID = () => {
    // Not my proudest way to get the alphabet in javascript but works
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let amountOfCharactersToGenerate = 36;
    let currentTimeStamp = Date.now().toString().split(""); //Turns the current timestamp to an array instead, each item is a string which is fine since it's only used for the uuid.
    let uuid = new Array(amountOfCharactersToGenerate).fill(0);
    let usedIndices = new Set();
    // Sets the hyphens in the uuid by specific indices
    [8, 13, 18, 23].forEach((index) => {
        uuid[index] = "-";
    });
    //   Sets the current timestamp in the uuid by random indices
    currentTimeStamp.forEach((item) => {
        let index = Math.floor(Math.random() * 36);
        while (usedIndices.has(index) || uuid[index] === "-") {
            index = Math.floor(Math.random() * uuid.length);
        }
        uuid[index] = item;
        usedIndices.add(index);
    });
    //   Sets the rest of the uuid to random letters
    uuid.forEach((item, index) => {
        if (item === 0) {
            let randomIndex = Math.floor(Math.random() * 26);
            uuid[index] = alphabet[randomIndex];
        }
    });
    return uuid.join("");
};
