import React, { useState, useEffect } from 'react';
import NonNegotiablesTracker from './NonNegotiablesTracker';
import Login from './Login';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('nn_token') || null);

  useEffect(() => {
    if (token) localStorage.setItem('nn_token', token);
    else localStorage.removeItem('nn_token');
  }, [token]);

  if (!token) return <Login setToken={setToken} />;
  return <NonNegotiablesTracker token={token} setToken={setToken} />;
}