"""
全ページのメニューを入れ直す。
- PCの上のメニュー（<!--gnav-->…<!--/gnav-->）
- スマホの下のメニュー（<!--tabbar-->…<!--/tabbar-->、</body>の前に自動で入れる）
- フッターのリンク（<!--fnav-->…<!--/fnav-->）
ページを足したら PAGES に足して実行する。sitemap.xml もここで作る。
"""
import os, re, datetime

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public')
SITE = 'https://nekomawari.com'

# 線のアイコン（currentColor）
ICONS = {
  'home': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/></svg>',
  'gohan': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h18a9 6 0 0 1-18 0z"/><circle cx="8" cy="9.5" r="1.3"/><circle cx="12" cy="8.5" r="1.3"/><circle cx="16" cy="9.5" r="1.3"/><path d="M7 21h10"/></svg>',
  'kirikae': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h13l-3-3"/><path d="M20 16H7l3 3"/></svg>',
  'okane': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.5 7.5 12 12l3.5-4.5"/><path d="M8.5 12.5h7M8.5 15.5h7M12 12v5.5"/></svg>',
  'food': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/><circle cx="9" cy="10.5" r="1"/><circle cx="12" cy="9.5" r="1"/><circle cx="15" cy="10.5" r="1"/></svg>',
  'omocha': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21 14 10"/><path d="M14 10c1-4 4-6 7-6-0 3-2 6-6 7"/><path d="M15.5 8.5l2-2"/></svg>',
}
PAGES = [
  ('/', 'ホーム', '--ink', 'home'),
  ('/gohan/', 'ごはんの量', '--green', 'gohan'),
  ('/kirikae/', 'フード切り替え', '--kibble', 'kirikae'),
  ('/okane/', '猫にかかるお金', '--rose', 'okane'),
  ('/omocha/', 'おもちゃの口コミ', '--blue', 'omocha'),
  ('/food/', 'フードの口コミ', '--green', 'food'),
]
SHORT = {'/': 'ホーム', '/gohan/': 'ごはん', '/kirikae/': '切り替え', '/okane/': 'お金', '/omocha/': 'おもちゃ', '/food/': 'フード'}
EXTRA = [('/about/', 'このサイトについて')]

def path_of(url):
    return os.path.join(ROOT, url.strip('/'), 'index.html') if url != '/' else os.path.join(ROOT, 'index.html')

def gnav(cur):
    a = ''.join(f'<a href="{u}"{" aria-current=\"page\"" if u == cur else ""}><i style="background:var({c})"></i>{t}</a>' for u, t, c, _ in PAGES if u != '/')
    return f'<!--gnav--><nav class="gnav" aria-label="メニュー">{a}</nav><!--/gnav-->'

def tabbar(cur):
    a = ''.join(f'<a href="{u}" style="--c:var({c})"{" aria-current=\"page\"" if u == cur else ""}>{ICONS[i]}<span>{SHORT[u]}</span></a>' for u, t, c, i in PAGES)
    return f'<!--tabbar--><nav class="tabbar" aria-label="メニュー">{a}</nav><!--/tabbar-->'

def fnav():
    a = ''.join(f'<a href="{u}">{t}</a>' for u, t, _, _ in PAGES) + ''.join(f'<a href="{u}">{t}</a>' for u, t in EXTRA)
    return f'<!--fnav--><nav class="fnav" aria-label="サイトの中のページ">{a}</nav><!--/fnav-->'

def main():
    urls = [u for u, _, _, _ in PAGES] + [u for u, _ in EXTRA]
    for u in urls:
        f = path_of(u)
        if not os.path.exists(f):
            print('skip', u); continue
        s = open(f, encoding='utf-8').read()
        s = re.sub(r'<!--gnav-->.*?<!--/gnav-->', gnav(u), s, flags=re.S)
        s = re.sub(r'<!--fnav-->.*?<!--/fnav-->', fnav(), s, flags=re.S)
        if '<!--tabbar-->' not in s:
            s = s.replace('</body>', '<!--tabbar--><!--/tabbar-->\n</body>', 1)
        s = re.sub(r'<!--tabbar-->.*?<!--/tabbar-->', tabbar(u), s, flags=re.S)
        s = re.sub(r'@@(\w+)@@', lambda m: f'<!--ico:{m.group(1)}--><!--/ico-->', s)
        s = re.sub(r'<!--ico:(\w+)-->.*?<!--/ico-->', lambda m: f'<!--ico:{m.group(1)}-->{ICONS[m.group(1)]}<!--/ico-->', s, flags=re.S)
        if '/site.js' not in s:
            s = s.replace('</head>', '<script src="/site.js"></script>\n</head>', 1)
        open(f, 'w', encoding='utf-8').write(s)
        print('nav', u)
    today = datetime.date.today().isoformat()
    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + \
         ''.join(f'  <url><loc>{SITE}{u}</loc><lastmod>{today}</lastmod></url>\n' for u in urls if os.path.exists(path_of(u))) + '</urlset>\n'
    open(os.path.join(ROOT, 'sitemap.xml'), 'w').write(sm)

if __name__ == '__main__':
    main()
