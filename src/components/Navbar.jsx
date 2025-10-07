import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  // Don't show navbar on login page
  if (location.pathname === '/') {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/home">
          🗳️ BUSA Election System
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`} 
                to="/home"
              >
                🏠 Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/voting' ? 'active' : ''}`} 
                to="/voting"
              >
                🗳️ Voting
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/results' ? 'active' : ''}`} 
                to="/results"
              >
                📊 Results
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/faq' ? 'active' : ''}`} 
                to="/faq"
              >
                ❓ FAQ
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`} 
                to="/contact"
              >
                📞 Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`} 
                to="/admin"
              >
                ⚙️ Admin
              </Link>
            </li>
          </ul>
          
          {/* User info and logout button */}
          <div className="navbar-nav ms-auto">
            {user ? (
              <>
                <span className="navbar-text me-3">
                  👋 Welcome, <strong>{user.name || user.email}</strong>
                </span>
                <button 
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                  title="Logout from system"
                >
                  
                </button>
              </>
            ) : (
              <Link to="/" className="btn btn-outline-light btn-sm">
                🚪 Logout
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;