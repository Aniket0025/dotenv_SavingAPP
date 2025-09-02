import { useEffect, useState } from 'react';
import { api, clearToken } from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function EnvPage() {
  const [items, setItems] = useState([]);
  const [keyInput, setKeyInput] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function fetchItems() {
    setError('');
    setLoading(true);
    try {
      const res = await api('/app/v1/env', { auth: true });
      setItems(res.envs || res.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function addEnv(e) {
    e.preventDefault();
    setError('');
    try {
      await api('/app/v1/env', { method: 'POST', body: { key: keyInput, value: valueInput }, auth: true });
      setKeyInput('');
      setValueInput('');
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateEnv(key, value) {
    setError('');
    try {
      await api(`/app/v1/env/${encodeURIComponent(key)}`, { method: 'PUT', body: { value }, auth: true });
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteEnv(key) {
    setError('');
    try {
      await api(`/app/v1/env/${encodeURIComponent(key)}`, { method: 'DELETE', auth: true });
      fetchItems();
    } catch (err) {
      setError(err.message);
    }
  }

  function logout() {
    clearToken();
    navigate('/signin');
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">DotEnv Guard</div>
        <div className="actions">
          <button className="btn btn-ghost" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="container">
        <section className="card">
          <h2>Add / Update Env</h2>
          <form className="row" onSubmit={addEnv}>
            <input placeholder="KEY" value={keyInput} onChange={(e)=>setKeyInput(e.target.value)} required />
            <input placeholder="VALUE" value={valueInput} onChange={(e)=>setValueInput(e.target.value)} required />
            <button className="btn btn-primary" type="submit">Save</button>
          </form>
          {error && <div className="error" style={{marginTop:8}}>{error}</div>}
        </section>

        <section className="card">
          <h2>Your Env Variables</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="env-table">
              <thead>
                <tr><th style={{width:'30%'}}>Key</th><th>Value</th><th style={{width:160}}>Actions</th></tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={3} style={{textAlign:'center', opacity:0.7}}>No env variables yet</td></tr>
                ) : items.map((it) => (
                  <EnvRow key={it.key} item={it} onUpdate={updateEnv} onDelete={deleteEnv} />
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}

function EnvRow({ item, onUpdate, onDelete }) {
  const [edit, setEdit] = useState(false);
  const [val, setVal] = useState(item.value);
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    try {
      await navigator.clipboard.writeText(item.value ?? '');
      setCopied(true);
      setTimeout(()=>setCopied(false), 1200);
    } catch (e) {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = item.value ?? '';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); setCopied(true); setTimeout(()=>setCopied(false), 1200); } finally { document.body.removeChild(ta); }
    }
  }

  return (
    <tr>
      <td><code>{item.key}</code></td>
      <td>
        {edit ? (
          <input value={val} onChange={(e)=>setVal(e.target.value)} />
        ) : (
          <div className="value-cell">
            <span className="mono">{item.value}</span>
            <button
              type="button"
              className="btn btn-ghost copy-btn"
              onClick={copyValue}
              title={copied ? 'Copied' : 'Copy value'}
              aria-label={copied ? 'Copied' : 'Copy value'}
            >
              {copied ? (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </td>
      <td>
        {edit ? (
          <>
            <button className="btn btn-primary" onClick={()=>{ onUpdate(item.key, val); setEdit(false); }}>Save</button>
            <button className="btn btn-ghost" onClick={()=>{ setVal(item.value); setEdit(false); }} style={{marginLeft:8}}>Cancel</button>
          </>
        ) : (
          <>
            <button className="btn" onClick={()=>setEdit(true)}>Edit</button>
            <button className="btn btn-danger" onClick={()=>onDelete(item.key)} style={{marginLeft:8}}>Delete</button>
          </>
        )}
      </td>
    </tr>
  );
}
