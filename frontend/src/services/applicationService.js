import apiClient from './apiClient';

/**
 * Candidate Applications & ATS Status API Service.
 */
export const applicationService = {
  applyToJob: (payload) => 
    apiClient.post('/applications/apply', payload),

  getMyApplications: () => 
    apiClient.get('/applications/my-applications'),

  getJobApplicants: (jobId) => 
    apiClient.get(`/applications/job/${jobId}`),

  updateStatus: (applicationId, status, employerNotes = null) => 
    apiClient.put(`/applications/${applicationId}/status`, { status, employer_notes: employerNotes }),

  toggleSaveJob: (jobId) => 
    apiClient.post(`/applications/save-job/${jobId}`),

  getSavedJobs: () => 
    apiClient.get('/applications/saved-jobs'),
};

export default applicationService;
