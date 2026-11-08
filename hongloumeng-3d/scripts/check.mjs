import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import { once } from "node:events";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const server = spawn("python3", ["-m", "http.server", "8020", "--directory", "dist"], {
  cwd: root,
  stdio: "ignore",
});
await new Promise((resolve) => setTimeout(resolve, 500));

const browser = await chromium.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const context = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true });
await context.addInitScript(() => {
  window.__PLATFORM_CALLS__ = { storage: [], postNote: [] };
  window.xhs = {
    launchOptions: { miniToolEnv: { buildVersion: 9460000 } },
    miniTool: {
      getStorage: async (input) => {
        window.__PLATFORM_CALLS__.storage.push(["getStorage", input]);
        return { data: null };
      },
      setStorage: async (input) => {
        window.__PLATFORM_CALLS__.storage.push(["setStorage", input]);
        return { errMsg: "setStorage:ok" };
      },
      postNote: async (input) => {
        window.__PLATFORM_CALLS__.postNote.push(input);
        return { errMsg: "postNote:ok" };
      },
    },
  };
});
const page = await context.newPage();
const issues = [];
page.on("console", (message) => {
  if (message.type() === "error" || message.type() === "warning") issues.push(`${message.type()}: ${message.text()}`);
});
page.on("pageerror", (error) => issues.push(`pageerror: ${error.message}`));
page.on("request", (request) => {
  const url = new URL(request.url());
  if (url.hostname !== "127.0.0.1") issues.push(`external request: ${request.url()}`);
});

const started = Date.now();
await page.goto("http://127.0.0.1:8020/index.html", { waitUntil: "load" });
await page.waitForFunction(() => window.__GAME__ && document.querySelector("#go:not([hidden])"));
const interactiveMs = Date.now() - started;
if (interactiveMs >= 3000) issues.push(`interactive time ${interactiveMs}ms >= 3000ms`);

const initial = await page.evaluate(() => ({
  acts: window.__GAME__.story.acts.length,
  fullActs: window.__GAME__.story.fullActs.length,
  title: document.getElementById("st-title").textContent,
  scripts: Array.from(document.scripts).map((script) => script.getAttribute("src")),
}));
if (initial.acts !== 3 || initial.fullActs !== 7) issues.push("story does not expose 3-act and hidden 7-act modes");
if (initial.scripts.join("|") !== "js/three.min.js|stories/dream-of-red-chamber/story.js|js/engine.js|js/boot.js") issues.push("script order mismatch");

await page.click("#go");
await page.waitForTimeout(1700);
for (let act = 0; act < 3; act += 1) {
  await page.evaluate(() => window.__GAME__.hotspots()[0].userData.fn());
  await page.waitForSelector("#panel .opt");
  await page.locator("#panel .opt").first().click();
  if (act < 2) await page.waitForTimeout(1700);
}
await page.waitForSelector("#result-card");
const card = await page.evaluate(() => {
  const generated = window.__GAME__.resultCard();
  return { width: generated.canvas.width, height: generated.canvas.height, title: generated.title };
});
if (card.width !== 1080 || card.height !== 1440) issues.push("result card is not 1080x1440");

const titles = await page.evaluate(() => {
  const result = [];
  for (let index = 0; index < 8; index += 1) {
    window.__GAME__.state.versionBits = [(index >> 2) & 1, (index >> 1) & 1, index & 1];
    result.push(window.__GAME__.resultCard().title);
  }
  return result;
});
if (new Set(titles).size !== 8) issues.push("the 8 choice combinations do not map to 8 unique titles");
const copyData = await page.evaluate(() => ({
  combinations: window.__GAME__.story.copy.combinations,
  quotes: window.__GAME__.story.copy.quotes,
}));
const expectedCombinations = ["AAA", "AAB", "ABA", "ABB", "BAA", "BAB", "BBA", "BBB"];
const expectedQuotes = [
  "花开易见落难寻，阶前闷杀葬花人，",
  "未若锦囊收艳骨，一抔净土掩风流。",
  "花魂鸟魂总难留，鸟自无言花自羞。",
  "满纸荒唐言，一把辛酸泪！",
  "侬今葬花人笑痴，他年葬侬知是谁？",
  "此系身前身后事，倩谁寄去作神传？",
  "无材可与补苍天，枉入红尘若许年！",
  "都云作者痴，谁解其中味？",
];
if (JSON.stringify(copyData.combinations) !== JSON.stringify(expectedCombinations)) issues.push("ending combination order mismatch");
if (JSON.stringify(copyData.quotes) !== JSON.stringify(expectedQuotes)) issues.push("simplified quote conversion mismatch");

await page.click("#post-note");
await page.waitForFunction(() => window.__PLATFORM_CALLS__.postNote.length === 1);
const calls = await page.evaluate(() => window.__PLATFORM_CALLS__);
const note = calls.postNote[0];
if (note.pageType !== "photo_publish" || !note.mediaInfo.image_resources[0].url.startsWith("data:image/png")) issues.push("postNote media parameters are invalid");
if (!note.content.includes("#小红书小工具")) issues.push("postNote content misses required topic");
if ([...note.title].length > 20 || [...note.content].length > 1000) issues.push("postNote copy exceeds platform limits");
if (/\{(?:choice|ending)/.test(note.content)) issues.push("postNote contains unresolved template fields");
if (!calls.storage.some((call) => call[0] === "setStorage")) issues.push("platform Storage API was not used");

await browser.close();
server.kill("SIGTERM");
await Promise.race([once(server, "exit"), new Promise((resolve) => setTimeout(resolve, 1000))]);
if (issues.length) {
  console.error(issues.join("\n"));
  process.exit(1);
}
console.log(JSON.stringify({ interactiveMs, acts: initial.acts, fullActs: initial.fullActs, card, titles, postNote: "ok", storage: "ok", consoleIssues: 0 }, null, 2));
