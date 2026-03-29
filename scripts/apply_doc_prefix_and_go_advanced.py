#!/usr/bin/env python3
"""
Import Go 进阶 from GolangGuide into docs/Programming Language/GoLang-Advanced.

For pages missing the grid background: prepend full Docker-style block (see docs/Docker/01-Intro.md).

If a page already has YAML front matter but no grid, insert only the <style> block after the first
front matter (see Redis docs) — do not run apply_prefix_to_docs twice on the same tree.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
GUIDE = ROOT / "GolangGuide" / "Go语言系列" / "Go语言进阶"
ADV = DOCS / "Programming Language" / "GoLang-Advanced"

STYLE_BLOCK = """
<style>
body {
  position: relative;
}

body::before {
  --size: 35px;
  --line: color-mix(in hsl, canvasText, transparent 60%);
  content: '';
  height: 100vh;
  width: 100%;
  position: absolute;
  background: linear-gradient(
        90deg,
        var(--line) 1px,
        transparent 1px var(--size)
      )
      50% 50% / var(--size) var(--size),
    linear-gradient(var(--line) 1px, transparent 1px var(--size)) 50% 50% /
      var(--size) var(--size);
  -webkit-mask: linear-gradient(-20deg, transparent 30%, white 80%);
          mask: linear-gradient(-20deg, transparent 30%, white 80%);
  top: 0;
  transform-style: flat;
  pointer-events: none;
  z-index: -1;
}

@media (max-width: 768px) {
  body::before {
    display: none;
  }
}
</style>

"""

PREFIX = (
    """---
statistics: true
comments: true
---
"""
    + STYLE_BLOCK
)


def strip_yaml_frontmatter(text: str) -> str:
    if not text.startswith("---"):
        return text
    rest = text[3:].lstrip("\n")
    idx = rest.find("\n---")
    if idx == -1:
        return text
    after = rest[idx + 4 :]
    return after.lstrip("\n")


def import_go_advanced():
    import re

    ADV.mkdir(parents=True, exist_ok=True)
    mapping = [
        ("并发概述.md", "01-Concurrency.md"),
        ("Goroutine.md", "02-Goroutine.md"),
        ("Channel.md", "03-Channel.md"),
        ("Select.md", "04-Select.md"),
        ("Context.md", "05-Context.md"),
        ("Sync.md", "06-Sync.md"),
        ("定时器.md", "07-Timer.md"),
        ("协程池.md", "08-WorkerPool.md"),
        ("反射.md", "09-Reflection.md"),
        ("范型.md", "10-Generics.md"),
    ]
    for src_name, dst_name in mapping:
        src = GUIDE / src_name
        if not src.exists():
            raise FileNotFoundError(src)
        body = strip_yaml_frontmatter(src.read_text(encoding="utf-8"))
        (ADV / dst_name).write_text(PREFIX + body, encoding="utf-8")
    print(f"Wrote {len(mapping)} files under {ADV.relative_to(ROOT)}")


SKIP_PREFIX = {
    DOCS / "index.md",
}


def apply_prefix_to_docs():
    import re

    logs = DOCS / "logs"
    n = 0
    for path in sorted(DOCS.rglob("*.md")):
        try:
            path.relative_to(logs)
            continue
        except ValueError:
            pass
        if path in SKIP_PREFIX:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except OSError:
            continue
        if "body::before" in text[:12000]:
            continue
        # Already has front matter, no grid: insert style after first ---
        m = re.match(r"^(\-\-\-\n.*?\n\-\-\-\n)", text, re.DOTALL)
        if m:
            head = m.group(1)
            rest = text[len(head) :]
            path.write_text(head + STYLE_BLOCK + rest, encoding="utf-8")
            n += 1
            continue
        path.write_text(PREFIX + text, encoding="utf-8")
        n += 1
    print(f"Added grid style or full prefix to {n} markdown files")


if __name__ == "__main__":
    import_go_advanced()
    apply_prefix_to_docs()
