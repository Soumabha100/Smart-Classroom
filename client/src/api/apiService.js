// client/src/api/apiService.js

import axios from "axios";

// --- ✅ LOGIC UPDATE 1: Use Environment Variable for Base URL ---
// This makes it easy to switch between dev (http://localhost:5000/api)
// and production (/api) without changing code.
// Your vite.config.mjs proxy will still handle /api in development.
const API_URL = import.meta.env.VITE_API_URL || "/api";

// Create a single, configured instance of Axios.
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- ✅ LOGIC UPDATE 2: Enhanced Interceptor Comments ---

// --- Request Interceptor ---
// This function runs *before* any request is sent from your app.
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      // If a token exists, add it to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Continue with the modified request
    return config;
  },
  (error) => {
    // Handle any error that happens during the request setup
    console.error("API Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
// This function runs *after* your app receives a response (good or bad).
api.interceptors.response.use(
  (response) => {
    // If the response status is 2xx (successful), just return it
    return response;
  },
  (error) => {
    // If the response status is 4xx or 5xx, this block runs
    if (error.response && error.response.status === 401) {
      // This is the most important part:
      // If we get a 401 (Unauthorized), it means the token is
      // invalid, expired, or missing.
      console.error(
        "Authentication Error (401): Token is invalid or expired. Logging out."
      );

      // ✅ LOGIC UPDATE 3: Ensure all auth keys are cleared
      localStorage.removeItem("token");
      localStorage.removeItem("role"); // Make sure 'role' is also removed
      localStorage.removeItem("name"); // And 'name'

      // Force a page reload to the login screen.
      // This is the correct way to do it outside of React's navigation.
      window.location.href = "/login";
    }

    // For all other errors, just "reject" the promise so that the
    // function that called the API (e.g., in AuthContext)
    // can handle it in its own .catch() block.
    return Promise.reject(error);
  }
);

// ==========================================================
//  API Function Definitions
//  All functions should be "clean" and just return the
//  api promise. This lets the component/context handle errors.
// ==========================================================

// --- User & Dashboard APIs ---
export const getUserCount = (role) => api.get(`/users/count?role=${role}`);
export const getTeachers = () => api.get("/users/teachers");
export const getUserProfile = () => api.get("/users/profile");
export const getTeacherAnalytics = () => api.get("/users/teacher/analytics");

// --- ✅ LOGIC UPDATE 4: Standardized Function ---
// Removed the redundant try/catch block to match all other functions.
// This now correctly passes the promise (and any errors)
// back to the component that calls it.
export const updateUserProfile = (profileData) => {
  return api.put("/users/profile", profileData);
};

// Change Password Function
export const changePassword = (passwordData) => {
  return api.put("/users/change-password", passwordData);
};

export const getStudentAttendance = () => api.get("/attendance/student");

// --- AI Chat APIs ---
export const askAI = (data, chatId) => {
  // Check if 'data' is FormData (contains files)
  if (data instanceof FormData) {
    return api.post("/ai/ask", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  // Default behavior for text-only (backward compatibility)
  return api.post("/ai/ask", { prompt: data, chatId });
};
export const getChatHistories = () => api.get("/ai/history");
export const getChatHistory = (chatId) => api.get(`/ai/history/${chatId}`);
export const deleteChatHistory = (chatId) =>
  api.delete(`/ai/history/${chatId}`);

// --- AI Dashboard API ---
export const generateAIDashboard = (mode) => {
  return api.post("/ai/generate-dashboard", { mode });
};

// --- CLASSES CRUD API ---
export const getClasses = () => api.get("/classes");
export const createClass = (data) => api.post("/classes", data);
export const deleteClass = (id) => api.delete(`/classes/${id}`);
export const getTeacherClasses = () => api.get("/classes/my-classes");

// --- ASSIGNMENTS CRUD API ---
export const getAssignments = (classId) =>
  api.get(`/assignments${classId ? `?classId=${classId}` : ""}`);
export const createAssignment = (data) => api.post("/assignments", data);
export const deleteAssignment = (id) => api.delete(`/assignments/${id}`);

// --- FORUM APIs ---
export const getPosts = () => api.get("/forum/posts");
export const createPost = (postData) => api.post("/forum/posts", postData);
export const getPostById = (id) => api.get(`/forum/posts/${id}`);
export const createComment = (postId, commentData) =>
  api.post(`/forum/posts/${postId}/comments`, commentData);

// --- ATTENDANCE APIs ---
export const generateQrCode = (classId) =>
  api.post("/attendance/generate-qr", { classId });

// Function to update a class
export const updateClass = (classId, classData) => {
  return api.put(`/classes/${classId}`, classData);
};

// Function to get details of a single class
export const getClassDetails = (classId) => {
  return api.get(`/classes/${classId}`);
};

export const getAllStudents = () => {
  return api.get("/users/students");
};

// Function to add a student to a class
export const addStudentToClass = (classId, studentId) => {
  return api.post(`/classes/${classId}/students`, { studentId });
};

// Function to remove a student from a class
export const removeStudentFromClass = (classId, studentId) => {
  return api.delete(`/classes/${classId}/students/${studentId}`);
};

export const getStudentClasses = () => api.get("/classes/student");

export const getTeacherAttendanceAnalytics = (classId, from, to) => {
  let url = `/attendance/analytics?classId=${classId}`;
  if (from) url += `&from=${from}`;
  if (to) url += `&to=${to}`;
  return api.get(url);
};

export const getAdminAnalytics = () => api.get("/analytics/summary");

export const getParents = () => api.get("/parents");
export const createParent = (parentData) =>
  api.post("/parents/register", parentData);

export const getInviteCodes = () => api.get("/invites");

export const generateInviteCode = () => api.post("/invites/generate");

export const getAllClassesForAdmin = () => api.get("/classes/all");

export default api;
