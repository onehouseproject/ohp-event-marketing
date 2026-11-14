# OHP Event Marketing

Purpose: not yet written. The first exploration session replaces this line with what the repository is for.

This repository serves Claude Code, Codex and Antigravity alike; harness-specific files only point here.

## Route

1. Read `CONTEXT.md` at the root and pick the one row that matches the task.
2. Read that row's entry file and load only the files it names. A folder listing is not context.

## Where things live

- `docs/`: human-readable explanation. Decision records in `docs/adr/`, research memos in `docs/research/`, and `docs/open-items.md`, the repository's own to-do list. Naming rules: `docs/README.md`.
- `.agents/skills/`: skill packages. `tools/scripts/`: scripts that skills and maintainers call.
- `tmp/`: scratch, outside git. `tmp/uploads/` holds the files the owner provides to agents.

## Boundaries

- `tmp/` loads only when the task names it.
- `tmp/` is outside git, so a worktree has none: read uploads from the main checkout's `tmp/uploads/`.
- Before creating or editing a skill or any file an agent reads, apply `.agents/skills/writing-for-agents/SKILL.md`.
- Prose carries no em dashes. Rewrite the sentence with a comma, colon, period, parentheses or a conjunction.

## Skills

Skills live in `.agents/skills/<name>/`; `.claude/skills/` holds Claude adapters that point at them. `.agents/invocation.md` decides whether a skill is user-invoked or model-invoked and how each harness expresses it.

## Agent skills

### Issue tracker

GitHub Issues on `onehouseproject/ohp-event-marketing`, through `gh`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context; the glossary is `docs/glossary.md`, never the root `CONTEXT.md`. See `docs/agents/domain.md`.

## Budget

This file and `CLAUDE.md` together stay under 800 tokens.
