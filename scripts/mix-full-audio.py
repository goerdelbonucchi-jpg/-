from pathlib import Path
import subprocess,json
import numpy as np
from scipy.io import wavfile
from scipy.ndimage import uniform_filter1d
SR=48000
m=json.loads(Path('out/full-assembly/manifest.json').read_text());n=m['frames']*1600

def decode(p):
 raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-f','f32le','-ac','2','-ar',str(SR),'-'])
 return np.frombuffer(raw,dtype='<f4').reshape(-1,2)
master=decode('public/top-student/source/full-dialogue-sync.wav')
mix=np.zeros((n,2),dtype=np.float32);mix[:len(master)]+=.70*master
music=decode('public/top-student/source/music-continuous.wav')[:n]
gain=np.full(m['frames'],.10*1.15,dtype=np.float32)
for c in m['captions']:gain[c['start']:c['end']]=.065*1.15
gain=np.repeat(gain,1600)
gain=uniform_filter1d(gain,size=480,mode='nearest')
gain[-57600:]*=np.linspace(1,0,57600,dtype=np.float32)
mix+=music*gain[:,None]
cache={}
for x in m['effects']:
 if x['file'] not in cache:cache[x['file']]=decode(Path('public/top-student/sfx')/x['file'])
 s=cache[x['file']];a=x['at']*1600;b=min(n,a+len(s));mix[a:b]+=s[:b-a]*x['volume']
peak=float(abs(mix).max());print('Full mix sample peak:',peak)
if peak>=1:raise RuntimeError('Mix would clip')
wavfile.write('out/full-assembly/mix.wav',SR,(mix*32767).astype(np.int16))
