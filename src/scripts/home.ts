let header = document.querySelector("header");
let navbarButton = document.querySelector("#home-navbar-button");

let navbarActive = false;

// Function to initialize the home page. This function will be called when the home page is loaded in app.ts.
export const initializeHome = () => {
  navbarButton?.addEventListener("click", () => {
    toggleNavbar();
  });
};

let toggleNavbar = () => {
  header?.classList.toggle("hidden");
  navbarActive = !navbarActive;
};
