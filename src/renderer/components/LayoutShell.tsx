import React from 'react';
import { Outlet } from 'react-router-dom';
import { SideNavRail } from './SideNavRail';
import { TopHeaderBar } from './TopHeaderBar';

export function LayoutShell(): React.ReactElement {
  return (
    <div id="app-root" className="flex h-screen w-screen overflow-hidden bg-gray-50 text-gray-900">
      <SideNavRail />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopHeaderBar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
