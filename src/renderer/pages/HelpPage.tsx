import React from 'react';

const HELP_ITEMS = [
  {
    title: 'Getting Started',
    description: 'Learn how to run your first site analysis in minutes.',
    icon: '🚀',
  },
  {
    title: 'URL & CSV Input',
    description: 'How to provide URLs manually or upload a CSV file for batch analysis.',
    icon: '📄',
  },
  {
    title: 'Reading Results',
    description: 'Understand templates, UI blocks, confidence scores, and screenshots.',
    icon: '📊',
  },
  {
    title: 'AI Assistant',
    description: 'Ask questions about your results using the built-in AI chat panel.',
    icon: '🤖',
  },
  {
    title: 'Settings & API Keys',
    description: 'Configure model providers, browser settings, and storage preferences.',
    icon: '⚙️',
  },
  {
    title: 'Keyboard Shortcuts',
    description: 'Speed up your workflow with keyboard shortcuts.',
    icon: '⌨️',
  },
];

export function HelpPage(): React.ReactElement {
  return (
    <div data-testid="help-page" className="p-6">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Help & Documentation</h1>
      <p className="mb-8 text-sm text-gray-500">Everything you need to get the most out of WF Site Analyser.</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {HELP_ITEMS.map(({ title, description, icon }) => (
          <div
            key={title}
            className="flex gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="text-2xl leading-none">{icon}</span>
            <div>
              <h2 className="mb-1 font-semibold text-gray-800">{title}</h2>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HelpPage;
