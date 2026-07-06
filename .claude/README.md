# `.claude/` — Coherence Claude Code setup

Folder convention from Boris Cherny's "practical tips" talk: **commands, skills, and agents each live in their own named folder, so you refer to them by name.** A "loop" is not a new kind of file — it's a command you run on a schedule (`/loop`) or in CI (`claude -p`), like Boris's GitHub-issue-labeler.

## What lives where

| Folder | What | How you invoke |
|---|---|---|
| `commands/<name>.md` | Reusable slash commands (checked in, shared with the team) | `/<name>` — filename *is* the command name |
| `skills/<name>/SKILL.md` | On-demand skills (currently **user-level** at `~/.claude/skills/`) | Auto-triggered by their `description` |
| `agents/<name>.md` | Subagents — thin pointers to the canonical harnesses in `docs/agents/` | `@<name>` / Agent tool |
| `settings.local.json` | Personal permissions/allowlist (not shared) | — |
| `launch.json` | Dev-server config for preview tooling | — |

## Commands (`commands/`)

| Command | Purpose | Loopable? |
|---|---|---|
| `/shipped [since]` | Standup readout of what I shipped from git history | ✅ **Weekly** — `/loop` it every Monday |
| `/preflight` | AGENTS.md pre-commit gate: clean-code + tsc + build | On-demand, before each commit |
| `/token-review` | Token Guardian review of the current diff | On-demand, per diff |

### Making a command a loop
```
/loop <interval> /<command>      # e.g.  /loop 1w /shipped
```
Or run headless in CI (Boris's pattern):
```
claude -p "/shipped 1 week ago" --output-format json
```

## Skills — why they are NOT loops

`afi-redaccion` and `growth-audit` (in `~/.claude/skills/`) are **on-demand** tools — you fire them when you need them, they don't recur. Forcing them into loops would be wrong. They stay skills. `growth-audit` is generic (keep it user-level, cross-project); `afi-redaccion` is Afi-specific and references `docs/rules/copy-skill.md` (candidate to move project-level into `.claude/skills/` if the team should share it).

## Subagents (`agents/`)

`planner`, `builder`, `tester`, `ds-token-guardian`, `case-study` — each is a thin wrapper (frontmatter + a short prompt that reads its `docs/agents/<name>.md` harness). **`docs/agents/` stays the single source of truth**; the subagent bodies are pointers, so there's no duplication to drift. Edit behavior in `docs/agents/`, never in the wrapper.

## CLAUDE.md / context load (audited)

Boris: keep `CLAUDE.md` short — it loads into every session's context. Ours is **466 bytes** ✅.

The weight was in AGENTS.md's "read before coding" mandate (~60k tokens). Audit outcome:
- **11 build-skill reads kept mandatory** — they're needed in-context while coding.
- **`docs/strategy/plan.md` (124KB / ~31k tokens) demoted to on-demand** — it's strategy, not build rules. Read it only for planning/scoping/strategy work, not every coding task. Halves the pre-coding load.
