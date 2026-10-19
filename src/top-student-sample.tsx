import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
} from 'remotion';

const FPS = 30;
const INK = '#f6f1e7';
const BLUE = '#63a8ff';
const SKY = '#65e6d2';
const STUDENT = '#ffbd66';
const RED = '#ff6577';
const GREEN = '#65e6d2';
const PAPER = '#07111f';
const MUTED = '#9aabc0';
const FONT = '"Noto Sans CJK SC", "Microsoft YaHei", sans-serif';
const SERIF = '"Noto Serif CJK SC", "Songti SC", serif';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type Speaker = 'student' | 'teacher';
type Line = {speaker: Speaker; start: number; end: number; text: string; emphasis: string[]};

// Timings come from silence boundaries in the single, combined dialogue file.
const lines: Line[] = [
  {speaker: 'student', start: 0, end: 95, text: '你能预知哪些学生最有潜力成为顶级学霸吗？', emphasis: ['预知', '顶级学霸']},
  {speaker: 'teacher', start: 119, end: 330, text: '小菜一碟。我做教育这几年，有四种不同特征的学生，即便现在成绩很不好，将来必然成为学霸，无一例外。', emphasis: ['四种', '必然成为学霸', '无一例外']},
  {speaker: 'student', start: 351, end: 490, text: '这么绝对？快讲，我看看我是哪种！', emphasis: ['这么绝对', '哪种']},
  {speaker: 'teacher', start: 507, end: 676, text: '而且，但凡你占了两个以上，211起步。', emphasis: ['两个以上', '211起步']},
  {speaker: 'student', start: 697, end: 769, text: '行，快说吧！', emphasis: ['快说']},
  {speaker: 'teacher', start: 784, end: 971, text: '第一种，目标拆解思维。这种学生最精明，我叫他们“极端现实派”。', emphasis: ['第一种', '目标拆解思维', '极端现实派']},
  {speaker: 'student', start: 988, end: 1129, text: '这个我有，我也会把600分拆成每科要考多少。', emphasis: ['600分', '每科']},
  {speaker: 'teacher', start: 1157, end: 1209, text: '哦？那你说说看。', emphasis: ['说说看']},
  {speaker: 'student', start: 1227, end: 1350, text: '语文120，数学130，英语130，剩下三科……', emphasis: ['120', '130', '剩下三科']},
];

const beatFrames = [46,112,178,244,310,377,442,509,574,640,706,772,838,904,970,1036,1102,1168,1234,1300];
const pop = (frame: number, at: number, damping = 14) => spring({frame: frame - at, fps: FPS, config: {damping, mass: 0.65, stiffness: 175}});
const fade = (frame: number, from: number, to: number) => interpolate(frame, [from, from + 8, to - 8, to], [0, 1, 1, 0], clamp);

const Stage: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const frame = useCurrentFrame();
  return <div style={{position:'absolute',left:420,top:104,width:1080,height:650,opacity:fade(frame,from,to)}}>{children}</div>;
};

const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{background:'rgba(8,24,39,.94)',border:'2px solid #3a5874',borderRadius:24,boxShadow:'0 16px 40px rgba(0,0,0,.28)',...style}}>{children}</div>
);

const Header: React.FC = () => {
  const frame = useCurrentFrame();
  return <div style={{position:'absolute',left:58,right:58,top:30,height:58,display:'flex',alignItems:'center',justifyContent:'space-between',fontFamily:FONT,zIndex:20}}>
    <div style={{display:'flex',alignItems:'center',gap:14}}><div style={{width:9,height:38,borderRadius:8,background:SKY,boxShadow:`0 0 18px ${SKY}88`}}/><div style={{fontWeight:900,fontSize:26,color:INK,letterSpacing:2}}>四种顶级学霸思维</div><div style={{fontSize:19,color:SKY,background:'#10253a',borderRadius:20,padding:'6px 15px',fontWeight:700,border:'1px solid #2c536d'}}>命中越多 · 涨分越快</div></div>
    <div style={{display:'flex',gap:8}}>{[0,1,2,3].map((i)=><div key={i} style={{width:42,height:5,borderRadius:8,background:frame>=784+i*500?BLUE:'#293b4f'}}/>)}</div>
  </div>;
};

const SpeakerTag: React.FC<{side:'left'|'right';label:string;active:boolean;color:string}> = ({side,label,active,color}) => {
  const frame=useCurrentFrame();
  return <div style={{position:'absolute',[side]:side==='left'?82:100,top:700,padding:'9px 19px',borderRadius:23,color:active?'#07111f':MUTED,background:active?color:'rgba(7,17,31,.88)',border:`2px solid ${active?color:'#385069'}`,fontFamily:FONT,fontWeight:900,fontSize:22,boxShadow:active?`0 0 24px ${color}55`:'none',transform:`scale(${active?1+Math.sin(frame/7)*.025:.94})`,zIndex:14}}>{active&&<span style={{display:'inline-block',width:7,height:7,borderRadius:'50%',background:'#07111f',marginRight:9,verticalAlign:3}}/>}{label}</div>;
};

const CharacterLayer: React.FC<{active:Speaker|null}> = ({active}) => {
  const frame=useCurrentFrame();
  const beat=[...beatFrames].reverse().find((b)=>b<=frame)??0;
  const pulse=interpolate(frame-beat,[0,7,20],[1,.25,0],clamp);
  return <>
    <Img src={staticFile('top-student/student-cutout.png')} style={{position:'absolute',left:42,bottom:45,width:410,height:658,objectFit:'contain',objectPosition:'bottom',opacity:active==='teacher'?.48:1,transform:`translateY(${Math.sin(frame/18)*3}px) scale(${active==='student'?1.025:.98})`,transformOrigin:'50% 90%',filter:active==='student'?`drop-shadow(0 0 22px ${STUDENT}55)`:'none'}}/>
    <Img src={staticFile('top-student/teacher-cutout.png')} style={{position:'absolute',right:26,bottom:34,width:690,height:832,objectFit:'contain',objectPosition:'bottom',opacity:active==='student'?.48:1,transform:`translateY(${Math.sin(frame/20+1)*3}px) scale(${active==='teacher'?1.02:.98})`,transformOrigin:'60% 90%',filter:active==='teacher'?`drop-shadow(0 0 25px ${BLUE}55)`:'none'}}/>
    <div style={{position:'absolute',left:18,bottom:40,width:450,height:620,borderRadius:'50%',opacity:active==='student'?.20+pulse*.10:0,background:`radial-gradient(circle,${STUDENT}44,transparent 68%)`}}/>
    <div style={{position:'absolute',right:34,bottom:35,width:650,height:730,borderRadius:'50%',opacity:active==='teacher'?.18+pulse*.08:0,background:`radial-gradient(circle,${BLUE}3d,transparent 69%)`}}/>
    <SpeakerTag side="left" label="学生" active={active==='student'} color={STUDENT}/><SpeakerTag side="right" label="学霸" active={active==='teacher'} color={BLUE}/>
  </>;
};

const HookScene:React.FC=()=>{const frame=useCurrentFrame();const p=pop(frame,62);return <Stage from={0} to={119}><div style={{height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',transform:'translateY(-25px)'}}><div style={{fontFamily:FONT,fontSize:23,color:MUTED,letterSpacing:8}}>你能预知吗？</div><div style={{fontFamily:SERIF,color:INK,fontWeight:950,fontSize:68,lineHeight:1.25,textAlign:'center',marginTop:18}}>谁最有潜力<br/><span style={{color:SKY,fontSize:88,display:'inline-block',transform:`scale(${.72+p*.28})`,textShadow:`0 0 34px ${SKY}33`}}>成为顶级学霸</span></div><div style={{width:660,height:6,borderRadius:7,background:`linear-gradient(90deg,transparent,${STUDENT},${SKY},transparent)`,marginTop:28,transform:`scaleX(${p})`}}/></div></Stage>};

const FourTraitsScene:React.FC=()=>{const frame=useCurrentFrame();const traits=['目标拆解','失败复盘','主动攻击','知识网络'];const colors=[BLUE,'#c897ff',STUDENT,GREEN];const arrow=pop(frame,246);const future=pop(frame,282);const stamp=pop(frame,315,10);return <Stage from={119} to={351}><div style={{fontFamily:SERIF,fontSize:48,color:INK,fontWeight:950,textAlign:'center'}}>我见过 <span style={{fontSize:82,color:SKY}}>四种</span> 学生</div><div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginTop:28}}>{traits.map((trait,i)=>{const p=pop(frame,188+i*14);return <Card key={trait} style={{height:108,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',opacity:p,transform:`translateY(${(1-p)*22}px) scale(${.84+p*.16})`,borderColor:`${colors[i]}77`}}><div style={{fontFamily:FONT,color:colors[i],fontWeight:900,fontSize:18}}>0{i+1}</div><div style={{fontFamily:FONT,color:INK,fontWeight:800,fontSize:23,marginTop:4}}>{trait}</div></Card>})}</div><div style={{position:'relative',height:230,marginTop:30}}><Card style={{position:'absolute',left:64,top:25,width:270,height:135,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',fontFamily:FONT,color:MUTED,fontSize:25}}>现在成绩<br/><b style={{color:RED,fontSize:34}}>很不好</b></Card><svg width="430" height="170" style={{position:'absolute',left:330,top:4,overflow:'visible'}}><path d="M15 118 C115 118 135 35 325 45" fill="none" stroke={SKY} strokeWidth="6" strokeLinecap="round" strokeDasharray="520" strokeDashoffset={520*(1-arrow)}/><path d="M306 29 L334 45 L306 62" fill="none" stroke={SKY} strokeWidth="6" strokeLinecap="round" opacity={arrow}/></svg><Card style={{position:'absolute',right:65,top:6,width:280,height:170,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',fontFamily:SERIF,color:SKY,fontSize:44,fontWeight:950,borderColor:`${SKY}88`,transform:`scale(${.8+future*.2})`,opacity:future}}>将来必然<br/>成为学霸</Card><div style={{position:'absolute',right:6,top:142,border:`6px solid ${RED}`,color:RED,fontFamily:FONT,fontSize:30,fontWeight:950,letterSpacing:5,padding:'9px 16px',transform:`rotate(-7deg) scale(${.65+stamp*.35})`,opacity:stamp}}>无一例外</div></div></Stage>};

const ChallengeScene:React.FC=()=>{const frame=useCurrentFrame();const p=pop(frame,351,10);const q=pop(frame,421);return <Stage from={351} to={507}><div style={{height:'100%',display:'flex',alignItems:'center',justifyContent:'center',transform:'translateY(-32px)'}}><div style={{position:'absolute',fontFamily:SERIF,fontSize:105,fontWeight:950,color:INK,transform:`rotate(-3deg) scale(${.72+p*.28})`}}>这么绝对？</div><div style={{position:'absolute',top:430,fontFamily:FONT,fontSize:34,fontWeight:850,color:STUDENT,opacity:q,transform:`translateY(${(1-q)*22}px)`}}>快讲，我看看我是哪种！</div><div style={{position:'absolute',right:100,top:85,fontFamily:SERIF,fontWeight:950,color:RED,fontSize:170,opacity:.12}}>？</div></div></Stage>};

const TwoPlusScene:React.FC=()=>{const frame=useCurrentFrame();const hit1=pop(frame,566);const hit2=pop(frame,590);const score=pop(frame,636,10);return <Stage from={507} to={697}><div style={{textAlign:'center',paddingTop:35}}><div style={{fontFamily:FONT,fontSize:25,color:MUTED,letterSpacing:6}}>但凡命中</div><div style={{display:'flex',justifyContent:'center',gap:24,marginTop:28}}>{['目标','复盘','主动','网络'].map((x,i)=>{const lit=i===0?hit1:i===1?hit2:0;return <div key={x} style={{width:126,height:126,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT,fontSize:25,fontWeight:900,color:lit?'#07111f':MUTED,background:lit?(i?STUDENT:SKY):'#0b1929',border:`3px solid ${lit?(i?STUDENT:SKY):'#42536a'}`,transform:`scale(${.88+lit*.12})`,boxShadow:lit?`0 0 30px ${(i?STUDENT:SKY)}44`:'none'}}>{x}</div>})}</div><div style={{fontFamily:SERIF,color:INK,fontSize:52,fontWeight:950,marginTop:23}}>两个以上</div><div style={{display:'flex',alignItems:'baseline',justifyContent:'center',gap:22,marginTop:8,opacity:score,transform:`scale(${.74+score*.26})`}}><span style={{fontFamily:FONT,color:MUTED,fontSize:27}}>目标院校</span><span style={{fontFamily:SERIF,color:STUDENT,fontSize:124,fontWeight:950,lineHeight:.9,textShadow:`0 0 36px ${STUDENT}44`}}>211</span><span style={{fontFamily:FONT,color:INK,fontSize:39,fontWeight:950}}>起步</span></div></div></Stage>};

const GoScene:React.FC=()=>{const frame=useCurrentFrame();const p=pop(frame,697,10);return <Stage from={697} to={784}><div style={{height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',transform:'translateY(-35px)'}}><div style={{fontFamily:SERIF,fontWeight:950,color:STUDENT,fontSize:110,transform:`scale(${.68+p*.32})`,textShadow:`0 0 35px ${STUDENT}33`}}>行，快说吧！</div><div style={{width:420,height:5,borderRadius:5,background:STUDENT,marginTop:18,transform:`scaleX(${p})`}}/></div></Stage>};

const TargetScene:React.FC=()=>{const frame=useCurrentFrame();const title=pop(frame,784);const path=pop(frame,850);const label=pop(frame,937);return <Stage from={784} to={988}><div style={{display:'flex',alignItems:'center',gap:24,marginTop:16,opacity:title,transform:`translateX(${(1-title)*60}px)`}}><div style={{fontFamily:SERIF,color:BLUE,fontSize:130,lineHeight:1,fontWeight:950}}>01</div><div><div style={{fontFamily:FONT,color:MUTED,fontSize:20,letterSpacing:5}}>第一种思维</div><div style={{fontFamily:SERIF,color:INK,fontSize:66,fontWeight:950}}>目标拆解</div></div></div><div style={{height:4,borderRadius:6,background:`linear-gradient(90deg,${BLUE},${SKY},transparent)`,transform:`scaleX(${title})`,transformOrigin:'left'}}/><div style={{display:'grid',gridTemplateColumns:'.85fr 1.3fr',gap:24,marginTop:32}}><Card style={{height:290,padding:30,boxSizing:'border-box'}}><div style={{fontFamily:FONT,color:MUTED,fontSize:20}}>这种学生最精明</div><div style={{fontFamily:SERIF,fontSize:49,color:STUDENT,fontWeight:950,marginTop:22,opacity:label,transform:`translateY(${(1-label)*18}px)`}}>极端现实派</div><div style={{fontFamily:FONT,fontSize:23,lineHeight:1.7,color:INK,marginTop:22}}>目标可以很野<br/>路径必须现实</div></Card><Card style={{height:290,padding:25,boxSizing:'border-box'}}><div style={{fontFamily:FONT,color:MUTED,fontSize:19}}>从结果，一路反推到今天</div><svg width="570" height="205" viewBox="0 0 570 205"><path d="M30 165 C130 160 150 105 270 105 S410 42 535 45" fill="none" stroke={SKY} strokeWidth="6" strokeLinecap="round" strokeDasharray="720" strokeDashoffset={720*(1-path)}/><circle cx="30" cy="165" r="11" fill={STUDENT} opacity={path}/><circle cx="270" cy="105" r="11" fill={BLUE} opacity={path}/><circle cx="535" cy="45" r="13" fill={SKY} opacity={path}/><text x="10" y="200" fill={MUTED} fontSize="19">今天</text><text x="225" y="142" fill={MUTED} fontSize="19">阶段目标</text><text x="477" y="82" fill={INK} fontSize="19">目标院校</text></svg></Card></div></Stage>};

const ScoreIntroScene:React.FC=()=>{const frame=useCurrentFrame();const p=pop(frame,1054);return <Stage from={988} to={1157}><div style={{textAlign:'center',paddingTop:40}}><div style={{fontFamily:FONT,color:MUTED,fontSize:24,letterSpacing:4}}>我也会拆目标</div><div style={{fontFamily:SERIF,color:INK,fontWeight:950,fontSize:66,marginTop:20}}>把 <span style={{display:'inline-block',color:STUDENT,fontSize:114,transform:`scale(${.72+p*.28})`,textShadow:`0 0 34px ${STUDENT}33`}}>600分</span></div><div style={{fontFamily:SERIF,color:INK,fontWeight:900,fontSize:52,marginTop:2}}>拆成每科要考多少</div><div style={{display:'flex',justifyContent:'center',gap:17,marginTop:46}}>{['语文','数学','英语','物理','化学','生物'].map((x,i)=>{const px=pop(frame,1064+i*10);return <Card key={x} style={{width:132,height:100,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:FONT,opacity:px,transform:`translateY(${(1-px)*18}px)`}}><b style={{fontSize:23,color:INK}}>{x}</b><span style={{fontSize:20,color:MUTED,marginTop:4}}>目标分</span></Card>})}</div></div></Stage>};

const PromptScene:React.FC=()=>{const frame=useCurrentFrame();const p=pop(frame,1157,10);return <Stage from={1157} to={1227}><div style={{height:'100%',display:'flex',alignItems:'center',justifyContent:'center',transform:'translateY(-30px)'}}><div style={{fontFamily:SERIF,color:BLUE,fontSize:88,fontWeight:950,transform:`scale(${.7+p*.3})`,textShadow:`0 0 34px ${BLUE}33`}}>哦？那你说说看。</div></div></Stage>};

const ScoreListScene:React.FC=()=>{const frame=useCurrentFrame();const data=[{name:'语文',score:'120',at:1227},{name:'数学',score:'130',at:1247},{name:'英语',score:'130',at:1267},{name:'剩下三科',score:'……',at:1298}];return <Stage from={1227} to={1350}><div style={{textAlign:'center',paddingTop:40}}><div style={{fontFamily:SERIF,color:INK,fontSize:56,fontWeight:950}}>600分计划表</div><div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:18,marginTop:55}}>{data.map((x,i)=>{const p=pop(frame,x.at);return <Card key={x.name} style={{height:180,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',opacity:p,transform:`translateY(${(1-p)*30}px) scale(${.86+p*.14})`,borderColor:i<3?'#4f8bb4':'#a87835'}}><div style={{fontFamily:FONT,color:MUTED,fontSize:22}}>{x.name}</div><div style={{fontFamily:SERIF,color:i<3?BLUE:STUDENT,fontWeight:950,fontSize:i<3?68:54,marginTop:10}}>{x.score}</div></Card>})}</div></div></Stage>};

const HighlightedText:React.FC<{line:Line}>=({line})=>{const terms=[...line.emphasis].sort((a,b)=>b.length-a.length);const pattern=new RegExp(`(${terms.map((term)=>term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})`);return <>{line.text.split(pattern).map((part,i)=>terms.includes(part)?<span key={i} style={{color:line.speaker==='student'?STUDENT:BLUE,fontWeight:950}}>{part}</span>:part)}</>};

const Caption:React.FC=()=>{const frame=useCurrentFrame();const line=lines.find((item)=>frame>=item.start&&frame<item.end);if(!line)return null;const enter=pop(frame,line.start,17);const color=line.speaker==='student'?STUDENT:BLUE;return <div style={{position:'absolute',left:390,right:390,bottom:30,minHeight:158,background:'linear-gradient(180deg,rgba(10,23,37,.96),rgba(4,11,19,.98))',border:`2px solid ${color}66`,borderRadius:26,boxShadow:'0 18px 52px rgba(0,0,0,.48)',padding:'17px 34px 21px',boxSizing:'border-box',zIndex:30,opacity:enter,transform:`translateY(${(1-enter)*18}px)`}}><div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,color,fontFamily:FONT,fontSize:18,fontWeight:900,letterSpacing:4}}><span style={{width:8,height:8,borderRadius:'50%',background:color,boxShadow:`0 0 12px ${color}`}}/>{line.speaker==='student'?'学生':'学霸'}</div><div style={{fontFamily:FONT,color:INK,fontSize:line.text.length>42?33:38,fontWeight:760,lineHeight:1.42,textAlign:'center',marginTop:5}}><HighlightedText line={line}/></div></div>};

const sfx=[
  {at:62,file:'piano-low.wav',volume:.22},
  {at:188,file:'marimba-f.wav',volume:.17},{at:202,file:'marimba-ab.wav',volume:.16},{at:216,file:'marimba-c.wav',volume:.16},{at:230,file:'marimba-eb.wav',volume:.16},
  {at:246,file:'harp-rise.wav',volume:.18},{at:282,file:'bell.wav',volume:.13},{at:315,file:'impact.wav',volume:.20},
  {at:351,file:'pizzicato.wav',volume:.22},{at:421,file:'woodblock.wav',volume:.13},{at:566,file:'woodblock.wav',volume:.17},{at:590,file:'woodblock.wav',volume:.17},{at:636,file:'bell.wav',volume:.18},
  {at:697,file:'pizzicato.wav',volume:.22},{at:784,file:'impact.wav',volume:.21},{at:850,file:'harp-rise.wav',volume:.17},{at:937,file:'marimba-ab.wav',volume:.17},
  ...[1054,1064,1074,1084,1094,1104].map((at)=>({at,file:'soft-click.wav',volume:.11})),
  {at:1157,file:'pizzicato.wav',volume:.20},...[1227,1247,1267,1298].map((at,i)=>({at,file:i===3?'pizzicato.wav':'soft-click.wav',volume:i===3?.18:.13})),
];

const AudioMix:React.FC=()=>{const frame=useCurrentFrame();const talking=lines.some((line)=>frame>=line.start&&frame<line.end);return <><Audio src={staticFile('top-student/source/music.mp3')} volume={talking?.065:.10}/><Audio src={staticFile('top-student/source/full-dialogue-sync.wav')} volume={.70}/>{sfx.map((x,i)=><Sequence key={`${x.at}-${i}`} from={x.at}><Audio src={staticFile(`top-student/sfx/${x.file}`)} volume={x.volume}/></Sequence>)}</>};

export const TopStudentSample:React.FC=()=>{const frame=useCurrentFrame();const active=lines.find((line)=>frame>=line.start&&frame<line.end)?.speaker??null;return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 32%,#15304c 0%,#081522 48%,#040a12 100%)',overflow:'hidden'}}><AudioMix/><div style={{position:'absolute',inset:0,opacity:.16,backgroundImage:'linear-gradient(#6b89a522 1px,transparent 1px),linear-gradient(90deg,#6b89a522 1px,transparent 1px)',backgroundSize:'54px 54px'}}/><div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,#02060ddd 0%,transparent 25%,transparent 75%,#02060ddd 100%)'}}/><CharacterLayer active={active}/><Header/><HookScene/><FourTraitsScene/><ChallengeScene/><TwoPlusScene/><GoScene/><TargetScene/><ScoreIntroScene/><PromptScene/><ScoreListScene/><Caption/></AbsoluteFill>};
