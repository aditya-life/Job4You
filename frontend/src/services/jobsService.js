import apiClient from './apiClient';

/**
 * Job Vacancies & Search API Service.
 */
export const jobsService = {
  getJobs: (params) => 
    apiClient.get('/jobs', { params }),

  getJobDetail: (id) => 
    apiClient.get(`/jobs/${id}`),

  createJob: (payload) => 
    apiClient.post('/jobs', payload),

  updateJob: (id, payload) => 
    apiClient.put(`/jobs/${id}`, payload),

  deleteJob: (id) => 
    apiClient.delete(`/jobs/${id}`),
};

export default jobsService;
