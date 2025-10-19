import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Home from './components/Home';
import Results from './components/Results';
import AdminDashboard from './components/AdminDashboard';
import "bootstrap/dist/css/bootstrap.min.css";
import Voting from './components/Voting';
import FAQ from './components/FAQ';
import PositionCandidates from './components/PositionCandidates';
import Contact from './components/Contact';
import Logout from './components/Logout';
import Signup from './components/Signup';

function AppContent() {
  const [user, setUser] = useState(null);
  const location = useLocation();
  
  // Check if current route is login page
  const isLoginPage = location.pathname === '/';
  
  // Check if user is logged in on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('electionUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('electionUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('electionUser');
  };

  return (
    <>
      {!isLoginPage && <Navbar user={user} onLogout={handleLogout} />}
      <div className={isLoginPage ? '' : 'container mt-4'}>
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/home" element={<Home user={user} />} />
          <Route path="/results" element={<Results />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/voting" element={<Voting user={user} />} />
          <Route path="/position/:positionId" element={<PositionCandidates user={user} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
