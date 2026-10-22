import React from 'react';

/**
 * Reusable Badge Component for job tags and statuses.
 */
export const Badge = ({ children, variant = 'default', className = '', style = {} }) => {
  return (
    <span
      className={`badge badge-${variant} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
};

export default Badge;
