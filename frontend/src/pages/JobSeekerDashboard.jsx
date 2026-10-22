import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService, employeeService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function JobSeekerDashboard() {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('applications'); // 'applications', 'saved', 'profile'
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [stats, setStats] = useState({ total_applied: 0, shortlisted: 0, saved_jobs_count: 0 });
  const [loading, setLoading] = useState(true);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    headline: user?.headline || '',
    bio: user?.bio || '',
    skills: user?.skills || '',
    experience_years: user?.experience_years || 0,
    city: user?.city || '',
    resume_url: user?.resume_url || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, appsRes, savedRes] = await Promise.all([
          employeeService.getDashboardStats(),
          applicationService.getMyApplications(),
          applicationService.getSavedJobs(),
        ]);
        setStats(statsRes.data);
        setApplications(appsRes.data);
        setSavedJobs(savedRes.data);
      } catch (err) {
        console.error('Failed to load candidate dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await employeeService.updateProfile(profileForm);
      setUser(res.data);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Shortlisted': return 'badge-green';
      case 'Hired': return 'badge-purple';
      case 'Under Review': return 'badge-amber';
      case 'Rejected': return 'badge-red';
      default: return 'badge-blue';
    }
  };

  if (loading) return <div className="container" style={{ padding: '60px', textAlign: 'center' }}>Loading dashboard...</div>;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--dark)' }}>
            Welcome back, {user?.name} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {user?.headline || 'Candidate Portal • Track your job hunt progress'}
          </p>
        </div>
        <Link to="/jobs" className="btn btn-primary">
          Browse Open Vacancies &rarr;
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid-3" style={{ marginBottom: '32px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Total Applications</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>{stats.total_applied}</div>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Shortlisted by Recruiters</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>{stats.shortlisted}</div>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Saved Bookmarks</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '4px' }}>{stats.saved_jobs_count}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('applications')}
          style={{
            padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.95rem',
            borderBottom: activeTab === 'applications' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'applications' ? 'var(--primary)' : 'var(--text-muted)'
          }}
        >
          My Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          style={{
            padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.95rem',
            borderBottom: activeTab === 'saved' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'saved' ? 'var(--primary)' : 'var(--text-muted)'
          }}
        >
          Saved Roles ({savedJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.95rem',
            borderBottom: activeTab === 'profile' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-muted)'
          }}
        >
          Edit Profile & Resume
        </button>
      </div>

      {/* Tab 1: Applications */}
      {activeTab === 'applications' && (
        <div>
          {applications.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No active applications</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Explore current job listings and start applying.</p>
              <Link to="/jobs" className="btn btn-primary btn-sm">Find Jobs</Link>
            </div>
          ) : (
            <div className="table-wrapper card" style={{ padding: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Job Title & Company</th>
                    <th>Date Applied</th>
                    <th>Current Status</th>
                    <th>Recruiter Feedback / Notes</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <strong>{app.job?.title || 'Job Opening'}</strong>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{app.job?.company_name}</div>
                      </td>
                      <td>{new Date(app.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(app.status)}`}>{app.status}</span>
                      </td>
                      <td style={{ color: app.employer_notes ? 'var(--dark)' : 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {app.employer_notes || 'Application awaiting review'}
                      </td>
                      <td>
                        <Link to={`/jobs/${app.job_id}`} className="btn btn-outline btn-sm">
                          View Job
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Jobs */}
      {activeTab === 'saved' && (
        <div className="grid-2">
          {savedJobs.length === 0 ? (
            <div className="card" style={{ gridColumn: 'span 2', textAlign: 'center', padding: '48px' }}>
              <p style={{ color: 'var(--text-muted)' }}>You haven't bookmarked any jobs yet.</p>
            </div>
          ) : (
            savedJobs.map((job) => (
              <div key={job.id} className="card">
                <h3>{job.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>{job.company_name} • {job.location}</p>
                <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-sm">Apply Now &rarr;</Link>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Profile */}
      {activeTab === 'profile' && (
        <div className="card" style={{ maxWidth: '680px', padding: '32px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px' }}>Candidate Profile Information</h3>

          <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Professional Headline</label>
              <input
                type="text"
                placeholder="e.g. Senior Backend Python & FastAPI Developer"
                value={profileForm.headline}
                onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Key Skills (Comma separated)</label>
              <input
                type="text"
                placeholder="Python, React, FastAPI, SQL, Docker, AWS"
                value={profileForm.skills}
                onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Total Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  value={profileForm.experience_years}
                  onChange={(e) => setProfileForm({ ...profileForm, experience_years: parseInt(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Current City</label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, India"
                  value={profileForm.city}
                  onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Resume Link (Google Drive / Portfolio)</label>
              <input
                type="url"
                placeholder="https://drive.google.com/your-resume.pdf"
                value={profileForm.resume_url}
                onChange={(e) => setProfileForm({ ...profileForm, resume_url: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Professional Bio</label>
              <textarea
                rows={3}
                placeholder="Highlight your background, engineering passions, and career accomplishments..."
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '6px' }}
              />
            </div>

            <button type="submit" disabled={savingProfile} className="btn btn-primary" style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
              {savingProfile ? 'Saving Changes...' : 'Save Profile Details'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
