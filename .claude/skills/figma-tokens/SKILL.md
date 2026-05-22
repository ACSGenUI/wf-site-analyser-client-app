---
name: figma-tokens
description: Extract design tokens from a Figma file via the REST API and sync them into Style Dictionary sources, rebuild the CSS custom properties, and update theme.ts and tailwind.config.ts.
---

## When to use this

Use in two situations:

**Fresh project** — no `tokens/` directory exists yet. This skill creates all token source files, installs Style Dictionary, wires up the build script, and imports the generated CSS into the project's stylesheet for the first time.

**Sync existing tokens** — `tokens/` already exists and the Figma designs have changed. This skill updates the token source files with new values, rebuilds the CSS custom properties, and keeps `theme.ts` and `tailwind.config.ts` in step.

Run it with the Figma file URL as the argument:

```
/figma-tokens https://www.figma.com/design/<file-id>/...
```

## What this does

Extracts raw values from the Figma node tree and syncs them into the token pipeline:

```
Figma REST API
    ↓
tokens/*.json          ← Style Dictionary source files (edit these)
    ↓
npm run build:tokens
    ↓
src/renderer/styles/tokens.css   ← auto-generated, --wf-* CSS custom properties
src/renderer/styles/index.css    ← imports tokens.css before Tailwind directives
    ↓
src/renderer/components/theme.ts         ← JS/TS values for Tailwind config
tailwind.config.ts                       ← Tailwind theme extension
```

Token files and their contents:

- `tokens/color.json` — brand primary, neutral scale, surfaces, semantic colors (success/warning/error/info), opacity variants
- `tokens/typography.json` — font family, size scale, weights, line heights (primitives only, no composite objects)
- `tokens/spacing.json` — spacing scale + layout dimensions (sidebar width, header height, content max-width)
- `tokens/border-radius.json` — sm / md / lg / xl / full radii
- `tokens/shadow.json` — sm / md / lg elevation shadows + backdrop-blur

## Steps

1. Extract the Figma file ID from the URL — it is the segment between `/design/` and the next `/`.

2. Get the Figma personal access token:
   - Check for `FIGMA_TOKEN` in any `.env` file at the project root.
   - If absent, ask the user to paste their token (Figma → Settings → Security → Personal access tokens).
   - Never log or commit the token.

3. Fetch the full file tree at depth 10 and save to `/tmp/figma_raw.json`:
   ```bash
   curl -s -H "X-Figma-Token: <TOKEN>" \
     "https://api.figma.com/v1/files/<FILE_ID>?depth=10" \
     > /tmp/figma_raw.json
   ```
   Confirm it is not an error (`jq '.error' /tmp/figma_raw.json` must be `null`). If the file is empty (no children, no styles), stop here and report it — do not overwrite existing tokens with empty data.

4. Attempt to fetch named variables (requires `file_variables:read` scope on the token):
   ```bash
   curl -s -H "X-Figma-Token: <TOKEN>" \
     "https://api.figma.com/v1/files/<FILE_ID>/variables/local" \
     > /tmp/figma_variables.json
   ```
   If `jq '.error' /tmp/figma_variables.json` is `true`, the token lacks the scope — skip this and derive tokens from the node tree instead. If it succeeds, prefer the variable names and values from this response as they are the designer's explicit token intent.

5. Run the extraction script to mine raw values from the node tree.
   Save the following to `/tmp/figma_extract.js` and run with `node /tmp/figma_extract.js`:
   ```js
   const fs = require('fs');
   const data = JSON.parse(fs.readFileSync('/tmp/figma_raw.json', 'utf8'));

   const colors = {}, typography = {}, spacing = {}, effects = {}, radii = {};

   function toHex(r, g, b) {
     return '#' + [r, g, b].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
   }

   function traverse(node, path = '') {
     const key = [path, node.name || ''].filter(Boolean).join('/');

     for (const fill of (node.fills || [])) {
       if (fill.type === 'SOLID' && fill.color) {
         const c = fill.color;
         colors[key] = { hex: toHex(c.r, c.g, c.b), opacity: fill.opacity ?? 1 };
       }
     }

     if (node.type === 'TEXT') {
       const s = node.style || {};
       if (s.fontFamily)
         typography[key] = { family: s.fontFamily, size: s.fontSize, weight: s.fontWeight };
     }

     if (node.layoutMode === 'HORIZONTAL' || node.layoutMode === 'VERTICAL')
       spacing[key] = { paddingTop: node.paddingTop, paddingBottom: node.paddingBottom,
                        paddingLeft: node.paddingLeft, paddingRight: node.paddingRight,
                        itemSpacing: node.itemSpacing };

     const cr = node.cornerRadius;
     if (cr && cr > 0) radii[key] = cr;

     for (const e of (node.effects || [])) {
       if (e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW') {
         const c = e.color || {};
         effects[key] = { type: e.type, hex: toHex(c.r ?? 0, c.g ?? 0, c.b ?? 0),
                          opacity: c.a ?? 1, offset: e.offset || {}, radius: e.radius || 0 };
       }
     }

     for (const child of (node.children || [])) traverse(child, key);
   }

   traverse(data.document);

   const uniqueColors = {};
   for (const [k, v] of Object.entries(colors)) {
     const tag = v.opacity < 1 ? `${v.hex}/${v.opacity.toFixed(2)}` : v.hex;
     if (!uniqueColors[tag]) uniqueColors[tag] = { ...v, example: k };
   }

   console.log('UNIQUE COLORS:');
   for (const [, v] of Object.entries(uniqueColors).sort())
     console.log(`  ${v.hex}  opacity=${v.opacity.toFixed(2)}  — ${v.example.slice(0, 80)}`);

   console.log('\nTYPOGRAPHY (first 20):');
   Object.entries(typography).slice(0, 20).forEach(([k, v]) =>
     console.log(`  ${v.family}  ${v.size}px  w${v.weight}  — ${k.slice(0, 80)}`));

   console.log(`\nCORNER RADII: [${[...new Set(Object.values(radii))].sort((a, b) => a - b).join(', ')}]`);

   console.log('\nSHADOWS (first 5):');
   Object.entries(effects).slice(0, 5).forEach(([, v]) =>
     console.log(`  ${v.type}  ${v.hex}  blur=${v.radius}  offset=${JSON.stringify(v.offset)}`));
   ```

   From the output, identify:
   - Brand / primary color (dominant interactive blue)
   - Neutral grays (backgrounds, surfaces, borders, text shades)
   - Semantic colors (success greens, warning ambers, error reds, info blues)
   - Accent colors (Figma purple, CSV orange, etc.)
   - Surface aliases (page bg, card, sidebar, header)
   - Opacity variants (frosted-glass whites, overlay blacks)

6. Read every file in `tokens/` before editing. Claude Code requires a prior read before any edit call.

7. Update `tokens/color.json` with the extracted hex values. Keep the existing structure — update values that changed, add new semantic groups if needed.

8. Update `tokens/typography.json` — font family, size scale, weights, and line heights. Values must include the `px` unit (e.g. `"14px"`). Do not add composite objects (fontFamily + fontSize combined) — they serialize as `[object Object]` in CSS output.

9. Update `tokens/spacing.json` — spacing scale and layout dimensions. Values must include the `px` unit.

10. Update `tokens/border-radius.json` — map Figma corner radii to the sm / md / lg / xl / full scale. Values must include the `px` unit. Map `9999` to `full`.

11. Update `tokens/shadow.json` — map DROP_SHADOW effects to sm / md / lg elevation levels.

12. Build the tokens:
    ```bash
    npm run build:tokens
    ```
    The build must complete with zero errors.

13. Verify `src/renderer/styles/tokens.css` was regenerated:
    - All `--wf-*` properties are under `:root`
    - Spacing and border-radius values end in `px`
    - Font sizes end in `px`
    - Colors are valid hex or `rgba(...)` values

14. Confirm `src/renderer/styles/index.css` has `@import './tokens.css';` as its first line. Add it if missing.

15. Update `src/renderer/components/theme.ts` with values that changed. Read the file first, then update each field:
    - `colors.primary` — brand primary hex
    - `colors.neutral[50..950]` — full neutral scale
    - `colors.success / warning / error` — semantic colors
    - `typography.h1..h4, body, caption, small` — font sizes and line heights
    - `borderRadius.input / card / modal / full` — from corner radii
    - `shadows.subtle / medium` — from shadow effects

16. Update `tailwind.config.ts` — update any hardcoded hex values that changed. Do not remove existing aliases.

## Hard rules

- **Never log or commit the Figma personal access token.** Do not echo it to the terminal or include it in any file.
- **Never edit `src/renderer/styles/tokens.css` directly.** It is auto-generated by `npm run build:tokens` — all changes must go through `tokens/*.json`.
- **Never remove a CSS variable** unless the corresponding token was intentionally deleted from `tokens/*.json`. Missing variables silently break any component that references them.
- **Always include `px` units** in spacing, border-radius, and font-size token values. Bare numbers cause Style Dictionary to output unit-less CSS values, which are invalid.
- **Never add composite typography objects** (fontFamily + fontSize + fontWeight as a single value). Style Dictionary cannot serialize them as CSS custom properties and outputs `[object Object]`.
- **Never overwrite tokens when the Figma file is empty.** If the node tree has no children and no styles, stop after step 3 and report it.

## Definition of done

- `npm run build:tokens` completes with zero errors
- `src/renderer/styles/tokens.css` contains correct `--wf-*` CSS custom properties with proper units
- `src/renderer/styles/index.css` imports `tokens.css` before the Tailwind directives
- `npx tsc --noEmit 2>&1 | grep -E "(theme|tailwind|tokens)"` returns no output
- A summary lists which token groups changed and flags any tokens present in the project but absent from the new Figma file
