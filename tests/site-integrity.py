from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(".").resolve()
errors = []

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.refs = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.append(attrs["id"])
        for key in ("href", "src", "action", "poster"):
            value = attrs.get(key)
            if value:
                self.refs.append((tag, key, value))

pages = sorted(ROOT.glob("*.html"))
parsed = {}
for page in pages:
    parser = PageParser()
    parser.feed(page.read_text(encoding="utf-8"))
    parsed[page] = parser
    duplicates = [item for item, count in Counter(parser.ids).items() if count > 1]
    for item in duplicates:
        errors.append(f"{page.relative_to(ROOT)}: duplicate id #{item}")

for page, parser in parsed.items():
    for tag, key, raw in parser.refs:
        value = raw.strip()
        if not value or value.startswith(("#", "data:", "javascript:", "mailto:", "tel:", "blob:")):
            if value.startswith("#") and len(value) > 1 and unquote(value[1:]) not in parser.ids:
                errors.append(f"{page.relative_to(ROOT)}: missing anchor {value}")
            continue
        parts = urlsplit(value)
        if parts.scheme or parts.netloc:
            continue
        path_text = unquote(parts.path)
        if not path_text:
            target = page
        elif path_text == "/":
            target = ROOT / "index.html"
        elif path_text.startswith("/"):
            target = ROOT / path_text.lstrip("/")
        else:
            target = page.parent / path_text
        target = target.resolve()
        if not target.is_relative_to(ROOT):
            errors.append(f"{page.relative_to(ROOT)}: local reference escapes site root: {value}")
            continue
        if not target.is_file():
            errors.append(f"{page.relative_to(ROOT)}: missing local {key} target: {value}")
            continue
        if parts.fragment and target.suffix.lower() == ".html" and target in parsed:
            anchor = unquote(parts.fragment)
            if anchor and anchor not in parsed[target].ids:
                errors.append(f"{page.relative_to(ROOT)}: missing anchor in {target.relative_to(ROOT)}: #{anchor}")

if errors:
    print("\n".join(errors))
    raise SystemExit(f"Found {len(errors)} site integrity issue(s) across {len(pages)} HTML pages.")
print(f"PASS: checked local references, anchors and duplicate IDs across {len(pages)} HTML pages.")
