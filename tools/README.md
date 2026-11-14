# Tools

Shared, deterministic utilities that skills and maintainers call. Scripts live in `scripts/`.

| Script | Job |
|---|---|
| `scripts/validate_skills.py` | Fail when a Claude adapter in `.claude/skills/` drifts from its canonical package in `.agents/skills/`, or when the Codex `agents/openai.yaml` disagrees about invocation |

Run them from the repository root with `python3`. They need only the standard library, plus Ruby for reading YAML when PyYAML is not installed.
