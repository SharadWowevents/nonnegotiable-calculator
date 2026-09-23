import React, { useState } from 'react';
import '../App.css';

export default function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  return (
    <div className="tracker-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '24px' }}>
        <h2 style={{ justifyContent: 'center', marginBottom: '20px' }}>Admin Login</h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="field">
            <label>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="saveBtn" style={{ marginTop: '10px' }}>Sign In</button>
        </form>
      </div>
    </div>
  );
}