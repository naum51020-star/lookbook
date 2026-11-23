/* =====================================================================
   VICTOR 단체복 시뮬레이션 — 룩북의 "단체복" 칩을 누를 때만 불러옵니다 (평소 룩북 속도에 영향 없음)
   STEP 1 모델 사진 → STEP 2 단체복(남/여 · 상의/하의) → STEP 3 로고·클럽명 + 미리보기 → 다운로드/공유
   모든 합성은 브라우저 안 캔버스에서 바로 처리 (서버 업로드 없음)
   ===================================================================== */
(function () {
  'use strict';
  if (window.VictorTeamwear) return;
  // 현수막 'VICTOR ×' 로고와 SPOFL 워터마크를 파일 안에 포함 (별도 이미지 업로드 없이 동작)
  const IMG_VX = 'data:image/png;base64,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';
  const IMG_WM = 'data:image/png;base64,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';
  const VERSION = '20261123-tw6';
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
      club: '', logo: null,
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
            <div class="vtw-field"><span>클럽 로고 (선택 · 투명 배경 PNG 추천)</span>
              <div class="vtw-logo"><div class="lg" data-r="lg">로고</div><label>로고 올리기<input type="file" accept="image/*" data-r="logoIn" hidden></label><button type="button" class="rm" data-r="logoRm" hidden>지우기</button></div></div>
            <label class="vtw-field"><span>클럽명 (현수막에 들어가요)</span><input type="text" data-r="club" maxlength="24" placeholder="예: TEAM VICTOR"></label>
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
    getImg(IMG_WM).then(im => { ready.set('wm', im); draw(); });
    getImg(IMG_VX).then(im => { ready.set('vx', im); draw(); });

    /* 상의 룩 윗부분 + 하의 룩 아랫부분 이어 붙이기 (조합별로 한 번 만들고 재사용) */
    const mix = new Map();
    function compose(g) {
      const s = st.sel[g], A = L(g, s.top), B = L(g, s.bottom === undefined ? s.top : s.bottom);
      if (!A || !B) return null;
      const ref = looks(g)[0];                                   // 머리는 항상 이 기준 룩에서 → 옷을 바꿔도 머리 크기 그대로
      const key = `${g}|${A.id}|${B.id}`; if (mix.has(key)) return mix.get(key);
      const ia = want(asset(A.photo)), ib = want(asset(B.photo)), ir = want(asset(ref.photo)); if (!ia || !ib || !ir) return null;
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
      const hy = (CV.headY || {})[g];
      if (hy && A.id !== ref.id) {
        // 머리·얼굴만 기준 룩에서 가져옴: 가운데 타원 모양으로 부드럽게 → 어깨선은 원래 사진 그대로 (어깨 자글거림 방지)
        const hw = cw * 0.20, cx = cw / 2, top = 0;
        const h = document.createElement('canvas'); h.width = cw; h.height = hy + 30; const hx = h.getContext('2d');
        hx.drawImage(ir, 0, 0, cw, hy + 30, 0, 0, cw, hy + 30);
        const m = document.createElement('canvas'); m.width = cw; m.height = hy + 30; const mx = m.getContext('2d');
        mx.filter = 'blur(10px)'; mx.fillStyle = '#000';
        mx.beginPath(); mx.ellipse(cx, (top + hy) / 2, hw, (hy - top) / 2 + 6, 0, 0, Math.PI * 2); mx.fill();
        hx.globalCompositeOperation = 'destination-in'; hx.drawImage(m, 0, 0);
        x.save(); x.globalCompositeOperation = 'destination-out'; x.drawImage(m, 0, 0); x.restore();
        x.drawImage(h, 0, 0);
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
      const ph = H * 0.73;                                        // 사람 키 (현수막 아래에 적당한 여백)
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
    // 현수막 = 디자인 요소: 남색 띠(VICTOR × 클럽 로고/클럽명) + 흰 줄 + 주황 띠
    function drawBanner() {
      const BH = Math.round(W * 316 / 1594), navyH = Math.round(BH * 236 / 316), whiteH = Math.round(BH * 18 / 316);
      ctx.fillStyle = '#173383'; ctx.fillRect(0, 0, W, navyH);
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, navyH, W, whiteH);
      ctx.fillStyle = '#dd742b'; ctx.fillRect(0, navyH + whiteH, W, BH - navyH - whiteH);
      const vx = ready.get('vx'); if (!vx) return;
      const gh = navyH * 0.30, gw = vx.width * (gh / vx.height), gap = gh * 0.55, cy = navyH / 2;
      // 오른쪽 내용: 로고 → 클럽명 (둘 다 넣으면 나란히)
      const name = st.club.trim(), parts = [];
      if (st.logo) { const lh = navyH * 0.46, lw = Math.min(st.logo.width * (lh / st.logo.height), W * 0.42); parts.push({ w: lw, draw: (x) => ctx.drawImage(st.logo, x, cy - (lw * st.logo.height / st.logo.width) / 2, lw, lw * st.logo.height / st.logo.width) }); }
      if (name) {
        let fs = navyH * 0.40; const sx = 0.86, font = (f) => `900 ${f}px Pretendard, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif`;
        ctx.font = font(fs); const room = W * 0.9 - gw - gap - parts.reduce((t, p) => t + p.w + gap * 0.6, 0);
        while (ctx.measureText(name).width * sx > room && fs > 18) { fs -= 1; ctx.font = font(fs); }
        const tw = ctx.measureText(name).width * sx;
        parts.push({ w: tw, draw: (x) => { ctx.save(); ctx.font = font(fs); ctx.fillStyle = '#fff'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.translate(x, cy + fs * 0.04); ctx.scale(sx, 1); ctx.fillText(name, 0, 0); ctx.restore(); } });
      }
      const contentW = parts.reduce((t, p, i) => t + p.w + (i ? gap * 0.6 : 0), 0);
      const x0 = parts.length ? (W - (gw + gap + contentW)) / 2 : W * 295 / 1594;   // 비어 있으면 'VICTOR ×'만 왼쪽 자리에
      ctx.drawImage(vx, x0, cy - gh / 2, gw, gh);
      let px = x0 + gw + gap; parts.forEach(p => { p.draw(px); px += p.w + gap * 0.6; });
    }
    function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
    let wmTile = null;                                       // 회색 SPOFL 로고 (한 번 만들어 재사용)
    function watermark() {
      const wm = ready.get('wm');
      if (wm && !wmTile) { const t = document.createElement('canvas'); t.width = wm.width; t.height = wm.height; const tx = t.getContext('2d'); tx.drawImage(wm, 0, 0); tx.globalCompositeOperation = 'source-in'; tx.fillStyle = '#a0a0a0'; tx.fillRect(0, 0, t.width, t.height); wmTile = t; }
      if (wmTile) {
        const ww = 170, wh = wmTile.height * (ww / wmTile.width), sx = 300, sy = 190;
        ctx.save(); ctx.globalAlpha = 0.22; ctx.translate(W / 2, H / 2); ctx.rotate(-20 * Math.PI / 180);
        for (let y = -H, r = 0; y < H; y += sy, r++) for (let x = -W - (r % 2) * sx / 2; x < W; x += sx) ctx.drawImage(wmTile, x, y, ww, wh);
        ctx.restore();
      }
      ctx.font = '500 19px Pretendard, sans-serif'; ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      ctx.fillText('합성 이미지 · 실제 제품과 다를 수 있어요', 34, H - 30);
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
