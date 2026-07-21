import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(email, password, name);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page-overlay">
        <form onSubmit={handleSubmit} className="auth-form">
          <h1 className="auth-brand">StreamFlix</h1>
          <h2>Sign up</h2>
          {error && <p className="error">{error}</p>}
          <input type="text" placeholder="Name" value={name}
            onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password (min 6 chars)" value={password}
            onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          <button type="submit">Sign up</button>
          <p>Already have an account? <Link to="/login">Log in</Link></p>
        </form>
      </div>
    </div>
  );
}