import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.user.signin(email, password);
      const data = await response.json();

      if (data.success) {
        onLogin(data.user);
        navigate('/home');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="vh-100 d-flex align-items-center justify-content-center bg-gradient" 
      style={{
        background: 'linear-gradient(135deg, #0d6efd, #6610f2)',
      }}
    >
      <div className="card shadow-lg border-0 rounded-4" style={{ width: '100%', maxWidth: '420px' }}>
        <div className="card-body p-5">
          {/* Header */}
          <div className="text-center mb-4">
            <div
              className="d-flex justify-content-center align-items-center mb-3 bg-primary text-white rounded-circle"
              style={{ width: 70, height: 70, margin: '0 auto', fontSize: '2rem' }}
            >
              🗳️
            </div>
            <h3 className="fw-bold text-dark mb-1">BUSA Election System</h3>
            <p className="text-muted mb-0">Sign in to cast your vote securely</p>
          </div>

          {/* Error Message */}
          {error && <div className="alert alert-danger text-center">{error}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                <i className="bi bi-envelope me-2"></i>Email Address
              </label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold">
                <i className="bi bi-lock me-2"></i>Password
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={loading || !email || !password}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Signing In...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>Sign In & Vote
                </>
              )}
            </button>
          </form>

          {/* Footer Section */}
          <div className="text-center mt-4">
            <small className="text-muted d-block mb-2">
              <i className="bi bi-info-circle me-1"></i>
              Don't have an account? Contact admin for registration.
            </small>
          </div>

          <div className="bg-light rounded-3 p-3 mt-3">
            <h6 className="mb-2 fw-bold">
              <i className="bi bi-lightbulb me-2 text-warning"></i>Voting Instructions
            </h6>
            <small className="text-muted">
              After signing in, you’ll be redirected to the voting page where you can cast your votes for available positions.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
