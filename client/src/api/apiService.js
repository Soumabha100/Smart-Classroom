import axios from "axios";

// --- Configuration ---
// Use environment variable for base URL or default to /api for proxy
const API_URL = import.meta.env.VITE_API_URL || "/api";

// Create a single, configured instance of Axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// [CRITICAL] Allow cookies to be sent with every request (for Refresh Token)
api.defaults.withCredentials = true;

// --- Token Management (Memory Only) ---
let validAccessToken = null;

export const setClientToken = (token) => {
  validAccessToken = token;
};

// --- 1. Request Interceptor ---
// Automatically attaches the Access Token to headers if we have one.
api.interceptors.request.use(
  (config) => {
    if (validAccessToken && validAccessToken !== "undefined" && validAccessToken !== "null") {
      config.headers.Authorization = `Bearer ${validAccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- 2. Response Interceptor (Circuit Breaker Fixed) ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🛑 CIRCUIT BREAKER:
    // If the error comes from the REFRESH endpoint itself, it means the session is dead (or user is guest).
    // DO NOT force a window reload. Just reject the promise so AuthContext can handle it gracefully.
    if (originalRequest.url && originalRequest.url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // Normal 401 handling (Token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 1. Attempt to get a new Access Token (Browser sends HttpOnly cookie)
        const { data } = await api.post("/auth/refresh");
        
        // 2. Update the token in memory
        setClientToken(data.accessToken);
        
        // 3. Update the Authorization header for the failed request
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        
        // 4. Retry the original request
        return api(originalRequest);
        
      } catch (refreshError) {
        // If the refresh attempt fails, we just let the app know the user is logged out.
        // We DO NOT force a reload here, as React state will handle the UI update.
        return Promise.reject(refreshError);
      }
    }
    
    // Return all other errors normally
    return Promise.reject(error);
  }
);

// ==========================================================
//  API Function Definitions
// ==========================================================

// --- User & Dashboard ---
export const getUserCount = (role) => api.get(`/users/count?role=${role}`);
export const getTeachers = () => api.get("/users/teachers");
export const getUserProfile = () => api.get("/users/profile");
export const updateUserProfile = (profileData) => api.put("/users/profile", profileData);
export const changePassword = (data) => api.put("/users/change-password", data);
export const getTeacherAnalytics = () => api.get("/users/teacher/analytics");
export const getAdminAnalytics = () => api.get("/analytics/summary");

// --- Classes ---
export const getClasses = () => api.get("/classes");
export const createClass = (data) => api.post("/classes", data);
export const getClassDetails = (id) => api.get(`/classes/${id}`);
export const updateClass = (id, data) => api.put(`/classes/${id}`, data);
export const deleteClass = (id) => api.delete(`/classes/${id}`);
export const getTeacherClasses = () => api.get("/classes/my-classes");
export const getStudentClasses = () => api.get("/classes/student");
export const getAllClassesForAdmin = () => api.get("/classes/all");

// --- Students & Class Enrollment ---
export const getAllStudents = () => api.get("/users/students");
export const addStudentToClass = (classId, studentId) => api.post(`/classes/${classId}/students`, { studentId });
export const removeStudentFromClass = (classId, studentId) => api.delete(`/classes/${classId}/students/${studentId}`);

// --- Assignments ---
export const getAssignments = (classId) => api.get(`/assignments${classId ? `?classId=${classId}` : ""}`);
export const createAssignment = (data) => api.post("/assignments", data);
export const deleteAssignment = (id) => api.delete(`/assignments/${id}`);

// --- Attendance ---
export const getStudentAttendance = () => api.get("/attendance/student");
export const generateQrCode = (classId) => api.post("/attendance/generate-qr", { classId });
export const getTeacherAttendanceAnalytics = (classId, from, to) => {
  let url = `/attendance/analytics?classId=${classId}`;
  if (from) url += `&from=${from}`;
  if (to) url += `&to=${to}`;
  return api.get(url);
};

// --- AI Chat ---
export const askAI = (data, chatId) => {
  if (data instanceof FormData) {
    return api.post("/ai/ask", data, { headers: { "Content-Type": "multipart/form-data" } });
  }
  return api.post("/ai/ask", { prompt: data, chatId });
};
export const getChatHistories = () => api.get("/ai/history");
export const getChatHistory = (chatId) => api.get(`/ai/history/${chatId}`);
export const deleteChatHistory = (chatId) => api.delete(`/ai/history/${chatId}`);
export const generateAIDashboard = (mode) => api.post("/ai/generate-dashboard", { mode });

// --- Forum ---
export const getPosts = () => api.get("/forum/posts");
export const createPost = (data) => api.post("/forum/posts", data);
export const getPostById = (id) => api.get(`/forum/posts/${id}`);
export const createComment = (postId, data) => api.post(`/forum/posts/${postId}/comments`, data);

// --- Parents & Invites ---
export const getParents = () => api.get("/parents");
export const createParent = (data) => api.post("/parents/register", data);
export const getInviteCodes = () => api.get("/invites");
export const generateInviteCode = () => api.post("/invites/generate");

// --- 🔐 Session Management ---
export const getSessions = () => api.get("/auth/sessions");
export const revokeSession = (sessionId) => api.delete(`/auth/sessions/${sessionId}`);
export const revokeAllSessions = () => api.delete("/auth/sessions"); // "Logout from all devices"

export default api;