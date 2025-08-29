import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Your proxy will handle the redirection
});

// Add a request interceptor to include the token in every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
export const getTeachers = () => api.get('/users/teachers');
export const getStudents = () => api.get('/users/students');
export const getClasses = () => api.get('/classes');
export const createClass = (data) => api.post('/classes', data);

export default api;