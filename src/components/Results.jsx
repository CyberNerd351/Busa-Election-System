import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { api } from '../utils';
import './Results.css';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Change this when a new election starts
  const currentElectionId = 'BUSA2025';

  useEffect(() => {
    const storedElectionId = localStorage.getItem('currentElectionId');

    // Clear old results if a new election starts
    if (storedElectionId && storedElectionId !== currentElectionId) {
      localStorage.removeItem('electionResults');
      localStorage.setItem('currentElectionId', currentElectionId);
    } else if (!storedElectionId) {
      localStorage.setItem('currentElectionId', currentElectionId);
    }

    const cachedResults = localStorage.getItem('electionResults');
    if (cachedResults) {
      setResults(JSON.parse(cachedResults));
      setLoading(false);
    } else {
      loadResults();
    }
  }, [currentElectionId]);

  const loadResults = async () => {
    try {
      setLoading(true);
      const response = await api.results();
      const data = await response.json();

      if (data.success && Array.isArray(data.results)) {
        setResults(data.results);
        localStorage.setItem('electionResults', JSON.stringify(data.results));
      } else {
        setError(data.message || 'Results not available yet');
      }
    } catch (err) {
      setError('Failed to load results. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getChartData = (candidates) => ({
    labels: candidates.map(c => c.name),
    datasets: [
      {
        label: 'Votes',
        data: candidates.map(c => c.votes),
        backgroundColor: [
          '#3498db', '#e74c3c', '#27ae60', '#f39c12',
          '#9b59b6', '#1abc9c', '#d35400', '#34495e'
        ],
        borderColor: [
          '#2980b9', '#c0392b', '#229954', '#e67e22',
          '#8e44ad', '#16a085', '#e74c3c', '#2c3e50'
        ],
        borderWidth: 2,
        borderRadius: 8,
      }
    ]
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
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
        ticks: { stepSize: 1 }
      }
    }
  };

  if (loading) {
    return (
      <div className="results-container">
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading results...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
          <h1 className="text-white">Election Results</h1>
          <p className="text-white-50">
            Official results for BUSA Election 2025
          </p>
        </div>

        {results.length === 0 ? (
          <div className="text-center text-white py-5">
            <h3>No results available yet</h3>
          </div>
        ) : (
          results.map((result) => {
            const winner = result.candidates.reduce((max, c) =>
              c.votes > max.votes ? c : max
            );

            return (
              <div key={result.position.id} className="position-results">
                <div className="winner-section">
                  <h3>
                    🏆 {result.position.name} Winner: {winner.name}
                    <span className="winner-badge ms-2">
                      {winner.votes} votes (
                      {((winner.votes / result.total_votes) * 100).toFixed(1)}%)
                    </span>
                  </h3>
                  <p className="mb-0">
                    Total Votes: {result.total_votes}
                  </p>
                </div>

                {/* Chart Section */}
                <div className="chart-container">
                  <Bar
                    data={getChartData(result.candidates)}
                    options={chartOptions}
                  />
                </div>

                {/* Candidate Breakdown */}
                <div className="mt-4">
                  <h5>Detailed Results:</h5>
                  {result.candidates.map((candidate, idx) => (
                    <div
                      key={candidate.id}
                      className={`candidate-result ${
                        candidate.id === winner.id ? 'winner' : ''
                      }`}
                    >
                      <div className="flex-grow-1">
                        <h6 className="mb-1">
                          {idx + 1}. {candidate.name}
                          {candidate.id === winner.id && (
                            <span className="winner-badge ms-2">Winner</span>
                          )}
                        </h6>
                        <div className="vote-count">
                          {candidate.votes} votes •{' '}
                          {(
                            (candidate.votes / result.total_votes) *
                            100
                          ).toFixed(1)}
                          %
                        </div>
                      </div>
                      <div className="vote-percentage">
                        {(
                          (candidate.votes / result.total_votes) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Results;
