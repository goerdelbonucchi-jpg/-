import {mkdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

// A deterministic, original ambient score. No external audio asset is required.
const rate = 22050;
const seconds = 42;
const samples = rate * seconds;
const data = Buffer.alloc(44 + samples * 2);
data.write('RIFF', 0);
data.writeUInt32LE(data.length - 8, 4);
data.write('WAVEfmt ', 8);
data.writeUInt32LE(16, 16);
data.writeUInt16LE(1, 20);
data.writeUInt16LE(1, 22);
data.writeUInt32LE(rate, 24);
data.writeUInt32LE(rate * 2, 28);
data.writeUInt16LE(2, 32);
data.writeUInt16LE(16, 34);
data.write('data', 36);
data.writeUInt32LE(samples * 2, 40);

const notes = [65.41, 98, 130.81, 164.81, 196];
const cues = [0, 5, 10, 19, 28, 37];
const twoPi = Math.PI * 2;

for (let i = 0; i < samples; i++) {
  const t = i / rate;
  const fadeIn = Math.min(1, t / 1.5);
  const fadeOut = Math.min(1, (seconds - t) / 2.5);
  const envelope = Math.max(0, Math.min(fadeIn, fadeOut));
  const pad = notes.reduce((sum, hz, index) => {
    const wobble = 1 + 0.002 * Math.sin(twoPi * (0.06 + index * 0.012) * t);
    return sum + Math.sin(twoPi * hz * wobble * t + index * 0.4) * (0.072 / (index + 1));
  }, 0);
  const shimmer = 0.014 * Math.sin(twoPi * 523.25 * t) * Math.sin(twoPi * 0.19 * t);
  const chime = cues.reduce((sum, cue, index) => {
    const dt = t - cue;
    if (dt < 0 || dt > 3.2) return sum;
    const decay = Math.exp(-dt * 2.1);
    const hz = [392, 523.25, 440, 587.33, 659.25, 523.25][index];
    return sum + decay * (0.13 * Math.sin(twoPi * hz * dt) + 0.035 * Math.sin(twoPi * hz * 2.01 * dt));
  }, 0);
  const throb = 0.025 * Math.sin(twoPi * 49 * t) * Math.pow(Math.max(0, Math.sin(twoPi * 0.5 * t)), 12);
  const sample = Math.max(-1, Math.min(1, (pad + shimmer + chime + throb) * envelope));
  data.writeInt16LE(Math.round(sample * 32767), 44 + i * 2);
}

const directory = join(process.cwd(), 'public', 'audio');
mkdirSync(directory, {recursive: true});
writeFileSync(join(directory, 'score.wav'), data);
