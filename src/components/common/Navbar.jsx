import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">
          <i className="fas fa-brain"></i>
          MindfulAI Therapy
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/">
          <i className="fas fa-home"></i>
          Home
        </Link>
        {currentUser ? (
          <>
            <Link to="/chat">
              <i className="fas fa-comments"></i>
              Chat
            </Link>
            <Link to="/history">
              <i className="fas fa-history"></i>
              History
            </Link>
            <Link to="/settings">
              <i className="fas fa-cog"></i>
              Settings
            </Link>
            <div className="user-menu">
              <span className="user-info">
                <i className="fas fa-user"></i>
                {currentUser.name || currentUser.email}
              </span>
              <button onClick={handleLogout} className="logout-btn">
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
            {isAdmin && (
              <Link to="/admin" className="nav-item">
                <i className="fas fa-chart-line"></i>
                Admin Panel
              </Link>
            )}
          </>
        ) : (
          <Link to="/login" className="login-btn">
            <i className="fas fa-sign-in-alt"></i>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 