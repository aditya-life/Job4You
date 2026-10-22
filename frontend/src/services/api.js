/**
 * Backward compatibility facade.
 * Re-exports from modular service modules.
 */
import apiClient from './apiClient';
import { authService } from './authService';
import { jobsService } from './jobsService';
import { applicationService } from './applicationService';
import { employerService } from './employerService';
import { employeeService } from './employeeService';
import { referenceService } from './referenceService';

export {
  apiClient,
  authService,
  jobsService,
  applicationService,
  employerService,
  employeeService,
  referenceService,
};

export default apiClient;
