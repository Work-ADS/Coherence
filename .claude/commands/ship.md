---
description: Ship the current feature branch (commit → push to Azure → merge to GitHub main), then stop for the manual Azure PR merge. `/ship next <branch>` runs the post-merge cleanup and starts a new branch.
argument-hint: "(nothing) for phase 1, or  next <new-branch-name>  for phase 2"
allowed-tools: Bash(git status:*), Bash(git diff:*), Bash(git add:*), Bash(git reset:*), Bash(git commit:*), Bash(git push:*), Bash(git checkout:*), Bash(git switch:*), Bash(git merge:*), Bash(git branch:*), Bash(git fetch:*), Bash(git log:*), Bash(git merge-base:*), Bash(git rev-parse:*), Bash(git config:*)
---

This command automates Richard's two-remote ship flow. It has **two phases**; pick by `$ARGUMENTS`.

## Remotes (LOCKED — never guess)
- `richgriner1` = personal **GitHub**. Direct `main` push (mirror).
- `origin-afi` = **Azure**. Push the feature branch; **Richard PR-merges it via the Azure web UI** (the manual gate between the two phases). Azure `main` is the integration source of truth.
- `github` = Work-ADS — **NEVER touch it.**

## Which phase?
- If `$ARGUMENTS` starts with **`next`** → run **Phase 2** (cleanup + new branch). The new branch name is the rest of `$ARGUMENTS` after `next`.
- Otherwise → run **Phase 1** (commit + push + GitHub merge). Any `$ARGUMENTS` here is an optional override commit subject.

---

## Phase 1 — commit, push to Azure, merge to GitHub, then STOP

1. **Guard.** `git rev-parse --abbrev-ref HEAD`. If it's `main`, STOP — "Phase 1 must run on a feature branch, not main." Capture the branch name.
2. **Stage the feature work only.** `git status --short`, then `git add -A` and immediately **unstage the denylist** so incidental noise never gets committed:
   `git reset -- .claude/launch.json ':(glob)**/*.pdf' loops/`
   Then print the final staged list (`git diff --cached --name-only`). The denylist is the hard exclusion. Beyond it, only **flag** (don't auto-unstage) anything that looks like generated output or an unrelated stray (e.g. `dist/`, `node_modules/`, an editor scratch file) and let Richard decide — legitimate tooling changes under `.claude/commands/` or `.claude/agents/` SHOULD be committed.
3. **Commit message.** Unless `$ARGUMENTS` gave an override subject, generate a simple one from the staged diff in the exact shape:
   `We built: X, Y, Z`
   — X, Y, Z are the 1–4 notable things (new component, token, workbench/demo, fix). Keep it one line, plain, no hashes. Append the trailer:
   ```
   Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
   ```
   Commit with it. The pre-commit hook (clean-code) runs automatically — if it fails, STOP and surface the violations; do not `--no-verify`.
4. **Push to BOTH remotes — never just one.** This is the load-bearing rule ([[coherence-repo-has-two-main-remotes-github-origin-and-azure-devops-origin-afi]]); skipping either has burned Richard before.
   - **Azure** (the feature branch, for his PR): `git push origin-afi <feature-branch>`.
   - **GitHub `main`** (fast-forward only): `git checkout main` → `git merge --ff-only <feature-branch>`. If the ff fails (main diverged), STOP and report — no force, no `--no-ff`. Then `git push richgriner1 main` and `git checkout <feature-branch>` to return.
   - **Print both push results** so it's visible that Azure AND GitHub each received the work. If either push fails, STOP and say which — do not report success on a half-push.
6. **STOP and hand off.** Print: the commit subject, that the branch is on Azure + GitHub main is updated, and:
   > Now merge the Azure PR in the web UI. When it's merged, run `/ship next <new-branch-name>`.
   Do **not** proceed to cleanup — the Azure merge is a manual step.

---

## Phase 2 — cleanup + new branch (run AFTER the Azure PR is merged)

Invoked as `/ship next <new-branch-name>`.

1. **Parse.** New branch name = `$ARGUMENTS` minus the leading `next`. If empty, STOP — "Phase 2 needs a new branch name: `/ship next <name>`."
2. **Capture the branch to retire** = current branch (`git rev-parse --abbrev-ref HEAD`) if it's not `main`; else infer from context/ask.
3. **Confirm it's merged on Azure.** `git fetch origin-afi`, then `git merge-base --is-ancestor <retire-branch> origin-afi/main`.
   - If **not** an ancestor → STOP: "That branch isn't on Azure `main` yet — merge the PR first." (Azure may auto-delete the source branch on merge; that's fine and handled below.)
4. **Bring local `main` up to date with Azure** (the integration truth):
   `git checkout main` → `git merge --ff-only origin-afi/main`.
5. **Update the GitHub mirror:** `git push richgriner1 main`.
6. **Delete the retired branch.**
   - Local: `git branch -d <retire-branch>` (safe; it's merged).
   - Azure: `git push origin-afi --delete <retire-branch>` — if it errors with "remote ref does not exist," Azure already auto-deleted it on merge; treat as success.
   - (No branch is ever pushed to `richgriner1`, so nothing to delete there.)
7. **Start the new branch:** `git checkout -b <new-branch-name>` off the now-current `main`.
8. **Report** the final state: local `main` = Azure = GitHub, old branch gone, now on `<new-branch-name>` ready to build.

---

## Hard rules
- **Two remotes, fixed roles** (above). Every Phase 1 run pushes to **BOTH** — branch → Azure AND `main` → GitHub — and prints both. Never skip one. Never push a branch to `richgriner1`; never touch `github` (Work-ADS).
- **Never commit the denylist** (`.claude/launch.json`, `*.pdf`, `loops/`) or anything outside the feature.
- **Fast-forward only** for every `main` merge. A non-ff means STOP and report — no `--no-ff`, no force, no rebase surprises.
- **The Azure PR merge is Richard's manual step.** Phase 1 always stops before cleanup; Phase 2 refuses to run until the branch is on Azure `main`.
- **Let the pre-commit hook run** (no `--no-verify`); if clean-code fails, fix or surface, don't bypass.
