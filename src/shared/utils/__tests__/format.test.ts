import { describe, it, expect } from 'vitest';
import {
  formatBytes,
  formatPercent,
  truncate,
  formatUrl,
  camelToTitle,
  formatRelativeTime,
} from '../format';

describe('formatBytes', () => {
  it('returns "0 B" for zero', () => {
    expect(formatBytes(0)).toBe('0 B');
  });

  it('formats bytes below 1 KB', () => {
    expect(formatBytes(512)).toBe('512 B');
  });

  it('formats kilobytes', () => {
    expect(formatBytes(1024)).toBe('1 KB');
  });

  it('formats megabytes', () => {
    expect(formatBytes(1_048_576)).toBe('1 MB');
  });

  it('formats gigabytes with one decimal place', () => {
    expect(formatBytes(2_468_987_289)).toBe('2.3 GB');
  });

  it('respects the decimals parameter (trailing zeros are stripped by parseFloat)', () => {
    expect(formatBytes(1_536, 2)).toBe('1.5 KB');
    expect(formatBytes(1_048_576 * 1.5, 2)).toBe('1.5 MB');
  });
});

describe('formatPercent', () => {
  it('returns "0%" when total is zero', () => {
    expect(formatPercent(0, 0)).toBe('0%');
  });

  it('returns "50%" for half of total', () => {
    expect(formatPercent(50, 100)).toBe('50%');
  });

  it('rounds to the nearest integer', () => {
    expect(formatPercent(1, 3)).toBe('33%');
  });

  it('returns "100%" for complete', () => {
    expect(formatPercent(7, 7)).toBe('100%');
  });
});

describe('truncate', () => {
  it('returns the original string when within limit', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('truncates and appends ellipsis when over limit', () => {
    expect(truncate('hello world', 5)).toBe('hello…');
  });

  it('does not truncate a string that equals maxLength exactly', () => {
    expect(truncate('exact', 5)).toBe('exact');
  });
});

describe('formatUrl', () => {
  it('strips http:// prefix', () => {
    expect(formatUrl('http://example.com')).toBe('example.com');
  });

  it('strips https:// prefix', () => {
    expect(formatUrl('https://example.com/path')).toBe('example.com/path');
  });

  it('removes trailing slash', () => {
    expect(formatUrl('https://example.com/')).toBe('example.com');
  });

  it('leaves paths intact', () => {
    expect(formatUrl('https://example.com/page/sub')).toBe('example.com/page/sub');
  });
});

describe('camelToTitle', () => {
  it('converts camelCase to Title Case', () => {
    expect(camelToTitle('analysisSetupScreen')).toBe('Analysis Setup Screen');
  });

  it('converts PascalCase to Title Case', () => {
    expect(camelToTitle('SignInScreen')).toBe('Sign In Screen');
  });

  it('handles single word without crashing', () => {
    expect(camelToTitle('dashboard')).toBe('Dashboard');
  });
});

describe('formatRelativeTime', () => {
  const now = new Date('2026-05-19T12:00:00Z');

  it('returns "just now" for timestamps under 60 seconds ago', () => {
    const date = new Date(now.getTime() - 30_000);
    expect(formatRelativeTime(date, now)).toBe('just now');
  });

  it('returns minutes ago for timestamps under 1 hour', () => {
    const date = new Date(now.getTime() - 10 * 60_000);
    expect(formatRelativeTime(date, now)).toBe('10m ago');
  });

  it('returns hours ago for timestamps under 24 hours', () => {
    const date = new Date(now.getTime() - 3 * 3_600_000);
    expect(formatRelativeTime(date, now)).toBe('3h ago');
  });

  it('returns days ago for timestamps within the last week', () => {
    const date = new Date(now.getTime() - 2 * 86_400_000);
    expect(formatRelativeTime(date, now)).toBe('2d ago');
  });

  it('returns a locale date string for timestamps older than 7 days', () => {
    const date = new Date(now.getTime() - 8 * 86_400_000);
    expect(formatRelativeTime(date, now)).toBe(date.toLocaleDateString());
  });
});
