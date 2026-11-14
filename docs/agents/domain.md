# Domain docs

How the engineering skills read this repo's domain documentation. The repository is single-context.

## Before exploring, read these

- `docs/glossary.md`: the project's terms. This is the glossary.
- `docs/adr/`: decisions that touch the area you are working in.

The root `CONTEXT.md` is the route table: read it to find the right entry file. Glossary terms go in `docs/glossary.md`, including when a skill says to write them into `CONTEXT.md`.

If a file named here does not exist, proceed silently. `/domain-modeling` (reached through `/grill-with-docs`) creates the glossary and ADRs lazily, when a term or decision is actually resolved.

## Recording a decision

A durable decision is a numbered ADR in `docs/adr/`, named `NNNN-short-title.md`.

## Use the glossary's vocabulary

When your output names a domain concept (an issue title, a proposal, a test name), use the glossary's term. A needed term that is missing is a gap to note for `/domain-modeling`, not a synonym to invent.

## Flag ADR conflicts

If your output contradicts an ADR, say so explicitly rather than overriding it silently.
