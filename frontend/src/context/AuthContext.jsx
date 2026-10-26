import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('careermatch_token'));
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);
        } catch (err) {
          console.warn('Failed to restore session:', err.message);
          setToken(null);
          setUser(null);
          localStorage.removeItem('careermatch_token');
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (credentials) => {
    const res = await api.login(credentials);
    localStorage.setItem('careermatch_token', res.token);
    setToken(res.token);
    setUser(res.user);
    showToast(`Welcome back, ${res.user.name}!`);
    return res.user;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    localStorage.setItem('careermatch_token', res.token);
    setToken(res.token);
    setUser(res.user);
    showToast('Registration successful! Please setup your profile.');
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('careermatch_token');
    setToken(null);
    setUser(null);
    showToast('Logged out successfully.', 'info');
  };

  const refreshProfile = async () => {
    if (token) {
      try {
        const res = await api.getMe();
        setUser(res.user);
      } catch (e) {
        console.warn('Failed to refresh user:', e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshProfile,
        showToast,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 20px',
            borderRadius: '12px',
            background: toast.type === 'error' ? '#ef4444' : (toast.type === 'info' ? '#3b82f6' : '#10b981'),
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <span>{toast.type === 'error' ? '⚠️' : (toast.type === 'info' ? 'ℹ️' : '✓')}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
