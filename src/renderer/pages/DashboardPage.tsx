import React from 'react';
import { useNavigate } from 'react-router-dom';

import type { Project } from '@shared/types';

import { DashboardEmptyState } from '../features/dashboard/DashboardEmptyState';
import { DataSourceCards } from '../features/dashboard/DataSourceCards';
import { NewAnalysisFAB } from '../features/dashboard/NewAnalysisFAB';
import { ROUTES } from '../routes';
import { useProjectStore } from '../store/projectStore';

const STATUS_CLASS: Record<Project['status'], string> = {
  completed: 'bg-green-100 text-green-700',
  running: 'bg-blue-100 text-blue-700',
  failed: 'bg-red-100 text-red-700',
  draft: 'bg-gray-100 text-gray-500',
};

export function DashboardPage(): React.ReactElement {
  const projects = useProjectStore((s) => s.projects);
  const navigate = useNavigate();

  return (
    <div data-testid="dashboard-page" className="relative p-6">
      {projects.length > 0 ? (
        <div data-testid="project-list" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div key={p.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <p className="font-semibold text-gray-800">{p.name}</p>
              <span
                className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[p.status]}`}
              >
                {p.status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <>
          <DashboardEmptyState onCtaClick={() => navigate(ROUTES.ANALYSIS_NEW)} />
          <section className="mt-12">
            <div className="mb-6 flex items-center gap-6">
              <h2 className="shrink-0 text-xl font-semibold tracking-tight text-gray-900">
                Choose your data source
              </h2>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            <DataSourceCards />
          </section>
        </>
      )}
      <NewAnalysisFAB />
    </div>
  );
}

export default DashboardPage;
