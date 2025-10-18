import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuth } from "./useAuthProvider";
import { auditLogger } from "@/lib/security-enhanced";

interface SecurityContextType {
  isSecureSession: boolean;
  sessionTimeout: number;
  logSecurityEvent: (event: string, details?: Record<string, unknown>) => void;
  refreshSecurityStatus: () => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(
  undefined,
);

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error("useSecurityContext must be used within SecurityProvider");
  }
  return context;
};

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, session } = useAuth();
  const [isSecureSession, setIsSecureSession] = useState(false);
  const [sessionTimeout] = useState(30 * 60 * 1000); // 30 minutes

  useEffect(() => {
    if (session) {
      // Check if session is secure (has proper tokens, not expired, etc.)
      const now = Date.now();
      // Use expires_at instead of created_at for session age calculation
      const sessionExpiry = session.expires_at ? session.expires_at * 1000 : 0;
      const sessionAge = sessionExpiry - now;

      // Session is secure if it's not expiring within the next 5 minutes
      const isExpiringSoon = sessionAge < 5 * 60 * 1000;
      const secure = !!session.access_token && !isExpiringSoon;

      setIsSecureSession(secure);

      if (user?.id) {
        auditLogger.log("session_status_check", {
          userId: user.id,
          sessionAge,
          expiringBool: isExpiringSoon,
          isSecureSession: secure,
        });
      }
    } else {
      setIsSecureSession(false);
    }
  }, [session, user]);

  const logSecurityEvent = useCallback(
    (event: string, details?: Record<string, unknown>) => {
      auditLogger.log(event, details);
    },
    [],
  );

  const refreshSecurityStatus = useCallback(() => {
    // This will trigger a re-render with updated security status
    setIsSecureSession((prev) => !prev);
    setIsSecureSession((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!session || !user?.id) return;

    const now = Date.now();
    const sessionExpiry = session.expires_at ? session.expires_at * 1000 : 0;
    const sessionAge = sessionExpiry - now;

    if (sessionAge <= 0) {
      logSecurityEvent("session_expired", { userId: user.id });
      return;
    }

    const warningTime = sessionTimeout - 5 * 60 * 1000; // 5 minutes before expiry
    const timer = setTimeout(() => {
      logSecurityEvent("session_expiry_warning", {
        remainingTime: 5 * 60 * 1000,
      });
      // Could show a modal warning here
    }, warningTime);

    return () => clearTimeout(timer);
  }, [session, user, sessionTimeout, logSecurityEvent]);

  return (
    <SecurityContext.Provider
      value={{
        isSecureSession,
        sessionTimeout,
        logSecurityEvent,
        refreshSecurityStatus,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};
