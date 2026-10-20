from pathlib import Path
import json
START=169.6
rows=[
('teacher',169.660854,171.088000,'第四种，知识网络思维。'),
('teacher',171.088000,173.749771,'学到什么，都喜欢往以前的知识上接。'),
('student',173.967083,175.061292,'这种感觉我偶尔也有。'),
('teacher',175.596208,178.095708,'这次知道加“偶尔”了，谨慎了不少。'),
('student',178.427208,179.355521,'你少调侃我，快说。'),
('teacher',180.252312,182.671000,'学完导数，他会回头看函数的单调性；'),
('teacher',182.671000,185.732000,'学一个历史事件，他会顺着想背景、原因、结果，'),
('teacher',185.732000,187.547125,'再看它怎么影响后面的事。'),
('teacher',187.747479,189.302729,'学到一块，能把前后几块一起带起来。'),
('student',190.382333,194.170937,'所以遇到没见过的题，他也能从学过的东西里找线索？'),
('teacher',195.197417,198.173396,'对。题目换了样子，他还能认出里面熟悉的条件。'),
('teacher',198.503958,202.356500,'知识越多，能调用的线索越多，越往后越省力。'),
('student',202.972333,204.540375,'听着就像越学越聪明。'),
('teacher',205.066771,209.204021,'这种人现在可能还没出头，但给他时间，优势只会越来越大。'),
('teacher',209.435646,211.373437,'四种说完了，认出自己了吗？'),
('teacher',212.596812,213.959438,'怎么了，是有什么疑虑吗？'),
('student',214.373458,217.376563,'没什么。就是刚开始觉得每个都像我，现在感觉……'),
('teacher',218.096937,219.120500,'嗯，你慢慢想。'),
('student',219.437125,220.749917,'要是四种都没有怎么办？'),
]
def stamp(t):
 n=round(t*1000);return f'{n//3600000:02}:{n//60000%60:02}:{n//1000%60:02},{n%1000:03}'
for local,name in [(True,'fifth-captions.srt'),(False,'fifth-master-time.srt')]:
 Path('subtitles/'+name).write_text('\n\n'.join(f'{i+1}\n{stamp(a-START if local else a)} --> {stamp(b-START if local else b)}\n{text}' for i,(_,a,b,text) in enumerate(rows))+'\n')
terms=['知识网络','偶尔','导数','单调性','背景','原因','结果','影响','前后','线索','熟悉的条件','越往后越省力','越来越大','四种','都没有']
items=[dict(speaker=w,start=round(a*30)-5088,end=round(b*30)-5088,text=t,emphasis=[x for x in terms if x in t]) for w,a,b,t in rows]
for i,x in enumerate(items):
 assert 0<=x['start']<x['end']<=1539
 if i:assert items[i-1]['end']<=x['start']
Path('src/fifth-captions.ts').write_text('export default '+json.dumps(items,ensure_ascii=False,indent=2)+';\n')
print('19 chronological, non-overlapping captions; master 169.6–220.9s; duration 51.3s.')
print([(x['start'],x['text']) for x in items])
