#!/usr/bin/env node
/**
 * macOS notarization hook — called by electron-builder via the afterSign config.
 *
 * Skips automatically when:
 *   - Building for a non-macOS target
 *   - APPLE_ID is not set (local dev builds, Windows CI runner)
 *
 * Required environment variables (injected via GitHub Secrets in CI):
 *   APPLE_ID                    — Apple ID email used for notarization
 *   APPLE_APP_SPECIFIC_PASSWORD — App-specific password for that Apple ID
 *   APPLE_TEAM_ID               — 10-character Apple Developer Team ID
 *
 * Uses Apple's notarytool (altool was deprecated Nov 2023 and removed Apr 2024).
 */

import { notarize } from '@electron/notarize';

export default async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;

  if (electronPlatformName !== 'darwin') return;
  if (!process.env.APPLE_ID) {
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = `${appOutDir}/${appName}.app`;

  await notarize({
    tool: 'notarytool',
    appPath,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID,
  });
}
