import { Navigate, Outlet, useLocation } from 'react-router';

export default function RequireAuth() {
  const isAuthenticated = false; // temporary

  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
