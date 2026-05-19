import React from 'react';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string;
}

function TestProviders({
  children,
  initialRoute = '/',
}: {
  children: React.ReactNode;
  initialRoute?: string;
}) {
  return <MemoryRouter initialEntries={[initialRoute]}>{children}</MemoryRouter>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  { initialRoute = '/', ...options }: CustomRenderOptions = {},
): RenderResult {
  return render(ui, {
    wrapper: ({ children }) => (
      <TestProviders initialRoute={initialRoute}>{children}</TestProviders>
    ),
    ...options,
  });
}

export * from '@testing-library/react';
