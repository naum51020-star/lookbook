/* =====================================================================
   VICTOR 단체복 시뮬레이션 — 룩북의 "단체복" 칩을 누를 때만 불러옵니다 (평소 룩북 속도에 영향 없음)
   STEP 1 모델 사진 → STEP 2 단체복(남/여 · 상의/하의) → STEP 3 로고·클럽명 + 미리보기 → 다운로드/공유
   모든 합성은 브라우저 안 캔버스에서 바로 처리 (서버 업로드 없음)
   ===================================================================== */
(function () {
  'use strict';
  if (window.VictorTeamwear) return;
  const VERSION = '20261119-tw3';
  const SCRIPT = document.currentScript;
  const BASE = SCRIPT && SCRIPT.src ? new URL('.', SCRIPT.src).href : location.href;
  const W = 1080, H = 1350;                                   // 결과 이미지 4:5 (SNS·카톡 공유용)
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const asset = (p) => !p ? '' : /^(https?:|data:|blob:|\/\/)/.test(p) ? p : new URL(p, BASE).href;
  const loadImg = (src) => new Promise((res, rej) => { const im = new Image(); im.decoding = 'async'; im.onload = () => res(im); im.onerror = rej; im.src = src; });

  const CSS = `
.vtw{--fg:#111;--sub:#8a8a8a;--line:#e6e6e6;--soft:#f5f5f5;color:var(--fg);text-align:left}
.vtw *{box-sizing:border-box;margin:0;padding:0}
.vtw button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
.vtw img{display:block;max-width:100%}
.vtw-intro{text-align:center;margin-bottom:34px}
.vtw-intro h3{font-size:20px;font-weight:700;letter-spacing:.01em}
.vtw-intro p{font-size:13px;color:#666;margin-top:8px;line-height:1.6;word-break:keep-all}
.vtw-grid{display:grid;grid-template-columns:.85fr 1.15fr 1.2fr;gap:22px;align-items:start}
.vtw-col3{display:flex;flex-direction:column;gap:22px;position:sticky;top:16px}
.vtw-box{border:1px solid #000;padding:20px;background:#fff}
.vtw-box h4{font-size:15px;font-weight:700;margin-bottom:16px;display:flex;align-items:baseline;gap:8px}
.vtw-box h4 b{font-size:11px;letter-spacing:.14em;color:#fff;background:#111;padding:3px 7px 2px;font-weight:700}
.vtw-models{display:grid;grid-template-columns:1fr;gap:12px}
.vtw-who{display:grid;gap:10px}
.vtw-whob{display:flex;align-items:center;gap:14px;height:64px;padding:0 16px !important;border:1px solid #d9d9d9 !important;background:#fff;font-size:15px;font-weight:600;text-align:left}
.vtw-whob.on{border-color:#000 !important;box-shadow:0 0 0 1px #000}
.vtw-whob .ic{display:flex;gap:4px}
.vtw-whob i{display:block;width:20px;height:32px;border-radius:10px 10px 4px 4px;background:#cfcfcf}
.vtw-whob.on i{background:#111}
.vtw-whob i.f{border-radius:10px 10px 8px 8px;width:18px}
.vtw-model{position:relative;border:1px solid #d9d9d9;padding:5px;background:#fff;transition:border-color .15s}
.vtw-model img{width:100%;aspect-ratio:3/4;object-fit:cover;background:var(--soft)}
.vtw-model.on{border-color:#000;box-shadow:0 0 0 1px #000}
.vtw-model .ck{position:absolute;right:12px;top:12px;width:26px;height:26px;border-radius:50%;background:#fff;border:1px solid #ccc;display:grid;place-items:center;font-size:13px;color:transparent}
.vtw-model.on .ck{background:#111;border-color:#111;color:#fff}
.vtw-tabs{display:grid;grid-template-columns:1fr 1fr;border:1px solid #000;margin-bottom:16px}
.vtw-tabs button{height:42px;font-size:14px;font-weight:600;color:#888}
.vtw-tabs button.on{background:#111;color:#fff}
.vtw-tabs button small{font-weight:400;font-size:11px;margin-left:4px;opacity:.75}
.vtw-part{font-size:12px;font-weight:700;letter-spacing:.08em;color:#333;margin:4px 0 10px}
.vtw-part + .vtw-items{margin-bottom:18px}
.vtw-items{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.vtw-item{position:relative;border:1px solid #d9d9d9;background:#fff;padding:4px 4px 8px;text-align:center;transition:border-color .15s}
.vtw-item:hover{border-color:#999}
.vtw-item.on{border-color:#000;box-shadow:0 0 0 1px #000}
.vtw-item .th{aspect-ratio:1/1;background:var(--soft) center/contain no-repeat;display:grid;place-items:center;font-size:10px;color:#aaa;overflow:hidden}
.vtw-item .th img{width:100%;height:100%;object-fit:contain}
.vtw-item .nm{font-size:11.5px;font-weight:600;margin-top:6px;line-height:1.3;word-break:keep-all}
.vtw-item .cd{font-size:10px;color:#999;margin-top:2px;letter-spacing:.02em}
.vtw-item .g{position:absolute;left:8px;top:8px;font-size:10px;font-weight:700;background:#fff;border:1px solid #ddd;border-radius:10px;padding:1px 6px}
.vtw-item.none .th{font-size:12px;color:#666;font-weight:500}
.vtw-pair{display:block;width:calc(100% - 8px);margin:6px auto 0 !important;height:26px;font-size:10.5px !important;font-weight:600;border:1px solid #111 !important;border-radius:13px}
.vtw-pair:hover{background:#111 !important;color:#fff !important}
.vtw-empty{font-size:12px;color:#888;background:var(--soft);padding:14px;line-height:1.6;word-break:keep-all}
.vtw-preview{position:relative;border:1px solid #000;padding:7px;background:#fff}
.vtw-preview canvas{display:block;width:100%;height:auto;background:var(--soft)}
.vtw-note{font-size:11.5px;color:#888;line-height:1.6;margin-top:10px;word-break:keep-all}
.vtw-field{display:block;margin-bottom:14px}
.vtw-field > span{display:block;font-size:12px;font-weight:600;margin-bottom:7px}
.vtw-field input[type=text]{width:100%;height:44px;border:1px solid #cfcfcf;padding:0 14px;font:inherit;font-size:14px;border-radius:0;outline:none;background:#fff}
.vtw-field input[type=text]:focus{border-color:#111}
.vtw-logo{display:flex;align-items:center;gap:12px}
.vtw-logo .lg{width:56px;height:56px;border:1px dashed #bbb;display:grid;place-items:center;background:var(--soft) center/contain no-repeat;font-size:10px;color:#999}
.vtw-logo label{height:40px;padding:0 16px;border:1px solid #111;display:inline-grid;place-items:center;font-size:13px;font-weight:600;cursor:pointer}
.vtw-logo .rm{font-size:12px;color:#888;text-decoration:underline}
.vtw-btns{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:4px}
.vtw-btns button{height:48px;font-size:14px;font-weight:700}
.vtw-btns .dark{background:#111 !important;color:#fff !important}
.vtw-btns .line{border:1px solid #111 !important}
.vtw-btns .full{grid-column:1/-1;height:40px;font-size:13px;font-weight:500;color:#555 !important;text-decoration:underline;text-underline-offset:3px}
.vtw-up{display:block;width:100%;height:48px;margin-top:10px;border:2px solid #111 !important;background:#fff;font-size:14px !important;font-weight:800 !important}
.vtw-up:hover{background:#111 !important;color:#fff !important}
.vtw-up.sm{display:inline-block;width:auto;height:38px;margin:0;padding:0 16px !important;font-size:13px !important}
.vtw-gal{margin-top:56px;border-top:1px solid #000;padding-top:28px}
.vtw-gal[hidden]{display:none}
.vtw-gal-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:20px}
.vtw-gal-head h4{font-size:18px;font-weight:700}
.vtw-gal-head small{font-size:13px;color:#888;font-weight:500;margin-left:4px}
.vtw-gal-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:28px 18px}
.vtw-card{display:flex;flex-direction:column;gap:3px;color:#111;text-decoration:none;min-width:0}
.vtw-card .ph{display:block;border:1px solid #000;padding:5px;background:#fff;margin-bottom:8px}
.vtw-card .ph img{width:100%;aspect-ratio:4/5;object-fit:cover;background:#f3f3f3}
.vtw-card b{font-size:14px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.vtw-card .ln{font-size:12px;color:#555;line-height:1.5;word-break:keep-all}
.vtw-card .dt{font-size:11px;color:#aaa;margin-top:2px}
.vtw-modal{position:fixed;inset:0;z-index:2147483002;display:grid;place-items:center;padding:24px;background:rgba(0,0,0,.35);opacity:0;pointer-events:none;transition:opacity .2s}
.vtw-modal.on{opacity:1;pointer-events:auto}
.vtw-modal-card{width:min(380px,100%);background:#fff;padding:40px 28px 28px;text-align:center;border-radius:12px}
.vtw-modal-card h5{font-size:18px;font-weight:700}
.vtw-modal-card p{font-size:14px;color:#555;line-height:1.65;margin-top:12px}
.vtw-modal-btns{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:28px}
.vtw-modal-btns a,.vtw-modal-btns button{height:50px;display:grid;place-items:center;font-size:14px;font-weight:700;border-radius:8px;text-decoration:none}
.vtw-modal-btns .dark{background:#111;color:#fff}
.vtw-modal-btns .line{border:1px solid #111 !important}
.vtw-cta[hidden],.vtw-up[hidden]{display:none !important}
.vtw-cta{display:block;margin-top:14px;text-align:center;font-size:12.5px;line-height:1.6;background:var(--soft);padding:12px;word-break:keep-all}
.vtw-cta a{font-weight:700;text-decoration:underline;text-underline-offset:3px}
.vtw-toast{position:fixed;left:50%;bottom:36px;transform:translate(-50%,16px);background:#111;color:#fff;font-size:14px;padding:12px 20px;border-radius:30px;opacity:0;pointer-events:none;transition:.3s;z-index:2147483001;white-space:nowrap}
.vtw-toast.on{opacity:1;transform:translate(-50%,0)}
@media (max-width:1100px){.vtw-grid{grid-template-columns:1fr 1fr}.vtw-col3{grid-column:1/-1;position:static}}
@media (max-width:767px){
  .vtw-intro{margin-bottom:20px}
  .vtw-grid{display:flex;flex-direction:column;align-items:stretch;gap:14px}
  .vtw-col3{display:contents}
  .vtw-preview{order:-1;position:sticky;top:0;z-index:5;padding:4px;box-shadow:0 6px 16px rgba(0,0,0,.08)}
  .vtw-preview canvas{width:100%;height:44vh;object-fit:contain;background:#fff}
  .vtw-box{padding:16px}
  .vtw-models{grid-template-columns:repeat(3,1fr);gap:8px}
  .vtw-who{grid-template-columns:repeat(3,1fr);gap:6px}
  .vtw-whob{flex-direction:column;justify-content:center;gap:6px;height:84px;font-size:13px;padding:0 !important;text-align:center}
  .vtw-model .ck{right:8px;top:8px;width:22px;height:22px;font-size:11px}
  .vtw-items{grid-template-columns:repeat(3,1fr);gap:8px}
  .vtw-gal-grid{grid-template-columns:repeat(2,1fr);gap:20px 10px}
  .vtw-gal-head h4{font-size:16px}
}`;

  function mount(root, opts = {}) {
    if (!document.getElementById('vtw-style')) { const st = document.createElement('style'); st.id = 'vtw-style'; st.textContent = CSS; document.head.appendChild(st); }
    root.classList.add('vtw');
    root.innerHTML = '<div class="vtw-empty" style="text-align:center;padding:60px 0">단체복 시뮬레이션을 불러오는 중…</div>';
    const shareUrl = opts.shareUrl || (location.origin + location.pathname + location.search + '#teamwear');
    const done = (D) => build(root, D, shareUrl, opts.gallery || {});
    if (opts.data) return done(opts.data);                  // 관리자 미리보기: 편집 중인 단체복 데이터
    if (window.TEAMWEAR_DATA) return done(window.TEAMWEAR_DATA);
    const sc = document.createElement('script');
    const u = new URL(opts.dataSrc || 'victor-teamwear-data.js', BASE); u.searchParams.set('v', Math.floor(Date.now() / 300000)); sc.src = u.href;
    sc.onload = () => done(window.TEAMWEAR_DATA || { people: {} });
    sc.onerror = () => { root.innerHTML = '<div class="vtw-empty">단체복 데이터를 불러오지 못했어요 (victor-teamwear-data.js)</div>'; };
    document.head.appendChild(sc);
  }

  function build(root, D, shareUrl, GAL) {
    const P = D.people || {}, CV = D.canvas || { w: 720, h: 1720, shoulderY: 300 };
    if (!(P.F || []).length && !(P.M || []).length) { root.innerHTML = '<div class="vtw-empty">준비중입니다</div>'; return; }
    const looks = (g) => P[g] || [];
    const L = (g, id) => looks(g).find(l => l.id === id);
    const tops = (g) => looks(g).filter(l => l.top);
    const bottoms = (g) => looks(g).filter(l => l.bottom);
    const first = (g, part) => (part === 'top' ? tops(g) : bottoms(g))[0]?.id || looks(g)[0]?.id;
    const st = {
      who: (P.F || []).length && (P.M || []).length ? 'FM' : (P.F || []).length ? 'F' : 'M',
      tab: (P.F || []).length ? 'F' : 'M',
      sel: { F: { top: first('F', 'top'), bottom: first('F', 'bottom') }, M: { top: first('M', 'top'), bottom: first('M', 'bottom') } },
      club: '', sub: 'BADMINTON CLUB', logo: null,
    };
    const whoOpts = [['FM', '남녀 함께'], ['F', '여자'], ['M', '남자']].filter(([k]) => [...k].every(g => looks(g).length));

    root.innerHTML = `
      <div class="vtw-intro"><h3>우리 클럽 단체복 미리 입어보기</h3>
        <p>상의·하의 아이콘을 누르면 바로 갈아입혀져요. 우리 클럽 로고와 이름을 넣으면 배드민턴장 현수막까지 합성된 이미지를 만들 수 있어요.<br>다운로드하거나 카톡으로 공유해서 클럽원들과 함께 골라보세요.</p></div>
      <div class="vtw-grid">
        <section class="vtw-box"><h4><b>STEP 1</b>누가 입을까요?</h4>
          <div class="vtw-who">${whoOpts.map(([k, t]) => `<button type="button" class="vtw-whob ${k === st.who ? 'on' : ''}" data-who="${k}"><span class="ic">${[...k].map(g => `<i class="${g === 'F' ? 'f' : 'm'}"></i>`).join('')}</span>${t}</button>`).join('')}</div>
          <p class="vtw-note" style="margin-top:14px">같은 모델이 각 단체복을 입고 찍은 실제 사진으로 상의·하의를 바꿔 보여드려요.</p>
        </section>
        <section class="vtw-box"><h4><b>STEP 2</b>단체복 고르기</h4>
          <div class="vtw-tabs" role="tablist" data-r="tabs"></div>
          <div data-r="items"></div>
        </section>
        <div class="vtw-col3">
          <div class="vtw-preview"><canvas width="${W}" height="${H}" aria-label="우리 단체복 미리보기"></canvas></div>
          <section class="vtw-box"><h4><b>STEP 3</b>우리 클럽 정보</h4>
            <div class="vtw-field"><span>클럽 로고 (선택)</span>
              <div class="vtw-logo"><div class="lg" data-r="lg">로고</div><label>로고 올리기<input type="file" accept="image/*" data-r="logoIn" hidden></label><button type="button" class="rm" data-r="logoRm" hidden>지우기</button></div></div>
            <label class="vtw-field"><span>클럽명</span><input type="text" data-r="club" maxlength="24" placeholder="예: 스포플 배드민턴 클럽"></label>
            <label class="vtw-field"><span>현수막 문구 (선택)</span><input type="text" data-r="sub" maxlength="30" value="BADMINTON CLUB"></label>
            <div class="vtw-btns">
              <button type="button" class="dark" data-r="dl">이미지 다운로드</button>
              <button type="button" class="line" data-r="share">공유하기</button>
              <button type="button" class="full" data-r="copy">링크 복사해서 카톡에 붙여넣기</button>
            </div>
            <button type="button" class="vtw-up" data-r="up">우리 조합 갤러리에 올리기</button>
            <p class="vtw-note">※ 사진을 이어 붙여 만든 이미지라 실제 제품의 색상·핏·디테일과 다를 수 있어요. 참고용으로만 봐 주세요.</p>
            <p class="vtw-cta" data-r="cta" hidden>이 조합이 마음에 드시나요? <a href="#" data-r="ask">단체복 견적 문의하기</a></p>
          </section>
        </div>
      </div>
      <section class="vtw-gal" data-r="galWrap" hidden>
        <div class="vtw-gal-head"><h4>클럽들이 고른 단체복 <small data-r="galCnt"></small></h4><button type="button" class="vtw-up sm" data-r="up2">+ 우리 조합 올리기</button></div>
        <div class="vtw-gal-grid" data-r="gal"></div>
      </section>
      <div class="vtw-modal" data-r="login"><div class="vtw-modal-card"><h5>로그인이 필요해요</h5><p>로그인하시면 우리 클럽 단체복 조합을<br>갤러리에 올려 저장할 수 있어요.</p>
        <div class="vtw-modal-btns"><a class="dark" data-r="loginGo" href="/member/login.html">로그인하기</a><button type="button" class="line" data-r="loginStay">계속 둘러보기</button></div></div></div>
      <div class="vtw-toast" data-r="toast"></div>`;
    const R = {}; root.querySelectorAll('[data-r]').forEach(n => { R[n.dataset.r] = n; });
    const canvas = root.querySelector('canvas'), ctx = canvas.getContext('2d');
    // 단체복 문의 페이지 주소가 정해지면: window.LOOKBOOK_TEAMWEAR_ASK_URL = '/board/…' → 문의 버튼이 보임
    if (window.LOOKBOOK_TEAMWEAR_ASK_URL) { R.ask.href = window.LOOKBOOK_TEAMWEAR_ASK_URL; R.cta.hidden = false; }

    // 이미지 미리 받아두기 → 클릭할 때마다 바로 다시 그림
    const cache = new Map(), ready = new Map();
    const getImg = (src) => { if (!src) return Promise.resolve(null); if (!cache.has(src)) cache.set(src, loadImg(src).catch(() => null)); return cache.get(src); };
    const want = (src) => { if (!src || ready.has(src)) return ready.get(src); getImg(src).then(im => { ready.set(src, im); draw(); }); return null; };
    ['F', 'M'].forEach(g => looks(g).forEach(l => getImg(asset(l.photo)).then(im => { ready.set(asset(l.photo), im); draw(); })));
    getImg(asset('sim/spofl-wm.png')).then(im => { ready.set('wm', im); draw(); });

    /* 상의 룩 윗부분 + 하의 룩 아랫부분 이어 붙이기 (조합별로 한 번 만들고 재사용) */
    const mix = new Map();
    function compose(g) {
      const s = st.sel[g], A = L(g, s.top), B = L(g, s.bottom === undefined ? s.top : s.bottom);
      if (!A || !B) return null;
      const key = `${g}|${A.id}|${B.id}`; if (mix.has(key)) return mix.get(key);
      const ia = want(asset(A.photo)), ib = want(asset(B.photo)); if (!ia || !ib) return null;
      const cw = CV.w, ch = CV.h, y0 = CV.shoulderY;
      const c = document.createElement('canvas'); c.width = cw; c.height = ch; const x = c.getContext('2d');
      x.drawImage(ib, 0, 0, cw, ch);
      if (A.id !== B.id) {
        // 하의 룩의 상의가 더 길면, 위 룩 상의를 그만큼 살짝 늘려서 덮음 (허리에 다른 옷이 비치지 않게)
        const hemA = A.hem, hemB = B.hem, seam = Math.max(hemA, hemB) + 6, k = hemB > hemA ? (hemB - y0) / (hemA - y0) : 1;
        const t = document.createElement('canvas'); t.width = cw; t.height = ch; const tx = t.getContext('2d');
        tx.drawImage(ia, 0, 0, cw, y0, 0, 0, cw, y0);
        tx.drawImage(ia, 0, y0, cw, ch - y0, 0, y0, cw, (ch - y0) * k);
        const gr = tx.createLinearGradient(0, seam - 8, 0, seam + 8);
        gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
        tx.globalCompositeOperation = 'destination-in'; tx.fillStyle = gr; tx.fillRect(0, 0, cw, ch);
        // 아래 룩의 윗부분(다른 상의)은 지우고 → 위 룩 상의가 더 좁아도 옆구리에 다른 옷이 비치지 않음
        const er = x.createLinearGradient(0, seam - 8, 0, seam + 8);
        er.addColorStop(0, 'rgba(0,0,0,1)'); er.addColorStop(1, 'rgba(0,0,0,0)');
        x.globalCompositeOperation = 'destination-out'; x.fillStyle = er; x.fillRect(0, 0, cw, seam + 8);
        x.globalCompositeOperation = 'source-over';
        x.drawImage(t, 0, 0);
      }
      mix.set(key, c); return c;
    }

    /* STEP 2 목록 */
    function itemsHTML() {
      const g = st.tab, sel = st.sel[g];
      const card = (l, part) => {
        const it = l[part], on = sel[part] === l.id;
        const pair = part === 'top' && it.pair && L(g === 'F' ? 'M' : 'F', it.pair);
        return `<div class="vtw-item ${on ? 'on' : ''}"><button type="button" style="display:block;width:100%" data-pick="${esc(l.id)}" data-part="${part}">
          <div class="th"><img src="${esc(asset(it.icon))}" alt="" loading="lazy" onerror="this.remove()"></div>
          <div class="nm">${esc(it.name || l.id)}</div></button>
          ${pair ? `<button type="button" class="vtw-pair" data-pair="${esc(l.id)}" title="남자·여자 모두 같은 상품으로 입기">남녀 같이 입기</button>` : ''}</div>`;
      };
      return `<p class="vtw-part">상의</p><div class="vtw-items">${tops(g).map(l => card(l, 'top')).join('')}</div>
        <p class="vtw-part">하의 (바지·치마)</p><div class="vtw-items">${bottoms(g).map(l => card(l, 'bottom')).join('')}</div>`;
    }
    function renderItems() {
      const tabsFor = st.who === 'FM' ? ['F', 'M'] : [st.who];
      if (!tabsFor.includes(st.tab)) st.tab = tabsFor[0];
      R.tabs.style.gridTemplateColumns = `repeat(${tabsFor.length},1fr)`;
      R.tabs.innerHTML = tabsFor.map(g => `<button type="button" class="${g === st.tab ? 'on' : ''}" data-tab="${g}">${g === 'F' ? '여자' : '남자'}</button>`).join('');
      R.items.innerHTML = itemsHTML();
    }

    /* 캔버스 합성 */
    let raf = 0;
    function draw() { cancelAnimationFrame(raf); raf = requestAnimationFrame(paint); }
    function paint() {
      drawCourt(); drawBanner();
      const order = st.who === 'FM' ? ['F', 'M'] : [st.who];
      const ph = order.length > 1 ? H * 0.70 : H * 0.72;          // 사람 키 (화면 높이 대비)
      const scale = ph / CV.h, pw = CV.w * scale, foot = H * 0.975;
      const xs = order.length > 1 ? [W * 0.37, W * 0.63] : [W / 2];
      order.forEach((g, i) => {
        const c = compose(g); const cx = xs[i];
        ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.filter = 'blur(10px)';
        ctx.beginPath(); ctx.ellipse(cx, foot - H * 0.03, pw * 0.2, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        if (c) ctx.drawImage(c, cx - pw / 2, foot - ph, pw, ph);
        else { ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.font = '600 26px Pretendard, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('불러오는 중…', cx, H * 0.62); }
      });
      watermark();
    }
    function drawCourt() {                                   // 흰색 스튜디오 배경 (벽 + 바닥이 부드럽게 이어짐)
      let g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#ffffff'); g.addColorStop(0.62, '#fbfbfa'); g.addColorStop(0.80, '#f1f1ef'); g.addColorStop(1, '#ebebe8');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      g = ctx.createRadialGradient(W / 2, H * 0.45, W * 0.15, W / 2, H * 0.5, W * 0.85);   // 가장자리 살짝 어둡게 (조명 느낌)
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.06)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    // 실제 비닐 현수막처럼: 살짝 처진 물결 + 천 주름 음영 + 금속 고리 + 끈 + 벽 그림자
    let bannerCache = null, bannerKey = '';
    function bannerFace(bw, bh) {
      const key = [st.club, st.sub, !!st.logo, bw, bh].join('|');
      if (bannerCache && bannerKey === key) return bannerCache;
      const c = document.createElement('canvas'); c.width = bw; c.height = bh; const x = c.getContext('2d');
      let g = x.createLinearGradient(0, 0, 0, bh); g.addColorStop(0, '#1b1b1d'); g.addColorStop(1, '#0d0d0e');
      x.fillStyle = g; x.fillRect(0, 0, bw, bh);
      x.strokeStyle = 'rgba(255,255,255,.22)'; x.lineWidth = 3; x.strokeRect(22, 22, bw - 44, bh - 44);   // 인쇄 테두리
      let tx = 56;
      if (st.logo) {
        const s = bh - 70, cx = 44 + s / 2, cy = bh / 2;
        x.save(); x.beginPath(); x.arc(cx, cy, s / 2, 0, Math.PI * 2); x.fillStyle = '#fff'; x.fill(); x.clip();
        const r = Math.min((s * 0.8) / st.logo.width, (s * 0.8) / st.logo.height);
        x.drawImage(st.logo, cx - st.logo.width * r / 2, cy - st.logo.height * r / 2, st.logo.width * r, st.logo.height * r); x.restore();
        tx = 44 + s + 30;
      }
      const name = st.club.trim() || '우리 클럽 이름', sub = st.sub.trim();
      const font = (fs) => `900 ${fs}px Pretendard, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif`;
      const maxW = bw - 56 - tx; let fs = 84; x.font = font(fs);
      while (x.measureText(name).width > maxW && fs > 30) { fs -= 2; x.font = font(fs); }
      const center = !st.logo, x0 = center ? bw / 2 : tx;
      x.textAlign = center ? 'center' : 'left';
      x.fillStyle = st.club.trim() ? '#fff' : 'rgba(255,255,255,.45)';
      x.fillText(name, x0, bh / 2 + (sub ? fs * 0.16 : fs * 0.36));
      if (sub) { x.font = '700 24px Pretendard, sans-serif'; x.fillStyle = '#f2d34b'; x.fillText(sub.split('').join(' '), x0, bh / 2 + fs * 0.16 + 40); }
      // 비닐 광택 + 세로 주름 음영
      g = x.createLinearGradient(0, 0, 0, bh); g.addColorStop(0, 'rgba(255,255,255,.10)'); g.addColorStop(.35, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,.18)');
      x.fillStyle = g; x.fillRect(0, 0, bw, bh);
      [[0.18, .07], [0.33, -.06], [0.52, .05], [0.71, -.07], [0.86, .05]].forEach(([p, a]) => {
        const cx = bw * p, gg = x.createLinearGradient(cx - 40, 0, cx + 40, 0);
        gg.addColorStop(0, 'rgba(0,0,0,0)'); gg.addColorStop(.5, a > 0 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${-a * 2})`); gg.addColorStop(1, 'rgba(0,0,0,0)');
        x.fillStyle = gg; x.fillRect(cx - 40, 0, 80, bh);
      });
      bannerCache = c; bannerKey = key; return c;
    }
    function drawBanner() {
      const bw = Math.round(W * 0.84), bh = Math.round(H * 0.15), bx = (W - bw) / 2, by = H * 0.085, sag = 10;
      const face = bannerFace(bw, bh);
      const yAt = (u) => by + Math.sin(u * Math.PI) * sag;       // 가운데가 살짝 처짐
      // 끈 (양 끝 고리 → 화면 위쪽 모서리)
      ctx.strokeStyle = 'rgba(70,70,70,.75)'; ctx.lineWidth = 2.2;
      [[bx + 18, by + 18, 30, 0], [bx + bw - 18, by + 18, W - 30, 0]].forEach(([x1, y1, x2, y2]) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo((x1 + x2) / 2, y1 - 20, x2, y2); ctx.stroke(); });
      // 벽 그림자
      ctx.save(); ctx.filter = 'blur(14px)'; ctx.fillStyle = 'rgba(0,0,0,.20)';
      ctx.beginPath(); ctx.moveTo(bx + 10, by + 22);
      for (let i = 0; i <= 20; i++) { const u = i / 20; ctx.lineTo(bx + 10 + u * bw, yAt(u) + 22); }
      for (let i = 20; i >= 0; i--) { const u = i / 20; ctx.lineTo(bx + 10 + u * bw, yAt(u) + bh + 26); }
      ctx.fill(); ctx.restore();
      // 현수막 본체: 세로 띠로 나눠 물결지게
      const strips = 180, sw = bw / strips;
      for (let i = 0; i < strips; i++) {
        const u = (i + .5) / strips, y = yAt(u) + Math.sin(u * Math.PI * 4) * 1.6;
        ctx.drawImage(face, i * sw, 0, sw + 1, bh, bx + i * sw, y, sw + 1, bh);
      }
      // 금속 고리 (모서리 + 위아래 가운데)
      const ring = (x, y) => { ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fillStyle = '#c9c9c9'; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = '#8d8d8d'; ctx.stroke();
        ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fillStyle = '#ececec'; ctx.fill(); };
      [0, 0.5, 1].forEach(u => { const x = bx + 18 + u * (bw - 36); ring(x, yAt(u) + 18); ring(x, yAt(u) + bh - 18); });
    }
    function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
    let wmDark = null;                                       // 흰 배경용: 워터마크 로고를 검정으로
    function watermark() {
      const wm = ready.get('wm');
      ctx.save(); ctx.globalAlpha = .9;
      if (wm && !wmDark) { const t = document.createElement('canvas'); t.width = wm.width; t.height = wm.height; const tx = t.getContext('2d'); tx.drawImage(wm, 0, 0); tx.globalCompositeOperation = 'source-in'; tx.fillStyle = '#111'; tx.fillRect(0, 0, t.width, t.height); wmDark = t; }
      if (wmDark) { const ww = 200, wh = wmDark.height * (ww / wmDark.width); ctx.drawImage(wmDark, W - ww - 34, H - wh - 30, ww, wh); }
      ctx.restore();
      ctx.font = '500 19px Pretendard, sans-serif'; ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.textAlign = 'left';
      ctx.fillText('합성 이미지 · 실제 제품과 다를 수 있어요', 34, H - 36);
    }

    /* 이벤트 */
    root.addEventListener('click', e => {
      const wb = e.target.closest('[data-who]');
      if (wb) { st.who = wb.dataset.who; root.querySelectorAll('.vtw-whob').forEach(x => x.classList.toggle('on', x === wb)); renderItems(); draw(); return; }
      const tb = e.target.closest('.vtw-tabs [data-tab]');
      if (tb) { st.tab = tb.dataset.tab; renderItems(); return; }
      const pr = e.target.closest('[data-pair]');
      if (pr) {
        const g = st.tab, o = g === 'F' ? 'M' : 'F', l = L(g, pr.dataset.pair);
        st.sel[g].top = l.id; st.sel[o].top = l.top.pair;
        if (st.who !== 'FM' && whoOpts.some(([k]) => k === 'FM')) { st.who = 'FM'; root.querySelectorAll('.vtw-whob').forEach(x => x.classList.toggle('on', x.dataset.who === 'FM')); }
        renderItems(); draw(); toast('남녀 같은 상의로 입혔어요'); return;
      }
      const pk = e.target.closest('[data-pick]');
      if (pk) { st.sel[st.tab][pk.dataset.part] = pk.dataset.pick; renderItems(); draw(); return; }
    });
    R.club.addEventListener('input', () => { st.club = R.club.value; draw(); });
    R.sub.addEventListener('input', () => { st.sub = R.sub.value; draw(); });
    R.logoIn.addEventListener('change', () => {
      const f = R.logoIn.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => loadImg(rd.result).then(im => { st.logo = im; R.lg.style.backgroundImage = `url("${rd.result}")`; R.lg.textContent = ''; R.logoRm.hidden = false; draw(); }).catch(() => toast('이미지를 읽지 못했어요'));
      rd.readAsDataURL(f); R.logoIn.value = '';
    });
    R.logoRm.addEventListener('click', () => { st.logo = null; R.lg.style.backgroundImage = ''; R.lg.textContent = '로고'; R.logoRm.hidden = true; draw(); });

    // 파일명은 영문으로 (한글 파일명은 일부 브라우저에서 'download'로 바뀌어 저장됨)
    const fileName = () => { const d = new Date(), p = n => String(n).padStart(2, '0'); return `SPOFL_teamwear_${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}.jpg`; };
    const toBlob = () => new Promise(r => { paint(); try { canvas.toBlob(r, 'image/jpeg', 0.92); } catch { r(null); } });
    R.dl.addEventListener('click', async () => {
      const b = await toBlob(); if (!b) return toast('이미지를 만들지 못했어요');
      const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = fileName(); document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000); toast('이미지를 저장했어요');
    });
    const copyLink = async () => {
      try { await navigator.clipboard.writeText(shareUrl); toast('링크를 복사했어요 · 카톡에 붙여넣기 하세요'); }
      catch { prompt('아래 링크를 복사하세요', shareUrl); }
    };
    R.copy.addEventListener('click', copyLink);
    R.share.addEventListener('click', async () => {
      const b = await toBlob();
      const file = b && new File([b], fileName(), { type: 'image/jpeg' });
      const text = `${st.club.trim() ? st.club.trim() + ' ' : ''}우리 단체복 이 조합 어때? 👕🏸`;
      try {
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text, title: 'SPOFL 단체복 미리보기' }); return; }
        if (navigator.share) { await navigator.share({ text, url: shareUrl, title: 'SPOFL 단체복 미리보기' }); return; }
      } catch (err) { if (err && err.name === 'AbortError') return; }
      await copyLink();
    });
    let tt; function toast(m) { R.toast.textContent = m; R.toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => R.toast.classList.remove('on'), 2000); }

    /* ===== 갤러리 (카페24 게시판에 저장 · 로그인한 사람만 올리기 · 관리자는 카페24에서 삭제) ===== */
    const boardNo = +GAL.boardNo || 0, hiddenNos = new Set((GAL.hidden || []).map(Number));
    const boardList = () => `/board/gallery/list.html?board_no=${boardNo}`;
    const boardWrite = () => `/board/gallery/write.html?board_no=${boardNo}`;
    function outfitText() {
      const order = st.who === 'FM' ? ['F', 'M'] : [st.who];
      return order.map(g => {
        const s = st.sel[g], t = L(g, s.top), b = L(g, s.bottom);
        return `${g === 'F' ? '여자' : '남자'} ${t?.top?.name || '-'} + ${b?.bottom?.name || '-'}`;
      }).join(' / ');
    }
    const postTitle = () => `[${(st.club.trim() || '클럽명 없음').replace(/[\[\]]/g, '')}] ${outfitText()}`.slice(0, 120);
    function parseTitle(t) {
      const m = String(t).match(/^\s*\[([^\]]*)\]\s*(.*)$/);
      return m ? { club: m[1], lines: m[2].split(/\s*\/\s*/).filter(Boolean) } : { club: t, lines: [] };
    }
    function parseBoard(html) {
      const doc = new DOMParser().parseFromString(html, 'text/html'), map = new Map();
      doc.querySelectorAll('a[href*="read.html"]').forEach(a => {
        const href = a.getAttribute('href'), m = href.match(/[?&]no=(\d+)/); if (!m || !new RegExp(`board_no=${boardNo}(\\D|$)`).test(href)) return;
        const no = +m[1], li = a.closest('li') || a.parentElement, e = map.get(no) || { no, href: new URL(href, location.origin).href, title: '', img: '', date: '' };
        const img = li?.querySelector('img'); if (!e.img && img) e.img = img.getAttribute('src') || '';
        const tt = (li?.querySelector('.titleTxt, .subject, .title') || (a.querySelector('img') ? null : a))?.textContent?.trim(); if (!e.title && tt) e.title = tt;
        const d = li?.textContent.match(/\d{4}-\d{2}-\d{2}/); if (!e.date && d) e.date = d[0];
        map.set(no, e);
      });
      return [...map.values()].filter(e => e.title && !hiddenNos.has(e.no));
    }
    let galItems = [];
    async function loadGallery() {
      if (!boardNo) return;
      R.galWrap.hidden = false;
      try {
        const r = await fetch(boardList(), { credentials: 'include' }); if (!r.ok) throw 0;
        galItems = parseBoard(await r.text());
      } catch { R.gal.innerHTML = '<div class="vtw-empty">갤러리를 불러오지 못했어요.</div>'; return; }
      R.galCnt.textContent = galItems.length ? `${galItems.length}` : '';
      R.gal.innerHTML = galItems.length ? galItems.map(e => { const p = parseTitle(e.title); return `<a class="vtw-card" href="${esc(e.href)}" target="_blank" rel="noopener">
          <span class="ph">${e.img ? `<img src="${esc(e.img)}" alt="" loading="lazy">` : ''}</span>
          <b>${esc(p.club)}</b>${p.lines.map(l => `<span class="ln">${esc(l)}</span>`).join('')}${e.date ? `<span class="dt">${esc(e.date)}</span>` : ''}</a>`; }).join('')
        : '<div class="vtw-empty">아직 올라온 조합이 없어요. 첫 번째로 올려 보세요!</div>';
    }
    const loggedIn = () => {
      const q = new URLSearchParams(location.search); if (q.has('login')) return q.get('login') === '1';
      if (typeof window.LOOKBOOK_IS_LOGGED_IN === 'function') return !!window.LOOKBOOK_IS_LOGGED_IN();
      return !!document.querySelector('.xans-layout-statelogon');
    };
    function showLogin() {
      R.loginGo.href = `/member/login.html?returnUrl=${encodeURIComponent(location.pathname + location.search + '#teamwear')}`;
      R.login.classList.add('on');
    }
    R.loginStay.addEventListener('click', () => R.login.classList.remove('on'));
    R.login.addEventListener('click', e => { if (e.target === R.login) R.login.classList.remove('on'); });
    async function upload() {
      if (!boardNo) return toast('갤러리는 준비중이에요');
      if (!loggedIn()) return showLogin();
      if (!st.club.trim()) { R.club.focus(); return toast('클럽명을 먼저 입력해 주세요'); }
      const blob = await toBlob(); if (!blob) return toast('이미지를 만들지 못했어요');
      const title = postTitle(), body = `${title}\n\n${outfitText().split(' / ').join('\n')}\n\n(SPOFL 단체복 시뮬레이션으로 만든 이미지)`;
      const w = window.open(boardWrite(), 'vtw_write', 'width=980,height=900');
      if (!w) return fallback(blob, title, '팝업이 막혀 있어요.');
      toast('글쓰기 창에 이미지와 내용을 채우는 중…');
      const t0 = Date.now();
      const tick = async () => {
        if (w.closed) return;
        let ok = false;
        try {
          const d = w.document, subj = d.querySelector('input[name="subject"]');
          if (subj && d.readyState === 'complete') {
            subj.value = title; subj.dispatchEvent(new w.Event('input', { bubbles: true }));
            const ta = d.querySelector('textarea[name="content"]'); if (ta) ta.value = body;
            d.querySelectorAll('iframe').forEach(f => { try { const b = f.contentDocument?.body; if (b && b.isContentEditable !== false && /content|editor/i.test(f.id + f.name + f.className)) b.innerHTML = body.replace(/\n/g, '<br>'); } catch {} });
            const fi = d.querySelector('input[type="file"]');
            if (fi) { const dt = new w.DataTransfer(); dt.items.add(new w.File([await blob.arrayBuffer()], fileName(), { type: 'image/jpeg' })); fi.files = dt.files; fi.dispatchEvent(new w.Event('change', { bubbles: true })); }
            const tip = d.createElement('div');
            tip.textContent = '✓ 단체복 이미지와 내용이 자동으로 채워졌어요. 확인 후 아래 [등록]을 눌러 주세요.';
            tip.style.cssText = 'position:sticky;top:0;z-index:99999;background:#111;color:#fff;font:600 14px sans-serif;padding:12px 16px;text-align:center';
            d.body.prepend(tip); ok = true;
            toast(fi ? '새 창에서 [등록]만 누르면 올라가요' : '새 창에 이미지를 첨부하고 [등록]을 눌러 주세요');
            if (!fi) saveFile(blob);
          }
        } catch {}
        if (!ok && Date.now() - t0 < 20000) setTimeout(tick, 400);
        else if (!ok) fallback(blob, title, '글쓰기 창을 자동으로 채우지 못했어요.');
      };
      setTimeout(tick, 600);
    }
    async function fallback(blob, title, why) {
      saveFile(blob);
      try { await navigator.clipboard.writeText(title); } catch {}
      toast(`${why} 이미지를 저장하고 제목을 복사했어요 · 글쓰기에 붙여넣어 주세요`);
      if (boardNo) setTimeout(() => window.open(boardWrite(), '_blank'), 800);
    }
    function saveFile(blob) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fileName(); document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
    R.up.addEventListener('click', upload); R.up2.addEventListener('click', upload);
    window.addEventListener('focus', () => { if (root.isConnected) loadGallery(); });   // 글쓰기 창에서 등록하고 돌아오면 목록 새로고침
    if (!boardNo) R.up.hidden = true;
    loadGallery();

    renderItems(); draw();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
  }

  window.VictorTeamwear = { mount, version: VERSION };
})();
