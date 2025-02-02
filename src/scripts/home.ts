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

    //  Preview card elements
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

    setTextContent(homeTitle, "Add Course");
    setTextContent(
      homeDescription,
      "Fill in the details of the course below and click the 'Add Course' button to add the course to the list of courses."
    );

    cardsContainer.classList.add("hidden");
    document.querySelector(".add-course-container")!.classList.remove("hidden");
    document.querySelector(".main-content-title")!.classList.add("hidden");

    setRandomImage(); // Set a random image when the page is loaded.

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

      if (isChecked) setRandomImage();
    });
  }
};

async function getValidImage() {
  let validImage = false;
  let imageUrl = "";

  while (!validImage) {
    imageUrl = `https://picsum.photos/id/${Math.floor(
      Math.random() * 600
    )}/600/600`;

    try {
      const response = await fetch(imageUrl); // Only fetch headers
      if (response.ok) validImage = true; // Image exists if status is 200
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

// Function that updates the text in the page element. Why I added this function is so the fade-in effect will also be applied to the text in the page element.
const setTextContent = (element: HTMLElement, text: string) => {
  element.textContent = text;
  element.classList.add("fade-in");
};

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

  // previewElement.textContent = element.value;

  setTextContent(previewElement, element.value);

  // // Checkboxes
  // const checkboxes = [
  //   { id: "#location-checkbox-1", label: "Campus" },
  //   { id: "#location-checkbox-2", label: "Online" },
  // ];

  // const selectedLocations = checkboxes
  //   .filter(
  //     ({ id }) => (addCourseForm.querySelector(id) as HTMLInputElement).checked
  //   )
  //   .map(({ label }) => label)
  //   .join(" & ");

  // previewContainer.querySelector("#course-location")!.textContent =
  //   selectedLocations;

  // // Image
  // const imageInput = addCourseForm.querySelector(
  //   "#course-image-input"
  // ) as HTMLInputElement;

  // const image = imageInput.value;

  // try {
  //   new URL(image);
  //   previewContainer.querySelector("#course-image")!.setAttribute("src", image);
  // } catch (error) {}

  // // Instructor
  // previewContainer.querySelector("#course-instructor")!.textContent = (
  //   addCourseForm.querySelector("#course-instructor-input") as HTMLInputElement
  // )?.value;

  // // Price
  // previewContainer.querySelector("#course-price")!.textContent =
  //   "$" +
  //   (addCourseForm.querySelector("#course-price-input") as HTMLInputElement)
  //     ?.value;

  // // Date

  // const startDate = (
  //   addCourseForm.querySelector("#course-start-date-input") as HTMLInputElement
  // )?.value;

  // const endDate = (
  //   addCourseForm.querySelector("#course-end-date-input") as HTMLInputElement
  // )?.value;

  // previewContainer.querySelector("#course-date")!.textContent =
  //   startDate + " - " + endDate;
};
