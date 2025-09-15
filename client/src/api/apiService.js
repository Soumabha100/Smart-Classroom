import axios from "axios";

// Create a single, configured instance of Axios.
// The baseURL is now simply "/api". The Vite proxy will handle forwarding
// this to http://localhost:5001/api for you.
const api = axios.create({
  baseURL: "/api",
});

// Use an interceptor to automatically add the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Your existing API functions remain the same
export const getUserCount = (role) => api.get(`/users/count?role=${role}`);
export const getTeachers = () => api.get("/users/teachers");
export const getClasses = () => api.get("/classes");
export const getUserProfile = () => api.get("/users/profile");
export const updateUserProfile = (profileData) =>
  api.post("/users/profile", profileData);
export const getStudentAttendance = () => api.get("/attendance/student");

export default api;
