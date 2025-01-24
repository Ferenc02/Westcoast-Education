# Project Description

This project is designed to help WestCoast Education modernize its platform for offering educational courses. The platform will be used to manage both traditional classroom courses and new on-demand courses, including the ability to handle booking, searching, and matching students with courses. The platform will also enable communication between students and instructors via email and chat.

## Features

### 1. **Classroom Courses**

- List and display upcoming classroom and distance learning courses.
- Allow students to book courses and view course details like content, course duration, teacher, and student ratings.
- Admin features:
  - Add, update, and delete courses.
  - Assign teachers to courses and manage teacher information.
  - Administer students and send communication via email or chat.
  - View and manage course bookings and confirmations.

### 2. **On-Demand Courses**

- List on-demand, pre-recorded courses available for purchase or through subscription.
- Allow customers to view course details and preview parts of the course.
- Manage customer profiles and track purchased courses.
- Provide course recommendations based on previous course purchases.

### 3. **Booking and Communication**

- Users must have an account to book courses.
- Automatic confirmation and reminder emails will be sent upon course booking.
- If a course is canceled (e.g., fewer than 5 students enrolled), automatic notifications and refunds will be sent to students.

## Goals

- Create a modern, responsive web platform to manage both classroom and on-demand courses.
- Provide easy-to-use interfaces for both students and administrators.
- Integrate communication tools for student-teacher interaction and for course-related notifications.

## Technologies Used

- **Frontend**: HTML, CSS, Typescript, PostCSS, Tailwind
- **Backend**: JSON Server for mock data handling.
- **Database**: Mock database using JSON Server to simulate a backend service.
- **Node.js**: npm-run-all for running multiple scripts concurrently.

## Installation and Setup

To get started with the project, you can follow the steps below:

1. Clone the repository:

   ```bash
   git clone https://github.com/Ferenc02/Westcoast-Education.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development environment:

   ```bash
   npm run dev
   ```

   This will start all necessary services, including the PostCSS watcher, JSON Server, and TypeScript compiler in parallel mode.

## Usage

- **PostCSS**: Styles are automatically compiled and updated when you modify the `src/styles.css` file or add any Tailwind classes in the html.
- **Tailwind**: The project uses Tailwind CSS for styling, which is configured in the `postcss.config.mjs` file.
- **JSON Server**: Serves as a mock API for course data, available at `http://localhost:3000`.
- **TypeScript**: Watches for changes in TypeScript files and recompiles them as needed and output in `public/js` folder.

---
