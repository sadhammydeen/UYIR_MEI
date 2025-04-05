import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

type SessionContextType = {
  sessionId: string;
  startTime: Date;
  lastActivity: Date;
  logActivity: (activity: string, details?: Record<string, any>) => void;
  activitiesLog: Array<{
    timestamp: Date;
    activity: string;
    details?: Record<string, any>;
  }>;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionId] = useState(() => {
    // Try to retrieve a stored session ID from localStorage or create a new one
    const storedSession = localStorage.getItem('sessionId');
    if (storedSession) return storedSession;
    
    const newSession = uuidv4();
    localStorage.setItem('sessionId', newSession);
    return newSession;
  });
  
  const [startTime] = useState<Date>(new Date());
  const [lastActivity, setLastActivity] = useState<Date>(new Date());
  const [activitiesLog, setActivitiesLog] = useState<SessionContextType['activitiesLog']>([]);

  // Update last activity when user interacts with the page
  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(new Date());
    };

    window.addEventListener('click', updateActivity);
    window.addEventListener('keypress', updateActivity);
    window.addEventListener('scroll', updateActivity);
    window.addEventListener('mousemove', updateActivity);

    return () => {
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('keypress', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      window.removeEventListener('mousemove', updateActivity);
    };
  }, []);

  // Send session data to server or analytics service every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      // Here you can implement logic to send session data to a server
      console.log('Session data:', {
        sessionId,
        duration: (new Date().getTime() - startTime.getTime()) / 1000, // in seconds
        activitiesCount: activitiesLog.length
      });
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [sessionId, startTime, activitiesLog]);

  const logActivity = (activity: string, details?: Record<string, any>) => {
    const timestamp = new Date();
    setLastActivity(timestamp);
    setActivitiesLog(prevLog => [
      ...prevLog,
      { timestamp, activity, details }
    ]);
  };

  return (
    <SessionContext.Provider value={{
      sessionId,
      startTime,
      lastActivity,
      activitiesLog,
      logActivity
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider; 