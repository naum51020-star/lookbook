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
같은 모델·같은 포즈로 찍은 룩 사진을 허리선에서 나눠, 고른 상의 룩의 윗부분 + 하의 룩의 아랫부분을 이어 붙여 보여줍니다.

| 파일 | 하는 일 |
|---|---|
| `victor-teamwear.js` | 시뮬레이션 화면 (칩을 누를 때만 불러옴) |
| `victor-teamwear-data.js` | 여자/남자 룩 목록, 허리선 위치, 상의·하의 아이콘·이름, 남녀 같은 상의 짝 |
| `sim/looks/` | 배경을 지운 룩 사진(720x1720) + `icons/` 상의·하의 아이콘 |
| `sim/spofl-wm.png` | 워터마크 로고 |
| `tools/make_looks.py` | 새 룩 사진을 같은 크기로 자르고 허리선 찾기 |

- 단체복 옷(룩 사진·아이콘·상품명)은 구글 드라이브에 올린 뒤 개발 담당(Claude)에게 요청해서 `victor-teamwear-data.js`·`sim/looks/`에 반영
- 관리자에서 룩북마다 **"이 룩북에 단체복 NEW 섹션 보이기"** 체크 (체크한 룩북에만 보임)
- 공유 링크: `victor-lookbook.html#teamwear`
- 단체복 문의 버튼: 페이지에 `window.LOOKBOOK_TEAMWEAR_ASK_URL = '/문의주소'`

### 단체복 갤러리 (사람들이 올린 조합)
- 저장소: 카페24 **갤러리형 게시판** (쓰기 권한: 회원). 관리자 [단체복 갤러리]에 게시판 번호를 넣고 내보내기·업로드
- 사이트: [우리 조합 갤러리에 올리기] → 로그인 확인 → 카페24 글쓰기 창에 이미지·제목(클럽명+상의/하의)을 자동으로 채움 → [등록]
- 목록: 단체복 화면 아래 "클럽들이 고른 단체복"에 게시판 글을 읽어 표시 (클럽명, 여자/남자 상의+하의, 날짜)
- 관리: 관리자 [단체복 갤러리]에서 글 목록 확인·사이트에서 숨기기, 완전 삭제는 카페24 관리자 → 게시판 → 게시물 관리
