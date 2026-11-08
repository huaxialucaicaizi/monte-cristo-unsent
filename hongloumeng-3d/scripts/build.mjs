import { transform } from "esbuild";
import { parse } from "acorn";
import OpenCC from "opencc-js";
import { execFileSync } from "node:child_process";
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const release = path.join(root, "release");
const jsFiles = [
  "js/three.min.js",
  "stories/dream-of-red-chamber/story.js",
  "js/engine.js",
  "js/boot.js",
];
const toSimplified = OpenCC.Converter({ from: "tw", to: "cn" });

function normalizeCopy(source, config) {
  const acts = Object.fromEntries(source.acts.map((act) => [act.id, act]));
  const runtimeAct = (id, number, fade) => {
    const act = acts[id];
    return {
      hud: `第${number}幕 · ${act.title}`,
      fade,
      label: act.objectLabel,
      title: act.title,
      sub: "",
      text: `<p>${act.intro}</p>`,
      choices: act.options.map((option) => option.text),
    };
  };
  const endings = source.endings.map((ending) => ({
    combination: ending.combination,
    title: ending.title,
    description: ending.description,
    quote: toSimplified(ending.quote.text),
  }));
  return {
    title: "红楼梦 · 三幕",
    pageTitle: "红楼梦 · 三幕",
    hook: `${source.hook}<br><small>${source.perspective}</small>`,
    startSub: "三幕 · 三个选择 · 三分钟",
    startButton: "走进荣国府",
    act1: runtimeAct("rongguo", "一", "一块石头，落进红尘"),
    act2: { hud: "完整版 · 梨香院", fade: "金锁微响，竹影一摇", label: "錾字金锁", title: "金与木", sub: "", text: "<p>金锁上的字恰与玉上的字成对。你选择怎样读这一段缘分？</p>", choices: ["信金玉良缘", "信木石前盟"] },
    act3: { hud: "完整版 · 大观园共读", fade: "春日 · 沁芳闸下", label: "落花下的书", title: "共读", sub: "", text: "<p>桃花底下，两个人偷读闲书。你要留下哪一种读法？</p>", choices: ["把书藏进袖中", "把书埋回花下"] },
    act4: runtimeAct("flower-tomb", "二", "落花满地，无人收拾"),
    act5: { hud: "完整版 · 抄检大观园", fade: "秋夜 · 灯笼一盏盏亮起", label: "被翻开的箱笼", title: "抄检", sub: "", text: "<p>箱笼被翻开，所有人的私物摊在灯下。</p>", choices: ["挡在箱笼前替她们求情", "默然看着"] },
    act6: { hud: "完整版 · 潇湘馆焚稿", fade: "竹影疏 · 药香冷", label: "一叠诗稿", title: "焚稿", sub: "", text: "<p>她把诗稿一页页递向火盆。</p>", choices: ["让诗稿随旧帕一起成灰", "悄悄留下最后一页"] },
    act7: runtimeAct("snow", "三", "雪落无声 · 石归来处"),
    versionTitles: endings.map((ending) => ending.title),
    endingDescriptions: endings.map((ending) => ending.description),
    quotes: endings.map((ending) => ending.quote),
    combinations: endings.map((ending) => ending.combination),
    attribution: source.credit,
    author: config.author,
    cardLabels: source.acts.map((act) => act.title),
    resultTitle: source.endingCardLabel,
    shareButton: "带结局卡发笔记",
    restartButton: "再走一次",
    noteTitles: source.postNote.titles,
    noteBody: source.postNote.bodyTemplate,
    shareUnavailable: "请在小红书 App 的小工具中发布",
    shareFailed: "发布页暂时无法打开，请稍后再试",
    fullEntry: "进入七幕完整版",
  };
}

await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, "css"), { recursive: true });
await mkdir(path.join(dist, "js"), { recursive: true });
await mkdir(path.join(dist, "stories/dream-of-red-chamber"), { recursive: true });
await mkdir(release, { recursive: true });
await cp(path.join(root, "index.html"), path.join(dist, "index.html"));
await cp(path.join(root, "css/app.css"), path.join(dist, "css/app.css"));

for (const relative of jsFiles) {
  let source = await readFile(path.join(root, relative), "utf8");
  if (relative === "stories/dream-of-red-chamber/story.js") {
    const formalCopy = JSON.parse(await readFile(path.join(root, "copy.json"), "utf8"));
    const config = JSON.parse(await readFile(path.join(root, "config.json"), "utf8"));
    const copy = normalizeCopy(formalCopy, config);
    source = source.replace("__COPY_JSON__", JSON.stringify(copy));
  }
  const result = await transform(source, {
    target: "es2017",
    minifySyntax: true,
    minifyIdentifiers: true,
    minifyWhitespace: false,
    legalComments: "none",
    charset: "utf8",
  });
  let output = result.code;
  if (relative === "js/three.min.js") {
    output = output
      .replace(/document\.createElementNS\("http:\/\/www\.w3\.org\/1999\/xhtml",\s*([^)]+)\)/g, "document.createElement($1)")
      .replace(/console\.warn\('Scripts "build\/three\.js"[^']*'\),\s*/, "")
      .replace(/https?:\/\/[^"' ]+/g, "")
      .replace(/\bfetch\b/g, "offlineResource");
    output = 'var offlineResource=function(){return Promise.reject(new Error("offline resource unavailable"))};\n' + output;
  }
  await writeFile(path.join(dist, relative), output);
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else files.push(absolute);
  }
  return files;
}

const files = await walk(dist);
const allowed = new Set([".html", ".css", ".js", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".woff", ".woff2", ".json"]);
for (const file of files) {
  if (!allowed.has(path.extname(file).toLowerCase())) throw new Error(`非白名单文件：${path.relative(dist, file)}`);
}

const html = await readFile(path.join(dist, "index.html"), "utf8");
const scripts = [...html.matchAll(/<script\s+src="([^"]+)"\s*><\/script>/g)].map((match) => match[1]);
const expected = ["js/three.min.js", "stories/dream-of-red-chamber/story.js", "js/engine.js", "js/boot.js"];
if (JSON.stringify(scripts) !== JSON.stringify(expected)) throw new Error("脚本顺序不符合独立包规范");
if (/<script(?!\s+src=)[^>]*>/i.test(html)) throw new Error("发现内联脚本");
if (/\son\w+\s*=/i.test(html)) throw new Error("发现行内事件");
if (/[?&]story=|location\.search/.test(html)) throw new Error("入口仍依赖 story 查询参数");

let total = 0;
for (const file of files) {
  const info = await stat(file);
  total += info.size;
  if (path.extname(file) !== ".js") continue;
  const code = await readFile(file, "utf8");
  const forbidden = [
    [/\?\./, "可选链 ?."],
    [/\?\?/, "空值合并 ??"],
    [/\beval\s*\(/, "eval"],
    [/\bnew\s+Function\b/, "new Function"],
    [/https?:\/\//i, "外部 URL"],
  ];
  for (const [pattern, label] of forbidden) {
    if (pattern.test(code)) throw new Error(`${path.relative(dist, file)} 含禁用内容：${label}`);
  }
  const ast = parse(code, { ecmaVersion: "latest", sourceType: "script" });
  const nodes = [ast];
  while (nodes.length) {
    const node = nodes.pop();
    if (node && (node.type === "PropertyDefinition" || node.type === "FieldDefinition")) {
      throw new Error(`${path.relative(dist, file)} 含禁用内容：类字段`);
    }
    if (!node || typeof node !== "object") continue;
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) nodes.push(...value);
      else if (value && typeof value === "object" && typeof value.type === "string") nodes.push(value);
    }
  }
  if (/\b(fetch|XMLHttpRequest|WebSocket)\b/.test(code)) {
    throw new Error(`${path.relative(dist, file)} 含联网调用`);
  }
}
if (total >= 5 * 1024 * 1024) throw new Error(`包体超过 5MB：${total} bytes`);

const zipPath = path.join(release, "dist.zip");
await rm(zipPath, { force: true });
execFileSync("zip", ["-q", "-9", "-r", zipPath, "."], { cwd: dist });
const zipSize = (await stat(zipPath)).size;
console.log(JSON.stringify({ target: "es2017", files: files.length, unpackedBytes: total, zipBytes: zipSize, output: "release/dist.zip" }, null, 2));
