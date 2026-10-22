import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
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
api.interceptors.response.use(
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

// Auth Services
export const authService = {
  sendOtp: (identifier, purpose = 'login') => 
    api.post('/auth/send-otp', { identifier, purpose }),
  verifyOtp: (identifier, otp, name = null, role = 'job_seeker') =>
    api.post('/auth/verify-otp', { identifier, otp, name, role }),
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  signup: (payload) => 
    api.post('/auth/signup', payload),
  getMe: () => 
    api.get('/auth/me'),
};

// Jobs Services
export const jobsService = {
  getJobs: (params) => 
    api.get('/jobs', { params }),
  getJobDetail: (id) => 
    api.get(`/jobs/${id}`),
  createJob: (payload) => 
    api.post('/jobs', payload),
  updateJob: (id, payload) => 
    api.put(`/jobs/${id}`, payload),
  deleteJob: (id) => 
    api.delete(`/jobs/${id}`),
};

// Application Services
export const applicationService = {
  applyToJob: (payload) => 
    api.post('/applications/apply', payload),
  getMyApplications: () => 
    api.get('/applications/my-applications'),
  getJobApplicants: (jobId) => 
    api.get(`/applications/job/${jobId}`),
  updateStatus: (applicationId, status, employerNotes = null) => 
    api.put(`/applications/${applicationId}/status`, { status, employer_notes: employerNotes }),
  toggleSaveJob: (jobId) => 
    api.post(`/applications/save-job/${jobId}`),
  getSavedJobs: () => 
    api.get('/applications/saved-jobs'),
};

// Employer Services
export const employerService = {
  getDashboardStats: () => 
    api.get('/employer/dashboard'),
  getMyJobs: () => 
    api.get('/employer/my-jobs'),
  getCandidates: (params) => 
    api.get('/employer/candidates', { params }),
};

// Employee Services
export const employeeService = {
  getDashboardStats: () => 
    api.get('/employee/dashboard'),
  updateProfile: (payload) => 
    api.put('/employee/profile', payload),
};

// Reference Services
export const referenceService = {
  getCategories: () => 
    api.get('/reference/categories'),
  getCities: () => 
    api.get('/reference/cities'),
  getStats: () => 
    api.get('/reference/stats'),
};

export default api;
