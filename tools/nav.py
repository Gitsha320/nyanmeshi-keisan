"""
全ページのメニュー（<!--gnav-->…<!--/gnav-->）とフッターのリンク（<!--fnav-->…<!--/fnav-->）を入れ直す。
ページを足したら PAGES に足して実行する。sitemap.xml もここで作る。
"""
import os, re, datetime

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public')
SITE = 'https://nyanmeshi-keisan.pages.dev'
PAGES = [
  ('/', 'ごはんの量', '--green'),
  ('/kirikae/', 'フード切り替え', '--kibble'),
  ('/okane/', '猫にかかるお金', '--rose'),
  ('/omocha/', 'おもちゃの口コミ', '--blue'),
]
EXTRA = [('/about/', 'このサイトについて')]

def path_of(url):
    return os.path.join(ROOT, url.strip('/'), 'index.html') if url != '/' else os.path.join(ROOT, 'index.html')

def gnav(cur):
    a = ''.join(f'<a href="{u}"{" aria-current=\"page\"" if u == cur else ""}><i style="background:var({c})"></i>{t}</a>' for u, t, c in PAGES)
    return f'<!--gnav--><nav class="gnav" aria-label="メニュー">{a}</nav><!--/gnav-->'

def fnav():
    a = ''.join(f'<a href="{u}">{t}</a>' for u, t, _ in PAGES) + ''.join(f'<a href="{u}">{t}</a>' for u, t in EXTRA)
    return f'<!--fnav--><nav class="fnav" aria-label="サイトの中のページ">{a}</nav><!--/fnav-->'

def main():
    urls = [u for u, _, _ in PAGES] + [u for u, _ in EXTRA]
    for u in urls:
        f = path_of(u)
        if not os.path.exists(f):
            print('skip', u); continue
        s = open(f, encoding='utf-8').read()
        s = re.sub(r'<!--gnav-->.*?<!--/gnav-->', gnav(u), s, flags=re.S)
        s = re.sub(r'<!--fnav-->.*?<!--/fnav-->', fnav(), s, flags=re.S)
        open(f, 'w', encoding='utf-8').write(s)
        print('nav', u)
    today = datetime.date.today().isoformat()
    sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + \
         ''.join(f'  <url><loc>{SITE}{u}</loc><lastmod>{today}</lastmod></url>\n' for u in urls if os.path.exists(path_of(u))) + '</urlset>\n'
    open(os.path.join(ROOT, 'sitemap.xml'), 'w').write(sm)

if __name__ == '__main__':
    main()
