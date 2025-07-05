import { useContext } from 'react';
import { AuthContext } from './auth-types';

/**
 * useAuth is a custom hook that provides convenient access to the authentication context.
 * It should be used within a component wrapped by AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
