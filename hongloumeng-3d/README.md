# 《红楼梦》3D 互动小说 · 小红书小工具

独立小工具包。主线约 1–3 分钟：进府见通灵玉 → 黛玉葬花 → 雪夜出家，每幕作一个二选一选择，最终得到 8 种版本标题之一和一张 1080×1440 结局卡。

## 构建与验证

```bash
npm ci
npm run build
npm run check
```

- 上传包：`release/dist.zip`
- 解压产物：`dist/`（不提交）
- 替换整份文案：只编辑 `copy.json`，重新运行 `npm run build`
- 制作素材：由 `npm run capture` 输出到 `/opt/cursor/artifacts/`，不写入仓库

构建会把 four 个运行脚本转译到 ES2017，并检查脚本顺序、单一 HTML、内联脚本、行内事件、查询参数依赖、文件白名单、包体、外部 URL、联网 API、`?.`、`??`、类字段、`eval` 和 `new Function`。

## 玩法

首屏点「走进荣国府」。手机左下摇杆移动，右侧拖动视角，也可点发光物自动走近；桌面端使用 WASD/方向键和 E。首次进入会显示 1 秒摇杆手势提示。

长按首屏书名 1.2 秒会显示隐藏的七幕完整版入口；默认流程始终是三幕。

## 文件结构

```text
index.html
copy.json                              集中式可替换文案
css/app.css
js/three.min.js                        Three.js r160，本地文件
js/engine.js                           3D、选择、结局卡和 postNote
js/boot.js                             启动、Storage 兼容层、隐藏入口
stories/dream-of-red-chamber/story.js  场景数据；构建时注入 copy.json
scripts/build.mjs                      ES2017 构建、静态检查、dist.zip
scripts/check.mjs                      无头浏览器端到端验证
scripts/capture.mjs                    截图与竖屏录屏
release/dist.zip                       可直接上传的包
```

运行脚本固定按以下顺序加载：

1. `js/three.min.js`
2. `stories/dream-of-red-chamber/story.js`
3. `js/engine.js`
4. `js/boot.js`

## 平台 API

- `window.xhs.miniTool.postNote`：图文笔记，传入 `pageType: "photo_publish"` 和结局卡 PNG data URL；正文包含 `#小红书小工具`。
- `getLaunchOptions`：读取 `miniToolEnv.buildVersion`。
- `setStorage` / `getStorage`：客户端 9.46.0+ 保存摇杆提示状态和最近一次结果，数据使用 JSON 字符串。低版本仅容错降级到 `localStorage`。

不读取或保存用户资料。页面无外部资源、外部链接和实际联网调用；Three.js 的资源加载入口在构建时替换为离线拒绝函数。

## 已知问题

- 云端仅以平台 API mock 验证参数和调用链；`postNote` 必须在小红书 App 真机容器验证发布页。
- 尚未完成 iOS 18.4+、Android 8.1/WebView 61 真机测试和中端安卓 30fps 实测。
- 当前 `copy.json` 是集中式占位文案；第二轮最终文案可整文件替换，不需改引擎。
- 七幕完整版是隐藏入口，保留原版导读文案；正式发布前由接手方决定是否继续保留。

## Rui 真机测试

在 Builder Hub 上传 `release/dist.zip`，iOS 与 Android 各执行一次：

- [ ] 断网启动，3 秒内看到首屏并可点击
- [ ] 无内联脚本，不依赖 `?story=`
- [ ] 摇杆首次出现时播放 1 秒手势，移动和拖动视角正常
- [ ] 三幕均能靠近并点开发光物，每幕恰有一个关键选择
- [ ] 三分钟内到达结局
- [ ] 8 种选择组合分别得到 8 个标题
- [ ] 结局卡为 1080×1440，含书名、三个选择、名句、公版说明和配置署名
- [ ] `postNote` 唤起图文发布页，带结局卡、正文和 `#小红书小工具`
- [ ] 重开后 Storage 不报错；低版本或拒绝时仍可完整游玩
- [ ] Android 中端机实测不低于 30fps
