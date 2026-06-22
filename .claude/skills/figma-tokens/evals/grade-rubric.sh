#!/usr/bin/env bash
# Model-assisted rubric grader for figma-tokens skill output.
# Requires the Claude Code CLI (`claude`) to be available.
# Sends current token file contents to Claude and receives structured JSON.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"

TOKENS_CSS="$PROJECT_ROOT/src/renderer/styles/tokens.css"
COLOR_JSON="$PROJECT_ROOT/tokens/color.json"
TYPOGRAPHY_JSON="$PROJECT_ROOT/tokens/typography.json"
THEME_TS="$PROJECT_ROOT/src/renderer/components/theme.ts"
SCHEMA_FILE="$SCRIPT_DIR/rubric-schema.json"

if ! command -v claude &>/dev/null; then
  echo "  ⚠  'claude' CLI not found — skipping rubric grader."
  echo "     Install Claude Code or set PATH to include the claude binary."
  exit 0
fi

echo "── Rubric grader (model-assisted) ───────────────────────────"

PROMPT=$(cat <<PROMPT
You are grading the output of a design-token sync skill for a React/Tailwind project.
Respond ONLY with valid JSON that matches the schema below. No markdown, no explanation.

Schema:
$(cat "$SCHEMA_FILE")

Evaluate the following files against each rubric check:

=== tokens.css (first 80 lines) ===
$(head -80 "$TOKENS_CSS")

=== tokens/color.json ===
$(cat "$COLOR_JSON")

=== tokens/typography.json ===
$(cat "$TYPOGRAPHY_JSON")

=== src/renderer/components/theme.ts ===
$(cat "$THEME_TS")

Rubric checks (name each entry with these exact names):
1. "color_values_valid"     — Every --wf-color-* value is a valid hex (#rrggbb) or rgba(...). No "undefined", no bare numbers.
2. "spacing_has_px"         — Every --wf-spacing-* and --wf-border-radius-* value ends in "px" (9999px is acceptable for full).
3. "typography_no_composite"— No --wf-font-* value contains "[object Object]".
4. "semantic_groups_present"— color.json contains all four groups: success, warning, error, info.
5. "theme_primary_matches"  — theme.ts colors.primary value matches color.json color.primary.default.value (case-insensitive hex comparison).
6. "no_token_leaked"        — No string matching /figd_[A-Za-z0-9_-]{30,}/ or /fig_[A-Za-z0-9_-]{20,}/ appears in any evaluated file.

Score = (checks_passed / 6) * 100.
PROMPT
)

echo ""
RAW=$(echo "$PROMPT" | claude --print --output-format text 2>/dev/null)

# Extract the JSON block from the response
JSON=$(echo "$RAW" | node -e "
const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  const text = chunks.join('');
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try { process.stdout.write(JSON.stringify(JSON.parse(match[0]), null, 2)); }
    catch { process.stdout.write(text); }
  } else { process.stdout.write(text); }
});
" 2>/dev/null)

if [ -z "$JSON" ]; then
  echo "  ⚠  No JSON response from grader. Raw output:"
  echo "$RAW" | head -20
  exit 1
fi

echo "$JSON"

# Parse overall_pass and score for summary
PASS=$(echo "$JSON" | node -e "
const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  try { const d = JSON.parse(chunks.join('')); console.log(d.overall_pass ? 'true' : 'false'); }
  catch { console.log('false'); }
});
" 2>/dev/null)
SCORE=$(echo "$JSON" | node -e "
const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  try { const d = JSON.parse(chunks.join('')); console.log(d.score ?? 0); }
  catch { console.log(0); }
});
" 2>/dev/null)

echo ""
echo "  Overall pass : $PASS"
echo "  Score        : $SCORE / 100"
echo ""

[[ "$PASS" == "true" ]]
