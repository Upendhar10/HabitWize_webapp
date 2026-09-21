import { Outlet } from 'react-router';

export default function PrivateLayout() {
  return (
    <div>
      {/* Sidebar */}
      {/* Header */}

      <main>
        <Outlet />
      </main>
    </div>
  );
}
