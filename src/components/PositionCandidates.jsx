import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../utils';

// Convert UTC to Kenyan Time (EAT - East Africa Time, UTC+3)
const convertToKenyanTime = (utcDateString) => {
  if (!utcDateString) return null;
  
  const date = new Date(utcDateString);
  // Kenya is UTC+3, so add 3 hours
  const kenyanTime = new Date(date.getTime() + (3 * 60 * 60 * 1000));
  return kenyanTime;
};

const formatKenyanDateTime = (date) => {
  if (!date) return 'N/A';
  
  return date.toLocaleString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Nairobi'
  });
};

const PositionCandidates = ({ user, onVote }) => {
  const { positionId } = useParams();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [position, setPosition] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [electionStatus, setElectionStatus] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const positionsMap = {
    1: { name: 'Chairperson', icon: '👑' },
    2: { name: 'Vice Chairperson', icon: '🎯' },
    3: { name: 'Secretary General', icon: '📝' },
    4: { name: 'Finance Secretary', icon: '💰' },
    5: { name: 'Organizing Secretary', icon: '📊' },
    6: { name: 'Public Relations Officer', icon: '📢' },
    7: { name: 'Legal Advisor', icon: '⚖️' },
    8: { name: 'Spokesperson', icon: '🎤' }
  };

  useEffect(() => {
    loadElectionStatus();
    loadCandidates();
    
    // Set up periodic refresh every 30 seconds
    const statusInterval = setInterval(() => {
      loadElectionStatus();
    }, 30000);
    
    return () => clearInterval(statusInterval);
  }, [positionId]);

  const loadElectionStatus = async () => {
    try {
      const response = await api.election.status();
      const data = await response.json();
      
      // Convert UTC times to Kenyan time
      if (data.start_at) {
        data.start_at_kenyan = convertToKenyanTime(data.start_at);
      }
      if (data.end_at) {
        data.end_at_kenyan = convertToKenyanTime(data.end_at);
      }
      
      setElectionStatus(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading election status:', error);
    }
  };

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const response = await api.positions.getCandidates(positionId);
      const data = await response.json();
      setCandidates(data);
      setPosition(positionsMap[positionId]);
    } catch (error) {
      console.error('Error loading candidates:', error);
      setMessage('Error loading candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateClick = (candidate) => {
    if (electionStatus?.status !== 'active') {
      setMessage('Voting is not currently active.');
      return;
    }
    
    if (selectedCandidate?.id === candidate.id) {
      setSelectedCandidate(null);
    } else {
      setSelectedCandidate(candidate);
    }
  };

  const handleVote = async () => {
    if (electionStatus?.status !== 'active') {
      setMessage('Voting is not currently active.');
      return;
    }

    if (!selectedCandidate) {
      setMessage('Please select a candidate.');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      const response = await api.vote(user.id, parseInt(positionId), selectedCandidate.id);
      const data = await response.json();

      if (data.success) {
        setMessage('Vote recorded successfully!');
        if (onVote) onVote();
        setTimeout(() => navigate('/voting'), 1500);
      } else {
        setMessage(data.message || 'Failed to record vote.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getElectionStatusMessage = () => {
    if (!electionStatus) return '';
    
    switch (electionStatus.status) {
      case 'active':
        return `Election active - Ends: ${formatKenyanDateTime(electionStatus.end_at_kenyan)} (EAT)`;
      case 'pending':
        return `Election starts: ${formatKenyanDateTime(electionStatus.start_at_kenyan)} (EAT)`;
      case 'ended':
        return 'Election has ended';
      case 'no_election':
        return 'No active election';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading candidates...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="position-icon" style={{ fontSize: '3rem' }}>
              {position?.icon}
            </div>
            <h2 className="card-title">{position?.name}</h2>
            <p className="text-muted">
              {electionStatus?.status === 'active' 
                ? 'Select your preferred candidate' 
                : 'Viewing candidates (voting not active)'}
            </p>
            
            {electionStatus && (
              <div className={`alert alert-${electionStatus.status === 'active' ? 'success' : 'warning'} mt-3`}>
                <strong>{electionStatus.status.toUpperCase()}:</strong> {getElectionStatusMessage()}
                {lastUpdated && (
                  <small className="d-block mt-1 text-muted">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </small>
                )}
              </div>
            )}
          </div>

          {/* Message */}
          {message && (
            <div
              className={`alert ${
                message.includes('successfully') ? 'alert-success' : 'alert-danger'
              }`}
            >
              {message}
            </div>
          )}

          {/* Candidates Grid */}
          <div className="row">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="col-md-6 col-lg-4 mb-4">
                <div
                  className={`card candidate-card ${
                    selectedCandidate?.id === candidate.id ? 'border-primary shadow' : ''
                  } ${electionStatus?.status !== 'active' ? 'opacity-75' : ''}`}
                  style={{
                    cursor: electionStatus?.status === 'active' ? 'pointer' : 'default',
                    transition: '0.3s',
                    backgroundColor:
                      selectedCandidate?.id === candidate.id ? '#e7f1ff' : 'white',
                  }}
                  onClick={() => handleCandidateClick(candidate)}
                >
                  <div className="card-body text-center">
                    {/* Image */}
                    <div
                      className="candidate-image-wrapper mb-3"
                      style={{
                        width: '100%',
                        height: '220px',
                        overflow: 'hidden',
                        borderRadius: '8px',
                        backgroundColor: '#f8f9fa',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={
                          candidate.image
                            ? `https://busa1.pythonanywhere.com/static/images/${candidate.image}`
                            : 'https://via.placeholder.com/300x220?text=No+Image'
                        }
                        alt={candidate.name}
                        onError={(e) =>
                          (e.target.src = 'https://via.placeholder.com/300x220?text=No+Image')
                        }
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </div>

                    {/* Candidate Info */}
                    <h5 className="card-title mb-2">{candidate.name}</h5>

                    {selectedCandidate?.id === candidate.id && (
                      <span className="badge bg-primary">Selected ✓</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Candidates Message */}
          {candidates.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">No candidates available for this position.</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="text-center mt-4">
            <button className="btn btn-secondary me-2" onClick={() => navigate('/voting')}>
              ← Back to Voting
            </button>

            {electionStatus?.status === 'active' && candidates.length > 0 && (
              <button
                className="btn btn-primary"
                onClick={handleVote}
                disabled={!selectedCandidate || submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Vote'
                )}
              </button>
            )}
          </div>

          {/* Auto-refresh indicator */}
          <div className="text-center mt-3">
            <small className="text-muted">
              ⚡ Status auto-updates every 30 seconds
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionCandidates;