/**
 * Formatting Utilities.
 * 
 * Provides consistent formatting for currency salaries, timestamps,
 * and experience strings across the application.
 */

/**
 * Formats a salary range with currency symbol.
 * Example: formatSalary(1200000, 1800000, 'INR') => '₹12,00,000 - ₹18,00,000 / yr'
 */
export const formatSalary = (min, max, currency = 'INR', period = 'Per Annum') => {
  if (!min && !max) return 'Salary Undisclosed';

  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : `${currency} `;
  
  const formatNum = (num) => {
    if (!num) return '';
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US').format(num);
  };

  const periodSuffix = period ? ` / ${period.toLowerCase().replace('per ', '')}` : '';

  if (min && max) {
    return `${symbol}${formatNum(min)} - ${symbol}${formatNum(max)}${periodSuffix}`;
  } else if (min) {
    return `From ${symbol}${formatNum(min)}${periodSuffix}`;
  } else {
    return `Up to ${symbol}${formatNum(max)}${periodSuffix}`;
  }
};

/**
 * Formats an ISO date string into human-readable format.
 * Example: formatDate('2026-10-22T21:49:00') => '22 Oct 2026'
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Computes relative time (e.g., '2 days ago', 'Just now').
 */
export const timeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  
  return formatDate(dateString);
};
