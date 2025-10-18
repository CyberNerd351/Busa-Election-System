import React, { useState, useEffect } from 'react';
import { api } from '../utils';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // User Management
  const [newUser, setNewUser] = useState({ email: '', password: '', name: '' });

  // Candidate Management
  const [positions, setPositions] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({ position_id: '', name: '', image: '' });

  // Vote Adjustment
  const [voteAdjustment, setVoteAdjustment] = useState({ candidate_id: '', amount: 0 });

  // Election Settings
  const [electionSettings, setElectionSettings] = useState({
    name: '',
    start_at: '',
    end_at: '',
    reset_data: false
  });

  // Election Status
  const [electionStatus, setElectionStatus] = useState(null);

  // Convert local time to UTC ISO string
  const toUTC = (localDateTime) => {
    const date = new Date(localDateTime);
    return date.toISOString();
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      loadElectionStatus();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      const [positionsResponse, candidatesResponse] = await Promise.all([
        api.positions.getAll(),
        api.admin.getCandidates('admin', '@System372540')
      ]);
      
      const positionsData = await positionsResponse.json();
      setPositions(positionsData);

      if (candidatesResponse.ok) {
        const candidatesData = await candidatesResponse.json();
        setCandidates(candidatesData.candidates || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage('Error loading data');
    }
  };

  const loadElectionStatus = async () => {
    try {
      const response = await api.election.status();
      const data = await response.json();
      setElectionStatus(data);
    } catch (error) {
      console.error('Error loading election status:', error);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await api.admin.login(username, password);
      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setMessage('Admin login successful');
        setActiveTab('dashboard');
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await api.admin.createUser('admin', '@System372540', newUser.email, newUser.password, newUser.name);
      const data = await response.json();

      if (data.success) {
        setMessage('User created successfully');
        setNewUser({ email: '', password: '', name: '' });
      } else {
        setMessage(data.message || 'Failed to create user');
      }
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await api.admin.addCandidate('admin', '@System372540', newCandidate.position_id, newCandidate.name, newCandidate.image);
      const data = await response.json();

      if (data.success) {
        setMessage('Candidate added successfully');
        setNewCandidate({ position_id: '', name: '', image: '' });
        loadData();
      } else {
        setMessage(data.message || 'Failed to add candidate');
      }
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) return;

    setLoading(true);
    try {
      const response = await api.admin.deleteCandidate('admin', '@System372540', candidateId);
      const data = await response.json();

      if (data.success) {
        setMessage('Candidate deleted successfully');
        loadData();
      } else {
        setMessage(data.message || 'Failed to delete candidate');
      }
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustVotes = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await api.admin.adjustVotes('admin', '@System372540', voteAdjustment.candidate_id, parseInt(voteAdjustment.amount));
      const data = await response.json();

      if (data.success) {
        setMessage(`Votes adjusted successfully. New total: ${data.votes}`);
        setVoteAdjustment({ candidate_id: '', amount: 0 });
        loadData();
      } else {
        setMessage(data.message || 'Failed to adjust votes');
      }
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetElection = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const startUTC = toUTC(electionSettings.start_at);
      const endUTC = toUTC(electionSettings.end_at);

      const response = await api.admin.setElection(
        'admin',
        '@System372540',
        electionSettings.name,
        startUTC,
        endUTC,
        electionSettings.reset_data
      );

      const data = await response.json();

      if (data.success) {
        setMessage('Election settings updated successfully');
        setElectionSettings({
          name: '',
          start_at: '',
          end_at: '',
          reset_data: false
        });
        loadElectionStatus();
      } else {
        setMessage(data.message || 'Failed to update election settings');
      }
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getElectionStatusBadge = () => {
    if (!electionStatus) return null;
    
    const statusConfig = {
      'no_election': { class: 'secondary', text: 'No Election' },
      'pending': { class: 'warning', text: 'Pending' },
      'active': { class: 'success', text: 'Active' },
      'ended': { class: 'danger', text: 'Ended' }
    };
    
    const config = statusConfig[electionStatus.status] || statusConfig.no_election;
    return <span className={`badge bg-${config.class}`}>{config.text}</span>;
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-dashboard">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body p-5">
                  <div className="text-center mb-4">
                    <h2>Admin Login</h2>
                    <p className="text-muted">Access the administration panel</p>
                  </div>

                  {message && (
                    <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'} alert-custom`}>
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleAdminLogin}>
                    <div className="mb-3">
                      <label className="form-label">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
                      {loading ? 'Signing in...' : 'Login as Admin'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="text-white">Admin Dashboard</h1>
            {electionStatus && (
              <div className="text-white-50">
                Election Status: {getElectionStatusBadge()} - {electionStatus.message}
              </div>
            )}
          </div>
          <button className="btn btn-outline-light" onClick={() => setIsAuthenticated(false)}>
            Logout
          </button>
        </div>

        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} alert-custom`}>
            {message}
          </div>
        )}

        {/* Navigation Tabs */}
        <nav className="nav nav-pills mb-4">
          {['dashboard', 'users', 'candidates', 'votes', 'election'].map(tab => (
            <button
              key={tab}
              className={`nav-link ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace('_', ' ')}
            </button>
          ))}
        </nav>

        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="admin-section">
            <h3>Overview</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{positions.length}</div>
                <div className="stat-label">Positions</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{candidates.length}</div>
                <div className="stat-label">Candidates</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">
                  {candidates.reduce((sum, c) => sum + (c.votes || 0), 0)}
                </div>
                <div className="stat-label">Total Votes</div>
              </div>
            </div>

            <div className="mt-5">
              <h4>Current Votes per Candidate</h4>
              <table className="table table-dark table-striped mt-3">
                <thead>
                  <tr>
                    <th>Candidate Name</th>
                    <th>Position</th>
                    <th>Votes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map(candidate => (
                    <tr key={candidate.id}>
                      <td>{candidate.name}</td>
                      <td>{candidate.position_name}</td>
                      <td>{candidate.votes || 0}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteCandidate(candidate.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Management */}
        {activeTab === 'users' && (
          <div className="admin-section">
            <h3>Create User</h3>
            <form onSubmit={handleCreateUser}>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Name (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </div>
        )}

        {/* Candidate Management */}
        {activeTab === 'candidates' && (
          <div className="admin-section">
            <h3>Add Candidate</h3>
            <form onSubmit={handleAddCandidate}>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Position</label>
                    <select
                      className="form-control"
                      value={newCandidate.position_id}
                      onChange={(e) => setNewCandidate({ ...newCandidate, position_id: e.target.value })}
                      required
                    >
                      <option value="">Select Position</option>
                      {positions.map(position => (
                        <option key={position.id} value={position.id}>
                          {position.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Candidate Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newCandidate.name}
                      onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Image URL (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newCandidate.image}
                      onChange={(e) => setNewCandidate({ ...newCandidate, image: e.target.value })}
                      placeholder="filename.jpg"
                    />
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                {loading ? 'Adding...' : 'Add Candidate'}
              </button>
            </form>
          </div>
        )}

        {/* Vote Adjustment */}
        {activeTab === 'votes' && (
          <div className="admin-section">
            <h3>Adjust Votes</h3>
            <form onSubmit={handleAdjustVotes}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Candidate</label>
                    <select
                      className="form-control"
                      value={voteAdjustment.candidate_id}
                      onChange={(e) => setVoteAdjustment({ ...voteAdjustment, candidate_id: e.target.value })}
                      required
                    >
                      <option value="">Select Candidate</option>
                      {candidates.map(candidate => (
                        <option key={candidate.id} value={candidate.id}>
                          {candidate.name} ({candidate.position_name}) - {candidate.votes || 0} votes
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Adjustment Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      value={voteAdjustment.amount}
                      onChange={(e) => setVoteAdjustment({ ...voteAdjustment, amount: e.target.value })}
                      required
                    />
                    <small className="form-text text-muted">
                      Positive to add votes, negative to remove votes
                    </small>
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                {loading ? 'Adjusting...' : 'Adjust Votes'}
              </button>
            </form>
          </div>
        )}

        {/* Election Settings */}
        {activeTab === 'election' && (
          <div className="admin-section">
            <h3>Election Settings</h3>
            <form onSubmit={handleSetElection}>
              <div className="form-group mb-3">
                <label>Election Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={electionSettings.name}
                  onChange={(e) => setElectionSettings({ ...electionSettings, name: e.target.value })}
                  placeholder="BUSA Election 2025"
                  required
                />
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Start Date & Time</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={electionSettings.start_at}
                      onChange={(e) => setElectionSettings({ ...electionSettings, start_at: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>End Date & Time</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={electionSettings.end_at}
                      onChange={(e) => setElectionSettings({ ...electionSettings, end_at: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={electionSettings.reset_data}
                  onChange={(e) => setElectionSettings({ ...electionSettings, reset_data: e.target.checked })}
                  id="resetData"
                />
                <label className="form-check-label" htmlFor="resetData">
                  Reset all votes and start fresh election
                </label>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Election Settings'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;