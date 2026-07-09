import { Zap } from 'lucide-react';
import React from 'react';

import { OnboardingInfoCards } from './OnboardingInfoCards';

interface Props {
  onCtaClick: () => void;
}

export function DashboardEmptyState({ onCtaClick }: Props): React.ReactElement {
  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
          Welcome to your Workspace
        </h1>
        <p className="mt-3 max-w-xl text-lg text-gray-500">
          Ready to transform your site data into actionable insights? Start by choosing an input
          method below and let our AI agents handle the heavy lifting.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 flex min-h-[400px] flex-col justify-between overflow-hidden rounded-2xl bg-white p-12 shadow-sm">
          <div>
            <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-700">
              Precision Analysis
            </span>
            <h2 className="mt-6 text-5xl font-semibold leading-tight tracking-tight text-gray-900">
              Start New
              <br />
              Analysis
            </h2>
            <p className="mt-6 max-w-md text-lg text-gray-500">
              Input your source and our RAG-enhanced AI will generate a comprehensive audit
              including performance, accessibility, and SEO metrics.
            </p>
          </div>
          <button
            type="button"
            onClick={onCtaClick}
            className="mt-8 inline-flex w-fit items-center gap-3 rounded-lg bg-gradient-to-r from-primary-dark to-primary px-8 py-4 text-lg font-semibold text-white shadow-md transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Launch AI Agent
            <Zap aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div>
          <OnboardingInfoCards />
        </div>
      </div>
    </div>
  );
}
