/* =====================================================================
   VICTOR 단체복 시뮬레이션 — 룩북의 "단체복" 칩을 누를 때만 불러옵니다 (평소 룩북 속도에 영향 없음)
   STEP 1 모델 사진 → STEP 2 단체복(남/여 · 상의/하의) → STEP 3 로고·클럽명 + 미리보기 → 다운로드/공유
   모든 합성은 브라우저 안 캔버스에서 바로 처리 (서버 업로드 없음)
   ===================================================================== */
(function () {
  'use strict';
  if (window.VictorTeamwear) return;
  const VERSION = '20261119-tw1';
  const SCRIPT = document.currentScript;
  const BASE = SCRIPT && SCRIPT.src ? new URL('.', SCRIPT.src).href : location.href;
  const W = 1080, H = 1350;                                   // 결과 이미지 4:5 (SNS·카톡 공유용)
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const asset = (p) => !p ? '' : /^(https?:|data:|blob:|\/\/)/.test(p) ? p : new URL(p, BASE).href;
  const thumbUrl = (t) => !t ? '' : t.startsWith('drive:') ? `https://drive.google.com/thumbnail?id=${encodeURIComponent(t.slice(6))}&sz=w400` : asset(t);
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
  .vtw-model .ck{right:8px;top:8px;width:22px;height:22px;font-size:11px}
  .vtw-items{grid-template-columns:repeat(3,1fr);gap:8px}
}`;

  function mount(root, opts = {}) {
    if (!document.getElementById('vtw-style')) { const st = document.createElement('style'); st.id = 'vtw-style'; st.textContent = CSS; document.head.appendChild(st); }
    root.classList.add('vtw');
    root.innerHTML = '<div class="vtw-empty" style="text-align:center;padding:60px 0">단체복 시뮬레이션을 불러오는 중…</div>';
    const shareUrl = opts.shareUrl || (location.origin + location.pathname + location.search + '#teamwear');
    const done = (D) => build(root, D, shareUrl);
    if (window.TEAMWEAR_DATA) return done(window.TEAMWEAR_DATA);
    const sc = document.createElement('script');
    const u = new URL(opts.dataSrc || 'teamwear-data.js', BASE); u.searchParams.set('v', Math.floor(Date.now() / 300000)); sc.src = u.href;
    sc.onload = () => done(window.TEAMWEAR_DATA || { models: [], garments: [], layers: {} });
    sc.onerror = () => { root.innerHTML = '<div class="vtw-empty">단체복 데이터를 불러오지 못했어요 (teamwear-data.js)</div>'; };
    document.head.appendChild(sc);
  }

  function build(root, D, shareUrl) {
    const models = D.models || [], garments = D.garments || [], layers = D.layers || {};
    if (!models.length) { root.innerHTML = '<div class="vtw-empty">준비중입니다</div>'; return; }
    const G = (code) => garments.find(g => g.code === code);
    const forGender = (gender, part) => garments.filter(g => (g.part || 'top') === part && (g.gender === gender || g.gender === 'U'));
    const pairOf = (g) => {                                      // 남녀 세트: 코드 끝 F/M만 다른 상품 (공용 U는 자기 자신)
      if (!g) return null;
      if (g.gender === 'U') return { M: g.code, F: g.code };
      const base = g.code.slice(0, -1), m = G(base + 'M'), f = G(base + 'F');
      return m && f ? { M: m.code, F: f.code } : null;
    };
    const st = { model: models[0].id, tab: 'M', sel: { M: { top: null, bottom: null }, F: { top: null, bottom: null } }, club: '', sub: 'BADMINTON CLUB', logo: null };

    root.innerHTML = `
      <div class="vtw-intro"><h3>우리 클럽 단체복 미리 입어보기</h3>
        <p>모델 사진을 고르고, 단체복을 고르고, 우리 클럽 로고와 이름을 넣으면 배드민턴장 현수막까지 합성된 이미지를 바로 만들어요.<br>다운로드하거나 카톡으로 공유해서 클럽원들과 함께 골라보세요.</p></div>
      <div class="vtw-grid">
        <section class="vtw-box"><h4><b>STEP 1</b>모델 사진 고르기</h4>
          <div class="vtw-models">${models.map((m, i) => `<button type="button" class="vtw-model ${i === 0 ? 'on' : ''}" data-model="${esc(m.id)}" aria-label="모델 사진 ${i + 1}"><img src="${esc(asset(m.thumb))}" alt="" loading="${i === 0 ? 'eager' : 'lazy'}"><span class="ck">✓</span></button>`).join('')}</div>
        </section>
        <section class="vtw-box"><h4><b>STEP 2</b>단체복 고르기</h4>
          <div class="vtw-tabs" role="tablist"><button type="button" class="on" data-tab="M">남자 <small></small></button><button type="button" data-tab="F">여자 <small></small></button></div>
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
            <p class="vtw-note">※ 합성으로 만든 이미지라 실제 제품의 색상·핏·디테일과 다를 수 있어요. 참고용으로만 봐 주세요.</p>
            <p class="vtw-cta" data-r="cta" hidden>이 조합이 마음에 드시나요? <a href="#" data-r="ask">단체복 견적 문의하기</a></p>
          </section>
        </div>
      </div>
      <div class="vtw-toast" data-r="toast"></div>`;
    const R = {}; root.querySelectorAll('[data-r]').forEach(n => { R[n.dataset.r] = n; });
    const canvas = root.querySelector('canvas'), ctx = canvas.getContext('2d');
    // 단체복 문의 페이지 주소가 정해지면: window.LOOKBOOK_TEAMWEAR_ASK_URL = '/board/…' → 문의 버튼이 보임
    if (window.LOOKBOOK_TEAMWEAR_ASK_URL) { R.ask.href = window.LOOKBOOK_TEAMWEAR_ASK_URL; R.cta.hidden = false; }

    // 이미지 미리 받아두기 → 클릭할 때마다 바로 다시 그림
    const cache = new Map();
    const getImg = (src) => { if (!src) return Promise.resolve(null); if (!cache.has(src)) cache.set(src, loadImg(src).catch(() => null)); return cache.get(src); };
    const ready = new Map();                                   // src → Image (로딩 끝난 것)
    const want = (src) => { if (!src || ready.has(src)) return ready.get(src); getImg(src).then(im => { ready.set(src, im); draw(); }); return null; };
    models.forEach(m => getImg(asset(m.cutout)).then(im => { ready.set(asset(m.cutout), im); if (m.id === st.model) draw(); }));
    getImg(asset('sim/spofl-wm.png')).then(im => { ready.set('wm', im); draw(); });

    /* STEP 2 목록 */
    function itemsHTML() {
      const g = st.tab, sel = st.sel[g];
      const card = (x, part) => {
        const on = sel[part] === x.code, pair = pairOf(x);
        const th = thumbUrl(x.thumb);
        return `<div class="vtw-item ${on ? 'on' : ''}"><button type="button" style="display:block;width:100%" data-pick="${esc(x.code)}" data-part="${part}">
          <div class="th">${th ? `<img src="${esc(th)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()">` : ''}</div>
          ${x.gender === 'U' ? '<span class="g">공용</span>' : ''}
          <div class="nm">${esc(x.name || x.code)}</div><div class="cd">${esc(x.code)}</div></button>
          ${pair ? `<button type="button" class="vtw-pair" data-pair="${esc(x.code)}" data-part="${part}" title="남자·여자 모두 같은 상품으로 입기">남녀 같이 입기</button>` : ''}</div>`;
      };
      const none = (part) => `<div class="vtw-item none ${!sel[part] ? 'on' : ''}"><button type="button" style="display:block;width:100%" data-pick="" data-part="${part}"><div class="th">사진 그대로</div><div class="nm">기본</div><div class="cd">&nbsp;</div></button></div>`;
      const tops = forGender(g, 'top'), bottoms = forGender(g, 'bottom');
      return `<p class="vtw-part">상의</p><div class="vtw-items">${none('top')}${tops.map(x => card(x, 'top')).join('')}</div>
        <p class="vtw-part">하의 (바지·치마)</p>${bottoms.length ? `<div class="vtw-items">${none('bottom')}${bottoms.map(x => card(x, 'bottom')).join('')}</div>` : `<div class="vtw-empty">하의 단체복은 준비중이에요. 곧 바지·치마도 바꿔 입어볼 수 있어요.</div>`}`;
    }
    function renderItems() {
      R.items.innerHTML = itemsHTML();
      root.querySelectorAll('.vtw-tabs button').forEach(b => {
        b.classList.toggle('on', b.dataset.tab === st.tab);
        const s = st.sel[b.dataset.tab]; const n = [s.top, s.bottom].filter(Boolean).length;
        b.querySelector('small').textContent = n ? `${n}개 선택` : '';
      });
    }

    /* 캔버스 합성 */
    let raf = 0;
    function draw() { cancelAnimationFrame(raf); raf = requestAnimationFrame(paint); }
    function paint() {
      const m = models.find(x => x.id === st.model) || models[0];
      drawCourt();
      drawBanner();
      const cut = want(asset(m.cutout));
      let box = null;
      if (cut) {
        const h = m.fullBody ? H * 0.70 : H * 0.74;
        const w = cut.width * (h / cut.height);
        const x = (W - w) / 2, y = m.fullBody ? H * 0.965 - h : H - h;
        if (m.fullBody) {                                    // 발밑 그림자
          ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.filter = 'blur(10px)';
          ctx.beginPath(); ctx.ellipse(W / 2, H * 0.962, w * 0.42, 16, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        }
        ctx.drawImage(cut, x, y, w, h);
        box = { x, y, w, h };
        // 착장 레이어 (준비된 것만): '모델/사람/상품코드'
        let missing = [];
        m.people.forEach(p => ['bottom', 'top'].forEach(part => {
          const code = st.sel[p.gender][part]; if (!code) return;
          const src = layers[`${m.id}/${p.id}/${code}`];
          const im = src ? want(asset(src)) : null;
          if (im) ctx.drawImage(im, x, y, w, h); else missing.push([p, part, code]);
        }));
        missing.forEach(([p, part, code]) => tag(box, p, part, code));
      } else {
        ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.font = '600 30px Pretendard, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('이미지를 불러오는 중…', W / 2, H * 0.62);
      }
      watermark();
    }
    function drawCourt() {
      // 벽
      let g = ctx.createLinearGradient(0, 0, 0, H * 0.6);
      g.addColorStop(0, '#dfe5ec'); g.addColorStop(1, '#eef2f5');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H * 0.6);
      ctx.strokeStyle = 'rgba(30,45,70,.05)'; ctx.lineWidth = 2;
      for (let x = 60; x < W; x += 135) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H * 0.52); ctx.stroke(); }
      // 천장 조명 줄
      ctx.fillStyle = '#2a3140'; ctx.fillRect(0, 0, W, 26);
      for (let x = 90; x < W; x += 225) { ctx.fillStyle = 'rgba(255,255,240,.9)'; ctx.fillRect(x, 8, 120, 9); }
      // 벽 보호패드
      ctx.fillStyle = '#1f3157'; ctx.fillRect(0, H * 0.505, W, H * 0.095);
      ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(0, H * 0.505, W, 4);
      // 바닥 (코트)
      g = ctx.createLinearGradient(0, H * 0.6, 0, H);
      g.addColorStop(0, '#2f7a5c'); g.addColorStop(1, '#25674c');
      ctx.fillStyle = g; ctx.fillRect(0, H * 0.6, W, H * 0.4);
      // 원근 라인
      const yb = H * 0.62, yf = H * 1.08, L = (t, y) => W * (0.5 - t * (0.32 + 0.33 * (y - yb) / (yf - yb)));
      ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 5;
      const hline = (y, k = 1) => { ctx.beginPath(); ctx.moveTo(L(k, y), y); ctx.lineTo(W - L(k, y), y); ctx.stroke(); };
      hline(yb); hline(H * 0.70); hline(H * 0.86, 1);
      [1, 0.86].forEach(k => { ctx.beginPath(); ctx.moveTo(L(k, yb), yb); ctx.lineTo(L(k, yf), yf); ctx.moveTo(W - L(k, yb), yb); ctx.lineTo(W - L(k, yf), yf); ctx.stroke(); });
      ctx.beginPath(); ctx.moveTo(W / 2, H * 0.70); ctx.lineTo(W / 2, yf); ctx.stroke();
      // 바닥 광택
      g = ctx.createRadialGradient(W / 2, H * 0.78, 50, W / 2, H * 0.78, W * 0.7);
      g.addColorStop(0, 'rgba(255,255,255,.10)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.fillRect(0, H * 0.6, W, H * 0.4);
    }
    function drawBanner() {
      const bx = W * 0.07, by = H * 0.075, bw = W * 0.86, bh = H * 0.155;
      // 매다는 줄
      ctx.strokeStyle = 'rgba(40,40,40,.55)'; ctx.lineWidth = 2;
      [[bx + 14, by + 12], [bx + bw - 14, by + 12]].forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (x < W / 2 ? -30 : 30), 26); ctx.stroke(); });
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8;
      ctx.fillStyle = '#111'; ctx.fillRect(bx, by, bw, bh); ctx.restore();
      // 천 느낌
      const g = ctx.createLinearGradient(0, by, 0, by + bh);
      g.addColorStop(0, 'rgba(255,255,255,.07)'); g.addColorStop(.5, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,.12)');
      ctx.fillStyle = g; ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.lineWidth = 2; ctx.strokeRect(bx + 10, by + 10, bw - 20, bh - 20);
      [[bx + 14, by + 12], [bx + bw - 14, by + 12], [bx + 14, by + bh - 12], [bx + bw - 14, by + bh - 12]].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fillStyle = '#bbb'; ctx.fill(); });
      // 로고
      let tx = bx + 40;
      if (st.logo) {
        const s = bh - 40, cx = bx + 30 + s / 2, cy = by + bh / 2;
        ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, s / 2, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.clip();
        const r = Math.min((s * 0.8) / st.logo.width, (s * 0.8) / st.logo.height);
        ctx.drawImage(st.logo, cx - st.logo.width * r / 2, cy - st.logo.height * r / 2, st.logo.width * r, st.logo.height * r);
        ctx.restore(); tx = bx + 30 + s + 28;
      }
      // 클럽명 (길면 글자 크기 자동 축소)
      const name = st.club.trim() || '우리 클럽 이름';
      const maxW = bx + bw - 40 - tx;
      let fs = 74; ctx.font = `800 ${fs}px Pretendard, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif`;
      while (ctx.measureText(name).width > maxW && fs > 30) { fs -= 2; ctx.font = `800 ${fs}px Pretendard, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif`; }
      const center = !st.logo, x0 = center ? W / 2 : tx;
      ctx.textAlign = center ? 'center' : 'left'; ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = st.club.trim() ? '#fff' : 'rgba(255,255,255,.45)';
      const sub = st.sub.trim();
      ctx.fillText(name, x0, by + bh / 2 + (sub ? fs * 0.18 : fs * 0.36));
      if (sub) { ctx.font = `600 22px Pretendard, sans-serif`; ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.fillText(sub.split('').join(' '), x0, by + bh / 2 + fs * 0.18 + 36); }
    }
    function tag(b, p, part, code) {                       // 착장 이미지가 아직 없을 때: 선택한 옷 이름표
      const g = G(code); if (!g) return;
      const x = b.x + b.w * p.x, y = b.y + b.h * (part === 'top' ? p.topY : p.bottomY);
      const t = `${part === 'top' ? '상의' : '하의'} · ${g.name || g.code}`;
      ctx.font = '700 24px Pretendard, sans-serif'; const tw = ctx.measureText(t).width + 40;
      ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 10;
      ctx.fillStyle = 'rgba(17,17,17,.88)'; roundRect(x - tw / 2, y - 24, tw, 48, 24); ctx.fill(); ctx.restore();
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t, x, y + 1); ctx.textBaseline = 'alphabetic';
    }
    function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
    function watermark() {
      const wm = ready.get('wm');
      ctx.save(); ctx.globalAlpha = .9;
      if (wm) { const ww = 200, wh = wm.height * (ww / wm.width); ctx.drawImage(wm, W - ww - 34, H - wh - 30, ww, wh); }
      ctx.restore();
      ctx.font = '500 19px Pretendard, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,.82)'; ctx.textAlign = 'left';
      ctx.fillText('합성 이미지 · 실제 제품과 다를 수 있어요', 34, H - 36);
    }

    /* 이벤트 */
    root.addEventListener('click', e => {
      const md = e.target.closest('[data-model]');
      if (md) { st.model = md.dataset.model; root.querySelectorAll('.vtw-model').forEach(x => x.classList.toggle('on', x === md)); draw(); return; }
      const tb = e.target.closest('.vtw-tabs [data-tab]');
      if (tb) { st.tab = tb.dataset.tab; renderItems(); return; }
      const pr = e.target.closest('[data-pair]');
      if (pr) {
        const pair = pairOf(G(pr.dataset.pair)), part = pr.dataset.part;
        if (pair) { st.sel.M[part] = pair.M; st.sel.F[part] = pair.F; renderItems(); draw(); toast('남녀 같은 상품으로 입혔어요'); }
        return;
      }
      const pk = e.target.closest('[data-pick]');
      if (pk) { st.sel[st.tab][pk.dataset.part] = pk.dataset.pick || null; renderItems(); draw(); return; }
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

    renderItems(); draw();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
  }

  window.VictorTeamwear = { mount, version: VERSION };
})();
