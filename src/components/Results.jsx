import React, { useState, useEffect } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { api } from '../utils';
import './Results.css';

// Register ChartJS components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentElectionId, setCurrentElectionId] = useState(null);

  useEffect(() => {
    loadElectionStatus();
    loadResults();
    
    // Refresh results every 30 seconds if results are available
    const interval = setInterval(() => {
      if (results.length > 0) {
        loadResults();
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [results.length]);

  const loadElectionStatus = async () => {
    try {
      const response = await api.election.status();
      const data = await response.json();
      if (data.election_id) {
        setCurrentElectionId(data.election_id);
        checkStoredResults(data.election_id);
      }
    } catch (error) {
      console.error('Error loading election status:', error);
    }
  };

  const checkStoredResults = (newElectionId) => {
    const storedElectionId = localStorage.getItem('currentElectionId');
    const storedResults = localStorage.getItem('electionResults');
    
    // Clear stored results if election ID changed (new election started)
    if (storedElectionId && storedElectionId !== newElectionId.toString()) {
      localStorage.removeItem('electionResults');
      localStorage.removeItem('currentElectionId');
      setResults([]);
    }
    
    // Store current election ID
    localStorage.setItem('currentElectionId', newElectionId.toString());
  };

  const loadResults = async () => {
    try {
      setLoading(true);
      const response = await api.results();
      const data = await response.json();

      if (data.success && Array.isArray(data.results)) {
        setResults(data.results);
        setLastUpdated(new Date());
        
        // Store results with election ID for validation
        if (data.election_id) {
          localStorage.setItem('electionResults', JSON.stringify({
            results: data.results,
            election_id: data.election_id,
            timestamp: new Date().toISOString()
          }));
          setCurrentElectionId(data.election_id);
          localStorage.setItem('currentElectionId', data.election_id.toString());
        }
        
        setError('');
      } else {
        setError(data.message || 'Results not available yet');
        // Try to load cached results only if they belong to current election
        const cachedResults = localStorage.getItem('electionResults');
        if (cachedResults) {
          const parsed = JSON.parse(cachedResults);
          const currentId = localStorage.getItem('currentElectionId');
          
          // Only use cached results if they match current election
          if (parsed.election_id && currentId && parsed.election_id.toString() === currentId) {
            setResults(parsed.results || []);
          } else {
            setResults([]);
            localStorage.removeItem('electionResults');
          }
        }
      }
    } catch (err) {
      setError('Failed to load results. Please try again later.');
      // Try to load cached results only if they belong to current election
      const cachedResults = localStorage.getItem('electionResults');
      if (cachedResults) {
        const parsed = JSON.parse(cachedResults);
        const currentId = localStorage.getItem('currentElectionId');
        
        if (parsed.election_id && currentId && parsed.election_id.toString() === currentId) {
          setResults(parsed.results || []);
        } else {
          setResults([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const getChartData = (candidates, positionName) => ({
    labels: candidates.map(c => c.name),
    datasets: [
      {
        label: 'Votes',
        data: candidates.map(c => c.votes),
        backgroundColor: [
          '#3498db', '#e74c3c', '#27ae60', '#f39c12',
          '#9b59b6', '#1abc9c', '#d35400', '#34495e',
          '#16a085', '#8e44ad', '#2c3e50', '#f1c40f'
        ],
        borderColor: [
          '#2980b9', '#c0392b', '#229954', '#e67e22',
          '#8e44ad', '#16a085', '#e74c3c', '#2c3e50',
          '#138d75', '#7d3c98', '#273746', '#f39c12'
        ],
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  });

  const getDoughnutData = (candidates) => ({
    labels: candidates.map(c => c.name),
    datasets: [
      {
        data: candidates.map(c => c.votes),
        backgroundColor: [
          '#3498db', '#e74c3c', '#27ae60', '#f39c12',
          '#9b59b6', '#1abc9c', '#d35400', '#34495e'
        ],
        borderColor: '#2c3e50',
        borderWidth: 2,
      }
    ]
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: false 
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Votes: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { 
          stepSize: 1,
          precision: 0
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          font: {
            size: 11
          }
        }
      }
    }
  };

  // Safe winner calculation that handles empty candidates
  const getWinner = (candidates) => {
    if (!candidates || candidates.length === 0) {
      return null;
    }
    return candidates.reduce((max, candidate) => 
      candidate.votes > max.votes ? candidate : max, candidates[0]
    );
  };

  if (loading && results.length === 0) {
    return (
      <div className="results-container">
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading results...</span>
          </div>
          <p className="mt-3 text-white">Loading election results...</p>
        </div>
      </div>
    );
  }

  if (error && results.length === 0) {
    return (
      <div className="results-container">
        <div className="container">
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="display-1 text-muted mb-4">📊</div>
              <h3>Results Not Available</h3>
              <p className="text-muted">{error}</p>
              <button className="btn btn-primary mt-3" onClick={loadResults}>
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="container">
        <div className="results-header">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div>
              <h1 className="text-white">Election Results</h1>
              <p className="text-white-50">
                {currentElectionId ? `Election ID: ${currentElectionId}` : 'Current Election Results'}
              </p>
            </div>
            <div className="text-end">
              <button className="btn btn-outline-light btn-sm" onClick={loadResults}>
                ↻ Refresh
              </button>
              {lastUpdated && (
                <small className="text-white-50 d-block mt-1">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </small>
              )}
            </div>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="text-center text-white py-5">
            <h3>No results available</h3>
            <p className="text-white-50">
              {error || 'Results will be available 5 minutes after the election ends.'}
            </p>
          </div>
        ) : (
          results.map((result) => {
            const winner = getWinner(result.candidates);
            const hasCandidates = result.candidates && result.candidates.length > 0;

            return (
              <div key={result.position.id} className="position-results mb-5">
                {/* Winner Section */}
                <div className="winner-section">
                  <h3>
                    {hasCandidates ? '🏆' : '📋'} {result.position.name} 
                    {winner && (
                      <span className="winner-badge ms-2">
                        Winner: {winner.name}
                      </span>
                    )}
                  </h3>
                  <div className="winner-details">
                    {winner ? (
                      <>
                        <span className="votes-count">
                          {winner.votes} votes • {winner.percentage}%
                        </span>
                        <span className="total-votes">
                          Total Votes: {result.total_votes}
                        </span>
                      </>
                    ) : (
                      <span className="text-muted">
                        No candidates for this position
                      </span>
                    )}
                  </div>
                </div>

                {/* Charts Section - Only show if there are candidates */}
                {hasCandidates && (
                  <div className="row mt-4">
                    <div className="col-lg-8">
                      <div className="chart-container">
                        <Bar
                          data={getChartData(result.candidates, result.position.name)}
                          options={chartOptions}
                          height={300}
                        />
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="chart-container">
                        <Doughnut
                          data={getDoughnutData(result.candidates)}
                          options={doughnutOptions}
                          height={300}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Candidate Breakdown */}
                <div className="mt-4">
                  <h5 className="text-white mb-3">
                    {hasCandidates ? 'Detailed Results:' : 'Position Status:'}
                  </h5>
                  <div className="candidates-breakdown">
                    {hasCandidates ? (
                      result.candidates.map((candidate, idx) => (
                        <div
                          key={candidate.id}
                          className={`candidate-result ${
                            candidate.id === winner?.id ? 'winner' : ''
                          }`}
                        >
                          <div className="candidate-rank">
                            #{idx + 1}
                          </div>
                          <div className="candidate-info">
                            <h6 className="mb-1">
                              {candidate.name}
                              {candidate.id === winner?.id && (
                                <span className="winner-badge ms-2">🥇 Winner</span>
                              )}
                            </h6>
                            <div className="vote-progress-container">
                              <div 
                                className="vote-progress-bar"
                                style={{ 
                                  width: `${(candidate.votes / result.total_votes) * 100}%`,
                                  backgroundColor: candidate.id === winner?.id ? '#27ae60' : '#3498db'
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="vote-stats">
                            <div className="vote-count">
                              {candidate.votes} votes
                            </div>
                            <div className="vote-percentage">
                              {candidate.percentage}%
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted mb-0">
                          No candidates were registered for this position.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Summary Stats */}
        {results.length > 0 && (
          <div className="results-summary mt-5">
            <div className="row">
              <div className="col-md-4">
                <div className="summary-card">
                  <h4>{results.length}</h4>
                  <p>Positions</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="summary-card">
                  <h4>
                    {results.reduce((sum, result) => sum + result.total_votes, 0)}
                  </h4>
                  <p>Total Votes Cast</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="summary-card">
                  <h4>
                    {results.reduce((sum, result) => sum + (result.candidates?.length || 0), 0)}
                  </h4>
                  <p>Total Candidates</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;