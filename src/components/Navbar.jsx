import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/');
  };

  // Show navbar only on Home and Voting pages
  const showNavbar = location.pathname === '/home' || location.pathname === '/voting';
  if (!showNavbar) {
    return null;
  }

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/home">
          🗳️ UUCSAA GENERAL ELECTIONS
        </Link>

        {/* Toggler Button */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={handleToggle}
          aria-controls="navbarNav"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Menu */}
        <div
          className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`}
          id="navbarNav"
        >
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

          {/* User Info and Logout */}
          <div className="navbar-nav ms-auto">
            {user ? (
              <>
                <span className="navbar-text me-3">
                  👋 Welcome, <strong>{user.name || user.email}</strong>
                </span>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                  title="Logout"
                >
                  🚪 Logout
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
