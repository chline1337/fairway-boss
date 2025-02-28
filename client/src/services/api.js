// src/services/api.js
import axios from 'axios';

// Use REACT_APP_API_URL if available; otherwise, fallback to localhost.
const BASE_URL = process.env.REACT_APP_API_URL ||
    (process.env.REACT_APP_ENV === 'development' ? 'http://localhost:5000' : '');

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptors remain unchanged...
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

api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

export default api;
