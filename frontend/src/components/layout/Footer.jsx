import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

/**
 * Standard Application Footer.
 */
export default function Footer() {
  return (
    <footer style={{ background: '#ffffff', borderTop: '1px solid var(--border)', padding: '48px 0 24px', marginTop: '64px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '32px', marginBottom: '40px' }}>
          <div>
            <div className="logo" style={{ marginBottom: '16px' }}>
              💼 Job<span>4You</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '320px', lineHeight: '1.6' }}>
              The modern career matching and recruiting ecosystem. Connecting verified talent with leading companies worldwide with zero friction.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', color: 'var(--dark)' }}>Candidates</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li><Link to={ROUTES.JOBS}>Explore All Jobs</Link></li>
              <li><Link to={ROUTES.DASHBOARD_CANDIDATE}>Application Tracker</Link></li>
              <li><Link to={ROUTES.LOGIN}>Instant Mobile OTP Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', color: 'var(--dark)' }}>Employers</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li><Link to={ROUTES.REGISTER}>Create Employer Account</Link></li>
              <li><Link to={ROUTES.DASHBOARD_EMPLOYER}>Applicant ATS Pipeline</Link></li>
              <li><Link to={ROUTES.DASHBOARD_EMPLOYER}>Post a Job Opening</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px', color: 'var(--dark)' }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li><a href="http://localhost:8000/docs" target="_blank" rel="noreferrer">FastAPI Swagger Docs</a></li>
              <li><a href="http://localhost:8000/redoc" target="_blank" rel="noreferrer">ReDoc API Specs</a></li>
              <li><span className="badge badge-green">v1.0.0 Ready</span></li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            &copy; {new Date().getFullYear()} <strong>Job4You</strong>. Developed with passion by Aditya. All rights reserved.
          </div>
          <div>
            Enterprise Grade • Python FastAPI + React 18 + MySQL
          </div>
        </div>
      </div>
    </footer>
  );
}
