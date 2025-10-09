import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../utils';
import './Voting.css';

const positionsList = [
  { id: 1, name: 'Chairperson', icon: '👑' },
  { id: 2, name: 'Vice Chairperson', icon: '🎯' },
  { id: 3, name: 'Secretary General', icon: '📝' },
  { id: 4, name: 'Finance Secretary', icon: '💰' },
  { id: 5, name: 'Organizing Secretary', icon: '📊' },
  { id: 6, name: 'Public Relations Officer', icon: '📢' },
  { id: 7, name: 'Legal Advisor', icon: '⚖️' },
  { id: 8, name: 'Spokesperson', icon: '🎤' }
];

const Voting = ({ user }) => {
  const [positions, setPositions] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- Redirect if user not logged in ---
  useEffect(() => {
    if (!user) {
      navigate('/');
    } else {
      loadUserVotes();
    }
  }, [user, navigate]);

  const loadUserVotes = async () => {
    try {
      const votes = {};
      positionsList.forEach(pos => {
        votes[pos.id] = null;
      });
      setUserVotes(votes);
      setPositions(positionsList);
    } catch (error) {
      console.error('Error loading votes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVotedCount = () => {
    return Object.values(userVotes).filter(vote => vote !== null).length;
  };

  const totalPositions = positions.length;

  if (loading) {
    return (
      <div className="voting-container">
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3">Loading voting dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="voting-container">
      <div className="container">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Voting Dashboard</h2>
            
            {/* Progress */}
            <div className="row mb-4">
              <div className="col-md-8 mx-auto">
                <div className="d-flex justify-content-between mb-2">
                  <span>Voting Progress</span>
                  <span>{getVotedCount()} of {totalPositions} positions</span>
                </div>
                <div className="vote-progress">
                  <div 
                    className="vote-progress-bar"
                    style={{ width: `${(getVotedCount() / totalPositions) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Positions Grid */}
            <div className="positions-grid">
              {positions.map(position => (
                <Link 
                  key={position.id}
                  to={`/position/${position.id}`}
                  className="text-decoration-none"
                >
                  <div className="position-item">
                    <div className="position-icon">{position.icon}</div>
                    <h5 className="position-name">{position.name}</h5>
                    {userVotes[position.id] ? (
                      <span className="completion-badge">Voted ✓</span>
                    ) : (
                      <span className="text-muted">Click to vote</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Completion Message */}
            {getVotedCount() === totalPositions && (
              <div className="text-center mt-4">
                <div className="alert alert-success alert-custom">
                  <h5>🎉 All Positions Voted!</h5>
                  <p className="mb-0">
                    Thank you for participating in the BUSA Election. 
                    Results will be available shortly after the election ends.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voting;
