from pathlib import Path
import json
START=40.8
# Sentence boundaries: source SRT mapped to the master by the matched runs;
# speaker changes snap to the master track's silence boundaries.
rows=[
('teacher',40.907823,42.857755,'先算账。复旦在本省要多少分，'),
('teacher',43.266349,44.436,'本校什么排名能上，'),
('teacher',44.436,48.466,'自己哪科最值得提，哪些题必须拿，哪些题可以丢。'),
('teacher',48.466,50.981,'再根据时间、师资、环境和自控力，'),
('teacher',50.981,52.667302,'一路反推到今天该解决什么。'),
('student',53.489751,55.543107,'那学校环境不好、老师又顾不过来呢？'),
('teacher',56.632993,59.038,'找空教室，集中去办公室堵老师，'),
('teacher',59.325556,61.552,'网课太拖就换成能看懂的资料。'),
('teacher',61.760816,63.781406,'目标可以野，路径必须现实。'),
('student',64.261224,66.901542,'可最后算出来，复旦确实来不及了呢？'),
('teacher',67.794444,70.506,'继续走。多考一分就有一分的价值。'),
('teacher',70.506,72.781474,'看清现实，是为了多拿分，不是为了认命。'),
('student',73.128458,74.62966,'听起来比列计划难多了。'),
('teacher',75.347596,76.989546,'怎么了，是有什么疑虑吗？'),
('student',77.533379,78.629728,'没什么。第二种呢？'),
]
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
for local,name in [(True,'second-captions.srt'),(False,'second-master-time.srt')]:
 Path('subtitles/'+name).write_text('\n\n'.join(f'{i+1}\n{stamp(a-START if local else a)} --> {stamp(b-START if local else b)}\n{text}' for i,(_,a,b,text) in enumerate(rows))+'\n')
terms=['复旦','排名','最值得提','必须拿','可以丢','时间','师资','环境','自控力','今天','空教室','办公室','资料','目标可以野','路径必须现实','继续走','一分','看清现实','多拿分','认命','第二种']
items=[dict(speaker=who,start=round(a*30)-1224,end=round(b*30)-1224,text=text,emphasis=[t for t in terms if t in text]) for who,a,b,text in rows]
for i,x in enumerate(items):
 assert 0<=x['start']<x['end']<=1152
 if i:assert items[i-1]['end']<=x['start']
Path('src/second-captions.ts').write_text('export default '+json.dumps(items,ensure_ascii=False,indent=2)+';\n')
print('Built 15 non-overlapping second-part captions; master span 40.8–79.2s.')
