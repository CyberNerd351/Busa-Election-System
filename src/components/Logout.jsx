import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Perform logout actions
    const performLogout = () => {
      // Call the parent logout handler if provided
      if (onLogout) {
        onLogout();
      }
      
      // Clear any local storage
      localStorage.removeItem('electionUser');
      
      // Redirect to login page after a brief delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
    };

    performLogout();
  }, [onLogout, navigate]);

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100">
        <div className="col-md-6 col-lg-4 mx-auto">
          <div className="card shadow-lg text-center">
            <div className="card-body p-5">
              <div className="mb-4">
                <div className="display-1 text-primary mb-3">👋</div>
                <h3 className="card-title fw-bold">Logging Out</h3>
                <p className="text-muted">
                  You are being safely logged out of the system...
                </p>
              </div>
              
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Logging out...</span>
              </div>
              
              <div className="mt-4">
                <p className="text-muted small">
                  Thank you for using BUSA Election System
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;