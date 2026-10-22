import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { loginWithEmail, sendOtp, verifyOtp } = useAuth();

  const [loginMethod, setLoginMethod] = useState('otp'); // 'otp' or 'password'
  
  // OTP Form State
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('+919876543210');
  const [otp, setOtp] = useState('');
  const [demoCode, setDemoCode] = useState('123456');
  const [demoMode, setDemoMode] = useState(true);

  // Password Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      if (data.demo_otp) setDemoCode(data.demo_otp);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to dispatch OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (codeToVerify) => {
    const finalOtp = codeToVerify || otp;
    if (!finalOtp.trim()) {
      setError('Please enter verification code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await verifyOtp(identifier, finalOtp);
      if (data.user.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP code');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await loginWithEmail(email, password);
      if (data.user.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '480px', padding: '60px 20px' }}>
      <div className="card" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--dark)' }}>
            Welcome to Job<span>4You</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Sign in to manage jobs, applications, and career profiles
          </p>
        </div>

        {/* Login Method Toggle */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '8px', marginBottom: '24px' }}>
          <button
            type="button"
            onClick={() => { setLoginMethod('otp'); setError(''); }}
            style={{
              flex: 1, padding: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.85rem',
              background: loginMethod === 'otp' ? 'white' : 'transparent',
              color: loginMethod === 'otp' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: loginMethod === 'otp' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            📱 Mobile OTP Login
          </button>
          <button
            type="button"
            onClick={() => { setLoginMethod('password'); setError(''); }}
            style={{
              flex: 1, padding: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer',
              fontWeight: 600, fontSize: '0.85rem',
              background: loginMethod === 'password' ? 'white' : 'transparent',
              color: loginMethod === 'password' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: loginMethod === 'password' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            🔑 Email & Password
          </button>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '8px', color: '#991b1b', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {loginMethod === 'otp' ? (
          <div>
            {demoMode && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', color: '#166534' }}>
                <div style={{ fontWeight: 600 }}>⚡ Demo Mode Active:</div>
                <div style={{ marginTop: '2px' }}>
                  OTP verification bypass enabled! Demo Code: <strong>{demoCode}</strong>
                </div>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                    Mobile Number or Email
                  </label>
                  <input
                    type="text"
                    placeholder="+919876543210"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.95rem' }}
                    required
                  />
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '6px' }}>
                  {loading ? 'Sending...' : 'Get Verification Code'}
                </button>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Enter the 6-digit passcode for <strong>{identifier}</strong>:
                </p>

                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '2px solid var(--primary)', borderRadius: '8px', fontSize: '1.4rem', textAlign: 'center', letterSpacing: '6px', fontWeight: 700 }}
                />

                <button
                  type="button"
                  onClick={() => handleVerifyOtp()}
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  {loading ? 'Verifying...' : 'Verify Code & Sign In'}
                </button>

                {demoMode && (
                  <button
                    type="button"
                    onClick={() => { setOtp(demoCode); handleVerifyOtp(demoCode); }}
                    className="btn btn-outline"
                    style={{ width: '100%', borderColor: '#10b981', color: '#047857', background: '#ecfdf5' }}
                  >
                    ⚡ Auto-Fill Demo OTP & Login
                  </button>
                )}

                <div style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    &larr; Re-enter phone number
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handlePasswordLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.95rem' }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.95rem' }}
                required
              />
            </div>

            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <strong>Demo Credentials:</strong><br />
              Admin: <code>admin@job4you.com</code> / <code>Admin@123</code><br />
              Employer: <code>hr@techcorp.com</code> / <code>Employer@123</code>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '6px' }}>
              {loading ? 'Authenticating...' : 'Sign In with Password'}
            </button>
          </form>
        )}

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
