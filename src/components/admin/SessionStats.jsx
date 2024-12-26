import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const SessionStats = () => {
  const [sessionStats, setSessionStats] = useState({
    totalSessions: 0,
    activeSessions: 0,
    averageDuration: 0,
    sessionsByDay: [],
    completionReasons: []
  });

  useEffect(() => {
    const fetchSessionStats = async () => {
      try {
        const sessionsRef = collection(db, 'sessions');
        const now = new Date();
        const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

        // Get total sessions
        const totalSnapshot = await getDocs(sessionsRef);
        const total = totalSnapshot.size;

        // Get active sessions
        const activeQuery = query(
          sessionsRef,
          where('status', '==', 'active')
        );
        const activeSnapshot = await getDocs(activeQuery);
        const active = activeSnapshot.size;

        // Get sessions by completion reason
        const completedQuery = query(
          sessionsRef,
          where('status', '==', 'completed')
        );
        const completedSnapshot = await getDocs(completedQuery);
        const reasons = {};
        completedSnapshot.forEach(doc => {
          const reason = doc.data().endReason || 'unknown';
          reasons[reason] = (reasons[reason] || 0) + 1;
        });

        // Calculate average duration
        let totalDuration = 0;
        let sessionsWithDuration = 0;
        completedSnapshot.forEach(doc => {
          const data = doc.data();
          if (data.startTime && data.endTime) {
            const duration = data.endTime.toDate() - data.startTime.toDate();
            totalDuration += duration;
            sessionsWithDuration++;
          }
        });

        const averageDuration = sessionsWithDuration > 0 
          ? totalDuration / sessionsWithDuration / (60 * 1000) // Convert to minutes
          : 0;

        setSessionStats({
          totalSessions: total,
          activeSessions: active,
          averageDuration: Math.round(averageDuration),
          completionReasons: Object.entries(reasons).map(([name, value]) => ({
            name,
            value
          }))
        });

      } catch (error) {
        console.error('Error fetching session stats:', error);
      }
    };

    fetchSessionStats();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h2>Session Analytics</h2>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-value">{sessionStats.totalSessions}</div>
          <div className="stat-label">Total Sessions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{sessionStats.activeSessions}</div>
          <div className="stat-label">Active Sessions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{sessionStats.averageDuration}min</div>
          <div className="stat-label">Average Duration</div>
        </div>
      </div>

      <div className="stats-charts">
        <div className="chart-container">
          <h3>Session Completion Reasons</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={sessionStats.completionReasons}
              cx={200}
              cy={200}
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {sessionStats.completionReasons.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default SessionStats; 