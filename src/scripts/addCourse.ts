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

// ---- Imports from other scripts ----
import { addCourse, course, fetchCourse, updateCourse } from "./courses.js";
import showMessageBox from "./errorHandling.js";
import { setTextContent } from "./home.js";

// ---- DOM Elements ----
let addCourseForm: HTMLFormElement;

let addCourseFormName: HTMLInputElement;
let addCourseFormDescription: HTMLTextAreaElement;
let addCourseFormImage: HTMLInputElement;
let addCourseFormLocation1: HTMLInputElement;
let addCourseFormLocation2: HTMLInputElement;
let addCourseFormInstructor: HTMLInputElement;
let addCourseFormPrice: HTMLInputElement;
let addCourseFormStartDate: HTMLInputElement;
let addCourseFormEndDate: HTMLInputElement;

let cardsContainer: HTMLElement;
let previewContainer: HTMLElement;

let coursePreviewImage: HTMLImageElement;
let coursePreviewName: HTMLElement;
let coursePreviewDescription: HTMLElement;
let coursePreviewInstructor: HTMLElement;
let coursePreviewPrice: HTMLElement;
let coursePreviewDate: HTMLElement;
let coursePreviewLocation: HTMLElement;

let homeTitle: HTMLElement;
let homeDescription: HTMLElement;

// Function that loads the add course page.
export const loadAddCoursePage = async () => {
  cardsContainer = document.querySelector(".cards-container") as HTMLElement;
  addCourseForm = document.querySelector(".add-course-form") as HTMLFormElement;
  homeTitle = document.querySelector(".home-title") as HTMLElement;
  homeDescription = document.querySelector(".home-description") as HTMLElement;

  let courseToEditId = location.hash.split("=")[2];
  let edit = location.hash.includes("edit=true");

  let enteredCourseData = {} as course;

  if (edit) {
    enteredCourseData = await fetchCourse(Number(courseToEditId));
  }

  document.querySelector(".add-course-container")!.classList.remove("hidden");

  // Add course form elements *left side*
  addCourseFormName = addCourseForm.querySelector(
    "#course-name-input"
  ) as HTMLInputElement;

  addCourseFormDescription = addCourseForm.querySelector(
    "#course-description-input"
  ) as HTMLTextAreaElement;

  addCourseFormImage = addCourseForm.querySelector(
    "#course-image-input"
  ) as HTMLInputElement;

  addCourseFormInstructor = addCourseForm.querySelector(
    "#course-instructor-input"
  ) as HTMLInputElement;

  addCourseFormPrice = addCourseForm.querySelector(
    "#course-price-input"
  ) as HTMLInputElement;

  addCourseFormStartDate = addCourseForm.querySelector(
    "#course-start-date-input"
  ) as HTMLInputElement;

  addCourseFormEndDate = addCourseForm.querySelector(
    "#course-end-date-input"
  ) as HTMLInputElement;

  addCourseFormLocation1 = addCourseForm.querySelector(
    "#course-checkbox-1"
  ) as HTMLInputElement;

  addCourseFormLocation2 = addCourseForm.querySelector(
    "#course-checkbox-2"
  ) as HTMLInputElement;

  //  Preview card elements *right side*
  previewContainer = document.querySelector(
    ".preview-container"
  ) as HTMLElement;

  coursePreviewImage = previewContainer.querySelector(
    ".course-preview-image"
  ) as HTMLImageElement;

  coursePreviewName = previewContainer.querySelector(
    ".course-preview-name"
  ) as HTMLElement;

  coursePreviewDescription = previewContainer.querySelector(
    ".course-preview-description"
  ) as HTMLElement;

  coursePreviewInstructor = previewContainer.querySelector(
    ".course-preview-instructor"
  ) as HTMLElement;

  coursePreviewPrice = previewContainer.querySelector(
    ".course-preview-price"
  ) as HTMLElement;

  coursePreviewDate = previewContainer.querySelector(
    ".course-preview-date"
  ) as HTMLElement;

  coursePreviewLocation = previewContainer.querySelector(
    ".course-preview-location"
  ) as HTMLElement;

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
    } else if (enteredCourseData.location === "Online") {
      addCourseFormLocation2.checked = true;
    }

    document
      .querySelector("#course-image")!
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

    addCourseForm.querySelector("button")!.textContent = "Update Course";
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
  setTextContent(
    homeDescription,
    edit
      ? "Edit the course information below."
      : "Fill in the details of the course below and click the 'Add Course' button to add the course to the list of courses."
  );

  if (!edit) {
    setRandomImage(); // Set a random image when the page is loaded.
  }
  // Add event listener to the image checkbox to enable or disable the image input.
  const imageCheckbox = addCourseForm.querySelector(
    "#image-checkbox"
  ) as HTMLInputElement;
  const courseImageInput = document.querySelector(
    "#course-image-input"
  ) as HTMLInputElement;

  imageCheckbox?.addEventListener("change", () => {
    const isChecked = imageCheckbox.checked;

    courseImageInput.disabled = isChecked;
    courseImageInput.classList.toggle("bg-gray-100", isChecked);

    if (isChecked) {
      setRandomImage();
    }
  });

  // Add event listener to the add course form to submit the form.
  addCourseForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const locations = [];
    let enteredLocations = "";

    if (!addCourseFormLocation1.checked && !addCourseFormLocation2.checked) {
      showMessageBox("Please select at least one location.", "error");
      return;
    }

    if (addCourseFormLocation1.checked) locations.push("Campus");
    if (addCourseFormLocation2.checked) locations.push("Online");
    enteredLocations = locations.join(" & ");

    let studentsEmpty: boolean = edit ? false : true;

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

      await updateCourse(enteredCourseData);

      showMessageBox("Course updated successfully", "success");

      location.href = "/pages/home.html";
      return;
    } else {
      await addCourse(enteredCourseData);

      showMessageBox("Course added successfully", "success");
    }

    addCourseForm.reset();

    setRandomImage();
  });
};

// Function that fetches a random image from the Picsum API. This function will be used to set a random image as the course image when the checkbox is checked.
async function getValidImage() {
  let validImage = false;
  let imageUrl = "";

  while (!validImage) {
    imageUrl = `https://picsum.photos/id/${Math.floor(
      Math.random() * 600
    )}/600/600`;

    try {
      const response = await fetch(imageUrl);
      if (response.ok) validImage = true;
    } catch (error) {}
  }

  return imageUrl;
}

// Function that sets a random image as the course image when the checkbox is checked.
const setRandomImage = () => {
  let imageUrl = `dsadas`;

  getValidImage().then((url) => {
    imageUrl = url;

    (document.querySelector("#course-image-input") as HTMLInputElement).value =
      imageUrl;

    previewContainer
      .querySelector("#course-image")!
      .setAttribute("src", imageUrl);
  });
};

// Function that updates the preview card when the user types in the form.
const updatePreviewCard = (
  element: HTMLInputElement | HTMLTextAreaElement,
  previewElement: HTMLElement
) => {
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
    const selectedLocations = Array.from(
      document.querySelectorAll<HTMLInputElement>(
        'input[id^="course-checkbox"]:checked'
      )
    )
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
    } catch (error) {
      previewElement.setAttribute("src", "");
    }

    return;
  }

  setTextContent(previewElement, element.value);
};
