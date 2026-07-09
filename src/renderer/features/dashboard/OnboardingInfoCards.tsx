import { CircleCheck, Search } from 'lucide-react';
import React from 'react';

const steps = [
  { id: 'step-1', text: 'Input your website URL, upload a CSV, or connect a Figma file.' },
  { id: 'step-2', text: 'Our AI agent crawls your site and extracts technical metadata.' },
  {
    id: 'step-3',
    text: 'Review a prioritised list of improvements across performance, a11y, and SEO.',
  },
];

const benefits = [
  { id: 'benefit-1', text: 'Web Vitals Diagnostic' },
  { id: 'benefit-2', text: 'Semantic HTML Audit' },
  { id: 'benefit-3', text: 'Content Strategy Analysis' },
];

export function OnboardingInfoCards(): React.ReactElement {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl bg-gray-100 p-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
            <Search aria-hidden="true" className="h-5 w-5 text-gray-700" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">How It Works</h3>
        </div>
        <ol className="flex flex-col gap-3">
          {steps.map((step, i) => (
            <li
              key={step.id}
              data-testid={step.id}
              className="flex items-start gap-3 text-sm text-gray-600"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                {i + 1}
              </span>
              {step.text}
            </li>
          ))}
        </ol>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-8 text-white">
        <h3 className="mb-4 text-lg font-semibold">What You Get</h3>
        <ul className="flex flex-col gap-3">
          {benefits.map((benefit) => (
            <li
              key={benefit.id}
              data-testid={benefit.id}
              className="flex items-center gap-3 text-sm text-slate-300"
            >
              <CircleCheck aria-hidden="true" className="h-4 w-4 shrink-0 text-blue-400" />
              {benefit.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
