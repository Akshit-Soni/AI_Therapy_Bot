import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isAdmin } from '../../utils/adminUtils';
import './Settings.css';

const Settings = () => {
  const { currentUser } = useAuth();

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="settings-section">
        <h3>Account Settings</h3>
        {/* Add settings content here */}
      </div>
      {isAdmin(currentUser) && (
        <div className="admin-link">
          <Link to="/admin">Go to Admin Panel</Link>
        </div>
      )}
    </div>
  );
};

export default Settings; 