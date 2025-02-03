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
import showMessageBox from "./errorHandling.js";
import { addCourse, initializeCourses } from "./courses.js";
let header;
let navbar;
let navbarButton;
let profileName;
let profileRole;
let homeTitle;
let homeDescription;
let addCourseForm;
let addCourseFormName;
let addCourseFormDescription;
let addCourseFormImage;
let addCourseFormLocation1;
let addCourseFormLocation2;
let addCourseFormInstructor;
let addCourseFormPrice;
let addCourseFormStartDate;
let addCourseFormEndDate;
let cardsContainer;
let previewContainer;
let coursePreviewImage;
let coursePreviewName;
let coursePreviewDescription;
let coursePreviewInstructor;
let coursePreviewPrice;
let coursePreviewDate;
let coursePreviewLocation;
let logoutButton = document.querySelector("#logout-button");
let navbarActive = false;
let enteredCourseData = {
    id: "0",
    name: "",
    description: "",
    location: "",
    instructor: "",
    startDate: "",
    endDate: "",
    students: [],
    image: "",
    price: 0,
};
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
const hashChange = () => __awaiter(void 0, void 0, void 0, function* () {
    if (location.hash === "") {
        initializeCourses();
    }
    if (location.hash === "#addCourse") {
        if (authenticatedUser.role !== "admin") {
            alert("You are not authorized to add courses");
            location.href = "/pages/home.html";
            return;
        }
        // Add course form elements *left side*
        addCourseFormName = addCourseForm.querySelector("#course-name-input");
        addCourseFormDescription = addCourseForm.querySelector("#course-description-input");
        addCourseFormImage = addCourseForm.querySelector("#course-image-input");
        addCourseFormInstructor = addCourseForm.querySelector("#course-instructor-input");
        addCourseFormPrice = addCourseForm.querySelector("#course-price-input");
        addCourseFormStartDate = addCourseForm.querySelector("#course-start-date-input");
        addCourseFormEndDate = addCourseForm.querySelector("#course-end-date-input");
        addCourseFormLocation1 = addCourseForm.querySelector("#course-checkbox-1");
        addCourseFormLocation2 = addCourseForm.querySelector("#course-checkbox-2");
        // Add event listeners to the form elements to update the preview card when the user types in the form.
        addCourseFormName.addEventListener("input", () => {
            updatePreviewCard(addCourseFormName, coursePreviewName);
        });
        addCourseFormDescription.addEventListener("input", () => {
            updatePreviewCard(addCourseFormDescription, coursePreviewDescription);
        });
        addCourseFormImage.addEventListener("input", () => {
            updatePreviewCard(addCourseFormImage, coursePreviewImage);
        });
        addCourseFormInstructor.addEventListener("input", () => {
            updatePreviewCard(addCourseFormInstructor, coursePreviewInstructor);
        });
        addCourseFormPrice.addEventListener("input", () => {
            updatePreviewCard(addCourseFormPrice, coursePreviewPrice);
        });
        addCourseFormStartDate.addEventListener("input", () => {
            updatePreviewCard(addCourseFormStartDate, coursePreviewDate);
        });
        addCourseFormEndDate.addEventListener("input", () => {
            updatePreviewCard(addCourseFormEndDate, coursePreviewDate);
        });
        addCourseFormLocation1.addEventListener("change", () => {
            updatePreviewCard(addCourseFormLocation1, coursePreviewLocation);
        });
        addCourseFormLocation2.addEventListener("change", () => {
            updatePreviewCard(addCourseFormLocation2, coursePreviewLocation);
        });
        //  Preview card elements *right side*
        previewContainer = document.querySelector(".preview-container");
        coursePreviewImage = previewContainer.querySelector(".course-preview-image");
        coursePreviewName = previewContainer.querySelector(".course-preview-name");
        coursePreviewDescription = previewContainer.querySelector(".course-preview-description");
        coursePreviewInstructor = previewContainer.querySelector(".course-preview-instructor");
        coursePreviewPrice = previewContainer.querySelector(".course-preview-price");
        coursePreviewDate = previewContainer.querySelector(".course-preview-date");
        coursePreviewLocation = previewContainer.querySelector(".course-preview-location");
        // Set the text content of the page elements.
        setTextContent(homeTitle, "Add Course");
        setTextContent(homeDescription, "Fill in the details of the course below and click the 'Add Course' button to add the course to the list of courses.");
        // Hide the cards container and show the add course form.
        cardsContainer.classList.add("hidden");
        document.querySelector(".add-course-container").classList.remove("hidden");
        document.querySelector(".main-content-title").classList.add("hidden");
        setRandomImage(); // Set a random image when the page is loaded.
        // Add event listener to the image checkbox to enable or disable the image input.
        const imageCheckbox = addCourseForm.querySelector("#image-checkbox");
        const courseImageInput = document.querySelector("#course-image-input");
        imageCheckbox === null || imageCheckbox === void 0 ? void 0 : imageCheckbox.addEventListener("change", () => {
            const isChecked = imageCheckbox.checked;
            courseImageInput.disabled = isChecked;
            courseImageInput.classList.toggle("bg-gray-100", isChecked);
            if (isChecked)
                setRandomImage();
        });
        // Add event listener to the add course form to submit the form.
        addCourseForm.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
            event.preventDefault();
            // // Check if one of the locations is selected.
            // if (
            //   addCourseFormLocation1.checked === false &&
            //   addCourseFormLocation2.checked === false
            // ) {
            //   showMessageBox("Please select at least one location.", "error");
            //   return;
            // }
            const locations = [];
            let enteredLocations = "";
            if (addCourseFormLocation1.checked)
                locations.push("Campus");
            if (addCourseFormLocation2.checked)
                locations.push("Online");
            enteredLocations = locations.join(" & ");
            enteredCourseData.name = addCourseFormName.value;
            enteredCourseData.description = addCourseFormDescription.value;
            enteredCourseData.location = enteredLocations;
            enteredCourseData.instructor = addCourseFormInstructor.value;
            enteredCourseData.startDate = addCourseFormStartDate.value;
            enteredCourseData.endDate = addCourseFormEndDate.value;
            enteredCourseData.students = [];
            enteredCourseData.image = addCourseFormImage.value;
            enteredCourseData.price = parseFloat(addCourseFormPrice.value);
            yield addCourse(enteredCourseData);
            showMessageBox("Course added successfully", "success");
            addCourseForm.reset();
            setRandomImage();
        }));
    }
});
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
const setTextContent = (element, text) => {
    element.textContent = text;
    element.classList.add("fade-in");
};
const updatePreviewCard = (element, previewElement) => {
    const { id, value } = element;
    if (id === "course-price-input") {
        setTextContent(previewElement, `$${value}`);
        return;
    }
    if (id === "course-start-date-input" || id === "course-end-date-input") {
        const startDate = addCourseFormStartDate.value || "";
        const endDate = addCourseFormEndDate.value || "";
        const difference = Date.parse(endDate) - Date.parse(startDate);
        if (difference < 0) {
            showMessageBox("The start date must be before the end date.", "error");
            element.value = "";
            return;
        }
        setTextContent(previewElement, `${startDate} - ${endDate}`);
        return;
    }
    if (id.startsWith("course-checkbox")) {
        const selectedLocations = Array.from(document.querySelectorAll('input[id^="course-checkbox"]:checked'))
            .map((checkbox) => {
            const label = document.querySelector(`label[for="${checkbox.id}"]`);
            return label ? label.textContent : checkbox.value;
        })
            .join(" & ");
        setTextContent(previewElement, selectedLocations);
        return;
    }
    if (id === "course-image-input") {
        try {
            new URL(element.value);
            previewElement.setAttribute("src", element.value);
        }
        catch (error) {
            previewElement.setAttribute("src", "");
        }
        return;
    }
    // previewElement.textContent = element.value;
    setTextContent(previewElement, element.value);
};
