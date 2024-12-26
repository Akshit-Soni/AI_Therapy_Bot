import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  Timestamp,
  query,
  where,
  getDocs
} from 'firebase/firestore';

const getNextSessionNumber = async (userId) => {
  try {
    const sessionsRef = collection(db, 'sessions');
    const q = query(
      sessionsRef,
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return 1;
    }
    
    let maxSessionNumber = 0;
    snapshot.forEach(doc => {
      const sessionData = doc.data();
      if (sessionData.sessionNumber && sessionData.sessionNumber > maxSessionNumber) {
        maxSessionNumber = sessionData.sessionNumber;
      }
    });
    
    return maxSessionNumber + 1;
  } catch (error) {
    console.error('Error getting next session number:', error);
    throw error;
  }
};

export const startNewSession = async (userId) => {
  try {
    const sessionNumber = await getNextSessionNumber(userId);
    
    const sessionRef = collection(db, 'sessions');
    const newSession = {
      userId,
      startTime: Timestamp.now(),
      endTime: null,
      status: 'active',
      messages: [],
      sessionNumber,
      lastUpdated: Timestamp.now()
    };

    const docRef = await addDoc(sessionRef, newSession);
    return docRef.id;
  } catch (error) {
    console.error('Error creating new session:', error);
    throw error;
  }
};

