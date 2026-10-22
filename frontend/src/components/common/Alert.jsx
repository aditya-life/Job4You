import React from 'react';

/**
 * Reusable Alert Banner Component.
 * Pure SVG icons with zero external icon package dependency.
 */
export const Alert = ({
  type = 'info',
  message,
  children,
  onClose,
  className = '',
}) => {
  const content = message || children;
  if (!content) return null;

  const config = {
    info: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af' },
    success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534' },
    error: { bg: '#fef2f2', border: '#fecaca', text: '#991b1b' },
    warning: { bg: '#fffbeb', border: '#fde68a', text: '#92400e' },
  }[type] || { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af' };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: '8px',
        color: config.text,
        fontSize: '0.9rem',
        margin: '0.75rem 0',
      }}
      className={className}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0 }}
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>{content}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit' }}
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
