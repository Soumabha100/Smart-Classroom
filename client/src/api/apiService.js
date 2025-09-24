// client/src/api/apiService.js

import axios from "axios";

// Create a single, configured instance of Axios.
const api = axios.create({
  baseURL: "/api",
});

// JWT Token Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error(
        "Authentication Error: Token is invalid or expired. Logging out."
      );
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// --- User & Dashboard APIs ---
export const getUserCount = (role) => api.get(`/users/count?role=${role}`);
export const getTeachers = () => api.get("/users/teachers");
export const getUserProfile = () => api.get("/users/profile");
export const getTeacherAnalytics = () => api.get("/users/teacher/analytics");
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put("/users/profile", profileData);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating user profile:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const getStudentAttendance = () => api.get("/attendance/student");

// --- AI Chat APIs ---
export const askAI = (prompt, chatId) =>
  api.post("/ai/ask", { prompt, chatId });
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
  // Use the 'api' instance and a relative URL
  return api.put(`/classes/${classId}`, classData);
};

// Function to get details of a single class
export const getClassDetails = (classId) => {
  // Use the 'api' instance and a relative URL
  return api.get(`/classes/${classId}`);
};

export const getAllStudents = () => {
  // Use the 'api' instance and a relative URL
  return api.get("/users/students");
};

// Function to add a student to a class
export const addStudentToClass = (classId, studentId) => {
  // Use the 'api' instance and a relative URL
  return api.post(`/classes/${classId}/students`, { studentId });
};

// Function to remove a student from a class (Good to have for the future)
export const removeStudentFromClass = (classId, studentId) => {
  // Use the 'api' instance and a relative URL
  return api.delete(`/classes/${classId}/students/${studentId}`);
};

// The URL has been corrected to match the backend route "/api/classes/student"
export const getStudentClasses = () => api.get("/classes/student");

export const getTeacherAttendanceAnalytics = (classId, from, to) => {
  let url = `/attendance/analytics?classId=${classId}`;
  if (from) url += `&from=${from}`;
  if (to) url += `&to=${to}`;
  return api.get(url);
};

export const getAdminAnalytics = () => api.get("/analytics/summary");

export const getParents = () => api.get("/parents");
export const createParent = (parentData) => api.post("/parents/register", parentData);

export const getInviteCodes = () => api.get("/invites");

export const generateInviteCode = () => api.post("/invites/generate");

export const getAllClassesForAdmin = () => api.get("/classes/all");

export default api;
