import React from 'react';
import { useSession } from '../../contexts/SessionContext';
import { Link } from 'react-router-dom';
import './History.css';

const History = () => {
  const { sessions } = useSession();
  const completedSessions = sessions.filter(session => session.status === 'ended');

  // Sort sessions in descending order based on startTime
  completedSessions.sort((a, b) => b.startTime.toDate() - a.startTime.toDate());

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'; // Handle cases where timestamp might be null
    return new Date(timestamp.toDate()).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true // Use 12-hour format
    });
  };

  const getDuration = (startTime, endTime) => {
    const start = new Date(startTime.toDate());
    const end = new Date(endTime.toDate());
    const diff = Math.floor((end - start) / 1000 / 60); // minutes
    return `${diff} minutes`;
  };

  return (
    <div className="history-container">
      <h2>Your Session History</h2>
      <div className="sessions-list">
        {completedSessions.length > 0 ? (
          completedSessions.map(session => (
            <div key={session.id} className="session-card">
              <div className="session-header">
                <h3>Session #{session.sessionNumber}</h3>
                <span className="message-count">
                  <i className="fas fa-comment"></i>
                  {session.messages.length} messages
                </span>
              </div>
              <div className="session-details">
                <div className="detail-item">
                  <i className="fas fa-calendar"></i>
                  {formatDate(session.startTime)}
                </div>
                <div className="detail-item">
                  <i className="fas fa-clock"></i>
                  {getDuration(session.startTime, session.endTime)}
                </div>
              </div>
              <Link to={`/session/${session.id}`} className="view-session-btn">
                <i className="fas fa-eye"></i>
                View Full Session
              </Link>
            </div>
          ))
        ) : (
          <div>No session history available.</div>
        )}
      </div>
    </div>
  );
};

export default History; 