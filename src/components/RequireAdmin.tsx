import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from '@/hooks/useAuth';

export default function RequireAdmin() {
  const { loading, isAdmin } = useSession();
  const loc = useLocation();

  if (loading) {
    return <div className="min-h-[40vh] flex items-center justify-center text-sm text-muted-foreground">Checking access…</div>;
  }
  if (!isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />;
  }
  return <Outlet />;
}
