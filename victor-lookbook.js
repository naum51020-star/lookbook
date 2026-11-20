/* =====================================================================
   VICTOR LOOKBOOK — 끼워 넣기용 스크립트
   어느 페이지에든 아래 두 줄이면 룩북이 그려집니다.
     <div id="victor-lookbook"></div>
     <script src="(이 파일 경로)/victor-lookbook.js"></script>

   옵션 (div에 data-* 로 지정)
     data-src        : 데이터 파일 주소 (기본: 이 스크립트와 같은 폴더의 victor-lookbook-data.js)
     data-pad-top    : 위쪽 여백 px (기본 60)
     data-set-title  : "1"이면 브라우저 탭 제목을 룩북 제목으로 바꿈 (단독 페이지용)
   사이트 스타일과 섞이지 않도록 모든 클래스는 vlb- 로 시작합니다.
   ===================================================================== */
(function () {
  'use strict';
  if (window.VictorLookbook) return;

  const VERSION = '20261120-twadmin';                     // 관리자 미리보기에서 예전 파일인지 확인하는 용도
  const SCRIPT = document.currentScript;
  const SCRIPT_BASE = SCRIPT && SCRIPT.src ? new URL('.', SCRIPT.src).href : location.href;

  const CONFIG = {
    sheetSide: 'right',                                   // PC 시트 방향: 'right' | 'left' (모바일은 아래에서 올라옴)
    api: new URLSearchParams(location.search).get('api') || 'https://api.spofl.co.kr',   // 사이트가 쓰는 API 서버 (테스트용: ?api=주소)
    productApi: (no) => `/api/v1/product/recommendMap/${no}`,
    productPage: (no) => `/product/detail.html?product_no=${no}`,
    loginUrl: '/member/login.html',
    basketUrl: '/order/basket.html',
  };
  const qs = new URLSearchParams(location.search);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const won = (n) => Number(n).toLocaleString('ko-KR') + '원';
  const ICON_BAG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>';

  /* ---------------------------------------------------------------- CSS */
  const CSS = `
.vlb,.vlb-layer{--fg:#111;--sub:#8a8a8a;--line:#e6e6e6;--soft:#f5f5f5;--sale:#e8573a;--gutter:60px;--col-gap:32px;--row-gap:64px;--sheet-w:480px;--r:8px;--maxw:1200px;
  color:var(--fg);font-family:inherit;letter-spacing:-.01em;-webkit-font-smoothing:antialiased;text-align:left;line-height:1.4}
.vlb *,.vlb *::before,.vlb *::after,.vlb-layer *,.vlb-layer *::before,.vlb-layer *::after{box-sizing:border-box;margin:0;padding:0}
.vlb button,.vlb-layer button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;letter-spacing:inherit}
.vlb a,.vlb-layer a{color:inherit;text-decoration:none}
.vlb img,.vlb-layer img{display:block;max-width:100%;border:0}
.vlb ul,.vlb li{list-style:none}
html.vlb-lock,html.vlb-lock body{overflow:hidden}

.vlb{padding:var(--vlb-pad-top,60px) var(--gutter) 160px;max-width:calc(var(--maxw) + var(--gutter) * 2);margin:0 auto;background:#fff}
.vlb-head{margin-bottom:72px}
.vlb-selects{display:flex;gap:26px;margin-bottom:22px}
.vlb-csel{position:relative;display:inline-block}
.vlb-csel select{appearance:none;-webkit-appearance:none;border:0;background:none;font:inherit;font-size:13px;color:var(--fg);padding:2px 22px 2px 0;cursor:pointer;border-radius:0;height:auto;outline-offset:2px}
.vlb-csel::after{content:"";position:absolute;right:3px;top:50%;width:6px;height:6px;border-right:1px solid #999;border-bottom:1px solid #999;transform:translateY(-75%) rotate(45deg);pointer-events:none}
.vlb-tabs-wrap{position:relative}
.vlb-tabs{position:relative;display:flex;gap:24px;overflow-x:auto;scrollbar-width:none;-ms-overflow-style:none;scroll-behavior:smooth;overscroll-behavior-x:contain}
.vlb-tabs::-webkit-scrollbar{display:none}
.vlb-tabs-wrap::before,.vlb-tabs-wrap::after{content:"";position:absolute;top:0;bottom:0;width:56px;pointer-events:none;opacity:0;transition:opacity .2s;z-index:1}
.vlb-tabs-wrap::before{left:0;background:linear-gradient(90deg,#fff 30%,rgba(255,255,255,0))}
.vlb-tabs-wrap::after{right:0;background:linear-gradient(270deg,#fff 30%,rgba(255,255,255,0))}
.vlb-tabs-wrap.can-l::before,.vlb-tabs-wrap.can-r::after{opacity:1}
.vlb-arrow{position:absolute;top:50%;transform:translateY(-58%);width:28px;height:28px;border-radius:50%;background:#fff !important;border:1px solid #e2e2e2 !important;display:none;place-items:center;z-index:2;box-shadow:0 1px 4px rgba(0,0,0,.08)}
.vlb-arrow svg{width:14px;height:14px}
.vlb-arrow.prev{left:0}.vlb-arrow.next{right:0}
.vlb-arrow:hover{border-color:#111 !important}
.vlb-tabs-wrap.can-l .vlb-arrow.prev,.vlb-tabs-wrap.can-r .vlb-arrow.next{display:grid}
@media (hover:none){.vlb-arrow{display:none !important}}
.vlb-tab{flex:none;font-size:13px;color:var(--sub);padding:4px 0 6px !important;border-bottom:1px solid transparent !important;white-space:nowrap;transition:color .2s}
.vlb .vlb-tab{color:var(--sub)}
.vlb .vlb-tab:hover{color:var(--fg)}
.vlb .vlb-tab.on{color:var(--fg);font-weight:600;border-bottom-color:var(--fg) !important}
.vlb-tab-sep{flex:none;width:1px;height:12px;background:#d0d0d0;align-self:center;margin-bottom:2px}

.vlb-title{text-align:center;font-size:30px;font-weight:600;letter-spacing:.01em;line-height:1.25;color:var(--fg)}
.vlb-cats{display:flex;flex-wrap:wrap;justify-content:center;gap:8px 22px;margin-top:18px}
.vlb-cats[hidden]{display:none}
.vlb .vlb-cat{font-size:13px;letter-spacing:.06em;color:var(--sub);padding:3px 0 5px !important;border-bottom:1px solid transparent !important;transition:color .2s;white-space:nowrap}
.vlb .vlb-cat:hover{color:var(--fg)}
.vlb .vlb-cat.on{color:var(--fg);font-weight:600;border-bottom-color:var(--fg) !important}
.vlb .vlb-cat-team{display:inline-flex;align-items:center;gap:6px;color:var(--fg)}
.vlb-new{display:inline-block;background:#111;color:#fff;font-size:9.5px;font-weight:700;letter-spacing:.06em;line-height:1;padding:3px 5px 2px;vertical-align:1px}
.vlb-body{margin-top:52px}

.vlb-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--row-gap) var(--col-gap)}
.vlb-card{min-width:0}
.vlb-frame{position:relative;border:1px solid #000;padding:7px;background:#fff}
.vlb-shot{position:relative;aspect-ratio:3/4;background:var(--soft);overflow:hidden}
.vlb-shot img,.vlb-shot video{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;opacity:0;transition:opacity .5s}
.vlb-shot .ready{opacity:1}
.vlb-cart{position:absolute;right:18px;bottom:18px;width:36px;height:36px;border-radius:50% !important;background:#fff !important;display:grid;place-items:center;box-shadow:0 1px 6px rgba(0,0,0,.14);transition:transform .2s,background .2s,color .2s}
.vlb-cart:hover{transform:scale(1.08);background:#111 !important;color:#fff}
.vlb-cart svg{width:16px;height:16px}
.vlb.round-looks .vlb-frame{border-radius:var(--r)}
.vlb.round-looks .vlb-shot{border-radius:max(0px,calc(var(--r) - 4px))}
.vlb-cap{text-align:center;font-size:15px;margin-top:16px;letter-spacing:.04em;font-weight:400}
.vlb-empty{text-align:center;padding:150px 0 120px;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.vlb-empty p{font-size:17px;font-weight:500}
.vlb-empty small{display:block;margin-top:10px;font-size:11px;color:var(--sub);letter-spacing:.24em}

.vlb-layer{position:fixed;inset:0;z-index:2147483000;pointer-events:none}
.vlb-dim{position:fixed;inset:0;background:rgba(0,0,0,.42);opacity:0;pointer-events:none;transition:opacity .35s}
.vlb-sheet{position:fixed;top:0;right:0;height:100%;width:min(var(--sheet-w),100%);background:#fff;display:flex;flex-direction:column;transform:translateX(100%);transition:transform .45s cubic-bezier(.22,.8,.2,1);visibility:hidden;pointer-events:auto}
.vlb-layer.side-left .vlb-sheet{right:auto;left:0;transform:translateX(-100%)}
.vlb-layer.open .vlb-dim{opacity:1;pointer-events:auto}
.vlb-layer.open .vlb-sheet{transform:none;visibility:visible}
.vlb-grab{display:none}
.vlb-sheet-head{display:flex;align-items:flex-start;justify-content:space-between;padding:34px 40px 22px;border-bottom:1px solid var(--line)}
.vlb-sheet-head h2{font-size:18px;font-weight:600;letter-spacing:.02em;line-height:1.3}
.vlb-sheet-head p{font-size:12px;color:var(--sub);margin-top:6px;letter-spacing:.04em}
.vlb-x{width:36px;height:36px;margin:-6px -8px 0 0 !important;display:grid;place-items:center}
.vlb-x svg{width:22px;height:22px}
.vlb-sheet-body{flex:1;overflow-y:auto;padding:4px 40px 40px;overscroll-behavior:contain}
.vlb-item{padding:26px 0;border-bottom:1px solid var(--line)}
.vlb-item-top{display:grid;grid-template-columns:116px 1fr;gap:20px}
.vlb-thumb{aspect-ratio:1/1;background:var(--soft);overflow:hidden;display:block;border-radius:var(--r)}
.vlb-thumb img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply}
.vlb-name{font-size:14px;font-weight:500;line-height:1.5;word-break:keep-all;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.vlb-name:hover{text-decoration:underline;text-underline-offset:3px}
.vlb-price{margin-top:10px;font-size:14px;font-weight:700}
.vlb-price .org{font-size:12px;font-weight:400;color:#aaa;text-decoration:line-through;margin-right:6px}
.vlb-price .rate{color:var(--sale);margin-right:4px}
.vlb-act{display:grid;grid-template-columns:1fr 132px;gap:8px;margin-top:16px}
.vlb-osel{position:relative;display:block}
.vlb-osel select{appearance:none;-webkit-appearance:none;width:100%;height:46px;border:1px solid #d4d4d4;background:#fff;padding:0 34px 0 14px;font:inherit;font-size:13px;color:var(--fg);cursor:pointer;border-radius:var(--r)}
.vlb-osel::after{content:"";position:absolute;right:15px;top:50%;width:6px;height:6px;border-right:1px solid #666;border-bottom:1px solid #666;transform:translateY(-75%) rotate(45deg);pointer-events:none}
.vlb-osel.err select{border-color:var(--sale)}
.vlb-osel.single select{color:var(--sub);pointer-events:none;background:var(--soft)}
.vlb-add{height:46px;background:#111 !important;color:#fff !important;font-size:14px;font-weight:600;transition:opacity .2s;border-radius:var(--r) !important;display:grid;place-items:center}
.vlb-add:hover{opacity:.85}
.vlb-add:disabled{opacity:.5;cursor:default}
.vlb-add.done{background:#1f6b48 !important;opacity:1}
.vlb-skel{height:150px;margin:26px 0;background:linear-gradient(90deg,#f4f4f4 25%,#ebebeb 50%,#f4f4f4 75%);background-size:200% 100%;animation:vlb-sk 1.2s infinite}
@keyframes vlb-sk{to{background-position:-200% 0}}
.vlb-sheet-foot{padding:18px 40px calc(18px + env(safe-area-inset-bottom));border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;font-size:13px}
.vlb-sheet-foot a{font-weight:600;text-decoration:underline;text-underline-offset:3px}
.vlb-sheet-foot span{color:var(--sub)}
.vlb-modal{position:fixed;inset:0;display:grid;place-items:center;padding:24px;background:rgba(0,0,0,.32);opacity:0;pointer-events:none;transition:opacity .25s}
.vlb-modal.on{opacity:1;pointer-events:auto}
.vlb-modal-card{width:min(380px,100%);background:#fff;border-radius:calc(var(--r) * 1.5);padding:44px 32px 32px;text-align:center;transform:translateY(10px);transition:transform .25s}
.vlb-modal.on .vlb-modal-card{transform:none}
.vlb-modal-card h3{font-size:18px;font-weight:600}
.vlb-modal-card p{font-size:14px;color:#555;line-height:1.65;margin-top:12px;word-break:keep-all}
.vlb-modal-btns{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:32px}
.vlb-modal-btns a,.vlb-modal-btns button{height:50px;display:grid;place-items:center;font-size:14px;font-weight:600;border-radius:var(--r) !important}
.vlb-btn-dark{background:#111 !important;color:#fff !important}
.vlb-btn-line{border:1px solid #111 !important;background:#fff !important}
.vlb-toast{position:fixed;left:50%;bottom:36px;transform:translate(-50%,16px);background:#111;color:#fff;font-size:14px;padding:13px 22px;border-radius:30px;opacity:0;pointer-events:none;transition:.3s;white-space:nowrap}
.vlb-toast.on{opacity:1;transform:translate(-50%,0)}

@media (max-width:1200px){.vlb,.vlb-layer{--gutter:40px;--col-gap:24px}.vlb-grid{grid-template-columns:repeat(3,1fr)}}
@media (max-width:767px){
  .vlb,.vlb-layer{--gutter:16px;--col-gap:12px;--row-gap:36px}
  .vlb-head{margin-bottom:48px}
  .vlb-grid{grid-template-columns:repeat(2,1fr)}
  .vlb-frame{padding:4px}
  .vlb-cart{right:10px;bottom:10px;width:32px;height:32px}
  .vlb-cap{font-size:13px;margin-top:10px}
  .vlb-title{font-size:23px}
  .vlb-body{margin-top:36px}
  .vlb-empty{padding:110px 0 90px}
  .vlb-sheet,.vlb-layer.side-left .vlb-sheet{top:auto;bottom:0;left:0;right:0;width:100%;height:auto;max-height:88vh;border-radius:16px 16px 0 0;transform:translateY(100%)}
  .vlb-grab{display:block;width:40px;height:4px;border-radius:2px;background:#d9d9d9;margin:10px auto 0}
  .vlb-sheet-head{padding:18px 20px 16px}
  .vlb-sheet-body{padding:0 20px 24px}
  .vlb-sheet-foot{padding:14px 20px calc(14px + env(safe-area-inset-bottom))}
  .vlb-item{padding:20px 0}
  .vlb-item-top{grid-template-columns:92px 1fr;gap:14px}
  .vlb-act{grid-template-columns:1fr 108px}
}
@media (prefers-reduced-motion:reduce){.vlb *,.vlb-layer *{transition:none!important;animation:none!important}}`;

  function injectCSS() {
    if (document.getElementById('vlb-style')) return;
    const st = document.createElement('style'); st.id = 'vlb-style'; st.textContent = CSS;
    document.head.appendChild(st);
  }

  /* ------------------------------------------------- 상품 정보 (공통) */
  const pick = (o, ...ks) => { for (const k of ks) if (o && o[k] != null && o[k] !== '') return o[k]; };
  const unwrap = (j) => { let d = j; for (let i = 0; i < 3 && d && typeof d === 'object' && !Array.isArray(d); i++) { const n = pick(d, 'data', 'result', 'product', 'item'); if (n == null || typeof n !== 'object') break; d = n; } return Array.isArray(d) ? d[0] : d; };
  const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v != null && v !== '' && v !== 0 && !(Array.isArray(v) && !v.length)));
  const absUrl = (u) => !u ? u : u.startsWith('//') ? 'https:' + u : u;
  function normOptions(raw) {
    if (!raw) return [];
    if (!Array.isArray(raw)) raw = pick(raw, 'values', 'items', 'list', 'variants') || [];
    return raw.flatMap(o => {
      if (typeof o === 'string') return [{ value: o, label: o, soldOut: false }];
      const nested = pick(o, 'optionValues', 'values', 'option_value');
      if (Array.isArray(nested)) return normOptions(nested);
      const label = pick(o, 'optionValue', 'option_value', 'optionText', 'option_text', 'label', 'name', 'value');
      const value = pick(o, 'variantCode', 'variant_code', 'itemCode', 'item_code', 'code', 'value') ?? label;
      const stock = pick(o, 'stock', 'quantity', 'stockQuantity', 'stock_number');
      const soldOut = [true, 'T', 'Y'].includes(pick(o, 'soldOut', 'isSoldOut', 'sold_out')) || stock === 0;
      return [{ value: String(value), label: String(label ?? ''), soldOut }];
    });
  }
  function normProduct(p) {
    if (!p || typeof p !== 'object') return {};
    const num = (v) => Number(String(v ?? '').replace(/[^\d.]/g, '')) || 0;
    const price = num(pick(p, 'price', 'retailPrice', 'consumerPrice', 'originPrice'));
    const sale = num(pick(p, 'salePrice', 'discountPrice', 'sellPrice', 'sale_price', 'finalPrice'));
    const image = pick(p, 'imageUrl', 'image', 'listImage', 'list_image', 'smallImage', 'small_image', 'tinyImage', 'thumbnail', 'detailImage', 'detail_image', 'mainImage');
    return clean({
      name: pick(p, 'productName', 'product_name', 'name', 'title'),
      price, salePrice: sale && sale < price ? sale : 0,
      image: typeof image === 'object' ? pick(image, 'url', 'src') : image,
      options: normOptions(pick(p, 'options', 'optionList', 'option', 'variants', 'items')),
    });
  }
  async function fetchT(url, opt = {}, ms = 6000) {
    const c = new AbortController(); const t = setTimeout(() => c.abort(), ms);
    // 다른 주소(API 서버)에는 쿠키를 보내지 않음 → CORS 문제 방지
    const same = !/^https?:/i.test(url) || new URL(url).origin === location.origin;
    try { return await fetch(url, { credentials: same ? 'include' : 'omit', ...opt, signal: c.signal }); } finally { clearTimeout(t); }
  }
  async function fromCafe24Page(no) {
    const r = await fetchT(CONFIG.productPage(no));
    if (!r.ok) throw new Error(r.status);
    const html = await r.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const meta = (n) => doc.querySelector(`meta[property="${n}"]`)?.content;
    const out = { image: meta('og:image'), price: Number(meta('product:price:amount')) || 0, salePrice: Number(meta('product:sale_price:amount')) || 0 };
    if (out.salePrice >= out.price) out.salePrice = 0;
    const m = html.match(/option_stock_data\s*=\s*'((?:\\'|[^'])*)'/);
    if (m) {
      let data; try { data = JSON.parse(JSON.parse('"' + m[1].replace(/\\'/g, "'") + '"')); } catch { try { data = JSON.parse(m[1].replace(/\\"/g, '"')); } catch {} }
      if (data && typeof data === 'object') {
        out.options = Object.entries(data).filter(([, v]) => v && v.is_display !== 'F').map(([code, v]) => ({
          value: code, label: String(v.option_value || '').replace(/#\$%/g, ' / '),
          soldOut: v.is_selling === 'F' || (v.use_stock === true && v.is_auto_soldout === 'T' && Number(v.stock_number) <= 0),
        }));
        if (out.options.length === 1 && !out.options[0].label) { out.itemCode = out.options[0].value; out.options = []; }
      }
    }
    return clean(out);
  }
  const DEMO = qs.has('mock') || location.protocol === 'file:';

  /* ---------------------------------------------------- 로그인 / 장바구니 */
  function isLoggedIn() {
    if (qs.has('login')) return qs.get('login') === '1';                  // 시연용 ?login=1 / ?login=0
    if (typeof window.LOOKBOOK_IS_LOGGED_IN === 'function') return !!window.LOOKBOOK_IS_LOGGED_IN();
    return !!document.querySelector('.xans-layout-statelogon');         // 카페24: 로그인 상태에서만 렌더링되는 모듈
  }
  async function addToCart(no, itemCode) {
    if (DEMO) { await new Promise(r => setTimeout(r, 300)); return { ok: true }; }
    const body = new URLSearchParams({ command: 'add', num_of_prod: '1', prod_id1: String(no), product_no: String(no), basket_type: 'A0000', delvType: 'A', quantity: '1', option_type: 'T', product_min: '1', main_cate_no: '1', display_group: '1' });
    if (itemCode && itemCode !== 'single') body.append('selected_item[]', `1||${itemCode}`);
    const r = await fetchT('/exec/front/order/basket/', { method: 'POST', body, headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' } });
    let j = {}; try { j = await r.json(); } catch {}
    const ok = r.ok && !(j.result != null && Number(j.result) < 0);
    return { ok, msg: j.alertMSG || j.message, needLogin: /로그인|login/i.test(j.alertMSG || '') };
  }

  /* ================================================================ mount */
  function mount(root, opts = {}) {
    if (!root || root.__vlb) return root && root.__vlb;
    injectCSS();
    const o = {
      src: opts.src || root.dataset.src || new URL('victor-lookbook-data.js', SCRIPT_BASE).href,
      padTop: opts.padTop ?? root.dataset.padTop,
      setTitle: opts.setTitle ?? root.dataset.setTitle === '1',
      useHash: opts.useHash ?? root.dataset.useHash !== '0',
    };
    const dataBase = new URL('.', new URL(o.src, location.href)).href;    // 이미지 경로 기준 = 데이터 파일 폴더
    // 관리자 미리보기는 새 이미지를 Blob으로 보냄 → 같은 이미지(key)는 주소를 재사용해서 다시 읽지 않음
    const blobUrls = new Map();
    const resolveAsset = (u, key) => {
      if (typeof Blob !== 'undefined' && u instanceof Blob) {
        if (key && blobUrls.has(key)) return blobUrls.get(key);
        const url = URL.createObjectURL(u); if (key) blobUrls.set(key, url); return url;
      }
      return !u || /^(data:|blob:|https?:|\/\/)/.test(u) || u.startsWith('/') ? absUrl(u) : new URL(u, dataBase).href;
    };

    root.classList.add('vlb');
    if (o.padTop != null && o.padTop !== '') root.style.setProperty('--vlb-pad-top', `${parseInt(o.padTop, 10) || 0}px`);
    root.innerHTML = `
      <div class="vlb-head">
        <div class="vlb-selects">
          <label class="vlb-csel"><select data-r="year" aria-label="연도"></select></label>
          <label class="vlb-csel"><select data-r="season" aria-label="시즌"></select></label>
        </div>
        <div class="vlb-tabs-wrap" data-r="tabsWrap">
          <button type="button" class="vlb-arrow prev" data-dir="-1" aria-label="이전 룩북 탭"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 5l-7 7 7 7"/></svg></button>
          <nav class="vlb-tabs" data-r="tabs" aria-label="룩북"></nav>
          <button type="button" class="vlb-arrow next" data-dir="1" aria-label="다음 룩북 탭"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5l7 7-7 7"/></svg></button>
        </div>
      </div>
      <h2 class="vlb-title" data-r="title"></h2>
      <nav class="vlb-cats" data-r="cats" aria-label="카테고리" hidden></nav>
      <section class="vlb-body" data-r="body"><div class="vlb-empty"><p>불러오는 중…</p><small>LOOKBOOK</small></div></section>`;

    // 시트·로그인 안내·토스트는 body 바로 아래에 (사이트 레이아웃의 z-index/overflow 영향 안 받게)
    const layer = document.createElement('div');
    layer.className = 'vlb-layer' + (CONFIG.sheetSide === 'left' ? ' side-left' : '');
    layer.innerHTML = `
      <div class="vlb-dim" data-r="dim"></div>
      <aside class="vlb-sheet" role="dialog" aria-modal="true" aria-hidden="true" data-r="sheet">
        <div class="vlb-grab"></div>
        <div class="vlb-sheet-head"><div><h2 data-r="sTitle"></h2><p data-r="sSub"></p></div>
          <button class="vlb-x" type="button" data-close aria-label="닫기"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>
        <div class="vlb-sheet-body" data-r="sBody"></div>
        <div class="vlb-sheet-foot"><span data-r="sCount"></span><a href="${CONFIG.basketUrl}">장바구니 보기</a></div>
      </aside>
      <div class="vlb-modal" role="alertdialog" aria-modal="true" data-r="login">
        <div class="vlb-modal-card"><h3>로그인이 필요해요</h3><p>로그인하시면 룩에 담긴 상품을<br>장바구니에 바로 담을 수 있어요.</p>
          <div class="vlb-modal-btns"><a class="vlb-btn-dark" data-r="loginGo" href="${CONFIG.loginUrl}">로그인하기</a><button class="vlb-btn-line" type="button" data-r="loginStay">룩북 계속 보기</button></div></div>
      </div>
      <div class="vlb-toast" role="status" data-r="toast"></div>`;
    document.body.appendChild(layer);

    const R = {}; [root, layer].forEach(el => el.querySelectorAll('[data-r]').forEach(n => { R[n.dataset.r] = n; }));
    let DATA = { seasons: [], lookbooks: [], products: {} }, years = [];
    const state = { year: null, season: null, bookId: null, cat: 'all' };
    let gifIO = null;
    const cache = {};

    const visibleBooks = () => DATA.lookbooks.filter(b => !b.hidden);
    const isSpecial = (b) => b && b.type === 'special';
    const specialBooks = () => visibleBooks().filter(isSpecial);
    const booksOf = (y, s) => visibleBooks().filter(b => !isSpecial(b) && b.year === y && b.season === s);
    const calcYears = () => { years = [...new Set(visibleBooks().filter(b => !isSpecial(b)).map(b => b.year))].sort((a, b) => b - a); if (!years.length) years = [new Date().getFullYear()]; };

    /* 렌더 */
    function renderSelects() {
      R.year.innerHTML = years.map(y => `<option value="${y}" ${y === state.year ? 'selected' : ''}>${y}</option>`).join('');
      R.season.innerHTML = DATA.seasons.map(s => `<option value="${esc(s.key)}" ${s.key === state.season ? 'selected' : ''}>${esc(s.label)}</option>`).join('');
      const tab = (b) => `<button type="button" class="vlb-tab ${b.id === state.bookId ? 'on' : ''}" data-book="${esc(b.id)}" ${b.id === state.bookId ? 'aria-current="true"' : ''}>${esc(b.title)}</button>`;
      const st = booksOf(state.year, state.season).map(tab).join(''), sp = specialBooks().map(tab).join('');
      R.tabs.innerHTML = st + (st && sp ? '<span class="vlb-tab-sep" aria-hidden="true"></span>' : '') + sp;
    }
    function renderBook() {
      const book = DATA.lookbooks.find(b => b.id === state.bookId);
      const season = DATA.seasons.find(s => s.key === state.season);
      const title = book ? book.title : `${state.year} ${season ? season.label : ''}`;
      R.title.textContent = title;
      if (o.setTitle) document.title = `${title} | VICTOR LOOKBOOK`;
      const looks = book?.looks || [];

      // 룩북 안 카테고리: 룩이 있는 카테고리만 제목 아래 가운데에 나열 (ALL + 카테고리들)
      const cats = (book?.categories || []).filter(c => looks.some(l => l.category === c.id));
      const team = teamOn(book);                               // 단체복 섹션: 관리자에서 켠 룩북에만 보임
      if (!(cats.some(c => c.id === state.cat) || (team && state.cat === 'team'))) state.cat = 'all';
      const chips = cats.length || team ? [{ id: 'all', name: 'ALL' }, ...cats] : [];
      R.cats.innerHTML = chips.map(c => `<button type="button" class="vlb-cat ${c.id === state.cat ? 'on' : ''}" data-cat="${esc(c.id)}" ${c.id === state.cat ? 'aria-current="true"' : ''}>${esc(c.name)}</button>`).join('')
        + (team ? `<button type="button" class="vlb-cat vlb-cat-team ${state.cat === 'team' ? 'on' : ''}" data-cat="team" ${state.cat === 'team' ? 'aria-current="true"' : ''}>단체복<span class="vlb-new">NEW</span></button>` : '');
      R.cats.hidden = !chips.length;
      const shown = looks.map((l, i) => [l, i]).filter(([l]) => state.cat === 'all' || l.category === state.cat);

      // 썸네일 구성이 그대로면 다시 그리지 않음 (이미지 재로딩·깜빡임 방지)
      const sig = JSON.stringify([state.bookId, state.cat, state.cat === 'team' ? JSON.stringify(DATA.teamwearData || '').length + JSON.stringify(DATA.teamwear || '') : '', title, shown.map(([l, i]) => [i, l.imageKey || (typeof l.image === 'string' ? l.image : ''), l.video || '', (l.products || []).length > 0])]);
      if (sig === R.body.__sig) return;
      R.body.__sig = sig;
      if (gifIO) { gifIO.disconnect(); gifIO = null; }
      if (state.cat === 'team') { openTeam(); return; }
      if (!looks.length) { R.body.innerHTML = `<div class="vlb-empty"><p>준비중입니다</p><small>COMING SOON</small></div>`; return; }
      R.body.innerHTML = `<div class="vlb-grid">${shown.map(([l, i], k) => {
        const n = i + 1, img = resolveAsset(l.image, l.imageKey);
        const isGif = (l.image instanceof Blob && l.image.type === 'image/gif') || /\.gif($|\?)/i.test(String(img));
        const media = l.video
          ? `<video src="${esc(resolveAsset(l.video))}" ${img ? `poster="${esc(img)}"` : ''} muted loop playsinline autoplay preload="metadata"></video>`
          : isGif
            ? `<img data-gif="${esc(img)}" alt="${esc(title)} LOOK ${n}" decoding="async">`      // GIF는 화면 근처에 있을 때만 재생 (렉 방지)
            : `<img src="${esc(img)}" alt="${esc(title)} LOOK ${n}" loading="${k < 8 ? 'eager' : 'lazy'}" decoding="async">`;
        // 연결된 상품이 없는 룩은 장바구니 버튼을 숨김
        const cart = (l.products || []).length ? `<button type="button" class="vlb-cart" data-look="${i}" aria-label="LOOK ${n} 상품 보기">${ICON_BAG}</button>` : '';
        return `<figure class="vlb-card"><div class="vlb-frame"><div class="vlb-shot">${media}</div>${cart}</div>
          <figcaption class="vlb-cap">LOOK ${n}</figcaption></figure>`;
      }).join('')}</div>`;
      R.body.querySelectorAll('.vlb-shot img').forEach(img => { const show = () => img.classList.add('ready'); img.complete && img.naturalWidth ? show() : img.addEventListener('load', show, { once: true }); });
      const gifs = R.body.querySelectorAll('img[data-gif]');
      if (gifs.length) {
        gifIO = new IntersectionObserver(es => es.forEach(e => {
          const im = e.target;
          if (e.isIntersecting) { if (im.getAttribute('src') !== im.dataset.gif) im.src = im.dataset.gif; }
          else if (im.getAttribute('src')) { im.removeAttribute('src'); im.classList.remove('ready'); }   // 화면에서 멀어지면 GIF 정지(해제)
        }), { rootMargin: '300px 0px' });
        gifs.forEach(im => { im.addEventListener('load', () => im.classList.add('ready')); gifIO.observe(im); });
      }
      const vids = R.body.querySelectorAll('video');
      if (vids.length) {
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const io = new IntersectionObserver(es => es.forEach(e => { e.target.classList.add('ready'); (e.isIntersecting && !reduce) ? e.target.play().catch(() => {}) : e.target.pause(); }), { threshold: .2 });
        vids.forEach(v => io.observe(v));
      }
    }
    /* 단체복 시뮬레이션: 칩을 누를 때만 victor-teamwear.js 를 불러옴 (평소 룩북은 가볍게) */
    const teamOn = (b) => (DATA.teamwear || {}).enabled !== false && !!(b && b.teamwear);   // 전체 스위치 + 룩북별 켜기
    let teamLoading = null;
    function openTeam() {
      R.body.innerHTML = '<div class="vlb-team"></div>';
      const el = R.body.firstElementChild;
      const go = () => window.VictorTeamwear.mount(el, { shareUrl: location.origin + location.pathname + location.search + '#teamwear', gallery: DATA.teamwear || {}, data: DATA.teamwearData });
      if (window.VictorTeamwear) return go();
      if (!teamLoading) teamLoading = new Promise((res, rej) => {
        const sc = document.createElement('script');
        const u = new URL('victor-teamwear.js', SCRIPT_BASE); u.searchParams.set('v', Math.floor(Date.now() / 300000)); sc.src = u.href;
        sc.onload = res; sc.onerror = rej; document.head.appendChild(sc);
      });
      el.innerHTML = '<div class="vlb-empty"><p>단체복 시뮬레이션을 불러오는 중…</p><small>TEAMWEAR</small></div>';
      teamLoading.then(() => { if (el.isConnected) go(); }).catch(() => { teamLoading = null; el.innerHTML = '<div class="vlb-empty"><p>불러오지 못했어요</p><small>victor-teamwear.js</small></div>'; });
    }
    function select({ year, season, bookId }, push = true) {
      const prevBook = state.bookId;
      const b = bookId && visibleBooks().find(x => x.id === bookId);
      if (b && isSpecial(b)) {
        state.year = state.year ?? years[0]; state.season = state.season ?? (DATA.seasons[0] || {}).key; state.bookId = b.id;
      } else {
        if (b) { year = b.year; season = b.season; }
        state.year = year ?? years[0]; state.season = season ?? (DATA.seasons[0] || {}).key;
        const books = booksOf(state.year, state.season);
        state.bookId = books.some(x => x.id === bookId) ? bookId : (books[0] || {}).id || null;
      }
      if (state.bookId !== prevBook) state.cat = 'all';          // 다른 룩북으로 가면 카테고리는 ALL부터
      renderSelects(); renderBook(); centerActiveTab(); prefetchBook();
      if (push && o.useHash) history.replaceState(history.state, '', location.pathname + location.search + (state.bookId ? `#${state.bookId}` : `#${state.year}-${state.season}`.toLowerCase()));
    }
    R.year.addEventListener('change', e => select({ year: +e.target.value, season: state.season }));
    R.season.addEventListener('change', e => select({ year: state.year, season: e.target.value }));
    R.tabs.addEventListener('click', e => { const t = e.target.closest('[data-book]'); if (t) select({ bookId: t.dataset.book }); });
    R.cats.addEventListener('click', e => {
      const c = e.target.closest('[data-cat]'); if (!c || c.dataset.cat === state.cat) return;
      const wasTeam = state.cat === 'team';
      state.cat = c.dataset.cat; renderBook();
      if (o.useHash && (wasTeam || state.cat === 'team')) history.replaceState(history.state, '', location.pathname + location.search + (state.cat === 'team' ? '#teamwear' : state.bookId ? `#${state.bookId}` : ''));
    });

    /* 탭 가로 스크롤 */
    function updateTabEdges() {
      const max = R.tabs.scrollWidth - R.tabs.clientWidth;
      R.tabsWrap.classList.toggle('can-l', R.tabs.scrollLeft > 2);
      R.tabsWrap.classList.toggle('can-r', R.tabs.scrollLeft < max - 2);
    }
    function centerActiveTab() {
      const on = R.tabs.querySelector('.vlb-tab.on');
      if (on) { const p = R.tabs.style.scrollBehavior; R.tabs.style.scrollBehavior = 'auto'; R.tabs.scrollLeft = on.offsetLeft - (R.tabs.clientWidth - on.offsetWidth) / 2; R.tabs.style.scrollBehavior = p; }
      updateTabEdges();
    }
    R.tabs.addEventListener('scroll', updateTabEdges, { passive: true });
    window.addEventListener('resize', updateTabEdges);
    R.tabsWrap.addEventListener('click', e => { const a = e.target.closest('.vlb-arrow'); if (a) R.tabs.scrollBy({ left: +a.dataset.dir * R.tabs.clientWidth * 0.7 }); });
    R.tabs.addEventListener('wheel', e => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = R.tabs.scrollWidth - R.tabs.clientWidth;
      if (max <= 0 || (e.deltaY < 0 && R.tabs.scrollLeft <= 0) || (e.deltaY > 0 && R.tabs.scrollLeft >= max)) return;
      e.preventDefault(); R.tabs.scrollLeft += e.deltaY;
    }, { passive: false });

    /* 상품 */
    // ① 가벼운 정보: 상품 API(JSON)만
    const lite = {};
    function loadLite(no) {
      if (lite[no]) return lite[no];
      return lite[no] = (async () => {
        let p = { no, name: DATA.products?.[no] || `상품 ${no}` };
        if (!qs.has('mock')) {
          try {
            const r = await fetchT(CONFIG.api + CONFIG.productApi(no));
            if (r.ok) { p = { ...p, ...normProduct(unwrap(await r.json())) }; p.loaded = !!(p.options || p.price); }
          } catch (e) { console.warn(`[lookbook] 상품 API 실패 (${no})`, e.message); }
        }
        return p;
      })();
    }
    // ② 시트에 필요한 전체 정보: API로 부족할 때만 상품 상세페이지(무거움)를 읽음 — 시트를 열 때(또는 버튼에 마우스를 올릴 때)만
    function loadProduct(no) {
      if (cache[no]) return cache[no];
      return cache[no] = (async () => {
        let p = { ...(await loadLite(no)) };
        if (!qs.has('mock') && (!p.image || !p.options || !p.price)) {
          try { const c = await fromCafe24Page(no); p = { ...c, ...p, options: p.options || c.options, itemCode: c.itemCode, loaded: true }; }
          catch (e) { console.warn(`[lookbook] 상세페이지 읽기 실패 (${no})`, e.message); }
        }
        p.image = absUrl(p.image); p.options = p.options || [];
        return p;
      })();
    }
    // 화면이 한가할 때 앞쪽 룩의 상품 API만 3개씩 천천히 미리 받아 둠
    function prefetchBook() {
      const book = DATA.lookbooks.find(b => b.id === state.bookId);
      const nos = [...new Set((book?.looks || []).slice(0, 8).flatMap(l => l.products || []))].filter(n => !lite[n]);
      if (!nos.length) return;
      const idle = window.requestIdleCallback || ((f) => setTimeout(f, 400));
      idle(async () => { for (let k = 0; k < nos.length; k += 3) await Promise.all(nos.slice(k, k + 3).map(loadLite)); });
    }

    /* 시트 */
    let lastFocus = null, currentLook = null;
    async function openSheet(i) {
      const book = DATA.lookbooks.find(b => b.id === state.bookId), look = book?.looks[i]; if (!look || !(look.products || []).length) return;
      currentLook = look; lastFocus = document.activeElement;
      R.sTitle.textContent = `LOOK ${i + 1}`; R.sSub.textContent = book.title; R.sCount.textContent = `상품 ${look.products.length}개`;
      R.sBody.innerHTML = look.products.map(() => '<div class="vlb-skel"></div>').join('');
      layer.classList.add('open'); document.documentElement.classList.add('vlb-lock'); R.sheet.setAttribute('aria-hidden', 'false');
      setTimeout(() => layer.querySelector('.vlb-x').focus({ preventScroll: true }), 50);
      const products = await Promise.all(look.products.map(loadProduct));
      if (currentLook === look) R.sBody.innerHTML = products.map(itemHTML).join('');
    }
    function closeSheet() {
      if (!layer.classList.contains('open')) return;
      layer.classList.remove('open'); document.documentElement.classList.remove('vlb-lock'); R.sheet.setAttribute('aria-hidden', 'true');
      currentLook = null; lastFocus?.focus?.({ preventScroll: true });
    }
    function itemHTML(p) {
      const href = CONFIG.productPage(p.no), hasOpt = p.options.length > 0;
      const opts = hasOpt
        ? `<option value="">옵션 선택</option>` + p.options.map(x => `<option value="${esc(x.value)}" ${x.soldOut ? 'disabled' : ''}>${esc(x.label)}${x.soldOut ? ' (품절)' : ''}</option>`).join('')
        : `<option value="${esc(p.itemCode || 'single')}">단일 옵션</option>`;
      const price = p.salePrice ? `<span class="org">${won(p.price)}</span><span class="rate">${Math.round((1 - p.salePrice / p.price) * 100)}%</span>${won(p.salePrice)}` : (p.price ? won(p.price) : '');
      const act = (p.loaded || DEMO)
        ? `<label class="vlb-osel ${hasOpt ? '' : 'single'}"><select aria-label="${esc(p.name)} 옵션">${opts}</select></label><button class="vlb-add" type="button">장바구니</button>`
        : `<a class="vlb-add" style="grid-column:1/-1" href="${href}">상품 페이지에서 담기</a>`;
      return `<div class="vlb-item" data-no="${p.no}"><div class="vlb-item-top">
        <a class="vlb-thumb" href="${href}" target="_blank" rel="noopener">${p.image ? `<img src="${esc(p.image)}" alt="" loading="lazy" onerror="this.remove()">` : ''}</a>
        <div><a class="vlb-name" href="${href}" target="_blank" rel="noopener">${esc(p.name)}</a><p class="vlb-price">${price}</p></div></div>
        <div class="vlb-act">${act}</div></div>`;
    }
    R.body.addEventListener('click', e => { const b = e.target.closest('[data-look]'); if (b) openSheet(+b.dataset.look); });
    // 장바구니 버튼에 마우스를 올리면 그 룩 상품만 미리 받아 둠 (시트가 빨리 열리도록)
    R.body.addEventListener('pointerover', e => {
      const b = e.target.closest('[data-look]'); if (!b) return;
      const look = DATA.lookbooks.find(x => x.id === state.bookId)?.looks[+b.dataset.look];
      (look?.products || []).forEach(loadProduct);
    });
    R.dim.addEventListener('click', closeSheet);
    R.sheet.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeSheet(); });
    R.sBody.addEventListener('change', e => e.target.closest('.vlb-osel')?.classList.remove('err'));

    /* 로그인 안내 */
    function showLogin() {
      R.loginGo.href = `${CONFIG.loginUrl}?returnUrl=${encodeURIComponent(location.pathname + location.search + location.hash)}`;
      R.login.classList.add('on'); setTimeout(() => R.loginGo.focus(), 50);
    }
    const hideLogin = () => R.login.classList.remove('on');
    R.loginStay.addEventListener('click', () => { hideLogin(); closeSheet(); });
    R.login.addEventListener('click', e => { if (e.target === R.login) hideLogin(); });
    R.sBody.addEventListener('click', async e => {
      const btn = e.target.closest('button.vlb-add'); if (!btn || btn.disabled) return;
      if (!isLoggedIn()) { showLogin(); return; }
      const item = btn.closest('.vlb-item'), osel = item.querySelector('.vlb-osel'), val = osel.querySelector('select').value;
      if (!val) { osel.classList.add('err'); toast('옵션을 선택해 주세요'); return; }
      btn.disabled = true; btn.textContent = '담는 중…';
      let res; try { res = await addToCart(+item.dataset.no, val); } catch { res = { ok: false }; }
      if (res.needLogin) { btn.disabled = false; btn.textContent = '장바구니'; showLogin(); return; }
      if (res.ok) { btn.classList.add('done'); btn.textContent = '담았어요 ✓'; toast('장바구니에 담았어요'); }
      else { btn.textContent = '장바구니'; toast(res.msg || '담지 못했어요. 상품 페이지에서 다시 시도해 주세요'); }
      setTimeout(() => { btn.disabled = false; btn.classList.remove('done'); btn.textContent = '장바구니'; }, 1800);
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') R.login.classList.contains('on') ? hideLogin() : closeSheet(); });
    let tt; function toast(m) { R.toast.textContent = m; R.toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => R.toast.classList.remove('on'), 2000); }

    /* 시작 */
    function start(data, bookId) {
      DATA = data || DATA; calcYears();
      const d = DATA.design || {};
      [root, layer].forEach(el => {
        el.style.setProperty('--r', (Number.isFinite(+d.radius) ? +d.radius : 8) + 'px');
        el.style.setProperty('--maxw', (+d.maxWidth > 0 ? +d.maxWidth : 1200) + 'px');      });
      root.classList.toggle('round-looks', !!d.roundLooks);
      const h = bookId || (o.useHash ? decodeURIComponent(location.hash.slice(1)) : '');
      const m = h.match(/^(\d{4})-(\w+)$/);
      if (visibleBooks().some(b => b.id === h)) select({ bookId: h }, false);
      else if (m && !DATA.lookbooks.some(b => b.id === h)) select({ year: +m[1], season: m[2].toUpperCase() }, false);
      else select({ bookId: visibleBooks().find(b => b.looks.length)?.id }, false);
      if (h === 'teamwear') {                                   // 공유 링크(#teamwear): 단체복이 켜진 룩북으로 가서 바로 단체복
        const tb = visibleBooks().find(b => teamOn(b));
        if (tb) { if (state.bookId !== tb.id) select({ bookId: tb.id }, false); state.cat = 'team'; renderBook(); }
      }
    }
    function loadData() {
      const prev = window.LOOKBOOK_DATA;
      const sc = document.createElement('script');
      const u = new URL(o.src, location.href); u.searchParams.set('v', Math.floor(Date.now() / 300000));   // 5분 단위 캐시 무효화
      sc.src = u.href;
      sc.onload = () => { const d = window.LOOKBOOK_DATA; window.LOOKBOOK_DATA = prev; if (!api.previewGot) start(d); };
      sc.onerror = () => { R.body.innerHTML = '<div class="vlb-empty"><p>룩북 데이터를 불러오지 못했어요</p><small>victor-lookbook-data.js</small></div>'; };
      document.head.appendChild(sc);
    }
    const api = {
      previewGot: false, start, clearCache: () => { Object.keys(cache).forEach(k => delete cache[k]); Object.keys(lite).forEach(k => delete lite[k]); },
      destroy() { layer.remove(); root.innerHTML = ''; root.classList.remove('vlb'); delete root.__vlb; },
    };
    root.__vlb = api;
    if (opts.preview) R.body.innerHTML = '<div class="vlb-empty"><p>관리자 화면의 편집 내용을 불러오는 중…</p><small>PREVIEW</small></div>';
    else loadData();
    return api;
  }

  /* ================================================== 관리자 미리보기 연결 */
  function setupPreview(api) {
    window.addEventListener('message', e => {
      if (e.source !== window.parent) return;
      if (e.data?.type === 'lookbook-ping') { window.parent.postMessage({ type: 'lookbook-ready', version: VERSION }, '*'); return; }
      if (e.data?.type !== 'lookbook-preview') return;
      api.previewGot = true;                       // 상품 정보는 편집과 무관하므로 매번 다시 받지 않음
      const y = window.scrollY;
      api.start(e.data.data, e.data.bookId);
      if (e.data.keepScroll) window.scrollTo(0, y);
      window.parent.postMessage({ type: 'lookbook-preview-ok' }, '*');
    });
    window.parent.postMessage({ type: 'lookbook-ready', version: VERSION }, '*');
  }

  window.VictorLookbook = { mount, config: CONFIG, version: VERSION };

  // 자동 실행: id="victor-lookbook" 이 있으면 바로 그림 (hidden 상태면 탭 연결 스크립트가 나중에 mount)
  function auto() {
    const el = document.getElementById('victor-lookbook');
    if (!el || el.hasAttribute('data-manual')) return;
    const preview = qs.has('preview') && window.parent !== window;
    const api = mount(el, { preview });
    if (preview) setupPreview(api);
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', auto) : auto();
})();

/* =====================================================================
   (선택) 브랜드 미니샵 탭 연결 — 페이지에 id="vlbTabItem" 탭이 있을 때만 동작
   탭 메뉴(.supplyIndexTabMenu .brandNav)의 "룩북" 탭을 누르면 같은 페이지 아래에 룩북을 보여줌 (주소: ...&tab=lookbook)
   설정: window.LOOKBOOK_TAB = { brands: { main_cate_no: "데이터 파일 주소" }, hide: "숨길 영역 선택자" }
   ===================================================================== */
(function () {
  'use strict';
  if (window.__vlbTabInit) return; window.__vlbTabInit = true;
  const C = Object.assign({
    param: 'tab', value: 'lookbook',
    brands: {},                                                   // { main_cate_no: '데이터 파일 주소' }
    hide: '.supplyIndexTabContent, #customSupplyCateMob',          // 룩북 탭일 때 숨길 기존 영역
  }, window.LOOKBOOK_TAB || {});

  function init() {
    const li = document.getElementById('vlbTabItem');
    const a = li && li.querySelector('a');
    const box = document.getElementById('victor-lookbook');
    if (!li || !a || !box || !window.VictorLookbook) return;

    const p = new URLSearchParams(location.search);
    const brand = p.get('main_cate_no') || p.get('cate_no');
    const src = C.brands[brand];
    if (!src) { li.remove(); box.remove(); return; }              // 룩북이 없는 브랜드는 탭 자체를 숨김
    box.dataset.src = src;

    const st = document.createElement('style');
    st.textContent = `html.vlb-tab-on ${C.hide.split(',').map(s => s.trim()).filter(Boolean).join(',html.vlb-tab-on ')}{display:none !important}`;
    document.head.appendChild(st);

    const isOn = () => new URLSearchParams(location.search).get(C.param) === C.value;
    const urlFor = (on) => { const u = new URL(location.href); if (on) u.searchParams.set(C.param, C.value); else { u.searchParams.delete(C.param); u.hash = ''; } return u; };
    const prdLi = () => document.getElementById('brandPrd')?.closest('li');
    let mounted = false;

    function apply(on) {
      document.documentElement.classList.toggle('vlb-tab-on', on);
      box.hidden = !on;
      if (on) {
        li.parentElement.querySelectorAll(':scope > li').forEach(x => x.classList.toggle('active', x === li));
        if (!mounted) { window.VictorLookbook.mount(box); mounted = true; }
      } else {
        li.classList.remove('active');
        prdLi()?.classList.add('active');
      }
    }
    function fixHref() { const u = urlFor(true); u.hash = ''; a.setAttribute('href', u.pathname + u.search); }

    a.addEventListener('click', e => {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;            // 새 탭으로 열기는 그대로
      e.preventDefault();
      if (!isOn()) history.pushState({ vlb: 1 }, '', urlFor(true));
      apply(true);
    });
    // 룩북을 보는 중에 '상품' 탭을 누르면 새로고침 없이 상품 목록으로
    document.addEventListener('click', e => {
      const prd = e.target.closest('#brandPrd');
      if (!prd || !isOn() || e.metaKey || e.ctrlKey) return;
      const to = new URL(prd.href, location.href);
      if (to.pathname !== location.pathname) return;
      e.preventDefault(); history.pushState({}, '', urlFor(false)); apply(false);
    });
    window.addEventListener('popstate', () => apply(isOn()));

    apply(isOn()); fixHref();
    // 사이트 탭 스크립트(brandCategoryLinkMatch)가 링크·active를 다시 쓰고 난 뒤에 한 번 더 적용
    const ready = (typeof brandReady !== 'undefined' && brandReady && typeof brandReady.then === 'function') ? brandReady : Promise.resolve();
    ready.catch(() => {}).then(() => { fixHref(); apply(isOn()); });
  }
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
