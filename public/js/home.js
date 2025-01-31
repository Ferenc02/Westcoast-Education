let header = document.querySelector("header");
let navbar = document.querySelector("nav");
let navbarButton = document.querySelector("#home-navbar-button");
let navbarActive = false;
// Function to initialize the home page. This function will be called when the home page is loaded in app.ts.
export const initializeHome = () => {
    navbarButton === null || navbarButton === void 0 ? void 0 : navbarButton.addEventListener("click", () => {
        toggleNavbar();
    });
};
const toggleNavbar = () => {
    // header?.classList.toggle("hidden");
    if (!navbarActive) {
        navbar.classList.add("slide-in");
        navbar.classList.remove("slide-out");
        header.classList.remove("hidden");
    }
    else {
        navbar.classList.add("slide-out");
        navbar.classList.remove("slide-in");
        setTimeout(() => {
            header.classList.add("hidden");
        }, 300);
    }
    navbarActive = !navbarActive;
};
document.body.addEventListener("mousemove", (event) => {
    if (navbarActive) {
        let x = event.clientX;
        console.log(event);
        // console.log(x, y);
        // mouseOutsideNavbar = x > navbar.offsetWidth ? true : false;
        if (x > navbar.offsetWidth) {
            toggleNavbar();
        }
    }
});
// document.body.addEventListener("click", (event) => {
//   if (navbarActive && mouseOutsideNavbar) {
//     console.log(mouseOutsideNavbar);
//     toggleNavbar();
//   }
// });
