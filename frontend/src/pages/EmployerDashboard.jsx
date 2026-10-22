import React, { useState, useEffect } from 'react';
import { employerService, jobsService, applicationService, referenceService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs', 'post_job', 'applicants', 'candidates'
  const [stats, setStats] = useState({ total_jobs: 0, active_jobs: 0, total_applicants: 0, shortlisted_count: 0 });
  const [myJobs, setMyJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [candidateQuery, setCandidateQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // New Job Form State
  const [jobForm, setJobForm] = useState({
    title: '',
    company_name: user?.company_name || '',
    category: 'Software & Technology',
    designation: '',
    location: 'Bengaluru',
    workplace_type: 'Remote',
    job_type: 'Full-time',
    experience_level: 'Mid-Level',
    min_salary: 1000000,
    max_salary: 1800000,
    salary_currency: 'INR',
    description: '',
    requirements: '',
    benefits: '',
    skills_required: '',
    vacancies: 1,
  });
  const [postingJob, setPostingJob] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [statsRes, jobsRes, catsRes] = await Promise.all([
        employerService.getDashboardStats(),
        employerService.getMyJobs(),
        referenceService.getCategories(),
      ]);
      setStats(statsRes.data);
      setMyJobs(jobsRes.data);
      setCategories(catsRes.data);
      if (jobsRes.data.length > 0) {
        setSelectedJobId(jobsRes.data[0].id);
        loadApplicants(jobsRes.data[0].id);
      }
    } catch (err) {
      console.error('Failed to load employer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadApplicants = async (jobId) => {
    try {
      const res = await applicationService.getJobApplicants(jobId);
      setApplicants(res.data);
    } catch (err) {
      console.error('Failed to load applicants:', err);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setPostingJob(true);
    try {
      await jobsService.createJob(jobForm);
      alert('Job posted successfully!');
      setActiveTab('jobs');
      fetchInitialData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to post job');
    } finally {
      setPostingJob(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    const notes = prompt(`Add internal recruiter note for status change to "${newStatus}":`, 'Evaluated candidate profile');
    try {
      await applicationService.updateStatus(appId, newStatus, notes);
      setApplicants((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus, employer_notes: notes } : a))
      );
      alert('Applicant status updated!');
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleSearchCandidates = async (e) => {
    e.preventDefault();
    try {
      const res = await employerService.getCandidates({ q: candidateQuery });
      setCandidates(res.data);
    } catch (err) {
      console.error('Candidate search error:', err);
    }
  };

  if (loading) return <div className="container" style={{ padding: '60px', textAlign: 'center' }}>Loading employer portal...</div>;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--dark)' }}>
            Employer ATS Portal — {user?.company_name || 'Dashboard'}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Recruiter: {user?.name} • Manage job openings and hiring pipeline
          </p>
        </div>
        <button onClick={() => setActiveTab('post_job')} className="btn btn-primary">
          + Post New Job Opening
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Total Posted Jobs</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>{stats.total_jobs}</div>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Active Listings</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>{stats.active_jobs}</div>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Total Applicants</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '4px' }}>{stats.total_applicants}</div>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Shortlisted Candidates</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>{stats.shortlisted_count}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('jobs')}
          style={{
            padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.95rem',
            borderBottom: activeTab === 'jobs' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'jobs' ? 'var(--primary)' : 'var(--text-muted)'
          }}
        >
          My Posted Jobs ({myJobs.length})
        </button>
        <button
          onClick={() => setActiveTab('post_job')}
          style={{
            padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.95rem',
            borderBottom: activeTab === 'post_job' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'post_job' ? 'var(--primary)' : 'var(--text-muted)'
          }}
        >
          + Post a Job
        </button>
        <button
          onClick={() => setActiveTab('applicants')}
          style={{
            padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.95rem',
            borderBottom: activeTab === 'applicants' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'applicants' ? 'var(--primary)' : 'var(--text-muted)'
          }}
        >
          Review Applicants
        </button>
        <button
          onClick={() => setActiveTab('candidates')}
          style={{
            padding: '12px 20px', border: 'none', background: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.95rem',
            borderBottom: activeTab === 'candidates' ? '2px solid var(--primary)' : 'none',
            color: activeTab === 'candidates' ? 'var(--primary)' : 'var(--text-muted)'
          }}
        >
          Search Talent Pool
        </button>
      </div>

      {/* Tab 1: My Posted Jobs */}
      {activeTab === 'jobs' && (
        <div className="table-wrapper card" style={{ padding: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Job Title & Location</th>
                <th>Category</th>
                <th>Type</th>
                <th>Applicants</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myJobs.map((j) => (
                <tr key={j.id}>
                  <td>
                    <strong>{j.title}</strong>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{j.location} • {j.workplace_type}</div>
                  </td>
                  <td>{j.category}</td>
                  <td><span className="badge badge-blue">{j.job_type}</span></td>
                  <td>
                    <button
                      onClick={() => { setSelectedJobId(j.id); loadApplicants(j.id); setActiveTab('applicants'); }}
                      className="badge badge-green"
                      style={{ border: 'none', cursor: 'pointer' }}
                    >
                      {j.applications_count || 0} Applicants &rarr;
                    </button>
                  </td>
                  <td>{j.views_count}</td>
                  <td>
                    <button
                      onClick={() => { setSelectedJobId(j.id); loadApplicants(j.id); setActiveTab('applicants'); }}
                      className="btn btn-outline btn-sm"
                    >
                      View Pipeline
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Post Job Form */}
      {activeTab === 'post_job' && (
        <div className="card" style={{ maxWidth: '800px', padding: '36px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>Post a New Job Opportunity</h2>

          <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Job Title</label>
              <input
                type="text"
                placeholder="e.g. Senior Python / FastAPI Backend Engineer"
                value={jobForm.title}
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Category</label>
                <select
                  value={jobForm.category}
                  onChange={(e) => setJobForm({ ...jobForm, category: e.target.value })}
                  style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Location</label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru, Mumbai, Remote"
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Workplace</label>
                <select
                  value={jobForm.workplace_type}
                  onChange={(e) => setJobForm({ ...jobForm, workplace_type: e.target.value })}
                  style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-Site">On-Site</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Job Type</label>
                <select
                  value={jobForm.job_type}
                  onChange={(e) => setJobForm({ ...jobForm, job_type: e.target.value })}
                  style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Experience</label>
                <select
                  value={jobForm.experience_level}
                  onChange={(e) => setJobForm({ ...jobForm, experience_level: e.target.value })}
                  style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}
                >
                  <option value="Fresher">Entry Level / Fresher</option>
                  <option value="Junior">Junior (1-3 yrs)</option>
                  <option value="Mid-Level">Mid-Level (3-5 yrs)</option>
                  <option value="Senior">Senior (5+ yrs)</option>
                  <option value="Lead">Lead / Architect</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Min Salary (INR / Annum)</label>
                <input
                  type="number"
                  value={jobForm.min_salary}
                  onChange={(e) => setJobForm({ ...jobForm, min_salary: parseFloat(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Max Salary (INR / Annum)</label>
                <input
                  type="number"
                  value={jobForm.max_salary}
                  onChange={(e) => setJobForm({ ...jobForm, max_salary: parseFloat(e.target.value) || 0 })}
                  style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Key Skills Required (Comma separated)</label>
              <input
                type="text"
                placeholder="Python, FastAPI, SQL, React, Docker"
                value={jobForm.skills_required}
                onChange={(e) => setJobForm({ ...jobForm, skills_required: e.target.value })}
                style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Job Description</label>
              <textarea
                rows={4}
                placeholder="Detail the daily responsibilities, product mission, and team structure..."
                value={jobForm.description}
                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>Requirements & Qualifications</label>
              <textarea
                rows={3}
                placeholder="Years of experience, technical proficiencies, education..."
                value={jobForm.requirements}
                onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px' }}
              />
            </div>

            <button type="submit" disabled={postingJob} className="btn btn-primary" style={{ padding: '14px', marginTop: '12px' }}>
              {postingJob ? 'Publishing Job Listing...' : '🚀 Publish Job Listing'}
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Applicants Review */}
      {activeTab === 'applicants' && (
        <div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
            <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Select Job Pipeline:</label>
            <select
              value={selectedJobId || ''}
              onChange={(e) => {
                const id = parseInt(e.target.value);
                setSelectedJobId(id);
                loadApplicants(id);
              }}
              style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid var(--border)', minWidth: '280px' }}
            >
              {myJobs.map((j) => (
                <option key={j.id} value={j.id}>{j.title} ({j.location})</option>
              ))}
            </select>
          </div>

          {applicants.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
              <p style={{ color: 'var(--text-muted)' }}>No applicants for this role yet.</p>
            </div>
          ) : (
            <div className="table-wrapper card" style={{ padding: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Experience</th>
                    <th>Resume / Cover Letter</th>
                    <th>Applied Date</th>
                    <th>Current Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <strong>{a.applicant?.name || `Candidate #${a.user_id}`}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{a.applicant?.email} • {a.applicant?.phone || 'No phone'}</div>
                      </td>
                      <td>{a.applicant?.experience_years ? `${a.applicant.experience_years} years` : 'Entry'}</td>
                      <td>
                        {a.resume_url ? (
                          <a href={a.resume_url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}>
                            View Resume &rarr;
                          </a>
                        ) : 'No Link'}
                        {a.cover_letter && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            "{a.cover_letter}"
                          </div>
                        )}
                      </td>
                      <td>{new Date(a.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className="badge badge-blue">{a.status}</span>
                      </td>
                      <td>
                        <select
                          value={a.status}
                          onChange={(e) => handleStatusChange(a.id, e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                        >
                          <option value="Applied">Applied</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlist ⭐</option>
                          <option value="Interview Scheduled">Interview Scheduled 📅</option>
                          <option value="Hired">Hire 🎉</option>
                          <option value="Rejected">Reject</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Search Candidates */}
      {activeTab === 'candidates' && (
        <div>
          <form onSubmit={handleSearchCandidates} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Search talent pool by skill (e.g. Python, React, SQL)..."
              value={candidateQuery}
              onChange={(e) => setCandidateQuery(e.target.value)}
              style={{ flex: 1, padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '8px' }}
            />
            <button type="submit" className="btn btn-primary">Find Candidates</button>
          </form>

          <div className="grid-3">
            {candidates.map((c) => (
              <div key={c.id} className="card">
                <h3>{c.name}</h3>
                <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.88rem' }}>{c.headline || 'Verified Candidate'}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '8px 0' }}>📍 {c.city || 'India'} • {c.experience_years} yrs exp</p>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {c.skills?.split(',').slice(0, 4).map((s, i) => (
                    <span key={i} className="badge badge-blue">{s.trim()}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
