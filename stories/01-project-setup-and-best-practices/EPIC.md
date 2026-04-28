# Epic 01: Project Setup & Best Practices

## Overview
Establish the foundational Electron + React application architecture, tooling, design system, and engineering standards before feature development begins. This epic ensures a consistent, maintainable, and high-quality codebase from day one.

## Figma Reference
- N/A — This is an engineering-only epic with no direct Figma screen.

## Stories
| ID | Story | Priority |
|----|-------|----------|
| SA-101 | [Electron App Scaffolding](./SA-101-electron-app-scaffolding.md) | P0 |
| SA-102 | [Design System & Component Library](./SA-102-design-system-and-component-library.md) | P0 |
| SA-103 | [Routing & Navigation Architecture](./SA-103-routing-and-navigation-architecture.md) | P0 |
| SA-104 | [State Management & Data Layer](./SA-104-state-management-and-data-layer.md) | P0 |
| SA-105 | [Build, Packaging & Distribution](./SA-105-build-packaging-and-distribution.md) | P0 |
| SA-106 | [Code Quality & Linting Standards](./SA-106-code-quality-and-linting-standards.md) | P0 |
| SA-107 | [Testing Framework & Strategy](./SA-107-testing-framework-and-strategy.md) | P1 |

## Acceptance Criteria (Epic-level)
- Electron app launches on both macOS and Windows from a single codebase
- Component library with design tokens matches the Figma design system
- Routing supports all planned screens with lazy loading
- State management handles local persistence, real-time updates, and form state
- Build pipeline produces signed, distributable installers for both platforms
- ESLint, Prettier, TypeScript strict mode, and commit hooks enforced
- Test infrastructure is in place with baseline coverage targets

## Dependencies
- Node.js LTS, Electron latest stable
- React 19, TypeScript 5+
- Figma design tokens export (Epic 03–08 reference designs)
