/**
 * SA-107: Testing Framework & Strategy
 * TC-01 – TC-04 covered here.
 * TC-05 (E2E: Electron window launch) lives in tests/e2e/app-launch.spec.ts.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createElement } from 'react';
import { Button } from '@/components/Button';
import { createMockApi } from '../helpers/ipc-mock';

// ---------------------------------------------------------------------------
// TC-01 — Vitest runs a sample test
// ---------------------------------------------------------------------------
describe('TC-01: Vitest runs sample test', () => {
  it('executes a synchronous assertion', () => {
    expect(1 + 1).toBe(2);
  });

  it('executes an async assertion', async () => {
    const value = await Promise.resolve('vitest');
    expect(value).toBe('vitest');
  });

  it('vi.fn() records calls', () => {
    const spy = vi.fn((x: number) => x * 2);
    expect(spy(3)).toBe(6);
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith(3);
  });
});

// ---------------------------------------------------------------------------
// TC-02 — RTL renders a component and asserts DOM output
// ---------------------------------------------------------------------------
describe('TC-02: RTL renders component', () => {
  it('renders a Button and finds it by role', () => {
    render(createElement(Button, null, 'Save'));
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('Button is disabled when the disabled prop is set', () => {
    render(createElement(Button, { disabled: true }, 'Save'));
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('Button calls onClick when clicked', async () => {
    const handler = vi.fn();
    render(createElement(Button, { onClick: handler }, 'Go'));
    screen.getByRole('button').click();
    expect(handler).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// TC-03 — Coverage config is in place
// ---------------------------------------------------------------------------
describe('TC-03: Coverage report generates', () => {
  it('vitest coverage provider is v8 (verified via config contract)', () => {
    expect(() => require.resolve('@vitest/coverage-v8')).not.toThrow();
  });

  it('coverage thresholds are declared at 50 % in vitest.config.ts', () => {
    // Read the config source as text — avoids executing esbuild inside jsdom.
    const fs = require('fs') as typeof import('fs');
    const path = require('path') as typeof import('path');
    const src = fs.readFileSync(path.resolve(__dirname, '../../../../vitest.config.ts'), 'utf8');
    expect(src).toMatch(/lines\s*:\s*50/);
    expect(src).toMatch(/functions\s*:\s*50/);
    expect(src).toMatch(/branches\s*:\s*50/);
    expect(src).toMatch(/statements\s*:\s*50/);
  });
});

// ---------------------------------------------------------------------------
// TC-04 — IPC mocks intercept window.api calls in component tests
// ---------------------------------------------------------------------------
describe('TC-04: IPC mocks work', () => {
  it('window.api is defined in the test environment', () => {
    expect(window.api).toBeDefined();
  });

  it('createMockApi returns vi.fn() stubs for every channel', () => {
    const api = createMockApi();
    expect(typeof api.getAppVersion).toBe('function');
    expect(typeof api['analysis:start']).toBe('function');
    expect(typeof api['rag:query']).toBe('function');
  });

  it('mock getAppVersion resolves to the stub value', async () => {
    const api = createMockApi();
    const version = await api.getAppVersion();
    expect(version).toBe('2.4.0');
  });

  it('override is applied when passed to createMockApi', async () => {
    const api = createMockApi({ getAppVersion: vi.fn().mockResolvedValue('9.9.9') });
    expect(await api.getAppVersion()).toBe('9.9.9');
  });

  it('window.api stubs are vi.fn() instances (can be spied on)', () => {
    const api = window.api as Record<string, ReturnType<typeof vi.fn>>;
    expect(vi.isMockFunction(api.getAppVersion)).toBe(true);
  });
});
