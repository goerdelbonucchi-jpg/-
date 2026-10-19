import numpy as np,json,re,subprocess,argparse,tempfile
from scipy.io import wavfile
from scipy.signal import stft, correlate, resample
from scipy.ndimage import gaussian_filter1d
from scipy.fft import rfft, irfft, next_fast_len
from pathlib import Path

def feat(p):
 sr,x=wavfile.read(p);x=x.astype(float)/32768
 _,_,z=stft(x,fs=sr,nperseg=256,noverlap=176,boundary=None)
 power=abs(z)**2
 bands=np.array([power[a:b].sum(axis=0) for a,b in zip(np.linspace(3,110,25).astype(int)[:-1],np.linspace(3,110,25).astype(int)[1:])])
 f=np.log(bands+1e-8);f-=gaussian_filter1d(f,100,axis=1);f/=np.maximum(f.std(axis=1,keepdims=True),.3)
 return f
parser=argparse.ArgumentParser(description='Map source dialogue audio to the combined master using log-spectral correlation.')
parser.add_argument('--source-dir',default='public/top-student/source')
parser.add_argument('--output',default='subtitles/audio-match-anchors.json')
args=parser.parse_args()
cache=tempfile.TemporaryDirectory(prefix='dialogue-match-')
for who,filename in [('full','full-dialogue.mp3'),('student','student.mp3'),('teacher','teacher.mp3')]:
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(Path(args.source_dir)/filename),'-ac','1','-ar','8000',str(Path(cache.name)/(who+'.wav'))],check=True)
full=feat(str(Path(cache.name)/'full.wav'))
allmaps={}
nfft=next_fast_len(full.shape[1]+100)
fullfft=rfft(full,nfft,axis=1)
sums=np.pad(np.cumsum(full,axis=1),((0,0),(1,0)))
sq=np.pad(np.cumsum(full**2,axis=1),((0,0),(1,0)))
for who in ['student','teacher']:
 src=feat(str(Path(cache.name)/(who+'.wav')));anchors=[]
 for at in range(0,src.shape[1]-80,40):
  q=src[:,at:at+80];cand=[]
  for scale in [.85,.90,.95,1.,1.05,1.1,1.15]:
   n=round(80*scale);t=resample(q,n,axis=1);t-=t.mean(axis=1,keepdims=True)
   c=irfft((fullfft*rfft(t[:,::-1],nfft,axis=1)).sum(axis=0),nfft)[n-1:full.shape[1]]
   e=((sq[:,n:]-sq[:,:-n])-(sums[:,n:]-sums[:,:-n])**2/n).sum(axis=0)
   score=c/np.sqrt(np.maximum(e,1)*np.sum(t*t))
   for _ in range(3):
    i=int(score.argmax());cand.append((float(score[i]),i/100,scale));score[max(0,i-40):i+40]=-1
  anchors.append({'source':at/100+.4,'candidates':sorted(cand,reverse=True)[:12]})
 # chain all source windows; permit source windows to remain unmatched (low score).
 prev=None;layers=[]
 for a in anchors:
  cs=a['candidates']; vals=[];backs=[]
  for score,t,scale in cs:
   if prev is None:v=score;bi=-1
   else:
    opts=[]
    for j,(ps,pt,_) in enumerate(anchors[len(layers)-1]['candidates']):
     dt=t-pt
     penalty= .12*abs(dt-.4) if 0.03<dt<15 else 2+abs(dt)*.01
     opts.append(prev[j]+score-penalty)
    bi=int(np.argmax(opts));v=opts[bi]
   vals.append(v);backs.append(bi)
  layers.append(backs);prev=np.array(vals)
 idx=int(prev.argmax());mapped=[]
 for k in range(len(anchors)-1,-1,-1):
  a=anchors[k];score,t,scale=a['candidates'][idx];mapped.append({'source':a['source'],'target':t+.4*scale,'score':score,'scale':scale});idx=layers[k][idx]
 mapped.reverse();allmaps[who]=mapped
 print(who,json.dumps(mapped[:40],ensure_ascii=False),flush=True)
Path(args.output).write_text(json.dumps(allmaps,indent=2))
cache.cleanup()
