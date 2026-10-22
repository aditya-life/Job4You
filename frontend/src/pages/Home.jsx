import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsService, referenceService } from '../services/api';
import JobCard from '../components/JobCard';
import OtpModal from '../components/OtpModal';

export default function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ active_jobs: 15, companies: 8, candidates: 50, placement_rate: '94%' });
  const [isOtpOpen, setIsOtpOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, catsRes, statsRes] = await Promise.all([
          jobsService.getJobs({ limit: 4 }),
          referenceService.getCategories(),
          referenceService.getStats(),
        ]);
        setFeaturedJobs(jobsRes.data.jobs);
        setCategories(catsRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Error fetching landing page data:', err);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?q=${encodeURIComponent(searchTerm)}&location=${encodeURIComponent(location)}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div style={{ display: 'inline-block', background: '#eff6ff', color: 'var(--primary)', padding: '6px 16px', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px' }}>
            🚀 Next-Gen Career Matching • Python & React Stack
          </div>
          <h1>
            Connecting Ambition with <span style={{ color: 'var(--primary)' }}>Opportunity</span>
          </h1>
          <p>
            Browse thousands of verified job vacancies across high-growth startups and global enterprises. Apply seamlessly with instant Mobile OTP verification.
          </p>

          <form onSubmit={handleSearch} className="search-card">
            <div className="search-input-group">
              <input
                type="text"
                placeholder="Job title, skills (e.g. Python, React)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="search-input-group">
              <input
                type="text"
                placeholder="City or 'Remote'..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0 28px' }}>
              Search Jobs
            </button>
          </form>

          {/* Quick Demo Login CTA */}
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={() => setIsOtpOpen(true)}
              className="btn btn-outline btn-sm"
              style={{ borderColor: '#10b981', color: '#047857', background: '#ecfdf5' }}
            >
              ⚡ Try 1-Click Mobile OTP Demo Login
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ background: '#ffffff', borderY: '1px solid var(--border)', padding: '36px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', textAlign: 'center', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{stats.active_jobs}+</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Active Openings</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--dark)' }}>{stats.companies}+</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Hiring Companies</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>{stats.candidates}+</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Verified Candidates</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>{stats.placement_rate}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Placement Success</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--dark)' }}>Browse by Industry</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Explore open vacancies tailored to your domain</p>
            </div>
          </div>

          <div className="grid-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="card"
                onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.name)}`)}
                style={{ cursor: 'pointer', textAlign: 'center', padding: '28px 20px' }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{cat.icon}</div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>{cat.name}</h4>
                <span className="badge badge-blue">{cat.count}+ Jobs</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section style={{ padding: '20px 0 60px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--dark)' }}>Featured Job Postings</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Top verified roles accepting applications today</p>
            </div>
            <button onClick={() => navigate('/jobs')} className="btn btn-outline btn-sm">
              View All Jobs &rarr;
            </button>
          </div>

          <div className="grid-2">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onSuccess={() => navigate('/jobs')}
      />
    </div>
  );
}
