# VICTOR LOOKBOOK

카페24에 올려서 쓰는 룩북 페이지와 관리자 화면입니다.

| 파일 | 하는 일 |
|---|---|
| `index.html` | 룩북 단독 페이지 + 관리자 미리보기 화면 |
| `lookbook.js` | 룩북 본체 (단독 페이지·브랜드 미니샵 탭 모두 이 파일 하나를 씀) |
| `lookbook-data.js` | 룩북 내용 (관리자에서 [내보내기]로 만드는 파일) |
| `admin.html` | 관리자 화면 (룩북·하위 카테고리·룩·상품 연결·시즌·디자인 편집, 미리보기, 내보내기) |
| `images/` | 룩 썸네일 이미지 (3:4 세로) |

## 사용 순서
1. `admin.html`을 `index.html`과 같은 폴더에서 열어 편집 → **저장**
2. **내보내기 → ZIP 다운로드** → 압축을 풀어 카페24 룩북 폴더에 덮어쓰기 업로드
3. 사이트에서 강력 새로고침 (Ctrl+Shift+R / Cmd+Shift+R)

## 브랜드 미니샵에 탭으로 붙이기 (선택)
미니샵 탭 메뉴(`.supplyIndexTabMenu ul.brandNav`)에 아래를 추가하면 `lookbook.js`가 알아서 연결합니다.

```html
<li id="vlbTabItem"><a id="brandLookbookNew" href="#" data-tab="tab=lookbook">LOOKBOOK</a></li>
<div id="victor-lookbook" data-manual hidden data-pad-top="20"></div>
<script>window.LOOKBOOK_TAB = { brands: { '209': '/lookbook/lookbook-data.js' } };</script>
<script src="/lookbook/lookbook.js"></script>
```
