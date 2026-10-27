#可换书 3D 互动小说模板

副题：一封迟了十四年的信

完全静态、零构建（不用 npm / webpack）的 Three.js 第一人称互动小说。引擎与剧本分离：**一本书 = 一个 `stories/<名字>/story.js`**，换书只改文案和数据，不碰引擎。

## 在线玩

GitHub Pages（从仓库根目录发布）：

- 默认书（基督山，五幕）：`https://huaxialucaicaizi.github.io/monte-cristo-unsent/`
- 指定书：`https://huaxialucaicaizi.github.io/monte-cristo-unsent/?story=monte-cristo`
- 傲慢与偏见（精简两幕）：`…/?story=pride-and-prejudice`
- 红楼梦（七幕导读，按原著关键剧情）：`…/?story=dream-of-red-chamber`
- 空书骨架（一幕）：`…/?story=_skeleton`

## 目录

```
index.html                       UI 壳；按 ?story=<slug> 载入剧本，再载入引擎
js/
  three.min.js                   Three.js r160（本地文件，不连外网）
  engine.js                      纯引擎：走动 / 点选 / 蜡封 / 删改词 / 幕切换 / 目录
stories/
  monte-cristo/story.js          《基督山：未寄出的复仇》完整五幕（默认书）
  pride-and-prejudice/story.js   《傲慢与偏见：一封迟到的信》两幕示例（虚构改编）
  dream-of-red-chamber/story.js  《红楼梦：七幕导读》七幕示例（虚构改编，无蜡封信）
  _skeleton/story.js             空书骨架：一幕占位 + 全部字段注释
LICENSE  .nojekyll
```

## 换书 5 步（不需要会编程）

1. 复制文件夹 `stories/_skeleton`，改名为你的书名代号，例如 `stories/my-book`（只用英文字母、数字、`-`、`_`）。
2. 用任意文本编辑器打开 `stories/my-book/story.js`，把书名、每幕的标题和正文、选项文字换成你的内容。只改引号里的字，别删逗号和括号。
3. 想加一幕，就把 `acts` 里的一整段 `{id:…}` 复制一份，粘在后面，再改 `id` 和文案。
4. 把结局目录 `catalog.template` 里的文字改成你的书。`{choice0}`、`{choice1}` 会自动换成读者在每幕的选择。
5. 本地起服务（见下方），浏览器打开 `http://localhost:8000/?story=my-book` 试玩，没问题再提交到 GitHub。

## story.js 必填字段

剧本文件只需设置一个全局变量 `window.__STORY__ = {…}`。完整注释见 `stories/_skeleton/story.js`。

| 字段 | 说明 |
| --- | --- |
| `title` | 书名 |
| `acts[]` | 幕列表，按顺序播放 |
| `acts[].id` | 幕代号（选项可用 `next` 跳转） |
| `acts[].hud` | 左上角小字 |
| `acts[].room` | 房间 `{wall, floor, w, d, spawn}` |
| `acts[].props[]` | 物件（`box` / `candle` / `text` / `plane` / `cylinder` / `ico` / `spot`），可点的写 `id` |
| `acts[].interaction` | 交互：`type` + `target`（物件 id）+ `label` + 文案 + `options` |
| `catalog.template` | 结局目录模板 |

交互类型：

- `letter-seal`：点蜡封 N 次，出现信文，再给选项。
- `diary`：先选一句痛句（存为 `{pain}`），再给选项。
- `map` / `name` / `gazette` / `choice`：直接给选项。
- `dead-letter`：选项结束后进入目录。

选项可附加三种特效：

- `toggle`：双名或双读法切换。
- `wall`：在墙上贴词，读者逐个点掉。
- `lock`：二次蜡封确认。

选项上的 `record` 会记进目录，`route` 用来切换路线；当 `route` 等于 `darkRoute` 时，弹窗变为墨黑主题。

## 本地运行

**推荐起一个本地静态服务器。** 页面会按网址动态插入剧本脚本，部分浏览器在 `file://` 下对动态 script 不稳定。

```bash
cd monte-cristo-unsent
python3 -m http.server 8000
# 打开 http://localhost:8000/  或  http://localhost:8000/?story=_skeleton
```

手机：电脑和手机连同一个 Wi-Fi，用手机浏览器打开 `http://<电脑局域网 IP>:8000/`。

## GitHub Pages

仓库 Settings → Pages → Source 选 `main` 分支 `/ (root)`。`.nojekyll` 用于确保 `_skeleton` 这类以下划线开头的文件夹也会被发布。合并到 `main` 后约一分钟生效。

## 操作

- 电脑：WASD / 方向键走动；点击画面锁定鼠标视角（Esc 解锁），不支持时按住拖拽；靠近发光物按 E 或点击。
- 手机：左下摇杆走动，屏幕其他处拖拽看方向；轻点远处物件会自动走近，近处轻点直接查看。

## 默认书·五幕

1. 马赛夜室：点蜡封 3 次拆信，然后选择对质 / 装作不知 / 交给第三人。
2. 伊夫堡牢房：在空白日记里三选一写下痛句，再选共笔越狱或裹尸袋出逃。
3. 宝藏室：看羊皮地图，选伯爵 / 唐泰斯 / 双名（双名可切换读法）。
4. 巴黎书房：读号外，选揭露 / 拆人生 / 和解；选和解会进入删改馆，要点掉墙上的「恨 报仇 毁掉 血债」。
5. 死信柜室：信首回响你写下的痛句，选寄出或锁柜（锁柜要再点蜡封确认），最后生成可复制的版本目录。

复仇路线的弹窗为墨黑，和解路线为羊皮暖光。

## 红楼梦·七幕导读（`?story=dream-of-red-chamber`）

据原著关键剧情虚构改编，几乎不写信、不用蜡封。分支只改立场与文风，悲剧终局不变。

1. 荣国府·进府（`name` + `toggle`）：唤通灵玉为「宝玉」或「顽石」，再在两种读法间切换。
2. 梨香院（`choice`）：金玉良缘（`route:'jinyu'`，墨黑冷调）或木石前盟（`route:'mushi'`，暖泪调）。
3. 大观园·共读（`diary`，`painKey:'heart'`）：三选一一句心迹，存为 `{heart}`，再选藏书入袖 / 埋书花下。
4. 花冢·葬花（选项带 `wall`）：点掉墙上「花谢 飘零 葬花 泪」。
5. 抄检大观园（`choice`）：`room` / `props` 为 `function(S)`，金玉路线雾更冷、烛更暗；选项 `set.frost` 影响下一幕。
6. 潇湘馆·焚稿（`choice`）：焚稿或留稿；园子散得越深，烛越暗。
7. 雪夜·出家意（`dead-letter`）：信首回响 `{heart}`，收束进版本目录。

每幕有黑场题记（`fade`）、墙上章名（`text` 物件）和一个发光可点的主物件。

## 作者

华夏路菜菜子：前大厂 AI 产品增长，现 AI 创业者

## License

MIT
