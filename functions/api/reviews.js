import { TOYS, AGES, TRAITS, DAYS, ngCheck, json, ipHash } from '../../lib/omocha.js';

// GET /api/reviews            … おもちゃごとの集計
// GET /api/reviews?toy=xxx    … そのおもちゃの口コミ（新しい順・最大100件）
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const toy = url.searchParams.get('toy');
  if (toy) {
    if (!TOYS.includes(toy)) return json({ error: 'toy' }, 400);
    const { results } = await env.DB.prepare(
      'SELECT id, age, traits, stars, days, comment, created_at FROM reviews WHERE toy=? AND hidden=0 ORDER BY created_at DESC LIMIT 100'
    ).bind(toy).all();
    return json({ reviews: results });
  }
  const { results } = await env.DB.prepare(
    'SELECT toy, age, stars, days FROM reviews WHERE hidden=0'
  ).all();
  const sum = {};
  for (const r of results) {
    const s = sum[r.toy] = sum[r.toy] || { n: 0, total: 0, byAge: {}, days: {} };
    s.n++; s.total += r.stars;
    const a = s.byAge[r.age] = s.byAge[r.age] || { n: 0, total: 0 };
    a.n++; a.total += r.stars;
    s.days[r.days] = (s.days[r.days] || 0) + 1;
  }
  return json({ summary: sum });
}

// POST /api/reviews  {toy, age, traits[], stars, days, comment, website(=空のはず)}
export async function onRequestPost({ request, env }) {
  let b;
  try { b = await request.json(); } catch { return json({ error: 'json' }, 400); }
  if (b.website) return json({ ok: true }); // ロボット対策の見えない欄が埋まっていたら、保存せずに終わる
  const toy = String(b.toy || ''), age = String(b.age || ''), days = String(b.days || '');
  const stars = parseInt(b.stars, 10);
  const traits = Array.isArray(b.traits) ? b.traits.filter(t => TRAITS.includes(t)).slice(0, 3) : [];
  const comment = String(b.comment || '').replace(/\s+/g, ' ').trim().slice(0, 200);
  if (!TOYS.includes(toy) || !AGES.includes(age) || !DAYS.includes(days) || !(stars >= 1 && stars <= 5))
    return json({ error: 'input', message: '入力を確かめてください' }, 400);
  if (comment && ngCheck(comment))
    return json({ error: 'ng', message: 'このコメントは投稿できません。URLや宣伝、攻撃的な言葉は使えません' }, 400);

  const ip = await ipHash(env, request);
  const now = Date.now();
  const recent = await env.DB.prepare(
    'SELECT COUNT(*) AS n, SUM(CASE WHEN toy=? THEN 1 ELSE 0 END) AS same FROM reviews WHERE ip_hash=? AND created_at>?'
  ).bind(toy, ip, now - 86400000).first();
  if (recent && recent.same > 0) return json({ error: 'dup', message: 'このおもちゃには、今日はもう投稿しています' }, 429);
  if (recent && recent.n >= 10) return json({ error: 'limit', message: '今日はたくさん投稿してくれたので、また明日お願いします' }, 429);
  const burst = await env.DB.prepare('SELECT COUNT(*) AS n FROM reviews WHERE ip_hash=? AND created_at>?').bind(ip, now - 600000).first();
  if (burst && burst.n >= 3) return json({ error: 'limit', message: '少し時間をおいてから投稿してください' }, 429);

  const r = await env.DB.prepare(
    'INSERT INTO reviews (toy, age, traits, stars, days, comment, created_at, ip_hash) VALUES (?,?,?,?,?,?,?,?)'
  ).bind(toy, age, traits.join(','), stars, days, comment, now, ip).run();
  return json({ ok: true, id: r.meta.last_row_id });
}
