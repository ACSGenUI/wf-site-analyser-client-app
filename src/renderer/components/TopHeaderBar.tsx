import { Bell, User, RefreshCw } from 'lucide-react';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { ROUTES } from '../routes';
import { useSessionStore } from '../store/sessionStore';

const ROUTE_LABELS: Record<string, string> = {
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.ANALYSIS_NEW]: 'New Analysis',
  [ROUTES.PROJECTS]: 'Projects',
  [ROUTES.SETTINGS_ROOT]: 'Settings',
  [ROUTES.HELP]: 'Help',
};

function getBreadcrumb(pathname: string): string {
  return (
    ROUTE_LABELS[pathname] ??
    Object.entries(ROUTE_LABELS).find(([prefix]) => pathname.startsWith(prefix))?.[1] ??
    ''
  );
}

export function TopHeaderBar(): React.ReactElement {
  const { pathname } = useLocation();
  const mode = useSessionStore((s) => s.mode);
  const breadcrumb = getBreadcrumb(pathname);

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-5">
      <span className="text-[15px] font-bold text-gray-900">WF Site Analyser</span>

      {mode === 'guest' && (
        <span className="flex items-center gap-1.5 rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-medium text-gray-500">
          <User size={14} aria-hidden="true" />
          LOCAL SESSION
        </span>
      )}

      {breadcrumb && <span className="text-xs text-gray-400">{breadcrumb}</span>}

      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm font-semibold text-blue-600">Project Alpha</span>

        <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-500">
          <RefreshCw size={14} aria-hidden="true" />
          Syncing
        </span>

        <button
          type="button"
          aria-label="Notifications bell"
          className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <Bell size={18} aria-hidden="true" />
        </button>

        <button
          type="button"
          aria-label="User menu"
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
        >
          <User size={18} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
