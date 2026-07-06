# `.claude/` — Coherence Claude Code setup

Folder convention from Boris Cherny's "practical tips" talk: **commands, skills, and agents each live in their own named folder, so you refer to them by name.** A "loop" is not a new kind of file — it's a command you run on a schedule (`/loop`) or in CI (`claude -p`), like Boris's GitHub-issue-labeler.

## What lives where

| Folder | What | How you invoke |
|---|---|---|
| `commands/<name>.md` | Reusable slash commands (checked in, shared with the team) | `/<name>` — filename *is* the command name |
| `skills/<name>/SKILL.md` | On-demand skills (currently **user-level** at `~/.claude/skills/`) | Auto-triggered by their `description` |
| `agents/<name>.md` | Subagents *(not yet created — see below)* | `@<name>` / Agent tool |
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

## Not yet done — real subagents

`docs/agents/` holds prose harnesses (`planner`, `builder`, `tester`, `ds-token-guardian`, `case-study`) that are **not wired as Claude Code subagents**. Converting them to `.claude/agents/<name>.md` (frontmatter + system prompt) would make them invokable by name. Deferred to avoid duplicating those large files and causing drift — decide single-source-of-truth first.

## CLAUDE.md note

Boris: keep `CLAUDE.md` short — it loads into every session's context. Ours points to `AGENTS.md` (7KB) → **11 required-read files**. That's a heavy per-session load worth auditing separately.
