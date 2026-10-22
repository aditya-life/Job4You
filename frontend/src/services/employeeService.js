import apiClient from './apiClient';

/**
 * Candidate Profile & Metrics API Service.
 */
export const employeeService = {
  getDashboardStats: () => 
    apiClient.get('/employee/dashboard'),

  updateProfile: (payload) => 
    apiClient.put('/employee/profile', payload),
};

export default employeeService;
