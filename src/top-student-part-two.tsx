import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame} from 'remotion';
import {CharacterLayer, Caption, Header, Card, type Line} from './top-student-sample';
import captionData from './second-captions';

const FPS=30;
export const PART_TWO_START=1224;
export const PART_TWO_DURATION=1152;
const INK='#f6f1e7', BLUE='#63a8ff', SKY='#65e6d2', AMBER='#ffbd66', RED='#ff6577', MUTED='#9aabc0';
const FONT='"Noto Sans CJK SC", "Microsoft YaHei", sans-serif';
const SERIF='"Noto Serif CJK SC", serif';
const captions:Line[]=captionData.map(x=>({...x,speaker:x.speaker as Line['speaker']}));
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const pop=(f:number,at:number)=>spring({frame:f-at,fps:FPS,config:{damping:17,mass:.7,stiffness:170}});
const Reveal:React.FC<{at:number;children:React.ReactNode;style?:React.CSSProperties}>=({at,children,style})=>{
  const f=useCurrentFrame(),p=pop(f,at);
  return <div style={{opacity:Math.min(1,p),transform:`translateY(${(1-p)*22}px) scale(${.96+p*.04})`,...style}}>{children}</div>;
};
const Heading:React.FC<{eyebrow:string;children:React.ReactNode}>=({eyebrow,children})=><><div style={{fontFamily:FONT,fontSize:20,letterSpacing:5,color:SKY}}>01 · 目标拆解 / {eyebrow}</div><div style={{fontFamily:SERIF,fontSize:58,fontWeight:900,color:INK,marginTop:12,lineHeight:1.3}}>{children}</div></>;

const ReversePlan:React.FC=()=>{
  const f=useCurrentFrame();
  const steps=[{at:4,title:'院校分数',detail:'复旦在本省要多少分',color:BLUE},{at:74,title:'校内排名',detail:'本校什么排名能上',color:SKY},{at:109,title:'优势科目',detail:'自己哪科最值得提',color:AMBER}];
  return <>
    <Reveal at={3}><Heading eyebrow="先算账">从目标，一路反推到今天</Heading></Reveal>
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginTop:32}}>{steps.map((x,i)=><Reveal key={x.title} at={x.at}><Card style={{height:145,padding:24,boxSizing:'border-box',borderColor:`${x.color}77`}}><div style={{fontFamily:FONT,color:x.color,fontSize:18}}>0{i+1}</div><div style={{fontFamily:SERIF,color:INK,fontSize:34,fontWeight:900,marginTop:8}}>{x.title}</div><div style={{fontFamily:FONT,color:MUTED,fontSize:20,marginTop:8}}>{x.detail}</div></Card></Reveal>)}</div>
    {f<230?<div style={{display:'flex',gap:20,marginTop:28}}>
      <Reveal at={150} style={{flex:1}}><Card style={{padding:'23px 28px',borderColor:`${SKY}88`}}><div style={{fontFamily:FONT,fontSize:18,color:MUTED}}>题目取舍</div><div style={{fontFamily:SERIF,fontSize:39,color:SKY,fontWeight:900,marginTop:8}}>哪些题必须拿 ✓</div></Card></Reveal>
      <Reveal at={181} style={{flex:1}}><Card style={{padding:'23px 28px',borderColor:`${AMBER}88`}}><div style={{fontFamily:FONT,fontSize:18,color:MUTED}}>把精力用在刀刃上</div><div style={{fontFamily:SERIF,fontSize:39,color:AMBER,fontWeight:900,marginTop:8}}>哪些题可以丢</div></Card></Reveal>
    </div>:<>
      <div style={{display:'flex',gap:15,marginTop:24}}>{['时间','师资','环境','自控力'].map((x,i)=><Reveal key={x} at={230+i*12} style={{flex:1}}><div style={{fontFamily:FONT,fontSize:23,padding:'13px 18px',border:'1px solid #4b6984',borderRadius:14,textAlign:'center',color:MUTED,background:'#0a1a2a'}}>{x}</div></Reveal>)}</div>
      <Reveal at={305}><Card style={{marginTop:25,padding:'20px 28px',borderColor:SKY,boxShadow:`0 0 38px ${SKY}22`,display:'flex',alignItems:'center',gap:24}}><div style={{fontFamily:FONT,color:'#07111f',background:SKY,borderRadius:14,padding:'12px 18px',fontSize:27,fontWeight:900}}>今天</div><div style={{fontFamily:SERIF,color:INK,fontSize:40,fontWeight:900}}>该解决什么具体问题？</div></Card></Reveal>
    </>}
  </>;
};

const RealisticPath:React.FC=()=>{
 const f=useCurrentFrame();
 if(f<475)return <><Reveal at={381}><Heading eyebrow="现实限制">环境不好，老师顾不过来？</Heading></Reveal><div style={{display:'flex',gap:24,marginTop:60}}>{['学校环境','老师精力'].map((x,i)=><Reveal at={395+i*22} key={x} style={{flex:1}}><Card style={{height:220,display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',borderColor:`${AMBER}77`}}><div style={{fontSize:28,color:MUTED,fontFamily:FONT}}>{x}</div><div style={{fontSize:75,fontFamily:SERIF,fontWeight:900,color:AMBER,marginTop:12}}>受限</div></Card></Reveal>)}</div></>;
 const cards=[{at:475,title:'找空教室',sub:'换一个能专注的地方',icon:'□',color:BLUE},{at:502,title:'去办公室',sub:'集中解决老师能解答的问题',icon:'↗',color:SKY},{at:555,title:'换资料',sub:'选择自己能看懂的讲解',icon:'≡',color:AMBER}];
 return <><Reveal at={475}><Heading eyebrow="换办法">条件受限，路径可以调整</Heading></Reveal><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginTop:35}}>{cards.map(x=><Reveal key={x.title} at={x.at}><Card style={{height:245,padding:24,boxSizing:'border-box',borderColor:`${x.color}77`}}><div style={{fontFamily:FONT,fontSize:42,color:x.color,lineHeight:1.1}}>{x.icon}</div><div style={{fontFamily:SERIF,fontSize:37,fontWeight:900,color:INK,marginTop:20}}>{x.title}</div><div style={{fontFamily:FONT,fontSize:21,lineHeight:1.5,color:MUTED,marginTop:14}}>{x.sub}</div></Card></Reveal>)}</div><Reveal at={629}><div style={{fontFamily:SERIF,fontSize:43,fontWeight:900,color:INK,marginTop:38,textAlign:'center'}}>目标可以<span style={{color:AMBER}}>野</span>，路径必须<span style={{color:SKY}}>现实</span>。</div></Reveal></>;
};

const KeepGoing:React.FC=()=>{
 const f=useCurrentFrame();
 if(f<810)return <Reveal at={704}><Heading eyebrow="算出来来不及了">复旦，确实来不及了呢？</Heading><div style={{display:'flex',alignItems:'center',justifyContent:'center',height:330,gap:35}}><div style={{fontFamily:SERIF,fontSize:103,fontWeight:900,color:AMBER}}>目标</div><div style={{fontFamily:SERIF,fontSize:150,fontWeight:900,color:RED}}>？</div></div></Reveal>;
 return <><Reveal at={810}><Heading eyebrow="继续走">多考一分，就有一分的价值</Heading></Reveal><Reveal at={810}><div style={{display:'flex',justifyContent:'center',alignItems:'baseline',gap:22,marginTop:28}}><div style={{fontFamily:SERIF,fontSize:170,fontWeight:900,color:SKY,textShadow:`0 0 42px ${SKY}33`}}>+1</div><div style={{fontFamily:FONT,fontSize:45,fontWeight:900,color:INK}}>分</div></div></Reveal><Reveal at={891}><Card style={{padding:'24px 30px',marginTop:20,borderColor:`${SKY}77`}}><div style={{fontFamily:FONT,fontSize:24,color:MUTED}}>看清现实，是为了</div><div style={{fontFamily:SERIF,fontSize:49,fontWeight:900,color:INK,marginTop:10}}><span style={{color:SKY}}>多拿分</span>，而不是认命。</div></Card></Reveal></>;
};

const Reflection:React.FC=()=>{
 const f=useCurrentFrame();
 const at=f<1036?970:f<1102?1036:1102;
 const title=f<1036?'比列计划难多了……':f<1102?'有什么疑虑吗？':'没什么。第二种呢？';
 const color=f<1036||f>=1102?AMBER:BLUE;
 return <><div style={{fontFamily:FONT,color:MUTED,fontSize:22,letterSpacing:5}}>目标拆解 · 不是只拆分数</div><Reveal at={at}><div style={{height:380,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:SERIF,fontSize:f>=1102?69:76,fontWeight:900,color,textAlign:'center'}}>{title}</div></Reveal></>;
};

const effects=[
 {at:4,file:'piano-low.wav',volume:.13},
 ...[4,74,109].map((at,i)=>({at,file:['marimba-f.wav','marimba-ab.wav','marimba-c.wav'][i],volume:.13})),
 {at:150,file:'bell.wav',volume:.10},{at:181,file:'woodblock.wav',volume:.12},
 ...[230,242,254,266].map(at=>({at,file:'soft-click.wav',volume:.08})),
 {at:305,file:'harp-rise.wav',volume:.14},{at:305,file:'title-chime.wav',volume:.09},
 {at:381,file:'pizzicato.wav',volume:.14},{at:395,file:'woodblock.wav',volume:.10},{at:417,file:'woodblock.wav',volume:.10},
 ...[475,502,555].map((at,i)=>({at,file:['marimba-f.wav','marimba-ab.wav','marimba-c.wav'][i],volume:.13})),
 {at:629,file:'title-chime.wav',volume:.10},
 {at:704,file:'pizzicato.wav',volume:.14},{at:810,file:'piano-low.wav',volume:.14},{at:810,file:'bell.wav',volume:.10},
 {at:891,file:'title-pluck.wav',volume:.12},
 ...[970,1036,1102].map(at=>({at,file:'pizzicato.wav',volume:.12})),
];

export const TopStudentPartTwo:React.FC=()=>{
 const f=useCurrentFrame();
 const active=[...captions].reverse().find(x=>f>=x.start)?.speaker??'teacher';
 const talking=captions.some(x=>f>=x.start&&f<x.end);
 const musicFade=interpolate(f,[0,8,PART_TWO_DURATION-10,PART_TWO_DURATION],[.8,1,1,.8],clamp);
 return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 32%,#15304c 0%,#081522 48%,#040a12 100%)',overflow:'hidden'}}>
  <Audio src={staticFile('top-student/source/full-dialogue-sync.wav')} trimBefore={PART_TWO_START} trimAfter={PART_TWO_START+PART_TWO_DURATION} volume={.70}/>
  <Audio src={staticFile('top-student/source/music.mp3')} trimBefore={PART_TWO_START} volume={(talking?.065:.10)*musicFade}/>
  {effects.map((x,i)=><Sequence key={i} from={x.at}><Audio src={staticFile(`top-student/sfx/${x.file}`)} volume={x.volume}/></Sequence>)}
  <div style={{position:'absolute',inset:0,opacity:.16,backgroundImage:'linear-gradient(#6b89a522 1px,transparent 1px),linear-gradient(90deg,#6b89a522 1px,transparent 1px)',backgroundSize:'54px 54px'}}/>
  <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,#02060ddd 0%,transparent 25%,transparent 75%,#02060ddd 100%)'}}/>
  <CharacterLayer active={active}/><Header chapter={1}/>
  <div style={{position:'absolute',left:420,top:125,width:1080,height:635}}>
   {f<381?<ReversePlan/>:f<704?<RealisticPath/>:f<970?<KeepGoing/>:<Reflection/>}
  </div>
  <Caption captions={captions}/>
 </AbsoluteFill>;
};
