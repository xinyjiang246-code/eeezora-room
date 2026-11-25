# eeeZora — 一间会生长的房间

> **Status: Work in Progress · 仍在进行中**
>
> An unfinished prototype. The room and its seven objects work end to end, but some content is still draft and things may change without notice.
>
> 一个仍在开发中的原型。房间本体与七个物件的主链路可用，但部分内容仍是草稿，随时可能改动。

2.5D 沉浸式个人网站。访客从屋外推门进入一间卧室兼工作台，点击场景里的物件打开对应内容。

🔗 **在线预览**：https://xinyjiang246-code.github.io/eeezora-room/

## 直接查看（最简单）

**双击 `eeeZora-双击打开.html`** 即可在浏览器打开，完全离线可用——所有图片和字体都已内联在这一个文件里，不需要服务器、不需要联网。

> 不要双击根目录的 `index.html`，那是 Vite 源码入口，必须用开发服务器或构建后才能正常显示。

## 本地开发

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm run build    # 构建到 dist/
```

部署时把 `dist/` 作为静态站点发布（`base: './'` 已配置，可放任意子路径）。

## 修改后重新生成双击版

单文件是从 `dist/` 自动打包的。改完 `src/` 后：

```bash
npm run build
python3 build-standalone.py
```

脚本会把 JS/CSS/图片/字体全部内联。字体缓存放在 `字体缓存/`（首次运行时会自动下载，**仓库里没有**，因为它只是 woff2 缓存）。

## 目录结构

```
src/
  content/
    types.ts        内容数据结构
    site-copy.ts    站点文案、招聘模式四个视角
    objects.ts      7 个物件的位置、状态、内容  ← 日常主要改这里
  components/       场景、纸页、招聘模式、水钻字标
  hooks/            语言状态、减少动效
  styles.css        全部视觉与动效参数
public/assets/      压缩后的 WebP 素材
```

`dist/` 是构建产物，不提交（由 `npm run build` 生成）；GitHub Pages 用的是 `gh-pages` 分支。

## 技术栈

React 19 · TypeScript · Vite 7 · three.js · GSAP · framer-motion

## 常见修改

**改文字/项目内容**：编辑 `src/content/objects.ts` 里对应物件的 `content.items`。每条内容的 `title` / `summary` 都是 `{ en, zh }` 双份，中英各自独立，不是机器翻译。

**改物件位置**：同文件的 `hotspot: { x, y, w, h }`，百分比坐标，相对 1536×864 的房间底图。

**改物件状态**：

- `open` 正常打开完整纸页
- `draft` 打开「正在实验」短页
- `locked` 显示「这里还在慢慢长出来」纸条
- `private` 不出现在公开站点

**改水钻字标文字**：`src/App.tsx` 与 `Atmosphere.tsx` 里的 `brand` 来自 `site-copy.ts`。

## 说明

`素材原图/`（AI 生成的原始 PNG）与 `候选物件/`（个人物品照片）为本地素材，**未包含在仓库内**——它们只用于生成 `public/assets/` 里的压缩 WebP，站点运行不依赖它们。

## 其他原型

根目录还留着几个同一阶段的探索件：`3D小样-双击打开.html`、`demo3d.html`、`场景原型.html`、`卷宗小样.html`、`排版编辑器.html`。
