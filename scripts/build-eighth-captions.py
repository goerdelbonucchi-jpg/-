from pathlib import Path
import json
START=303.6
rows=[
('teacher',304.282625,306.360000,'现在网上全是多巴胺视频，'),
('teacher',306.360000,308.234771,'把你的注意力都碾碎了。'),
('teacher',308.417062,309.419542,'学习视频你能听进去多少？'),
('teacher',309.533833,311.254000,'一上来告诉你拆目标、做复盘，'),
('teacher',311.440375,312.308354,'你早就划走了。'),
('student',312.568792,314.408333,'所以你故意让我猜，自己是哪一种？'),
('teacher',315.079479,316.850000,'我想在这片充满焦虑的地方，'),
('teacher',316.850000,318.950000,'给你种下一颗名为“希望”的种子。'),
('teacher',318.950000,320.809833,'我以前也和你一样，是个普通学生。'),
('student',321.663604,322.646583,'那你怎么考上浙大的？'),
('teacher',322.972000,323.600771,'先赢一次。'),
('teacher',323.732271,325.023812,'这四种思维是能练的，'),
('teacher',325.245396,326.212021,'不是与生俱来的。'),
('student',327.088188,329.078188,'好，那我突然想看看你口中'),
('student',329.229021,331.107917,'那些能力挽狂澜的学生，是什么样。'),
('teacher',331.726937,332.864500,'去我置顶视频看看，'),
('teacher',333.043854,333.948375,'希望对你有帮助。'),
('student',334.339583,334.734375,'谢谢你。'),
]
def stamp(t):
 n=round(t*1000);return f'{n//3600000:02}:{n//60000%60:02}:{n//1000%60:02},{n%1000:03}'
for local,name in [(True,'eighth-captions.srt'),(False,'eighth-master-time.srt')]:
 Path('subtitles/'+name).write_text('\n\n'.join(f'{i+1}\n{stamp(a-START if local else a)} --> {stamp(b-START if local else b)}\n{t}' for i,(_,a,b,t) in enumerate(rows))+'\n')
terms=['注意力','拆目标','复盘','希望','普通学生','先赢一次','能练的','不是与生俱来','置顶视频','谢谢']
items=[dict(speaker=w,start=round(a*30)-9108,end=round(b*30)-9108,text=t,emphasis=[x for x in terms if x in t]) for w,a,b,t in rows]
for i,x in enumerate(items):
 assert 0<=x['start']<x['end']<=972
 if i:assert items[i-1]['end']<=x['start']
Path('src/eighth-captions.ts').write_text('export default '+json.dumps(items,ensure_ascii=False,indent=2)+';\n')
print([(x['start'],x['text']) for x in items])
