import React from 'react';
import {AbsoluteFill, Audio, Sequence, spring, staticFile, useCurrentFrame} from 'remotion';
import {CharacterLayer, Caption, Header, Card, type Line} from './top-student-sample';
import captionData from './fourth-captions';

export const PART_FOUR_START=3942;
export const PART_FOUR_DURATION=1146;
const FPS=30, INK='#f6f1e7', BLUE='#63a8ff', SKY='#65e6d2', AMBER='#ffbd66', RED='#ff6577', MUTED='#9aabc0';
const FONT='"Noto Sans CJK SC", "Microsoft YaHei", sans-serif', SERIF='"Noto Serif CJK SC", serif';
const captions:Line[]=captionData.map(x=>({...x,speaker:x.speaker as Line['speaker']}));
const pop=(f:number,at:number)=>spring({frame:f-at,fps:FPS,config:{damping:17,mass:.7,stiffness:170}});
const Reveal:React.FC<{at:number;children:React.ReactNode;style?:React.CSSProperties}>=({at,children,style})=>{
 const f=useCurrentFrame(),p=pop(f,at);
 return <div style={{opacity:Math.min(1,p),transform:`translateY(${(1-p)*22}px) scale(${.95+.05*p})`,...style}}>{children}</div>;
};
const Heading:React.FC<{tag:string;children:React.ReactNode}>=({tag,children})=><><div style={{fontFamily:FONT,fontSize:20,letterSpacing:4,color:SKY}}>03 · 主动攻击 / {tag}</div><div style={{fontFamily:SERIF,fontSize:58,color:INK,fontWeight:900,lineHeight:1.3,marginTop:14}}>{children}</div></>;

const Chapter:React.FC=()=>{
 const f=useCurrentFrame();
 return <><Reveal at={2}><div style={{display:'flex',alignItems:'center',gap:26}}><div style={{fontFamily:SERIF,fontSize:132,fontWeight:900,color:BLUE,lineHeight:1}}>03</div><div><div style={{fontFamily:FONT,color:MUTED,fontSize:21,letterSpacing:6}}>第三种思维</div><div style={{fontFamily:SERIF,color:INK,fontSize:65,fontWeight:900}}>主动攻击</div></div></div></Reveal>
 <Reveal at={53}><Card style={{marginTop:40,padding:'25px 32px',borderColor:`${SKY}88`,display:'flex',alignItems:'center',justifyContent:'center',gap:28}}><span style={{fontFamily:SERIF,color:AMBER,fontSize:49,fontWeight:900}}>缺什么</span><span style={{fontSize:42,color:MUTED}}>→</span><span style={{fontFamily:SERIF,color:SKY,fontSize:49,fontWeight:900}}>追着解决什么</span></Card></Reveal>
 {f>=126&&<Reveal at={f<194?126:f<227?194:227}><div style={{fontFamily:SERIF,color:f>=194&&f<227?INK:AMBER,fontSize:f<194?40:48,fontWeight:900,textAlign:'center',marginTop:48}}>{f<194?'找网课、问老师？这个我也……':f<227?'又有？':'我先不认，你说完再讲。'}</div></Reveal>}
 </>;
};

const Diagnose:React.FC=()=>{
 const f=useCurrentFrame();
 const items=[{at:337,title:'仪器原理',sub:'原理没理解？',color:BLUE},{at:373,title:'操作步骤',sub:'操作不规范？',color:AMBER},{at:409,title:'数据处理',sub:'数据不会处理？',color:SKY}];
 return <><Reveal at={278}><Heading tag="先定位">物理实验总丢分，先查清卡点</Heading></Reveal><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginTop:35}}>{items.map((x,i)=><Reveal at={x.at} key={x.title}><Card style={{height:174,padding:25,boxSizing:'border-box',borderColor:`${x.color}88`}}><div style={{fontFamily:FONT,fontSize:18,color:x.color}}>0{i+1}</div><div style={{fontFamily:SERIF,color:INK,fontSize:36,fontWeight:900,marginTop:14}}>{x.title}</div><div style={{fontFamily:FONT,color:MUTED,fontSize:22,marginTop:12}}>{x.sub}</div></Card></Reveal>)}</div>
 <Reveal at={446}><div style={{fontFamily:FONT,fontSize:29,color:SKY,textAlign:'center',marginTop:27}}>找到卡点 → 找对应讲解</div></Reveal>
 <Reveal at={482}><Card style={{padding:'22px 27px',marginTop:24,borderColor:SKY}}><div style={{fontFamily:SERIF,color:INK,fontSize:41,fontWeight:900}}>听完，<span style={{color:SKY}}>当场拿题验收</span></div><div style={{fontFamily:FONT,color:f>=525?AMBER:MUTED,fontSize:23,marginTop:14}}>问题没消失 → 继续换办法 ↺</div></Card></Reveal>
 </>;
};

const Resource:React.FC=()=>{
 const f=useCurrentFrame();
 if(f>=699)return <><Reveal at={699}><Heading tag="主动补漏洞">学校还没讲，也要先补？</Heading></Reveal><Reveal at={764}><Card style={{height:250,marginTop:45,padding:32,boxSizing:'border-box',borderColor:`${RED}88`}}><div style={{fontFamily:FONT,color:MUTED,fontSize:23}}>问题已经出现在</div><div style={{fontFamily:SERIF,fontWeight:900,fontSize:65,color:INK,marginTop:23}}>你自己的卷子上</div><div style={{height:4,background:`linear-gradient(90deg,${RED},transparent)`,marginTop:28}}/></Card></Reveal><Reveal at={796}><div style={{fontFamily:SERIF,fontSize:43,fontWeight:900,color:AMBER,textAlign:'center',marginTop:35}}>还等学校通知？</div></Reveal></>;
 return <><Reveal at={575}><Heading tag="选资源的标准">哪种资源，才是最好的？</Heading></Reveal><div style={{display:'flex',justifyContent:'center',gap:25,marginTop:35}}>{['老师','网课','资料'].map((x,i)=><Reveal key={x} at={575+i*9} style={{flex:1}}><Card style={{height:110,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:SERIF,fontSize:36,fontWeight:900,color:MUTED}}>{x}</Card></Reveal>)}</div><Reveal at={631}><Card style={{marginTop:30,padding:'30px 32px',borderColor:SKY,boxShadow:`0 0 28px ${SKY}22`}}><div style={{fontFamily:SERIF,fontSize:49,color:INK,fontWeight:900,textAlign:'center'}}>谁能<span style={{color:SKY}}>解决问题</span>，谁就最好。</div></Card></Reveal></>;
};

const Autonomous:React.FC=()=>{
 const f=useCurrentFrame();
 if(f>=1113)return <><div style={{fontFamily:FONT,fontSize:22,color:MUTED,letterSpacing:4}}>主动攻击 · 给自己找路</div><Reveal at={1113}><div style={{fontFamily:SERIF,fontSize:88,fontWeight:900,color:AMBER,textAlign:'center',marginTop:160}}>第四种呢？</div></Reveal></>;
 return <><Reveal at={859}><Heading tag="学会自己学">以后没人管，也能自己学</Heading></Reveal><div style={{display:'grid',gridTemplateColumns:'1fr 1.2fr',gap:24,marginTop:42}}>
 <Reveal at={998}><Card style={{height:265,padding:30,boxSizing:'border-box'}}><div style={{fontFamily:FONT,color:MUTED,fontSize:23}}>别人还在</div><div style={{fontFamily:SERIF,color:MUTED,fontSize:48,fontWeight:900,marginTop:30}}>等人指路</div><div style={{fontSize:40,color:'#52697f',marginTop:20}}>···</div></Card></Reveal>
 <Reveal at={1030}><Card style={{height:265,padding:30,boxSizing:'border-box',borderColor:SKY}}><div style={{fontFamily:FONT,color:SKY,fontSize:23}}>他已经开始</div><div style={{fontFamily:SERIF,color:INK,fontSize:48,fontWeight:900,marginTop:30}}>给自己找路</div><svg width="440" height="68" viewBox="0 0 440 68" style={{marginTop:15}}><path d="M12 55 H130 L205 18 H405" fill="none" stroke={SKY} strokeWidth="4" strokeDasharray="450" strokeDashoffset={450*(1-Math.min(1,pop(f,1040)))}/><path d="M391 6 L409 18 L391 30" fill="none" stroke={SKY} strokeWidth="4" opacity={pop(f,1058)}/><circle cx="12" cy="55" r="7" fill={BLUE}/></svg></Card></Reveal>
 </div><Reveal at={938}><div style={{fontFamily:FONT,color:SKY,fontSize:28,textAlign:'center',marginTop:33}}>上了大学，更占便宜</div></Reveal></>;
};

const effects=[
 {at:2,file:'piano-low.wav',volume:.14},{at:2,file:'title-chime.wav',volume:.10},
 {at:53,file:'title-pluck.wav',volume:.12},
 ...[126,194,227].map(at=>({at,file:at===194?'woodblock.wav':'pizzicato.wav',volume:.12})),
 {at:278,file:'title-pluck.wav',volume:.12},
 ...[337,373,409].map((at,i)=>({at,file:['marimba-f.wav','marimba-ab.wav','marimba-c.wav'][i],volume:.13})),
 {at:446,file:'harp-rise.wav',volume:.13},{at:482,file:'bell.wav',volume:.11},{at:525,file:'woodblock.wav',volume:.11},
 ...[575,584,593].map(at=>({at,file:'soft-click.wav',volume:.10})),
 {at:631,file:'title-chime.wav',volume:.12},{at:699,file:'pizzicato.wav',volume:.13},{at:764,file:'woodblock.wav',volume:.12},{at:796,file:'pizzicato.wav',volume:.11},
 {at:859,file:'title-pluck.wav',volume:.11},{at:938,file:'marimba-f.wav',volume:.12},{at:1030,file:'harp-rise.wav',volume:.13},{at:1058,file:'soft-click.wav',volume:.10},{at:1113,file:'pizzicato.wav',volume:.12},
];

export const TopStudentPartFour:React.FC=()=>{
 const f=useCurrentFrame(),active=[...captions].reverse().find(x=>f>=x.start)?.speaker??'teacher';
 const talking=captions.some(x=>f>=x.start&&f<x.end);
 return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 32%,#15304c 0%,#081522 48%,#040a12 100%)',overflow:'hidden'}}>
  <Audio src={staticFile('top-student/source/full-dialogue-sync.wav')} trimBefore={PART_FOUR_START} trimAfter={PART_FOUR_START+PART_FOUR_DURATION} volume={.70}/>
  <Audio src={staticFile('top-student/source/music.mp3')} trimBefore={PART_FOUR_START} volume={(talking?.065:.10)*1.15}/>
  {effects.map((x,i)=><Sequence key={i} from={x.at}><Audio src={staticFile(`top-student/sfx/${x.file}`)} volume={x.volume}/></Sequence>)}
  <div style={{position:'absolute',inset:0,opacity:.16,backgroundImage:'linear-gradient(#6b89a522 1px,transparent 1px),linear-gradient(90deg,#6b89a522 1px,transparent 1px)',backgroundSize:'54px 54px'}}/>
  <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,#02060ddd 0%,transparent 25%,transparent 75%,#02060ddd 100%)'}}/>
  <CharacterLayer active={active}/><Header chapter={3}/>
  <div style={{position:'absolute',left:420,top:125,width:1080,height:635}}>{f<278?<Chapter/>:f<575?<Diagnose/>:f<859?<Resource/>:<Autonomous/>}</div>
  <Caption captions={captions}/>
 </AbsoluteFill>;
};
