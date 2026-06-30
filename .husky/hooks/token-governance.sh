#!/usr/bin/env sh
# Token governance gate.
#
# Runs deterministic checks when any token-pipeline file is staged.
# Blocks the commit if the pipeline is in a broken state.
#
# Checks enforced:
#   - tokens/*.json all exist and are valid JSON
#   - tokens.css has :root with --wf-* properties and correct px units
#   - No [object Object] in generated output
#   - index.css imports tokens.css first
#   - npm run build:tokens exits 0
#   - TypeScript reports no errors in token files
#
# Run manually:
#   sh .husky/hooks/token-governance.sh

CHANGED=$(git diff --cached --name-only)
TOKEN_PATTERN='^(tokens/|tailwind\.config|src/renderer/styles/|src/renderer/components/theme\.ts|style-dictionary\.config)'

if ! echo "$CHANGED" | grep -qE "$TOKEN_PATTERN"; then
  exit 0
fi

echo ""
echo "Token pipeline files staged — running governance checks..."
echo ""

if bash .claude/skills/figma-tokens/evals/checks/deterministic.sh; then
  echo ""
  echo "Token governance: all checks passed."
  echo ""
  exit 0
fi

echo ""
echo "Token governance FAILED. Fix the errors above before committing."
echo "Re-run manually: sh .husky/hooks/token-governance.sh"
echo ""
exit 1
