/*
  人気のドライフードのカロリー（代謝エネルギー・100gあたり）
  2026年10月29日に、各メーカーの公式ページ（tamaは公式ショップ）で確認した値。
  商品のリニューアルで変わることがあるので、袋の表示も見てもらう。
*/
window.FOODS_CHECKED = '2026年10月29日';
window.FOODS = [
  {b:'ロイヤルカナン', n:'キトン（子猫用）', k:407, t:'kitten', u:'https://www.royalcanin.com/jp/cats/products/retail-products/kitten-2522'},
  {b:'ロイヤルカナン', n:'インドア（室内猫用）', k:374, t:'adult', u:'https://www.royalcanin.com/jp/cats/products/retail-products/indoor-2529'},
  {b:'ロイヤルカナン', n:'ステアライズド（避妊・去勢猫用）', k:363, t:'neuter', u:'https://www.royalcanin.com/jp/cats/products/retail-products/sterilised-2537'},
  {b:'ロイヤルカナン', n:'ライトウェイトケア（減量したい成猫用）', k:335, t:'diet', u:'https://www.royalcanin.com/jp/cats/products/retail-products/light-weight-care-2524'},
  {b:'ロイヤルカナン', n:'フィット（成猫用）', k:385, t:'adult', u:'https://www.royalcanin.com/jp/cats/products/retail-products/fit-2520'},
  {b:'ヒルズ サイエンス・ダイエット', n:'キトン チキン（子猫用）', k:425, t:'kitten', u:'https://www.hills.co.jp/cat-food/science-diet-kitten-chicken-dry'},
  {b:'ヒルズ サイエンス・ダイエット', n:'アダルト チキン（成猫用）', k:411, t:'adult', u:'https://www.hills.co.jp/cat-food/science-diet-adult-chicken-dry'},
  {b:'ヒルズ サイエンス・ダイエット', n:'毛玉ケア インドアキャット アダルト チキン', k:322, t:'adult', u:'https://www.hills.co.jp/cat-food/science-diet-adult-indoor-cat-chicken-dry'},
  {b:'ヒルズ サイエンス・ダイエット', n:'避妊・去勢後〜6歳 チキン', k:357, t:'neuter', u:'https://www.hills.co.jp/cat-food/science-diet-sterilised-cat-young-adult-chicken-dry'},
  {b:'ヒルズ サイエンス・ダイエット', n:'シニア 7歳以上 チキン', k:402, t:'senior', u:'https://www.hills.co.jp/cat-food/science-diet-mature-adult-7-chicken-dry'},
  {b:'ピュリナ ワン', n:'1歳までの子ねこ用 チキン', k:390, t:'kitten', u:'https://purina.nestle.jp/food/cat/one-dry-kitten-chicken'},
  {b:'ピュリナ ワン', n:'美味を求める成猫用 チキン', k:370, t:'adult', u:'https://purina.nestle.jp/food/cat/one-dry-adult-chicken'},
  {b:'ピュリナ ワン', n:'インドアキャット チキン', k:355, t:'adult', u:'https://purina.nestle.jp/food/cat/one-dry-indoor-chicken'},
  {b:'ピュリナ ワン', n:'避妊・去勢した猫の体重ケア チキン', k:345, t:'neuter', u:'https://purina.nestle.jp/food/cat/one-dry-aftercare-chicken'},
  {b:'ピュリナ ワン', n:'健康マルチケア 7歳以上', k:355, t:'senior', u:'https://purina.nestle.jp/food/cat/one-dry-senior7-chicken'},
  {b:'モンプチ', n:'ドライ 5種の魚介 贅沢ブレンド', k:370, t:'adult', u:'https://purina.nestle.jp/food/cat/mp-dry-5seafood-gourmet-blend'},
  {b:'銀のスプーン', n:'贅沢うまみ仕立て', k:400, t:'adult', u:'https://jp.unicharmpet.com/ja/products/cat/food-ginspoon-4520699643631.html'},
  {b:'銀のスプーン', n:'贅沢うまみ仕立て 子ねこ用', k:420, t:'kitten', u:'https://jp.unicharmpet.com/ja/products/cat/food-ginspoon-4520699645390.html'},
  {b:'銀のスプーン', n:'贅沢3種の素材仕立て', k:400, t:'adult', u:'https://jp.unicharmpet.com/ja/products/cat/food-ginspoon-4520699644959.html'},
  {b:'銀のスプーン', n:'贅沢3種の素材仕立て 肥満が気になる猫用', k:325, t:'diet', u:'https://jp.unicharmpet.com/ja/products/cat/food-ginspoon-4520699649831.html'},
  {b:'銀のスプーン', n:'三ツ星グルメ しみ旨お魚仕立て', k:395, t:'adult', u:'https://jp.unicharmpet.com/ja/products/cat/food-ginspoon-4520699615980.html'},
  {b:'銀のスプーン', n:'ザクッと食感ブレンド', k:390, t:'adult', u:'https://jp.unicharmpet.com/ja/products/cat/food-ginspoon-4520699031193.html'},
  {b:'ニュートロ ナチュラルチョイス', n:'室内猫用 アダルト チキン', k:360, t:'adult', u:'https://nutro.jp/products/nc_c_adult_chicken'},
  {b:'ニュートロ ナチュラルチョイス', n:'穀物フリー アダルト チキン', k:375, t:'adult', u:'https://nutro.jp/products/nc_c_adult_grainfree_chicken'},
  {b:'ニュートロ シュプレモ', n:'子猫用 チキン＆サーモン', k:385, t:'kitten', u:'https://nutro.jp/products/supremo_c_kitten_chicken_salmon'},
  {b:'tama', n:'ボナペティ ラム＆フィッシュ', k:332, t:'neuter', u:'https://item.rakuten.co.jp/tamaone/tac0100270-2500g/'},
];
window.FOOD_TAGS = {kitten:'子猫用', adult:'成猫用', neuter:'避妊・去勢後', diet:'体重が気になる', senior:'シニア'};

/* <select> にフードの一覧を入れる。最後に「その他（自分で入れる）」 */
window.fillFoodSelect = function(sel, placeholder){
  const groups = {};
  FOODS.forEach((f,i)=>{(groups[f.b] = groups[f.b] || []).push([f,i]);});
  let h = `<option value="">${placeholder||'フードを選ぶ'}</option>`;
  for (const b in groups){
    h += `<optgroup label="${b}">` + groups[b].map(([f,i])=>`<option value="${i}">${f.n}（${f.k}kcal）</option>`).join('') + '</optgroup>';
  }
  h += '<option value="other">その他（カロリーを自分で入れる）</option>';
  sel.innerHTML = h;
};
