# Model-invoked vs user-invoked

Every `SKILL.md` in this repo is a skill. The one axis that splits them is **invocation**, who can reach it:

- **User-invoked**: reachable **only by the human typing its name**. Set `disable-model-invocation: true` in the frontmatter (Claude Code) and `policy.allow_implicit_invocation: false` in `agents/openai.yaml` (Codex). The `description` is **human-facing**: a one-line summary read by a person browsing slash-commands. Strip trigger lists ("Use when the user says…").
- **Model-invoked**: reachable by **model or user**. The default: omit `disable-model-invocation` and the `policy` block from `agents/openai.yaml`. The `description` is **model-facing** and keeps rich trigger phrasing ("Use when the user wants…, mentions…, asks for…") so auto-invocation fires. The test for whether a skill should stay model-invoked: _could the model usefully reach for this autonomously?_ (Reuse is the reason to extract a skill, not the test.)

Each harness excludes a user-invoked skill from the model's reach in its own way, so nothing but the human can fire it: no other skill can. A user-invoked skill may invoke model-invoked skills, but it can never reach another user-invoked skill.

Every skill also carries an `agents/openai.yaml` beside its `SKILL.md`. It holds Codex UI metadata: `interface.display_name` and `interface.short_description` for the skill picker, and, for user-invoked skills, the `policy.allow_implicit_invocation: false` that pairs with `disable-model-invocation`. Keep the two in sync: a skill is user-invoked in both harnesses or neither.

Antigravity documents no gate: every skill it discovers is model-reachable. Each user-invoked skill therefore opens with a line that sends an agent who was not asked for it by name back to the user.

The Claude adapter in `.claude/skills/<name>/SKILL.md` repeats the canonical `name`, `description` and `disable-model-invocation` and points at the package in `.agents/skills/<name>/`. `python3 tools/scripts/validate_skills.py` fails when the adapter or `agents/openai.yaml` drifts from the canonical skill.

## Dependencies between them

Dependencies are expressed as an explicit instruction to **call the Skill tool** with the named skill (`Call the Skill tool with "grilling"`), not deep `../other-skill/FILE.md` cross-references, and not a bare `/skill`-style mention left for the model to interpret. Naming the tool is what gets it fired: most harnesses expose skill invocation as a tool the model calls, and spelling that out gets a higher hit rate than dropping a `/name` into prose and hoping it's read as a command. Dropping the leading `/` also keeps this harness-neutral rather than less: a skill name on its own carries no assumption about which harness's trigger syntax it belongs to. Shared reference docs live inside the skill that owns them; other skills reach that material by calling the Skill tool with it, not by linking across folders. Where a harness has no Skill tool, read `.agents/skills/<name>/SKILL.md` and follow it.

This is about **operative** instructions: a skill's own steps telling the agent to go run another skill right now. Router prose that just names skills for a human to pick from isn't invoking anything, so it keeps `/skill`-style names as plain labels.

The Skill tool takes one skill per call. A step that needs two skills is two calls, not one call with two names: say so (`Call the Skill tool twice, for "grilling" and "domain-modeling"`), not "call it with X and Y," which reads as a single call taking both.

This whole convention only holds when the named skill is **model-invoked**. A user-invoked skill can never be reached this way, full stop: per the invariant above, no other skill can call it, including by naming it to the Skill tool. When a step's precondition is a user-invoked skill, phrase it as an instruction for the human to act on: "tell the user to run `<skill-name>`", never as a Skill tool call. The same holds for an unnamed request: when the user asks for a user-invoked skill's outcome without naming it, name the skill and ask them to run it. The route table says so for each one.

Tooling that several skills call (a script, a connector, a config file) lives in `tools/`, outside every skill, and each skill points at it by path.
