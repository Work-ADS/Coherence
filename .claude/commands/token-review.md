---
description: Review token additions/references in the current diff against the Token Guardian rules.
allowed-tools: Bash(git diff:*), Read, Grep, Glob
---

Act as the **Token Guardian**. Read `docs/agents/ds-token-guardian.md` and follow it as your harness — that file is the single source of truth, do not restate its rules from memory.

Scope: the current working diff (`git diff HEAD`), focused on token additions, token references, and any raw color/dimension values that slipped past `scripts/clean-code-check.sh`.

Output: the review format defined in `ds-token-guardian.md`. Flag violations with `file:line`. If the diff touches no tokens, say so in one line and stop.
