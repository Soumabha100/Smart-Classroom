# 🎓 IntelliClass: Smart Classroom Management System

![IntelliClass Application Showcase](assets/IntelliClass-Showcase.gif)
![Student Mobile Dashboard](assets/Student-Dashboard.png)
![Teacher QR Generation](assets/Teacher-QR-Code.png)
![Admin Analytics Portal](assets/Admin-Analytics.png)
![Parent Monitoring View](assets/Parent-Portal.png)

IntelliClass is an intelligent, all-in-one educational platform engineered to revolutionize the modern classroom. Designed as our solution for **Problem Statement IDSIH25011** for the **Smart India Hackathon 2025**, it replaces outdated manual processes with a seamless, automated system while empowering students through AI-driven personalization and activity recommendations.

**Live Application:** **[Link to Deployed Application - Coming Soon!]**

---

## 🏛️ Architectural Overview

The application is built on a modern, decoupled architecture to ensure scalability, maintainability, and a clear separation of concerns.

- **Frontend (Web Client):** A dynamic Single-Page Application (SPA) built with **React** and **Vite**. It provides a comprehensive dashboard for administrators and teachers to manage the entire ecosystem.
- **Mobile App (Student Client):** A cross-platform mobile application for students, built with **React Native** and **Expo**, designed for on-the-go access to schedules, attendance marking, and personalized learning.
- **Backend (Server):** A secure and stateless RESTful API powered by **Node.js** and **Express.js**, serving as the central nervous system that handles all business logic, user authentication, and data management.
- **Database:** A **MongoDB** cluster acts as the persistence layer, with schemas optimized for efficient querying, scalability, and data integrity across the platform.

This architecture allows for independent development and scaling of the client and server components, ensuring a robust and high-performance system.

---

## ✨ Core Features

### 📱 For Students (Mobile App)

- **🚀 Instant Attendance:** Scan a unique, time-sensitive QR code with the mobile app to mark attendance in seconds. No more manual roll calls.
- **🧠 AI-Personalized Dashboard:** A smart, adaptive dashboard that suggests relevant academic tasks, articles, and videos during free periods, tailored to your interests and career goals.
- **🗺️ Personalized Learning Paths:** Discover a structured routine combining your class schedule, free-time activities, and long-term personal goals, all powered by AI.
- **🤖 AI Assistant:** An integrated chatbot for instant answers to academic questions, study guidance, and support.
- **🏆 Gamified Experience:** Stay motivated with attendance streaks, achievement points, and friendly leaderboards for consistent engagement.
- **🗓️ Schedule & Grade Access:** Instantly view your class timetable and academic performance on the go.

### 👩‍🏫 For Teachers & Faculty (Web Dashboard)

- **📋 Effortless Class Management:** Easily create, update, and manage your classes, schedules, and student rosters from a centralized dashboard.
- **🔑 Secure QR Code Generation:** Generate unique QR codes for each lecture to ensure accurate and fraud-proof attendance.
- **📊 Real-Time Attendance Monitoring:** View live attendance data and get instant updates as students check in.
- **📢 HOD Feed & Announcements:** Broadcast important updates, announcements, and notices to students and other faculty members.
- **📝 Assignment & Grading:** A complete module to create, distribute, and grade assignments digitally, streamlining the academic workflow.

### 🏢 For Administrators & Parents (Web Dashboard)

- **🌐 Institution-Wide Control:** A powerful admin dashboard providing a holistic, bird's-eye view of all academic activities, user roles, and system settings.
- **👤 Unified User Management:** Seamlessly onboard and manage profiles for students, teachers, and parents with fine-grained, role-based access control.
- **📈 Analytics & Reporting:** Generate insightful reports on attendance patterns, user activity, and academic trends to make data-driven decisions.
- **👨‍👩‍👧 Parent Portal:** A dedicated dashboard for parents to monitor their child's attendance records, academic progress, and receive important communications.

---

## 🛠️ Tech Stack & Key Libraries

| Category             | Technology / Library                                 |
| -------------------- | ---------------------------------------------------- |
| **Frontend (Web)**   | `React.js`, `Vite`, `React Router DOM`               |
| **Mobile App**       | `React Native`, `Expo`                               |
| **Styling**          | `Tailwind CSS`                                       |
| **Backend**          | `Node.js`, `Express.js`                              |
| **Database**         | `MongoDB`, `Mongoose`                                |
| **Authentication**   | `JSON Web Tokens (JWT)`, `bcryptjs`, `cookie-parser` |
| **API & Networking** | `Axios`, `RESTful Principles`                        |

---

## ⚙️ Local Development Setup

Follow these steps to get the project running on your local machine.

**Prerequisites:**

- Node.js (v18.x or higher) & npm
- MongoDB (local instance or a cloud service like MongoDB Atlas)
- Expo Go app (for running the mobile app on a physical device)

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/soumabha100/smart-classroom.git](https://github.com/soumabha100/smart-classroom.git)
    cd smart-classroom
    ```
2.  **Backend Setup**
    ```bash
    cd server
    npm install
    ```
    Create a `.env` file in the `/server` directory and add your environment variables:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    ```
    Then, start the backend server:
    ```bash
    npm start
    ```
3.  **Web Client Setup**
    ```bash
    cd ../client
    npm install
    ```
    Start the frontend development server:
    ```bash
    npm run dev
    ```
4.  **Mobile App Setup**
    ```bash
    cd ../mobile-app
    npm install
    ```
    Start the Metro bundler and scan the QR code with the Expo Go app on your phone:
    ```bash
    npx expo start
    ```

---

### 👥 Project Authors

This project was brought to life by a dedicated team of students for the Smart India Hackathon 2025.

- **[Your Name]**
- **[Teammate Name]**
- **[Teammate Name]**

_Department of Computer Science & Engineering_
_Swami Vivekananda Institute of Science and Technology (SVIST)_
