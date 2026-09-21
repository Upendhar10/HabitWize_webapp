import App from '@/App.tsx';

import PublicLayout from '@/layouts/PublicLayout.tsx';
import AuthLayout from '@/layouts/AuthLayout.tsx';
import PrivateLayout from '@/layouts/PrivateLayout.tsx';

import RequireAuth from '@/app/router/guards/RequireAuth.tsx';
import RequireGuest from '@/app/router/guards/RequireGuest.tsx';
import RouteErrorBoundary from '@/app/router/errors/RouteErrorBoundary.tsx';

const routes = [
  {
    path: '/',
    Component: App,
    children: [
      // Public routes
      {
        Component: PublicLayout,
        children: [
          {
            index: true,
            Component: 'LandingPage',
          },
        ],
      },

      // Guest-only routes
      {
        Component: RequireGuest,
        children: [
          {
            Component: AuthLayout,
            children: [
              {
                path: 'signin',
                Component: 'SignInPage',
              },
              {
                path: 'signup',
                Component: 'SignUpPage',
              },
            ],
          },
        ],
      },

      // Authenticated routes
      {
        Component: RequireAuth,
        children: [
          {
            Component: PrivateLayout,
            children: [
              {
                path: 'dashboard',
                Component: 'DashboardPage',
              },
              {
                path: 'habits',
                Component: 'HabitsPage',
              },
            ],
          },
        ],
      },

      // Error routes
      {
        path: '*',
        Component: RouteErrorBoundary,
      },
    ],
  },
];

export default routes;
