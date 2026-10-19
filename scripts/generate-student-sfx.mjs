import {mkdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const rate = 44100;
const out = join(process.cwd(), 'public', 'top-student', 'sfx');
mkdirSync(out, {recursive: true});

let seed = 73191;
const noise = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 0xffffffff * 2 - 1;
};
const clamp = (v) => Math.max(-1, Math.min(1, v));

const write = (name, seconds, synth) => {
  const count = Math.ceil(seconds * rate);
  const buffer = Buffer.alloc(44 + count * 2);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(buffer.length - 8, 4);
  buffer.write('WAVEfmt ', 8);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(rate, 24);
  buffer.writeUInt32LE(rate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(count * 2, 40);
  for (let i = 0; i < count; i++) {
    const t = i / rate;
    const attack = Math.min(1, t / 0.006);
    const end = Math.min(1, (seconds - t) / 0.025);
    buffer.writeInt16LE(Math.round(clamp(synth(t) * attack * Math.max(0, end)) * 32767), 44 + i * 2);
  }
  writeFileSync(join(out, name), buffer);
};

const partial = (hz, t, decay, phase = 0) => Math.sin(Math.PI * 2 * hz * t + phase) * Math.exp(-t * decay);
const mallet = (hz) => (t) => 0.6 * partial(hz, t, 9) + 0.24 * partial(hz * 3.01, t, 16) + 0.12 * partial(hz * 5.08, t, 24);

write('piano-low.wav', 1.3, (t) => 0.5 * partial(87.31, t, 2.8) + 0.24 * partial(130.81, t, 3.3) + 0.12 * partial(174.62, t, 5.2) + noise() * Math.exp(-t * 38) * 0.05);
write('pizzicato.wav', 0.7, (t) => 0.55 * partial(207.65, t, 7.5) + 0.22 * partial(415.3, t, 12) + 0.08 * noise() * Math.exp(-t * 30));
write('marimba-f.wav', 0.55, mallet(349.23));
write('marimba-ab.wav', 0.55, mallet(415.3));
write('marimba-c.wav', 0.55, mallet(523.25));
write('marimba-eb.wav', 0.55, mallet(622.25));
write('woodblock.wav', 0.28, (t) => 0.52 * partial(783, t, 24) + 0.29 * partial(1190, t, 31) + noise() * Math.exp(-t * 50) * 0.09);
write('bell.wav', 1.45, (t) => 0.4 * partial(698.46, t, 2.5) + 0.26 * partial(1047.7, t, 3.2) + 0.18 * partial(1680, t, 4.1) + 0.08 * partial(2397, t, 5.5));
write('harp-rise.wav', 1.25, (t) => {
  const notes = [349.23, 415.3, 523.25, 622.25];
  return notes.reduce((sum, hz, index) => {
    const local = t - index * 0.16;
    return local < 0 ? sum : sum + 0.29 * partial(hz, local, 5.5) + 0.08 * partial(hz * 2.01, local, 8);
  }, 0);
});
let previous = 0;
write('reverse-cymbal.wav', 1.1, (t) => {
  const raw = noise();
  const high = raw - previous * 0.86;
  previous = raw;
  return high * Math.pow(t / 1.1, 1.7) * 0.28;
});
write('impact.wav', 1.05, (t) => {
  const sweep = 58 + 42 * Math.exp(-t * 9);
  return 0.55 * Math.sin(Math.PI * 2 * sweep * t) * Math.exp(-t * 4.2) + noise() * Math.exp(-t * 28) * 0.13;
});
write('soft-click.wav', 0.22, (t) => 0.35 * partial(930, t, 30) + 0.14 * partial(1395, t, 36));

// Short, restrained opening layers in F minor; leave space for the question.
write('title-pluck.wav', 0.42, (t) => 0.46 * partial(349.23, t, 12) + 0.17 * partial(698.46, t, 20));
write('title-chime.wav', 0.85, (t) => 0.32 * partial(698.46, t, 5) + 0.13 * partial(1047.7, t, 7) + 0.06 * partial(1396.92, t, 10));
let titleLow = 0;
write('title-air.wav', 0.24, (t) => {
  titleLow = titleLow * .85 + noise() * .15;
  return titleLow * Math.sin(Math.PI * t / .24) ** 2 * .7;
});
write('title-rise.wav', 16 / 30, (t) => {
  const p = t / (16 / 30);
  return (Math.sin(2 * Math.PI * (174.615 * t + 87.3075 * t * p)) * .15 + noise() * .025) * p * p;
});
