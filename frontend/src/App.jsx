import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

export default function App() {
  const [user, setUser] = useState(null);

  // Check LocalStorage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('user_info');
    const token = localStorage.getItem('auth_token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    setUser(null);
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', background: '#0f172a', minHeight: '100vh', padding: '1rem' }}>
      {!user ? (
        <LoginForm onLoginSuccess={(userData) => setUser(userData)} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}
