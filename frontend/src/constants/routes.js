/**
 * Centralized Application Route Definitions.
 * 
 * Using centralized constants prevents hardcoded URL string typos
 * across navigation menus, links, and programmatic redirects.
 */

export const ROUTES = {
  HOME: '/',
  JOBS: '/jobs',
  JOB_DETAILS: (id) => `/jobs/${id}`,
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD_CANDIDATE: '/dashboard',
  DASHBOARD_EMPLOYER: '/employer/dashboard',
  DASHBOARD_ADMIN: '/admin/dashboard',
};

export default ROUTES;
