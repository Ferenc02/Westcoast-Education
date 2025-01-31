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
let homeDescription: HTMLElement;
let addCourseForm: HTMLElement;
let addCourseInputs: NodeListOf<HTMLInputElement>;

let addCourseTextArea: HTMLElement;

let cardsContainer: HTMLElement;

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
  homeDescription = document.querySelector(".home-description") as HTMLElement;
  cardsContainer = document.querySelector(".cards-container") as HTMLElement;
  addCourseForm = document.querySelector(".add-course-form") as HTMLFormElement;
  addCourseInputs = addCourseForm.querySelectorAll(
    "input"
  ) as NodeListOf<HTMLInputElement>;
  addCourseTextArea = addCourseForm.querySelector(
    "textarea"
  ) as HTMLTextAreaElement;

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

  hashChange();
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

  if (location.hash === "#addCourse") {
    updatePageElement(homeTitle, "Add Course");
    updatePageElement(
      homeDescription,
      "Fill in the details of the course below and click the 'Add Course' button to add the course to the list of courses."
    );

    cardsContainer.classList.add("hidden");
    document.querySelector(".add-course-container")!.classList.remove("hidden");
    document.querySelector(".main-content-title")!.classList.add("hidden");

    addCourseForm.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", () => {
        updatePreviewCard(input);
      });
    });
    addCourseForm.querySelector("textarea")!.addEventListener("input", () => {
      updatePreviewCard(addCourseForm.querySelector("textarea")!);
    });
  }
};

// Function that updates the text in the page element. Why I added this function is so the fade-in effect will also be applied to the text in the page element.
const updatePageElement = (element: HTMLElement, text: string) => {
  element.textContent = text;
  element.classList.add("fade-in");
};

const updatePreviewCard = (element: any) => {
  document.querySelector(".preview-container")!.innerHTML = element.value;
};
