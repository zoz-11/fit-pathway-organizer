import { useAuth } from "@/hooks/useAuthProvider";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "trainer" | "athlete";
}

export const ProtectedRoute = ({
  children,
  requiredRole,
}: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();

  // Show a loading spinner while authentication status is being determined
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no user is authenticated, redirect to the authentication page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If a specific role is required and the authenticated user does not have that role, display an access denied message
  if (requiredRole && profile?.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  // If authenticated and authorized, render the children components
  return <>{children}</>;
};
