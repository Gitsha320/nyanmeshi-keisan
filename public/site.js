/* ねこまわり 共通の動き：例の値の表示、計算するボタン、シェア */
(function(){
  // 例の値：data-ex を付けた入力欄は、ふれるまで「例」として薄く表示する
  window.markEx = function(root){
    (root||document).querySelectorAll('[data-ex]').forEach(function(el){
      var ex = el.dataset.touched !== '1';
      el.classList.toggle('ex', ex);
      var box = el.closest('.box'); if (box) box.classList.toggle('ex', ex);
    });
    var anyEx = !!document.querySelector('.ex');
    document.querySelectorAll('.exwarn').forEach(function(n){ n.hidden = !anyEx; });
    document.querySelectorAll('.exnote').forEach(function(n){
      var card = n.closest('.card') || document;
      n.hidden = !card.querySelector('.ex');
    });
  };
  window.unEx = function(el){
    if (!el || !el.hasAttribute('data-ex')) return;
    el.dataset.touched = '1';
    el.classList.remove('ex');
    var box = el.closest('.box'); if (box) box.classList.remove('ex');
    markEx();
  };
  // 例の数字が入った欄にふれたら、いったん空にする（そのまま打つと例とくっつかないように）。
  // 何も入れずに離れたら、例の数字に戻す。
  document.addEventListener('focusin', function(e){
    var el = e.target;
    if (!el.matches || !el.matches('input.ex') || el.readOnly || el.type === 'text') return;
    if (el.dataset.exv != null) return;
    el.dataset.exv = el.value;
    el.dataset.ph = el.getAttribute('placeholder') || '';
    el.setAttribute('placeholder', el.value);
    el.value = '';
  });
  document.addEventListener('focusout', function(e){
    var el = e.target;
    if (!el.dataset || el.dataset.exv == null) return;
    if (el.value === '' && el.classList.contains('ex')) el.value = el.dataset.exv;
    if (el.dataset.ph) el.setAttribute('placeholder', el.dataset.ph); else el.removeAttribute('placeholder');
    delete el.dataset.exv; delete el.dataset.ph;
  });
  document.addEventListener('input', function(e){ if (e.target.closest && e.target.matches('[data-ex]')) unEx(e.target); }, true);
  document.addEventListener('change', function(e){ if (e.target.closest && e.target.matches('[data-ex]')) unEx(e.target); }, true);

  // 計算するボタン：押すと結果のカードを出して、そこまでスクロール
  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('.calcbtn'); if (!b) return;
    var sec = document.getElementById(b.dataset.show); if (!sec) return;
    var first = sec.hidden;
    sec.hidden = false;
    if (typeof window.onCalc === 'function') window.onCalc();
    b.querySelector('.lbl').textContent = b.dataset.again || 'もう一度計算する';
    setTimeout(function(){
      sec.scrollIntoView({behavior:'smooth', block:'start'});
      if (!first) { sec.classList.remove('flash'); void sec.offsetWidth; sec.classList.add('flash'); }
    }, 30);
  });

  // シェア：Threads・X・コピー
  window.setShare = function(box, text, url, xText){
    box.querySelector('pre').textContent = text + '\n' + url;
    box.querySelector('.th').href = 'https://www.threads.net/intent/post?text=' + encodeURIComponent(text + '\n' + url);
    box.querySelector('.x').href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(xText || text) + '&url=' + encodeURIComponent(url);
    var cp = box.querySelector('.cp');
    cp.onclick = async function(){
      try { await navigator.clipboard.writeText(text + '\n' + url); cp.textContent = 'コピーしました'; }
      catch (err) { cp.textContent = 'コピーできませんでした'; }
      setTimeout(function(){ cp.textContent = '文章をコピー'; }, 1800);
    };
  };
})();
