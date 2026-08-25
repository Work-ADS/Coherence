#!/usr/bin/env bash
# sync-remotes — one command to keep the three Coherence remotes in line.
#
# The flow this encodes (see AGENTS.md remotes note):
#   origin-afi  (Azure DevOps)      — canonical. Work lands here via PRs only;
#                                     this script never pushes to it.
#   github      (Work-ADS mirror)   — what Vercel builds. Mirrors origin-afi/main
#                                     EXACTLY: reviewed work only, never local WIP,
#                                     because pushing here deploys publicly.
#   richgriner1 (personal copy)     — mirrors local main (canonical + your
#                                     unmerged commits), so the laptop is never
#                                     the only place your work exists.
#
# Every push is fast-forward-only (git's default). If one is rejected, the fix
# is a human decision — this script never forces.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

echo "▸ fetching origin-afi, github, richgriner1…"
git fetch origin-afi --quiet
git fetch github --quiet
git fetch richgriner1 --quiet

# 1. Bring local main up to date with canonical.
if [ "$(git branch --show-current)" = "main" ] && [ -z "$(git status --porcelain --untracked-files=no)" ]; then
  if git merge-base --is-ancestor origin-afi/main main; then
    echo "▸ local main already contains origin-afi/main"
  else
    echo "▸ merging origin-afi/main into local main…"
    git merge --no-edit origin-afi/main
  fi
else
  echo "⚠ skipping the local-main update (not on a clean main checkout);"
  echo "  mirror pushes below still run."
fi

# 2. Work-ADS mirror ← canonical only. Vercel redeploys from this.
echo "▸ pushing origin-afi/main → github/main (Vercel)…"
git push github origin-afi/main:refs/heads/main

# 3. Personal copy ← local main.
echo "▸ pushing main → richgriner1/main…"
git push richgriner1 main:main

echo "✓ remotes in sync:"
for r in origin-afi/main github/main richgriner1/main; do
  printf "  %-18s %s\n" "$r" "$(git log -1 --format='%h %cd %s' --date=short "$r" | cut -c1-72)"
done
