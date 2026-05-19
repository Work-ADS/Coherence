#!/usr/bin/env bash
#
# clean-code-check.sh
#
# Block raw color/dimension values and ::ng-deep from being committed in
# component code. Tokens in libs/tokens/ are the only legitimate place
# for raw values.
#
# Invoked by .husky/pre-commit with staged file paths as arguments.
# Exits 0 if all checked files are clean; exits 1 on any violation.
#
# Rules: docs/rules/component-skill.md § 2 + § 5
# Patterns: docs/build-prompts/_pre-flight.md § 1
#
set -uo pipefail

# If no files passed, nothing to check.
if [ "$#" -eq 0 ]; then
  exit 0
fi

# Regex for banned literals in component code:
#   #aabbcc / #aabbccdd      hex colors (3, 4, 6, or 8 digits)
#   rgba(...) or rgb(...)    rgb function
#   12px / 200px / etc.       bare px dimensions
#   ::ng-deep                 banned cross-scope selector
BAD_REGEX='#[0-9a-fA-F]{3,8}\b|\brgba?\s*\(|\b[0-9]+px\b|::ng-deep'

FAILED=0

for file in "$@"; do
  # Skip files that don't exist (deletions, renames).
  [ -f "$file" ] || continue

  # Allowlist libs/tokens/ — tokens legitimately contain raw values.
  case "$file" in
    libs/tokens/*|*/libs/tokens/*) continue ;;
  esac

  # Only check the file types this rule applies to.
  case "$file" in
    *.component.ts | *.component.html | *.scss) ;;
    *) continue ;;
  esac

  # Find matches with line numbers.
  matches=$(grep -nE "$BAD_REGEX" "$file" || true)
  if [ -n "$matches" ]; then
    if [ "$FAILED" -eq 0 ]; then
      echo ""
      echo "✗ clean-code-check found banned values:"
      echo ""
    fi
    echo "  $file"
    echo "$matches" | sed 's/^/    /'
    echo ""
    FAILED=1
  fi
done

if [ "$FAILED" -eq 1 ]; then
  cat <<'EOF'
Banned in component code (outside libs/tokens/):
  - hex colors (#aabbcc / #aabbccdd)
  - rgb()/rgba() functions
  - bare px values (12px, 200px, …)
  - ::ng-deep

Replace with CSS custom properties from libs/tokens/ (e.g. var(--surface-quiet),
var(--space-md)). If a token doesn't exist, add it under libs/tokens/ first.

Rules: docs/rules/component-skill.md § 2 + § 5
EOF
  exit 1
fi

exit 0
