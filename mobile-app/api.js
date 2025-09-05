import axios from 'axios';

const API_URL = 'http://192.168.1.6:5001/api'; 

const api = axios.create({
  baseURL: API_URL,
});


export default api;