import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';

const SessionsList = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const sessionsRef = collection(db, 'sessions');
      const q = query(
        sessionsRef, 
        orderBy('startTime', 'desc'),
        limit(100)
      );
      
      const querySnapshot = await getDocs(q);
      const loadedSessions = [];
      
      querySnapshot.forEach((doc) => {
        loadedSessions.push({ id: doc.id, ...doc.data() });
      });
      
      setSessions(loadedSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading sessions...</div>;

  return (
    <div className="sessions-list">
      <h2>Recent Sessions</h2>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Started</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Messages</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(session => (
            <tr key={session.id}>
              <td>{session.userEmail}</td>
              <td>{new Date(session.startTime?.toDate()).toLocaleString()}</td>
              <td>
                {session.endTime ? 
                  Math.round((session.endTime?.toDate() - session.startTime?.toDate()) / 60000) + ' min' 
                  : 'Ongoing'}
              </td>
              <td>{session.status}</td>
              <td>{session.messages?.length || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SessionsList; 