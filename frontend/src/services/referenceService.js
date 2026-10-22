import apiClient from './apiClient';

/**
 * Public Reference Categories, Cities, and Platform Stats API Service.
 */
export const referenceService = {
  getCategories: () => 
    apiClient.get('/reference/categories'),

  getCities: () => 
    apiClient.get('/reference/cities'),

  getStats: () => 
    apiClient.get('/reference/stats'),
};

export default referenceService;
