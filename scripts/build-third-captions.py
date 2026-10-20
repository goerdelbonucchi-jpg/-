from pathlib import Path
import json
START=79.2
rows=[
('teacher',79.406780,81.022313,'第二种，失败复盘思维。'),
('teacher',81.383673,83.215193,'做错一道题，都不肯白错。'),
('student',83.940771,85.775986,'这个我肯定有，我错题本都写三本了。'),
('teacher',86.374376,88.798503,'哦？那你上次考砸，复盘出了什么？'),
('student',89.411224,92.129091,'我难受了好几天，然后发誓下次一定认真，'),
('student',92.129091,93.466531,'还多刷了两套卷子。'),
('teacher',94.151497,95.034580,'你这不叫复盘。'),
('student',95.855147,97.520544,'有区别吗？反正我更努力了。'),
('teacher',98.506327,99.099138,'当然有。'),
('teacher',99.376327,101.910000,'真正会复盘的人，先把成功的标准换掉：'),
('teacher',101.910000,105.637000,'这次考多少只是结果，能从这次失败里拿走什么，'),
('teacher',105.637000,106.501451,'才决定下次考多少。'),
('student',106.795556,108.261338,'所以他们考砸了还会兴奋？'),
('teacher',108.883265,109.629000,'少数人会。'),
('teacher',109.629000,111.781000,'做不到也正常，痛苦也能用。'),
('teacher',111.781000,115.083000,'但痛完必须留下修改：错在哪，为什么错，'),
('teacher',115.083000,117.538000,'下次怎么识别，什么时候重做验收。'),
('teacher',117.538000,120.599000,'失败反馈加反思，才会变成进步。'),
('teacher',120.599000,121.781020,'只有痛苦，只会逃避或者重犯。'),
('student',122.834444,125.335556,'我一般会告诉自己，这次只是发挥不好。'),
('teacher',125.646667,125.941905,'嗯。'),
('student',126.380113,127.352971,'你“嗯”什么？'),
('teacher',128.071179,128.502313,'没什么。'),
('teacher',128.703243,130.029887,'你不是急着听第三种吗？'),
('student',130.531950,130.823265,'讲吧。'),
]
def stamp(t):
 n=round(t*1000);return f'{n//3600000:02}:{n//60000%60:02}:{n//1000%60:02},{n%1000:03}'
for local,name in [(True,'third-captions.srt'),(False,'third-master-time.srt')]:
 Path('subtitles/'+name).write_text('\n\n'.join(f'{i+1}\n{stamp(a-START if local else a)} --> {stamp(b-START if local else b)}\n{text}' for i,(_,a,b,text) in enumerate(rows))+'\n')
terms=['失败复盘','不肯白错','三本','复盘','难受','发誓','多刷','成功的标准','结果','拿走什么','修改','错在哪','为什么错','怎么识别','重做验收','失败反馈','反思','进步','逃避','重犯','发挥不好']
items=[dict(speaker=w,start=round(a*30)-2376,end=round(b*30)-2376,text=t,emphasis=[x for x in terms if x in t]) for w,a,b,t in rows]
for i,x in enumerate(items):
 assert 0<=x['start']<x['end']<=1566
 if i:assert items[i-1]['end']<=x['start']
Path('src/third-captions.ts').write_text('export default '+json.dumps(items,ensure_ascii=False,indent=2)+';\n')
print('25 captions validated; master 79.2–131.4 seconds; 52.2-second segment.')
print([(x['start'],x['text']) for x in items])
