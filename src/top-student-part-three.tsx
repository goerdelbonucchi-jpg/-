import React from 'react';
import {AbsoluteFill, Audio, Sequence, spring, staticFile, useCurrentFrame} from 'remotion';
import {CharacterLayer, Caption, Header, Card, type Line} from './top-student-sample';
import captionData from './third-captions';

export const PART_THREE_START=2376;
export const PART_THREE_DURATION=1566;
const FPS=30;
const INK='#f6f1e7', BLUE='#63a8ff', SKY='#65e6d2', AMBER='#ffbd66', RED='#ff6577', MUTED='#9aabc0';
const FONT='"Noto Sans CJK SC", "Microsoft YaHei", sans-serif', SERIF='"Noto Serif CJK SC", serif';
const captions:Line[]=captionData.map(x=>({...x,speaker:x.speaker as Line['speaker']}));
const pop=(f:number,at:number)=>spring({frame:f-at,fps:FPS,config:{damping:17,mass:.7,stiffness:170}});
const Reveal:React.FC<{at:number;children:React.ReactNode;style?:React.CSSProperties}>=({at,children,style})=>{
 const f=useCurrentFrame(),p=pop(f,at);
 return <div style={{opacity:Math.min(1,p),transform:`translateY(${(1-p)*22}px) scale(${.95+.05*p})`,...style}}>{children}</div>;
};
const Heading:React.FC<{tag:string;children:React.ReactNode}>=({tag,children})=><><div style={{fontFamily:FONT,fontSize:20,letterSpacing:4,color:SKY}}>02 · 失败复盘 / {tag}</div><div style={{fontFamily:SERIF,fontSize:58,color:INK,fontWeight:900,lineHeight:1.3,marginTop:14}}>{children}</div></>;

const Chapter:React.FC=()=>{
 const f=useCurrentFrame();
 return <><Reveal at={6}><div style={{display:'flex',alignItems:'center',gap:26}}><div style={{fontFamily:SERIF,fontSize:132,fontWeight:900,color:BLUE,lineHeight:1}}>02</div><div><div style={{fontFamily:FONT,color:MUTED,fontSize:21,letterSpacing:6}}>第二种思维</div><div style={{fontFamily:SERIF,color:INK,fontSize:65,fontWeight:900}}>失败复盘</div></div></div></Reveal>
 {f<142?<Reveal at={66}><Card style={{marginTop:48,padding:'36px 34px',borderColor:`${SKY}88`}}><div style={{fontFamily:FONT,color:MUTED,fontSize:25}}>做错一道题</div><div style={{fontFamily:SERIF,color:SKY,fontSize:65,fontWeight:900,marginTop:14}}>都不肯白错</div></Card></Reveal>:<><Reveal at={142}><div style={{fontFamily:FONT,color:AMBER,fontSize:28,marginTop:35}}>这个我肯定有！</div></Reveal><div style={{display:'flex',gap:24,marginTop:24}}>{[0,1,2].map(i=><Reveal key={i} at={142+i*12} style={{flex:1}}><Card style={{height:210,padding:24,borderColor:`${AMBER}77`,boxSizing:'border-box',transform:`rotate(${(i-1)*3}deg)`}}><div style={{fontFamily:FONT,fontSize:18,color:MUTED}}>错题本</div><div style={{fontFamily:SERIF,fontSize:77,color:AMBER,fontWeight:900,textAlign:'center',marginTop:6}}>0{i+1}</div><div style={{height:2,background:'#846742',marginTop:9}}/></Card></Reveal>)}</div></>}
 </>;
};

const Effort:React.FC=()=>{
 const f=useCurrentFrame();
 const steps=[{at:306,title:'难受好几天',sub:'情绪',color:RED},{at:345,title:'发誓要认真',sub:'决心',color:AMBER},{at:388,title:'多刷两套卷',sub:'加量',color:BLUE}];
 return <><Reveal at={215}><Heading tag="先问结果">你上次考砸，复盘出了什么？</Heading></Reveal><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20,marginTop:44}}>{steps.map((x,i)=><Reveal at={x.at} key={x.title}><Card style={{height:200,padding:26,boxSizing:'border-box',borderColor:`${x.color}77`}}><div style={{fontFamily:FONT,fontSize:19,color:x.color}}>0{i+1} / {x.sub}</div><div style={{fontFamily:SERIF,fontSize:35,fontWeight:900,color:INK,marginTop:30}}>{x.title}</div></Card></Reveal>)}</div>
 <Reveal at={449}><div style={{fontFamily:SERIF,fontSize:52,fontWeight:900,color:RED,textAlign:'center',marginTop:34}}>你这不叫复盘。</div></Reveal>
 {f>=500&&<Reveal at={500}><div style={{fontFamily:FONT,color:AMBER,fontSize:29,textAlign:'center',marginTop:17}}>有区别吗？反正我更努力了。</div></Reveal>}
 </>;
};

const Standard:React.FC=()=>{
 const f=useCurrentFrame();
 return <><Reveal at={579}><Heading tag="换一个标准">成功的标准，先换掉</Heading></Reveal>
 <div style={{display:'flex',gap:24,marginTop:45}}>
 <Reveal at={605} style={{flex:1}}><Card style={{height:235,padding:30,boxSizing:'border-box'}}><div style={{fontFamily:FONT,color:MUTED,fontSize:23}}>这次考多少</div><div style={{fontFamily:SERIF,fontSize:67,fontWeight:900,color:MUTED,marginTop:30}}>结果</div></Card></Reveal>
 <Reveal at={681} style={{flex:1.15}}><Card style={{height:235,padding:30,boxSizing:'border-box',borderColor:SKY,boxShadow:`0 0 30px ${SKY}22`}}><div style={{fontFamily:FONT,color:SKY,fontSize:23}}>从这次失败里</div><div style={{fontFamily:SERIF,fontSize:53,fontWeight:900,color:INK,marginTop:35}}>能拿走什么？</div></Card></Reveal>
 </div>
 <Reveal at={793}><div style={{fontFamily:SERIF,color:SKY,fontSize:43,fontWeight:900,textAlign:'center',marginTop:40}}>这才决定，下次考多少。</div></Reveal>
 </>;
};

const Pain:React.FC=()=>{
 const f=useCurrentFrame();
 return <><Reveal at={828}><Heading tag="情绪也能用">考砸了，还会兴奋？</Heading></Reveal><div style={{display:'flex',height:290,alignItems:'center',justifyContent:'center',gap:25}}><Reveal at={828}><div style={{fontFamily:SERIF,fontSize:140,fontWeight:900,color:AMBER}}>？</div></Reveal>{f>=890&&<Reveal at={890}><div style={{fontFamily:SERIF,fontSize:61,color:INK,fontWeight:900}}>少数人会</div></Reveal>}</div><Reveal at={913}><Card style={{padding:'25px 32px',borderColor:`${SKY}77`}}><div style={{fontFamily:SERIF,fontSize:41,fontWeight:900,color:INK}}>做不到也正常，<span style={{color:SKY}}>痛苦也能用。</span></div></Card></Reveal></>;
};

const Checklist:React.FC=()=>{
 const items=[{at:977,title:'错在哪',detail:'定位具体错误',color:RED},{at:1025,title:'为什么错',detail:'查清错误原因',color:AMBER},{at:1076,title:'下次怎么识别',detail:'留下识别线索',color:BLUE},{at:1113,title:'何时重做验收',detail:'安排重做检查',color:SKY}];
 return <><Reveal at={977}><Heading tag="留下修改">痛完之后，要留下这四项</Heading></Reveal><div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:22,marginTop:35}}>{items.map((x,i)=><Reveal at={x.at} key={x.title}><Card style={{height:174,padding:25,boxSizing:'border-box',borderColor:`${x.color}88`}}><div style={{display:'flex',alignItems:'center',gap:17}}><span style={{fontFamily:FONT,color:x.color,fontWeight:900,fontSize:22}}>0{i+1}</span><span style={{fontFamily:SERIF,color:INK,fontWeight:900,fontSize:34}}>{x.title}</span></div><div style={{fontFamily:FONT,color:MUTED,fontSize:22,marginTop:26}}>{x.detail}</div></Card></Reveal>)}</div></>;
};

const Formula:React.FC=()=>{
 const f=useCurrentFrame();
 return <><Reveal at={1150}><Heading tag="把失败用起来">反馈 + 反思，才会变成进步</Heading></Reveal><div style={{display:'flex',gap:18,alignItems:'center',marginTop:55}}>{[{at:1150,title:'失败反馈',color:BLUE},{at:1172,title:'反思',color:AMBER},{at:1200,title:'进步',color:SKY}].map((x,i)=><React.Fragment key={x.title}>{i>0&&<Reveal at={x.at}><span style={{fontSize:42,color:MUTED}}>{i===1?'+':'→'}</span></Reveal>}<Reveal at={x.at} style={{flex:1}}><Card style={{height:180,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:SERIF,fontWeight:900,fontSize:43,color:x.color,borderColor:`${x.color}88`}}>{x.title}</Card></Reveal></React.Fragment>)}</div>{f>=1242&&<Reveal at={1242}><div style={{fontFamily:FONT,fontSize:29,color:RED,textAlign:'center',marginTop:42}}>只有痛苦 → 逃避，或重犯</div></Reveal>}</>;
};

const Banter:React.FC=()=>{
 const f=useCurrentFrame();
 const at=f<1393?1309:f<1415?1393:f<1466?1415:f<1485?1466:f<1540?1485:1540;
 const title=f<1393?'这次只是发挥不好……':f<1415?'嗯。':f<1466?'你“嗯”什么？':f<1485?'没什么。':f<1540?'不是急着听第三种吗？':'……讲吧。';
 const student=f<1393||(f>=1415&&f<1466)||f>=1540;
 return <><div style={{fontFamily:FONT,fontSize:22,color:MUTED,letterSpacing:4}}>失败复盘 · 让错误留下修改</div><Reveal at={at}><div style={{height:410,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:SERIF,fontSize:f>=1485&&f<1540?61:72,fontWeight:900,color:student?AMBER:INK,textAlign:'center'}}>{title}</div></Reveal></>;
};

const effects=[
 {at:6,file:'piano-low.wav',volume:.14},{at:6,file:'title-chime.wav',volume:.10},{at:66,file:'title-pluck.wav',volume:.12},
 ...[142,154,166].map(at=>({at,file:'soft-click.wav',volume:.11})),
 {at:215,file:'pizzicato.wav',volume:.15},
 ...[306,345,388].map((at,i)=>({at,file:['marimba-f.wav','marimba-ab.wav','marimba-c.wav'][i],volume:.12})),
 {at:449,file:'woodblock.wav',volume:.16},{at:500,file:'pizzicato.wav',volume:.13},
 {at:579,file:'title-air.wav',volume:.10},{at:605,file:'title-pluck.wav',volume:.12},{at:681,file:'harp-rise.wav',volume:.13},{at:793,file:'bell.wav',volume:.12},
 {at:828,file:'pizzicato.wav',volume:.14},{at:890,file:'woodblock.wav',volume:.10},{at:913,file:'title-pluck.wav',volume:.11},
 ...[977,1025,1076,1113].map((at,i)=>({at,file:['marimba-f.wav','marimba-ab.wav','marimba-c.wav','marimba-eb.wav'][i],volume:.13})),
 ...[1150,1172,1200].map((at,i)=>({at,file:i===2?'bell.wav':'soft-click.wav',volume:i===2?.12:.10})),
 {at:1242,file:'woodblock.wav',volume:.11},
 ...[1309,1393,1415,1466,1485,1540].map(at=>({at,file:'pizzicato.wav',volume:at===1393||at===1466?.09:.12})),
];

export const TopStudentPartThree:React.FC=()=>{
 const f=useCurrentFrame();
 const active=[...captions].reverse().find(x=>f>=x.start)?.speaker??'teacher';
 const talking=captions.some(x=>f>=x.start&&f<x.end);
 return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 32%,#15304c 0%,#081522 48%,#040a12 100%)',overflow:'hidden'}}>
  <Audio src={staticFile('top-student/source/full-dialogue-sync.wav')} trimBefore={PART_THREE_START} trimAfter={PART_THREE_START+PART_THREE_DURATION} volume={.70}/>
  <Audio src={staticFile('top-student/source/music.mp3')} trimBefore={PART_THREE_START} volume={(talking?.065:.10)*1.15}/>
  {effects.map((x,i)=><Sequence key={i} from={x.at}><Audio src={staticFile(`top-student/sfx/${x.file}`)} volume={x.volume}/></Sequence>)}
  <div style={{position:'absolute',inset:0,opacity:.16,backgroundImage:'linear-gradient(#6b89a522 1px,transparent 1px),linear-gradient(90deg,#6b89a522 1px,transparent 1px)',backgroundSize:'54px 54px'}}/>
  <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,#02060ddd 0%,transparent 25%,transparent 75%,#02060ddd 100%)'}}/>
  <CharacterLayer active={active}/><Header chapter={2}/>
  <div style={{position:'absolute',left:420,top:125,width:1080,height:635}}>
   {f<215?<Chapter/>:f<579?<Effort/>:f<828?<Standard/>:f<977?<Pain/>:f<1150?<Checklist/>:f<1309?<Formula/>:<Banter/>}
  </div>
  <Caption captions={captions}/>
 </AbsoluteFill>;
};
