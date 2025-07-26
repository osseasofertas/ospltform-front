import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAppState } from "@/hooks/use-app-state";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerification?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireVerification = true 
}: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const { user } = useAppState();

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      setLocation("/login");
      return;
    }

    // Check if user is verified (if verification is required)
    if (requireVerification && !user.isVerified) {
      setLocation("/verification");
      return;
    }
  }, [user, requireVerification, setLocation]);

  // Don't render children if user is not logged in or not verified
  if (!user) {
    return null;
  }

  if (requireVerification && !user.isVerified) {
    return null;
  }

  return <>{children}</>;
} 