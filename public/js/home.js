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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// ---- imports from other scripts ----
import { fetchUser, signOutUser } from "./authentication.js";
import { authenticatedUser, updateUserInDatabase } from "./app.js";
import showMessageBox from "./errorHandling.js";
import { deleteCourse, fetchCourse, initializeCourses, updateCourse, } from "./courses.js";
import { loadAddCoursePage } from "./addCourse.js";
// ---- Global variables ----
let cardsContainerEventListenerAdded = false;
let navbarActive = false;
// ---- DOM elements ----
let header;
let navbar;
let navbarButton;
let mainContent;
let profileName;
let profileRole;
let homeTitle;
let homeDescription;
let supportContainer;
let cardsContainer;
let studentsInformationParent = document.querySelector(".course-students") || undefined;
let studentsInformationTitle = (studentsInformationParent === null || studentsInformationParent === void 0 ? void 0 : studentsInformationParent.querySelector(".course-students-title")) ||
    undefined;
let studentsInformationList = (studentsInformationParent === null || studentsInformationParent === void 0 ? void 0 : studentsInformationParent.querySelector(".course-students-list")) ||
    undefined;
let logoutButton = document.querySelector("#logout-button");
// Function to initialize the home page. This function will be called when the home page is loaded in app.ts.
export const initializeHome = () => {
    // ---- Get all the necessary DOM elements ----
    header = document.querySelector("header");
    navbar = document.querySelector("nav");
    navbarButton = document.querySelector("#home-navbar-button");
    profileName = navbar.querySelector(".profile-name");
    profileRole = navbar.querySelector(".profile-role");
    homeTitle = document.querySelector(".home-title");
    homeDescription = document.querySelector(".home-description");
    cardsContainer = document.querySelector(".cards-container");
    supportContainer = document.querySelector(".support-container");
    // Add event listeners to the navbar button and the logout button.
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
// Function that handles the hash change event. This function will be called when the hash changes (when the user navigates to a different page).
const hashChange = () => __awaiter(void 0, void 0, void 0, function* () {
    // This hides all the sections except the first one when the hash changes so I don't have to do it manually for each page. The first section is always top part of the page.
    document
        .querySelector("main")
        .querySelectorAll("section")
        .forEach((section, index) => {
        if (index !== 0) {
            section.classList.add("hidden");
        }
        else {
            section.classList.remove("hidden");
        }
    });
    if (location.hash === "") {
        loadHomePage();
    }
    if (location.hash.includes("#addCourse")) {
        if (authenticatedUser.role !== "admin") {
            showMessageBox("You do not have permission to access this page.", "error");
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
        setTextContent(homeDescription, "Support page to help you with any issues. Here you can find the roles of the users and the features they have access to.");
        supportContainer.classList.remove("hidden");
    }
});
// Function that updates the text in the page element. Why I added this function is so the fade-in effect will also be applied to the text in the page element.
export const setTextContent = (element, text) => {
    element.textContent = text;
    element.classList.add("fade-in");
};
// Function that shows the enrolled students in a course.
export const showEnrolledStudents = (students, course) => {
    studentsInformationParent.classList.remove("hidden");
    studentsInformationList.innerHTML = "";
    studentsInformationTitle.textContent = `Enrolled Students in ${course.name}`;
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
        studentsInformationList === null || studentsInformationList === void 0 ? void 0 : studentsInformationList.appendChild(column);
    });
    // Add event listener to the remove button to remove the student from the course.
    studentsInformationParent === null || studentsInformationParent === void 0 ? void 0 : studentsInformationParent.addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("course-students__remove-button")) {
            const studentRow = target.closest("tr");
            const studentId = studentRow.getAttribute("data-student-id");
            let currentUserSelected;
            currentUserSelected = students.find((student) => student.id.toString() === studentId);
            course.students = course.students.filter((student) => student.userId !== currentUserSelected.id.toString());
            currentUserSelected.courses = currentUserSelected.courses.filter((item) => item !== course.id.toString());
            updateUserInDatabase(currentUserSelected);
            updateCourse(course);
            showMessageBox("Student removed successfully", "success");
            studentRow.remove();
        }
        else if (target.classList.contains("course-students-button")) {
            studentsInformationParent === null || studentsInformationParent === void 0 ? void 0 : studentsInformationParent.classList.add("hidden");
            location.href = "/pages/home.html";
        }
    });
};
// Function that loads the home page.
const loadHomePage = () => __awaiter(void 0, void 0, void 0, function* () {
    mainContent = document.querySelector("#main-content");
    mainContent.classList.remove("hidden");
    if (!cardsContainerEventListenerAdded) {
        cardsContainerEventListenerAdded = true;
        // Add event listeners to the whole cards container to handle the button clicks.
        cardsContainer.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const target = event.target;
            // Check if the clicked element is an admin-panel-button
            if (target.classList.contains("admin-panel-button")) {
                (_a = target.nextElementSibling) === null || _a === void 0 ? void 0 : _a.classList.toggle("hidden");
            }
            // Check if the clicked element is an admin-panel-edit-button
            if (target.classList.contains("admin-panel-edit-button")) {
                let courseToChangeId = (_b = target
                    .closest(".course-card")) === null || _b === void 0 ? void 0 : _b.getAttribute("course-id");
                location.href = `#addCourse?edit=true&id=${courseToChangeId}`;
            }
            if (target.classList.contains("admin-panel-students-button")) {
                let courseId = (_c = target
                    .closest(".course-card")) === null || _c === void 0 ? void 0 : _c.getAttribute("course-id");
                let course = yield fetchCourse(Number(courseId));
                let students = course.students;
                let enrolledStudents = [];
                yield Promise.all(students.map((student) => __awaiter(void 0, void 0, void 0, function* () {
                    let user = yield fetchUser(Number(student.userId));
                    enrolledStudents.push(user);
                })));
                showEnrolledStudents(enrolledStudents, course);
            }
            // Check if the clicked element is an admin-panel-delete-button
            if (target.classList.contains("admin-panel-delete-button")) {
                let courseId = (_d = target
                    .closest(".course-card")) === null || _d === void 0 ? void 0 : _d.getAttribute("course-id");
                yield deleteCourse(Number(courseId));
                showMessageBox("Course deleted successfully", "success");
                initializeCourses();
            }
            if (target.classList.contains("enroll-button")) {
                let courseId = (_e = target
                    .closest(".course-card")) === null || _e === void 0 ? void 0 : _e.getAttribute("course-id");
                let course = yield fetchCourse(Number(courseId));
                let enrollOption = (_f = target.textContent) === null || _f === void 0 ? void 0 : _f.trim();
                if (enrollOption === "Cancel Enrollment") {
                    course.students = course.students.filter((student) => student.userId !== authenticatedUser.id.toString());
                    authenticatedUser.courses = authenticatedUser.courses.filter((course) => course !== courseId);
                    yield updateUserInDatabase(authenticatedUser);
                    yield updateCourse(course);
                    showMessageBox("You have successfully canceled your enrollment", "success");
                }
                else {
                    if (authenticatedUser.address === "" ||
                        authenticatedUser.phone === "") {
                        showMessageBox("Please fill in your address and phone number in the profile page before enrolling in a course", "error");
                        return;
                    }
                    if (course.students.find((student) => student.userId === authenticatedUser.id.toString())) {
                        showMessageBox("You are already enrolled in this course", "error");
                        return;
                    }
                    course.students.push({
                        userId: authenticatedUser.id.toString(),
                        userChoice: "enrolled",
                    });
                    authenticatedUser.courses.push(course.id);
                    yield updateUserInDatabase(authenticatedUser);
                    yield updateCourse(course);
                    showMessageBox("You have successfully enrolled in the course", "success");
                }
                initializeCourses();
            }
        }));
    }
    initializeCourses();
});
// Function that loads the profile page.
const loadProfilePage = () => __awaiter(void 0, void 0, void 0, function* () {
    let profileSettingsContainer = document.querySelector(".profile-settings-container");
    let profileSettingsForm = profileSettingsContainer.querySelector(".profile-settings-form");
    let profileNameInput = profileSettingsForm.querySelector("#profile-name-input");
    let profileEmailInput = profileSettingsForm.querySelector("#profile-email-input");
    let profilePhoneInput = profileSettingsForm.querySelector("#profile-phone-input");
    let profileAddressInput = profileSettingsForm.querySelector("#profile-address-input");
    let profileRoleInput = profileSettingsForm.querySelector("#profile-role-input");
    // Set the text content of the page elements.
    setTextContent(homeTitle, "Profile");
    setTextContent(homeDescription, "View and update your profile information below.");
    // Show the profile settings container
    profileSettingsContainer.classList.remove("hidden");
    profileNameInput.value = authenticatedUser.name;
    profileEmailInput.value = authenticatedUser.email;
    profilePhoneInput.value = authenticatedUser.phone;
    profileAddressInput.value = authenticatedUser.address;
    profileRoleInput.value = authenticatedUser.role;
    // Add event listener to the profile settings form to submit the form.
    profileSettingsForm.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        authenticatedUser.name = profileNameInput.value;
        authenticatedUser.email = profileEmailInput.value;
        authenticatedUser.phone = profilePhoneInput.value;
        authenticatedUser.address = profileAddressInput.value;
        authenticatedUser.role = profileRoleInput.value;
        yield updateUserInDatabase(authenticatedUser);
        showMessageBox("Profile updated successfully", "success");
        updateHomePageText();
    }));
});
// Function that loads the enrolled courses page. (My Courses)
const loadEnrolledCoursesPage = () => __awaiter(void 0, void 0, void 0, function* () {
    setTextContent(homeTitle, "My Courses");
    setTextContent(homeDescription, "View the courses you are enrolled in below.");
    yield loadHomePage();
    location.href = "/pages/home.html#myCourses";
});
