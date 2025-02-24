// src/services/api.js
import axios from 'axios';

// Determine the base URL based on the environment
const BASE_URL = process.env.REACT_APP_ENV === 'development'
    ? 'http://localhost:5000'
    : '/api';

// Create an Axios instance with default settings
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the Authorization token in every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Optionally add a response interceptor for centralized error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // You can log errors globally or handle specific status codes here
        return Promise.reject(error);
    }
);

export default api;