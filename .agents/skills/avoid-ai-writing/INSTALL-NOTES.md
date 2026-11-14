# Install notes

Vendored copy of the third-party `avoid-ai-writing` skill. Everything in this
directory except this file came from upstream unchanged.

| | |
|---|---|
| Source | https://github.com/conorbronsdon/avoid-ai-writing |
| Version | 3.26.0 |
| Commit | `40328bd292bc682d46010a6f9ac2cdbf4fb4ceca` (2026-08-24) |
| Installed | 2026-08-25, project scope (`.claude/skills/`), in the Compass Design Studio repository |
| Copied here | 2026-11-14, from that repository's `.agents/skills/avoid-ai-writing/` |
| License | MIT, see `LICENSE` |
| Author | Conor Bronsdon |

## What is here

- `SKILL.md`: the skill itself. Claude Code discovers it automatically in any
  session started from this workspace. No registration step.
- `README.md`: upstream docs, including the full pattern catalog summary.
- `detector/`: zero-dependency detection engine (`patterns.js`), preservation
  validator (`validate.js`), category map (`CATEGORIES.md`), and their tests.
- `scripts/check-style.js`: optional house-style checker for the skill's
  `--style` input. Takes a config you supply; it ships no style guides.
- `examples/`: sample `--style` configs showing the schema.
- `package.json`: pinned to the vendored test files only.

## What was left behind

Upstream repo maintenance that has no use here: CI workflows, the Cursor rule
port, the plugin mirror, the research corpus fetchers (`scripts/corpus.js`,
`dataset-hc3.js`, `dataset-raid.js`), the promo-drift and self-scan tooling,
`CHANGELOG.md`, and `PROOF.md`. The upstream `npm test` script runs two suites
that depend on those files, so `package.json` here lists only the four suites
that were vendored.

## Using it

Ask for it in plain language: "remove AI-isms from this", "audit this draft for
AI tells", "make this sound less like AI". Add "detect only" or "just flag" for
a read-only audit, or point it at a file for an in-place edit.

Run the engine directly:

```bash
cd .agents/skills/avoid-ai-writing
node -e "const D=require('./detector/patterns.js'); console.log(D.analyzeText('your text here'))"
```

Check a rewrite did not damage the original:

```bash
node .agents/skills/avoid-ai-writing/detector/validate.js before.md after.md
```

Verify the install after any update:

```bash
cd .agents/skills/avoid-ai-writing && npm test
```

## Updating

Re-download the tarball, diff it against this directory, and copy over the same
file set. Bump the version, commit, and date in the table above. Run `npm test`
afterward. Upstream also publishes an installer (`npx skills add`) and a plugin
marketplace, neither of which was used here: this copy is pinned so a session
cannot pick up an unreviewed upstream change on its own.

## One workspace rule to know

`AGENTS.md` bans em dashes in this repo's prose. These files are vendored
third-party content, not our prose, and the skill's own catalog quotes em dashes
as an example pattern. Treat this directory as exempt and do not rewrite it.
