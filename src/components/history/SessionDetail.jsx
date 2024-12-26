import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import './SessionDetail.css';

const SessionDetail = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const sessionRef = doc(db, 'sessions', sessionId);
      const sessionSnap = await getDoc(sessionRef);
      if (sessionSnap.exists()) {
        setSession(sessionSnap.data());
      } else {
        console.error('No such session!');
      }
      setLoading(false);
    };

    loadSession();
  }, [sessionId]);

  if (loading) return <div>Loading session details...</div>;

  return (
    <div className="session-detail">
      <h2>Session Details</h2>
      {session ? (
        <>
          <h3>Session #{session.sessionNumber}</h3>
          <p><strong>Status:</strong> {session.status}</p>
          <p><strong>Started:</strong> {new Date(session.startTime.toDate()).toLocaleString()}</p>
          <p><strong>Ended:</strong> {session.endTime ? new Date(session.endTime.toDate()).toLocaleString() : 'Ongoing'}</p>
          <h4>Messages:</h4>
          <div className="messages-list">
            {session.messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                <strong>{message.sender === 'user' ? 'You' : 'AI'}:</strong> {message.text}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>No session found.</p>
      )}
    </div>
  );
};

export default SessionDetail; 