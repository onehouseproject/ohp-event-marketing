#!/usr/bin/env python3
"""Fail when a Claude adapter or a Codex metadata file drifts from its canonical skill.

  python3 tools/scripts/validate_skills.py [--root DIR]

For every .agents/skills/<name>/SKILL.md: the frontmatter names the folder; .claude/skills/<name>/SKILL.md
exists with the same name, description and disable-model-invocation, and its body points at that package; agents/openai.yaml exists with
interface.display_name and interface.short_description, and policy.allow_implicit_invocation is false
exactly when disable-model-invocation is true. Every adapter must have a canonical package.
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path


def load_yaml(path):
    text = Path(path).read_text(encoding="utf-8")
    try:
        import yaml  # type: ignore
        return yaml.safe_load(text)
    except ImportError:
        pass
    out = subprocess.run(["ruby", "-ryaml", "-rjson", "-e", "puts YAML.load(STDIN.read).to_json"],
                         input=text, capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


def frontmatter(path):
    lines = Path(path).read_text(encoding="utf-8").splitlines()
    if not lines or lines[0].strip() != "---":
        return None
    fm = {}
    for line in lines[1:]:
        if line.strip() == "---":
            break
        if ":" in line and not line.startswith((" ", "\t")):
            k, v = line.split(":", 1)
            fm[k.strip()] = v.strip()
    return fm


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--root", default=".")
    a = ap.parse_args()
    root = Path(a.root).resolve()
    canon_dir = root / ".agents" / "skills"
    adapt_dir = root / ".claude" / "skills"
    errors = []
    canon = {p.name for p in canon_dir.iterdir() if (p / "SKILL.md").exists()} if canon_dir.exists() else set()
    adapters = {p.name for p in adapt_dir.iterdir() if (p / "SKILL.md").exists()} if adapt_dir.exists() else set()
    for name in sorted(adapters - canon):
        errors.append("%s: adapter without a canonical package in .agents/skills/" % name)
    for name in sorted(canon):
        c = frontmatter(canon_dir / name / "SKILL.md")
        if not c:
            errors.append("%s: canonical SKILL.md has no frontmatter" % name)
            continue
        if c.get("name") != name:
            errors.append("%s: canonical name is %r" % (name, c.get("name")))
        if not c.get("description"):
            errors.append("%s: canonical description missing" % name)
        user_invoked = c.get("disable-model-invocation", "").lower() == "true"
        ad = adapt_dir / name / "SKILL.md"
        if not ad.exists():
            errors.append("%s: no Claude adapter at .claude/skills/%s/SKILL.md" % (name, name))
        else:
            f = frontmatter(ad) or {}
            for key in ("name", "description"):
                if f.get(key) != c.get(key):
                    errors.append("%s: adapter %s differs from canonical" % (name, key))
            if (f.get("disable-model-invocation", "").lower() == "true") != user_invoked:
                errors.append("%s: adapter disable-model-invocation differs from canonical" % name)
            body = ad.read_text(encoding="utf-8")
            pointers = set(re.findall(r"\.agents/skills/([A-Za-z0-9_-]+)/", body))
            if ".agents/skills/%s/SKILL.md" % name not in body:
                errors.append("%s: adapter does not point at .agents/skills/%s/SKILL.md" % (name, name))
            for other in sorted(pointers - {name}):
                errors.append("%s: adapter points at another skill: %s" % (name, other))
        oy = canon_dir / name / "agents" / "openai.yaml"
        if not oy.exists():
            errors.append("%s: missing agents/openai.yaml" % name)
        else:
            meta = load_yaml(oy) or {}
            iface = meta.get("interface") or {}
            for key in ("display_name", "short_description"):
                if not iface.get(key):
                    errors.append("%s: openai.yaml interface.%s missing" % (name, key))
            allow = (meta.get("policy") or {}).get("allow_implicit_invocation", True)
            if user_invoked and allow is not False:
                errors.append("%s: user-invoked but openai.yaml does not set policy.allow_implicit_invocation: false" % name)
            if not user_invoked and allow is False:
                errors.append("%s: model-invoked but openai.yaml sets policy.allow_implicit_invocation: false" % name)
    for e in errors:
        print("ERROR", e)
    print("skills: %d canonical, %d adapters, %d error(s)" % (len(canon), len(adapters), len(errors)))
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
