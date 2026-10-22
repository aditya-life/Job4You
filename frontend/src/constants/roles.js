/**
 * User Role Constants.
 * 
 * Defines the role identifiers matching backend RBAC models.
 */

export const USER_ROLES = {
  JOB_SEEKER: 'job_seeker',
  EMPLOYER: 'employer',
  ADMIN: 'admin',
};

export const ROLE_LABELS = {
  [USER_ROLES.JOB_SEEKER]: 'Job Seeker',
  [USER_ROLES.EMPLOYER]: 'Employer / Recruiter',
  [USER_ROLES.ADMIN]: 'System Administrator',
};

export default USER_ROLES;
