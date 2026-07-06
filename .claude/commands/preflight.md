---
description: Run the pre-commit checks from AGENTS.md against the current changes — clean-code, types, build. Run before every commit.
allowed-tools: Bash(git diff:*), Bash(bash scripts/clean-code-check.sh:*), Bash(npx tsc:*), Bash(npm run build:*)
---

Run the pre-flight gate for the current working changes, exactly as AGENTS.md defines it.

1. Collect changed files: `git diff --name-only HEAD`.
2. Clean-code check (raw color/dimension/`::ng-deep` guard):
   `bash scripts/clean-code-check.sh <changed files>`
3. Types: `npx tsc -p apps/site/tsconfig.app.json --noEmit`
4. Build: `npm run build`

Report each step as ✅ pass / ❌ fail with the failing output inline. If step 2 or 3 fails, STOP and surface the violations before attempting the build — don't waste a build cycle. Do not fix anything; this command only reports.
