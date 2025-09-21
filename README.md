IntelliClass: Smart Curriculum, Activity & Attendance App
IntelliClass is an intelligent, all-in-one educational platform designed to address the challenges of manual attendance, student engagement, and personalized learning in modern academic institutions. This project is our solution for the Problem Statement IDSIH25011 for the Smart India Hackathon 2025.

Our platform replaces time-consuming manual processes with a seamless, automated system, while empowering students to take control of their learning journey through AI-driven personalization and activity recommendations.

Table of Contents
Problem Statement

Our Solution

Live Demo

Key Features

Technology Stack

System Architecture

Getting Started

Prerequisites

Installation

Project Structure

Current Progress

Future Roadmap

Contributing

Our Team

License

Problem Statement
(SIH 2025 - IDSIH25011)

Many educational institutions rely on manual attendance systems that are inefficient and prone to errors, consuming valuable class time. Furthermore, students often lack structured guidance for utilizing their free periods productively, leading to poor time management and a disconnect from their long-term academic and career goals. There is a clear need for an integrated tool that combines daily schedules with personalized student planning and automated tracking.

Our Solution
IntelliClass is a multi-faceted platform that tackles these issues head-on:

Automated & Efficient: We introduce a QR-code-based attendance system, managed through a dedicated mobile app for students and a web dashboard for faculty, which drastically reduces administrative overhead.

Student-Centric: Our platform helps students utilize their free time effectively by providing personalized learning paths, activity suggestions, and AI-powered academic support.

Data-Driven Insights: We provide administrators, teachers, and parents with actionable insights into student attendance, engagement, and academic performance through comprehensive dashboards.

Unified Ecosystem: IntelliClass connects students, teachers, administrators, and parents through a single, cohesive platform, fostering better communication and collaboration.

Live Demo
(Link to the deployed application will be here)

Key Features
For Students (Mobile App)
QR Code Attendance: Scan a unique QR code to mark attendance in seconds.

AI-Powered Dashboard: A personalized dashboard that adapts to your learning needs and goals.

Personalized Learning Paths: Receive suggestions for articles, videos, and courses during free periods.

AI Assistant: An integrated chatbot to answer academic questions and provide guidance.

Gamified Progress Tracking: Stay motivated with streaks, points, and leaderboards for attendance and completed activities.

View Schedule & Grades: Access your class timetable and academic performance on the go.

For Teachers (Web Dashboard)
Class Management: Create and manage classes, enroll students, and set up schedules.

QR Code Generation: Generate unique, time-sensitive QR codes for each lecture.

Real-time Attendance Tracking: Monitor student attendance live from the dashboard.

HOD Feed: Post announcements and updates for students and other faculty members.

Assignment Management: Create, distribute, and grade assignments.

For Administrators (Web Dashboard)
Institution-wide Overview: A holistic view of all classes, students, and teachers.

User Management: Onboard and manage profiles for students, teachers, and parents.

Analytics & Reporting: Generate detailed reports on attendance, user activity, and academic trends.

Role-Based Access Control: Securely manage permissions for different user roles.

For Parents (Web Dashboard)
Child's Progress Monitoring: View your child's attendance records and academic performance.

Stay Informed: Receive updates and announcements from the institution.

Technology Stack
Backend
Node.js: JavaScript runtime environment

Express.js: Web framework for Node.js

MongoDB: NoSQL database for data storage

Mongoose: ODM for MongoDB

JWT (JSON Web Tokens): For secure authentication

Frontend (Web Client)
React.js: A JavaScript library for building user interfaces

React Router: For declarative routing

Axios: Promise-based HTTP client

Tailwind CSS: A utility-first CSS framework

Mobile App
React Native: Framework for building native apps using React

Expo: A platform for making universal React applications

System Architecture
Our application is built on a monorepo structure with a decoupled frontend and backend, ensuring scalability and maintainability.

Client (Web): The React-based single-page application that serves teachers and administrators.

Mobile App: The React Native application for students.

Server: The central Node.js/Express backend that handles all business logic and exposes a RESTful API.

Database: A MongoDB instance for persistent data storage.

Getting Started
Follow these instructions to set up the project locally for development and testing.

Prerequisites
Node.js (v18.x or higher)

npm or yarn

MongoDB (local instance or a cloud service like MongoDB Atlas)

Expo Go app (for running the mobile app on a physical device)

Installation
Clone the repository:

git clone [https://github.com/soumabha100/smart-classroom.git](https://github.com/soumabha100/smart-classroom.git)
cd smart-classroom

Setup the Backend Server:

cd server
npm install

Create a .env file in the server directory and add your environment variables (e.g., database connection string, JWT secret).

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

Start the server:

npm start

Setup the Web Client:

cd ../client
npm install

Start the React development server:

npm start

Setup the Mobile App:

cd ../mobile-app
npm install

Start the Metro bundler:

npx expo start

Scan the QR code with the Expo Go app on your phone.

Project Structure
The project is organized as a monorepo:

/smart-classroom
|-- /client # React Web Application (for Teachers/Admins)
|-- /mobile-app # React Native Mobile App (for Students)
|-- /server # Node.js/Express Backend Server
`-- README.md

Current Progress
[x] User authentication (student, teacher, admin, parent) with JWT.

[x] Role-based access control.

[x] Core dashboard functionalities for all user roles.

[x] QR code generation and scanning for attendance.

[x] Real-time attendance tracking.

[x] Class and user management for admins.

[ ] AI-powered personalized dashboard and learning path recommendations.

[ ] Gamification features (streaks, points).

[ ] Comprehensive analytics and reporting module.

Future Roadmap
Offline Capabilities: Allow students to mark attendance even with intermittent internet connectivity.

Advanced Biometrics: Integrate face recognition as an alternative attendance method.

Integration with LMS: Connect with existing Learning Management Systems for seamless data flow.

Push Notifications: Send real-time alerts for announcements, class reminders, and attendance updates.

Enhanced AI Models: Improve the recommendation engine with more sophisticated machine learning models.

Contributing
We welcome contributions to IntelliClass! If you'd like to contribute, please fork the repository and create a pull request. For major changes, please open an issue first to discuss what you would like to change.

Our Team
Soumabha Das - Project Lead & Full-Stack Developer

(Add other team members here)

License
This project is licensed under the MIT License - see the LICENSE.md file for details.
