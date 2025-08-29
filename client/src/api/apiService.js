import axios from "axios";

// Create a single, configured instance of Axios
const api = axios.create({
  baseURL: "/api", // The base URL for all API requests
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

export const getUserCount = (role) => api.get(`/users/count?role=${role}`);
export const getTeachers = () => api.get("/users/teachers");
export const getClasses = () => api.get("/classes");

// You can add more functions here as your app grows...
// For example:
// export const createClass = (data) => api.post('/classes', data);

// You can still have a default export if you want to use the raw `api` instance elsewhere
export default api;
