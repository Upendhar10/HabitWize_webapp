import { Navigate, Outlet } from 'react-router';

export default function RequireGuest() {
  const isAuthenticated = false; // temporary

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
