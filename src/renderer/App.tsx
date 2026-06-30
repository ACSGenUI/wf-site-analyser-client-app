import React from 'react';
import { createHashRouter, RouterProvider } from 'react-router-dom';

import { routes } from './router';

const router = createHashRouter(routes);

export function App(): React.ReactElement {
  return <RouterProvider router={router} />;
}

export default App;
