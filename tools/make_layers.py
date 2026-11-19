"""
착장 결과 → 사이트용 겹치기 레이어 만들기
  사용: python make_layers.py <착장결과 폴더> <lookbook 폴더> tools/kit-crops.json <원본 모델사진 폴더>

착장결과 파일 이름 규칙: m1-p1__VTC6CGW003M.jpg  (작업목록.html 의 '결과 파일 이름')
하는 일:
  1) 결과 사진(768x1024)과 원래 사람 사진의 차이로 '바뀐 부분(옷)'만 찾음
  2) 그 부분만 남긴 투명 PNG를 모델 컷(sim/models/mX-cut.webp)과 같은 크기·위치로 맞춰 저장
     → sim/layers/m1-p1-VTC6CGW003M.webp
  3) victor-teamwear-data.js 의 layers 에 자동 등록
"""
import sys, os, json, re, glob
import numpy as np
from PIL import Image, ImageFilter

res_dir, lb, crops_json, orig_dir = sys.argv[1:5]
crops = json.load(open(crops_json))
meta = json.load(open(f'{lb}/sim/models/meta.json'))
kit_people = os.path.join(os.path.dirname(crops_json), 'victor-tryon-kit', '1_사람사진')
os.makedirs(f'{lb}/sim/layers', exist_ok=True)
src_of = {'m1': '20.jpg', 'm2': '21.jpg', 'm3': '22.jpg'}
added = {}

for f in sorted(glob.glob(f'{res_dir}/*')):
    mt = re.match(r'(m\d)-(p\d)__([A-Z0-9]+)\.(jpe?g|png|webp)$', os.path.basename(f), re.I)
    if not mt: print('건너뜀(이름 규칙 아님):', os.path.basename(f)); continue
    m, pid, code = mt.group(1), mt.group(2), mt.group(3).upper()
    c = crops[f'{m}/{pid}']
    before = np.array(Image.open(f'{kit_people}/{c["file"]}').convert('RGB').resize((768, 1024))).astype(float)
    after_im = Image.open(f).convert('RGB').resize((768, 1024), Image.LANCZOS)
    after = np.array(after_im).astype(float)
    diff = np.abs(after - before).mean(2)
    mask = (diff > 18).astype('uint8') * 255
    mk = Image.fromarray(mask).filter(ImageFilter.MedianFilter(7)).filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.GaussianBlur(3))
    layer = after_im.convert('RGBA'); layer.putalpha(mk)

    # 모델 컷 좌표계로 옮기기
    cut_w, cut_h = meta[m]['w'], meta[m]['h']
    canvas = Image.new('RGBA', (cut_w, cut_h), (0, 0, 0, 0))
    if 'srcCrop' in c:                                  # 원본 사진에서 잘라낸 경우 (m2)
        l, t, r, b = c['srcCrop']
        w0, h0 = r - l, b - t; tw = int(h0 * 0.75)
        if w0 > tw: l += (w0 - tw) // 2; w0 = tw
        else: h0 = min(h0, int(w0 / 0.75))
        piece = layer.resize((w0, h0), Image.LANCZOS)
        bx0, by0, bx1, by1 = meta[m]['src_box']; s = cut_h / (by1 - by0)
        piece = piece.resize((round(w0 * s), round(h0 * s)), Image.LANCZOS)
        canvas.alpha_composite(piece, (round((l - bx0) * s), round((t - by0) * s)))
    else:                                               # 컷에서 한 사람만 올린 경우 (m1, m3)
        x, y, w, h = c['place']; cb = c['cutBox']; s = c['scale']
        piece = layer.crop((x, y, x + w, y + h)).resize((cb[2] - cb[0], cb[3] - cb[1]), Image.LANCZOS)
        canvas.alpha_composite(piece, (cb[0], cb[1]))
    out = f'sim/layers/{m}-{pid}-{code}.webp'
    canvas.save(f'{lb}/{out}', 'WEBP', quality=85, method=6)
    added[f'{m}/{pid}/{code}'] = out
    print('OK', out)

# 데이터 파일에 등록
p = f'{lb}/victor-teamwear-data.js'; s = open(p).read()
mm = re.search(r'"layers":\s*(\{[^}]*\})', s)
cur = json.loads(mm.group(1)) if mm else {}
cur.update(added)
s = s[:mm.start(1)] + json.dumps(cur, ensure_ascii=False, indent=4) + s[mm.end(1):]
open(p, 'w').write(s)
print(len(added), '개 등록')
