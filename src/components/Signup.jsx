import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../utils';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [alreadySignedUp, setAlreadySignedUp] = useState(false);

  // ✅ Hide Navbar when on Signup page
  if (location.pathname === '/signup') {
    document.querySelector('nav')?.classList.add('d-none');
  } else {
    document.querySelector('nav')?.classList.remove('d-none');
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSuccess(false);

    if (alreadySignedUp) {
      setMessage('You have already registered. Please wait for admin approval.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await api.admin.createUser(
        'admin',
        '@System372540',
        formData.email,
        formData.password,
        formData.name
      );
      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setMessage('');
        setAlreadySignedUp(true);
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });

        // Delay navigation for user to read thank-you message
        setTimeout(() => navigate('/'), 3000);
      } else {
        setMessage(data.message || 'Failed to create account.');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center bg-gradient"
      style={{
        background: 'linear-gradient(135deg, #6610f2, #0d6efd)',
      }}
    >
      <div
        className="card shadow-lg border-0 rounded-4"
        style={{ width: '100%', maxWidth: '450px' }}
      >
        <div className="card-body p-5">
          {/* Header */}
          <div className="text-center mb-4">
            <div
              className="d-flex justify-content-center align-items-center mb-3 bg-primary text-white rounded-circle"
              style={{ width: 70, height: 70, margin: '0 auto', fontSize: '2rem' }}
            >
              🗳️
            </div>
            <h3 className="fw-bold text-dark mb-1">Create Your Account</h3>
            <p className="text-muted mb-0">Join the BUSA Election System</p>
          </div>

          {/* ✅ Thank You Message */}
          {alreadySignedUp ? (
            <div className="text-center">
              <div className="alert alert-success">
                <h5 className="fw-bold mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Thank You for Signing Up!
                </h5>
                <p className="mb-0">
                  Your registration has been received. You will be able to log in once
                  your account is approved by the system admin.
                </p>
              </div>
              <button
                className="btn btn-primary mt-3"
                onClick={() => navigate('/')}
              >
                Return to Login
              </button>
            </div>
          ) : (
            <>
              {/* Alert Message */}
              {message && (
                <div
                  className={`alert text-center ${
                    success ? 'alert-success' : 'alert-danger'
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Signup Form */}
              <form onSubmit={handleSubmit}>
                {/* Full Name */}
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-semibold">
                    <i className="bi bi-person me-2"></i>Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    <i className="bi bi-envelope me-2"></i>Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="example@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label fw-semibold">
                    <i className="bi bi-lock me-2"></i>Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      className="form-control"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
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

                {/* Confirm Password */}
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label fw-semibold">
                    <i className="bi bi-shield-lock me-2"></i>Confirm Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      <i className={`bi ${showConfirm ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-semibold"
                  disabled={loading || alreadySignedUp}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus me-2"></i>Sign Up
                    </>
                  )}
                </button>
              </form>

              {/* Info Box */}
              <div className="bg-light rounded-3 p-3 mt-4">
                <h6 className="mb-2 fw-bold">
                  <i className="bi bi-info-circle text-primary me-2"></i>Registration Info
                </h6>
                <small className="text-muted">
                  Only the system admin can approve new voter accounts. Please use your
                  valid institutional email for registration.
                </small>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
