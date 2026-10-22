import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobsService, referenceService, applicationService } from '../services/api';
import JobCard from '../components/JobCard';
import FilterSidebar from '../components/FilterSidebar';
import { useAuth } from '../context/AuthContext';

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [savedJobIds, setSavedJobIds] = useState([]);

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    workplace_type: searchParams.get('workplace_type') || '',
    job_type: searchParams.get('job_type') || '',
    experience_level: searchParams.get('experience_level') || '',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 10,
  });

  // Fetch reference categories and cities
  useEffect(() => {
    referenceService.getCategories().then((res) => setCategories(res.data)).catch(console.error);
    referenceService.getCities().then((res) => setCities(res.data)).catch(console.error);
  }, []);

  // Fetch saved jobs if logged in
  useEffect(() => {
    if (isAuthenticated) {
      applicationService.getSavedJobs()
        .then((res) => setSavedJobIds(res.data.map((j) => j.id)))
        .catch(console.error);
    }
  }, [isAuthenticated]);

  // Fetch jobs when filters change
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const cleanParams = {};
        Object.keys(filters).forEach((k) => {
          if (filters[k]) cleanParams[k] = filters[k];
        });
        const res = await jobsService.getJobs(cleanParams);
        setJobs(res.data.jobs);
        setTotal(res.data.total);
      } catch (err) {
        console.error('Failed to load jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [filters]);

  const handleSaveToggle = async (jobId) => {
    if (!isAuthenticated) {
      alert('Please sign in to save jobs.');
      return;
    }
    try {
      const res = await applicationService.toggleSaveJob(jobId);
      if (res.data.saved) {
        setSavedJobIds((prev) => [...prev, jobId]);
      } else {
        setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
      }
    } catch (err) {
      console.error('Save job toggle error:', err);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      q: '',
      category: '',
      location: '',
      workplace_type: '',
      job_type: '',
      experience_level: '',
      page: 1,
      limit: 10,
    });
    setSearchParams({});
  };

  return (
    <div className="container" style={{ padding: '36px 20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--dark)' }}>
          Explore Job Vacancies
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Showing {jobs.length} of {total} open opportunities
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '28px', alignItems: 'start' }}>
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          cities={cities}
          onReset={handleResetFilters}
        />

        <div>
          {/* Top Search Filter Bar */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Search keyword in title, company or skills..."
              value={filters.q}
              onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value, page: 1 }))}
              style={{ flex: 1, padding: '12px 16px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.95rem' }}
            />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              Loading job postings...
            </div>
          ) : jobs.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>No matching jobs found</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Try broadening your search keywords or resetting filters.</p>
              <button onClick={handleResetFilters} className="btn btn-outline btn-sm">
                Clear Filters
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSaveToggle={handleSaveToggle}
                  isSaved={savedJobIds.includes(job.id)}
                />
              ))}

              {/* Pagination */}
              {total > filters.limit && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
                  <button
                    disabled={filters.page <= 1}
                    onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
                    className="btn btn-outline btn-sm"
                  >
                    &larr; Previous Page
                  </button>
                  <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Page {filters.page} of {Math.ceil(total / filters.limit)}
                  </span>
                  <button
                    disabled={filters.page >= Math.ceil(total / filters.limit)}
                    onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
                    className="btn btn-outline btn-sm"
                  >
                    Next Page &rarr;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
