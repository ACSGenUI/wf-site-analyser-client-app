# SA-106: Code Quality & Linting Standards

## User Story
**As a** team lead,
**I want** enforced code quality standards from day one,
**so that** the codebase stays clean, consistent, and maintainable as the team scales.

## Priority
P0 — Critical Path (Sprint 1)

## Acceptance Criteria
- [ ] **TypeScript**: Strict mode enabled (`strict: true`, `noUncheckedIndexedAccess`, `noImplicitReturns`)
- [ ] **ESLint**: Configured with recommended rules + React + TypeScript + import ordering
- [ ] **Prettier**: Configured for consistent formatting (2-space indent, single quotes, trailing commas)
- [ ] **Husky + lint-staged**: Pre-commit hook runs lint + format on staged files
- [ ] **Commitlint**: Enforces conventional commits format (`feat:`, `fix:`, `chore:`, etc.)
- [ ] **EditorConfig**: Consistent settings across IDEs (indent, charset, EOL)
- [ ] `.gitignore` excludes: `node_modules`, `dist`, `out`, `.env`, `.DS_Store`, build artifacts
- [ ] No `any` types allowed — `unknown` with type guards required instead
- [ ] Import ordering enforced: external → internal → relative, with blank line separators
- [ ] PR template exists with checklist: description, testing, screenshots, breaking changes

## Technical Notes
- ESLint config: extend `@typescript-eslint/recommended`, `eslint-plugin-react-hooks`, `eslint-plugin-import`
- Prettier config: `{ semi: true, singleQuote: true, trailingComma: 'all', printWidth: 100 }`
- Husky setup: `npx husky init` → configure `.husky/pre-commit` to run `npx lint-staged`
- lint-staged config: `{ "*.{ts,tsx}": ["eslint --fix", "prettier --write"], "*.{json,md,css}": ["prettier --write"] }`
- Consider `knip` for detecting unused exports and dead code
- Add `npm run lint`, `npm run format`, `npm run typecheck` scripts to `package.json`
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Definition of Done
- [ ] `npm run lint` passes with zero warnings on the entire codebase
- [ ] `npm run typecheck` passes with zero errors
- [ ] Committing poorly formatted code is blocked by the pre-commit hook
- [ ] Commit messages not following conventional format are rejected
- [ ] A new developer can set up the project and pass all checks within 15 minutes

## Test Cases

**Test File**: `src/renderer/__tests__/setup/code-quality.test.ts`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | ESLint passes with zero warnings | Integration | Running `npm run lint` on the entire codebase produces no errors or warnings |
| TC-02 | TypeScript strict mode compiles | Integration | `npm run typecheck` passes with strict mode and all strict flags enabled |
| TC-03 | Prettier format check passes | Integration | All source files conform to Prettier formatting rules without modifications |
| TC-04 | No `any` types in codebase | Unit | Static analysis confirms no `any` type annotations exist in TypeScript source files |
| TC-05 | Pre-commit hook blocks bad code | E2E | Attempting to commit unformatted code is rejected by the Husky pre-commit hook |
