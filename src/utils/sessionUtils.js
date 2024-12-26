export const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
export const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

const getTimestamp = (timestamp) => {
  if (!timestamp) return null;
  // Handle Firestore Timestamp
  if (timestamp.toDate) return timestamp.toDate().getTime();
  // Handle Date object
  if (timestamp instanceof Date) return timestamp.getTime();
  // Handle ISO string
  if (typeof timestamp === 'string') return new Date(timestamp).getTime();
  // Handle milliseconds number
  if (typeof timestamp === 'number') return timestamp;
  return null;
};

export const isSessionExpired = (session) => {
  if (!session.lastUpdated) return false;
  const lastUpdate = getTimestamp(session.lastUpdated);
  if (!lastUpdate) return false;
  return Date.now() - lastUpdate > SESSION_TIMEOUT;
};

export const isSessionAbandoned = (session) => {
  if (session.status === 'completed') return false;
  if (!session.lastUpdated) return false;
  const lastUpdate = getTimestamp(session.lastUpdated);
  if (!lastUpdate) return false;
  return Date.now() - lastUpdate > SESSION_TIMEOUT;
};

export const shouldCleanupSession = (session) => {
  if (!session.endTime) return false;
  const endTime = getTimestamp(session.endTime);
  if (!endTime) return false;
  return Date.now() - endTime > CLEANUP_INTERVAL;
}; 