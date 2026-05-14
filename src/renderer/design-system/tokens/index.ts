export { colors, darkColors } from './colors';
export { typography } from './typography';
export type { TypographyToken } from './typography';
export { spacing } from './spacing';
export { borderRadius } from './borders';
export { shadows } from './shadows';

import { colors, darkColors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { borderRadius } from './borders';
import { shadows } from './shadows';

export const tokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};

export const darkTokens = {
  colors: darkColors,
};

export type Tokens = typeof tokens;
