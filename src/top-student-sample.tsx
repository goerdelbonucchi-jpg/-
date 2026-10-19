import React from 'react';
import captionData from './opening-captions';
import {
  AbsoluteFill,
  Audio,
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

export type Speaker = 'student' | 'teacher';
export type Line = {speaker: Speaker; start: number; end: number; text: string; emphasis: string[]};

// Source SRT text, mapped through matched audio runs and turn silence boundaries.
const lines: Line[] = captionData.map((line) => ({...line, speaker: line.speaker as Speaker}));

const beatFrames = [46,112,178,244,310,377,442,509,574,640,706,772,838,904,970,1036,1102,1168,1234,1300];
const pop = (frame: number, at: number, damping = 14) => spring({frame: frame - at, fps: FPS, config: {damping, mass: 0.65, stiffness: 175}});
const fade = (frame: number, from: number, to: number) => frame >= from && frame < to ? 1 : 0;

const Stage: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const frame = useCurrentFrame();
  return <div style={{position:'absolute',left:420,top:104,width:1080,height:650,opacity:fade(frame,from,to)}}>{children}</div>;
};

const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{background:'rgba(8,24,39,.94)',border:'2px solid #3a5874',borderRadius:24,boxShadow:'0 16px 40px rgba(0,0,0,.28)',...style}}>{children}</div>
);

const Header: React.FC<{chapter?:number}> = ({chapter}) => {
  const frame = useCurrentFrame();
  return <div style={{position:'absolute',left:58,right:58,top:30,height:58,display:'flex',alignItems:'center',justifyContent:'space-between',fontFamily:FONT,zIndex:20}}>
    <div style={{display:'flex',alignItems:'center',gap:14}}><div style={{width:9,height:38,borderRadius:8,background:SKY,boxShadow:`0 0 18px ${SKY}88`}}/><div style={{fontWeight:900,fontSize:26,color:INK,letterSpacing:2}}>四种顶级学霸思维</div><div style={{fontSize:19,color:SKY,background:'#10253a',borderRadius:20,padding:'6px 15px',fontWeight:700,border:'1px solid #2c536d'}}>命中越多 · 涨分越快</div></div>
    <div style={{display:'flex',gap:8}}>{[0,1,2,3].map((i)=><div key={i} style={{width:42,height:5,borderRadius:8,background:(chapter!==undefined?i<chapter:frame>=784+i*500)?BLUE:'#293b4f'}}/>)}</div>
  </div>;
};

const SpeakerTag: React.FC<{side:'left'|'right';label:string;active:boolean;color:string}> = ({side,label,active,color}) => {
  const frame=useCurrentFrame();
  if (!active) return null;
  return <div style={{position:'absolute',[side]:side==='left'?82:100,top:700,padding:'9px 19px',borderRadius:23,color:active?'#07111f':MUTED,background:active?color:'rgba(7,17,31,.88)',border:`2px solid ${active?color:'#385069'}`,fontFamily:FONT,fontWeight:900,fontSize:22,boxShadow:active?`0 0 24px ${color}55`:'none',transform:`scale(${active?1+Math.sin(frame/7)*.025:.94})`,zIndex:14}}>{active&&<span style={{display:'inline-block',width:7,height:7,borderRadius:'50%',background:'#07111f',marginRight:9,verticalAlign:3}}/>}{label}</div>;
};

// CSS masks preserve the supplied cutout alpha while tinting only the linework.
const CharacterLayer: React.FC<{active:Speaker|null}> = ({active}) => {
  const frame=useCurrentFrame();
  return <>
    {(['student','teacher'] as const).map((speaker)=>{
      const student=speaker==='student';
      const speaking=active===speaker;
      const color=student?STUDENT:'#ffffff';
      const opacity=speaking?1:.12;
      const mask=`url("${staticFile(`top-student/${speaker}-cutout.png`)}")`;
      return <div key={speaker} style={{position:'absolute',left:student?42:undefined,right:student?undefined:26,bottom:student?45:34,width:student?410:690,height:student?658:832,opacity,transform:`translateY(${Math.sin(frame/18)*3}px) scale(${speaking?1.02:.98})`,transformOrigin:'50% 90%',filter:speaking?(!student?'drop-shadow(0 0 5px #ffffff22)':`drop-shadow(0 0 15px ${color}66)`):'none'}}>
        <div style={{position:'absolute',inset:0,background:color,maskImage:mask,WebkitMaskImage:mask,maskSize:'contain',WebkitMaskSize:'contain',maskRepeat:'no-repeat',WebkitMaskRepeat:'no-repeat',maskPosition:'center bottom',WebkitMaskPosition:'center bottom'}}/>
      </div>;
    })}
    <SpeakerTag side="left" label="学生" active={active==='student'} color={STUDENT}/>
    <SpeakerTag side="right" label="学霸" active={active==='teacher'} color="#ffffff"/>
  </>;
};

const HookScene:React.FC=()=>{
  const frame=useCurrentFrame();
  const question=pop(frame,6,18);
  const heading=pop(frame,20,17);
  const keyword=pop(frame,62,14);
  const sweep=interpolate(frame,[62,85],[-30,130],clamp);
  return <Stage from={0} to={119}>
    <div style={{height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',transform:'translateY(-25px)'}}>
      <div style={{fontFamily:FONT,fontSize:23,color:MUTED,letterSpacing:8,opacity:question,transform:`translateY(${(1-question)*15}px)`}}>你能预知吗？</div>
      <div style={{fontFamily:SERIF,color:INK,fontWeight:950,fontSize:68,lineHeight:1.25,textAlign:'center',marginTop:18}}>
        <div style={{opacity:heading,transform:`translateY(${(1-heading)*30}px) scale(${.94+heading*.06})`,filter:`blur(${Math.max(0,1-heading)*5}px)`}}>谁最有潜力</div>
        <div style={{position:'relative',color:SKY,fontSize:88,marginTop:10,opacity:keyword,transform:`translateY(${(1-keyword)*22}px) scale(${.86+keyword*.14})`,textShadow:`0 0 ${18+keyword*16}px ${SKY}44`,overflow:'hidden'}}>
          成为顶级学霸
          <span aria-hidden style={{position:'absolute',inset:0,color:'#fff',maskImage:`linear-gradient(90deg,transparent ${sweep-12}%,#000 ${sweep}%,transparent ${sweep+12}%)`,WebkitMaskImage:`linear-gradient(90deg,transparent ${sweep-12}%,#000 ${sweep}%,transparent ${sweep+12}%)`,opacity:frame>=62&&frame<86?.55:0,pointerEvents:'none'}}>成为顶级学霸</span>
        </div>
      </div>
      <div style={{width:660,height:6,borderRadius:7,background:`linear-gradient(90deg,transparent,${STUDENT},${SKY},transparent)`,marginTop:28,transform:`scaleX(${keyword})`,boxShadow:`0 0 20px ${SKY}44`}}/>
    </div>
  </Stage>;
};

const FourTraitsScene:React.FC=()=>{const frame=useCurrentFrame();const traits=['目标拆解','失败复盘','主动攻击','知识网络'];const colors=[BLUE,'#c897ff',STUDENT,GREEN];const arrow=pop(frame,246);const future=pop(frame,282);const stamp=pop(frame,315,10);return <Stage from={119} to={351}><div style={{fontFamily:SERIF,fontSize:48,color:INK,fontWeight:950,textAlign:'center'}}>我见过 <span style={{fontSize:82,color:SKY}}>四种</span> 学生</div><div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginTop:28}}>{traits.map((trait,i)=>{const p=pop(frame,188+i*14);return <Card key={trait} style={{height:108,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',opacity:p,transform:`translateY(${(1-p)*22}px) scale(${.84+p*.16})`,borderColor:`${colors[i]}77`}}><div style={{fontFamily:FONT,color:colors[i],fontWeight:900,fontSize:18}}>0{i+1}</div><div style={{fontFamily:FONT,color:INK,fontWeight:800,fontSize:23,marginTop:4}}>{trait}</div></Card>})}</div><div style={{position:'relative',height:230,marginTop:30}}><Card style={{position:'absolute',left:64,top:25,width:270,height:135,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',fontFamily:FONT,color:MUTED,fontSize:25}}>现在成绩<br/><b style={{color:RED,fontSize:34}}>很不好</b></Card><svg width="430" height="170" style={{position:'absolute',left:330,top:4,overflow:'visible'}}><path d="M15 118 C115 118 135 35 325 45" fill="none" stroke={SKY} strokeWidth="6" strokeLinecap="round" strokeDasharray="520" strokeDashoffset={520*(1-arrow)}/><path d="M306 29 L334 45 L306 62" fill="none" stroke={SKY} strokeWidth="6" strokeLinecap="round" opacity={arrow}/></svg><Card style={{position:'absolute',right:65,top:6,width:280,height:170,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',fontFamily:SERIF,color:SKY,fontSize:44,fontWeight:950,borderColor:`${SKY}88`,transform:`scale(${.8+future*.2})`,opacity:future}}>将来必然<br/>成为学霸</Card><div style={{position:'absolute',right:6,top:142,border:`6px solid ${RED}`,color:RED,fontFamily:FONT,fontSize:30,fontWeight:950,letterSpacing:5,padding:'9px 16px',transform:`rotate(-7deg) scale(${.65+stamp*.35})`,opacity:stamp}}>无一例外</div></div></Stage>};

const ChallengeScene:React.FC=()=>{const frame=useCurrentFrame();const p=pop(frame,351,10);const q=pop(frame,377);return <Stage from={351} to={421}><div style={{height:'100%',display:'flex',alignItems:'center',justifyContent:'center',transform:'translateY(-32px)'}}><div style={{position:'absolute',fontFamily:SERIF,fontSize:105,fontWeight:950,color:INK,transform:`rotate(-3deg) scale(${.72+p*.28})`}}>这么绝对？</div><div style={{position:'absolute',top:430,fontFamily:FONT,fontSize:34,fontWeight:850,color:STUDENT,opacity:q,transform:`translateY(${(1-q)*22}px)`}}>快讲，我看看我是哪种！</div><div style={{position:'absolute',right:100,top:85,fontFamily:SERIF,fontWeight:950,color:RED,fontSize:170,opacity:.12}}>？</div></div></Stage>};

const TwoPlusScene:React.FC=()=>{const frame=useCurrentFrame();const hit1=pop(frame,440);const hit2=pop(frame,449);const score=pop(frame,472,10);return <Stage from={421} to={507}><div style={{textAlign:'center',paddingTop:35}}><div style={{fontFamily:FONT,fontSize:25,color:MUTED,letterSpacing:6}}>但凡命中</div><div style={{display:'flex',justifyContent:'center',gap:24,marginTop:28}}>{['目标','复盘','主动','网络'].map((x,i)=>{const lit=i===0?hit1:i===1?hit2:0;return <div key={x} style={{width:126,height:126,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT,fontSize:25,fontWeight:900,color:lit?'#07111f':MUTED,background:lit?(i?STUDENT:SKY):'#0b1929',border:`3px solid ${lit?(i?STUDENT:SKY):'#42536a'}`,transform:`scale(${.88+lit*.12})`,boxShadow:lit?`0 0 30px ${(i?STUDENT:SKY)}44`:'none'}}>{x}</div>})}</div><div style={{fontFamily:SERIF,color:INK,fontSize:52,fontWeight:950,marginTop:23}}>两个以上</div><div style={{display:'flex',alignItems:'baseline',justifyContent:'center',gap:22,marginTop:8,opacity:score,transform:`scale(${.74+score*.26})`}}><span style={{fontFamily:FONT,color:MUTED,fontSize:27}}>目标院校</span><span style={{fontFamily:SERIF,color:STUDENT,fontSize:124,fontWeight:950,lineHeight:.9,textShadow:`0 0 36px ${STUDENT}44`}}>211</span><span style={{fontFamily:FONT,color:INK,fontSize:39,fontWeight:950}}>起步</span></div></div></Stage>};

const GoScene:React.FC=()=>{const frame=useCurrentFrame();const p=pop(frame,507,10);return <Stage from={507} to={544}><div style={{height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',transform:'translateY(-35px)'}}><div style={{fontFamily:SERIF,fontWeight:950,color:STUDENT,fontSize:110,transform:`scale(${.68+p*.32})`,textShadow:`0 0 35px ${STUDENT}33`}}>行，快说吧！</div><div style={{width:420,height:5,borderRadius:5,background:STUDENT,marginTop:18,transform:`scaleX(${p})`}}/></div></Stage>};

const TargetScene:React.FC=()=>{const frame=useCurrentFrame();const title=pop(frame,544);const path=pop(frame,566);const label=pop(frame,641);return <Stage from={544} to={697}><div style={{display:'flex',alignItems:'center',gap:24,marginTop:16,opacity:title,transform:`translateX(${(1-title)*60}px)`}}><div style={{fontFamily:SERIF,color:BLUE,fontSize:130,lineHeight:1,fontWeight:950}}>01</div><div><div style={{fontFamily:FONT,color:MUTED,fontSize:20,letterSpacing:5}}>第一种思维</div><div style={{fontFamily:SERIF,color:INK,fontSize:66,fontWeight:950}}>目标拆解</div></div></div><div style={{height:4,borderRadius:6,background:`linear-gradient(90deg,${BLUE},${SKY},transparent)`,transform:`scaleX(${title})`,transformOrigin:'left'}}/><div style={{display:'grid',gridTemplateColumns:'.85fr 1.3fr',gap:24,marginTop:32}}><Card style={{height:290,padding:30,boxSizing:'border-box'}}><div style={{fontFamily:FONT,color:MUTED,fontSize:20}}>这种学生最精明</div><div style={{fontFamily:SERIF,fontSize:49,color:STUDENT,fontWeight:950,marginTop:22,opacity:label,transform:`translateY(${(1-label)*18}px)`}}>极端现实派</div><div style={{fontFamily:FONT,fontSize:23,lineHeight:1.7,color:INK,marginTop:22}}>目标可以很野<br/>路径必须现实</div></Card><Card style={{height:290,padding:25,boxSizing:'border-box'}}><div style={{fontFamily:FONT,color:MUTED,fontSize:19}}>从结果，一路反推到今天</div><svg width="570" height="205" viewBox="0 0 570 205"><path d="M30 165 C130 160 150 105 270 105 S410 42 535 45" fill="none" stroke={SKY} strokeWidth="6" strokeLinecap="round" strokeDasharray="720" strokeDashoffset={720*(1-path)}/><circle cx="30" cy="165" r="11" fill={STUDENT} opacity={path}/><circle cx="270" cy="105" r="11" fill={BLUE} opacity={path}/><circle cx="535" cy="45" r="13" fill={SKY} opacity={path}/><text x="10" y="200" fill={MUTED} fontSize="19">今天</text><text x="225" y="142" fill={MUTED} fontSize="19">阶段目标</text><text x="477" y="82" fill={INK} fontSize="19">目标院校</text></svg></Card></div></Stage>};

const ScoreIntroScene:React.FC=()=>{const frame=useCurrentFrame();const p=pop(frame,726);return <Stage from={697} to={784}><div style={{textAlign:'center',paddingTop:40}}><div style={{fontFamily:FONT,color:MUTED,fontSize:24,letterSpacing:4}}>我也会拆目标</div><div style={{fontFamily:SERIF,color:INK,fontWeight:950,fontSize:66,marginTop:20}}>把 <span style={{display:'inline-block',color:STUDENT,fontSize:114,transform:`scale(${.72+p*.28})`,textShadow:`0 0 34px ${STUDENT}33`}}>600分</span></div><div style={{fontFamily:SERIF,color:INK,fontWeight:900,fontSize:52,marginTop:2}}>拆成每科要考多少</div><div style={{display:'flex',justifyContent:'center',gap:17,marginTop:46}}>{['语文','数学','英语','物理','化学','生物'].map((x,i)=>{const px=pop(frame,736+i*10);return <Card key={x} style={{width:132,height:100,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:FONT,opacity:px,transform:`translateY(${(1-px)*18}px)`}}><b style={{fontSize:23,color:INK}}>{x}</b><span style={{fontSize:20,color:MUTED,marginTop:4}}>目标分</span></Card>})}</div></div></Stage>};

const PromptScene:React.FC=()=>{const frame=useCurrentFrame();const p=pop(frame,784,10);return <Stage from={784} to={836}><div style={{height:'100%',display:'flex',alignItems:'center',justifyContent:'center',transform:'translateY(-30px)'}}><div style={{fontFamily:SERIF,color:BLUE,fontSize:88,fontWeight:950,transform:`scale(${.7+p*.3})`,textShadow:`0 0 34px ${BLUE}33`}}>哦？那你说说看。</div></div></Stage>};

const ScoreListScene:React.FC=()=>{const frame=useCurrentFrame();const data=[{name:'语文',score:'120',at:836},{name:'数学',score:'130',at:872},{name:'英语',score:'130',at:908},{name:'剩下三科',score:'……',at:944}];return <Stage from={836} to={988}><div style={{textAlign:'center',paddingTop:40}}><div style={{fontFamily:SERIF,color:INK,fontSize:56,fontWeight:950}}>600分计划表</div><div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:18,marginTop:55}}>{data.map((x,i)=>{const p=pop(frame,x.at);return <Card key={x.name} style={{height:180,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',opacity:p,transform:`translateY(${(1-p)*30}px) scale(${.86+p*.14})`,borderColor:i<3?'#4f8bb4':'#a87835'}}><div style={{fontFamily:FONT,color:MUTED,fontSize:22}}>{x.name}</div><div style={{fontFamily:SERIF,color:i<3?BLUE:STUDENT,fontWeight:950,fontSize:i<3?68:54,marginTop:10}}>{x.score}</div></Card>})}</div></div></Stage>};

const HighlightedText:React.FC<{line:Line}>=({line})=>{const terms=[...line.emphasis].sort((a,b)=>b.length-a.length);const pattern=new RegExp(`(${terms.map((term)=>term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})`);return <>{line.text.split(pattern).map((part,i)=>terms.includes(part)?<span key={i} style={{color:line.speaker==='student'?STUDENT:BLUE,fontWeight:950}}>{part}</span>:part)}</>};

const Caption:React.FC<{captions?:Line[]}>=({captions=lines})=>{const frame=useCurrentFrame();const line=captions.find((item)=>frame>=item.start&&frame<item.end);if(!line)return null;const enter=1;const color=line.speaker==='student'?STUDENT:BLUE;return <div style={{position:'absolute',left:390,right:390,bottom:30,minHeight:158,background:'linear-gradient(180deg,rgba(10,23,37,.96),rgba(4,11,19,.98))',border:`2px solid ${color}66`,borderRadius:26,boxShadow:'0 18px 52px rgba(0,0,0,.48)',padding:'17px 34px 21px',boxSizing:'border-box',zIndex:30,opacity:enter,transform:`translateY(${(1-enter)*18}px)`}}><div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,color,fontFamily:FONT,fontSize:18,fontWeight:900,letterSpacing:4}}><span style={{width:8,height:8,borderRadius:'50%',background:color,boxShadow:`0 0 12px ${color}`}}/>{line.speaker==='student'?'学生':'学霸'}</div><div style={{fontFamily:FONT,color:INK,fontSize:line.text.length>42?33:38,fontWeight:760,lineHeight:1.42,textAlign:'center',marginTop:5}}><HighlightedText line={line}/></div></div>};

const AfterPlanScene: React.FC = () => {
  const frame = useCurrentFrame();
  const questioning = frame < 1054;
  const p = pop(frame, questioning ? (frame < 1026 ? 988 : 1026) : 1054);
  return <Stage from={988} to={1224}><div style={{textAlign:'center',paddingTop:125}}>
    {questioning ? <div style={{fontFamily:SERIF,fontSize:96,color:frame<1026?BLUE:STUDENT,fontWeight:900,transform:`scale(${.9+p*.1})`}}>{frame<1026?'然后呢？':'还要什么？'}</div> : <>
      <div style={{fontFamily:FONT,color:MUTED,fontSize:28}}>拆开分数，等于拆解目标了吗？</div>
      <div style={{fontFamily:SERIF,fontSize:72,fontWeight:900,color:INK,marginTop:30}}>一个<span style={{color:STUDENT}}>大愿望</span></div>
      <div style={{fontSize:42,color:RED,marginTop:6}}>↓</div>
      <div style={{display:'flex',gap:14,justifyContent:'center',marginTop:12}}>{Array.from({length:6},(_,i)=><Card key={i} style={{padding:'20px 12px',width:118,fontSize:25,color:RED,opacity:pop(frame,1063+i*7)}}>小愿望</Card>)}</div>
      {frame>=1157&&<div style={{fontFamily:SERIF,fontSize:43,color:SKY,marginTop:35}}>那真正会拆目标的人怎么做？</div>}
    </>}
  </div></Stage>;
};

const sfx=[
  // Small layered attacks share the exact frames of the opening animation.
  {at:0,file:'title-air.wav',volume:.11},
  {at:6,file:'title-pluck.wav',volume:.12},
  {at:20,file:'marimba-f.wav',volume:.12},
  {at:46,file:'title-rise.wav',volume:.09},
  {at:62,file:'piano-low.wav',volume:.13},
  {at:62,file:'title-chime.wav',volume:.10},
  ...[188,202,216,230].map((at,i)=>({at,file:['marimba-f.wav','marimba-ab.wav','marimba-c.wav','marimba-eb.wav'][i],volume:.13})),
  {at:246,file:'harp-rise.wav',volume:.14},{at:282,file:'bell.wav',volume:.11},{at:315,file:'impact.wav',volume:.16},
  {at:351,file:'pizzicato.wav',volume:.16},{at:377,file:'woodblock.wav',volume:.11},
  {at:440,file:'woodblock.wav',volume:.13},{at:449,file:'woodblock.wav',volume:.13},{at:472,file:'bell.wav',volume:.14},
  {at:507,file:'pizzicato.wav',volume:.16},{at:544,file:'impact.wav',volume:.16},{at:566,file:'harp-rise.wav',volume:.13},{at:641,file:'marimba-ab.wav',volume:.13},
  ...[726,736,746,756,766,776].map(at=>({at,file:'soft-click.wav',volume:.09})),
  ...[784,988,1026].map(at=>({at,file:'pizzicato.wav',volume:.16})),
  ...[836,872,908,944].map(at=>({at,file:'soft-click.wav',volume:.11})),
  ...[1063,1070,1077,1084,1091,1098].map(at=>({at,file:'woodblock.wav',volume:.09})),
];

const AudioMix:React.FC=()=>{const frame=useCurrentFrame();const talking=lines.some((line)=>frame>=line.start&&frame<line.end);return <><Audio src={staticFile('top-student/source/music.mp3')} volume={talking?.065:.10}/><Audio src={staticFile('top-student/source/full-dialogue-sync.wav')} volume={.70}/>{sfx.map((x,i)=><Sequence key={`${x.at}-${i}`} from={x.at}><Audio src={staticFile(`top-student/sfx/${x.file}`)} volume={x.volume}/></Sequence>)}</>};

export const TopStudentSample:React.FC=()=>{const frame=useCurrentFrame();const active=[...lines].reverse().find(line=>frame>=line.start)?.speaker??'student';return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 32%,#15304c 0%,#081522 48%,#040a12 100%)',overflow:'hidden'}}><AudioMix/><div style={{position:'absolute',inset:0,opacity:.16,backgroundImage:'linear-gradient(#6b89a522 1px,transparent 1px),linear-gradient(90deg,#6b89a522 1px,transparent 1px)',backgroundSize:'54px 54px'}}/><div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,#02060ddd 0%,transparent 25%,transparent 75%,#02060ddd 100%)'}}/><CharacterLayer active={active}/><Header/><HookScene/><FourTraitsScene/><ChallengeScene/><TwoPlusScene/><GoScene/><TargetScene/><ScoreIntroScene/><PromptScene/><ScoreListScene/><AfterPlanScene/><Caption/></AbsoluteFill>};

export {CharacterLayer, Caption, Header, Card};
