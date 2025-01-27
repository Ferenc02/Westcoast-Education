import {
  validateUser,
  setCookie,
  signUpUser,
  changeToLogin,
  signUpPage,
  user,
} from "./authentication.js";
import showMessageBox from "./errorHandling.js";

export let userDetails: user;

function isEmpty(obj: Object) {
  return Object.keys(obj).length === 0;
}

// Function that changes the user details in the database. This function uses the PUT method to update the user details.
// The function takes in a user object as a parameter.
export let updateUserInDatabase = async (userInformation: user) => {
  let checkUserLoggedIn = await validateUser();

  // Added this check to make sure that no other than user can change their own details.
  //
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

let init = async () => {
  let checkAuthToken = await validateUser();

  console.log(checkAuthToken);

  document.querySelector(".test-button")?.addEventListener("click", () => {
    showMessageBox("This is an error message", "error");
  });

  document.querySelector(".test-button2")?.addEventListener("click", () => {
    showMessageBox("This is an success message", "success");
  });
  document.querySelector(".test-button3")?.addEventListener("click", () => {
    // setCookie();
    console.log("hi?");
  });

  let formElement = document.querySelector(
    ".authentication-form"
  ) as HTMLFormElement;

  formElement?.addEventListener(
    "submit",
    (event) => {
      if (!signUpPage) return;
      event.preventDefault();
      signUpUser(formElement);
    },
    { once: true }
  );

  document.querySelector(".login-button")?.addEventListener("click", () => {
    changeToLogin();
  });
};

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
