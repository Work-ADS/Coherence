---
description: Summarize what I shipped in a time window from git history — Boris's Monday-standup command. Loopable weekly.
argument-hint: "[since] — e.g. \"1 week ago\", \"yesterday\", \"2026-07-01\" (default: 1 week ago)"
allowed-tools: Bash(git log:*), Bash(git shortlog:*), Bash(git config:*)
---

Summarize what I shipped since **${ARGUMENTS:-1 week ago}**.

Steps:
1. Get my identity: `git config user.name` and `git config user.email`.
2. List my commits across all branches in the window:
   `git log --all --author="<my email>" --since="${ARGUMENTS:-1 week ago}" --pretty=format:"%h %ad %s" --date=short`
3. Group the commits by theme (feature / fix / chore / docs), not chronologically.
4. Produce a tight standup-ready readout: one bullet per shipped thing, plain language, no hashes unless useful. Lead with the highest-impact work.

Keep it copy-paste-ready for a standup doc. No preamble.
