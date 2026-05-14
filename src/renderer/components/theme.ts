/**
 * SA-102: Design System — backwards-compat re-export shim.
 *
 * Tokens live in `src/renderer/design-system/tokens/`.
 * Import directly from there in new code, or use this path for
 * existing imports that already reference `@/components/theme`.
 */
export { tokens, darkTokens } from '../design-system/tokens';
export type { Tokens, TypographyToken } from '../design-system/tokens';
