import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container nav">
        <Link to="/" className="logo">
          💼 Job<span>4You</span>
        </Link>

        <nav className="nav-links">
          <Link to="/jobs" className="nav-link">
            Explore Jobs
          </Link>

          {isAuthenticated ? (
            <>
              {user?.role === 'employer' && (
                <>
                  <Link to="/employer/dashboard" className="nav-link">
                    Employer Dashboard
                  </Link>
                  <Link to="/employer/post-job" className="btn btn-primary btn-sm">
                    + Post a Job
                  </Link>
                </>
              )}

              {user?.role === 'job_seeker' && (
                <Link to="/candidate/dashboard" className="nav-link">
                  My Applications
                </Link>
              )}

              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" className="nav-link">
                  Admin Panel
                </Link>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="badge badge-blue">
                  {user?.name || user?.email} ({user?.role === 'employer' ? 'Employer' : 'Candidate'})
                </span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>
                ⚡ Demo Mode
              </span>
              <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
