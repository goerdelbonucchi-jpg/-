from pathlib import Path
import json
START=131.4
rows=[
('teacher',131.473521,133.165000,'第三种，主动攻击思维。'),
('teacher',133.165000,135.163292,'发现缺什么，就追着解决什么。'),
('student',135.591813,137.378229,'找网课、问老师？这个我也……'),
('teacher',137.882771,138.270771,'又有？'),
('student',138.967625,140.422438,'我先不认，你说完再讲。'),
('teacher',140.659979,142.647000,'学聪明了。比如物理实验总丢分，'),
('teacher',142.647000,145.042000,'他先查清是仪器原理、操作步骤，'),
('teacher',145.042000,147.465000,'还是数据处理，再找对应的讲解。'),
('teacher',147.465000,150.105333,'听完当场拿题验收，问题没消失，就继续换办法。'),
('student',150.566896,151.878687,'他怎么知道哪种资源最好？'),
('teacher',152.431000,154.158146,'谁能解决问题，谁就最好。'),
('student',154.698375,156.675771,'学校还没讲到，也要自己先补？'),
('teacher',156.859958,159.350167,'漏洞都写在你卷子上了，还等学校通知？'),
('student',160.051521,162.180500,'那这种人以后没人管，也能自己学。'),
('teacher',162.660583,164.683000,'所以他们上了大学更占便宜。'),
('teacher',164.683000,167.606875,'别人还在等人指路，他已经开始给自己找路了。'),
('student',168.486562,168.941937,'第四种呢？'),
]
def stamp(t):
 n=round(t*1000);return f'{n//3600000:02}:{n//60000%60:02}:{n//1000%60:02},{n%1000:03}'
for local,name in [(True,'fourth-captions.srt'),(False,'fourth-master-time.srt')]:
 Path('subtitles/'+name).write_text('\n\n'.join(f'{i+1}\n{stamp(a-START if local else a)} --> {stamp(b-START if local else b)}\n{text}' for i,(_,a,b,text) in enumerate(rows))+'\n')
terms=['主动攻击','缺什么','解决什么','物理实验','仪器原理','操作步骤','数据处理','对应','当场','验收','换办法','解决问题','最好','先补','漏洞','自己学','更占便宜','等人指路','给自己找路','第四种']
items=[dict(speaker=w,start=round(a*30)-3942,end=round(b*30)-3942,text=t,emphasis=[x for x in terms if x in t]) for w,a,b,t in rows]
for i,x in enumerate(items):
 assert 0<=x['start']<x['end']<=1146
 if i:assert items[i-1]['end']<=x['start']
Path('src/fourth-captions.ts').write_text('export default '+json.dumps(items,ensure_ascii=False,indent=2)+';\n')
print('17 non-overlapping captions validated. Master 131.4–169.6s; fourth segment 38.2s.')
print([(x['start'],x['text']) for x in items])
