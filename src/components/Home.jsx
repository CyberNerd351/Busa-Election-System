import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = ({ user, electionStatus, timeRemaining }) => {
  return (
    <div className="home-container">
      <div className="container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1 className="welcome-title">
            Welcome to BUSA Election System
          </h1>
          <p className="welcome-subtitle">
            {user ? `Hello ${user.name || user.email}, exercise your democratic right to vote!` : 'Please sign in to participate in the election'}
          </p>
          
          {/* Election Status */}
          {electionStatus && (
            <div className="election-status">
              <h4>Election Status</h4>
              <p className="mb-2">{electionStatus.message}</p>
              {timeRemaining && (
                <div className="countdown-timer text-center">
                  ⏰ Time Remaining: {timeRemaining}
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="row mt-4">
            <div className="col-md-4 mb-3">
              <Link to="/voting" className="btn btn-primary w-100 py-3">
                🗳️ Start Voting
              </Link>
            </div>
            <div className="col-md-4 mb-3">
              <Link to="/results" className="btn btn-success w-100 py-3">
                📊 View Results
              </Link>
            </div>
            <div className="col-md-4 mb-3">
              <Link to="/faq" className="btn btn-info w-100 py-3 text-white">
                ❓ FAQ & Help
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h4>Secure Voting</h4>
            <p>Your vote is completely anonymous and securely recorded using advanced encryption.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h4>Quick & Easy</h4>
            <p>Simple interface that lets you vote quickly for all positions in just a few minutes.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h4>Live Results</h4>
            <p>View real-time results with beautiful charts and analytics after the election ends.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h4>Admin Managed</h4>
            <p>Professional administration ensures fair and transparent election process.</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="card mt-4">
          <div className="card-body">
            <h4 className="card-title">How to Vote</h4>
            <ol className="mt-3">
              <li>Sign in with your registered email and password</li>
              <li>Navigate to the Voting section</li>
              <li>Select a position to view candidates</li>
              <li>Choose your preferred candidate for each position</li>
              <li>Review your selections and submit your vote</li>
              <li>Wait for results after the election period ends</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;