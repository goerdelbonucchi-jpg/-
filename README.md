# 运气的形状 · Remotion 样片

一支 42 秒、1280×720、30 fps 的黑金色概率科普动画。参考用户提供的视频，重新制作了骰子、标题、历史年份、概率比较、样本曲线和高尔顿板。画面与配乐均由本项目代码生成，字幕可在 `src/video.tsx` 修改。

## 使用

需要 Node.js 20.19+、npm，以及 Chromium。当前云环境已经安装 Chromium。第一次运行：

```bash
npm ci
npm run studio
```

导出视频和封面：

```bash
npm run render
npm run still
```

输出位于 `out/fortune-shape.mp4` 和 `out/poster.png`。音乐由 `scripts/generate-audio.mjs` 生成，`studio` 和 `render` 会自动重新生成。画面依赖 `Noto Serif CJK SC` 和 `Noto Sans CJK SC` 字体；无这些字体时浏览器会回退到系统中文字体。

## 修改

`src/root.tsx` 定义时长、尺寸和帧率。`src/video.tsx` 中的六个场景按时间顺序编排；修改每个场景的字幕、数字、颜色或动画即可调整视频。`scripts/generate-audio.mjs` 中的 `cues` 与场景切点一致。

项目结构参考了 [Remotion 官方 Hello World 模板](https://github.com/remotion-dev/template-helloworld) 的 Composition/入口方式；场景、图形和音乐由本项目独立实现。参考视频中的平台水印没有纳入样片。
