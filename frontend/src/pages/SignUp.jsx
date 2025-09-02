import { useState } from 'react';
import { api } from '../api/client';
import { useNavigate, Link } from 'react-router-dom';

export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
      await api('/app/v1/user/signup', {
        method: 'POST',
        body: { firstName, lastName, email, password },
      });
      navigate('/signin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h2 style={{marginBottom: 12}}>Create your account</h2>
        <p className="switch-text" style={{marginTop: 0, marginBottom: 16}}>Start saving and managing your env secrets</p>
        <form onSubmit={onSubmit}>
          <label>First name</label>
          <input value={firstName} onChange={(e)=>setFirstName(e.target.value)} required />
          <label>Last name</label>
          <input value={lastName} onChange={(e)=>setLastName(e.target.value)} required />
          <label>Email</label>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
          {error && <div className="error">{error}</div>}
          <button className="btn btn-primary" disabled={loading}>{loading ? 'Signing up...' : 'Create account'}</button>
        </form>
        <p className="switch-text">Already have an account? <Link to="/signin">Sign In</Link></p>
      </div>
    </div>
  );
}
