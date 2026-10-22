import apiClient from './apiClient';

/**
 * Employer Dashboard & Talent Sourcing API Service.
 */
export const employerService = {
  getDashboardStats: () => 
    apiClient.get('/employer/dashboard'),

  getMyJobs: () => 
    apiClient.get('/employer/my-jobs'),

  getCandidates: (params) => 
    apiClient.get('/employer/candidates', { params }),
};

export default employerService;
