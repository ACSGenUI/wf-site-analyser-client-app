#!/usr/bin/env bash
# Eval runner for figma-tokens skill.
#
# Usage:
#   ./run.sh              — deterministic + fixture checks (no credentials)
#   ./run.sh --rubric     — also run model-assisted rubric grader (needs claude CLI)
#
# Exit 0 = all checks passed. Exit 1 = one or more failures.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RUN_RUBRIC=false

for arg in "$@"; do
  [[ "$arg" == "--rubric" ]] && RUN_RUBRIC=true
done

overall_pass=true

run_step() {
  local label="$1"
  local cmd="$2"
  echo ""
  echo "════════════════════════════════════════════════════════════"
  echo "  $label"
  echo "════════════════════════════════════════════════════════════"
  if bash -c "$cmd"; then
    echo ""
    echo "  ✓ $label passed"
  else
    echo ""
    echo "  ✗ $label FAILED"
    overall_pass=false
  fi
}

# ── Prerequisites ─────────────────────────────────────────────────
echo ""
echo "Checking prerequisites..."
missing=()
command -v jq   &>/dev/null || missing+=("jq")
command -v node &>/dev/null || missing+=("node")

if [[ ${#missing[@]} -gt 0 ]]; then
  echo "  Missing: ${missing[*]}"
  echo "  Install missing tools and retry."
  exit 1
fi
echo "  jq ✓  node ✓"

# ── Step 1: Deterministic checks ──────────────────────────────────
run_step "Step 1 — Deterministic checks" "bash '$SCRIPT_DIR/checks/deterministic.sh'"

# ── Step 2: Fixture extraction test ───────────────────────────────
run_step "Step 2 — Fixture extraction test" "node '$SCRIPT_DIR/checks/test-extraction.js'"

# ── Step 3: Rubric grader (optional) ──────────────────────────────
if $RUN_RUBRIC; then
  run_step "Step 3 — Rubric grader" "bash '$SCRIPT_DIR/grade-rubric.sh'"
else
  echo ""
  echo "  (Rubric grader skipped — pass --rubric to enable)"
fi

# ── Summary ───────────────────────────────────────────────────────
echo ""
echo "════════════════════════════════════════════════════════════"
if $overall_pass; then
  echo "  OVERALL: PASS"
else
  echo "  OVERALL: FAIL"
fi
echo "════════════════════════════════════════════════════════════"
echo ""

$overall_pass
