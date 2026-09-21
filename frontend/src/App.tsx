import { Outlet, ScrollRestoration } from 'react-router';

function App() {
  return (
    <>
      <Outlet />
      <ScrollRestoration />
    </>
  );
}

export default App;
