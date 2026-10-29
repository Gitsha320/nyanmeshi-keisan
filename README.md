# ねこまわり（nekomawari.com）


猫まわりの計算・口コミサイト。旧名「にゃん飯計算機」（nyanmeshi-keisan.pages.dev からは functions/_middleware.js で転送）。
猫の体重とキャットフードのカロリーから、1日のごはんの量と月のフード代を出す計算機。ビルド不要の静的サイト（`public/`）。

- 計算式：安静時エネルギー（70 × 体重kg^0.75）× 状態の係数（子猫2.5／避妊去勢済み1.2／未去勢1.4／太りやすい1.0、MSD獣医マニュアル）
- 楽天リンク：`public/index.html` の `SHOP` の `a8` に、A8.netの楽天ツール「任意ページへのリンク作成」で作ったURLを貼る

## ページ
- `/` ごはんの量、`/kirikae/` フード切り替え表、`/okane/` 猫にかかるお金、`/omocha/` おもちゃの口コミ、`/about/` このサイトについて、`/kanri/` 口コミの管理（合言葉が必要・noindex）
- メニューとサイトマップ：`python3 tools/nav.py`
- 楽天・Amazonの商品カード：`python3 tools/place.py`（楽天のコードは `tools/rakuten_items.json` に1文字も変えずに保存）
- フードのカロリー一覧：`public/foods.js`（各メーカー公式ページで確認した値と出典URL）

## 口コミ（Cloudflare Pages Functions + D1）
- API：`functions/api/reviews.js`（一覧・集計・投稿）、`report.js`（通報・3件で自動非表示）、`admin.js`（管理）。共通部品は `lib/omocha.js`（NGワードなど）
- D1データベース `nyanmeshi`（`wrangler.jsonc` で `DB` として接続）。管理用の合言葉はハッシュにして `settings` テーブルに保存
