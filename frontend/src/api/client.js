import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor: attach auth token
apiClient.interceptors.request.use((config) => {
  // Prefer adminToken for admin routes, fall back to regular token
  const adminToken = localStorage.getItem('adminToken');
  const token = localStorage.getItem('token');
  const activeToken = adminToken || token;

  if (activeToken) {
    config.headers.Authorization = `Bearer ${activeToken}`;
  }
  return config;
});

// Response interceptor: on 401, clear storage and redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
