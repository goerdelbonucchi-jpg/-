import {execFileSync} from 'node:child_process';
import {existsSync,statSync} from 'node:fs';
import {join} from 'node:path';
const dir=join(process.cwd(),'public','top-student','source');
const source=join(dir,'music.mp3'),output=join(dir,'music-continuous.wav');
// Preserve the original intro and join a second copy with a two-second crossfade.
// This covers the whole 334.9-second master without segment-local restarts.
if(!existsSync(output)||statSync(output).mtimeMs<statSync(source).mtimeMs){
 execFileSync('ffmpeg',['-y','-v','error','-i',source,'-i',source,'-filter_complex','[0:a][1:a]acrossfade=d=2:c1=tri:c2=tri,aresample=48000[a]','-map','[a]','-ac','2','-c:a','pcm_s16le',output],{stdio:'inherit'});
}
const duration=Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',output],{encoding:'utf8'}).trim());
if(duration<335)throw new Error(`Continuous music is too short: ${duration}s`);
console.log(`Continuous music ready: ${duration.toFixed(3)}s, with a 2s crossfade.`);
