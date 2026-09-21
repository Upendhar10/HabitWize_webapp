import { Outlet } from 'react-router';

export default function AuthLayout() {
  return (
    <main>
      {/* Authentication-specific layout */}

      <Outlet />
    </main>
  );
}
