import sys,json,numpy as np
from PIL import Image, ImageFilter
d,out=sys.argv[1:3]
meta={}
for f in ['f1','f2','f3','m1','m2','m3']:
    im=Image.open(f'{d}/{f}.jpg').convert('RGB'); a=np.array(im).astype(float)
    cat=np.load(f'{d}/{f}_cat.npy'); bg=np.load(f'{d}/{f}_bg.npy')
    ys,xs=np.where(cat>0); cx=(xs.min()+xs.max())//2
    # 상의 끝(허리선): 옷(4) 픽셀의 행별 평균색이 가장 크게 바뀌는 곳 (몸통 가운데 열만)
    cl=(cat==4); cl[:, :cx-90]=False; cl[:, cx+90:]=False
    rows=np.where(cl.sum(1)>40)[0]; top,bot=rows.min(),rows.max()
    col=np.array([a[y][cl[y]].mean(0) if cl[y].sum()>40 else [np.nan]*3 for y in range(top,bot+1)])
    best,bd=None,-1
    for i in range(int(len(col)*0.35),int(len(col)*0.9)):
        u=np.nanmean(col[max(0,i-15):i],0); v=np.nanmean(col[i+3:i+18],0)
        dd=np.nansum(np.abs(u-v))
        if dd>bd: bd,best=dd,i
    hem=int(top+best)
    alpha=np.clip((1-bg-0.1)/0.8,0,1)
    A=Image.fromarray((alpha*255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.2))
    rgba=im.copy(); rgba.putalpha(A)
    W=720; x0=cx-W//2
    crop=rgba.crop((x0,60,x0+W,1780))           # 720 x 1720 공통 캔버스
    crop.save(f'{out}/{f}.webp','WEBP',quality=88,method=6)
    meta[f]=dict(hem=hem-60,cx=int(cx),diff=round(float(bd)))
    print(f,meta[f])
json.dump(meta,open(f'{out}/meta.json','w'),indent=1)
