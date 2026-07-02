import React from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';

import { VersionChecker } from '@/components/VersionChecker';

import { routes } from './router';

const router = createHashRouter(routes);

export function App(): React.ReactElement {
  return (
    <>
      <VersionChecker />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
