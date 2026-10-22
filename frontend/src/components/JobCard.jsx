import React from 'react';
import { Link } from 'react-router-dom';

export default function JobCard({ job, onSaveToggle, isSaved }) {
  const formatSalary = (min, max, curr) => {
    if (!min && !max) return 'Competitive Salary';
    const formatter = (num) => (num >= 100000 ? `₹${(num / 100000).toFixed(1)}L` : `₹${num}`);
    if (min && max) return `${formatter(min)} - ${formatter(max)}`;
    if (min) return `From ${formatter(min)}`;
    return `Up to ${formatter(max)}`;
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              {job.company_name}
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--dark)', marginTop: '2px' }}>
              <Link to={`/jobs/${job.id}`} style={{ color: 'inherit' }}>
                {job.title}
              </Link>
            </h3>
          </div>
          {onSaveToggle && (
            <button
              onClick={() => onSaveToggle(job.id)}
              style={{
                background: isSaved ? '#fee2e2' : '#f1f5f9',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 10px',
                cursor: 'pointer',
                fontSize: '1rem',
                color: isSaved ? '#ef4444' : '#64748b'
              }}
              title={isSaved ? 'Remove Bookmark' : 'Save Job'}
            >
              {isSaved ? '❤️' : '🤍'}
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <span className="badge badge-blue">📍 {job.location}</span>
          <span className="badge badge-purple">🏢 {job.workplace_type}</span>
          <span className="badge badge-green">💼 {job.job_type}</span>
          <span className="badge badge-amber">💰 {formatSalary(job.min_salary, job.max_salary, job.salary_currency)}</span>
        </div>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {job.description}
        </p>

        {job.skills_required && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {job.skills_required.split(',').slice(0, 4).map((skill, idx) => (
              <span key={idx} style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', color: '#475569' }}>
                {skill.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {job.applications_count ? `${job.applications_count} applicants` : 'Be the first to apply'}
        </span>
        <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-sm">
          View & Apply &rarr;
        </Link>
      </div>
    </div>
  );
}
