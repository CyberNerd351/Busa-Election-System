const API_BASE = 'https://busa1.pythonanywhere.com/api';

export const api = {
  user: {
    signin: (email, password) => 
      fetch(`${API_BASE}/user/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      }),
  },
  admin: {
    login: (username, password) =>
      fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      }),
    createUser: (adminName, adminPassword, email, password, name) =>
      fetch(`${API_BASE}/admin/create_user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_name: adminName, admin_password: adminPassword, email, password, name })
      }),
    addCandidate: (adminName, adminPassword, positionId, name, image) =>
      fetch(`${API_BASE}/admin/add_candidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_name: adminName, admin_password: adminPassword, position_id: positionId, name, image })
      }),
    deleteCandidate: (adminName, adminPassword, candidateId) =>
      fetch(`${API_BASE}/admin/delete_candidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_name: adminName, admin_password: adminPassword, candidate_id: candidateId })
      }),
    adjustVotes: (adminName, adminPassword, candidateId, amount) =>
      fetch(`${API_BASE}/admin/adjust_votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_name: adminName, admin_password: adminPassword, candidate_id: candidateId, amount })
      }),
    setElection: (adminName, adminPassword, name, startAt, endAt) =>
      fetch(`${API_BASE}/admin/set_election`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_name: adminName, admin_password: adminPassword, name, start_at: startAt, end_at: endAt })
      })
  },
  positions: {
    getAll: () => fetch(`${API_BASE}/positions`),
    getCandidates: (positionId) => fetch(`${API_BASE}/positions/${positionId}/candidates`)
  },
  vote: (userId, positionId, candidateId) =>
    fetch(`${API_BASE}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, position_id: positionId, candidate_id: candidateId })
    }),
  results: () => fetch(`${API_BASE}/results`)
};

export const formatTimeRemaining = (endTime) => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end - now;

  if (diff <= 0) return 'Election ended';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};