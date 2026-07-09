import { FileSpreadsheet, Globe, PenTool } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/routes';

const CARDS = [
  {
    id: 'url',
    label: 'Website URL',
    description: 'Enter a live URL for a real-time crawl and accessibility scoring.',
    cta: 'Start Analysis',
    Icon: Globe,
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    id: 'csv',
    label: 'CSV Upload',
    description: 'Upload a batch of URLs to perform high-volume competitive analysis.',
    cta: 'Upload File',
    Icon: FileSpreadsheet,
    bg: 'bg-orange-50',
    iconColor: 'text-orange-500',
  },
  {
    id: 'figma',
    label: 'Figma Link',
    description: 'Analyze design systems and component consistency from Figma.',
    cta: 'Connect Design',
    Icon: PenTool,
    bg: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
];

export function DataSourceCards(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-6">
      {CARDS.map(({ id, label, description, cta, Icon, bg, iconColor }) => (
        <button
          key={id}
          type="button"
          onClick={() => navigate(`${ROUTES.ANALYSIS_NEW}?source=${id}`)}
          className="flex flex-col gap-3 rounded-2xl bg-white p-6 text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg} ${iconColor}`}
          >
            <Icon aria-hidden="true" className="h-5 w-5" />
          </span>
          <span className="font-semibold text-gray-900">{label}</span>
          <span className="text-sm text-gray-500">{description}</span>
          <span className="mt-auto text-xs font-semibold uppercase tracking-widest text-primary-700">
            {cta} ›
          </span>
        </button>
      ))}
    </div>
  );
}
