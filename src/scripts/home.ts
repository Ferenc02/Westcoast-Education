import { fetchUser, signOutUser, user } from "./authentication.js";
import { authenticatedUser, updateUserInDatabase } from "./app.js";
import showMessageBox from "./errorHandling.js";
import {
  addCourse,
  course,
  deleteCourse,
  fetchCourse,
  generateCourseCard,
  initializeCourses,
  updateCourse,
} from "./courses.js";

let header: HTMLElement;
let navbar: HTMLElement;
let navbarButton: HTMLElement;

let profileName: HTMLElement;
let profileRole: HTMLElement;
let homeTitle: HTMLElement;
let homeDescription: HTMLElement;
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

let studentsInformationParent =
  document.querySelector(".course-students") || undefined;

let studentsInformationTitle =
  studentsInformationParent?.querySelector(".course-students-title") ||
  undefined;
let studentsInformationList =
  studentsInformationParent?.querySelector(".course-students-list") ||
  undefined;

let logoutButton = document.querySelector(
  "#logout-button"
) as HTMLButtonElement;

let navbarActive = false;

let enteredCourseData: course = {
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

const hashChange = async () => {
  // This hides all the sections except the first one when the hash changes so I don't have to do it manually for each page. The first section is always top part of the page.
  document
    .querySelector("main")!
    .querySelectorAll("section")
    .forEach((section, index) => {
      if (index !== 0) {
        section.classList.add("hidden");
      } else {
        section.classList.remove("hidden");
      }
    });

  if (location.hash === "") {
    loadHomePage();
  }

  if (location.hash === "#addCourse") {
    if (authenticatedUser.role !== "admin") {
      showMessageBox(
        "You do not have permission to access this page.",
        "error"
      );
      location.href = "/pages/home.html";
      return;
    }

    loadAddCoursePage();
  }

  if (location.hash === "#profile") {
    loadProfilePage();
  }

  if (location.hash === "#myCourses") {
    loadEnrolledCoursesPage();
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
};

// Function that shows the enrolled students in a course.
export const showEnrolledStudents = (students: user[], course: course) => {
  studentsInformationParent!.classList.remove("hidden");

  studentsInformationList!.innerHTML = "";

  studentsInformationTitle!.textContent = `Enrolled Students in ${course.name}`;

  students.forEach((student) => {
    let column = document.createElement("tr");
    column.classList.add("border-b-[1px]", "border-gray-200", "bg-white");
    column.setAttribute("data-student-id", student.id.toString());

    let studentColumn = `
                <td class="py-2">${student.name}</td>
                <td>
                  <a href="mailto:${student.email}">${student.email}</a>
                </td>
                <td>${student.phone}</td>
                <td>${student.address}</td>
                <td>
                  <button
                    class="course-students__remove-button cursor-pointer hover:scale-105 transition-transform"
                  >
                    ❌
                  </button>
                </td>
              `;

    column.innerHTML = studentColumn;

    studentsInformationList?.appendChild(column);
  });

  studentsInformationParent?.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    if (target.classList.contains("course-students__remove-button")) {
      const studentRow = target.closest("tr") as HTMLElement;
      const studentId = studentRow.getAttribute("data-student-id");

      let currentUserSelected: user;

      currentUserSelected = students.find(
        (student) => student.id.toString() === studentId
      )!;

      course.students = course.students.filter(
        (student) => student.userId !== currentUserSelected.id.toString()
      );

      currentUserSelected.courses = currentUserSelected.courses.filter(
        (item) => item !== course.id.toString()
      );

      // console.log(currentUserSelected.courses);

      updateUserInDatabase(currentUserSelected);
      updateCourse(course);

      showMessageBox("Student removed successfully", "success");

      studentRow.remove();
    } else if (target.classList.contains("course-students-button")) {
      studentsInformationParent?.classList.add("hidden");
      location.href = "/pages/home.html";
    }
  });

  // console.log(studentsInformationList);
  // studentsInformationTitle.textContent = `Enrolled Students in ${course.name}`;
};

const loadAddCoursePage = async () => {
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

  // Set the text content of the page elements.
  setTextContent(homeTitle, "Add Course");
  setTextContent(
    homeDescription,
    "Fill in the details of the course below and click the 'Add Course' button to add the course to the list of courses."
  );

  // Hide the cards container and show the add course form.
  // cardsContainer.classList.add("hidden");
  // document.querySelector(".add-course-container")!.classList.remove("hidden");
  // document.querySelector(".main-content-title")!.classList.add("hidden");

  setRandomImage(); // Set a random image when the page is loaded.

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

    if (isChecked) setRandomImage();
  });

  // Add event listener to the add course form to submit the form.

  addCourseForm.addEventListener("submit", async (event) => {
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
    if (addCourseFormLocation1.checked) locations.push("Campus");
    if (addCourseFormLocation2.checked) locations.push("Online");
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

    await addCourse(enteredCourseData);

    showMessageBox("Course added successfully", "success");

    addCourseForm.reset();

    setRandomImage();
  });
};

// Function that loads the home page.
const loadHomePage = async () => {
  document.querySelector("#main-content")?.classList.remove("hidden");

  // Add event listeners to the admin panel buttons
  cardsContainer.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;

    // Check if the clicked element is an admin-panel-button
    if (target.classList.contains("admin-panel-button")) {
      target.nextElementSibling?.classList.toggle("hidden");
    }

    // Check if the clicked element is an admin-panel-edit-button
    if (target.classList.contains("admin-panel-edit-button")) {
      // let courseId = target.closest(".course-card")?.getAttribute("course-id");
      // location.href = `/pages/edit-course.html?id=${courseId}`;
    }

    if (target.classList.contains("admin-panel-students-button")) {
      let courseId = target.closest(".course-card")?.getAttribute("course-id");

      let course = await fetchCourse(Number(courseId));

      let students = course.students;

      let enrolledStudents: user[] = [];

      await Promise.all(
        students.map(async (student) => {
          let user = await fetchUser(Number(student.userId));
          enrolledStudents.push(user);
        })
      );

      // console.log(studentNames);

      showEnrolledStudents(enrolledStudents, course);
    }

    // Check if the clicked element is an admin-panel-delete-button
    if (target.classList.contains("admin-panel-delete-button")) {
      let courseId = target.closest(".course-card")?.getAttribute("course-id");

      await deleteCourse(Number(courseId));

      showMessageBox("Course deleted successfully", "success");

      initializeCourses();
    }

    if (target.classList.contains("enroll-button")) {
      let courseId = target.closest(".course-card")?.getAttribute("course-id");

      let course = await fetchCourse(Number(courseId));

      let enrollOption = target.textContent?.trim();

      if (enrollOption === "Cancel Enrollment") {
        course.students = course.students.filter(
          (student) => student.userId !== authenticatedUser.id.toString()
        );

        authenticatedUser.courses = authenticatedUser.courses.filter(
          (course) => course !== courseId
        );

        await updateUserInDatabase(authenticatedUser);

        await updateCourse(course);

        showMessageBox(
          "You have successfully canceled your enrollment",
          "success"
        );
      } else {
        if (
          authenticatedUser.address === "" ||
          authenticatedUser.phone === ""
        ) {
          showMessageBox(
            "Please fill in your address and phone number in the profile page before enrolling in a course",
            "error"
          );
          return;
        }

        if (
          course.students.find(
            (student) => student.userId === authenticatedUser.id.toString()
          )
        ) {
          showMessageBox("You are already enrolled in this course", "error");
          return;
        }

        course.students.push({
          userId: authenticatedUser.id.toString(),
          userChoice: "enrolled",
        });

        authenticatedUser.courses.push(course.id);

        await updateUserInDatabase(authenticatedUser);

        await updateCourse(course);

        showMessageBox(
          "You have successfully enrolled in the course",
          "success"
        );
      }

      initializeCourses();
    }
  });

  initializeCourses();
};

// Function that loads the profile page.
const loadProfilePage = async () => {
  let profileSettingsContainer = document.querySelector(
    ".profile-settings-container"
  ) as HTMLElement;
  let profileSettingsForm = profileSettingsContainer.querySelector(
    ".profile-settings-form"
  ) as HTMLFormElement;

  let profileNameInput = profileSettingsForm.querySelector(
    "#profile-name-input"
  ) as HTMLInputElement;

  let profileEmailInput = profileSettingsForm.querySelector(
    "#profile-email-input"
  ) as HTMLInputElement;

  let profilePhoneInput = profileSettingsForm.querySelector(
    "#profile-phone-input"
  ) as HTMLInputElement;

  let profileAddressInput = profileSettingsForm.querySelector(
    "#profile-address-input"
  ) as HTMLInputElement;

  let profileRoleInput = profileSettingsForm.querySelector(
    "#profile-role-input"
  ) as HTMLSelectElement;

  // Set the text content of the page elements.
  setTextContent(homeTitle, "Profile");
  setTextContent(
    homeDescription,
    "View and update your profile information below."
  );

  // Show the profile settings container
  profileSettingsContainer.classList.remove("hidden");

  profileNameInput.value = authenticatedUser.name;
  profileEmailInput.value = authenticatedUser.email;
  profilePhoneInput.value = authenticatedUser.phone;
  profileAddressInput.value = authenticatedUser.address;
  profileRoleInput.value = authenticatedUser.role;

  // Add event listener to the profile settings form to submit the form.
  profileSettingsForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    authenticatedUser.name = profileNameInput.value;
    authenticatedUser.email = profileEmailInput.value;
    authenticatedUser.phone = profilePhoneInput.value;
    authenticatedUser.address = profileAddressInput.value;
    authenticatedUser.role = profileRoleInput.value;

    await updateUserInDatabase(authenticatedUser);

    showMessageBox("Profile updated successfully", "success");

    updateText();
  });
};

const loadEnrolledCoursesPage = async () => {
  setTextContent(homeTitle, "My Courses");
  setTextContent(
    homeDescription,
    "View the courses you are enrolled in below."
  );

  let enrolledCourses = authenticatedUser.courses;

  let courses: course[] = [];

  await Promise.all(
    enrolledCourses.map(async (courseId) => {
      let course = await fetchCourse(Number(courseId));
      courses.push(course);
    })
  );

  cardsContainer.innerHTML = "";

  courses.forEach((course) => {
    let card = generateCourseCard(course);
    document.querySelector(".enrolled-courses-container")!.innerHTML += card;
  });

  document
    .querySelector(".enrolled-courses-container")!
    .classList.remove("hidden");
};
