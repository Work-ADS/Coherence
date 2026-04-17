# Build — Coherence scaffolding

**Source:** `docs/plan.md` (Coherence is built against plan.md directly, not a brief)
**Surface:** monorepo bootstrap
**Goal:** produce an Angular workspace ready to hold `libs/tokens/`, `libs/ui/`, `apps/site/` with Tailwind + Style Dictionary + lint + pre-commit wired. Nothing custom. No fiddling.

## Scope of this prompt

- Angular workspace (no Nx)
- `apps/site/` Angular application
- `libs/ui/` and `libs/tokens/` empty library folders
- Tailwind v3+ stock setup with CSS-vars-backed theme
- Style Dictionary stock setup
- Strict TypeScript
- ESLint + Prettier
- Husky + lint-staged pointing at `scripts/clean-code-check.sh`

**Not in scope:** any component code, any token values, any site pages. Those are later prompts.

## Required reads (in order, before writing code)

1. `docs/clean-code.md` — stack + non-negotiables
2. `docs/plan.md` — monorepo convention (`apps/` + `libs/`), strict TS, pre-flight
3. `docs/token-skill.md` — confirms `libs/tokens/` folder layout (primitive / semantic / brand)

## Steps (do in this order; stop and report if any step fails)

1. **Workspace.** In the repo root, run:
   ```
   npx @angular/cli@latest new coherence \
     --create-application=false \
     --strict \
     --package-manager=npm \
     --new-project-root=apps
   ```
   Move workspace files into the existing repo root (or cd into the created folder, merge with existing `.git/` and `README.md`).

2. **Site app.**
   ```
   npx ng generate application site \
     --routing \
     --style=scss \
     --prefix=afi \
     --strict \
     --standalone
   ```
   Result: `apps/site/`.

3. **Libraries.**
   ```
   npx ng generate library ui --prefix=afi
   npx ng generate library tokens --prefix=afi
   ```
   Result: `libs/ui/`, `libs/tokens/`. (Adjust `angular.json` `projectType` / `root` if CLI nests them under `projects/` by default — we want them at `libs/`.)

4. **Tailwind (stock).**
   ```
   npm i -D tailwindcss@latest postcss autoprefixer
   npx tailwindcss init -p
   ```
   `tailwind.config.js`:
   ```js
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: [
       './apps/site/src/**/*.{html,ts}',
       './libs/ui/**/*.{html,ts}',
     ],
     theme: {
       extend: {
         // Populated by libs/tokens/ in the tokens prompt.
         // Intentionally empty here.
       },
     },
     plugins: [],
   };
   ```
   Add `@tailwind base; @tailwind components; @tailwind utilities;` to `apps/site/src/styles.scss`.

5. **Style Dictionary (stock).**
   ```
   npm i -D style-dictionary
   ```
   Create `libs/tokens/build.js` with a default config that reads `libs/tokens/primitive/**/*.json` + `libs/tokens/semantic/**/*.json` and outputs `libs/tokens/dist/tokens.css` (CSS custom properties). Token values are added in the next prompt — at this stage a single placeholder token is enough to prove the pipeline runs.

6. **Strict TS.** Verify `tsconfig.json` has:
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true,
       "noUncheckedIndexedAccess": true,
       "exactOptionalPropertyTypes": true,
       "noFallthroughCasesInSwitch": true,
       "forceConsistentCasingInFileNames": true
     }
   }
   ```

7. **Lint + format.**
   ```
   ng add @angular-eslint/schematics --skip-confirmation
   npm i -D prettier eslint-config-prettier
   ```
   `.prettierrc.json`:
   ```json
   { "singleQuote": true, "trailingComma": "all", "printWidth": 100 }
   ```
   Extend ESLint config with `prettier` last so it disables conflicting rules.

8. **Pre-commit hook.**
   ```
   npm i -D husky lint-staged
   npx husky init
   ```
   `package.json` additions:
   ```json
   "lint-staged": {
     "*.{ts,html,scss}": ["prettier --write", "bash scripts/clean-code-check.sh"],
     "*.{ts}": ["ng lint --fix"]
   }
   ```
   `.husky/pre-commit`:
   ```sh
   npx lint-staged
   ```
   **`scripts/clean-code-check.sh` is created in its own prompt** — for this prompt, create an empty placeholder file `scripts/clean-code-check.sh` that `exit 0`'s, so husky doesn't fail on an empty repo.

9. **Verify.**
   ```
   npm run build  # ng build site — must succeed
   npm run lint   # ng lint — must pass
   npx style-dictionary build --config libs/tokens/build.js  # must emit dist/tokens.css
   ```

## Expected final structure

```
Coherence/
├── apps/
│   └── site/            # Angular app
├── libs/
│   ├── ui/              # empty
│   └── tokens/
│       ├── primitive/   # (created, empty — tokens prompt fills)
│       ├── semantic/    # (created, empty)
│       ├── brand/       # (created, empty)
│       ├── dist/        # generated
│       └── build.js     # Style Dictionary config
├── scripts/
│   └── clean-code-check.sh  # placeholder; filled in its own prompt
├── .husky/
│   └── pre-commit
├── angular.json
├── tailwind.config.js
├── postcss.config.js
├── .prettierrc.json
├── tsconfig.json
└── package.json
```

## Pre-flight before commit

- [ ] `ng build site` succeeds with zero warnings
- [ ] `ng lint` passes
- [ ] `style-dictionary build` emits `libs/tokens/dist/tokens.css` (even if near-empty)
- [ ] Pre-commit hook fires on staged files (test with a trivial formatting violation)
- [ ] No `any`, no `@ts-ignore`, no hex/rgba/px outside `libs/tokens/` (trivially true at this stage; grep confirms)

## Out of scope for this prompt

- Any actual token values (next prompt)
- Any component code (primitive prompts)
- Site pages / routing beyond the generated default
- Deploy config, CI, storybook
- The `clean-code-check.sh` implementation (its own prompt; placeholder is fine here)

## If stuck

- Angular CLI monorepo + Nx-less setup: stock CLI supports it via `--create-application=false` and sibling `ng generate library`. Don't install Nx.
- Tailwind + Angular: use Angular's official docs path. No custom builders.
- Style Dictionary: default config is enough. No custom transforms needed for v1.
- Report the failing step with the exact error. Do not improvise.
