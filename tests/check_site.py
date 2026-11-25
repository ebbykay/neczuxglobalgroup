"""Check local HTML href/src references and fragment targets; no network calls."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.ids=set(); self.links=[]
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if a.get('id'): self.ids.add(a['id'])
        for key in ('href','src'):
            if a.get(key): self.links.append((self.getpos()[0],a[key]))

pages={}
for path in ROOT.glob('*.html'):
    page=Page(); page.feed(path.read_text(encoding='utf-8')); pages[path.resolve()]=page
errors=[]
for path,page in pages.items():
    for line,link in page.links:
        u=urlsplit(link)
        if u.scheme or u.netloc or link.startswith('//'): continue
        target=(path.parent/unquote(u.path)).resolve() if u.path else path
        if target.is_dir(): target=target/'index.html'
        if not target.exists(): errors.append(f'{path.name}:{line}: missing {link}')
        elif u.fragment and target in pages and unquote(u.fragment) not in pages[target].ids:
            errors.append(f'{path.name}:{line}: missing fragment {link}')
for error in errors: print(error)
print(f'Checked {len(pages)} pages; {len(errors)} unresolved references.')
raise SystemExit(bool(errors))
