export const ROUTES = {
  SIGN_IN: '/sign-in',
  DASHBOARD: '/dashboard',
  ANALYSIS_NEW: '/analysis/new',
  ANALYSIS_PROGRESS: '/analysis/:id/progress',
  RESULTS: '/projects/:projectId/results/:analysisId',
  SETTINGS: '/settings/:tab',
  SETTINGS_ROOT: '/settings',
  FORCE_UPDATE: '/force-update',
  PROJECTS: '/projects',
  HELP: '/help',
} as const;

export type RouteKey = keyof typeof ROUTES;
