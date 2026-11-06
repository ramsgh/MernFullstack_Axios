import axios from 'axios';

// Create Axios Instance with Base URL
const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// REQUEST INTERCEPTOR: Automatically attach Bearer Token from LocalStorage
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: Handle global auth errors (401/403)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Authentication token invalid or expired. Logging out...');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
