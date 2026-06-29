import { useEffect } from "react";
import { useLocation } from "wouter";
import { getUser, getAdminSession } from "@/lib/auth";

interface Props {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: Props) {
  const [, setLocation] = useLocation();
  const user = getUser();
  const isAdminSession = getAdminSession();

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin" && isAdminSession;

  useEffect(() => {
    if (requireAdmin) {
      if (!isAdmin) {
        setLocation("/admin");
      }
    } else {
      if (!isAuthenticated) {
        setLocation("/login");
      }
    }
  }, [isAuthenticated, isAdmin, requireAdmin, setLocation]);

  if (requireAdmin && !isAdmin) return null;
  if (!requireAdmin && !isAuthenticated) return null;

  return <>{children}</>;
}
