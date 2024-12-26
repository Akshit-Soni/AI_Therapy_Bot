import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  getDoc,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {

  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load and listen to sessions
  useEffect(() => {
    if (!currentUser) {
      setSessions([]);
      setCurrentSessionId(null);
      setLoading(false);
      return;
    }

    const sessionsRef = collection(db, 'sessions');
    const q = query(
      sessionsRef,
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedSessions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Find any active session
      const activeSession = loadedSessions.find(s => s.status === 'active');
      if (activeSession && !currentSessionId) {
        setCurrentSessionId(activeSession.id);
      }

      setSessions(loadedSessions);
      setLoading(false);
    }, (error) => {
      console.error('Error loading sessions:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, currentSessionId]);


  const addMessageToSession = async (sessionId, message) => {
    try {
      if (!sessionId) {
        throw new Error('No session ID provided');

      }

          const sessionRef = doc(db, 'sessions', sessionId);
      const sessionSnap = await getDoc(sessionRef);
      
      if (sessionSnap.exists()) {
        const sessionData = sessionSnap.data();
        if (sessionData.status !== 'active') {
            throw new Error('Session is not active');

        }

        const currentMessages = sessionData.messages || [];
        await updateDoc(sessionRef, {
          messages: [...currentMessages, message],
          lastUpdated: new Date().toISOString()
        });
      } else {
        throw new Error('Session not found');

      }
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  };


  const endSession = async (sessionId) => {
    try {
          const sessionRef = doc(db, 'sessions', sessionId);
      await updateDoc(sessionRef, {
        endTime: new Date().toISOString(),
        status: 'completed',
        lastUpdated: new Date().toISOString()
      });
      setCurrentSessionId(null);
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  };


  const value = {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    addMessageToSession,
    endSession,
    loading
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};