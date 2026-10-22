import { APPLICATION_STATUS_CONFIG } from '../constants/jobConstants';

/**
 * Returns badge styling and human readable label for an ATS application status.
 */
export const getStatusConfig = (status) => {
  return APPLICATION_STATUS_CONFIG[status] || {
    label: status || 'Unknown',
    badgeClass: 'badge-default',
    bg: '#f3f4f6',
    color: '#374151',
  };
};

export default getStatusConfig;
