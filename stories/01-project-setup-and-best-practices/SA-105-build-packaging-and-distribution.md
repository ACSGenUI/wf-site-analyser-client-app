# SA-105: Build, Packaging & Distribution

## User Story
**As a** release engineer,
**I want** the app to build into signed, distributable installers for macOS and Windows,
**so that** we can ship production-ready updates to users.

## Priority
P0 — Critical Path (Sprint 1)

## Acceptance Criteria
- [ ] `npm run build` produces a production-optimized bundle (minified, tree-shaken)
- [ ] `npm run package` creates platform-specific installers:
  - macOS: `.dmg` installer (Universal binary for Intel + Apple Silicon)
  - Windows: `.exe` installer (NSIS or Squirrel)
- [ ] Code signing is configured (certificates referenced via env vars, not committed)
- [ ] Auto-updater integration point is stubbed (activate in Epic 02)
- [ ] App metadata is set: name, version, description, icons, bundle ID
- [ ] Custom app icon renders correctly on both platforms (dock/taskbar, installer, About)
- [ ] Build artifacts are deterministic and reproducible
- [ ] CI pipeline configuration is stubbed (GitHub Actions or equivalent)

## Technical Notes
- Use Electron Forge or electron-builder — choose one and document the decision
- Signing:
  - macOS: Apple Developer ID certificate, notarization via `@electron/notarize`
  - Windows: EV code signing certificate (or self-signed for dev)
- Version management: use `package.json` version as single source of truth
- Auto-updater: configure `electron-updater` or Electron's built-in `autoUpdater` (stub for now)
- Build matrix: configure CI to build on macOS runner (for dmg) and Windows runner (for exe)
- Ensure `asar` packaging is enabled and `node_modules` are pruned in production
- Built as a React functional component with TypeScript props, styled with **Tailwind CSS** utility classes
- Test with **Vitest** + **React Testing Library** (`@testing-library/react`)

## Definition of Done
- [ ] `npm run package` completes without errors on at least one platform
- [ ] Installer runs and the app launches from the installed location
- [ ] App icon, name, and version are correct in the About dialog and OS chrome
- [ ] Build time is documented for baseline tracking

## Test Cases

**Test File**: `src/renderer/__tests__/setup/build-packaging.test.ts`

| # | Test Case | Type | Description |
|---|-----------|------|-------------|
| TC-01 | Build produces optimized bundle | Integration | `npm run build` generates a minified, tree-shaken production bundle |
| TC-02 | App metadata is correct | Unit | Built artifact contains correct name, version, description, and bundle ID |
| TC-03 | Asar packaging is enabled | Integration | Production build uses asar packaging with pruned node_modules |
| TC-04 | Version matches package.json | Unit | App version in build output matches the version field in `package.json` |
