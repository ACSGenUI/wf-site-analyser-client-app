import type { Config } from 'tailwindcss';
import { tokens } from './src/renderer/design-system/tokens';

export default {
  content: ['./src/renderer/**/*.{ts,tsx,html}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: tokens.colors.primary,
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: tokens.colors.primary,
          700: '#1D4ED8',
          800: '#004EAD',
          900: '#0C3877',
          950: '#082349',
        },
        neutral: {
          50: tokens.colors.neutral[50],
          100: tokens.colors.neutral[100],
          200: tokens.colors.neutral[200],
          300: tokens.colors.neutral[300],
          400: tokens.colors.neutral[400],
          500: tokens.colors.neutral[500],
          600: tokens.colors.neutral[600],
          700: tokens.colors.neutral[700],
          800: tokens.colors.neutral[800],
          900: tokens.colors.neutral[900],
          950: tokens.colors.neutral[950],
        },
        success: tokens.colors.success,
        warning: tokens.colors.warning,
        error: tokens.colors.error,
      },
      borderRadius: {
        input: tokens.borderRadius.input,
        card: tokens.borderRadius.card,
        modal: tokens.borderRadius.modal,
        full: tokens.borderRadius.full,
      },
      boxShadow: {
        subtle: tokens.shadows.subtle,
        medium: tokens.shadows.medium,
      },
      fontSize: {
        h1: [tokens.typography.h1.fontSize, { lineHeight: tokens.typography.h1.lineHeight, fontWeight: String(tokens.typography.h1.fontWeight) }],
        h2: [tokens.typography.h2.fontSize, { lineHeight: tokens.typography.h2.lineHeight, fontWeight: String(tokens.typography.h2.fontWeight) }],
        h3: [tokens.typography.h3.fontSize, { lineHeight: tokens.typography.h3.lineHeight, fontWeight: String(tokens.typography.h3.fontWeight) }],
        h4: [tokens.typography.h4.fontSize, { lineHeight: tokens.typography.h4.lineHeight, fontWeight: String(tokens.typography.h4.fontWeight) }],
        body: [tokens.typography.body.fontSize, { lineHeight: tokens.typography.body.lineHeight }],
        caption: [tokens.typography.caption.fontSize, { lineHeight: tokens.typography.caption.lineHeight }],
        small: [tokens.typography.small.fontSize, { lineHeight: tokens.typography.small.lineHeight }],
      },
      fontFamily: {
        sans: tokens.fontFamilies.sans,
        mono: tokens.fontFamilies.mono,
      },
      spacing: {
        4.5: '18px',
        13: '52px',
        15: '60px',
      },
    },
  },
  plugins: [],
} satisfies Config;
