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
  
  election: {
    status: () => fetch(`${API_BASE}/election/status`),
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
    setElection: (adminName, adminPassword, name, startAt, endAt, resetData = false) =>
      fetch(`${API_BASE}/admin/set_election`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_name: adminName, admin_password: adminPassword, name, start_at: startAt, end_at: endAt, reset_data: resetData })
      }),
    getCandidates: (adminName, adminPassword) =>
      fetch(`${API_BASE}/admin/candidates?admin_name=${adminName}&admin_password=${adminPassword}`)
  },
  
  positions: {
    getAll: () => fetch(`${API_BASE}/positions`),
    getCandidates: (positionId, isAdmin = false) => 
      fetch(`${API_BASE}/positions/${positionId}/candidates${isAdmin ? '?admin=true' : ''}`)
  },
  
  vote: (userId, positionId, candidateId) =>
    fetch(`${API_BASE}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, position_id: positionId, candidate_id: candidateId })
    }),
    
  userVotes: {
    get: (userId) => fetch(`${API_BASE}/user/${userId}/votes`),
  },
  
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

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

// New function to get detailed time remaining with auto-update
export const getTimeRemaining = (endTime, onUpdate) => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end - now;

  if (diff <= 0) {
    return {
      ended: true,
      message: 'Election ended',
      totalSeconds: 0
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  let message = '';
  if (days > 0) {
    message = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  } else if (hours > 0) {
    message = `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    message = `${minutes}m ${seconds}s`;
  } else {
    message = `${seconds}s`;
  }

  return {
    ended: false,
    message,
    totalSeconds,
    days,
    hours,
    minutes,
    seconds
  };
};