import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-sm text-ink-soft font-light">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/account/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
