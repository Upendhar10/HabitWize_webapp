import { Outlet } from 'react-router';

export default function PublicLayout() {
  return (
    <>
      {/* Public Navbar */}

      <main>
        <Outlet />
      </main>

      {/* Public Footer */}
    </>
  );
}
