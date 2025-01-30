let header = document.querySelector("header");
let navbarButton = document.querySelector("#home-navbar-button");
let navbarActive = false;
// Function to initialize the home page. This function will be called when the home page is loaded in app.ts.
export const initializeHome = () => {
    navbarButton === null || navbarButton === void 0 ? void 0 : navbarButton.addEventListener("click", () => {
        toggleNavbar();
    });
};
let toggleNavbar = () => {
    header === null || header === void 0 ? void 0 : header.classList.toggle("hidden");
    navbarActive = !navbarActive;
};
