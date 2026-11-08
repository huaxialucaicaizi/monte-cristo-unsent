import { transform } from "esbuild";
import { parse } from "acorn";
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
    const copy = JSON.parse(await readFile(path.join(root, "copy.json"), "utf8"));
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
