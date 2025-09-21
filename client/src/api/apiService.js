import axios from "axios";

// Create a single, configured instance of Axios.
const api = axios.create({
  baseURL: "/api",
});

// --- JWT Token Interceptor (Your existing code, unchanged) ---
// This automatically adds the token from localStorage to every request.
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

// --- NEW & PERMANENT FIX: Response Interceptor ---
// This is the guardian that prevents authentication errors from crashing the app.
api.interceptors.response.use(
  (response) => response, // If the response is successful, just return it.
  (error) => {
    // If the server responds with a 401 (Unauthorized) error...
    if (error.response && error.response.status === 401) {
      console.error(
        "Authentication Error: Token is invalid or expired. Logging out."
      );
      // Clear the invalid token from storage
      localStorage.removeItem("token");
      // Redirect the user to the login page to re-authenticate
      window.location.href = "/login";
    }
    // For all other errors, just pass them along.
    return Promise.reject(error);
  }
);

// --- User & Dashboard APIs (Unchanged) ---
export const getUserCount = (role) => api.get(`/users/count?role=${role}`);
export const getTeachers = () => api.get("/users/teachers");
export const getUserProfile = () => api.get("/users/profile");
export const updateUserProfile = (profileData) =>
  api.post("/users/profile", profileData);
export const getStudentAttendance = () => api.get("/attendance/student");

// --- AI Chat APIs (Cleaned and Finalized) ---
// These are the only functions you should use for the new multi-chat system.
export const askAI = (prompt, chatId) =>
  api.post("/ai/ask", { prompt, chatId });
export const getChatHistories = () => api.get("/ai/history");
export const getChatHistory = (chatId) => api.get(`/ai/history/${chatId}`);
export const deleteChatHistory = (chatId) =>
  api.delete(`/ai/history/${chatId}`);

// --- AI Dashboard API (Unchanged) ---
export const generateAIDashboard = (mode) => {
  return api.post("/ai/generate-dashboard", { mode });
};

// --- CLASSES CRUD API (Unchanged) ---
export const getClasses = () => api.get("/classes");
export const createClass = (data) => api.post("/classes", data);
export const deleteClass = (id) => api.delete(`/classes/${id}`);

// --- ASSIGNMENTS CRUD API (Unchanged) ---
export const getAssignments = (classId) =>
  api.get(`/assignments${classId ? `?classId=${classId}` : ""}`);
export const createAssignment = (data) => api.post("/assignments", data);
export const deleteAssignment = (id) => api.delete(`/assignments/${id}`);

export const getPosts = () => api.get("/forum/posts");
export const createPost = (postData) => api.post("/forum/posts", postData);
export const getPostById = (id) => api.get(`/forum/posts/${id}`);
export const createComment = (postId, commentData) =>
  api.post(`/forum/posts/${postId}/comments`, commentData);

export default api;
