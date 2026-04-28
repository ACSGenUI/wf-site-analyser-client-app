# SA-102: Design System & Component Library

## User Story
**As a** developer,
**I want** a shared component library with design tokens matching the Figma designs,
**so that** all screens are built with consistent typography, colors, spacing, and components.

## Priority
P0 — Critical Path (Sprint 1)

## Figma Reference
- Visual style defined across all 7 Figma screens (Adobe enterprise aesthetic)

## Design Specifications
- **Color tokens**: Primary blue (#0265DC approx.), neutral grays, success green, warning amber, error red
- **Typography scale**: H1 (32–36px), H2 (28px), H3 (24px), H4 (20px), Body (16px), Caption (14px), Small (12px)
- **Spacing scale**: 4px base unit — 4, 8, 12, 16, 24, 32, 48px
- **Border radius**: 4px (inputs), 8px (cards), 12px (modals), full (avatars/badges)
- **Shadows**: subtle (cards), medium (modals), none (flat elements)
- **Component inventory** (from Figma):
  - Buttons: Primary (filled), Secondary (outlined), Ghost (text-only), Icon-only
  - Inputs: Text, Password/Secure, Textarea, Select/Dropdown, Toggle, Segmented control
  - Cards: Content card, Stat card, Info card, Action card
  - Badges: Status badge, Count badge, Label badge
  - Navigation: Sidebar nav item, Header bar, Breadcrumb, Tab bar
  - Data: Table, List item, Chip/Tag
  - Feedback: Toast, Progress bar, Spinner, Empty state, Error state
  - Overlays: Modal, Drawer, Tooltip, Dropdown menu

## Acceptance Criteria
- [ ] Design tokens are defined as CSS custom properties and/or a theme object
- [ ] Tokens are exported from a single source of truth (`theme.ts` or `tokens.css`)
- [ ] Base components are implemented: Button, Input, Card, Badge, Toggle, Select, Table, Modal, Drawer, Toast
- [ ] Each component supports required variants (e.g., Button: primary, secondary, ghost, disabled, loading)
- [ ] Components are typed with TypeScript props interfaces
- [ ] A Storybook (or equivalent) catalog is set up for component development and review
- [ ] Components match the Figma design language: clean borders, subtle shadows, enterprise aesthetic
- [ ] Dark mode token set is stubbed (not fully implemented yet, but structure supports it)

## Technical Notes
- Use **Tailwind CSS** with custom design tokens in `tailwind.config.ts`; enforce consistently
- Extend Tailwind config with custom design tokens; prefer utility classes over `@apply`
- Use Tailwind config (`tailwind.config.ts`) + CSS custom properties for design tokens
- Use **Radix UI** primitives with **Tailwind CSS** styling for accessible primitives (focus management, ARIA)
- Set up Storybook with `@storybook/react-vite` for fast dev cycle
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Definition of Done
- [ ] All base components render correctly with all variant states
- [ ] Storybook runs with at least the top 10 components documented
- [ ] Visual regression baseline captured (optional: Chromatic or Percy)
- [ ] Accessibility: all interactive components are keyboard-navigable and have ARIA attributes

## Test Cases

**Test File**: `src/renderer/__tests__/components/design-system.test.tsx`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Design tokens are defined | Unit | CSS custom properties and theme object export all required color, typography, and spacing tokens |
| TC-02 | Button renders all variants | Unit | Button component renders primary, secondary, ghost, disabled, and loading states correctly |
| TC-03 | Input renders all states | Unit | Input component renders default, focused, error, and disabled states with proper styling |
| TC-04 | Components are keyboard-navigable | Integration | All interactive components can be focused and activated via keyboard (Tab, Enter, Space) |
| TC-05 | Storybook catalog renders | E2E | Storybook dev server launches and renders stories for the top 10 base components |
| TC-06 | Dark mode token set is stubbed | Unit | Theme structure includes a dark mode token set placeholder that does not break rendering |
