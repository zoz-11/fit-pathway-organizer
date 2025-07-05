import { useState, useEffect, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from './useProfile';
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils";

import { AuthContext } from './auth-types';

/**
 * AuthProvider component manages the authentication state of the application.
 * It provides the user, session, profile, loading status, and signOut function
 * to its children via React Context.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const { data: profile, isLoading: isLoadingProfile } = useProfile(user?.id);

  useEffect(() => {
    // Subscribes to authentication state changes from Supabase.
    // This listener updates the user and session state whenever the auth status changes (e.g., login, logout).
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoadingInitial(false);
      }
    );

    // Fetches the current session from Supabase on component mount.
    // This is important for initial load to determine if a user is already logged in.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoadingInitial(false);
    });

    // Cleans up the subscription when the component unmounts to prevent memory leaks.
    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      window.location.href = '/auth';
    } catch (error) {
      console.error('Error signing out:', error);
      handleApiError(error, 'Failed to sign out.');
    }
  };

  // Combines initial loading state with profile loading state.
  const loading = loadingInitial || isLoadingProfile;

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

import { useAuth } from './useAuthHook';
