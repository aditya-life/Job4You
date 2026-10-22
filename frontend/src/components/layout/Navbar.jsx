import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routes';
import { USER_ROLES } from '../../constants/roles';

/**
 * Main Application Header & Navigation Bar.
 * Renders role-based action buttons and authentication states.
 */
export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <header className="header">
      <div className="container nav">
        <Link to={ROUTES.HOME} className="logo">
          💼 Job<span>4You</span>
        </Link>

        <nav className="nav-links">
          <Link to={ROUTES.JOBS} className="nav-link">
            Explore Jobs
          </Link>

          {isAuthenticated ? (
            <>
              {user?.role === USER_ROLES.EMPLOYER && (
                <>
                  <Link to={ROUTES.DASHBOARD_EMPLOYER} className="nav-link">
                    Employer Dashboard
                  </Link>
                  <Link to="/employer/post-job" className="btn btn-primary btn-sm">
                    + Post a Job
                  </Link>
                </>
              )}

              {user?.role === USER_ROLES.JOB_SEEKER && (
                <Link to={ROUTES.DASHBOARD_CANDIDATE} className="nav-link">
                  My Applications
                </Link>
              )}

              {user?.role === USER_ROLES.ADMIN && (
                <Link to={ROUTES.DASHBOARD_ADMIN} className="nav-link">
                  Admin Panel
                </Link>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="badge badge-blue">
                  {user?.name || user?.email} ({user?.role === USER_ROLES.EMPLOYER ? 'Employer' : 'Candidate'})
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
              <Link to={ROUTES.LOGIN} className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to={ROUTES.REGISTER} className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
