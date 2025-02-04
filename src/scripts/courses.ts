import { authenticatedUser, updateUserInDatabase } from "./app.js";
import { fetchUser, user } from "./authentication.js";
import showMessageBox from "./errorHandling.js";
import { showEnrolledStudents } from "./home.js";

export interface course {
  id: string;
  name: string;
  description: string;
  location: string;
  instructor: string;
  startDate: string;
  endDate: string;
  students: Array<{ userId: string; userChoice: string }>;
  image: string;
  price: number;
}

let cardsContainer = document.querySelector(".cards-container") as HTMLElement;

let testFunction = () => {
  alert("test");
};

// Function that generates a course card with the course information and appends it to the cards container.
export const generateCourseCard = (course: course) => {
  let adminPanel = `
  
  <div class="flex flex-col justify-end items-end bg-white  !text-gray-800">
  
 
  <button  class="admin-panel-button material-symbols-outlined !text-gray-600 cursor-pointer hover:bg-gray-200 rounded-full p-2 ">more_vert</button>
  
  <div class="admin-panel-buttons hidden flex flex-col absolute top-0 right-0 mt-[4.25rem] w-full bg-white rounded-lg shadow-md !text-gray-800 fade-in">

  <button class="admin-panel-students-button button !justify-start !text-gray-800 bg-white hover:bg-gray-100 !border-[1px]  !border-gray-200 transition-colors !rounded-none">
👥 View Students</button> 
  <button class="admin-panel-edit-button button !justify-start bg-white !text-gray-800 hover:bg-gray-100 !border-b-[1px] !border-x-[1px] !border-gray-200 transition-colors !rounded-none">✏️ Edit Course</button>
  <button class="admin-panel-delete-button button !justify-start bg-red-500 text-white hover:bg-red-600 transition-colors !border-b-[1px] !border-x-[1px] !border-red-500 !rounded-none !rounded-b-lg">❌ Delete Course</button>
  
  </div>
  </div>
  `;

  let userEnrolled = authenticatedUser.courses.includes(course.id);
  // console.log(userEnrolled);

  let cardElement = `<div course-id="${course.id}"
            class="course-card fade-in flex flex-col w-full bg-white rounded-lg shadow-md p-4 gap-4  transition-transform relative"
          >
            ${authenticatedUser.role === "admin" ? adminPanel : ""}
            <img
              src="${course.image}"
              alt="course 1"
              class="max-h-60 object-cover rounded-lg object-center"
            />
            <h3 class="text-lg font-semibold text-gray-900 capitalize subpixel-antialiased">
              ${course.name}
            </h3>
            <p class="text-gray-700 mt-2 h-full overflow-hidden max-h-36 subpixel-antialiased">
                ${course.description}
            </p>
            <div class="flex justify-between items-center mt-4">
              <p class="text-gray-600 font-medium">$${course.price}</p>
              <div class="flex gap-2 text-gray-600">
              <span class="material-symbols-outlined">
              groups
              </span>
              <p class=" font-medium">${course.instructor}</p>
              </div>
            </div>
            <button
              class="button w-full   text-white  transition-colors enroll-button ${
                userEnrolled
                  ? "!bg-red-500  hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }"
            >
              ${userEnrolled ? "Cancel Enrollment" : "Enroll Now"}
            </button>
            <div
              class="course-info flex w-full justify-between px-2 text-sm text-gray-600 font-medium"
              
            >
              <p class="course-date">${course.startDate} - ${
    course.endDate
  } </p>
              <p class="course-location">${course.location}</p>
            </div>
          </div>`;

  cardsContainer.innerHTML += cardElement;

  // document.querySelector(".course-card:last-child")?.prepend(adminPanelElement);
};

// Function that fetches the courses from the server.
export const fetchCourses = async (): Promise<Array<course>> => {
  let response = await fetch("http://localhost:3000/courses");

  let courses: Array<course> = await response.json();

  return courses;
};
//  Function that fetches a single course from the server.
export const fetchCourse = async (id: number): Promise<course> => {
  let response = await fetch(`http://localhost:3000/courses/${id}`);

  let course: course = await response.json();

  return course;
};
// Function that updates a course on the server.
export const updateCourse = async (course: course) => {
  await fetch(`http://localhost:3000/courses/${course.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(course),
  });
};

// Function that creates a course and posts it to the server.
export const addCourse = async (course: course) => {
  if (authenticatedUser.role !== "admin") {
    showMessageBox("You are not authorized to add courses", "error");
    return;
  }

  let coursesLength = (await fetchCourses()).length;

  course.id = (coursesLength + 1).toString();

  await fetch(`http://localhost:3000/courses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(course),
  });
};

// Function that deletes a course from the server.
const deleteCourse = async (id: number) => {
  if (authenticatedUser.role !== "admin") {
    showMessageBox("You are not authorized to delete courses", "error");
    return;
  }

  await fetch(`http://localhost:3000/courses/${id}`, {
    method: "DELETE",
  });
};

// Function that fetches the courses from the server and generates course cards for each course.
export const initializeCourses = async () => {
  // Show a loading spinner while the courses are being fetched.
  cardsContainer.innerHTML = `<div role="status" class="flex items-center gap-4 ">  
    <svg aria-hidden="true" class="text-xl w-16 h-16 text-gray-200 animate-spin dark:text-gray-400 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span class="sr-only">Loading...</span>
    <h3>Loading courses...</h3>
</div>`;

  let courses = await fetchCourses();

  // Remove the loading spinner after the courses have been fetched.
  cardsContainer.innerHTML = "";

  courses.forEach((course) => {
    generateCourseCard(course);
  });

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

      alert("Course deleted successfully");
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

        alert("You have successfully canceled your enrollment");
      } else {
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

        alert("You have successfully enrolled in the course");
      }
    }
  });
};
