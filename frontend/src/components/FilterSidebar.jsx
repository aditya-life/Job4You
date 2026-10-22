import React from 'react';

export default function FilterSidebar({ filters, setFilters, categories = [], cities = [], onReset }) {
  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: 1, // Reset page on filter change
    }));
  };

  return (
    <div className="card" style={{ padding: '20px', height: 'fit-content' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>🔍 Filter Jobs</h3>
        <button onClick={onReset} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
          Reset
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Category */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
            Job Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.9rem' }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id || c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
            Location
          </label>
          <select
            value={filters.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.9rem' }}
          >
            <option value="">All Locations</option>
            {cities.map((city, idx) => (
              <option key={idx} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Workplace Type */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
            Workplace Type
          </label>
          <select
            value={filters.workplace_type || ''}
            onChange={(e) => handleChange('workplace_type', e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.9rem' }}
          >
            <option value="">Any Workplace</option>
            <option value="Remote">100% Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-Site">On-Site</option>
          </select>
        </div>

        {/* Job Type */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
            Employment Type
          </label>
          <select
            value={filters.job_type || ''}
            onChange={(e) => handleChange('job_type', e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.9rem' }}
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        {/* Experience Level */}
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
            Experience Level
          </label>
          <select
            value={filters.experience_level || ''}
            onChange={(e) => handleChange('experience_level', e.target.value)}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.9rem' }}
          >
            <option value="">All Experience</option>
            <option value="Fresher">Entry Level / Fresher</option>
            <option value="Junior">Junior (1-3 yrs)</option>
            <option value="Mid-Level">Mid-Level (3-5 yrs)</option>
            <option value="Senior">Senior (5+ yrs)</option>
            <option value="Lead">Lead / Architect</option>
          </select>
        </div>
      </div>
    </div>
  );
}
