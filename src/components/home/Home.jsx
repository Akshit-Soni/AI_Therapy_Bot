import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to MindfulAI Therapy</h1>
        <p>Your safe space for mental wellness conversations</p>
        <div className="cta-buttons">
          {currentUser ? (
            <Link to="/chat" className="start-chat-btn">
              <i className="fas fa-comments"></i>
              Start New Session
            </Link>
          ) : (
            <>
              <Link to="/login" className="start-chat-btn">
                <i className="fas fa-sign-in-alt"></i>
                Login to Start
              </Link>
              <Link to="/register" className="learn-more-btn">
                <i className="fas fa-user-plus"></i>
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
      
      <div className="features-section">
        <div className="feature-card">
          <i className="fas fa-comments"></i>
          <h3>AI-Powered Therapy</h3>
          <p>Engage in meaningful conversations with our advanced AI therapist</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-history"></i>
          <h3>Session History</h3>
          <p>Track your progress and review past conversations</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-lock"></i>
          <h3>Private & Secure</h3>
          <p>Your conversations are completely confidential</p>
        </div>
      </div>

      {currentUser && (
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-cards">
            <Link to="/chat" className="action-card">
              <i className="fas fa-plus-circle"></i>
              <h3>New Session</h3>
              <p>Start a new therapy session</p>
            </Link>
            <Link to="/history" className="action-card">
              <i className="fas fa-history"></i>
              <h3>View History</h3>
              <p>Review your past sessions</p>
            </Link>
            <Link to="/settings" className="action-card">
              <i className="fas fa-cog"></i>
              <h3>Settings</h3>
              <p>Manage your preferences</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 