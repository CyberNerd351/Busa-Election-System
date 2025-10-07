import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils';

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
        // Redirect to voting page after successful login
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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100">
        <div className="col-md-6 col-lg-4 mx-auto">
          <div className="card shadow-lg">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="card-title fw-bold">BUSA Election System</h2>
                <p className="text-muted">Sign in to cast your vote</p>
              </div>

              {error && (
                <div className="alert alert-danger alert-custom">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <i className="bi bi-envelope me-2"></i>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    <i className="bi bi-lock me-2"></i>
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={toggleShowPassword}
                    >
                      <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                    </button>
                  </div>
                  <div className="form-text">
                    <small>
                      <button
                        type="button"
                        className="btn btn-link p-0 text-decoration-none"
                        onClick={toggleShowPassword}
                      >
                        {showPassword ? 'Hide' : 'Show'} password
                      </button>
                    </small>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100 py-2"
                  disabled={loading || !email || !password}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Sign In & Vote
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <small className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Don't have an account? Contact admin for registration.
                </small>
              </div>

              {/* Quick instructions */}
              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="mb-2">
                  <i className="bi bi-lightbulb me-2"></i>
                  Voting Instructions:
                </h6>
                <small className="text-muted">
                  After signing in, you'll be directed to the voting page where you can cast your vote for all positions.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;