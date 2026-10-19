from pathlib import Path
import json
rows=[
('student',.20415,3.149615,'你能预知哪些学生最有潜力成为顶级学霸吗？'),
('teacher',3.954853,4.69322,'小菜一碟。'),
('teacher',5.031451,7.687,'我做教育这几年，有四种不同特征的学生，'),
('teacher',7.687,10.839,'即便现在成绩很不好，将来必然成为学霸，'),
('teacher',10.839,11.002948,'无一例外。'),
('student',11.704717,13.561723,'这么绝对？快讲，我看看我是哪种！'),
('teacher',14.030998,16.323968,'而且，但凡你占了两个以上，211起步。'),
('student',16.898571,17.411247,'行，快说吧！'),
('teacher',18.133061,19.77,'第一种，目标拆解思维。'),
('teacher',19.77,22.519478,'这种学生最精明，我叫他们“极端现实派”。'),
('student',23.227392,25.643628,'这个我有，我也会把600分拆成每科要考多少。'),
('teacher',26.130612,27.430408,'哦？那你说说看。'),
('student',27.852676,32.360544,'语文120，数学130，英语130，剩下三科……'),
('teacher',32.945011,33.500544,'然后呢？'),
('student',34.209683,34.776735,'还要什么？'),
('teacher',35.121973,37.62551,'你只是把一个大愿望，拆成了六个小愿望。'),
('student',38.562109,40.312154,'那真正会拆目标的人怎么做？'),
]
# The provided teacher SRT places four utterances in cue 4. The first clause
# boundary is not reliable; retain the preceding phrase through the end of the turn.
rows[3]=('teacher',7.687,11.002948,'即便现在成绩很不好，将来必然成为学霸，无一例外。')
del rows[4]
def ts(t):
 m=round(t*1000);return f'{m//3600000:02}:{m//60000%60:02}:{m//1000%60:02},{m%1000:03}'
for labels,name in [(True,'opening-dialogue.srt'),(False,'opening-captions.srt')]:
 Path('subtitles/'+name).write_text('\n\n'.join(f'{i+1}\n{ts(a)} --> {ts(b)}\n'+(('学生：' if who=='student' else '学霸：') if labels else '')+text for i,(who,a,b,text) in enumerate(rows))+'\n',encoding='utf-8')
items=[dict(speaker=who,start=round(a*30),end=round(b*30),text=text,emphasis=[x for x in ['顶级学霸','四种','学霸','无一例外','211','两个以上','目标拆解','极端现实派','600分','120','130','大愿望','小愿望'] if x in text]) for who,a,b,text in rows]
Path('src/opening-captions.ts').write_text('export default '+json.dumps(items,ensure_ascii=False,indent=2)+';\n')
print(f'Wrote {len(items)} opening captions and two SRT files.')
