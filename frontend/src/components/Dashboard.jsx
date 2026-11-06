import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

export default function Dashboard({ user, onLogout }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // Fetch Protected Resource from Express Backend
    const fetchDashboardMetrics = async () => {
      setLoading(true);
      setError(null);

      try {
        // Axios automatically attaches Authorization Bearer header via request interceptor
        const response = await axiosClient.get('/dashboard/metrics');
        
        if (isMounted) {
          setMetrics(response.data.data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          const msg = err.response?.data?.message || 'Error fetching protected data';
          setError(msg);
          setLoading(false);
        }
      }
    };

    fetchDashboardMetrics();

    return () => { isMounted = false; };
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1.5rem', border: '1px solid #334155', borderRadius: '8px', background: '#1e293b', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '1rem' }}>
        <div>
          <h2>📊 Developer Dashboard</h2>
          <p style={{ margin: 0, color: '#94a3b8' }}>Logged in as: <strong>{user?.name}</strong> ({user?.email})</p>
        </div>
        <button 
          onClick={onLogout}
          style={{ padding: '0.5rem 1rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        {/* Loading State */}
        {loading && <p>⌛ Loading protected API metrics from Express backend...</p>}

        {/* Error State */}
        {error && <p style={{ color: '#ef4444' }}>❌ Error: {error}</p>}

        {/* Success State */}
        {!loading && !error && metrics && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '6px' }}>
              <h4>Active Projects</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{metrics.activeProjects}</p>
            </div>
            <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '6px' }}>
              <h4>Tasks Completed</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{metrics.tasksCompleted}</p>
            </div>
            <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '6px' }}>
              <h4>Pending Code Reviews</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{metrics.pendingCodeReviews}</p>
            </div>
            <div style={{ background: '#0f172a', padding: '1rem', borderRadius: '6px' }}>
              <h4>Server Status</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#22c55e' }}>{metrics.serverStatus}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
