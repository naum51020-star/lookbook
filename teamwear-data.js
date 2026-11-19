/* =====================================================================
   VICTOR 단체복 시뮬레이션 — 데이터
   ▸ garments : 단체복 목록 (구글 드라이브 폴더 = 상품코드, 끝 글자 F 여자 / M 남자 / U 공용)
       part  : 'top' 상의 · 'bottom' 하의(바지·치마)
       name  : 화면에 보일 이름 (비워두면 코드)
       thumb : 'drive:파일ID' (구글 드라이브 썸네일) 또는 이미지 경로
   ▸ models : 1단계에서 고르는 모델 사진 (people: 사진 속 사람 위치·성별, 0~1 비율)
   ▸ layers : (착장 이미지가 준비되면) '모델id/사람id/상품코드': '이미지 경로'
       예) 'm1/p1/VTC6CGW003M': 'sim/layers/m1-p1-VTC6CGW003M.webp'
       → 있으면 실제로 옷이 바뀌어 보이고, 없으면 선택한 옷 이름표만 보여요.
   ===================================================================== */
window.TEAMWEAR_DATA = {
  "models": [
    {
      "id": "m1",
      "thumb": "sim/models/m1.jpg",
      "cutout": "sim/models/m1-cut.webp",
      "fullBody": true,
      "people": [
        {
          "id": "p1",
          "gender": "M",
          "x": 0.3,
          "topY": 0.27,
          "bottomY": 0.47
        },
        {
          "id": "p2",
          "gender": "F",
          "x": 0.76,
          "topY": 0.3,
          "bottomY": 0.5
        }
      ]
    },
    {
      "id": "m2",
      "thumb": "sim/models/m2.jpg",
      "cutout": "sim/models/m2-cut.webp",
      "fullBody": false,
      "people": [
        {
          "id": "p1",
          "gender": "F",
          "x": 0.27,
          "topY": 0.4,
          "bottomY": 0.83
        },
        {
          "id": "p2",
          "gender": "M",
          "x": 0.7,
          "topY": 0.3,
          "bottomY": 0.68
        }
      ]
    },
    {
      "id": "m3",
      "thumb": "sim/models/m3.jpg",
      "cutout": "sim/models/m3-cut.webp",
      "fullBody": true,
      "people": [
        {
          "id": "p1",
          "gender": "M",
          "x": 0.27,
          "topY": 0.22,
          "bottomY": 0.47
        },
        {
          "id": "p2",
          "gender": "F",
          "x": 0.72,
          "topY": 0.24,
          "bottomY": 0.47
        }
      ]
    }
  ],
  "garments": [
    {
      "code": "VTC6CGW003F",
      "gender": "F",
      "part": "top",
      "name": "경기복 003",
      "thumb": "sim/garments/VTC6CGW003F.webp"
    },
    {
      "code": "VTC6CGW003M",
      "gender": "M",
      "part": "top",
      "name": "경기복 003",
      "thumb": "sim/garments/VTC6CGW003M.webp"
    },
    {
      "code": "VTC6CGW004F",
      "gender": "F",
      "part": "top",
      "name": "경기복 004",
      "thumb": "sim/garments/VTC6CGW004F.webp"
    },
    {
      "code": "VTC6CGW004M",
      "gender": "M",
      "part": "top",
      "name": "경기복 004",
      "thumb": "sim/garments/VTC6CGW004M.webp"
    },
    {
      "code": "VTC6CGW008F",
      "gender": "F",
      "part": "top",
      "name": "경기복 008",
      "thumb": "sim/garments/VTC6CGW008F.webp"
    },
    {
      "code": "VTC6CGW008M",
      "gender": "M",
      "part": "top",
      "name": "경기복 008",
      "thumb": "sim/garments/VTC6CGW008M.webp"
    },
    {
      "code": "VTC6CTO104U",
      "gender": "U",
      "part": "top",
      "name": "티셔츠 104",
      "thumb": "sim/garments/VTC6CTO104U.webp"
    },
    {
      "code": "VTC6CTO105U",
      "gender": "U",
      "part": "top",
      "name": "티셔츠 105",
      "thumb": "sim/garments/VTC6CTO105U.webp"
    },
    {
      "code": "VTC6CTS002F",
      "gender": "F",
      "part": "top",
      "name": "이지티 002",
      "thumb": "sim/garments/VTC6CTS002F.webp"
    },
    {
      "code": "VTC6CTS002M",
      "gender": "M",
      "part": "top",
      "name": "이지티 002",
      "thumb": "sim/garments/VTC6CTS002M.webp"
    }
  ],
  "layers": {}
};
