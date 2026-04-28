# SA-107: Testing Framework & Strategy

## User Story
**As a** developer,
**I want** a testing framework and baseline test infrastructure in place,
**so that** we can write unit, component, and integration tests as features are built.

## Priority
P1 — High (Sprint 1–2)

## Acceptance Criteria
- [ ] **Unit testing**: Vitest configured for utility functions and business logic
- [ ] **Component testing**: React Testing Library configured for renderer components
- [ ] **E2E testing**: Playwright or Spectron configured for Electron app-level tests (stub)
- [ ] **Coverage**: Coverage reporting enabled with baseline thresholds (≥70% for utils, ≥50% for components)
- [ ] Test scripts: `npm run test`, `npm run test:watch`, `npm run test:coverage`, `npm run test:e2e`
- [ ] CI integration: Tests run on every push/PR (stub CI config)
- [ ] At least one example test per category (unit, component, e2e) exists as a template
- [ ] Mock utilities are set up for: IPC calls, Electron APIs, network requests

## Technical Notes
- **Vitest**: Fast, Vite-native, compatible with Jest API — ideal for this stack
- **React Testing Library**: `@testing-library/react` + `@testing-library/user-event`
- **Electron mocks**: Create `__mocks__/electron.ts` for `ipcRenderer`, `contextBridge`, etc.
- **IPC mocking**: Mock the `window.api` object exposed by preload for component tests
- **E2E**: Playwright with Electron support (`@playwright/test` + `electron.launch()`)
- Testing strategy by layer:

| Layer | Tool | What to Test |
|-------|------|-------------|
| Shared utils | Vitest | Pure functions, validators, formatters |
| React components | RTL + Vitest | Render, user interaction, state changes |
| IPC handlers | Vitest | Main process handlers with mocked Electron APIs |
| Full app flows | Playwright | Navigation, form submission, end-to-end scenarios |

- Coverage config in `vitest.config.ts`:

```typescript
test: {
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html', 'lcov'],
    thresholds: { statements: 50, branches: 50, functions: 50, lines: 50 },
  },
}
```

- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Definition of Done
- [ ] `npm run test` passes with sample tests
- [ ] Coverage report generates and shows percentages
- [ ] Component test renders a component and asserts on output
- [ ] E2E test launches the Electron app and verifies the window title
- [ ] Testing conventions are documented in `CONTRIBUTING.md` or project README

## Test Cases

**Test File**: `src/renderer/__tests__/setup/testing-framework.test.ts`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Vitest runs sample test | Unit | A sample Vitest unit test executes and passes successfully |
| TC-02 | RTL renders component | Unit | React Testing Library renders a component and asserts on DOM output |
| TC-03 | Coverage report generates | Integration | Running `npm run test:coverage` produces an HTML/text coverage report |
| TC-04 | IPC mocks work | Unit | Mocked `window.api` object intercepts IPC calls in component tests |
| TC-05 | E2E launches Electron window | E2E | Playwright launches the Electron app and verifies the window title |
