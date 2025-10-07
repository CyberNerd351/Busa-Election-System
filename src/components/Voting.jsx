import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  useEffect(() => {
    loadUserVotes();
  }, [user]);

  const loadUserVotes = async () => {
    try {
      // In a real app, you'd fetch user's previous votes
      // For now, we'll initialize empty
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
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="voting-container">
      <div className="container">
        <div className="card">
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

            {/* Action Buttons */}
            {getVotedCount() === totalPositions && (
              <div className="text-center mt-4">
                <div className="alert alert-success alert-custom">
                  <h5>🎉 All Positions Voted!</h5>
                  <p className="mb-0">
                    Thank you for participating in the BUSA1 election. 
                    Results will be available 30 minutes after the election ends.
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