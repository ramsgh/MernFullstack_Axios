import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';

export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('dev@example.com');
  const [password, setPassword] = useState('password123');
  
  // React States for Request Lifecycle
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. API Call using Axios
      const response = await axiosClient.post('/auth/login', { email, password });
      
      const { token, user } = response.data;

      // 2. Store Auth Token & User info in LocalStorage
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_info', JSON.stringify(user));

      setLoading(false);
      onLoginSuccess(user);
    } catch (err) {
      setLoading(false);
      // Handling Axios Error response
      const errorMessage = err.response?.data?.message || 'Failed to connect to backend server';
      setError(errorMessage);
    }
  };

  return (
    <div style={{ maxWidth: '380px', margin: '2rem auto', padding: '1.5rem', border: '1px solid #334155', borderRadius: '8px', background: '#1e293b', color: '#fff' }}>
      <h2>🔐 Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
            required 
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
            required 
          />
        </div>

        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>❌ {error}</div>}

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
