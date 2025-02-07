/*
 * addCourse.ts
 * This script handles the functionality of the "Add Course" page, allowing users to add or edit courses.
 * It manages form input fields, previews the course details dynamically, and interacts with external modules
 * for data handling, including adding and updating course information.
 *
 * Features:
 * - Dynamically populates the course form when editing an existing course.
 * - Updates a live course preview as the user fills out the form.
 * - Provides validation for required fields like name, description, price, and location.
 * - Generates a random course image when the user selects the corresponding option.
 * - Submits course data for creation or updates an existing course entry.
 * - Displays success or error messages for user feedback.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// ---- Imports from other scripts ----
import { addCourse, fetchCourse, updateCourse } from "./courses.js";
import showMessageBox from "./errorHandling.js";
import { setTextContent } from "./home.js";
// ---- DOM Elements ----
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
let homeTitle;
let homeDescription;
// Function that loads the add course page.
export const loadAddCoursePage = () => __awaiter(void 0, void 0, void 0, function* () {
    cardsContainer = document.querySelector(".cards-container");
    addCourseForm = document.querySelector(".add-course-form");
    homeTitle = document.querySelector(".home-title");
    homeDescription = document.querySelector(".home-description");
    let courseToEditId = location.hash.split("=")[2];
    let edit = location.hash.includes("edit=true");
    let enteredCourseData = {};
    if (edit) {
        enteredCourseData = yield fetchCourse(Number(courseToEditId));
    }
    document.querySelector(".add-course-container").classList.remove("hidden");
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
    //  Preview card elements *right side*
    previewContainer = document.querySelector(".preview-container");
    coursePreviewImage = previewContainer.querySelector(".course-preview-image");
    coursePreviewName = previewContainer.querySelector(".course-preview-name");
    coursePreviewDescription = previewContainer.querySelector(".course-preview-description");
    coursePreviewInstructor = previewContainer.querySelector(".course-preview-instructor");
    coursePreviewPrice = previewContainer.querySelector(".course-preview-price");
    coursePreviewDate = previewContainer.querySelector(".course-preview-date");
    coursePreviewLocation = previewContainer.querySelector(".course-preview-location");
    if (edit) {
        addCourseFormName.value = enteredCourseData.name;
        addCourseFormDescription.value = enteredCourseData.description;
        addCourseFormImage.value = enteredCourseData.image;
        addCourseFormInstructor.value = enteredCourseData.instructor;
        addCourseFormPrice.value = enteredCourseData.price.toString();
        addCourseFormStartDate.value = enteredCourseData.startDate;
        addCourseFormEndDate.value = enteredCourseData.endDate;
        if (enteredCourseData.location === "Campus") {
            addCourseFormLocation1.checked = true;
        }
        else if (enteredCourseData.location === "Online") {
            addCourseFormLocation2.checked = true;
        }
        document
            .querySelector("#course-image")
            .setAttribute("src", enteredCourseData.image);
        coursePreviewName.textContent = enteredCourseData.name;
        coursePreviewDescription.textContent = enteredCourseData.description;
        coursePreviewImage.setAttribute("src", enteredCourseData.image);
        coursePreviewInstructor.textContent = enteredCourseData.instructor;
        coursePreviewPrice.textContent = enteredCourseData.price.toString();
        coursePreviewDate.textContent = `${enteredCourseData.startDate} - ${enteredCourseData.endDate}`;
        coursePreviewLocation.textContent = enteredCourseData.location
            .split(" & ")
            .join(", ");
        addCourseForm.querySelector("button").textContent = "Update Course";
    }
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
    // Set the text content of the page elements.
    setTextContent(homeTitle, edit ? "Edit Course" : "Add Course");
    setTextContent(homeDescription, edit
        ? "Edit the course information below."
        : "Fill in the details of the course below and click the 'Add Course' button to add the course to the list of courses.");
    if (!edit) {
        setRandomImage(); // Set a random image when the page is loaded.
    }
    // Add event listener to the image checkbox to enable or disable the image input.
    const imageCheckbox = addCourseForm.querySelector("#image-checkbox");
    const courseImageInput = document.querySelector("#course-image-input");
    imageCheckbox === null || imageCheckbox === void 0 ? void 0 : imageCheckbox.addEventListener("change", () => {
        const isChecked = imageCheckbox.checked;
        courseImageInput.disabled = isChecked;
        courseImageInput.classList.toggle("bg-gray-100", isChecked);
        if (isChecked) {
            setRandomImage();
        }
    });
    // Add event listener to the add course form to submit the form.
    addCourseForm.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const locations = [];
        let enteredLocations = "";
        if (!addCourseFormLocation1.checked && !addCourseFormLocation2.checked) {
            showMessageBox("Please select at least one location.", "error");
            return;
        }
        if (addCourseFormLocation1.checked)
            locations.push("Campus");
        if (addCourseFormLocation2.checked)
            locations.push("Online");
        enteredLocations = locations.join(" & ");
        let studentsEmpty = edit ? false : true;
        enteredCourseData.name = addCourseFormName.value;
        enteredCourseData.description = addCourseFormDescription.value;
        enteredCourseData.location = enteredLocations;
        enteredCourseData.instructor = addCourseFormInstructor.value;
        enteredCourseData.startDate = addCourseFormStartDate.value;
        enteredCourseData.endDate = addCourseFormEndDate.value;
        enteredCourseData.students = studentsEmpty
            ? []
            : enteredCourseData.students;
        enteredCourseData.image = addCourseFormImage.value;
        enteredCourseData.price = parseFloat(addCourseFormPrice.value);
        if (edit) {
            enteredCourseData.id = courseToEditId;
            yield updateCourse(enteredCourseData);
            showMessageBox("Course updated successfully", "success");
            location.href = "/pages/home.html";
            return;
        }
        else {
            yield addCourse(enteredCourseData);
            showMessageBox("Course added successfully", "success");
        }
        addCourseForm.reset();
        setRandomImage();
    }));
});
// Function that fetches a random image from the Picsum API. This function will be used to set a random image as the course image when the checkbox is checked.
function getValidImage() {
    return __awaiter(this, void 0, void 0, function* () {
        let validImage = false;
        let imageUrl = "";
        while (!validImage) {
            imageUrl = `https://picsum.photos/id/${Math.floor(Math.random() * 600)}/600/600`;
            try {
                const response = yield fetch(imageUrl);
                if (response.ok)
                    validImage = true;
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
// Function that updates the preview card when the user types in the form.
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
    setTextContent(previewElement, element.value);
};
