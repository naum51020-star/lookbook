/* =====================================================================
   VICTOR LOOKBOOK — 데이터 파일
   새 시즌/룩북은 이 파일에만 추가하면 됩니다. (index.html은 건드릴 필요 없음)

   ▸ 룩북 추가: lookbooks 배열 맨 앞에 객체 하나 추가 (맨 앞일수록 탭에서 먼저 보임)
       id      : 주소에 쓰이는 고유값 (영문/숫자/-)  → index.html#2026-korea-open
       year    : 2026
       season  : 'SS' 또는 'FW'
       title   : 탭과 제목에 보이는 이름 (영어)
       looks   : [] 로 비워두면 "준비중입니다" 로 표시
       hidden  : true 면 사이트에 안 보임 (준비 중인 룩북 미리 만들어둘 때)
   ▸ 룩 추가: looks 배열에 { image, products } 추가 (LOOK 번호는 순서대로 자동)
       image    : 썸네일 이미지 경로 (3:4 세로 비율, 예: 1200×1600)
       video    : (선택) mp4 주소 — 넣으면 썸네일이 영상으로 재생
       products : 상품번호(product_no) 배열 — 이름/가격/이미지/옵션은 상품 API에서 자동으로 가져옴
   ===================================================================== */
window.LOOKBOOK_DATA = {

  /* 디자인: radius = 시트의 옵션선택·장바구니 버튼·상품 썸네일 모서리(px), roundLooks = 룩 썸네일 테두리에도 적용, maxWidth = 콘텐츠 최대 폭(px) */
  design: { radius: 8, roundLooks: false, maxWidth: 1200 },

  seasons: [
    { key: 'SS', label: 'SPRING/SUMMER' },
    { key: 'FW', label: 'FALL/WINTER' },
  ],

  lookbooks: [
    {
      id: '2026-korea-open',
      year: 2026,
      season: 'FW',
      title: '2026 KOREA OPEN',
      looks: [
        { image: 'images/2026-korea-open/look01.jpg', products: [1464, 1264, 1409, 340] },
        { image: 'images/2026-korea-open/look02.jpg', products: [1465, 1259, 1409, 340] },
      ],
    },
    { id: '2026-fall-winter',   year: 2026, season: 'FW', title: '2026 FALL/WINTER',   looks: [] },
    { id: '2026-spring-summer', year: 2026, season: 'SS', title: '2026 SPRING/SUMMER', looks: [] },
  ],

  /* 상품 API가 응답하지 않을 때 보여줄 기본 상품명 (API가 되면 자동으로 API 값 사용) */
  products: {
    1464: '빅터 배드민턴의류 코리아오픈 기념 티셔츠 블랙 (2026 코리아오픈 에디션)',
    1465: '빅터 배드민턴의류 코리아오픈 기념 티셔츠 화이트 (2026 코리아오픈 에디션)',
    1264: '빅터 배드민턴의류 ORBIT 공용 반바지 (VTC6CPS003U)',
    1259: '빅터 배드민턴의류 LAZY HIPSTER 공용 와이드 팬츠 (VTC6CPL004U)',
    1409: '빅터 스포츠양말 장목양말 VTC6CSC200U',
    340:  '빅터 배드민턴화 A170II (U-SHAPE)',
  },
};
