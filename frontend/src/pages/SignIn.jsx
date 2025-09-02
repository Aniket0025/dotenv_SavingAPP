import { useState } from 'react';
import { api, setToken } from '../api/client';
import { useNavigate, Link } from 'react-router-dom';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api('/app/v1/user/signin', {
        method: 'POST',
        body: { email, password },
      });
      if (res?.token) {
        setToken(res.token);
        navigate('/env');
      } else {
        setError('Unexpected response');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h2 style={{marginBottom: 12}}>Welcome back</h2>
        <p className="switch-text" style={{marginTop: 0, marginBottom: 16}}>Sign in to manage your environment secrets</p>
        <form onSubmit={onSubmit}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          {error && <div className="error">{error}</div>}
          <button className="btn btn-primary" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <p className="switch-text">Don't have an account? <Link to="/signup">Create one</Link></p>
      </div>
    </div>
  );
}
