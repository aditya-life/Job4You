import apiClient from './apiClient';

/**
 * Authentication & OTP Verification API Service.
 */
export const authService = {
  sendOtp: (identifier, purpose = 'login') => 
    apiClient.post('/auth/send-otp', { identifier, purpose }),

  verifyOtp: (identifier, otp, name = null, role = 'job_seeker') =>
    apiClient.post('/auth/verify-otp', { identifier, otp, name, role }),

  login: (email, password) => 
    apiClient.post('/auth/login', { email, password }),

  signup: (payload) => 
    apiClient.post('/auth/signup', payload),

  getMe: () => 
    apiClient.get('/auth/me'),
};

export default authService;
