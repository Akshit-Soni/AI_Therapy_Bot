import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase.js';
import { collection, query, getDocs, where } from 'firebase/firestore';
import './AdminPanel.css';
import UsersList from './UsersList';
import SessionsList from './SessionsList';
import { useAuth } from '../../contexts/AuthContext';
import Analytics from './Analytics';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSessions: 0,
    activeSessions: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get users count
      const usersRef = collection(db, 'users');
      const usersSnap = await getDocs(usersRef);
      const totalUsers = usersSnap.size;

      // Get sessions stats
      const sessionsRef = collection(db, 'sessions');
      const sessionsSnap = await getDocs(sessionsRef);
      const totalSessions = sessionsSnap.size;
      
      const activeSessionsQuery = query(
        sessionsRef,
        where('status', '==', 'active')
      );
      const activeSessionsSnap = await getDocs(activeSessionsQuery);
      const activeSessions = activeSessionsSnap.size;

      setStats({
        totalUsers,
        totalSessions,
        activeSessions
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      
      <div className="stats-overview">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Total Sessions</h3>
          <p>{stats.totalSessions}</p>
        </div>
        <div className="stat-card">
          <h3>Active Sessions</h3>
          <p>{stats.activeSessions}</p>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={activeTab === 'sessions' ? 'active' : ''} 
          onClick={() => setActiveTab('sessions')}
        >
          Sessions
        </button>
        <button 
          className={activeTab === 'analytics' ? 'active' : ''} 
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'users' && <UsersList />}
        {activeTab === 'sessions' && <SessionsList />}
        {activeTab === 'analytics' && <Analytics />}
      </div>
    </div>
  );
};

export default AdminPanel;