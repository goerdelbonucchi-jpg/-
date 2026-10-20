from pathlib import Path
import json
START=220.9
rows=[
('teacher',221.060438,222.058583,'先练出一种本事。'),
('teacher',222.222104,225.559750,'集中优势兵力，伤十指不如断一指，主攻一科。'),
('student',226.136604,227.370042,'为什么一定要先攻一科？'),
('teacher',228.038854,230.857187,'你本来就有一半精力耗在内耗、'),
('teacher',231.019604,233.234333,'手机、家长、老师和作业上，'),
('teacher',233.679792,235.567771,'剩下的一半再切给六科，每科都只够摸一下。'),
('teacher',235.681833,236.252104,'精力越少，越要集中。'),
('student',237.134375,238.539479,'可一科也有那么多内容。'),
('teacher',239.002333,240.336000,'那就再切到一个题型。'),
('teacher',240.336000,242.371271,'比如三角函数选填总丢分，'),
('teacher',242.484187,243.462812,'这周只解决它：查清卡点，'),
('teacher',243.713937,246.548521,'补对应讲解，练到能独立做对。'),
('student',247.089354,248.807792,'这不就练上目标拆解思维了吗？'),
('teacher',249.730979,252.099687,'对。错了就复盘，不会就主动找资源，'),
('teacher',252.341167,253.751187,'最后把相关知识串起来。'),
('teacher',253.986979,256.368938,'主攻一科，能把四种思维一起练出来。'),
('student',256.742979,258.450000,'可我以前也认真学过一阵，'),
('student',258.450000,260.260792,'分数没涨，就觉得自己白忙了。'),
('teacher',261.158187,263.083417,'先看同类题能不能独立做对。'),
('teacher',263.183854,265.143729,'总分会滞后，能力不会撒谎。'),
]
def stamp(t):
 n=round(t*1000);return f'{n//3600000:02}:{n//60000%60:02}:{n//1000%60:02},{n%1000:03}'
for local,name in [(True,'sixth-captions.srt'),(False,'sixth-master-time.srt')]:
 Path('subtitles/'+name).write_text('\n\n'.join(f'{i+1}\n{stamp(a-START if local else a)} --> {stamp(b-START if local else b)}\n{t}' for i,(_,a,b,t) in enumerate(rows))+'\n')
terms=['一种本事','主攻一科','六科','集中','一个题型','三角函数','卡点','独立做对','复盘','资源','串起来','四种思维','总分会滞后','能力不会撒谎']
items=[dict(speaker=w,start=round(a*30)-6627,end=round(b*30)-6627,text=t,emphasis=[x for x in terms if x in t]) for w,a,b,t in rows]
for i,x in enumerate(items):
 assert 0<=x['start']<x['end']<=1332
 if i:assert items[i-1]['end']<=x['start']
Path('src/sixth-captions.ts').write_text('export default '+json.dumps(items,ensure_ascii=False,indent=2)+';\n')
print([(x['start'],x['text']) for x in items])
