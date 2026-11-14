# Documentation

Human-facing explanation of how this repository works and why. Agent rules live in `AGENTS.md` and `.agents/`. This folder explains; it never governs.

## Map

- `open-items.md`: what is deferred or known to be wrong in the repository itself.
- `adr/`: architecture decision records, one per durable decision, named `NNNN-short-title.md` and numbered from `0001`.
- `research/`: dated research memos, named `YYYY-MM-DD-topic.md`. Evidence for decisions, not guidance.

## Start here

1. `AGENTS.md` for the rules every agent follows, then `CONTEXT.md` for the route table.

## What does not belong

Session scratch and the files provided to agents. Those live outside git in `tmp/` and `tmp/uploads/`. A work folder in `tmp/` is named `<topic>-<YYYY-MM>` or `<topic>-<YYYY-MM-DD>`.
