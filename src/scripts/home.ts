import { signOutUser } from "./authentication.js";
import { authenticatedUser } from "./app.js";
import showMessageBox from "./errorHandling.js";
import { initializeCourses } from "./courses.js";

let header: HTMLElement;
let navbar: HTMLElement;
let navbarButton: HTMLElement;

let profileName: HTMLElement;
let profileRole: HTMLElement;
let homeTitle: HTMLElement;

let logoutButton = document.querySelector(
  "#logout-button"
) as HTMLButtonElement;

let navbarActive = false;

// Function to initialize the home page. This function will be called when the home page is loaded in app.ts.
export const initializeHome = () => {
  header = document.querySelector("header") as HTMLElement;
  navbar = document.querySelector("nav") as HTMLElement;
  navbarButton = document.querySelector("#home-navbar-button") as HTMLElement;
  profileName = navbar.querySelector(".profile-name") as HTMLElement;
  profileRole = navbar.querySelector(".profile-role") as HTMLElement;
  homeTitle = document.querySelector(".home-title") as HTMLElement;

  navbarButton?.addEventListener("click", () => {
    toggleNavbar();
  });

  logoutButton.addEventListener("click", () => {
    signOutUser();
    location.href = "/pages/login.html#login";
  });

  document.body.addEventListener("mousemove", (event) => {
    if (navbarActive) {
      let x = event.clientX;

      // console.log(event);
      // console.log(x, y);

      // mouseOutsideNavbar = x > navbar.offsetWidth ? true : false;

      if (x > navbar.offsetWidth) {
        toggleNavbar();
      }
    }
  });

  updateText();

  if (location.hash === "") {
    initializeCourses();
  }

  window.addEventListener("hashchange", hashChange);
};

// Function that uupdates all the text in the site to the authenticated user's name and role. This will always be authenticated since the user has to be authenticated to access the home page.
const updateText = () => {
  profileName.textContent = authenticatedUser.name;
  profileRole.textContent =
    authenticatedUser.role === "admin" ? "administrator" : "User";

  homeTitle.textContent = `Welcome, ${authenticatedUser.name}!`;
};

const toggleNavbar = () => {
  // header?.classList.toggle("hidden");

  if (!navbarActive) {
    navbar.classList.add("slide-in");
    navbar.classList.remove("slide-out");

    header.classList.remove("hidden");
  } else {
    navbar.classList.add("slide-out");
    navbar.classList.remove("slide-in");

    setTimeout(() => {
      header.classList.add("hidden");
    }, 300);
  }

  navbarActive = !navbarActive;
};

const hashChange = () => {
  if (location.hash === "") {
    initializeCourses();
  }
};
