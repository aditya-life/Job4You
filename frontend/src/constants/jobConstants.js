/**
 * Job Vacancy & ATS Constants.
 * 
 * Central registry for categories, workplace environments, employment types,
 * and ATS application stages with associated badge styling.
 */

export const JOB_CATEGORIES = [
  'Software & Technology',
  'Data Science & AI',
  'Product & Design',
  'Marketing & Growth',
  'Sales & Business Dev',
  'Finance & Accounting',
  'Human Resources',
  'Customer Support',
  'Operations',
];

export const WORKPLACE_TYPES = [
  'Remote',
  'On-Site',
  'Hybrid',
];

export const JOB_TYPES = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
];

export const EXPERIENCE_LEVELS = [
  'Fresher',
  'Junior',
  'Mid-Level',
  'Senior',
  'Lead',
];

export const APPLICATION_STATUS_CONFIG = {
  Applied: {
    label: 'Applied',
    badgeClass: 'badge-applied',
    bg: '#eff6ff',
    color: '#1d4ed8',
  },
  'Under Review': {
    label: 'Under Review',
    badgeClass: 'badge-reviewing',
    bg: '#fef3c7',
    color: '#b45309',
  },
  Shortlisted: {
    label: 'Shortlisted',
    badgeClass: 'badge-shortlisted',
    bg: '#ecfdf5',
    color: '#047857',
  },
  'Interview Scheduled': {
    label: 'Interview Scheduled',
    badgeClass: 'badge-interview',
    bg: '#f3e8ff',
    color: '#6d28d9',
  },
  Hired: {
    label: 'Hired 🎉',
    badgeClass: 'badge-hired',
    bg: '#d1fae5',
    color: '#065f46',
  },
  Rejected: {
    label: 'Archived',
    badgeClass: 'badge-rejected',
    bg: '#fee2e2',
    color: '#b91c1c',
  },
};
