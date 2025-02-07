/*
 * home.ts - Core Homepage Functionality
 *
 * This script **handles all the necessary logic** for the homepage, including:
 * - **Initializing the homepage** when loaded.
 * - **Updating the UI** with user-specific data, such as name and role.
 * - **Handling navigation events**, ensuring the correct page loads when the URL hash changes.
 * - **Managing course-related actions**, such as setting images, previewing courses, and showing enrolled students.
 *
 * ⚠ **Note**: This script **should have been split into smaller modules**, but due to time constraints,
 * everything remains in a single file. Ideally, functionalities like user handling, course management, and
 * navigation should be separated into different files for better maintainability.
 */

// ---- imports from other scripts ----
import { fetchUser, signOutUser, user } from "./authentication.js";
import { authenticatedUser, updateUserInDatabase } from "./app.js";
import showMessageBox from "./errorHandling.js";
import {
  course,
  deleteCourse,
  fetchCourse,
  initializeCourses,
  updateCourse,
} from "./courses.js";
import { loadAddCoursePage } from "./addCourse.js";

// ---- Global variables ----
let cardsContainerEventListenerAdded = false;
let navbarActive = false;

// ---- DOM elements ----
let header: HTMLElement;
let navbar: HTMLElement;
let navbarButton: HTMLElement;

let mainContent: HTMLElement;

let profileName: HTMLElement;
let profileRole: HTMLElement;
let homeTitle: HTMLElement;
let homeDescription: HTMLElement;

let supportContainer: HTMLElement;
let cardsContainer: HTMLElement;

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

// Function to initialize the home page. This function will be called when the home page is loaded in app.ts.
export const initializeHome = () => {
  // ---- Get all the necessary DOM elements ----
  header = document.querySelector("header") as HTMLElement;
  navbar = document.querySelector("nav") as HTMLElement;
  navbarButton = document.querySelector("#home-navbar-button") as HTMLElement;
  profileName = navbar.querySelector(".profile-name") as HTMLElement;
  profileRole = navbar.querySelector(".profile-role") as HTMLElement;
  homeTitle = document.querySelector(".home-title") as HTMLElement;
  homeDescription = document.querySelector(".home-description") as HTMLElement;
  cardsContainer = document.querySelector(".cards-container") as HTMLElement;

  supportContainer = document.querySelector(
    ".support-container"
  ) as HTMLElement;

  // Add event listeners to the navbar button and the logout button.
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

      if (x > navbar.offsetWidth) {
        toggleNavbar();
      }
    }
  });

  updateHomePageText();

  hashChange();
  window.addEventListener("hashchange", hashChange);
};

// Function that updates all the text in the site to the authenticated user's name and role. This will always be authenticated since the user has to be authenticated to access the home page.
const updateHomePageText = () => {
  profileName.textContent = authenticatedUser.name;
  profileRole.textContent =
    authenticatedUser.role === "admin" ? "administrator" : "User";

  homeTitle.textContent = `Welcome, ${authenticatedUser.name}!`;
};

// Function that toggles the navbar when the navbar button is clicked.
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

// Function that handles the hash change event. This function will be called when the hash changes (when the user navigates to a different page).
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

  if (location.hash.includes("#addCourse")) {
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
  if (location.hash === "#support") {
    setTextContent(homeTitle, "Support");
    setTextContent(
      homeDescription,
      "Support page to help you with any issues. Here you can find the roles of the users and the features they have access to."
    );
    supportContainer.classList.remove("hidden");
  }
};

// Function that updates the text in the page element. Why I added this function is so the fade-in effect will also be applied to the text in the page element.
export const setTextContent = (element: HTMLElement, text: string) => {
  element.textContent = text;
  element.classList.add("fade-in");
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

  // Add event listener to the remove button to remove the student from the course.
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

      updateUserInDatabase(currentUserSelected);
      updateCourse(course);

      showMessageBox("Student removed successfully", "success");

      studentRow.remove();
    } else if (target.classList.contains("course-students-button")) {
      studentsInformationParent?.classList.add("hidden");
      location.href = "/pages/home.html";
    }
  });
};

// Function that loads the home page.
const loadHomePage = async () => {
  mainContent = document.querySelector("#main-content") as HTMLElement;
  mainContent.classList.remove("hidden");

  if (!cardsContainerEventListenerAdded) {
    cardsContainerEventListenerAdded = true;

    // Add event listeners to the whole cards container to handle the button clicks.
    cardsContainer.addEventListener("click", async (event) => {
      const target = event.target as HTMLElement;

      // Check if the clicked element is an admin-panel-button
      if (target.classList.contains("admin-panel-button")) {
        target.nextElementSibling?.classList.toggle("hidden");
      }

      // Check if the clicked element is an admin-panel-edit-button
      if (target.classList.contains("admin-panel-edit-button")) {
        let courseToChangeId = target
          .closest(".course-card")
          ?.getAttribute("course-id");

        location.href = `#addCourse?edit=true&id=${courseToChangeId}`;
      }

      if (target.classList.contains("admin-panel-students-button")) {
        let courseId = target
          .closest(".course-card")
          ?.getAttribute("course-id");

        let course = await fetchCourse(Number(courseId));

        let students = course.students;

        let enrolledStudents: user[] = [];

        await Promise.all(
          students.map(async (student) => {
            let user = await fetchUser(Number(student.userId));
            enrolledStudents.push(user);
          })
        );

        showEnrolledStudents(enrolledStudents, course);
      }

      // Check if the clicked element is an admin-panel-delete-button
      if (target.classList.contains("admin-panel-delete-button")) {
        let courseId = target
          .closest(".course-card")
          ?.getAttribute("course-id");

        await deleteCourse(Number(courseId));

        showMessageBox("Course deleted successfully", "success");

        initializeCourses();
      }

      if (target.classList.contains("enroll-button")) {
        let courseId = target
          .closest(".course-card")
          ?.getAttribute("course-id");

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
  }

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

    updateHomePageText();
  });
};
// Function that loads the enrolled courses page. (My Courses)
const loadEnrolledCoursesPage = async () => {
  setTextContent(homeTitle, "My Courses");
  setTextContent(
    homeDescription,
    "View the courses you are enrolled in below."
  );

  await loadHomePage();

  location.href = "/pages/home.html#myCourses";
};
