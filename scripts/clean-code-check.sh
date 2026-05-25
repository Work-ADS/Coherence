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

  # Find matches with line numbers using perl so we can:
  #   1. Skip @media/@container lines for the px check (CSS media queries
  #      cannot reference CSS custom properties — literal breakpoint values
  #      are unavoidable until a generated Sass partial lands; see
  #      docs/rules/component-skill.md § 4).
  #   2. Exclude px values that are the decimal part of a fraction like
  #      11.5px (the `5px` sub-string is not a standalone raw dimension).
  #
  # Banned everywhere:
  #   #aabbcc / #aabbccdd   hex colors (3, 4, 6, or 8 digits)
  #   rgba(...) / rgb(...)  rgb function
  #   ::ng-deep             banned cross-scope selector
  #
  # Banned on non-@media/@container lines only:
  #   12px / 200px / etc.   bare INTEGER px — decimal px (11.5px) is excluded
  matches=$(perl -ne '
    my $is_bp = /^\s*\@(?:media|container)\s*\(/;
    my $matched = 0;
    $matched = 1 if /#[0-9a-fA-F]{3,8}(?![0-9a-fA-F])/ || /\brgba?\s*\(/ || /::ng-deep/;
    $matched = 1 if !$is_bp && /(?<![.\d])[0-9]+px\b/;
    print "$.:$_" if $matched;
  ' "$file" || true)

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
  - bare INTEGER px values (12px, 200px, …) — decimal px (11.5px) is allowed
  - ::ng-deep

Note: @media and @container breakpoint lines are exempt from the px check.

Replace with CSS custom properties from libs/tokens/ (e.g. var(--surface-quiet),
var(--space-md)). If a token doesn't exist, add it under libs/tokens/ first.

Rules: docs/rules/component-skill.md § 2 + § 5
EOF
  exit 1
fi

exit 0
