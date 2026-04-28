/**
 * SA-102: Design System — Design Tokens
 *
 * Single source of truth for all design tokens.
 * Values align with the Adobe enterprise aesthetic from the Figma designs.
 * Consumed by Tailwind config and components.
 */

export interface TypographyToken {
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
}

export interface Tokens {
  colors: {
    primary: string;
    neutral: Record<string, string>;
    success: string;
    warning: string;
    error: string;
  };
  typography: {
    h1: TypographyToken;
    h2: TypographyToken;
    h3: TypographyToken;
    h4: TypographyToken;
    body: TypographyToken;
    caption: TypographyToken;
    small: TypographyToken;
  };
  spacing: Record<number, string>;
  borderRadius: {
    input: string;
    card: string;
    modal: string;
    full: string;
  };
  shadows: {
    subtle: string;
    medium: string;
    none: string;
  };
}

export const tokens: Tokens = {
  colors: {
    primary: '#0265DC',
    neutral: {
      50: '#F8F9FA',
      100: '#F3F4F5',
      200: '#EDEEEF',
      300: '#E1E3E4',
      400: '#CBD5E1',
      500: '#94A3B8',
      600: '#6B7280',
      700: '#424754',
      800: '#191C1D',
      900: '#0F172A',
      950: '#000000',
    },
    success: '#10B981',
    warning: '#F59E0B',
    error: '#BA1A1A',
  },
  typography: {
    h1: { fontSize: '34px', lineHeight: '42px', fontWeight: 700 },
    h2: { fontSize: '28px', lineHeight: '36px', fontWeight: 600 },
    h3: { fontSize: '24px', lineHeight: '32px', fontWeight: 600 },
    h4: { fontSize: '20px', lineHeight: '28px', fontWeight: 600 },
    body: { fontSize: '16px', lineHeight: '24px', fontWeight: 400 },
    caption: { fontSize: '14px', lineHeight: '20px', fontWeight: 400 },
    small: { fontSize: '12px', lineHeight: '16px', fontWeight: 400 },
  },
  spacing: {
    4: '4px',
    8: '8px',
    12: '12px',
    16: '16px',
    24: '24px',
    32: '32px',
    48: '48px',
  },
  borderRadius: {
    input: '4px',
    card: '8px',
    modal: '12px',
    full: '9999px',
  },
  shadows: {
    subtle: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)',
    none: 'none',
  },
};

/**
 * Dark mode token set — stubbed for structure.
 * Overrides light tokens with dark-theme-appropriate values.
 * Full implementation will be completed in a future story.
 */
export const darkTokens: Pick<Tokens, 'colors'> = {
  colors: {
    primary: '#3B82F6',
    neutral: {
      50: '#000000',
      100: '#0F172A',
      200: '#191C1D',
      300: '#424754',
      400: '#6B7280',
      500: '#94A3B8',
      600: '#CBD5E1',
      700: '#E1E3E4',
      800: '#EDEEEF',
      900: '#F3F4F5',
      950: '#F8F9FA',
    },
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
  },
};
