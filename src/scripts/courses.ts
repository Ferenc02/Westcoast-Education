import { authenticatedUser } from "./app.js";
import showMessageBox from "./errorHandling.js";

export interface course {
  id: number;
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

// Function that generates a course card with the course information and appends it to the cards container.
export const generateCourseCard = (course: course) => {
  let cardElement = `<div
            class="fade-in flex flex-col w-full bg-white rounded-lg shadow-md p-4 gap-4 hover:scale-[100.5%] transition-transform"
          >
            <img
              src="${course.image}"
              alt="course 1"
              class="max-h-60 object-cover rounded-lg object-center"
            />
            <h3 class="text-lg font-semibold text-gray-900 capitalize">
              ${course.name}
            </h3>
            <p class="text-gray-700 mt-2">
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
              class="button w-full  bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              Enroll
            </button>
            <div
              class="course-info flex w-full justify-between px-2 text-sm text-gray-600 font-medium"
            >
              <p class="course-date">${course.startDate} - ${course.endDate} </p>
              <p class="course-location">${course.location}</p>
            </div>
          </div>`;

  cardsContainer.innerHTML += cardElement;
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
  if (authenticatedUser.role !== "admin") {
    showMessageBox("You are not authorized to update courses", "error");
    return;
  }

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

  course.id = coursesLength + 1;

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
};
