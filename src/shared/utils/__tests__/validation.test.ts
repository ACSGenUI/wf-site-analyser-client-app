import { describe, it, expect } from 'vitest';
import {
  isValidUrl,
  isFigmaUrl,
  isCsvPath,
  parseUrlList,
  isNonEmpty,
  isInRange,
} from '../validation';

describe('isValidUrl', () => {
  it('accepts a valid https URL', () => {
    expect(isValidUrl('https://www.adobe.com')).toBe(true);
  });

  it('accepts a valid http URL', () => {
    expect(isValidUrl('http://localhost:3000')).toBe(true);
  });

  it('rejects a plain string with no protocol', () => {
    expect(isValidUrl('www.adobe.com')).toBe(false);
  });

  it('rejects an empty string', () => {
    expect(isValidUrl('')).toBe(false);
  });

  it('rejects a ftp URL (non http/https)', () => {
    expect(isValidUrl('ftp://files.example.com')).toBe(false);
  });

  it('accepts a URL with a path and query string', () => {
    expect(isValidUrl('https://example.com/path?q=1')).toBe(true);
  });
});

describe('isFigmaUrl', () => {
  it('accepts a Figma file URL', () => {
    expect(isFigmaUrl('https://www.figma.com/file/ABC123/My-Design')).toBe(true);
  });

  it('accepts a Figma design URL', () => {
    expect(isFigmaUrl('https://figma.com/design/XYZ/Component')).toBe(true);
  });

  it('accepts a Figma prototype URL', () => {
    expect(isFigmaUrl('https://www.figma.com/proto/ABC/App')).toBe(true);
  });

  it('rejects a non-Figma URL', () => {
    expect(isFigmaUrl('https://www.sketch.com/file/ABC')).toBe(false);
  });

  it('rejects a plain Figma domain without a path type', () => {
    expect(isFigmaUrl('https://figma.com/dashboard')).toBe(false);
  });
});

describe('isCsvPath', () => {
  it('accepts a .csv file path', () => {
    expect(isCsvPath('/home/user/data/urls.csv')).toBe(true);
  });

  it('accepts a .CSV (uppercase) extension', () => {
    expect(isCsvPath('C:\\Users\\user\\export.CSV')).toBe(true);
  });

  it('rejects a .json file path', () => {
    expect(isCsvPath('/data/urls.json')).toBe(false);
  });

  it('rejects an empty string', () => {
    expect(isCsvPath('')).toBe(false);
  });
});

describe('parseUrlList', () => {
  it('parses a newline-separated list of URLs', () => {
    const input = 'https://a.com\nhttps://b.com\nhttps://c.com';
    expect(parseUrlList(input)).toEqual(['https://a.com', 'https://b.com', 'https://c.com']);
  });

  it('parses a comma-separated list of URLs', () => {
    const input = 'https://a.com, https://b.com';
    expect(parseUrlList(input)).toEqual(['https://a.com', 'https://b.com']);
  });

  it('silently drops invalid URLs', () => {
    const input = 'https://valid.com\nnot-a-url\nhttps://also-valid.com';
    expect(parseUrlList(input)).toEqual(['https://valid.com', 'https://also-valid.com']);
  });

  it('returns an empty array for an empty string', () => {
    expect(parseUrlList('')).toEqual([]);
  });

  it('trims whitespace around each entry', () => {
    const input = '  https://a.com  \n  https://b.com  ';
    expect(parseUrlList(input)).toEqual(['https://a.com', 'https://b.com']);
  });
});

describe('isNonEmpty', () => {
  it('returns true for a non-empty string', () => {
    expect(isNonEmpty('hello')).toBe(true);
  });

  it('returns false for an empty string', () => {
    expect(isNonEmpty('')).toBe(false);
  });

  it('returns false for a whitespace-only string', () => {
    expect(isNonEmpty('   ')).toBe(false);
  });
});

describe('isInRange', () => {
  it('returns true when value is within range', () => {
    expect(isInRange(5, 1, 10)).toBe(true);
  });

  it('returns true for boundary values', () => {
    expect(isInRange(1, 1, 10)).toBe(true);
    expect(isInRange(10, 1, 10)).toBe(true);
  });

  it('returns false when value is below min', () => {
    expect(isInRange(0, 1, 10)).toBe(false);
  });

  it('returns false when value is above max', () => {
    expect(isInRange(11, 1, 10)).toBe(false);
  });

  it('returns false for NaN', () => {
    expect(isInRange(NaN, 0, 100)).toBe(false);
  });

  it('returns false for Infinity', () => {
    expect(isInRange(Infinity, 0, 100)).toBe(false);
  });
});
