import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const UserStats = () => {
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
    activeUsers: 0,
    userGrowth: []
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const usersRef = collection(db, 'users');
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Get total users
        const totalSnapshot = await getDocs(usersRef);
        const total = totalSnapshot.size;

        // Get new users today
        const newUsersQuery = query(
          usersRef,
          where('createdAt', '>=', today)
        );
        const newUsersSnapshot = await getDocs(newUsersQuery);
        const newUsers = newUsersSnapshot.size;

        // Get active users (users with sessions in last 7 days)
        const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const activeUsersQuery = query(
          collection(db, 'sessions'),
          where('lastUpdated', '>=', sevenDaysAgo)
        );
        const activeSessionsSnapshot = await getDocs(activeUsersQuery);
        const activeUserIds = new Set();
        activeSessionsSnapshot.forEach(doc => {
          activeUserIds.add(doc.data().userId);
        });

        // Get user growth over time
        const userGrowthData = [];
        // ... implement user growth calculation

        setUserStats({
          totalUsers: total,
          newUsersToday: newUsers,
          activeUsers: activeUserIds.size,
          userGrowth: userGrowthData
        });

      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchUserStats();
  }, []);

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h2>User Analytics</h2>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-value">{userStats.totalUsers}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{userStats.newUsersToday}</div>
          <div className="stat-label">New Users Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{userStats.activeUsers}</div>
          <div className="stat-label">Active Users (7 days)</div>
        </div>
      </div>

      <div className="stats-chart">
        <h3>User Growth Over Time</h3>
        <LineChart width={800} height={400} data={userStats.userGrowth}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="users" stroke="#8884d8" />
        </LineChart>
      </div>
    </div>
  );
};

export default UserStats; 