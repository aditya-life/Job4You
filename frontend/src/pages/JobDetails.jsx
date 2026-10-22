import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobsService, applicationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import OtpModal from '../components/OtpModal';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Apply Modal state
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [applying, setApplying] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobsService.getJobDetail(id);
        setJob(res.data);
      } catch (err) {
        setError('Job posting not found or has been removed.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'job_seeker') {
      // Check application status
      applicationService.getMyApplications().then((res) => {
        const found = res.data.find((a) => a.job_id === parseInt(id));
        if (found) {
          setHasApplied(true);
          setApplicationStatus(found.status);
        }
      }).catch(console.error);

      // Check saved status
      applicationService.getSavedJobs().then((res) => {
        setIsSaved(res.data.some((j) => j.id === parseInt(id)));
      }).catch(console.error);
    }
  }, [id, isAuthenticated, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    setApplying(true);
    try {
      const res = await applicationService.applyToJob({
        job_id: parseInt(id),
        cover_letter: coverLetter,
        resume_url: resumeUrl || user?.resume_url,
      });
      setHasApplied(true);
      setApplicationStatus(res.data.status);
      setIsApplyOpen(false);
      alert('Application submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    try {
      const res = await applicationService.toggleSaveJob(parseInt(id));
      setIsSaved(res.data.saved);
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  if (loading) return <div className="container" style={{ padding: '60px', textAlign: 'center' }}>Loading job details...</div>;
  if (error || !job) {
    return (
      <div className="container" style={{ padding: '60px', textAlign: 'center' }}>
        <h2>{error}</h2>
        <Link to="/jobs" className="btn btn-primary" style={{ marginTop: '16px' }}>&larr; Back to Jobs</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '1000px' }}>
      <Link to="/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
        &larr; Back to Job Search
      </Link>

      <div className="card" style={{ padding: '36px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary)' }}>{job.company_name}</span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--dark)', marginTop: '4px', marginBottom: '12px' }}>
              {job.title}
            </h1>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-blue">📍 {job.location}</span>
              <span className="badge badge-purple">🏢 {job.workplace_type}</span>
              <span className="badge badge-green">💼 {job.job_type}</span>
              <span className="badge badge-amber">Experience: {job.experience_level}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={handleSave} className="btn btn-outline">
              {isSaved ? '❤️ Saved' : '🤍 Save Job'}
            </button>

            {hasApplied ? (
              <span className="badge badge-green" style={{ padding: '10px 18px', fontSize: '0.9rem' }}>
                ✓ Applied ({applicationStatus})
              </span>
            ) : (
              <button onClick={() => setIsApplyOpen(true)} className="btn btn-primary">
                Apply for Position &rarr;
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '28px' }}>
        <div>
          <div className="card" style={{ padding: '30px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>About the Role</h3>
            <div style={{ whiteSpace: 'pre-line', color: 'var(--text-main)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              {job.description}
            </div>

            {job.requirements && (
              <>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '28px', marginBottom: '16px' }}>
                  Requirements & Qualifications
                </h3>
                <div style={{ whiteSpace: 'pre-line', color: 'var(--text-main)', lineHeight: '1.7', fontSize: '0.95rem' }}>
                  {job.requirements}
                </div>
              </>
            )}

            {job.benefits && (
              <>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '28px', marginBottom: '16px' }}>
                  Perks & Benefits
                </h3>
                <div style={{ whiteSpace: 'pre-line', color: 'var(--text-main)', lineHeight: '1.7', fontSize: '0.95rem' }}>
                  {job.benefits}
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <div className="card" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Job Overview</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Salary Package</div>
                <strong style={{ color: '#047857' }}>
                  {job.min_salary && job.max_salary ? `₹${job.min_salary.toLocaleString()} - ₹${job.max_salary.toLocaleString()} ${job.salary_currency}` : 'Competitive'}
                </strong>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Industry / Category</div>
                <strong>{job.category}</strong>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Open Vacancies</div>
                <strong>{job.vacancies} Position(s)</strong>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Total View Count</div>
                <strong>{job.views_count} views</strong>
              </div>
            </div>

            {job.skills_required && (
              <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px' }}>Key Skills</h5>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {job.skills_required.split(',').map((skill, i) => (
                    <span key={i} className="badge badge-blue">{skill.trim()}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {isApplyOpen && (
        <div className="modal-overlay" onClick={() => setIsApplyOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>
              Apply for {job.title}
            </h3>

            <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Cover Letter / Brief Pitch
                </label>
                <textarea
                  rows={4}
                  placeholder="Introduce yourself and explain why you're a standout fit for this role..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                  Resume Link (Google Drive / Dropbox / Portfolio)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/your-resume.pdf"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="submit" disabled={applying} className="btn btn-primary" style={{ flex: 1 }}>
                  {applying ? 'Submitting...' : 'Confirm & Submit Application'}
                </button>
                <button type="button" onClick={() => setIsApplyOpen(false)} className="btn btn-outline">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <OtpModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => setIsApplyOpen(true)}
      />
    </div>
  );
}
