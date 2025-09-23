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
  return axios.put(`/api/classes/${classId}`, classData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Function to get details of a single class
export const getClassDetails = (classId) => {
  return axios.get(`/api/classes/${classId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getAllStudents = () => {
  return axios.get('/api/users/students', {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Function to add a student to a class
export const addStudentToClass = (classId, studentId) => {
  return axios.post(`/api/classes/${classId}/students`, { studentId }, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Function to remove a student from a class (Good to have for the future)
export const removeStudentFromClass = (classId, studentId) => {
    return axios.delete(`/api/classes/${classId}/students/${studentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
};
export default api;
