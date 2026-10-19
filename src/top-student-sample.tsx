import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const FPS = 30;
const NAVY = '#07111f';
const BLUE = '#63a8ff';
const CYAN = '#65e6d2';
const AMBER = '#ffbd66';
const PAPER = '#f6f1e7';
const MUTED = '#9aabc0';
const RED = '#ff6577';
const FONT = '"Noto Sans CJK SC", "Microsoft YaHei", sans-serif';
const SERIF = '"Noto Serif CJK SC", serif';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const sec = (value: number) => Math.round(value * FPS);

type Speaker = 'student' | 'teacher';
type Clip = {
  speaker: Speaker;
  at: number;
  sourceStart: number;
  sourceEnd: number;
  text: string;
  emphasis: string[];
};

const clips: Clip[] = [
  {speaker: 'student', at: 13, sourceStart: 0, sourceEnd: 100, text: '你能预知哪些学生最有潜力成为顶级学霸吗？', emphasis: ['预知', '顶级学霸']},
  {speaker: 'teacher', at: 112, sourceStart: 0, sourceEnd: 239, text: '小菜一碟。我做教育这几年，有四种不同特征的学生，即便现在成绩很不好，将来必然成为学霸，无一例外。', emphasis: ['四种', '必然成为学霸', '无一例外']},
  {speaker: 'student', at: 377, sourceStart: 120, sourceEnd: 208, text: '这么绝对？快讲，我看看我是哪种！', emphasis: ['这么绝对', '哪种']},
  {speaker: 'teacher', at: 475, sourceStart: 261, sourceEnd: 435, text: '而且，但凡你占了两个以上，211起步。', emphasis: ['两个以上', '211起步']},
  {speaker: 'student', at: 657, sourceStart: 227, sourceEnd: 306, text: '行，快说吧！', emphasis: ['快说']},
  {speaker: 'teacher', at: 739, sourceStart: 448, sourceEnd: 689, text: '第一种，目标拆解思维。这种学生最精明，我叫他们“极端现实派”。', emphasis: ['第一种', '目标拆解思维', '极端现实派']},
  {speaker: 'student', at: 986, sourceStart: 318, sourceEnd: 420, text: '这个我有，我也会把600分拆成每科要考多少。', emphasis: ['600分', '每科']},
  {speaker: 'teacher', at: 1102, sourceStart: 706, sourceEnd: 769, text: '哦？那你说说看。', emphasis: ['说说看']},
];

const downbeats = [46, 112, 178, 244, 310, 377, 442, 509, 574, 640, 706, 772, 838, 904, 970, 1036, 1102, 1168, 1234, 1300];

const pop = (frame: number, at: number, damping = 14) =>
  spring({frame: frame - at, fps: FPS, config: {damping, mass: 0.7, stiffness: 170}});

const Scene: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [from, from + 10, to - 10, to], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const previous = [...downbeats].reverse().find((beat) => beat <= frame) ?? 0;
  const pulse = interpolate(frame - previous, [0, 6, 22], [0.22, 0.08, 0], clamp);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 28%, #132b48 0%, #081522 44%, #040a12 100%)', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, opacity: 0.13, backgroundImage: 'linear-gradient(#6b89a522 1px, transparent 1px), linear-gradient(90deg, #6b89a522 1px, transparent 1px)', backgroundSize: '54px 54px'}} />
      <div style={{position: 'absolute', left: '50%', top: '42%', width: 1120, height: 1120, borderRadius: '50%', transform: 'translate(-50%,-50%)', border: `2px solid rgba(101,230,210,${pulse})`, boxShadow: `0 0 120px rgba(70,160,255,${pulse * 0.5})`}} />
      {Array.from({length: 24}, (_, i) => (
        <div key={i} style={{position: 'absolute', left: `${4 + ((i * 37) % 92)}%`, top: `${8 + ((i * 61) % 82)}%`, width: 2, height: 2, borderRadius: '50%', background: i % 3 ? BLUE : AMBER, opacity: 0.12 + (i % 5) * 0.035, transform: `translateY(${Math.sin(frame / 42 + i) * 8}px)`}} />
      ))}
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(90deg,#02060dcc 0%,transparent 22%,transparent 78%,#02060dcc 100%)'}} />
    </AbsoluteFill>
  );
};

const StudentPortrait: React.FC = () => (
  <svg width="236" height="300" viewBox="0 0 236 300">
    <defs><linearGradient id="hoodie" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#4e91ff"/><stop offset="1" stopColor="#214f9d"/></linearGradient></defs>
    <path d="M43 281c4-65 25-91 75-91s72 27 77 91" fill="url(#hoodie)" />
    <path d="M77 179c4 23 15 36 41 36 24 0 36-12 41-36" fill="#edb88e" />
    <ellipse cx="118" cy="123" rx="55" ry="68" fill="#f3c39a" />
    <path d="M62 125c-4-48 18-87 59-87 40 0 65 26 59 77-17-10-28-27-33-45-16 25-45 39-85 43z" fill="#172c4a" />
    <path d="M73 94c-14 11-15 38-2 47" fill="none" stroke="#172c4a" strokeWidth="12" strokeLinecap="round" />
    <circle cx="97" cy="127" r="4.8" fill="#172235" /><circle cx="142" cy="127" r="4.8" fill="#172235" />
    <path d="M106 157c9 6 19 6 28 0" fill="none" stroke="#8b5147" strokeWidth="4" strokeLinecap="round" />
    <path d="M53 281h130" stroke="#65e6d2" strokeWidth="6" strokeLinecap="round" opacity=".55" />
  </svg>
);

const TeacherPortrait: React.FC = () => (
  <svg width="236" height="300" viewBox="0 0 236 300">
    <defs><linearGradient id="jacket" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#b77828"/><stop offset="1" stopColor="#65400f"/></linearGradient></defs>
    <path d="M37 281c6-63 31-91 81-91s76 28 82 91" fill="url(#jacket)" />
    <path d="M92 190l26 31 27-31 22 91H67z" fill="#efe9dc" />
    <ellipse cx="118" cy="122" rx="55" ry="69" fill="#e8b78d" />
    <path d="M64 115c-3-47 23-79 58-79 33 0 58 24 57 67-21-15-47-24-79-23-9 14-20 26-36 35z" fill="#34271f" />
    <rect x="75" y="113" width="38" height="26" rx="10" fill="none" stroke="#152238" strokeWidth="5" />
    <rect x="125" y="113" width="38" height="26" rx="10" fill="none" stroke="#152238" strokeWidth="5" />
    <path d="M113 124h12" stroke="#152238" strokeWidth="5" />
    <circle cx="95" cy="126" r="4" fill="#162235" /><circle cx="144" cy="126" r="4" fill="#162235" />
    <path d="M105 158c9 5 20 5 29-1" fill="none" stroke="#824940" strokeWidth="4" strokeLinecap="round" />
    <path d="M53 281h130" stroke="#ffbd66" strokeWidth="6" strokeLinecap="round" opacity=".6" />
  </svg>
);

const Person: React.FC<{speaker: Speaker; active: boolean}> = ({speaker, active}) => {
  const frame = useCurrentFrame();
  const color = speaker === 'student' ? BLUE : AMBER;
  const side = speaker === 'student' ? 'left' : 'right';
  const breathe = active ? 1 + Math.sin(frame / 9) * 0.008 : 0.94;
  return (
    <div style={{position: 'absolute', [side]: 62, top: 240, width: 285, height: 520, opacity: active ? 1 : 0.43, transform: `scale(${breathe})`, transition: 'opacity 160ms ease', transformOrigin: '50% 70%', zIndex: 5}}>
      <div style={{position: 'absolute', left: 15, top: 32, width: 255, height: 350, borderRadius: 150, background: `radial-gradient(circle,${color}34,transparent 68%)`, filter: 'blur(4px)'}} />
      <div style={{position: 'absolute', left: 24, top: 6}}>{speaker === 'student' ? <StudentPortrait /> : <TeacherPortrait />}</div>
      <div style={{position: 'absolute', left: 25, top: 330, width: 235, borderRadius: 18, padding: '13px 0', textAlign: 'center', color: PAPER, fontFamily: FONT, fontWeight: 800, fontSize: 25, letterSpacing: 5, background: '#07111fe8', border: `1px solid ${color}88`, boxShadow: active ? `0 0 28px ${color}30` : 'none'}}>{speaker === 'student' ? '学生' : '学霸'}</div>
      {active && <div style={{position: 'absolute', left: 123, top: 402, width: 36, height: 5, borderRadius: 9, background: color, boxShadow: `0 0 18px ${color}`}} />}
    </div>
  );
};

const Header: React.FC = () => (
  <div style={{position: 'absolute', left: 68, right: 68, top: 42, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: FONT, zIndex: 10}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 18}}><div style={{width: 10, height: 38, borderRadius: 9, background: CYAN, boxShadow: `0 0 20px ${CYAN}88`}} /><div><div style={{fontSize: 17, letterSpacing: 5, color: CYAN}}>STUDY MINDSET</div><div style={{fontSize: 24, color: PAPER, fontWeight: 800, letterSpacing: 2}}>四种顶级学霸思维</div></div></div>
    <div style={{fontSize: 15, color: MUTED, letterSpacing: 4}}>01 · OPENING SAMPLE</div>
  </div>
);

const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const reveal = pop(frame, 46);
  return <Scene from={0} to={112}><div style={{position: 'absolute', left: 395, right: 395, top: 190, height: 570, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}><div style={{fontFamily: FONT, color: MUTED, fontSize: 22, letterSpacing: 8, marginBottom: 28}}>QUESTION  /  你能预知吗</div><div style={{fontFamily: SERIF, fontSize: 69, lineHeight: 1.35, color: PAPER, fontWeight: 900, textAlign: 'center'}}>谁最有潜力<br /><span style={{display: 'inline-block', color: CYAN, fontSize: 100, transform: `scale(${0.72 + reveal * 0.28})`, textShadow: `0 0 40px ${CYAN}30`}}>成为顶级学霸？</span></div><div style={{marginTop: 42, width: 630, height: 2, background: `linear-gradient(90deg,transparent,${BLUE},${CYAN},transparent)`, transform: `scaleX(${reveal})`}} /></div></Scene>;
};

const FourTraitsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const traits = [
    {label: '目标拆解', color: BLUE, at: 178},
    {label: '失败复盘', color: '#c897ff', at: 195},
    {label: '主动攻击', color: AMBER, at: 211},
    {label: '知识网络', color: CYAN, at: 228},
  ];
  const arrow = pop(frame, 244);
  const badge = pop(frame, 310);
  return <Scene from={112} to={377}><div style={{position: 'absolute', left: 385, top: 175, width: 1150, height: 595}}><div style={{fontFamily: SERIF, fontSize: 52, color: PAPER, fontWeight: 900, textAlign: 'center'}}>我见过 <span style={{fontSize: 80, color: AMBER}}>四种</span> 不同特征</div><div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginTop: 32}}>{traits.map((trait, index) => {const p = pop(frame, trait.at); return <div key={trait.label} style={{height: 115, borderRadius: 22, border: `1px solid ${trait.color}77`, background: `linear-gradient(145deg,${trait.color}22,#0a1827dd)`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', transform: `translateY(${(1-p)*28}px) scale(${0.82+p*0.18})`, opacity: p}}><div style={{fontFamily: FONT, color: trait.color, fontWeight: 900, fontSize: 25, letterSpacing: 2}}>0{index+1}</div><div style={{fontFamily: FONT, color: PAPER, fontSize: 24, marginTop: 7}}>{trait.label}</div></div>})}</div><div style={{position: 'absolute', left: 150, top: 315, width: 850, height: 190}}><div style={{position: 'absolute', left: 0, top: 42, width: 245, height: 105, padding: '24px 22px', boxSizing: 'border-box', borderRadius: 18, background: '#0b1929', border: '1px solid #6f829888', fontFamily: FONT, color: MUTED, fontSize: 25, textAlign: 'center'}}>现在成绩<br /><b style={{color: RED, fontSize: 31}}>并不好</b></div><svg width="360" height="120" style={{position: 'absolute', left: 245, top: 30, overflow: 'visible'}}><path d="M10 87 C100 88 130 20 265 38" fill="none" stroke={CYAN} strokeWidth="5" strokeDasharray="360" strokeDashoffset={360*(1-arrow)} /><path d="M252 26 L275 38 L253 53" fill="none" stroke={CYAN} strokeWidth="5" opacity={arrow} /></svg><div style={{position: 'absolute', right: 0, top: 13, width: 265, height: 145, borderRadius: 22, background: 'linear-gradient(135deg,#ffe5a9,#cf8c34)', boxShadow: `0 0 ${badge*55}px #ffbd6655`, transform: `scale(${0.82+badge*0.18})`, opacity: badge, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: NAVY, fontFamily: FONT}}><div style={{fontSize: 18, letterSpacing: 5}}>FUTURE</div><div style={{fontSize: 43, fontWeight: 950}}>顶级学霸</div></div></div></div></Scene>;
};

const ChallengeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const stamp = pop(frame, 377, 10);
  const question = pop(frame, 442);
  return <Scene from={377} to={475}><div style={{position: 'absolute', left: 410, right: 410, top: 190, bottom: 300, display: 'flex', justifyContent: 'center', alignItems: 'center'}}><div style={{position: 'absolute', fontFamily: FONT, fontWeight: 950, fontSize: 86, letterSpacing: 14, color: PAPER, transform: `rotate(-4deg) scale(${0.72+stamp*0.28})`, border: `7px solid ${RED}`, padding: '28px 54px', opacity: stamp, boxShadow: `inset 0 0 28px ${RED}33,0 0 28px ${RED}22`}}>无一例外</div><div style={{position: 'absolute', right: 70, bottom: -30, fontFamily: SERIF, color: BLUE, fontSize: 54, fontWeight: 900, transform: `translateY(${(1-question)*25}px)`, opacity: question}}>这么绝对？</div></div></Scene>;
};

const TwoPlusScene: React.FC = () => {
  const frame = useCurrentFrame();
  const one = pop(frame, 509); const two = pop(frame, 526); const score = pop(frame, 574, 11);
  const items = ['目标', '复盘', '主动', '网络'];
  return <Scene from={475} to={657}><div style={{position: 'absolute', left: 430, right: 430, top: 190, height: 565, textAlign: 'center'}}><div style={{fontFamily: FONT, color: MUTED, fontSize: 22, letterSpacing: 5}}>命中越多 · 涨分越快</div><div style={{display: 'flex', justifyContent: 'center', gap: 28, marginTop: 40}}>{items.map((item,index)=>{const lit=index===0?one:index===1?two:0; return <div key={item} style={{width: 142,height:142,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT,fontWeight:900,fontSize:27,color:lit?NAVY:MUTED,background:lit?`radial-gradient(circle,${index?AMBER:CYAN},${index?'#bd7229':'#319e9d'})`:'#0b1929',border:`2px solid ${lit?(index?AMBER:CYAN):'#42536a'}`,transform:`scale(${0.88+lit*0.12})`,boxShadow:lit?`0 0 38px ${index?AMBER:CYAN}55`:'none'}}>{item}</div>})}</div><div style={{marginTop: 24,fontFamily:SERIF,color:PAPER,fontWeight:900,fontSize:42}}>占到 <span style={{color:CYAN,fontSize:68}}>2</span> 种以上</div><div style={{marginTop: 5,display:'flex',justifyContent:'center',alignItems:'baseline',gap:22,transform:`scale(${0.68+score*0.32})`,opacity:score}}><div style={{fontFamily:FONT,color:MUTED,fontSize:28}}>目标院校</div><div style={{fontFamily:SERIF,fontSize:128,fontWeight:950,lineHeight:1,color:AMBER,textShadow:`0 0 48px ${AMBER}44`}}>211</div><div style={{fontFamily:FONT,color:PAPER,fontSize:36,fontWeight:900}}>起步</div></div></div></Scene>;
};

const ChapterScene: React.FC = () => {
  const frame = useCurrentFrame();
  const chapter = pop(frame, 706, 12);
  const label = pop(frame, 838);
  const path = pop(frame, 904);
  return <Scene from={657} to={986}><div style={{position:'absolute',left:405,right:405,top:150,height:650}}><div style={{display:'flex',alignItems:'center',gap:28,transform:`translateX(${(1-chapter)*80}px)`,opacity:chapter}}><div style={{fontFamily:SERIF,fontSize:150,fontWeight:950,lineHeight:1,color:BLUE}}>01</div><div><div style={{fontFamily:FONT,color:MUTED,fontSize:18,letterSpacing:7}}>TOP STUDENT MINDSET</div><div style={{fontFamily:SERIF,color:PAPER,fontSize:70,fontWeight:950,marginTop:5}}>目标拆解思维</div></div></div><div style={{marginTop:25,height:3,background:`linear-gradient(90deg,${BLUE},${CYAN},transparent)`,transform:`scaleX(${chapter})`,transformOrigin:'left'}} /><div style={{display:'grid',gridTemplateColumns:'1fr 1.1fr',gap:38,marginTop:42}}><div style={{borderRadius:24,border:'1px solid #526d8b77',background:'#0a1827dc',padding:32}}><div style={{fontFamily:FONT,color:MUTED,fontSize:19,letterSpacing:4}}>他们是</div><div style={{fontFamily:SERIF,color:AMBER,fontSize:52,fontWeight:950,marginTop:13,opacity:label,transform:`translateY(${(1-label)*18}px)`}}>极端现实派</div><div style={{fontFamily:FONT,color:PAPER,fontSize:24,lineHeight:1.7,marginTop:18}}>目标可以很野<br />路径必须现实</div></div><div style={{position:'relative',borderRadius:24,border:'1px solid #526d8b77',background:'#0a1827dc',padding:32,overflow:'hidden'}}><div style={{fontFamily:FONT,color:MUTED,fontSize:18,letterSpacing:3}}>从结果一路反推到今天</div><svg width="510" height="190" viewBox="0 0 510 190" style={{marginTop:10}}><path d="M25 150 C120 145 113 95 215 96 S320 38 478 39" fill="none" stroke={CYAN} strokeWidth="5" strokeDasharray="650" strokeDashoffset={650*(1-path)} /><circle cx="25" cy="150" r="12" fill={BLUE} opacity={path}/><circle cx="215" cy="96" r="12" fill={AMBER} opacity={path}/><circle cx="478" cy="39" r="14" fill={CYAN} opacity={path}/><text x="8" y="181" fill={MUTED} fontSize="18">今天</text><text x="183" y="132" fill={MUTED} fontSize="18">阶段目标</text><text x="425" y="76" fill={PAPER} fontSize="18">目标院校</text></svg></div></div></div></Scene>;
};

const NaivePlanScene: React.FC = () => {
  const frame = useCurrentFrame();
  const subjects = [{name:'语文',score:'120'},{name:'数学',score:'130'},{name:'英语',score:'130'},{name:'物理',score:'?'},{name:'化学',score:'?'},{name:'生物',score:'?'}];
  return <Scene from={986} to={1300}><div style={{position:'absolute',left:405,right:405,top:165,height:625}}><div style={{fontFamily:SERIF,fontSize:55,fontWeight:950,color:PAPER,textAlign:'center'}}>把 <span style={{color:AMBER,fontSize:82}}>600 分</span> 拆成每科目标</div><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:17,marginTop:34}}>{subjects.map((subject,index)=>{const at=1036+index*16; const p=pop(frame,at); return <div key={subject.name} style={{height:112,borderRadius:19,background:index<3?'linear-gradient(135deg,#f8f2e4,#cfd9e7)':'#0b1929',border:index<3?'none':'1px dashed #5d7089',transform:`scale(${0.8+p*0.2})`,opacity:p,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 28px',fontFamily:FONT,color:index<3?NAVY:MUTED}}><span style={{fontSize:25,fontWeight:800}}>{subject.name}</span><span style={{fontSize:42,fontWeight:950,color:index<3?'#245da9':MUTED}}>{subject.score}</span></div>})}</div><div style={{position:'absolute',left:225,right:225,bottom:18,height:96,borderRadius:22,background:'#07111ff2',border:`1px solid ${AMBER}88`,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:SERIF,fontSize:38,color:PAPER,opacity:pop(frame,1102),transform:`translateY(${(1-pop(frame,1102))*22}px)`}}><span style={{color:AMBER,fontSize:62,marginRight:25}}>？</span>哦？那你说说看。</div></div></Scene>;
};

const HighlightedText: React.FC<{clip: Clip}> = ({clip}) => {
  const terms = [...clip.emphasis].sort((a,b)=>b.length-a.length);
  const pattern = new RegExp(`(${terms.map((term)=>term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})`);
  return <>{clip.text.split(pattern).map((part,index)=>terms.includes(part)?<span key={index} style={{color:clip.speaker==='student'?BLUE:AMBER,fontWeight:950}}>{part}</span>:part)}</>;
};

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const activeIndex = clips.findIndex((clip,index)=>frame>=clip.at && frame<(clips[index+1]?.at ?? 1300));
  if(activeIndex<0) return null;
  const clip=clips[activeIndex];
  const enter=pop(frame,clip.at,16);
  const color=clip.speaker==='student'?BLUE:AMBER;
  return <div style={{position:'absolute',left:320,right:320,bottom:38,minHeight:145,borderRadius:28,background:'linear-gradient(180deg,#0a1725f2,#050c14f7)',border:`1px solid ${color}70`,boxShadow:'0 18px 55px #0009',padding:'21px 42px 24px',boxSizing:'border-box',zIndex:20,transform:`translateY(${(1-enter)*20}px)`,opacity:enter}}><div style={{display:'flex',alignItems:'center',gap:14,fontFamily:FONT,fontSize:18,fontWeight:900,letterSpacing:4,color}}><span style={{display:'inline-block',width:9,height:9,borderRadius:'50%',background:color,boxShadow:`0 0 12px ${color}`}} />{clip.speaker==='student'?'学生 STUDENT':'学霸 MENTOR'}</div><div style={{fontFamily:FONT,fontSize:clip.text.length>42?35:40,lineHeight:1.42,color:PAPER,fontWeight:750,marginTop:8,textAlign:'center'}}><HighlightedText clip={clip}/></div></div>;
};

const DialogueAudio: React.FC = () => <>{clips.map((clip,index)=><Sequence key={index} from={clip.at} durationInFrames={clip.sourceEnd-clip.sourceStart}><Audio src={staticFile(`top-student/source/${clip.speaker}.mp3`)} trimBefore={clip.sourceStart} trimAfter={clip.sourceEnd} volume={clip.speaker==='student'?1.12:1.35}/></Sequence>)}</>;

const sfx: {at:number;file:string;volume:number}[] = [
  {at:46,file:'piano-low.wav',volume:.55},{at:112,file:'pizzicato.wav',volume:.42},
  {at:178,file:'marimba-f.wav',volume:.35},{at:195,file:'marimba-ab.wav',volume:.35},{at:211,file:'marimba-c.wav',volume:.35},{at:228,file:'marimba-eb.wav',volume:.35},
  {at:244,file:'harp-rise.wav',volume:.35},{at:310,file:'bell.wav',volume:.36},{at:377,file:'impact.wav',volume:.48},{at:442,file:'pizzicato.wav',volume:.4},
  {at:509,file:'woodblock.wav',volume:.35},{at:526,file:'woodblock.wav',volume:.35},{at:574,file:'piano-low.wav',volume:.58},{at:574,file:'bell.wav',volume:.3},
  {at:673,file:'reverse-cymbal.wav',volume:.28},{at:706,file:'impact.wav',volume:.48},{at:772,file:'marimba-f.wav',volume:.32},{at:838,file:'marimba-ab.wav',volume:.32},{at:904,file:'harp-rise.wav',volume:.3},
  ...[1036,1052,1068,1084,1100,1116].map((at)=>({at,file:'soft-click.wav',volume:.18})),
  {at:1102,file:'pizzicato.wav',volume:.31},{at:1168,file:'woodblock.wav',volume:.24},
];

const SfxAudio: React.FC = () => <>{sfx.map((item,index)=><Sequence key={`${item.at}-${index}`} from={item.at}><Audio src={staticFile(`top-student/sfx/${item.file}`)} volume={item.volume}/></Sequence>)}</>;

export const TopStudentSample: React.FC = () => {
  const frame=useCurrentFrame();
  const active=[...clips].reverse().find((clip)=>clip.at<=frame)?.speaker ?? 'student';
  return <AbsoluteFill style={{fontFamily:FONT}}><Background/><Audio src={staticFile('top-student/source/music.mp3')} volume={0.18}/><DialogueAudio/><SfxAudio/><Header/><Person speaker="student" active={active==='student'}/><Person speaker="teacher" active={active==='teacher'}/><HookScene/><FourTraitsScene/><ChallengeScene/><TwoPlusScene/><ChapterScene/><NaivePlanScene/><Captions/></AbsoluteFill>;
};
