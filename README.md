# VICTOR LOOKBOOK

카페24에 올려서 쓰는 룩북 페이지와 관리자 화면입니다.

| 파일 | 하는 일 |
|---|---|
| `victor-lookbook.html` | 룩북 단독 페이지 + 관리자 미리보기 화면 |
| `victor-lookbook.js` | 룩북 본체 (단독 페이지·브랜드 미니샵 탭 모두 이 파일 하나를 씀) |
| `victor-lookbook-data.js` | 룩북 내용 (관리자에서 [내보내기]로 만드는 파일) |
| `victor-admin.html` | 관리자 화면 (룩북·하위 카테고리·룩·상품 연결·시즌·디자인 편집, 미리보기, 내보내기) |
| `images/` | 룩 썸네일 이미지 (3:4 세로) |

## 사용 순서
1. `victor-admin.html`을 `victor-lookbook.html`과 같은 폴더에서 열어 편집 → **저장**
2. **내보내기 → ZIP 다운로드** → 압축을 풀어 카페24 룩북 폴더에 덮어쓰기 업로드
3. 사이트에서 강력 새로고침 (Ctrl+Shift+R / Cmd+Shift+R)

## 브랜드 미니샵에 탭으로 붙이기 (선택)
미니샵 탭 메뉴(`.supplyIndexTabMenu ul.brandNav`)에 아래를 추가하면 `victor-lookbook.js`가 알아서 연결합니다.

```html
<li id="vlbTabItem"><a id="brandLookbookNew" href="#" data-tab="tab=lookbook">LOOKBOOK</a></li>
<div id="victor-lookbook" data-manual hidden data-pad-top="20"></div>
<script>window.LOOKBOOK_TAB = { brands: { '209': '/lookbook/victor-lookbook-data.js' } };</script>
<script src="/lookbook/victor-lookbook.js"></script>
```

## 단체복 시뮬레이션 (룩북 카테고리 줄의 "단체복 NEW")
| 파일 | 하는 일 |
|---|---|
| `victor-teamwear.js` | 시뮬레이션 화면 (칩을 누를 때만 불러옴 → 평소 룩북 속도에 영향 없음) |
| `victor-teamwear-data.js` | 모델 사진·단체복 목록(구글 드라이브 폴더 = 상품코드)·착장 레이어 |
| `sim/models/` | 모델 사진 3장 (썸네일 + 배경을 오려낸 인물 이미지) |
| `sim/spofl-wm.png` | 워터마크 로고 |

- 관리자 상단 **[단체복]** 버튼으로 섹션 보이기/숨기기 (내보내기 후 업로드)
- 공유 링크: `victor-lookbook.html#teamwear` (미니샵은 `…&tab=lookbook#teamwear`)
- 단체복 문의 버튼: 페이지에 `window.LOOKBOOK_TEAMWEAR_ASK_URL = '/문의주소'` 를 넣으면 보임
- 실제 착장(옷 바뀜)은 `victor-teamwear-data.js` 의 `layers` 에 착장 이미지를 연결하면 바로 반영됨. 없으면 선택한 옷 이름표만 표시

## 착장 이미지 붙이기 (무료 도구)
1. `victor-tryon-kit.zip`의 `작업목록.html`을 따라 무료 착장 도구로 결과 이미지를 만든다 (파일 이름 = 결과 파일 이름)
2. `tools/make_layers.py`로 결과에서 옷 부분만 잘라 `sim/layers/`에 넣고 `victor-teamwear-data.js`의 `layers`에 등록
