#!/usr/bin/env node
'use strict';
/**
 * Fixture-based test for the figma-tokens extraction logic.
 *
 * Runs the extraction script from SKILL.md against a known Figma stub
 * and asserts the output matches expected values. No credentials required.
 */

const fs   = require('fs');
const path = require('path');

// ── Extraction logic (mirrored from SKILL.md step 5) ──────────────────────────

function toHex(r, g, b) {
  return '#' + [r, g, b]
    .map(v => Math.round(v * 255).toString(16).padStart(2, '0'))
    .join('');
}

const colors = {}, typography = {}, spacing = {}, effects = {}, radii = {};

function traverse(node, pathStr = '') {
  const name = node.name || '';
  const key  = [pathStr, name].filter(Boolean).join('/');

  for (const fill of (node.fills || [])) {
    if (fill.type === 'SOLID' && fill.color) {
      const c = fill.color;
      colors[key] = { hex: toHex(c.r, c.g, c.b), opacity: fill.opacity ?? 1 };
    }
  }

  if (node.type === 'TEXT') {
    const s = node.style || {};
    if (s.fontFamily) {
      typography[key] = { family: s.fontFamily, size: s.fontSize, weight: s.fontWeight };
    }
  }

  if (node.layoutMode === 'HORIZONTAL' || node.layoutMode === 'VERTICAL') {
    spacing[key] = {
      paddingTop:    node.paddingTop,
      paddingBottom: node.paddingBottom,
      paddingLeft:   node.paddingLeft,
      paddingRight:  node.paddingRight,
      itemSpacing:   node.itemSpacing,
    };
  }

  const cr = node.cornerRadius;
  if (cr && cr > 0) radii[key] = cr;

  for (const e of (node.effects || [])) {
    if (e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW') {
      const c = e.color || {};
      effects[key] = {
        type:    e.type,
        hex:     toHex(c.r ?? 0, c.g ?? 0, c.b ?? 0),
        opacity: c.a ?? 1,
        offset:  e.offset || {},
        radius:  e.radius || 0,
      };
    }
  }

  for (const child of (node.children || [])) traverse(child, key);
}

// ── Load fixture ───────────────────────────────────────────────────────────────

const fixturePath = path.join(__dirname, '..', 'fixtures', 'figma-stub.json');
const data = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
traverse(data.document);

// ── Assertions ─────────────────────────────────────────────────────────────────

const errors = [];

const assertGte = (label, actual, min) => {
  if (actual < min) errors.push(`${label}: expected >= ${min}, got ${actual}`);
};
const assertIn = (label, needle, set) => {
  if (!set.has(needle)) errors.push(`${label}: ${needle} not in [${[...set].join(', ')}]`);
};
const assertEquals = (label, actual, expected) => {
  if (actual !== expected) errors.push(`${label}: expected ${expected}, got ${actual}`);
};
const assertTrue = (label, cond) => {
  if (!cond) errors.push(label);
};

// Colors — minimum 7 fills
assertGte('colors count', Object.keys(colors).length, 7);

for (const [k, v] of Object.entries(colors)) {
  assertTrue(
    `color '${k}' hex format invalid: ${v.hex}`,
    v.hex.startsWith('#') && v.hex.length === 7
  );
}

for (const sem of ['Success/Default', 'Warning/Default', 'Error/Default', 'Info/Default']) {
  assertTrue(`semantic color '${sem}' found`, Object.keys(colors).some(k => k.endsWith(sem)));
}

// Typography — 5 text nodes
assertGte('typography count', Object.keys(typography).length, 5);

const families = new Set(Object.values(typography).map(v => v.family));
assertTrue("font family 'Inter' present", families.has('Inter'));

const sizes = new Set(Object.values(typography).map(v => v.size));
assertIn('font size 48 (H1) present', 48, sizes);
assertIn('font size 14 (body) present', 14, sizes);
assertIn('font size 12 (caption) present', 12, sizes);

// Spacing — 2 layout frames
assertGte('spacing count', Object.keys(spacing).length, 2);
const cardEntries = Object.entries(spacing).filter(([k]) => k.includes('Card'));
assertGte('Spacing/Card layout frame found', cardEntries.length, 1);
if (cardEntries.length > 0) {
  const card = cardEntries[0][1];
  assertEquals('Card paddingLeft',  card.paddingLeft,  24);
  assertEquals('Card paddingTop',   card.paddingTop,   16);
  assertEquals('Card itemSpacing',  card.itemSpacing,  12);
}

// Corner radii — 4 nodes
assertGte('radii count', Object.keys(radii).length, 4);
const radiusValues = new Set(Object.values(radii));
assertIn('cornerRadius 4 (sm) present',    4,    radiusValues);
assertIn('cornerRadius 8 (md) present',    8,    radiusValues);
assertIn('cornerRadius 12 (lg) present',   12,   radiusValues);
assertIn('cornerRadius 9999 (full) present', 9999, radiusValues);

// Shadows — 2 drop shadows
assertGte('effects count', Object.keys(effects).length, 2);
for (const [k, v] of Object.entries(effects)) {
  assertEquals(`effect '${k}' type is DROP_SHADOW`, v.type, 'DROP_SHADOW');
  assertTrue(
    `effect '${k}' hex format valid: ${v.hex}`,
    v.hex.startsWith('#') && v.hex.length === 7
  );
}

// Variables error fixture
const varsPath = path.join(__dirname, '..', 'fixtures', 'figma-variables-error.json');
const varsData = JSON.parse(fs.readFileSync(varsPath, 'utf8'));
assertEquals('variables error fixture has error:true', varsData.error, true);

// ── Report ─────────────────────────────────────────────────────────────────────

if (errors.length > 0) {
  console.error('\n── Extraction test FAILED ────────────────────────────────────');
  errors.forEach(e => console.error(`  ✗ ${e}`));
  process.exit(1);
}

console.log('── Extraction test PASSED ────────────────────────────────────');
console.log(`  ✓ ${Object.keys(colors).length} colors extracted (all valid hex)`);
console.log(`  ✓ ${Object.keys(typography).length} text nodes (Inter, sizes: [${[...sizes].sort((a, b) => a - b).join(', ')}])`);
console.log(`  ✓ ${Object.keys(spacing).length} spacing frames`);
console.log(`  ✓ ${Object.keys(radii).length} corner radii: [${[...radiusValues].sort((a, b) => a - b).join(', ')}]`);
console.log(`  ✓ ${Object.keys(effects).length} shadow effects`);
console.log(`  ✓ variables-error fixture is valid JSON with error:true`);
