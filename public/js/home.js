var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchUser, signOutUser } from "./authentication.js";
import { authenticatedUser, updateUserInDatabase } from "./app.js";
import showMessageBox from "./errorHandling.js";
import { addCourse, deleteCourse, fetchCourse, initializeCourses, updateCourse, } from "./courses.js";
let cardsContainerEventListenerAdded = false;
let header;
let navbar;
let navbarButton;
let mainContent;
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
let supportContainer;
let studentsInformationParent = document.querySelector(".course-students") || undefined;
let studentsInformationTitle = (studentsInformationParent === null || studentsInformationParent === void 0 ? void 0 : studentsInformationParent.querySelector(".course-students-title")) ||
    undefined;
let studentsInformationList = (studentsInformationParent === null || studentsInformationParent === void 0 ? void 0 : studentsInformationParent.querySelector(".course-students-list")) ||
    undefined;
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
    supportContainer = document.querySelector(".support-container");
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
        loadHomePage(false);
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
        setTextContent(homeDescription, "Support page to help you with any issues.");
        supportContainer.classList.remove("hidden");
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
    studentsInformationParent === null || studentsInformationParent === void 0 ? void 0 : studentsInformationParent.addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("course-students__remove-button")) {
            const studentRow = target.closest("tr");
            const studentId = studentRow.getAttribute("data-student-id");
            let currentUserSelected;
            currentUserSelected = students.find((student) => student.id.toString() === studentId);
            course.students = course.students.filter((student) => student.userId !== currentUserSelected.id.toString());
            currentUserSelected.courses = currentUserSelected.courses.filter((item) => item !== course.id.toString());
            // console.log(currentUserSelected.courses);
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
    // console.log(studentsInformationList);
    // studentsInformationTitle.textContent = `Enrolled Students in ${course.name}`;
};
const loadAddCoursePage = (courseToEdit) => __awaiter(void 0, void 0, void 0, function* () {
    let courseToEditId = location.hash.split("=")[2];
    let enteredCourseData = yield fetchCourse(Number(courseToEditId));
    let edit = location.hash.includes("edit=true");
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
    // Hide the cards container and show the add course form.
    // cardsContainer.classList.add("hidden");
    // document.querySelector(".add-course-container")!.classList.remove("hidden");
    // document.querySelector(".main-content-title")!.classList.add("hidden");
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
        if (!addCourseFormLocation1.checked && !addCourseFormLocation2.checked) {
            showMessageBox("Please select at least one location.", "error");
            return;
        }
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
        enteredCourseData.students =
            enteredCourseData.students.length === 0 ? [] : enteredCourseData.students;
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
// Function that loads the home page.
const loadHomePage = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    mainContent = document.querySelector("#main-content");
    mainContent.classList.remove("hidden");
    if (!cardsContainerEventListenerAdded) {
        cardsContainerEventListenerAdded = true;
        // Add event listeners to the whole cards container to handle the button clicks.
        cardsContainer.addEventListener("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const target = event.target;
            console.log(target);
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
                // console.log(studentNames);
                showEnrolledStudents(enrolledStudents, course);
            }
            // Check if the clicked element is an admin-panel-delete-button
            if (target.classList.contains("admin-panel-delete-button")) {
                let courseId = (_d = target
                    .closest(".course-card")) === null || _d === void 0 ? void 0 : _d.getAttribute("course-id");
                yield deleteCourse(Number(courseId));
                showMessageBox("Course deleted successfully", "success");
                initializeCourses(filter);
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
                initializeCourses(filter);
            }
        }));
    }
    initializeCourses(filter);
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
        updateText();
    }));
});
const loadEnrolledCoursesPage = () => __awaiter(void 0, void 0, void 0, function* () {
    setTextContent(homeTitle, "My Courses");
    setTextContent(homeDescription, "View the courses you are enrolled in below.");
    yield loadHomePage(true);
});
