import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';

const GOLD = '#d9b978';
const PALE = '#f4e2b5';
const CREAM = '#e9e1d1';
const MUTED = '#8c8273';
const FONT = '"Noto Serif CJK SC", "Source Han Serif SC", serif';
const SANS = '"Noto Sans CJK SC", sans-serif';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const fade = (f: number, duration: number) =>
  Math.min(interpolate(f, [0, 18], [0, 1], clamp), interpolate(f, [duration - 20, duration], [1, 0], clamp));

const seeded = (n: number) => {
  const value = Math.sin(n * 127.1 + 78.233) * 43758.5453;
  return value - Math.floor(value);
};

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #1a1612 0%, #0a0a0c 56%, #030406 100%)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 62%, transparent 23%, #020305b8 100%)'}} />
      {Array.from({length: 64}, (_, i) => {
        const x = seeded(i + 4) * 1280;
        const y = seeded(i + 91) * 720;
        const drift = Math.sin(frame / 55 + i) * 7;
        const size = 1 + seeded(i + 213) * 2;
        return <div key={i} style={{position: 'absolute', left: x + drift, top: y + frame * (0.016 + seeded(i + 42) * 0.012) % 740, width: size, height: size, borderRadius: '50%', background: i % 5 === 0 ? GOLD : '#a79775', opacity: 0.09 + seeded(i + 23) * 0.18, boxShadow: i % 9 === 0 ? '0 0 9px #d6b578' : undefined}} />;
      })}
      <div style={{position: 'absolute', inset: 0, opacity: 0.045, backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, #d6bd90 3px, transparent 4px)', backgroundSize: '4px 4px'}} />
    </AbsoluteFill>
  );
};

const Scene: React.FC<{duration: number; children: React.ReactNode}> = ({duration, children}) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{opacity: fade(frame, duration)}}>{children}</AbsoluteFill>;
};

const Eyebrow: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => <div style={{fontFamily: SANS, fontSize: 15, letterSpacing: 7, color: '#ae9980', ...style}}>{children}</div>;
const GoldTitle: React.FC<{children: React.ReactNode; size?: number; style?: React.CSSProperties}> = ({children, size = 70, style}) => <div style={{fontFamily: FONT, fontSize: size, lineHeight: 1.23, letterSpacing: 9, fontWeight: 700, background: 'linear-gradient(180deg, #fff5d5 5%, #dbbb73 48%, #8c6633 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 5px 18px #ae74385c)', ...style}}>{children}</div>;
const Caption: React.FC<{children: React.ReactNode}> = ({children}) => <div style={{position: 'absolute', bottom: 62, left: 0, width: '100%', textAlign: 'center', color: CREAM, fontFamily: FONT, fontWeight: 600, letterSpacing: 3, fontSize: 25, textShadow: '0 2px 20px #000'}}>{children}</div>;
const Era: React.FC<{year: string; label: string}> = ({year, label}) => <div style={{position: 'absolute', left: 70, top: 38}}><div style={{fontFamily: FONT, fontSize: 52, color: GOLD, lineHeight: 1}}>{year}</div><div style={{width: 210, height: 1, background: '#a8874e', margin: '12px 0'}} /><div style={{fontFamily: FONT, fontSize: 16, letterSpacing: 2, color: CREAM}}>{label}</div></div>;

const PIP: Record<number, [number, number][]> = {
  1: [[50, 50]], 2: [[28, 28], [72, 72]], 3: [[28, 28], [50, 50], [72, 72]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  6: [[28, 25], [72, 25], [28, 50], [72, 50], [28, 75], [72, 75]],
};

const DieFace: React.FC<{value: number; size: number; transform?: string}> = ({value, size, transform}) => <div style={{position: 'absolute', width: size, height: size, borderRadius: size * 0.1, border: '1px solid #dccba9', background: 'linear-gradient(135deg,#fff8e7,#d3c4a4 75%,#b9a987)', boxShadow: 'inset -7px -10px 17px #7a6c4a55, inset 5px 5px 12px #fff9e9', transform, backfaceVisibility: 'hidden'}}>{PIP[value].map(([x, y], i) => <span key={i} style={{position: 'absolute', width: size * 0.12, height: size * 0.12, left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: value === 1 ? '#a53c32' : '#27221d', boxShadow: 'inset 2px 2px 3px #0a0808'}} />)}</div>;

const Die3D: React.FC<{size: number; turn: number; style?: React.CSSProperties}> = ({size, turn, style}) => <div style={{width: size, height: size, perspective: size * 5, ...style}}><div style={{position: 'relative', width: size, height: size, transformStyle: 'preserve-3d', transform: `rotateX(${-19 + turn * 2.3}deg) rotateY(${27 + turn * 3.9}deg) rotateZ(${turn * 0.45}deg)`}}><DieFace value={1} size={size} transform={`translateZ(${size / 2}px)`} /><DieFace value={6} size={size} transform={`rotateY(180deg) translateZ(${size / 2}px)`} /><DieFace value={3} size={size} transform={`rotateY(90deg) translateZ(${size / 2}px)`} /><DieFace value={4} size={size} transform={`rotateY(-90deg) translateZ(${size / 2}px)`} /><DieFace value={2} size={size} transform={`rotateX(90deg) translateZ(${size / 2}px)`} /><DieFace value={5} size={size} transform={`rotateX(-90deg) translateZ(${size / 2}px)`} /></div></div>;

const FlatDie: React.FC<{value: number; size?: number}> = ({value, size = 48}) => <div style={{position: 'relative', width: size, height: size, display: 'inline-block', flexShrink: 0}}><DieFace value={value} size={size} /></div>;

const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const scale = interpolate(f, [0, 120], [0.72, 1.08], clamp);
  return <Scene duration={150}><div style={{position: 'absolute', left: 458, top: 115, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, #ad763a35 0%, transparent 68%)'}} /><div style={{position: 'absolute', left: 528, top: 164, transform: `scale(${scale})`}}><Die3D size={196} turn={f * 0.37} /></div><div style={{position: 'absolute', left: 365, top: 470, width: 550, textAlign: 'center'}}><Eyebrow>一枚骰子落下之前</Eyebrow><div style={{fontFamily: FONT, color: CREAM, fontSize: 32, letterSpacing: 5, marginTop: 18}}>你能预知结果吗？</div></div><Caption>每一次落点，都是未知。</Caption></Scene>;
};

const BellCurve: React.FC<{width: number; height: number; progress?: number}> = ({width, height, progress = 1}) => {
  const points = Array.from({length: 101}, (_, i) => {
    const x = i / 100 * width;
    const z = (i - 50) / 18;
    const y = height - 12 - Math.exp(-z * z / 2) * (height - 32);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}><path d={`M0 ${height - 12}H${width}`} stroke="#8d764e" strokeWidth="1" opacity="0.7" /><path d={points} fill="none" stroke={PALE} strokeWidth="2.2" strokeDasharray="1400" strokeDashoffset={1400 * (1 - progress)} style={{filter: 'drop-shadow(0 0 7px #efcc8e)'}} /></svg>;
};

const TitleScene: React.FC = () => {
  const f = useCurrentFrame();
  const titleY = interpolate(f, [0, 40], [25, 0], clamp);
  return <Scene duration={150}><div style={{position: 'absolute', top: 170, width: '100%', textAlign: 'center', transform: `translateY(${titleY}px)`}}><Eyebrow style={{marginBottom: 26}}>DE FORMA FORTUNAE</Eyebrow><GoldTitle size={91}>运气的形状</GoldTitle><div style={{margin: '8px auto 0', width: 560}}><BellCurve width={560} height={80} progress={interpolate(f, [20, 95], [0, 1], clamp)} /></div><div style={{fontFamily: FONT, color: '#bfb5a2', letterSpacing: 8, fontSize: 23, marginTop: 22}}>人类如何把偶然写进数学</div></div></Scene>;
};

const Probability: React.FC = () => {
  const f = useCurrentFrame();
  const rows7: [number, number][] = [[1, 6], [2, 5], [3, 4], [4, 3], [5, 2], [6, 1]];
  const leftOpacity = interpolate(f, [33, 62], [0, 1], clamp);
  const rightOpacity = interpolate(f, [75, 102], [0, 1], clamp);
  return <Scene duration={270}><Era year="1494" label="卢卡 · 帕乔利" /><Eyebrow style={{position: 'absolute', left: 0, top: 62, width: '100%', textAlign: 'center'}}>TWO DICE · THIRTY-SIX POSSIBILITIES</Eyebrow><div style={{position: 'absolute', top: 140, left: 197, width: 886, display: 'flex', justifyContent: 'space-between'}}><div style={{width: 380, textAlign: 'center', opacity: leftOpacity}}><div style={{fontFamily: FONT, fontSize: 66, color: PALE}}>7<span style={{fontSize: 26, marginLeft: 10}}>点</span></div><div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 48px)', columnGap: 10, rowGap: 9, justifyContent: 'center', marginTop: 24}}>{rows7.map(([a, b], i) => <React.Fragment key={i}><FlatDie value={a} /><FlatDie value={b} /><div style={{fontFamily: FONT, fontSize: 23, color: GOLD, lineHeight: '48px'}}>×1</div></React.Fragment>)}</div><div style={{fontFamily: FONT, fontSize: 21, color: MUTED, marginTop: 18}}>6 种组合</div></div><div style={{height: 355, width: 1, background: 'linear-gradient(transparent,#9e8252,transparent)', marginTop: 40}} /><div style={{width: 380, textAlign: 'center', opacity: rightOpacity}}><div style={{fontFamily: FONT, fontSize: 66, color: PALE}}>2<span style={{fontSize: 26, marginLeft: 10}}>点</span></div><div style={{display: 'flex', gap: 10, justifyContent: 'center', marginTop: 120}}><FlatDie value={1} size={72} /><FlatDie value={1} size={72} /></div><div style={{fontFamily: FONT, fontSize: 21, color: MUTED, marginTop: 118}}>只有 1 种组合</div></div></div><Caption>相同的骰子，不同的机会。</Caption></Scene>;
};

const rolls = Array.from({length: 1200}, (_, i) => Math.floor(seeded(i * 3 + 874) * 6) + 1);
const rates = rolls.map((_, i) => rolls.slice(0, i + 1).filter((n) => n === 6).length / (i + 1));

const LawOfLargeNumbers: React.FC = () => {
  const f = useCurrentFrame();
  const progress = interpolate(f, [34, 222], [0.01, 1], clamp);
  const chart = Array.from({length: 185}, (_, i) => {
    const n = 1 + Math.round(1199 * (i / 184) ** 2);
    const x = 20 + i / 184 * 760;
    const y = 342 - Math.max(0.01, Math.min(0.37, rates[n - 1])) / 0.37 * 285;
    return {x, y, n};
  });
  const visible = Math.max(2, Math.floor(progress * chart.length));
  const sample = chart[visible - 1].n;
  const path = chart.slice(0, visible).map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const currentRate = rates[sample - 1] * 100;
  return <Scene duration={270}><Era year="1713" label="雅各布 · 伯努利" /><Eyebrow style={{position: 'absolute', left: 326, top: 89}}>LAW OF LARGE NUMBERS</Eyebrow><div style={{position: 'absolute', left: 245, top: 160, width: 800, height: 365}}><svg width="800" height="380" viewBox="0 0 800 380"><path d="M20 342H780 M20 30V342" stroke="#71644e" fill="none" /><path d="M20 213H780" stroke={GOLD} strokeDasharray="5 7" opacity="0.6" /><path d={path} stroke={PALE} strokeWidth="2.5" fill="none" style={{filter: 'drop-shadow(0 0 5px #d1b16c)'}} /><circle cx={chart[visible - 1].x} cy={chart[visible - 1].y} r="5" fill={PALE} style={{filter: 'drop-shadow(0 0 8px #efcf8a)'}} /><text x="690" y="199" fill={GOLD} fontSize="19">1/6 ≈ 16.7%</text><text x="16" y="371" fill={MUTED} fontSize="15">1</text><text x="222" y="371" fill={MUTED} fontSize="15">100</text><text x="713" y="371" fill={MUTED} fontSize="15">1,200 次</text></svg></div><div style={{position: 'absolute', top: 545, width: '100%', textAlign: 'center', fontFamily: FONT, color: PALE, fontSize: 25}}>{sample.toLocaleString()} 次投掷 <span style={{color: MUTED, margin: '0 12px'}}>·</span> 出现 6 的比例 <span style={{color: GOLD}}>{currentRate.toFixed(1)}%</span></div><Caption>重复足够多次，偶然开始显出轮廓。</Caption></Scene>;
};

const Galton: React.FC = () => {
  const f = useCurrentFrame();
  const cx = 640; const dx = 61; const dy = 42;
  const balls = Array.from({length: 66}, (_, i) => {
    const age = f - 13 - i * 2.25;
    if (age < 0) return null;
    const steps = Math.min(9, age / 9);
    const whole = Math.floor(steps);
    const partial = steps - whole;
    let offset = 0;
    for (let row = 0; row < whole; row++) offset += seeded(i * 47 + row * 11) < 0.5 ? -0.5 : 0.5;
    if (whole < 9) offset += (seeded(i * 47 + whole * 11) < 0.5 ? -0.5 : 0.5) * partial;
    return {x: cx + offset * dx, y: 154 + steps * dy, arrived: steps >= 9, bin: Math.round(offset + 4.5)};
  });
  const bins = Array.from({length: 10}, (_, index) => balls.filter((b) => b?.arrived && b.bin === index).length);
  return <Scene duration={270}><Era year="1873" label="弗朗西斯 · 高尔顿" /><Eyebrow style={{position: 'absolute', left: 0, top: 62, width: '100%', textAlign: 'center'}}>THE GALTON BOARD</Eyebrow><div style={{position: 'absolute', top: 119, left: 300, width: 680, height: 485, border: '1px solid #a786555e', boxShadow: 'inset 0 0 40px #a7865515, 0 0 32px #0009'}}><svg width="680" height="485" viewBox="300 119 680 485"><path d="M640 140 L340 520 M640 140 L940 520" stroke="#b18e5d" strokeWidth="1.3" opacity="0.5" fill="none" />{Array.from({length: 9}, (_, row) => Array.from({length: row + 1}, (_, col) => <circle key={`${row}-${col}`} cx={cx + (col - row / 2) * dx} cy={177 + row * dy} r="4.2" fill="#b49767" style={{filter: 'drop-shadow(0 0 4px #deb875)'}} />))}{bins.map((amount, bin) => <rect key={bin} x={cx + (bin - 4.5) * dx - 22} y={568 - amount * 4.5} width="44" height={amount * 4.5} fill="#c6a369" opacity="0.75" />)}{balls.map((b, i) => b && !b.arrived ? <circle key={i} cx={b.x} cy={b.y} r="4" fill={i % 4 === 0 ? PALE : GOLD} style={{filter: 'drop-shadow(0 0 5px #e4bd71)'}} /> : null)}<path d="M345 568H935" stroke={GOLD} opacity="0.55" /></svg></div><Caption>无数次微小偏转，汇成一条曲线。</Caption></Scene>;
};

const Finale: React.FC = () => {
  const f = useCurrentFrame();
  return <Scene duration={150}><div style={{position: 'absolute', top: 132, width: '100%', textAlign: 'center'}}><Eyebrow>AFTER COUNTLESS THROWS</Eyebrow><div style={{width: 640, margin: '28px auto 7px'}}><BellCurve width={640} height={165} progress={interpolate(f, [10, 90], [0, 1], clamp)} /></div><GoldTitle size={76}>运气的形状</GoldTitle><div style={{fontFamily: FONT, color: CREAM, fontSize: 28, letterSpacing: 7, marginTop: 25}}>是概率写下的秩序</div><div style={{width: 150, height: 1, background: GOLD, margin: '33px auto 0'}} /></div></Scene>;
};

export const FortuneShape: React.FC = () => <AbsoluteFill><Background /><Audio src={staticFile('audio/score.wav')} volume={1} /><Sequence from={0} durationInFrames={150}><Intro /></Sequence><Sequence from={150} durationInFrames={150}><TitleScene /></Sequence><Sequence from={300} durationInFrames={270}><Probability /></Sequence><Sequence from={570} durationInFrames={270}><LawOfLargeNumbers /></Sequence><Sequence from={840} durationInFrames={270}><Galton /></Sequence><Sequence from={1110} durationInFrames={150}><Finale /></Sequence></AbsoluteFill>;
