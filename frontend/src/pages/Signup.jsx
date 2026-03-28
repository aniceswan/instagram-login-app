import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, name);
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
      // Silent error - just redirect to login
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Instagram phone mockup */}
      <div className="auth-phone-mockup">
        <div className="phone-screen">📱</div>
      </div>

      <div className="auth-card">
        <div className="instagram-logo">Instagram</div>
        
        <p style={{ fontSize: '13px', color: '#8a8a8a', marginBottom: '16px', marginTop: '8px' }}>
          Sign up to see photos and videos from your friends.
        </p>

        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              required
            />
          </div>

          <button type="submit" disabled={loading} style={{ marginBottom: '8px' }}>
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p style={{ fontSize: '11px', color: '#8a8a8a', margin: '8px 0 12px 0', lineHeight: '1.4' }}>
          People who use our service may have uploaded your contact information. Learn more.
        </p>

        <p style={{ fontSize: '11px', color: '#8a8a8a', margin: '0 0 16px 0', lineHeight: '1.4' }}>
          By signing up, you agree to our Terms, Data Policy and Cookies Policy.
        </p>

        <div className="signup-prompt">
          <span className="auth-link">
            Have an account? <Link to="/login">Log in</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
