import React, { useEffect } from 'react';
import { HashRouter, useRoutes } from 'react-router-dom';

import { routes } from './router';
import { useSessionStore } from './store/sessionStore';

function AppRoutes(): React.ReactElement | null {
  return useRoutes(routes);
}

// Named export: bare component — use inside any existing Router context
// (MemoryRouter in tests, HashRouter in prod)
export function App(): React.ReactElement {
  useEffect(() => {
    async function init(): Promise<void> {
      const existing = (await window.api.storeGet('sessionId')) as string | null;
      if (existing) {
        useSessionStore.getState().initGuestSession(existing);
      } else {
        const newId = crypto.randomUUID();
        await window.api.storeSet('sessionId', newId);
        useSessionStore.getState().initGuestSession(newId);
      }
    }
    // eslint-disable-next-line no-void
    void init();
  }, []);

  return <AppRoutes />;
}

// Default export: self-contained app with its own HashRouter — used by the renderer entry point
// and by tests that render App directly without providing a router context.
function AppWithRouter(): React.ReactElement {
  return (
    <HashRouter>
      <App />
    </HashRouter>
  );
}

export default AppWithRouter;
