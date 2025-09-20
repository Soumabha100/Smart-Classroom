import axios from "axios";

// Create a single, configured instance of Axios.
// The baseURL is now simply "/api". The Vite proxy will forward this to http://localhost:5001/api for you.
const api = axios.create({
  baseURL: "/api",
});

// JWT Token Interceptor: automatically adds token from localStorage to requests
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

// --- User & Dashboard APIs ---
export const getUserCount = (role) => api.get(`/users/count?role=${role}`);
export const getTeachers = () => api.get("/users/teachers");
export const getUserProfile = () => api.get("/users/profile");
export const updateUserProfile = (profileData) =>
  api.post("/users/profile", profileData);
export const getStudentAttendance = () => api.get("/attendance/student");

// --- AI Dashboard API ---
export const generateAIDashboard = (mode) => {
  return api.post("/ai/generate-dashboard", { mode });
};

// --- CLASSES CRUD API ---
// Get all classes
export const getClasses = () => api.get("/classes");
// Create a new class
export const createClass = (data) => api.post("/classes", data);
// Delete a class by id (using class ID string)
export const deleteClass = (id) => api.delete(`/classes/${id}`);

// --- ASSIGNMENTS CRUD API ---
// Get all assignments (optionally filtered by classId)
export const getAssignments = (classId) =>
  api.get(`/assignments${classId ? `?classId=${classId}` : ""}`);
// Create a new assignment
export const createAssignment = (data) => api.post("/assignments", data);
// Delete an assignment by id
export const deleteAssignment = (id) => api.delete(`/assignments/${id}`);
// Future update example:
// export const updateAssignment = (id, data) => api.put(`/assignments/${id}`, data);

// Get the user's full chat history from the backend
export const fetchChatHistory = async () => {
    const response = await api.get('/ai/chat/history');
    return response.data;
};

// Send a new prompt to the backend and get the AI's response
export const sendChatMessage = async (prompt) => {
    const response = await api.post('/ai/chat', { prompt });
    return response.data;
};

export default api;
