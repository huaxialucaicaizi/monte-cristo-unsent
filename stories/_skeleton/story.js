/*
 * 空书骨架 · 复制整个 _skeleton 文件夹并改名（如 stories/my-book/），再改这份文件即可换书。
 * 打开方式：/?story=my-book   （文件夹名只用字母、数字、- 和 _）
 *
 * ── 必填字段 ────────────────────────────────────────────
 *   title        书名（开场标题 & 浏览器标签）
 *   acts[]       幕列表，按顺序播放；每幕必填：
 *     id           幕的英文代号，选项里 next:'代号' 可跳到该幕
 *     hud          左上角小字
 *     room         {wall:墙色, floor:地板色, w:宽, d:深, spawn:[x,z] 出生点}
 *     props[]      房间里的物件（见下方“物件类型”）；要能点的物件写 id
 *     interaction  这一幕的可点交互（见下方“交互类型”），target 填物件 id
 *   catalog      结局目录 {template:'…'}，结尾展示并可复制
 *
 * ── 选填字段 ────────────────────────────────────────────
 *   pageTitle  浏览器标签标题；start {sub, html, button} 开场面板
 *   darkRoute  当 route 等于该值时弹窗变墨黑主题（如 'revenge'）
 *   幕.fade    进入该幕时黑场上的字；room/props 也可写成 function(S){return …} 随选择变化
 *   palette    {parch, ink, candle, flame, ceiling, ambient, fog} 覆盖默认色
 *   ui         {hint, copy, copied, restart} 覆盖按钮/提示文案
 *
 * ── 物件类型 props[].type ───────────────────────────────
 *   box      {size:[宽,高,深], color, at:[x,y,z], solid:true 挡路}
 *   candle   {at, intensity}            会闪的烛光
 *   text     {text:'可\n换行', size:[宽,高], color:'#4A0E1F', at}   墙上的字牌
 *   plane    {size:[宽,高], color, unlit:true, at}                  窗、画
 *   cylinder {radius, height, color, at}  蜡封等；ico {radius,color,metalness,at} 宝石
 *   spot     {color,intensity,distance,angle,penumbra,decay,at,target:[x,y,z]} 聚光
 *   （墙在 z = -d/2，墙上字牌放 z = -d/2 + 0.12；桌面高约 0.8）
 *
 * ── 交互类型 interaction.type ───────────────────────────
 *   letter-seal  点蜡封 clicks 次 → 出现 text → options；seal:'物件id' 会随点击缩小消失
 *   diary        先从 pains[] 选一句（存进 {pain}）→ after 文案 → options
 *   choice / map / name / gazette   直接 text → options（四个名字等价，按语义选用）
 *   dead-letter  同上，但选完默认进结局目录
 *   共有：target, label(悬停提示), title, sub(小标题), text(可含 HTML 与 {变量})
 *
 * ── 选项 options[] ─────────────────────────────────────
 *   text 按钮字；record 记入目录（{choice0} {choice1}…）；route 设路线；
 *   set:{键:值} 自定义变量（模板里用 {键}）；ending 结局名（{ending}）；next 跳到某幕 id（省略=下一幕，最后一幕后=目录）
 *   特效（三选一）：
 *     toggle {readings:[{title,text,dark}], button, proceed}   双名/双读法切换
 *     wall   {words:[...], label:'划掉「{w}」', hudStart, hudLeft:'还剩 {n} 个', doneTitle, doneText, doneOption} 删改墙上词
 *     lock   {title, sub, clicks:2, push:[dx,dy,dz]}           二次蜡封确认，并把目标物件推进去
 *
 * ── 模板变量 ───────────────────────────────────────────
 *   {choice0}… 第 N 个 record；{pain}；{ending}；{route}；set 的任意键；
 *   {route=甲?A文:B文} 路线等于“甲”时显示 A 文，否则 B 文
 */
(function(){
window.__STORY__={
 title:'雨夜的无名信',
 start:{
  sub:'一部尚未写完的名著 · 骨架示例',
  html:'<p>这是空书骨架：一个房间，一封信，一次选择。走近发光之物，按 E 或点击查看。</p>',
  button:'— 推开阁楼的门 —'
 },
 acts:[
  {id:'attic',hud:'第一章 · 阁楼 · 来信',fade:'某年 · 雨夜',
   room:{wall:0x2B1810,floor:0x1e120b,w:6,d:6,spawn:[0,2]},
   props:[
    {type:'box',size:[1.4,.08,.8],color:0x3a2214,at:[0,.78,-1.2],solid:true},
    {type:'candle',at:[-.45,.82,-1.3],intensity:2.4},
    {type:'text',text:'第一章\n来信',size:[1.2,.8],color:'#4A0E1F',at:[0,1.9,-2.88]},
    {type:'box',id:'letter',size:[.32,.01,.22],color:0xF4ECDF,at:[.1,.83,-1.15]},
    {type:'cylinder',id:'seal',radius:.04,height:.015,color:0x4A0E1F,at:[.1,.845,-1.15]}
   ],
   interaction:{type:'letter-seal',target:'letter',seal:'seal',label:'一封没有署名的信',
    title:'无名信',sub:'点蜡封两次',clicks:2,firstMsg:'封蜡上压着一枚陌生的纹章。',crackMsgs:['蜡裂开了。'],
    text:'<p>“你所继承的，并不属于你。”</p><p>信纸带着远方港口的盐味。主人公——一个年轻的抄写员——把它举向烛火。</p>',
    options:[
     {text:'循着纹章去寻找寄信人',record:'追问来历',ending:'启程'},
     {text:'把信夹进书里，当作没看见',record:'沉默',ending:'留下'}
    ]}}
 ],
 catalog:{
  template:'《雨夜的无名信》· 你的版本目录\n第一章 阁楼：{choice0}\n结局：{ending}'
 }
};
})();
