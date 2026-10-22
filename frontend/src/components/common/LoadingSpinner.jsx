import React from 'react';

/**
 * Reusable Loading Spinner Component.
 * Pure SVG implementation with zero external icon dependencies.
 */
export const LoadingSpinner = ({ text = 'Loading...', size = 36, fullHeight = false }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem',
        minHeight: fullHeight ? '60vh' : 'auto',
        color: '#64748b',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#2563eb"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ animation: 'spin 1s linear infinite', marginBottom: '0.75rem' }}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      {text && <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
