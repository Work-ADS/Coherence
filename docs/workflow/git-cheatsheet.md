# Git cheatsheet for designers

Use this when you need to make a small change, save it, and share it without becoming a Git person. Run commands from the repo root.

## Check where you are

```bash
git status
```

Shows changed files. If you see changes you do not recognize, stop and ask before committing.

## Get the latest version

```bash
git pull
```

Do this before starting work. It brings in changes other people pushed.

## Make a branch

```bash
git switch -c your-name/short-description
```

Example:

```bash
git switch -c richard/update-button-docs
```

## Save your work

```bash
git add path/to/file.md
git commit -m "Update button docs"
```

Use a short message that says what changed.

## Share your branch

```bash
git push -u origin your-name/short-description
```

After this, open a pull request if the repo uses PRs.

## Delete a branch after merge

```bash
git switch main
git pull
git branch -d your-name/short-description
```

This deletes only your local branch after the work is merged.

## See what changed

```bash
git diff
```

Shows unsaved changes before you commit.

