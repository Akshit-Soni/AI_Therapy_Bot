import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    dailyActiveUsers: 0,
    averageSessionDuration: 0,
    totalMessages: 0,
    completionRate: 0
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const sessionsRef = collection(db, 'sessions');
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);

      // Get recent sessions
      const recentSessionsQuery = query(
        sessionsRef,
        where('startTime', '>=', last30Days),
        orderBy('startTime', 'desc')
      );

      const sessionsSnap = await getDocs(recentSessionsQuery);
      const sessions = [];
      let totalMessages = 0;
      let completedSessions = 0;

      sessionsSnap.forEach(doc => {
        const session = doc.data();
        sessions.push(session);
        totalMessages += session.messages?.length || 0;
        if (session.status === 'completed') {
          completedSessions++;
        }
      });

      // Calculate metrics
      const uniqueUsers = new Set(sessions.map(s => s.userId)).size;
      const totalDuration = sessions.reduce((acc, session) => {
        if (session.startTime && session.endTime) {
          return acc + (session.endTime.toDate() - session.startTime.toDate());
        }
        return acc;
      }, 0);

      setAnalytics({
        dailyActiveUsers: Math.round(uniqueUsers / 30), // Average over 30 days
        averageSessionDuration: Math.round(totalDuration / (sessions.length * 60000)), // In minutes
        totalMessages,
        completionRate: Math.round((completedSessions / sessions.length) * 100)
      });

    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  return (
    <div className="analytics">
      <h2>Analytics (Last 30 Days)</h2>
      
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Daily Active Users</h3>
          <p>{analytics.dailyActiveUsers}</p>
        </div>
        
        <div className="analytics-card">
          <h3>Avg. Session Duration</h3>
          <p>{analytics.averageSessionDuration} min</p>
        </div>
        
        <div className="analytics-card">
          <h3>Total Messages</h3>
          <p>{analytics.totalMessages}</p>
        </div>
        
        <div className="analytics-card">
          <h3>Session Completion Rate</h3>
          <p>{analytics.completionRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 