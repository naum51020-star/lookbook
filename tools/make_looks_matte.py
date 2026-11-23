import sys,json,numpy as np
from PIL import Image, ImageFilter
d,out=sys.argv[1:3]
M=json.load(open(f'{out}/meta.json'))
def blur(a,r): return np.array(Image.fromarray(a).filter(ImageFilter.GaussianBlur(r)))
for f in ['f1','f2','f3','m1','m2','m3']:
    im=np.array(Image.open(f'{d}/{f}.jpg').convert('RGB')).astype(float); H,W,_=im.shape
    bgc=np.load(f'{d}/{f}_bg.npy')
    person=(1-bgc)>0.5
    pm=Image.fromarray((person*255).astype('uint8'))
    outer=np.array(pm.filter(ImageFilter.MaxFilter(25)))>0          # 사람 주변 넉넉히
    inner=np.array(pm.filter(ImageFilter.MinFilter(15)))>0          # 확실히 사람 안쪽
    # 배경색: 줄마다 양 끝 배경 픽셀의 중간값 → 위아래 조명 차이 반영
    bgrow=np.zeros((H,3))
    for y in range(H):
        px=np.concatenate([im[y,:60],im[y,-60:]]); bgrow[y]=np.median(px,0)
    dist=np.sqrt(((im-bgrow[:,None,:])**2).sum(2))
    a=np.clip((dist-6)/22,0,1)                                      # 배경과 차이가 클수록 불투명
    a[~outer]=0; a[inner]=1
    a8=(a*255).astype('uint8')
    a8=np.array(Image.fromarray(a8).filter(ImageFilter.MedianFilter(3)).filter(ImageFilter.GaussianBlur(0.7)))
    rgba=np.dstack([im.astype('uint8'),a8])
    cx=M[f]['cx']; Wc=720; x0=cx-Wc//2
    crop=Image.fromarray(rgba,'RGBA').crop((x0,60,x0+Wc,1780))
    crop.save(f'{out}/{f}.webp','WEBP',quality=90,method=6)
    print(f,'ok')
