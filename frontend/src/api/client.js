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

// Response interceptor: on 401 for protected routes, clear storage and redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const isLoginRoute = url.includes('/api/auth/login') || url.includes('/api/admin/login');
    if (error.response?.status === 401 && !isLoginRoute) {
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
