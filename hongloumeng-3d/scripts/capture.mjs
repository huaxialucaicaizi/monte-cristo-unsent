import { chromium } from "playwright-core";
import { execFileSync, spawn } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const artifacts = "/opt/cursor/artifacts";
const frames = "/tmp/red-chamber-screencast";
await mkdir(artifacts, { recursive: true });
await rm(frames, { recursive: true, force: true });
await mkdir(frames, { recursive: true });

const server = spawn("python3", ["-m", "http.server", "8030", "--directory", "dist"], { cwd: root, stdio: "ignore" });
await new Promise((resolve) => setTimeout(resolve, 500));
const browser = await chromium.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const context = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
const page = await context.newPage();
await page.goto("http://127.0.0.1:8030/index.html");
await page.waitForFunction(() => window.__GAME__);
await page.screenshot({ path: path.join(artifacts, "红楼梦3D-最终版首屏.png") });

await page.click("#go");
await page.waitForTimeout(1700);
await page.screenshot({ path: path.join(artifacts, "红楼梦3D-第一幕-进府见通灵玉.png") });
await page.evaluate(() => window.__GAME__.hotspots()[0].userData.fn());
await page.locator("#panel .opt").first().click();
await page.waitForTimeout(1700);
await page.screenshot({ path: path.join(artifacts, "红楼梦3D-第二幕-黛玉葬花.png") });
await page.evaluate(() => window.__GAME__.hotspots()[0].userData.fn());
await page.locator("#panel .opt").first().click();
await page.waitForTimeout(1700);
await page.screenshot({ path: path.join(artifacts, "红楼梦3D-第三幕-雪夜出家.png") });
await page.evaluate(() => window.__GAME__.hotspots()[0].userData.fn());
await page.locator("#panel .opt").first().click();
await page.waitForSelector("#result-card");
const cardData = await page.getAttribute("#result-card", "src");
await writeFile(path.join(artifacts, "红楼梦3D-结局卡-1080x1440.png"), Buffer.from(cardData.split(",")[1], "base64"));

const before = (await readFile(path.join(artifacts, "红楼梦3D-改造前原版.png"))).toString("base64");
const after = (await readFile(path.join(artifacts, "红楼梦3D-最终版首屏.png"))).toString("base64");
const compare = await context.newPage();
await compare.setViewportSize({ width: 750, height: 872 });
await compare.setContent(`<style>
body{margin:0;background:#180d09;color:#f4ecdf;font-family:serif}
h1{text-align:center;font-size:26px;margin:12px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:0}
figure{margin:0;text-align:center}figcaption{height:35px;font-size:18px}img{width:375px;height:812px;object-fit:cover}
</style><h1>《红楼梦》3D 互动小说 · 改造前后</h1><div class="grid">
<figure><figcaption>改造前 · 七幕导读</figcaption><img src="data:image/png;base64,${before}"></figure>
<figure><figcaption>最终版 · 三分钟小工具</figcaption><img src="data:image/png;base64,${after}"></figure></div>`);
await compare.screenshot({ path: path.join(artifacts, "红楼梦3D-前后对比.png"), fullPage: true });
await compare.close();

const videoPage = await context.newPage();
const cdp = await context.newCDPSession(videoPage);
let frame = 0;
cdp.on("Page.screencastFrame", async (event) => {
  frame += 1;
  await writeFile(path.join(frames, `frame-${String(frame).padStart(6, "0")}.jpg`), Buffer.from(event.data, "base64"));
  await cdp.send("Page.screencastFrameAck", { sessionId: event.sessionId });
});
await cdp.send("Page.startScreencast", { format: "jpeg", quality: 82, maxWidth: 375, maxHeight: 812, everyNthFrame: 1 });
await videoPage.goto("http://127.0.0.1:8030/index.html");
await videoPage.waitForFunction(() => window.__GAME__);
await videoPage.waitForTimeout(3000);
await videoPage.click("#go");
await videoPage.waitForTimeout(3500);
for (let act = 0; act < 3; act += 1) {
  await videoPage.evaluate(() => window.__GAME__.hotspots()[0].userData.fn());
  await videoPage.waitForTimeout(4000);
  await videoPage.locator("#panel .opt").first().click();
  await videoPage.waitForTimeout(act === 2 ? 6000 : 3500);
}
await cdp.send("Page.stopScreencast");
await videoPage.close();
if (frame < 30) throw new Error(`录屏帧数不足：${frame}`);
execFileSync("ffmpeg", [
  "-y", "-loglevel", "error", "-framerate", "30", "-i", path.join(frames, "frame-%06d.jpg"),
  "-vf", "scale=886:1920:flags=lanczos,pad=1080:1920:97:0:color=black",
  "-c:v", "libx264", "-preset", "medium", "-crf", "24", "-pix_fmt", "yuv420p",
  path.join(artifacts, "红楼梦3D-最终版试玩录屏-竖屏1080p.mp4"),
]);

await browser.close();
server.kill("SIGTERM");
console.log(JSON.stringify({ screenshots: 7, videoFrames: frame, artifacts }, null, 2));
