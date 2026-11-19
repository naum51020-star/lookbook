import sys,json,numpy as np
from PIL import Image, ImageFilter
SEG,I,M=sys.argv[1:4]
meta=json.load(open(f'{M}/meta.json'))
src={'m1':'20','m2':'21','m3':'22'}
people={'m1':['p1','p2'],'m2':['p1','p2'],'m3':['p1','p2']}
out={}
for m,ps in people.items():
    cat=np.load(f'{SEG}/mc{src[m]}.npy')[...,0]
    img=np.array(Image.open(f'{I}/{src[m]}.jpg').convert('RGB')).astype(float)
    x0,y0,x1,y1=meta[m]['src_box']; W,H=meta[m]['w'],meta[m]['h']
    cat=np.array(Image.fromarray(cat[y0:y1,x0:x1]).resize((W,H),Image.NEAREST))
    img=np.array(Image.fromarray(img[y0:y1,x0:x1].astype('uint8')).resize((W,H),Image.LANCZOS)).astype(float)
    split=int(meta[m]['split']*W) if m!='m2' else 470
    for k,pid in enumerate(ps):
        cl=(cat==4)
        if m=='m2':   # 겹친 사진: 높이에 따라 경계가 다름 (위쪽은 여자 소매가 앞에 있음)
            Y=np.arange(H)[:,None]; X=np.arange(W)[None,:]
            sp=np.where(Y<720,470,415)
            cl &= (X<sp) if k==0 else (X>=sp)
        elif k==0: cl[:,split:]=False
        else: cl[:,:split]=False
        # 가장 큰 덩어리만 (다른 사람 옷 조각 제거)
        ys,xs=np.where(cl)
        top=ys.min(); bot=ys.max()
        # 행별 옷 색 → 상의/하의 경계 찾기
        rows=[]
        for y in range(top,bot+1):
            px=img[y][cl[y]]
            rows.append(px.mean(0) if len(px)>15 else None)
        n=len(rows); best=None; bestd=-1
        prev=None
        sm=[]
        for i in range(n):
            win=[r for r in rows[max(0,i-6):i+1] if r is not None]; sm.append(np.mean(win,0) if win else None)
        for i in range(int(n*0.30),int(n*0.85)):
            a=sm[i]; b=sm[min(n-1,i+12)]
            if a is None or b is None: continue
            d=np.linalg.norm(a-b)
            if d>bestd: bestd=d; best=i
        cut_y=top+best+6
        if m=='m2':   # 겹친 사진: 주황 상의가 끝나는 줄을 상의 끝으로
            orange=(img[...,0]>140)&(img[...,0]-img[...,2]>55)&cl
            if k==1: orange[:,:490]=False          # 남자: 여자 상의가 섞이지 않게 오른쪽만 봄
            cnt=np.convolve(orange.sum(1),np.ones(15)/15,mode='same'); ys_o=np.where(cnt>40)[0]; y=ys_o.min(); gap=0
            while y<H and gap<40:
                gap = gap+1 if cnt[y]<=8 else 0; y+=1
            cut_y=y-40+6
        mask=cl.copy(); mask[cut_y:]=False
        # 옷 안쪽 구멍(빛 반사·로고 등) 메우기: 바깥에서 채워지지 않는 부분 = 구멍
        from PIL import ImageDraw
        inv=Image.fromarray(np.pad(~mask,1,constant_values=True).astype('uint8')*255).copy()
        ImageDraw.floodfill(inv,(0,0),128)
        holes=(np.array(inv)[1:-1,1:-1]==255)
        mask=mask|holes
        ys,xs=np.where(mask); bx0,bx1,by0,by1=xs.min(),xs.max(),ys.min(),ys.max()
        a=Image.fromarray((mask*255).astype('uint8')).filter(ImageFilter.MaxFilter(15)).filter(ImageFilter.MinFilter(13)).filter(ImageFilter.GaussianBlur(1.2))
        lum=img.mean(2); inside=lum[mask]
        ref=np.percentile(inside,92)
        sh=np.clip(lum/ max(ref,1),0,1.15)
        sh=np.array(Image.fromarray((np.clip(sh,0,1)*255).astype('uint8')).filter(ImageFilter.GaussianBlur(9))).astype(float)/255
        shade=np.clip(0.72+0.30*sh,0,1)
        rgba=np.zeros((H,W,4),'uint8'); rgba[...,:3]=(shade*255).astype('uint8')[...,None]; rgba[...,3]=np.array(a)
        crop=Image.fromarray(rgba).crop((bx0,by0,bx1+1,by1+1))
        fn=f'sim/models/{m}-{pid}-top.png'; crop.save(f'{M}/../../{fn}' if False else f'/home/user/lookbook/{fn}',optimize=True)
        out[f'{m}/{pid}']=dict(top=fn,box=[int(bx0),int(by0),int(bx1-bx0+1),int(by1-by0+1)],colorDiff=round(float(bestd),1))
        print(m,pid,out[f'{m}/{pid}'])
json.dump(out,open('/home/user/lookbook/sim/models/tops.json','w'),indent=1)
