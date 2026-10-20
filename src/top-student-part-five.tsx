import React from 'react';
import {AbsoluteFill, Audio, Sequence, spring, staticFile, useCurrentFrame} from 'remotion';
import {CharacterLayer, Caption, Header, Card, type Line} from './top-student-sample';
import captionData from './fifth-captions';

export const PART_FIVE_START=5088;
export const PART_FIVE_DURATION=1539;
const FPS=30, INK='#f6f1e7', BLUE='#63a8ff', SKY='#65e6d2', AMBER='#ffbd66', PURPLE='#c897ff', MUTED='#9aabc0';
const FONT='"Noto Sans CJK SC", "Microsoft YaHei", sans-serif', SERIF='"Noto Serif CJK SC", serif';
const captions:Line[]=captionData.map(x=>({...x,speaker:x.speaker as Line['speaker']}));
const pop=(f:number,at:number)=>spring({frame:f-at,fps:FPS,config:{damping:17,mass:.7,stiffness:170}});
const Reveal:React.FC<{at:number;children:React.ReactNode;style?:React.CSSProperties}>=({at,children,style})=>{
 const f=useCurrentFrame(),p=pop(f,at);
 return <div style={{opacity:Math.min(1,p),transform:`translateY(${(1-p)*22}px) scale(${.95+.05*p})`,...style}}>{children}</div>;
};
const Heading:React.FC<{tag:string;children:React.ReactNode}>=({tag,children})=><><div style={{fontFamily:FONT,fontSize:20,letterSpacing:4,color:SKY}}>04 · 知识网络 / {tag}</div><div style={{fontFamily:SERIF,fontSize:58,color:INK,fontWeight:900,lineHeight:1.3,marginTop:14}}>{children}</div></>;
const Node:React.FC<{x:number;y:number;label:string;color?:string;width?:number}>=({x,y,label,color=BLUE,width=190})=><Card style={{position:'absolute',left:x,top:y,width,height:76,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:FONT,fontSize:27,fontWeight:800,color,borderColor:`${color}88`}}>{label}</Card>;

const Chapter:React.FC=()=>{
 const f=useCurrentFrame(),p=Math.min(1,pop(f,45));
 return <><Reveal at={2}><div style={{display:'flex',alignItems:'center',gap:26}}><div style={{fontFamily:SERIF,fontSize:132,fontWeight:900,color:BLUE,lineHeight:1}}>04</div><div><div style={{fontFamily:FONT,color:MUTED,fontSize:21,letterSpacing:6}}>第四种思维</div><div style={{fontFamily:SERIF,color:INK,fontSize:65,fontWeight:900}}>知识网络</div></div></div></Reveal>
 <div style={{position:'relative',height:275,marginTop:28}}><svg width="1080" height="275" style={{position:'absolute',inset:0}}>{[[220,50],[220,220],[860,50],[860,220]].map(([x,y],i)=><path key={i} d={`M540 135 L${x} ${y}`} stroke={SKY} strokeWidth="3" strokeDasharray="360" strokeDashoffset={360*(1-p)} opacity={.7}/>)}</svg><Reveal at={45}><Node x={425} y={98} label="新知识" width={230} color={SKY}/></Reveal>{[{x:90,y:10,label:'已有概念'},{x:90,y:185,label:'熟悉方法'},{x:800,y:10,label:'相关例题'},{x:800,y:185,label:'已知规律'}].map((x,i)=><Reveal at={45+i*8} key={x.label}><Node {...x}/></Reveal>)}</div>
 {f>=131&&<Reveal at={f<180?131:f<265?180:265}><div style={{fontFamily:SERIF,fontSize:f<180?39:34,fontWeight:900,textAlign:'center',color:f>=180&&f<265?INK:AMBER,marginTop:15}}>{f<180?'这种感觉，我偶尔也有。':f<265?'这次知道加“偶尔”了，谨慎了不少。':'你少调侃我，快说。'}</div></Reveal>}
 </>;
};

const Connections:React.FC=()=>{
 const f=useCurrentFrame();
 if(f<392)return <><Reveal at={320}><Heading tag="数学中的连接">学完导数，回看函数单调性</Heading></Reveal><div style={{position:'relative',height:310,marginTop:50}}><Reveal at={320}><Node x={70} y={65} width={320} label="导数" color={BLUE}/></Reveal><svg width="1080" height="280" style={{position:'absolute',inset:0}}><path d="M395 103 H680" stroke={SKY} strokeWidth="5" strokeDasharray="300" strokeDashoffset={300*(1-Math.min(1,pop(f,342)))}/><path d="M660 88 L682 103 L660 118" stroke={SKY} strokeWidth="5" fill="none" opacity={pop(f,350)}/></svg><Reveal at={350}><Node x={690} y={65} width={320} label="函数的单调性" color={SKY}/></Reveal><Reveal at={350}><div style={{position:'absolute',left:200,top:210,right:200,fontFamily:FONT,color:MUTED,fontSize:27,textAlign:'center'}}>新学的工具，连接已经学过的问题</div></Reveal></div></>;
 const nodes=[{x:20,y:140,label:'背景',at:392},{x:230,y:140,label:'原因',at:422},{x:440,y:140,label:'历史事件',at:442},{x:650,y:140,label:'结果',at:466},{x:860,y:140,label:'后续影响',at:484}];
 return <><Reveal at={392}><Heading tag="历史中的连接">一个事件，连起前因后果</Heading></Reveal><div style={{position:'relative',height:330,marginTop:8}}><svg width="1080" height="320" style={{position:'absolute',inset:0}}>{[0,1,2,3].map((i)=>{const p=Math.min(1,pop(f,nodes[i+1].at));return <g key={i} opacity={p}><path d={`M${210+i*210} 178 H${228+i*210}`} stroke={SKY} strokeWidth="3"/><path d={`M${220+i*210} 171 L${229+i*210} 178 L${220+i*210} 185`} fill="none" stroke={SKY} strokeWidth="3"/></g>})}</svg>{nodes.map((x,i)=><Reveal key={x.label} at={x.at}><Node x={x.x} y={x.y} label={x.label} width={190} color={i===2?AMBER:SKY}/></Reveal>)}</div><Reveal at={544}><Card style={{padding:'23px 28px',borderColor:SKY,fontFamily:SERIF,color:INK,fontSize:39,fontWeight:900,textAlign:'center'}}>学到一块，把前后几块一起带起来</Card></Reveal></>;
};

const Clues:React.FC=()=>{
 const f=useCurrentFrame();
 const ready=f>=768;
 const nodes=[{x:20,y:215,label:'已学概念',color:BLUE},{x:435,y:315,label:'熟悉方法',color:AMBER},{x:850,y:215,label:'相关例题',color:SKY}];
 return <><Reveal at={623}><Heading tag="遇到陌生题">题目换了样子，线索仍然熟悉</Heading></Reveal><div style={{position:'relative',height:430,marginTop:20}}><svg width="1080" height="420" style={{position:'absolute',inset:0}}>{nodes.map((x,i)=>{const p=Math.min(1,pop(f,768+i*14));return <path key={i} d={`M540 93 L${x.x+95} ${x.y+38}`} stroke={x.color} strokeWidth="3" strokeDasharray="500" strokeDashoffset={500*(1-p)} opacity={.8}/>})}{f>=867&&[[245,140],[640,160],[220,330],[775,335]].map(([x,y],i)=><g key={i} opacity={pop(f,867+i*14)}><path d={`M${x} ${y} L540 93`} stroke={BLUE} strokeWidth="2" opacity=".45"/><circle cx={x} cy={y} r="9" fill={SKY}/></g>)}</svg><Reveal at={623}><Card style={{position:'absolute',left:335,top:35,width:410,height:110,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',borderColor:ready?SKY:'#526d8b',borderStyle:ready?'solid':'dashed'}}><div style={{fontFamily:FONT,fontSize:20,color:MUTED}}>没见过的题目</div><div style={{fontFamily:SERIF,fontSize:35,fontWeight:900,color:ready?SKY:INK,marginTop:8}}>{ready?'认出熟悉的条件':'从哪里找线索？'}</div></Card></Reveal>{nodes.map((x,i)=><Reveal key={x.label} at={768+i*14}><Node {...x}/></Reveal>)}</div><Reveal at={867}><div style={{fontFamily:FONT,fontSize:28,color:SKY,textAlign:'center'}}>知识越多 → 可调用的线索越多 → 越往后越省力</div></Reveal></>;
};

const Advantage:React.FC=()=>{
 const f=useCurrentFrame(),p=Math.min(1,pop(f,1064));
 return <><Reveal at={1001}><Heading tag="让时间积累优势">听着就像，越学越聪明</Heading></Reveal><Card style={{marginTop:35,height:300,padding:25,boxSizing:'border-box'}}><svg width="1020" height="250" viewBox="0 0 1020 250"><path d="M65 20 V205 H960" fill="none" stroke="#425971" strokeWidth="2"/><path d="M75 190 C270 188 390 172 530 132 S760 55 925 25" fill="none" stroke={SKY} strokeWidth="6" strokeLinecap="round" strokeDasharray="980" strokeDashoffset={980*(1-p)}/><text x="83" y="30" fill={MUTED} fontSize="20">可调用的线索</text><text x="850" y="238" fill={MUTED} fontSize="20">学习积累</text><circle cx="75" cy="190" r="8" fill={BLUE}/><circle cx="925" cy="25" r="10" fill={SKY} opacity={p}/></svg></Card><Reveal at={1064}><div style={{fontFamily:SERIF,fontSize:39,color:INK,fontWeight:900,textAlign:'center',marginTop:28}}>现在可能还没出头，<span style={{color:SKY}}>优势会慢慢积累。</span></div></Reveal></>;
};

const Summary:React.FC=()=>{
 const f=useCurrentFrame();
 const traits=[{title:'目标拆解',color:BLUE},{title:'失败复盘',color:PURPLE},{title:'主动攻击',color:AMBER},{title:'知识网络',color:SKY}];
 const text=f<1290?'四种说完了，认出自己了吗？':f<1343?'怎么了，有什么疑虑吗？':f<1455?'刚开始觉得，每个都像我……':f<1495?'嗯，你慢慢想。':'要是四种都没有，怎么办？';
 const cue=f<1290?1195:f<1343?1290:f<1455?1343:f<1495?1455:1495;
 return <><div style={{fontFamily:FONT,color:SKY,fontSize:20,letterSpacing:5}}>四种思维 · 你认出自己了吗</div><div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:20,marginTop:30}}>{traits.map((x,i)=><Reveal key={x.title} at={1195+i*10}><Card style={{height:105,padding:'20px 27px',boxSizing:'border-box',display:'flex',alignItems:'center',gap:22,borderColor:`${x.color}88`}}><span style={{fontFamily:SERIF,fontSize:38,color:x.color,fontWeight:900}}>0{i+1}</span><span style={{fontFamily:SERIF,fontSize:36,color:INK,fontWeight:900}}>{x.title}</span></Card></Reveal>)}</div><Reveal at={cue}><div style={{fontFamily:SERIF,fontSize:f>=1495?51:43,fontWeight:900,color:f>=1343&&f<1455||f>=1495?AMBER:INK,marginTop:55,textAlign:'center'}}>{text}</div></Reveal></>;
};

const effects=[
 {at:2,file:'piano-low.wav',volume:.14},{at:2,file:'title-chime.wav',volume:.10},{at:45,file:'harp-rise.wav',volume:.12},
 ...[45,53,61,69].map(at=>({at,file:'soft-click.wav',volume:.09})),
 ...[131,180,265].map(at=>({at,file:'pizzicato.wav',volume:.12})),
 {at:320,file:'marimba-f.wav',volume:.12},{at:342,file:'harp-rise.wav',volume:.12},{at:350,file:'bell.wav',volume:.10},
 ...[392,422,442,466,484].map((at,i)=>({at,file:['marimba-f.wav','marimba-ab.wav','marimba-c.wav','marimba-eb.wav','title-pluck.wav'][i],volume:.11})),
 {at:544,file:'title-chime.wav',volume:.11},{at:623,file:'pizzicato.wav',volume:.12},
 ...[768,782,796].map(at=>({at,file:'soft-click.wav',volume:.10})),
 ...[867,881,895,909].map(at=>({at,file:'soft-click.wav',volume:.08})),
 {at:1001,file:'title-pluck.wav',volume:.12},{at:1064,file:'harp-rise.wav',volume:.12},
 ...[1195,1205,1215,1225].map((at,i)=>({at,file:['marimba-f.wav','marimba-ab.wav','marimba-c.wav','marimba-eb.wav'][i],volume:.12})),
 ...[1290,1343,1455,1495].map(at=>({at,file:'pizzicato.wav',volume:.11})),
];

export const TopStudentPartFive:React.FC=()=>{
 const f=useCurrentFrame(),active=[...captions].reverse().find(x=>f>=x.start)?.speaker??'teacher';
 const talking=captions.some(x=>f>=x.start&&f<x.end);
 return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 32%,#15304c 0%,#081522 48%,#040a12 100%)',overflow:'hidden'}}>
  <Audio src={staticFile('top-student/source/full-dialogue-sync.wav')} trimBefore={PART_FIVE_START} trimAfter={PART_FIVE_START+PART_FIVE_DURATION} volume={.70}/>
  <Audio src={staticFile('top-student/source/music-continuous.wav')} trimBefore={PART_FIVE_START} volume={(talking?.065:.10)*1.15}/>
  {effects.map((x,i)=><Sequence key={i} from={x.at}><Audio src={staticFile(`top-student/sfx/${x.file}`)} volume={x.volume}/></Sequence>)}
  <div style={{position:'absolute',inset:0,opacity:.16,backgroundImage:'linear-gradient(#6b89a522 1px,transparent 1px),linear-gradient(90deg,#6b89a522 1px,transparent 1px)',backgroundSize:'54px 54px'}}/>
  <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,#02060ddd 0%,transparent 25%,transparent 75%,#02060ddd 100%)'}}/>
  <CharacterLayer active={active}/><Header chapter={4}/>
  <div style={{position:'absolute',left:420,top:125,width:1080,height:635}}>{f<320?<Chapter/>:f<623?<Connections/>:f<1001?<Clues/>:f<1195?<Advantage/>:<Summary/>}</div>
  <Caption captions={captions}/>
 </AbsoluteFill>;
};
