import axios from 'axios';

/**
 * Base Axios Client.
 * Automatically resolves API base URL from Vite environment variables.
 * Attaches JWT Bearer token on outgoing requests and handles token expiration.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('job4you_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on unauthorized errors if route is protected
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('job4you_token');
        localStorage.removeItem('job4you_user');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
