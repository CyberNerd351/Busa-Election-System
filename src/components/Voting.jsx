import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, formatTimeRemaining, getTimeRemaining } from '../utils';
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
  const [electionStatus, setElectionStatus] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    } else {
      loadElectionStatus();
      loadUserVotes();
    }
  }, [user, navigate]);

  useEffect(() => {
    let interval;
    
    if (electionStatus?.status === 'active' && electionStatus.end_at) {
      // Update time remaining immediately
      updateTimeRemaining();
      
      // Set up interval to update time remaining every second
      interval = setInterval(updateTimeRemaining, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [electionStatus]);

  const updateTimeRemaining = () => {
    if (electionStatus?.status === 'active' && electionStatus.end_at) {
      const timeInfo = getTimeRemaining(electionStatus.end_at);
      setTimeRemaining(timeInfo.message);
      
      // If election has ended, reload election status
      if (timeInfo.ended) {
        loadElectionStatus();
      }
    }
  };

  const loadElectionStatus = async () => {
    try {
      const response = await api.election.status();
      const data = await response.json();
      setElectionStatus(data);
      
      // Set initial time remaining for active elections
      if (data.status === 'active' && data.end_at) {
        const timeInfo = getTimeRemaining(data.end_at);
        setTimeRemaining(timeInfo.message);
      }
    } catch (error) {
      console.error('Error loading election status:', error);
    }
  };

  const loadUserVotes = async () => {
    try {
      const votes = {};
      positionsList.forEach(pos => {
        votes[pos.id] = null;
      });
      
      // Load user's existing votes
      const response = await api.userVotes.get(user.id);
      if (response.ok) {
        const data = await response.json();
        data.votes.forEach(vote => {
          votes[vote.position_id] = vote.candidate_id;
        });
      }
      
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

  const renderElectionStatus = () => {
    if (!electionStatus) return null;

    switch (electionStatus.status) {
      case 'no_election':
        return (
          <div className="alert alert-info text-center">
            <h5>📋 Election Positions</h5>
            <p className="mb-0">No active election scheduled. Here are the available positions.</p>
          </div>
        );
      
      case 'pending':
        const startTime = new Date(electionStatus.start_at);
        const now = new Date();
        const timeUntilStart = startTime - now;
        
        return (
          <div className="alert alert-warning text-center">
            <h5>⏰ Election Coming Soon</h5>
            <p className="mb-1">
              Election starts: {startTime.toLocaleString()}
            </p>
            <p className="mb-0 fw-bold">
              Starts in: {formatTimeRemaining(electionStatus.start_at)}
            </p>
          </div>
        );
      
      case 'active':
        return (
          <div className="alert alert-success text-center">
            <h5>🗳️ Election in Progress - Vote Now!</h5>
            <p className="mb-0 fw-bold fs-5">
              Time remaining: {timeRemaining}
            </p>
          </div>
        );
      
      case 'ended':
        return (
          <div className="alert alert-secondary text-center">
            <h5>✅ Election Ended</h5>
            <p className="mb-0">
              Voting has concluded. Check results for the outcome.
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

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
            
            {/* Election Status */}
            {renderElectionStatus()}
            
            {/* Voting Progress - Only show during active election */}
            {electionStatus?.status === 'active' && (
              <div className="row mb-4">
                <div className="col-md-8 mx-auto">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Your Voting Progress</span>
                    <span>{getVotedCount()} of {totalPositions} positions voted</span>
                  </div>
                  <div className="vote-progress">
                    <div 
                      className="vote-progress-bar"
                      style={{ width: `${(getVotedCount() / totalPositions) * 100}%` }}
                    ></div>
                  </div>
                  <small className="text-muted">
                    You can vote for any number of positions. Each position requires one candidate selection.
                  </small>
                </div>
              </div>
            )}

            {/* Positions Grid */}
            <div className="positions-grid">
              {positions.map(position => {
                const hasVoted = userVotes[position.id] !== null;
                const canVote = electionStatus?.status === 'active';
                
                return (
                  <div key={position.id} className="position-item-wrapper">
                    {canVote ? (
                      <Link 
                        to={`/position/${position.id}`}
                        className="text-decoration-none"
                      >
                        <div className={`position-item ${hasVoted ? 'voted' : ''}`}>
                          <div className="position-icon">{position.icon}</div>
                          <h5 className="position-name">{position.name}</h5>
                          {hasVoted ? (
                            <span className="completion-badge">Voted ✓</span>
                          ) : (
                            <span className="text-muted">Click to vote</span>
                          )}
                        </div>
                      </Link>
                    ) : (
                      <div className="position-item disabled">
                        <div className="position-icon">{position.icon}</div>
                        <h5 className="position-name">{position.name}</h5>
                        {hasVoted ? (
                          <span className="completion-badge">Voted ✓</span>
                        ) : (
                          <span className="text-muted">
                            {electionStatus?.status === 'ended' ? 'Election ended' : 'Voting not active'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Completion Message */}
            {electionStatus?.status === 'active' && getVotedCount() === totalPositions && (
              <div className="text-center mt-4">
                <div className="alert alert-success alert-custom">
                  <h5>🎉 All Positions Voted!</h5>
                  <p className="mb-0">
                    Thank you for participating in the BUSA Election. 
                    You can still change your votes until the election ends.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="text-center mt-4">
              <button 
                className="btn btn-outline-primary me-2"
                onClick={() => navigate('/results')}
              >
                View Results
              </button>
              {electionStatus?.status === 'active' && (
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    loadUserVotes();
                    loadElectionStatus();
                  }}
                >
                  Refresh Status
                </button>
              )}
            </div>

            {/* Real-time countdown indicator */}
            {electionStatus?.status === 'active' && (
              <div className="text-center mt-3">
                <small className="text-muted">
                  ⚡ Time updates in real-time
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voting;