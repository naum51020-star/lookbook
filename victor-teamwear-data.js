/* =====================================================================
   VICTOR 단체복 시뮬레이션 — 데이터 (룩 사진 갈아끼우기 방식)
   같은 모델·같은 포즈로 찍은 룩 사진을 허리선(hem)에서 나눠서,
   고른 '상의 룩'의 윗부분 + 고른 '하의 룩'의 아랫부분을 이어 붙여 보여줍니다.

   ▸ people.F / people.M : 여자 / 남자 룩 목록 (사진 순서 = 아이콘 순서)
       photo  : 배경을 지운 룩 사진 (모두 같은 크기 720x1720, 같은 위치)
       hem    : 상의가 끝나는 높이(px) — 여기서 위/아래를 나눔
       top / bottom : 아이콘과 이름. 이름은 상품명으로 바꿔 주세요
       top.pair : 남녀 같은 상품인 상의 (예: f3 상의 = m1 상의) → [남녀 같이 입기] 버튼
       bottomSameAs : 하의가 다른 룩과 같은 상품이면 그 룩 id (아이콘 중복 방지)
   ▸ 새 룩 추가: 같은 포즈로 찍은 사진을 넣고 tools/make_looks.py 로 자르면 됩니다
   ===================================================================== */
window.TEAMWEAR_DATA = {
  "canvas": {
    "w": 720,
    "h": 1720,
    "shoulderY": 300
  },
  "people": {
    "F": [
      {
        "id": "f1",
        "photo": "sim/looks/f1.webp",
        "hem": 814,
        "top": {
          "name": "F1 상의",
          "icon": "sim/looks/icons/f1-top.webp"
        },
        "bottom": {
          "name": "F1 하의",
          "icon": "sim/looks/icons/f1-bottom.webp"
        }
      },
      {
        "id": "f2",
        "photo": "sim/looks/f2.webp",
        "hem": 829,
        "top": {
          "name": "F2 상의",
          "icon": "sim/looks/icons/f2-top.webp"
        },
        "bottom": {
          "name": "F2 하의",
          "icon": "sim/looks/icons/f2-bottom.webp"
        }
      },
      {
        "id": "f3",
        "photo": "sim/looks/f3.webp",
        "hem": 838,
        "top": {
          "name": "F3 상의",
          "icon": "sim/looks/icons/f3-top.webp",
          "pair": "m1"
        },
        "bottom": {
          "name": "F3 하의",
          "icon": "sim/looks/icons/f3-bottom.webp"
        }
      }
    ],
    "M": [
      {
        "id": "m1",
        "photo": "sim/looks/m1.webp",
        "hem": 878,
        "top": {
          "name": "M1 상의",
          "icon": "sim/looks/icons/m1-top.webp",
          "pair": "f3"
        },
        "bottom": {
          "name": "M1 하의",
          "icon": "sim/looks/icons/m1-bottom.webp"
        }
      },
      {
        "id": "m2",
        "photo": "sim/looks/m2.webp",
        "hem": 871,
        "top": {
          "name": "M2 상의",
          "icon": "sim/looks/icons/m2-top.webp"
        },
        "bottom": {
          "name": "M2 하의",
          "icon": "sim/looks/icons/m2-bottom.webp"
        }
      },
      {
        "id": "m3",
        "photo": "sim/looks/m3.webp",
        "hem": 880,
        "top": {
          "name": "M3 상의",
          "icon": "sim/looks/icons/m3-top.webp"
        },
        "bottomSameAs": "m1"
      }
    ]
  }
};
