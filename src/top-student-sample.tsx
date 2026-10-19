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
const INK = '#12253b';
const BLUE = '#07548d';
const SKY = '#2f8fca';
const STUDENT = '#e59a27';
const RED = '#e34d50';
const GREEN = '#31936f';
const PAPER = '#fffefa';
const MUTED = '#697a89';
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
  <div style={{background:'rgba(255,255,252,.94)',border:'2px solid #c9d8e2',borderRadius:24,boxShadow:'0 13px 34px rgba(28,60,82,.10)',...style}}>{children}</div>
);

const Header: React.FC = () => {
  const frame = useCurrentFrame();
  return <div style={{position:'absolute',left:58,right:58,top:30,height:58,display:'flex',alignItems:'center',justifyContent:'space-between',fontFamily:FONT,zIndex:20}}>
    <div style={{display:'flex',alignItems:'center',gap:14}}><div style={{width:9,height:38,borderRadius:8,background:BLUE}}/><div style={{fontWeight:900,fontSize:26,color:INK,letterSpacing:2}}>四种顶级学霸思维</div><div style={{fontSize:19,color:BLUE,background:'#e6f2f9',borderRadius:20,padding:'6px 15px',fontWeight:700}}>命中越多 · 涨分越快</div></div>
    <div style={{display:'flex',gap:8}}>{[0,1,2,3].map((i)=><div key={i} style={{width:42,height:5,borderRadius:8,background:frame>=772+i*500?BLUE:'#d7e1e7'}}/>)}</div>
  </div>;
};

const SpeakerTag: React.FC<{side:'left'|'right';label:string;active:boolean;color:string}> = ({side,label,active,color}) => {
  const frame=useCurrentFrame();
  return <div style={{position:'absolute',[side]:side==='left'?82:100,top:675,padding:'9px 19px',borderRadius:23,color:active?'#fff':MUTED,background:active?color:'rgba(255,255,255,.88)',border:`2px solid ${active?color:'#d7dfe4'}`,fontFamily:FONT,fontWeight:900,fontSize:22,boxShadow:active?`0 8px 20px ${color}44`:'none',transform:`scale(${active?1+Math.sin(frame/7)*.025:.94})`,zIndex:14}}>{active&&<span style={{display:'inline-block',width:7,height:7,borderRadius:'50%',background:'#fff',marginRight:9,verticalAlign:3}}/>}{label}</div>;
};

const CharacterLayer: React.FC<{active:Speaker|null}> = ({active}) => {
  const frame=useCurrentFrame();
  const target=active==='student'?10:active==='teacher'?-10:0;
  const beat=[...beatFrames].reverse().find((b)=>b<=frame)??0;
  const pulse=interpolate(frame-beat,[0,7,20],[1,.25,0],clamp);
  return <>
    <Img src={staticFile('top-student/characters-dialogue.png')} style={{position:'absolute',inset:-18,width:'calc(100% + 36px)',height:'calc(100% + 36px)',objectFit:'cover',transform:`translateX(${target}px) scale(1.01)`,transformOrigin:'50% 72%'}}/>
    <div style={{position:'absolute',left:34,bottom:44,width:390,height:455,borderRadius:'50%',opacity:active==='student'?.30+pulse*.12:0,background:'radial-gradient(circle,rgba(229,154,39,.40),transparent 70%)'}}/>
    <div style={{position:'absolute',right:80,bottom:55,width:560,height:560,borderRadius:'50%',opacity:active==='teacher'?.25+pulse*.10:0,background:'radial-gradient(circle,rgba(7,84,141,.32),transparent 70%)'}}/>
    <SpeakerTag side="left" label="学生" active={active==='student'} color={STUDENT}/><SpeakerTag side="right" label="学霸" active={active==='teacher'} color={BLUE}/>
  </>;
};

const HookScene:React.FC=()=>{const frame=useCurrentFrame();const p=pop(frame,46);return <Stage from={0} to={112}><div style={{height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',transform:'translateY(-25px)'}}><div style={{fontFamily:FONT,fontSize:23,color:MUTED,letterSpacing:8}}>你能预知吗？</div><div style={{fontFamily:SERIF,color:INK,fontWeight:950,fontSize:68,lineHeight:1.25,textAlign:'center',marginTop:18}}>谁最有潜力<br/><span style={{color:BLUE,fontSize:88,display:'inline-block',transform:`scale(${.72+p*.28})`}}>成为顶级学霸</span></div><div style={{width:660,height:6,borderRadius:7,background:`linear-gradient(90deg,transparent,${STUDENT},${BLUE},transparent)`,marginTop:28,transform:`scaleX(${p})`}}/></div></Stage>};

const FourTraitsScene:React.FC=()=>{const frame=useCurrentFrame();const traits=['目标拆解','失败复盘','主动攻击','知识网络'];const colors=[BLUE,'#8161bd',STUDENT,GREEN];const arrow=pop(frame,244);const stamp=pop(frame,310,10);return <Stage from={112} to={377}><div style={{fontFamily:SERIF,fontSize:48,color:INK,fontWeight:950,textAlign:'center'}}>我见过 <span style={{fontSize:82,color:BLUE}}>四种</span> 学生</div><div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginTop:28}}>{traits.map((trait,i)=>{const p=pop(frame,178+i*16);return <Card key={trait} style={{height:108,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',opacity:p,transform:`translateY(${(1-p)*22}px) scale(${.84+p*.16})`,borderColor:`${colors[i]}77`}}><div style={{fontFamily:FONT,color:colors[i],fontWeight:900,fontSize:18}}>0{i+1}</div><div style={{fontFamily:FONT,color:INK,fontWeight:800,fontSize:23,marginTop:4}}>{trait}</div></Card>})}</div><div style={{position:'relative',height:230,marginTop:30}}><Card style={{position:'absolute',left:64,top:25,width:270,height:135,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',fontFamily:FONT,color:MUTED,fontSize:25}}>现在成绩<br/><b style={{color:RED,fontSize:34}}>很不好</b></Card><svg width="430" height="170" style={{position:'absolute',left:330,top:4,overflow:'visible'}}><path d="M15 118 C115 118 135 35 325 45" fill="none" stroke={BLUE} strokeWidth="6" strokeLinecap="round" strokeDasharray="520" strokeDashoffset={520*(1-arrow)}/><path d="M306 29 L334 45 L306 62" fill="none" stroke={BLUE} strokeWidth="6" strokeLinecap="round" opacity={arrow}/></svg><Card style={{position:'absolute',right:65,top:6,width:280,height:170,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',fontFamily:SERIF,color:BLUE,fontSize:44,fontWeight:950,borderColor:`${BLUE}88`,transform:`scale(${.8+stamp*.2})`}}>将来必然<br/>成为学霸</Card><div style={{position:'absolute',right:6,top:142,border:`6px solid ${RED}`,color:RED,fontFamily:FONT,fontSize:30,fontWeight:950,letterSpacing:5,padding:'9px 16px',transform:`rotate(-7deg) scale(${.65+stamp*.35})`,opacity:stamp}}>无一例外</div></div></Stage>};

const ChallengeScene:React.FC=()=>{const frame=useCurrentFrame();const p=pop(frame,377,10);const q=pop(frame,442);return <Stage from={377} to={509}><div style={{height:'100%',display:'flex',alignItems:'center',justifyContent:'center',transform:'translateY(-32px)'}}><div style={{position:'absolute',fontFamily:SERIF,fontSize:105,fontWeight:950,color:INK,transform:`rotate(-3deg) scale(${.72+p*.28})`}}>这么绝对？</div><div style={{position:'absolute',top:430,fontFamily:FONT,fontSize:34,fontWeight:850,color:STUDENT,opacity:q,transform:`translateY(${(1-q)*22}px)`}}>快讲，我看看我是哪种！</div><div style={{position:'absolute',right:100,top:85,fontFamily:SERIF,fontWeight:950,color:RED,fontSize:170,opacity:.12}}>？</div></div></Stage>};

const TwoPlusScene:React.FC=()=>{const frame=useCurrentFrame();const hit1=pop(frame,509);const hit2=pop(frame,574);const score=pop(frame,640,10);return <Stage from={509} to={706}><div style={{textAlign:'center',paddingTop:35}}><div style={{fontFamily:FONT,fontSize:25,color:MUTED,letterSpacing:6}}>但凡命中</div><div style={{display:'flex',justifyContent:'center',gap:24,marginTop:28}}>{['目标','复盘','主动','网络'].map((x,i)=>{const lit=i===0?hit1:i===1?hit2:0;return <div key={x} style={{width:126,height:126,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT,fontSize:25,fontWeight:900,color:lit?'#fff':MUTED,background:lit?(i?STUDENT:BLUE):'#f3f6f8',border:`3px solid ${lit?(i?STUDENT:BLUE):'#cbd7de'}`,transform:`scale(${.88+lit*.12})`,boxShadow:lit?`0 10px 28px ${(i?STUDENT:BLUE)}44`:'none'}}>{x}</div>})}</div><div style={{fontFamily:SERIF,color:INK,fontSize:52,fontWeight:950,marginTop:23}}>两个以上</div><div style={{display:'flex',alignItems:'baseline',justifyContent:'center',gap:22,marginTop:8,opacity:score,transform:`scale(${.74+score*.26})`}}><span style={{fontFamily:FONT,color:MUTED,fontSize:27}}>目标院校</span><span style={{fontFamily:SERIF,color:BLUE,fontSize:124,fontWeight:950,lineHeight:.9}}>211</span><span style={{fontFamily:FONT,color:INK,fontSize:39,fontWeight:950}}>起步</span></div></div></Stage>};

const GoScene:React.FC=()=>{const frame=useCurrentFrame();const p=pop(frame,706,10);return <Stage from={706} to={772}><div style={{height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',transform:'translateY(-35px)'}}><div style={{fontFamily:SERIF,fontWeight:950,color:STUDENT,fontSize:110,transform:`scale(${.68+p*.32})`}}>行，快说吧！</div><div style={{width:420,height:5,borderRadius:5,background:STUDENT,marginTop:18,transform:`scaleX(${p})`}}/></div></Stage>};

const TargetScene:React.FC=()=>{const frame=useCurrentFrame();const title=pop(frame,772);const label=pop(frame,838);const path=pop(frame,904);return <Stage from={772} to={988}><div style={{display:'flex',alignItems:'center',gap:24,marginTop:16,opacity:title,transform:`translateX(${(1-title)*60}px)`}}><div style={{fontFamily:SERIF,color:BLUE,fontSize:130,lineHeight:1,fontWeight:950}}>01</div><div><div style={{fontFamily:FONT,color:MUTED,fontSize:20,letterSpacing:5}}>第一种思维</div><div style={{fontFamily:SERIF,color:INK,fontSize:66,fontWeight:950}}>目标拆解</div></div></div><div style={{height:4,borderRadius:6,background:`linear-gradient(90deg,${BLUE},#7db8d9,transparent)`,transform:`scaleX(${title})`,transformOrigin:'left'}}/><div style={{display:'grid',gridTemplateColumns:'.85fr 1.3fr',gap:24,marginTop:32}}><Card style={{height:290,padding:30,boxSizing:'border-box'}}><div style={{fontFamily:FONT,color:MUTED,fontSize:20}}>这种学生最精明</div><div style={{fontFamily:SERIF,fontSize:49,color:STUDENT,fontWeight:950,marginTop:22,opacity:label,transform:`translateY(${(1-label)*18}px)`}}>极端现实派</div><div style={{fontFamily:FONT,fontSize:23,lineHeight:1.7,color:INK,marginTop:22}}>目标可以很野<br/>路径必须现实</div></Card><Card style={{height:290,padding:25,boxSizing:'border-box'}}><div style={{fontFamily:FONT,color:MUTED,fontSize:19}}>从结果，一路反推到今天</div><svg width="570" height="205" viewBox="0 0 570 205"><path d="M30 165 C130 160 150 105 270 105 S410 42 535 45" fill="none" stroke={BLUE} strokeWidth="6" strokeLinecap="round" strokeDasharray="720" strokeDashoffset={720*(1-path)}/><circle cx="30" cy="165" r="11" fill={STUDENT} opacity={path}/><circle cx="270" cy="105" r="11" fill={SKY} opacity={path}/><circle cx="535" cy="45" r="13" fill={BLUE} opacity={path}/><text x="10" y="200" fill={MUTED} fontSize="19">今天</text><text x="225" y="142" fill={MUTED} fontSize="19">阶段目标</text><text x="477" y="82" fill={INK} fontSize="19">目标院校</text></svg></Card></div></Stage>};

const ScoreIntroScene:React.FC=()=>{const frame=useCurrentFrame();const p=pop(frame,1036);return <Stage from={988} to={1168}><div style={{textAlign:'center',paddingTop:40}}><div style={{fontFamily:FONT,color:MUTED,fontSize:24,letterSpacing:4}}>我也会拆目标</div><div style={{fontFamily:SERIF,color:INK,fontWeight:950,fontSize:66,marginTop:20}}>把 <span style={{display:'inline-block',color:STUDENT,fontSize:114,transform:`scale(${.72+p*.28})`}}>600分</span></div><div style={{fontFamily:SERIF,color:INK,fontWeight:900,fontSize:52,marginTop:2}}>拆成每科要考多少</div><div style={{display:'flex',justifyContent:'center',gap:17,marginTop:46}}>{['语文','数学','英语','物理','化学','生物'].map((x,i)=>{const px=pop(frame,1036+i*10);return <Card key={x} style={{width:132,height:100,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:FONT,opacity:px,transform:`translateY(${(1-px)*18}px)`}}><b style={{fontSize:23,color:INK}}>{x}</b><span style={{fontSize:20,color:MUTED,marginTop:4}}>目标分</span></Card>})}</div></div></Stage>};

const PromptScene:React.FC=()=>{const frame=useCurrentFrame();const p=pop(frame,1168,10);return <Stage from={1168} to={1234}><div style={{height:'100%',display:'flex',alignItems:'center',justifyContent:'center',transform:'translateY(-30px)'}}><div style={{fontFamily:SERIF,color:BLUE,fontSize:88,fontWeight:950,transform:`scale(${.7+p*.3})`}}>哦？那你说说看。</div></div></Stage>};

const ScoreListScene:React.FC=()=>{const frame=useCurrentFrame();const data=[{name:'语文',score:'120'},{name:'数学',score:'130'},{name:'英语',score:'130'},{name:'剩下三科',score:'……'}];return <Stage from={1234} to={1350}><div style={{textAlign:'center',paddingTop:40}}><div style={{fontFamily:SERIF,color:INK,fontSize:56,fontWeight:950}}>600分计划表</div><div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:18,marginTop:55}}>{data.map((x,i)=>{const p=pop(frame,1234+i*18);return <Card key={x.name} style={{height:180,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',opacity:p,transform:`translateY(${(1-p)*30}px) scale(${.86+p*.14})`,borderColor:i<3?'#9abfd5':'#dfbd86'}}><div style={{fontFamily:FONT,color:MUTED,fontSize:22}}>{x.name}</div><div style={{fontFamily:SERIF,color:i<3?BLUE:STUDENT,fontWeight:950,fontSize:i<3?68:54,marginTop:10}}>{x.score}</div></Card>})}</div></div></Stage>};

const HighlightedText:React.FC<{line:Line}>=({line})=>{const terms=[...line.emphasis].sort((a,b)=>b.length-a.length);const pattern=new RegExp(`(${terms.map((term)=>term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})`);return <>{line.text.split(pattern).map((part,i)=>terms.includes(part)?<span key={i} style={{color:line.speaker==='student'?STUDENT:BLUE,fontWeight:950}}>{part}</span>:part)}</>};

const Caption:React.FC=()=>{const frame=useCurrentFrame();const line=lines.find((item)=>frame>=item.start&&frame<item.end);if(!line)return null;const enter=pop(frame,line.start,17);const color=line.speaker==='student'?STUDENT:BLUE;return <div style={{position:'absolute',left:390,right:390,bottom:30,minHeight:158,background:'rgba(255,255,252,.965)',border:`2px solid ${color}66`,borderRadius:26,boxShadow:'0 16px 42px rgba(24,52,70,.18)',padding:'17px 34px 21px',boxSizing:'border-box',zIndex:30,opacity:enter,transform:`translateY(${(1-enter)*18}px)`}}><div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,color,fontFamily:FONT,fontSize:18,fontWeight:900,letterSpacing:4}}><span style={{width:8,height:8,borderRadius:'50%',background:color}}/>{line.speaker==='student'?'学生':'学霸'}</div><div style={{fontFamily:FONT,color:INK,fontSize:line.text.length>42?33:38,fontWeight:760,lineHeight:1.42,textAlign:'center',marginTop:5}}><HighlightedText line={line}/></div></div>};

const sfx=[
  {at:46,file:'piano-low.wav',volume:.22},
  {at:178,file:'marimba-f.wav',volume:.17},{at:194,file:'marimba-ab.wav',volume:.16},{at:210,file:'marimba-c.wav',volume:.16},{at:226,file:'marimba-eb.wav',volume:.16},
  {at:244,file:'harp-rise.wav',volume:.18},{at:310,file:'impact.wav',volume:.20},{at:310,file:'bell.wav',volume:.13},
  {at:377,file:'pizzicato.wav',volume:.22},{at:442,file:'woodblock.wav',volume:.13},{at:509,file:'woodblock.wav',volume:.17},{at:574,file:'woodblock.wav',volume:.17},{at:640,file:'bell.wav',volume:.18},
  {at:706,file:'pizzicato.wav',volume:.22},{at:772,file:'impact.wav',volume:.21},{at:838,file:'marimba-ab.wav',volume:.17},{at:904,file:'harp-rise.wav',volume:.17},
  ...[1036,1046,1056,1066,1076,1086].map((at)=>({at,file:'soft-click.wav',volume:.11})),
  {at:1168,file:'pizzicato.wav',volume:.20},...[1234,1252,1270,1288].map((at,i)=>({at,file:i===3?'pizzicato.wav':'soft-click.wav',volume:i===3?.18:.13})),
];

const AudioMix:React.FC=()=>{const frame=useCurrentFrame();const talking=lines.some((line)=>frame>=line.start&&frame<line.end);return <><Audio src={staticFile('top-student/source/music.mp3')} volume={talking?.065:.10}/><Audio src={staticFile('top-student/source/full-dialogue.mp3')} volume={.70}/>{sfx.map((x,i)=><Sequence key={`${x.at}-${i}`} from={x.at}><Audio src={staticFile(`top-student/sfx/${x.file}`)} volume={x.volume}/></Sequence>)}</>};

export const TopStudentSample:React.FC=()=>{const frame=useCurrentFrame();const active=lines.find((line)=>frame>=line.start&&frame<line.end)?.speaker??null;return <AbsoluteFill style={{background:PAPER,overflow:'hidden'}}><AudioMix/><CharacterLayer active={active}/><div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,rgba(255,255,255,.96) 0%,rgba(255,255,255,.38) 18%,rgba(255,255,255,0) 66%)',pointerEvents:'none'}}/><Header/><HookScene/><FourTraitsScene/><ChallengeScene/><TwoPlusScene/><GoScene/><TargetScene/><ScoreIntroScene/><PromptScene/><ScoreListScene/><Caption/></AbsoluteFill>};
