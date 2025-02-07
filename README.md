# Project Description

This project is designed to help WestCoast Education modernize its platform for offering educational courses. The platform will be used to manage both traditional classroom courses and new on-demand courses, including the ability to handle booking, searching, and matching students with courses. 

## Features
### 📚 Course Management
- Browse the available courses  
- View detailed course information (title, duration, price, availability)  

### 📝 Booking System
- Students can book courses directly from the platform  
- Secure authentication for booking (login or account creation required)  

### 🏫 Administration Tools
- Add, update, and remove courses easily  
- Manage student enrollments and track bookings  
- View a list of students registered for each course  

### 🔐 Authentication & Security
- Secure login and account creation  
- Role-based access for administrators and students  
- Encrypted password storage


![image](https://github.com/user-attachments/assets/e1eefe53-9547-4668-8bd7-f9258107301c)
![image](https://github.com/user-attachments/assets/e95c89dc-53c9-409d-b492-90a7dbe4a273)
![image](https://github.com/user-attachments/assets/708df510-9dbb-45c4-af1d-0b428d48a559)
![image](https://github.com/user-attachments/assets/32386c6b-efeb-4c17-b072-45d4a7823225)
![image](https://github.com/user-attachments/assets/8fc98798-5a72-4a8c-8a5a-53de082103e4)
![image](https://github.com/user-attachments/assets/e207afc6-acf5-4a91-b085-631744dbf140)
![image](https://github.com/user-attachments/assets/c600b59e-5c19-4c68-92e0-5e0532d8f3da)




## Technologies Used

- **Frontend**: HTML, CSS, Typescript, PostCSS, Tailwind
- **Backend**: JSON Server for mock data handling.
- **Database**: Mock database using JSON Server to simulate a backend service.
- **Node.js**: npm-run-all for running multiple scripts concurrently.
- **Testing**: Vitest for unit testing and test-driven development (TDD)  

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

   This will start all necessary services, including the PostCSS watcher, JSON Server, TypeScript compiler, and HTTP server in parallel mode.

4. Run vitest to run the test cases:

   ```bash
   npm run test
   ```

   This will run the test cases and display the results in the terminal. (Note: The test cases will only run if the JSON Server is running.)

## Usage

- **PostCSS**: Styles are automatically compiled and updated when you modify the `src/styles.css` file or add any Tailwind classes in the html.
- **Tailwind**: The project uses Tailwind CSS for styling, which is configured in the `postcss.config.mjs` file.
- **JSON Server**: Serves as a mock API for course data and authentication, available at `http://localhost:3000` and `http://localhost:3001`.
- **TypeScript**: Watches for changes in TypeScript files and recompiles them as needed and output in `public/js` folder.
- **HTTP Server**: Serves the project on `http://localhost:8080`.
- **Vitest**: Runs the test cases and displays the results in the terminal.

---
## Note

All newly created users will have administrator privileges by default.
