# Build — Clean-code check script (`scripts/clean-code-check.sh`)

**Source:** `docs/rules/clean-code.md` non-negotiables
**Surface:** pre-commit grep that blocks violations before they land. Wired into Husky + lint-staged. This is the automation side of `build-kickoff.md`'s "no `--no-verify` escape" clause.
**Prereqs:** scaffolding prompt complete (Husky + lint-staged already installed with a placeholder that `exit 0`s; this prompt replaces the placeholder).

## Scope

One Bash script, `scripts/clean-code-check.sh`, that:

- Accepts file paths from lint-staged as arguments
- Greps each against clean-code.md violations
- Prints violations in `path:line: message` format with the offending line + caret
- Exits 1 if any violation found, 0 otherwise

No responsibilities beyond what `clean-code.md` specifies. ESLint + Prettier handle everything else (formatting, unused imports, ordering beyond three-block, etc.).

## Required reads

1. `docs/rules/clean-code.md` — the non-negotiables are the spec
2. `docs/workflow/build-kickoff.md` — automation clause, no-bypass policy
3. `docs/build-prompts/coherence-scaffolding.md` — Husky + lint-staged setup

## Rules checked

Each rule has a ripgrep pattern, a file scope, and a human-readable error message.

| # | Rule | Pattern | Applies to | Message |
|---|---|---|---|---|
| 1 | No hex colors | `#[0-9a-fA-F]{3,8}\b` | `*.{ts,scss,css,html}` excl. `libs/tokens/**` | `Hex color — use CSS var from libs/tokens/` |
| 2 | No rgb/rgba() | `\brgba?\s*\(` | same | `rgb()/rgba() — use CSS var` |
| 3 | No hardcoded px | `\b\d+px\b` | same | `Hardcoded px — use spacing/size token` |
| 4 | No `any` type | `:\s*any\b\|<any>\|\bas any\b` | `*.ts` | `No 'any' — type explicitly` |
| 5 | No `@ts-ignore` | `@ts-ignore` | `*.ts` | `@ts-ignore is forbidden — fix the type` |
| 6 | No `as unknown as` | `\bas unknown as\b` | `*.ts` | `as unknown as double-cast — refactor` |
| 7 | No `@Input()` decorator | `@Input\s*\(` | `*.ts` | `Use signal input() instead of @Input()` |
| 8 | No `@Output()` decorator | `@Output\s*\(` | `*.ts` | `Use output<T>() instead of @Output() EventEmitter` |
| 9 | No NgModule | `@NgModule\s*\(` | `*.ts` | `Standalone only — no NgModule` |
| 10 | No `*.module.ts` files | filename match `*.module.ts` | any | `No *.module.ts — standalone only` |

All matches from `libs/tokens/**` are skipped (lint-staged pre-filters; the script also has a guard).

## Husky integration

```
# .husky/pre-commit
npx lint-staged
```

```
# .lintstagedrc.json
{
  "apps/**/*.{ts,scss,css,html}": [
    "scripts/clean-code-check.sh",
    "eslint --fix",
    "prettier --write"
  ],
  "libs/ui/**/*.{ts,scss,css,html}": [
    "scripts/clean-code-check.sh",
    "eslint --fix",
    "prettier --write"
  ]
}
```

`libs/tokens/**` is deliberately absent — tokens are the one place hex/rgba/px are allowed, by definition.

## Script behavior

**With violations:**

```
$ scripts/clean-code-check.sh apps/site/src/foo.ts libs/ui/button/button.component.ts

apps/site/src/foo.ts:12: Hex color — use CSS var from libs/tokens/
  border: 1px solid #ccc;
                    ^^^^

libs/ui/button/button.component.ts:34: @ts-ignore is forbidden — fix the type
  // @ts-ignore
     ^^^^^^^^^^

2 violation(s) found. Commit blocked.
```

Exit 1.

**Clean:**

```
$ scripts/clean-code-check.sh apps/site/src/clean.ts
Clean.
```

Exit 0.

**No args:**

Exit 0 immediately (nothing to check; lint-staged just had nothing for us).

## Key behavior

1. **Accept file paths as args** from lint-staged. Empty args → exit 0.
2. **`ripgrep` required.** Script checks `command -v rg` at start; fails fast with install hint if missing (`brew install ripgrep` / `apt install ripgrep`). Don't silently fall back to `grep` — the patterns are calibrated for `rg`.
3. **One rule per iteration**; each uses `rg --no-heading --line-number --color never --with-filename`.
4. **Output format:** `path:line: message`, then the match line indented 2 spaces, then a caret underline under the match.
5. **Exit code:** 1 if any rule matched, 0 otherwise. Summary line prints either the violation count or `Clean.`
6. **No silencing mechanism.** No `// clean-code-ignore` pragma. If a rule is wrong, edit `clean-code.md` + this script in the same commit. No local escape hatches.

## No-bypass clause

- `.husky/pre-commit` does NOT accept `--no-verify` as a normal path. If a developer sets `HUSKY=0` or tries to bypass, the CI equivalent (same script, same rules) still blocks at PR time.
- Single escape: human edits `clean-code.md` **and** `scripts/clean-code-check.sh` in the same commit, with a commit message explaining why the rule changed. Reviewer signs off.

Mirrors `build-kickoff.md` automation clause.

## File structure

```
scripts/
└── clean-code-check.sh    # this script (executable; chmod +x)

.husky/
└── pre-commit             # calls `npx lint-staged`

.lintstagedrc.json         # routes staged files to the script
```

Plus a CI workflow (future): `.github/workflows/clean-code.yml` runs the same script against `git diff --name-only main...HEAD` on PR.

## Copy (hardcoded — error messages)

Developer-facing, English (consistent with the rest of the toolchain):

- `Hex color — use CSS var from libs/tokens/`
- `rgb()/rgba() — use CSS var`
- `Hardcoded px — use spacing/size token`
- `No 'any' — type explicitly`
- `@ts-ignore is forbidden — fix the type`
- `as unknown as double-cast — refactor`
- `Use signal input() instead of @Input()`
- `Use output<T>() instead of @Output() EventEmitter`
- `Standalone only — no NgModule`
- `No *.module.ts — standalone only`
- Summary: `{N} violation(s) found. Commit blocked.` / `Clean.`
- Missing ripgrep: `ripgrep not found. Install: brew install ripgrep (or apt install ripgrep).`

## Pre-flight

`_pre-flight.md` doesn't fully apply — this isn't a primitive. Use it as a sanity check on what's written (clean code, no secrets, etc.), then run these script-specific checks:

- Seed `apps/site/src/test.ts` with `color: #fff;` → run script → exit 1, rule 1 fires.
- Seed `libs/tokens/primitives/color.ts` with `color: #fff;` → run script → exit 0 (excluded).
- Seed a file with `foo: any` → rule 4 fires.
- Seed a file with `@Input() foo: string` → rule 7 fires.
- Run script with zero args → exit 0, prints nothing or a single `Clean.` line.
- Run script on a genuinely clean file → exit 0, prints `Clean.`
- Stage a file with a violation and run `git commit` → commit aborts, message visible.

## What success looks like

- Developer adds `border: 1px solid #ccc;` inside `libs/ui/button/button.component.scss` → `git commit` → hook runs → clean-code-check prints:
  ```
  libs/ui/button/button.component.scss:18: Hex color — use CSS var from libs/tokens/
    border: 1px solid #ccc;
                      ^^^^
  1 violation(s) found. Commit blocked.
  ```
  Developer swaps `#ccc` for `var(--border-subtle)`, re-commits, hook passes.
- Main branch stays green on CI — the same script runs against every PR.
- A new contributor tries `git commit --no-verify` on a fresh violation. CI catches it at PR time. No one gets away with it quietly.

## If stuck

- **ripgrep unavailable:** fail fast with an install hint. Don't degrade to `grep` — the patterns are `rg`-calibrated and `grep -E` behaves differently on some edge cases.
- **False positive on px in a comment:** either reword the comment or move the reference into token docs. Don't add a silencing pragma.
- **Performance:** lint-staged passes only staged files; even on a big repo this runs in under 200ms. If it's slow, the staged list is wrong, not the script.
- **Don't promote these into ESLint plugins yet.** Grep is cheap, explicit, and visible in one file. Revisit when the rules stabilize for >6 months.
- **Keep the rule count under ~15.** This script is a "block the dumb stuff" net, not a linter. Anything more semantic belongs in ESLint/TypeScript, not here.
