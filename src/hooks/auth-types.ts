import { User, Session } from '@supabase/supabase-js';
import { createContext } from 'react';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: 'trainer' | 'athlete' | null;
  phone: string | null;
  date_of_birth: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);


