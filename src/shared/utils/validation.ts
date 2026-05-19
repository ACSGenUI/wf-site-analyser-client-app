/**
 * Returns true if the string is a valid HTTP/HTTPS URL.
 */
export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Returns true if the string is a valid Figma file or prototype URL.
 */
export function isFigmaUrl(value: string): boolean {
  return /^https:\/\/(www\.)?figma\.com\/(file|proto|design)\//.test(value);
}

/**
 * Returns true if the string has a .csv file extension.
 */
export function isCsvPath(value: string): boolean {
  return value.trim().toLowerCase().endsWith('.csv');
}

/**
 * Parses a newline- or comma-separated list of URLs and returns valid ones.
 * Invalid entries are silently dropped.
 */
export function parseUrlList(raw: string): string[] {
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && isValidUrl(s));
}

/**
 * Returns true if the value is a non-empty string after trimming whitespace.
 */
export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Returns true if `n` is a finite integer within the inclusive range [min, max].
 */
export function isInRange(n: number, min: number, max: number): boolean {
  return Number.isFinite(n) && n >= min && n <= max;
}
