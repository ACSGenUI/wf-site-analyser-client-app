import React from 'react';
import { Outlet } from 'react-router-dom';

// Stub guard — full auth check wired in Epic 09
export function AuthGuard(): React.ReactElement {
  return <Outlet />;
}
