from pathlib import Path
import json
START=265.3
rows=[
('student',265.634521,267.991583,'可我每天六科作业都排满了，时间从哪来？'),
('teacher',268.649563,270.140250,'已经会的快速过，'),
('teacher',270.307687,271.609708,'重复听也没有收获的内容压缩。'),
('teacher',271.736958,272.765021,'学校给统一进度，'),
('teacher',272.920375,274.701083,'你得给自己的问题让出时间。'),
('student',275.175625,277.115500,'那我不用等学校统一复习到这里？'),
('teacher',277.601458,278.801167,'你的漏洞已经找到了，今天就可以补。'),
('teacher',279.064083,281.532479,'你真的太缺一次胜利了，你太应该赢一次了。'),
('teacher',281.780625,283.460000,'等你亲手把一科带起来，'),
('teacher',283.460000,285.920000,'再把成功经验复制到其他科目，'),
('teacher',285.920000,287.785500,'你看自己的眼神都会变。'),
('student',289.097146,290.769646,'等会儿，我靠，不对吧！'),
('student',290.949979,293.520375,'你说的这四种思维，普通人可能都只占一点啊。'),
('teacher',294.160417,295.892458,'对啊，所以为什么学霸才这么少？'),
('student',296.614896,298.697042,'那你弯弯绕绕说一大圈，搞什么？'),
('student',299.124771,300.672646,'直接告诉我先练不就完了吗？'),
('teacher',301.240000,302.825812,'我不这样，你有心情听吗？'),
]
def stamp(t):
 n=round(t*1000);return f'{n//3600000:02}:{n//60000%60:02}:{n//1000%60:02},{n%1000:03}'
for local,name in [(True,'seventh-captions.srt'),(False,'seventh-master-time.srt')]:
 Path('subtitles/'+name).write_text('\n\n'.join(f'{i+1}\n{stamp(a-START if local else a)} --> {stamp(b-START if local else b)}\n{t}' for i,(_,a,b,t) in enumerate(rows))+'\n')
terms=['时间','快速过','压缩','今天','胜利','赢一次','成功经验','复制','四种思维','先练','有心情听吗']
items=[dict(speaker=w,start=round(a*30)-7959,end=round(b*30)-7959,text=t,emphasis=[x for x in terms if x in t]) for w,a,b,t in rows]
for i,x in enumerate(items):
 assert 0<=x['start']<x['end']<=1149
 if i:assert items[i-1]['end']<=x['start']
Path('src/seventh-captions.ts').write_text('export default '+json.dumps(items,ensure_ascii=False,indent=2)+';\n')
print([(x['start'],x['text']) for x in items])
