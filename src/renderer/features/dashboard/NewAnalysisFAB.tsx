import { Plus } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/routes';

export function NewAnalysisFAB(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      aria-label="New Analysis"
      onClick={() => navigate(ROUTES.ANALYSIS_NEW)}
      className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <Plus aria-hidden="true" className="h-6 w-6" />
    </button>
  );
}
