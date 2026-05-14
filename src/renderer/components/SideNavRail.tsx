import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../routes';

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------
function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ProjectsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function AppLogoIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#2563EB" />
      <path d="M8 22L12 16L16 19L20 12L24 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="18" r="1.5" fill="white" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Nav item definitions
// ---------------------------------------------------------------------------
const NAV_ITEMS = [
  { label: 'Dashboard', to: ROUTES.DASHBOARD,     end: true,  Icon: DashboardIcon },
  { label: 'Projects',  to: ROUTES.PROJECTS,      end: false, Icon: ProjectsIcon  },
  { label: 'Settings',  to: ROUTES.SETTINGS_ROOT, end: false, Icon: SettingsIcon  },
  { label: 'Help',      to: ROUTES.HELP,          end: false, Icon: HelpIcon      },
] as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function SideNavRail(): React.ReactElement {
  const [version, setVersion] = useState<string>('');
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;
    window.api?.getAppVersion?.().then((v) => { if (!cancelled) setVersion(`V${v}`); });
    return () => { cancelled = true; };
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    const links = Array.from(navRef.current?.querySelectorAll('a') ?? []) as HTMLElement[];
    const index = links.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown' && index >= 0 && index < links.length - 1) {
      links[index + 1].focus();
      e.preventDefault();
    } else if (e.key === 'ArrowUp' && index > 0) {
      links[index - 1].focus();
      e.preventDefault();
    }
  }, []);

  return (
    <nav
      ref={navRef}
      className="flex h-full w-56 shrink-0 flex-col border-r border-gray-200 bg-white"
      aria-label="Main navigation"
      onKeyDown={handleKeyDown}
    >
      {/* App branding */}
      <div className="flex items-center gap-3 px-4 py-5">
        <AppLogoIcon />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-bold text-gray-900">Site Analyser</span>
          {version && (
            <span className="text-xs text-gray-400">{version}</span>
          )}
        </div>
      </div>

      {/* Nav items */}
      <div className="flex flex-1 flex-col gap-0.5 px-2">
        {NAV_ITEMS.map(({ label, to, end, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                'hover:bg-gray-100',
                isActive
                  ? 'border-l-2 border-blue-600 bg-blue-50 pl-[10px] text-blue-600'
                  : 'text-gray-600',
              ].join(' ')
            }
          >
            <Icon />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
