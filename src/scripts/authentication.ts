/*
 * authentication.ts - The core authentication manager of the application.
 *
 * This file is responsible for managing user authentication, including validation, sign-in, and sign-up functionality.
 * While there were **much simpler** ways to implement this, the complexity and additional logic were purely for fun.
 * The task given to us didn’t require this level of depth.
 *
 * Features:
 * - Validates users based on authentication tokens stored in cookies.
 * - Implements a custom **UUID generator** (because why use built-in solutions when you can learn by doing your own?).
 * - Uses a *hashing* function to demonstrate password security (even if the salt handling is... questionable).
 * - Supports automatic token expiration, keeping users logged in only for a set duration.
 * - Includes a toggle function to switch between login and sign-up modes dynamically.
 * - Handles user authentication, sign-up, and sign-out with custom error messages.
 *
 * This file acts as the **identity manager** of the application, ensuring that users can sign in, sign out, and stay logged in without needing to re-authenticate constantly.
 * It’s unnecessarily long and complex for the task at hand, but it was a fun exercise in learning and implementing various security concepts.
 *
 *
 */

// ---- Import from other script files ----
import showMessageBox from "./errorHandling.js";

// ---- Global variables ----
export let signUpPage = true;
export interface user {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  courses: string[];
  role: string;
  authToken: string;
  expiresAt: string;
}

// Function that checks if the user has a valid token in the cookie. If the token is valid, the user will be signed in.
// If the token is invalid, the user will be signed out.
//  This is good to implement so that the user doesn't have to sign in every time they visit the website.
export async function validateUser(): Promise<user | {}> {
  let authToken = document.cookie
    .split(";")
    .find((row) => row.startsWith("authToken="))
    ?.split("=")[1];

  if (!authToken) {
    return {};
  }

  // Fetches the user with the authToken from the cookie.
  let response = await fetch(
    `http://localhost:3001/users?authToken=${authToken}`
  );

  let users = (await response.json()) as Array<user>;

  // If the user is not found, return an empty object.
  if (users.length === 0) {
    return {};
  }

  // If the user is found, check if the token has expired. If the token has expired, sign out the user.
  let user = users[0];
  let expirationDate = new Date(user.expiresAt);
  let currentDate = new Date();
  if (expirationDate < currentDate) {
    signOutUser();
    return {};
  }

  // Else if the token is still valid, return the user object.
  return user;
}

// The maxAge variable is used to set the max age of the cookie in seconds. This is set to 1 day.
let maxAge = 86400;

// Function that sets a cookie with the name authToken and a random UUID as value.
export let setCookie = (uuid: string) => {
  document.cookie = `authToken=${uuid}; max-age=${maxAge}; path=/; SameSite=Strict`;
};

// Function that signs out the user by setting the max-age of the cookie to 0.
export let signOutUser = () => {
  document.cookie = `authToken=; max-age=0; path=/; SameSite=Strict`;

  showMessageBox("User signed out", "success");
};

// Function that toggles between the sign up and login page instead of having two separate pages.

export let toggleSignUp = (formElement: HTMLFormElement) => {
  signUpPage = !signUpPage;
  formElement.querySelector("button")!.textContent = signUpPage
    ? "Sign up"
    : "Login";

  formElement.querySelector("p")!.textContent = signUpPage
    ? "Already have an account?"
    : "Don't have an account?";
  formElement.querySelector("a")!.textContent = signUpPage
    ? "Login"
    : "Sign up";

  formElement.querySelectorAll(".form-group")[0].classList.toggle("hidden");
  (formElement.querySelector("#name") as HTMLInputElement).required =
    signUpPage;
};

// Function that signs in a user by checking if the user exists and if the password is correct.
export let loginUser = async (formElement: HTMLFormElement) => {
  let email = (formElement.querySelector("#email") as HTMLInputElement).value;
  let unhashedPassword = (
    formElement.querySelector("#password") as HTMLInputElement
  ).value;

  let response = await fetch(`http://localhost:3001/users?email=${email}`);
  let users: Array<user> = await response.json();

  if (users.length === 0) {
    showMessageBox("Invalid email or password", "error");
    return;
  }

  let user = users[0];

  let hashedPassword = await hashPassword(unhashedPassword);

  if (hashedPassword === user.password) {
    // if the user is found and the password is correct, change authToken to a new random UUID and set new expiration date.
    // A better implementation of this would be to store it in array so if the user logs in from multiple devices they will still be signed in on all devices.
    user.authToken = createRandomUUID();
    user.expiresAt = new Date(Date.now() + maxAge * 1000).toISOString();

    // Set the cookie with the new authToken.
    setCookie(user.authToken);

    //  Had to update manually since the user object is not updated in the database.
    await fetch(`http://localhost:3001/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    location.href = "/pages/home.html";

    return;
  }

  // If the password is incorrect, show an error message.
  showMessageBox("Invalid email or password", "error");
};

// Function that fetches a user from the server by the user id.
export let fetchUser = async (id: number): Promise<user> => {
  let response = await fetch(`http://localhost:3001/users/${id}`);

  let user: user = await response.json();

  return user;
};

// Function that signs up a user by creating a new user object and posting it to the server.
export let signUpUser = async (formElement: HTMLFormElement) => {
  let response = await fetch("http://localhost:3001/users");

  let users: Array<user> = await response.json();

  let name = (formElement.querySelector("#name") as HTMLInputElement).value;
  let email = (formElement.querySelector("#email") as HTMLInputElement).value;
  let unhashedPassword = (
    formElement.querySelector("#password") as HTMLInputElement
  ).value;

  for (const user of users) {
    if (user.email === email && user.email !== "") {
      showMessageBox("User already exists", "error");
      return;
    }
  }

  // Hash the password before storing it in the database.
  let password = await hashPassword(unhashedPassword);

  let uuid = createRandomUUID();

  setCookie(uuid);

  let newUser = {
    id: (users.length + 1).toString(),
    name: name,
    email: email,
    password: password,
    phone: "",
    address: "",
    courses: [],
    role: "admin",
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

  let postResponse = await fetch("http://localhost:3001/users", options);

  let postOutput = await postResponse.json();

  console.log(postOutput);

  location.href = "/pages/home.html";
};

// Function that hashes a password using SHA-256 and a salt.
// The salt is a string that is added to the end of the password before hashing.
// This makes it harder for attackers to crack the password using a dictionary attack.
// The salt should be unique for each user and should be stored securely. This one is not stored securely and not even unique for each user.
// So if the salt is found then a hacker can still do a dictionary attack, which is exactly what a "hacker" can do now with this code. 😥
export let hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();

  let data = encoder.encode(password);

  //  This is a very bad way to store a salt, it should be unique for each user and stored securely.
  // This is just an example of how a salt can be used to make the password more secure.
  const salt = "this is my very secret and secure salt phrase";

  const hashedSalt = encoder.encode(salt);

  data = new Uint8Array([...data, ...hashedSalt]);

  // Hash the password using the SHA-256 algorithm.
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  let hexadecimalString = Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return hexadecimalString;
};

// There is a function called crypto.randomUUID that can be used but, I thought it was fun create my own version of it.
// The chance of two UUIDs from this function colliding? So small that you’d have better odds of finding a needle in a galaxy-sized haystack.
// The chance of having a collision is 1 in 36^36, which equals
// 1 in 4738381338321616896029870078505969039016966697471150738910363830999392
// or approximately 0.00000000000000000000000000000000000000134%.
// Of course, this is not a perfect UUID generator, since it doesn't follow the UUID standard and is not guaranteed to be unique.

export let createRandomUUID = (): string => {
  // This is the best way to get the alphabet, or should I have used the npm package alphabet?
  // https://www.npmjs.com/package/alphabet
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let amountOfCharactersToGenerate = 36;
  let currentTimeStamp = Date.now().toString().split(""); //Turns the current timestamp to an array instead, each item is a string which is fine since it's only used for the uuid.

  let uuid = new Array(amountOfCharactersToGenerate).fill(0);

  let usedIndices = new Set<number>();

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
