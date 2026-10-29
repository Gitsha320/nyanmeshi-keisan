"""
楽天（A8.net）とAmazonの商品カードを index.html に差しこむ。
- 楽天のリンクは tools/rakuten_items.json（A8の管理画面で「にゃん飯計算機」用に作ったコードを1文字も変えずに保存）
- Amazonは https://www.amazon.co.jp/dp/ASIN?tag=トラッキングID の形
- AMAZON_ON を True にするのは、Amazonアソシエイトの「ウェブサイトとモバイルアプリ」にこのサイトを登録してから
- <!--pr:名前--> … <!--/pr:名前--> の目印で囲むので、何度実行しても同じ結果になる
"""
import json, os, re, html

AMAZON_ON = True
AMAZON_TAG = 'gligla-22'

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
IDX = os.path.join(ROOT, 'public', 'index.html')
ITEMS = {d['id']: d for d in json.load(open(os.path.join(ROOT, 'tools', 'rakuten_items.json'), encoding='utf-8'))}

def yen(p):
    n = re.sub(r'[^\d]', '', p)
    return f'{int(n):,}円' + ('〜' if ('～' in p or '〜' in p) else '')

def jdate(at):
    y, m, d = at.split('/')
    return f'{int(y)}年{int(m)}月{int(d)}日'

def card(rid, asin, name, note):
    it = ITEMS[rid]
    r = html.escape(it['url'])
    img = html.escape(it['img'].replace('_ex=64x64', '_ex=128x128'))
    amz = ''
    if AMAZON_ON and asin:
        amz = f'<a class="b-amz" href="https://www.amazon.co.jp/dp/{asin}?tag={AMAZON_TAG}" target="_blank" rel="nofollow sponsored noopener">Amazonで見る</a>'
    return (f'<div class="item"><a class="ph" href="{r}" target="_blank" rel="nofollow sponsored noopener"><img src="{img}" width="88" height="88" alt="" loading="lazy"></a>'
            f'<div class="tx"><a class="nm" href="{r}" target="_blank" rel="nofollow sponsored noopener">{name}</a>'
            f'<span class="nt">{note}</span>'
            f'<span class="pc">楽天市場：{yen(it["price"])}<small>（{jdate(it["at"])}時点）</small></span>'
            f'<span class="bt"><a class="b-rak" href="{r}" target="_blank" rel="nofollow sponsored noopener">楽天市場で見る</a>{amz}</span></div></div>')

def group(title, color, items):
    return f'<div class="grp"><p class="gt"><i style="background:var({color})"></i>{title}</p><div class="items">' + ''.join(card(*i) for i in items) + '</div></div>'

FOOD = [
  ('tamaone:10000183', 'B0DT44V818', 'tama ボナペティ ラム＆フィッシュ', 'グレインフリーのドライフード。600g・1.5kg・2.5kgから選べます'),
  ('1096dog:10101086', 'B000OLFXRU', 'ロイヤルカナン キトン 2kg', '成長後期の子猫用（生後12か月まで）'),
  ('natural-link9:10000856', 'B00O8IE2UO', 'ヒルズ サイエンス・ダイエット 避妊・去勢後', '避妊・去勢後の猫用のドライフード'),
  ('ppp-shop:10010432', 'B0D1KV2KGB', 'ロイヤルカナン ライトウェイトケア', '減量したい成猫用（生後12か月以上）'),
]
TOOLS = [
  ('rakuten24:11276123', 'B0DBL3R6Y3', 'タニタ クッキングスケール KJ-222', '0.1g単位ではかれる。1回分の量をはかるのに'),
  ('kaguzaku:10007763', 'B09LY2RQV8', '山崎実業 密閉袋ごとペットフードストッカー 3kg', '袋のまま入れて密閉できる。計量カップつき'),
  ('lighting:10000401', 'B0FP16BKHZ', 'COOAU 自動給餌器（2匹用・カメラつき）', '2つのお皿に同時にごはんを出せて、スマホで見守れる'),
  ('cocosmile-online:10002020', 'B0CWK6V4P8', 'ジェックス ピュアクリスタル グラッシーR 1.5L', 'フィルターで水をきれいにする猫用の給水器'),
]
EXTRA = [
  ('rakutensokuhaimart:10037036', 'B0C2C8SVV5', 'チャオ ちゅ〜る 総合栄養食バラエティ 80本', '総合栄養食タイプ。おやつの分はごはんから引いて計算します'),
  ('crestshop:10044263', 'B0DJ744MT2', 'PETTOM 木製キャットホイール', '室内で走れる回し車。運動不足が気になる猫に'),
]

CSS = '''
/*pr-css*/
.grp{display:flex;flex-direction:column;gap:8px}
.gt{margin:0;font-weight:800;font-size:14px;display:flex;align-items:center;gap:8px}
.gt i{width:10px;height:10px;border-radius:3px}
.items{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.item{display:grid;grid-template-columns:88px 1fr;gap:12px;padding:10px;border-radius:14px;background:var(--bg);border:1.5px solid transparent}
.item:hover{border-color:var(--line)}
.item .ph img{width:88px;height:88px;object-fit:contain;border-radius:10px;background:#fff;display:block}
.item .tx{display:flex;flex-direction:column;gap:3px;min-width:0}
.item .nm{font-weight:800;font-size:14px;color:var(--ink);line-height:1.45;text-decoration:underline;text-decoration-color:var(--green);text-underline-offset:3px}
.item .nt{font-size:12.5px;color:var(--sub);line-height:1.55}
.item .pc{font-size:12.5px}
.item .pc small{color:var(--sub);margin-left:3px}
.item .bt{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
.item .bt a{font-weight:800;font-size:12.5px;text-decoration:none;border-radius:999px;padding:5px 12px;color:#fff}
.item .b-rak{background:#bf0000}
.item .b-amz{background:#232f3e}
.pr-note{margin:0;font-size:12px;color:var(--sub)}
@media (max-width:640px){.items{grid-template-columns:1fr}}
/*/pr-css*/
'''

def clean(s):
    s = re.sub(r'\s*<!--pr:(\w+)-->.*?<!--/pr:\1-->', '', s, flags=re.S)
    return re.sub(r'\n?/\*pr-css\*/.*?/\*/pr-css\*/\n?', '\n', s, flags=re.S)

def main():
    s = clean(open(IDX, encoding='utf-8').read())
    s = s.replace('</style>', CSS + '</style>', 1)
    px = ITEMS[FOOD[0][0]]['px']
    note = '<p class="pr-note">楽天市場の価格は確認した日のものです。' + ('Amazonのアソシエイトとして、にゃん飯計算機は適格販売により収入を得ています。' if AMAZON_ON else '') + '</p>'
    # 1) 結果の下：フード
    food = (f'<!--pr:food--><p class="small muted" style="margin:0">計算した量に合うフードを探すなら</p>' + group('フード', '--green', FOOD) +
            f'<img border="0" width="1" height="1" src="{html.escape(px)}" alt="" class="px"><p class="small muted" style="margin:4px 0 0">ほかのフードを探す</p><!--/pr:food-->')
    m = re.search(r'<p class="pr-h"><span class="pr-tag">PR</span>(楽天市場でフードを見る|フードを選ぶ)</p>', s)
    assert m
    s = s[:m.start()] + '<p class="pr-h"><span class="pr-tag">PR</span>フードを選ぶ</p>\n    ' + food + s[m.end():]
    # 2) ヒントの下：道具とおやつ
    tools = (f'<!--pr:tools--><aside class="pr" aria-label="広告"><p class="pr-h"><span class="pr-tag">PR</span>ごはんまわりの道具</p>'
             + group('量をはかる・しまう・あげる', '--kibble', TOOLS) + group('おやつと運動', '--rose', EXTRA) + note +
             '</aside><!--/pr:tools-->')
    b = '  <footer>'
    assert b in s
    s = s.replace(b, tools + '\n\n' + b, 1)
    open(IDX, 'w', encoding='utf-8').write(s)
    print('ok amazon=', AMAZON_ON)

if __name__ == '__main__':
    main()
