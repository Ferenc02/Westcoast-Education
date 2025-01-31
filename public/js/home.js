var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { signOutUser } from "./authentication.js";
import { authenticatedUser } from "./app.js";
import { initializeCourses } from "./courses.js";
let header;
let navbar;
let navbarButton;
let profileName;
let profileRole;
let homeTitle;
let homeDescription;
let addCourseForm;
let addCourseInputs;
let addCourseTextArea;
let cardsContainer;
let previewContainer;
let logoutButton = document.querySelector("#logout-button");
let navbarActive = false;
// Function to initialize the home page. This function will be called when the home page is loaded in app.ts.
export const initializeHome = () => {
    header = document.querySelector("header");
    navbar = document.querySelector("nav");
    navbarButton = document.querySelector("#home-navbar-button");
    profileName = navbar.querySelector(".profile-name");
    profileRole = navbar.querySelector(".profile-role");
    homeTitle = document.querySelector(".home-title");
    homeDescription = document.querySelector(".home-description");
    cardsContainer = document.querySelector(".cards-container");
    addCourseForm = document.querySelector(".add-course-form");
    addCourseInputs = addCourseForm.querySelectorAll("input");
    addCourseTextArea = addCourseForm.querySelector("textarea");
    previewContainer = document.querySelector(".preview-container");
    navbarButton === null || navbarButton === void 0 ? void 0 : navbarButton.addEventListener("click", () => {
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
const hashChange = () => {
    if (location.hash === "") {
        initializeCourses();
    }
    if (location.hash === "#addCourse") {
        updatePageElement(homeTitle, "Add Course");
        updatePageElement(homeDescription, "Fill in the details of the course below and click the 'Add Course' button to add the course to the list of courses.");
        cardsContainer.classList.add("hidden");
        document.querySelector(".add-course-container").classList.remove("hidden");
        document.querySelector(".main-content-title").classList.add("hidden");
        setRandomImage(); // Set a random image when the page is loaded.
        addCourseForm.querySelectorAll("input").forEach((input) => {
            input.addEventListener("input", () => {
                updatePreviewCard();
            });
        });
        addCourseForm.querySelector("textarea").addEventListener("input", () => {
            updatePreviewCard();
        });
        const imageCheckbox = addCourseForm.querySelector("#image-checkbox");
        const courseImageInput = document.querySelector("#course-image-input");
        imageCheckbox === null || imageCheckbox === void 0 ? void 0 : imageCheckbox.addEventListener("change", () => {
            const isChecked = imageCheckbox.checked;
            courseImageInput.disabled = isChecked;
            courseImageInput.classList.toggle("bg-gray-100", isChecked);
            if (isChecked)
                setRandomImage();
        });
    }
};
function getValidImage() {
    return __awaiter(this, void 0, void 0, function* () {
        let validImage = false;
        let imageUrl = "";
        while (!validImage) {
            imageUrl = `https://picsum.photos/id/${Math.floor(Math.random() * 600)}/600/600`;
            try {
                const response = yield fetch(imageUrl); // Only fetch headers
                if (response.ok)
                    validImage = true; // Image exists if status is 200
            }
            catch (error) { }
        }
        return imageUrl;
    });
}
// Function that sets a random image as the course image when the checkbox is checked.
const setRandomImage = () => {
    let imageUrl = `dsadas`;
    getValidImage().then((url) => {
        imageUrl = url;
        document.querySelector("#course-image-input").value =
            imageUrl;
        previewContainer
            .querySelector("#course-image")
            .setAttribute("src", imageUrl);
    });
};
// Function that updates the text in the page element. Why I added this function is so the fade-in effect will also be applied to the text in the page element.
const updatePageElement = (element, text) => {
    element.textContent = text;
    element.classList.add("fade-in");
};
const updatePreviewCard = () => {
    var _a, _b, _c, _d, _e, _f;
    // Course name
    previewContainer.querySelector(".course-name").textContent = (_a = addCourseForm.querySelector("#course-name-input")) === null || _a === void 0 ? void 0 : _a.value;
    // Description
    previewContainer.querySelector(".course-description").textContent = (_b = addCourseForm.querySelector("#course-description-input")) === null || _b === void 0 ? void 0 : _b.value;
    // Checkboxes
    const checkboxes = [
        { id: "#location-checkbox-1", label: "Campus" },
        { id: "#location-checkbox-2", label: "Online" },
    ];
    const selectedLocations = checkboxes
        .filter(({ id }) => addCourseForm.querySelector(id).checked)
        .map(({ label }) => label)
        .join(" & ");
    previewContainer.querySelector("#course-location").textContent =
        selectedLocations;
    // Image
    const imageInput = addCourseForm.querySelector("#course-image-input");
    const image = imageInput.value;
    try {
        new URL(image);
        previewContainer.querySelector("#course-image").setAttribute("src", image);
    }
    catch (error) { }
    // Instructor
    previewContainer.querySelector("#course-instructor").textContent = (_c = addCourseForm.querySelector("#course-instructor-input")) === null || _c === void 0 ? void 0 : _c.value;
    // Price
    previewContainer.querySelector("#course-price").textContent =
        "$" +
            ((_d = addCourseForm.querySelector("#course-price-input")) === null || _d === void 0 ? void 0 : _d.value);
    // Date
    const startDate = (_e = addCourseForm.querySelector("#course-start-date-input")) === null || _e === void 0 ? void 0 : _e.value;
    const endDate = (_f = addCourseForm.querySelector("#course-end-date-input")) === null || _f === void 0 ? void 0 : _f.value;
    previewContainer.querySelector("#course-date").textContent =
        startDate + " - " + endDate;
};
