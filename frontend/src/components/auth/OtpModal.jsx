import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { USER_ROLES } from '../../constants/roles';

/**
 * Enterprise OTP Verification Modal.
 * Supports Phone/Email verification, Demo OTP Bypass (123456 auto-fill),
 * and dynamic role selection.
 */
export default function OtpModal({ isOpen, onClose, onSuccess, defaultRole = USER_ROLES.JOB_SEEKER }) {
  const { sendOtp, verifyOtp } = useAuth();
  const [step, setStep] = useState(1); // 1: Enter Phone/Email, 2: Enter OTP
  const [identifier, setIdentifier] = useState('+919876543210');
  const [name, setName] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [otp, setOtp] = useState('');
  const [demoCode, setDemoCode] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoMode, setDemoMode] = useState(true);

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please provide phone number or email');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await sendOtp(identifier);
      setDemoMode(data.demo_mode);
      if (data.demo_otp) {
        setDemoCode(data.demo_otp);
      }
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to dispatch OTP. Please check backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (codeToVerify) => {
    const finalOtp = codeToVerify || otp;
    if (!finalOtp.trim()) {
      setError('Please enter the 6-digit verification code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await verifyOtp(identifier, finalOtp, name || null, role);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP code');
    } finally {
      setLoading(false);
    }
  };

  const autoFillAndLogin = () => {
    setOtp(demoCode);
    handleVerifyOtp(demoCode);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--dark)' }}>
            {step === 1 ? '📱 Mobile / Email Login' : '🔐 Verify One-Time Passcode'}
          </h3>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            &times;
          </button>
        </div>

        {demoMode && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem', color: '#166534' }}>
            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⚡ Demo Mode Active:</span>
              <span>OTP verification bypass is enabled!</span>
            </div>
            <div style={{ marginTop: '4px', color: '#15803d' }}>
              Universal Demo OTP: <strong style={{ letterSpacing: '1px' }}>{demoCode}</strong> (or auto-fill below).
            </div>
          </div>
        )}

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '8px', color: '#991b1b', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Phone Number or Email
              </label>
              <input
                type="text"
                placeholder="+919876543210 or user@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.95rem' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Your Name (Optional for new users)
              </label>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.95rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Account Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.95rem' }}
              >
                <option value={USER_ROLES.JOB_SEEKER}>Job Seeker (Candidate)</option>
                <option value={USER_ROLES.EMPLOYER}>Employer / Recruiter</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              {loading ? 'Sending OTP...' : 'Send Verification OTP'}
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Enter the 6-digit code sent to <strong>{identifier}</strong>:
            </p>

            <input
              type="text"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ width: '100%', padding: '14px', border: '2px solid var(--primary)', borderRadius: '8px', fontSize: '1.4rem', textAlign: 'center', letterSpacing: '6px', fontWeight: 700 }}
            />

            <button
              onClick={() => handleVerifyOtp()}
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>

            {demoMode && (
              <button
                type="button"
                onClick={autoFillAndLogin}
                className="btn btn-outline"
                style={{ width: '100%', borderColor: '#10b981', color: '#047857', background: '#ecfdf5' }}
              >
                ⚡ 1-Click Demo Login (Auto-Fill {demoCode})
              </button>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 500 }}
              >
                &larr; Change Number
              </button>
              <button
                type="button"
                onClick={handleSendOtp}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                Resend Code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
