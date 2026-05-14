import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore';
import { ROUTES } from '../routes';

const ROUTE_LABELS: Record<string, string> = {
  [ROUTES.DASHBOARD]:     'Dashboard',
  [ROUTES.ANALYSIS_NEW]:  'New Analysis',
  [ROUTES.PROJECTS]:      'Projects',
  [ROUTES.SETTINGS_ROOT]: 'Settings',
  [ROUTES.HELP]:          'Help',
};

function getBreadcrumb(pathname: string): string {
  return (
    ROUTE_LABELS[pathname] ??
    Object.entries(ROUTE_LABELS).find(([prefix]) => pathname.startsWith(prefix))?.[1] ??
    ''
  );
}

function UserIcon({ size = 14 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CloudSyncIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="17 1 21 5 17 9" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <polyline points="7 23 3 19 7 15" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
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
          <UserIcon size={14} />
          LOCAL SESSION
        </span>
      )}

      {breadcrumb && (
        <span className="text-xs text-gray-400">{breadcrumb}</span>
      )}

      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm font-semibold text-blue-600">Project Alpha</span>

        <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium text-gray-500">
          <CloudSyncIcon />
          Syncing
        </span>

        <button
          type="button"
          aria-label="Notifications bell"
          className="rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <BellIcon />
        </button>

        <button
          type="button"
          aria-label="User menu"
          className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
        >
          <UserIcon size={18} />
        </button>
      </div>
    </header>
  );
}
