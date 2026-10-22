import React, { useState, useEffect } from 'react';
import { jobsService, referenceService } from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ active_jobs: 0, companies: 0, candidates: 0 });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          referenceService.getStats(),
          jobsService.getJobs({ limit: 50 }),
        ]);
        setStats(statsRes.data);
        setJobs(jobsRes.data.jobs);
      } catch (err) {
        console.error('Admin data error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job listing?')) return;
    try {
      await jobsService.deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      alert('Job listing removed.');
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  if (loading) return <div className="container" style={{ padding: '60px', textAlign: 'center' }}>Loading Admin Panel...</div>;

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--dark)' }}>
          System Administration & Oversight
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Job4You Master Operations Console • Database: MySQL / SQLite Engine
        </p>
      </div>

      <div className="grid-3" style={{ marginBottom: '32px' }}>
        <div className="card">
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Active Jobs in Catalog</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>{stats.active_jobs}</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Registered Employers</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>{stats.companies}</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Registered Candidates</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '4px' }}>{stats.candidates}</div>
        </div>
      </div>

      <div className="card" style={{ padding: '24px', marginBottom: '32px', background: '#f8fafc' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>⚡ System Environment & Flags</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', fontSize: '0.9rem' }}>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>OTP Verification Engine:</div>
            <strong style={{ color: '#047857' }}>Demo Bypass Active (123456)</strong>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>API Backend Protocol:</div>
            <strong>FastAPI v0.110.0 (Python 3.9+)</strong>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>Security Strategy:</div>
            <strong>JWT (HS256) + PBKDF2 Password Salts</strong>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px' }}>All Platform Job Listings</h3>
      <div className="table-wrapper card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Role & Organization</th>
              <th>Category</th>
              <th>Location</th>
              <th>Applicants</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id}>
                <td>#{j.id}</td>
                <td>
                  <strong>{j.title}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{j.company_name}</div>
                </td>
                <td>{j.category}</td>
                <td>{j.location} ({j.workplace_type})</td>
                <td><span className="badge badge-blue">{j.applications_count || 0} applied</span></td>
                <td>
                  <button
                    onClick={() => handleDeleteJob(j.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete Listing
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
