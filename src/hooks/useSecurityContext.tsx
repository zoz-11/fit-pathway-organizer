import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './useAuthProvider';
import { auditLogger } from '@/lib/security-enhanced';

interface SecurityContextType {
  isSecureSession: boolean;
  sessionTimeout: number;
  logSecurityEvent: (event: string, details?: Record<string, unknown>) => void;
  refreshSecurityStatus: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within SecurityProvider');
  }
  return context;
};

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session } = useAuth();
  const [isSecureSession, setIsSecureSession] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30 * 60 * 1000); // 30 minutes

  useEffect(() => {
    if (session) {
      // Check if session is secure (has proper tokens, not expired, etc.)
      const now = Date.now();
      // Use expires_at instead of created_at for session age calculation
      const expiresAt = session.expires_at ? session.expires_at * 1000 : now + sessionTimeout;
      const sessionAge = now - (expiresAt - sessionTimeout);
      const isExpiringSoon = sessionAge > (sessionTimeout - 5 * 60 * 1000); // 5 minutes before timeout

      setIsSecureSession(!!session.access_token && !isExpiringSoon);

      // Log session start
      if (user) {
        auditLogger.logSecurityEvent('session_active', {
          userId: user.id,
          sessionAge,
          expiringBool: isExpiringSoon
        });
      }
    } else {
      setIsSecureSession(false);
    }
  }, [session, user, sessionTimeout]);

  const logSecurityEvent = (event: string, details: Record<string, unknown> = {}) => {
    auditLogger.logSecurityEvent(event, details, user?.id);
  };

  const refreshSecurityStatus = () => {
    if (session) {
      const now = Date.now();
      // Use expires_at instead of created_at for session age calculation
      const expiresAt = session.expires_at ? session.expires_at * 1000 : now + sessionTimeout;
      const sessionAge = now - (expiresAt - sessionTimeout);
      const isExpiringSoon = sessionAge > (sessionTimeout - 5 * 60 * 1000);
      setIsSecureSession(!!session.access_token && !isExpiringSoon);
    }
  };

  // Set up session timeout warning
  useEffect(() => {
    if (!session || !user) return;

    const warningTime = sessionTimeout - 5 * 60 * 1000; // 5 minutes before expiry
    const timer = setTimeout(() => {
      logSecurityEvent('session_expiry_warning', { remainingTime: 5 * 60 * 1000 });
      // Could show a modal warning here
    }, warningTime);

    return () => clearTimeout(timer);
  }, [session, user, sessionTimeout]);

  return (
    <SecurityContext.Provider value={{
      isSecureSession,
      sessionTimeout,
      logSecurityEvent,
      refreshSecurityStatus
    }}>
      {children}
    </SecurityContext.Provider>
  );
};