import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('job4you_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('job4you_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('job4you_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          setUser(res.data);
          localStorage.setItem('job4you_user', JSON.stringify(res.data));
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const saveAuthSession = (accessToken, userData) => {
    setToken(accessToken);
    setUser(userData);
    localStorage.setItem('job4you_token', accessToken);
    localStorage.setItem('job4you_user', JSON.stringify(userData));
  };

  const loginWithEmail = async (email, password) => {
    const res = await authService.login(email, password);
    saveAuthSession(res.data.access_token, res.data.user);
    return res.data;
  };

  const signup = async (payload) => {
    const res = await authService.signup(payload);
    saveAuthSession(res.data.access_token, res.data.user);
    return res.data;
  };

  const sendOtp = async (identifier, purpose = 'login') => {
    const res = await authService.sendOtp(identifier, purpose);
    return res.data;
  };

  const verifyOtp = async (identifier, otp, name = null, role = 'job_seeker') => {
    const res = await authService.verifyOtp(identifier, otp, name, role);
    saveAuthSession(res.data.access_token, res.data.user);
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('job4you_token');
    localStorage.removeItem('job4you_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        loginWithEmail,
        signup,
        sendOtp,
        verifyOtp,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
