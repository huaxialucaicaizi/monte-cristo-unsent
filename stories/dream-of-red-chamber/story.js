/*
 * 《红楼梦：七幕导读》· 据曹雪芹原著关键剧情虚构改编（字段说明见 stories/_skeleton/story.js）
 * 七幕：进府 → 梨香院 → 共读 → 葬花 → 抄检 → 焚稿 → 雪夜。分支只改立场与文风，悲剧终局不变。
 * 心迹 {heart}：第三幕 diary 用 painKey:'heart' 存入（引擎默认存 {pain}，这里换了键名）。
 * 路线 route：'jinyu' 金玉（墨黑冷调，darkRoute）/ 'mushi' 木石（暖泪调）；第五幕 set.frost 让后两幕更冷更暗。
 */
(function(){
var C={red:0x5a1e1a,wood:0x3a2214,parch:0xF4ECDF,ink:0x4A0E1F,jade:0x8fd1b0,gold:0xd8b04a,bamboo:0x23331f};

var act1Props=[
 {type:'text',text:'荣国府\n进府',size:[1.2,.8],color:'#4A0E1F',at:[0,1.9,-3.38]},
 {type:'box',size:[1.6,.08,.8],color:C.wood,at:[0,.78,-1.6],solid:true},
 {type:'box',size:[.5,.9,.5],color:0x4a2014,at:[-2.4,.45,-2.6],solid:true},
 {type:'box',size:[.5,.9,.5],color:0x4a2014,at:[2.4,.45,-2.6],solid:true},
 {type:'box',size:[1.4,1.8,.08],color:0x6a2a20,at:[-2.6,.9,.2],solid:true},
 {type:'candle',at:[-.6,.82,-1.7],intensity:2.4},
 {type:'candle',at:[.6,.82,-1.7],intensity:2.4},
 {type:'box',size:[.24,.06,.24],color:0x2a1408,at:[0,.85,-1.55]},
 {type:'ico',id:'jade',radius:.09,color:C.jade,metalness:.3,roughness:.25,at:[0,.97,-1.55]},
 {type:'light',color:0x9fe8c4,intensity:1.2,distance:3,at:[0,1.3,-1.4]}
];

var act2Props=[
 {type:'text',text:'梨香院\n金锁',size:[1.2,.8],color:'#5a4010',at:[0,1.9,-3.38]},
 {type:'box',size:[1.2,.08,.7],color:0x4a3420,at:[-.4,.78,-1.6],solid:true},
 {type:'candle',at:[-.8,.82,-1.7],intensity:2.2},
 {type:'box',size:[.08,1.4,.6],color:0x2e4a2a,at:[2.4,.7,-1.4],solid:true},
 {type:'box',size:[.1,2.6,.1],color:0x3e6a3a,at:[2.6,1.3,-2.6]},
 {type:'box',size:[.1,2.4,.1],color:0x3e6a3a,at:[2.9,1.2,-2.2]},
 {type:'cylinder',id:'locket',radius:.08,height:.02,color:C.gold,at:[-.3,.83,-1.55]},
 {type:'light',color:0xffd98a,intensity:1.1,distance:3,at:[-.3,1.2,-1.4]}
];

var act3Props=[
 {type:'text',text:'大观园\n共读',size:[1.2,.8],color:'#7a2a3a',at:[0,1.9,-3.38]},
 {type:'box',size:[1.6,.4,.5],color:0x6a6058,at:[0,.2,-1.4],solid:true},
 {type:'box',size:[.25,2.2,.25],color:0x3a2a1a,at:[-2.2,1.1,-2.4],solid:true},
 {type:'ico',radius:.7,color:0xe8a0b0,at:[-2.2,2.4,-2.4]},
 {type:'box',size:[.25,2,.25],color:0x3a2a1a,at:[2.3,1,-2],solid:true},
 {type:'ico',radius:.6,color:0xf0b8c4,at:[2.3,2.1,-2]},
 {type:'box',size:[2.4,.02,.6],color:0x3a5a6a,at:[-1.6,.01,.6]},
 {type:'candle',at:[.6,.4,-1.5],intensity:2.2},
 {type:'box',id:'book',size:[.3,.05,.22],color:0xd8c8a8,at:[-.2,.43,-1.4]}
];

var act4Props=[
 {type:'text',text:'花冢 · 葬花',size:[1.4,.45],color:'#7a2a3a',at:[0,2.75,-3.38]},
 {type:'ico',radius:.45,color:0x4a3626,at:[0,.15,-1.6]},
 {type:'box',size:[.04,1.1,.04],color:0x5a4030,at:[.7,.55,-1.5]},
 {type:'box',size:[.25,.06,.04],color:0x7a7a7a,at:[.7,1.1,-1.5]},
 {type:'candle',at:[-1.2,0,-1.9],intensity:1.6},
 {type:'box',id:'pouch',size:[.22,.14,.16],color:0xc04a6a,at:[-.25,.62,-1.45]},
 {type:'light',color:0xffb0c0,intensity:1,distance:3,at:[-.25,1,-1.3]}
];
for(var i=0;i<9;i++)act4Props.push({type:'box',size:[.08,.01,.08],color:0xf0a8b8,at:[-1.6+i*.4,.01,-.6+(i%2)*.5]});

function act5Room(S){var cold=S.route==='jinyu';
 return {wall:cold?0x1c1e24:0x2e2018,floor:0x16120e,w:8,d:8,fog:cold?0x05080c:0x0a0806,ambient:cold?0x26303a:0x3a2a20,ambientIntensity:cold?.6:.8,spawn:[0,3]}}
function act5Props(S){var cold=S.route==='jinyu',dim=cold?1.2:2;
 var p=[
  {type:'text',text:'抄检\n大观园',size:[1.2,.8],color:cold?'#2a3a4a':'#4A0E1F',at:[0,1.9,-3.88]},
  {type:'candle',at:[-1.6,0,-2.8],intensity:dim},
  {type:'candle',at:[1.6,0,-2.8],intensity:dim*.8},
  {type:'box',id:'chest',size:[.9,.5,.5],color:0x5a2a1a,at:[0,.25,-1.8],solid:true},
  {type:'light',color:0xffc890,intensity:.9,distance:3,at:[0,1,-1.5]}
 ];
 for(var k=0;k<4;k++)p.push({type:'box',size:[.6,.4,.4],color:0x3a2214,at:[-2.6+(k%2)*.7,.2+(k>1?.4:0),1.6],solid:k<2});
 return p;
}

function act6Room(S){var frost=!!S.frost,cold=S.route==='jinyu'||frost;
 return {wall:C.bamboo,floor:0x141a12,w:7,d:7,fog:cold?0x05070a:0x08090a,ambient:cold?0x202a2a:0x2e3226,ambientIntensity:frost?.45:.7,spawn:[0,2.5]}}
function act6Props(S){var dim=(S.frost?.9:1.6)*(S.route==='jinyu'?.8:1);
 var p=[
  {type:'text',text:'潇湘馆\n焚稿',size:[1.2,.8],color:'#2f4a2a',at:[0,1.9,-3.38]},
  {type:'box',size:[1.4,.08,.7],color:0x3a2a1a,at:[-.8,.78,-1.6],solid:true},
  {type:'candle',at:[-1.2,.82,-1.7],intensity:dim},
  {type:'cylinder',radius:.28,height:.3,color:0x2a2a2a,at:[.9,.15,-1.4]},
  {type:'light',color:0xff7a3a,intensity:1.6,distance:2.5,at:[.9,.5,-1.4]},
  {type:'box',id:'drafts',size:[.3,.06,.4],color:C.parch,at:[-.6,.85,-1.55]}
 ];
 for(var k=0;k<5;k++)p.push({type:'box',size:[.08,3,.08],color:0x3e5a36,at:[-3+k*.15,1.5,-3.1+(k%2)*.3]});
 return p;
}

var act7Props=[
 {type:'text',text:'雪夜\n出家意',size:[1.2,.8],color:'#3a3a4a',bg:'#e8ecf0',at:[0,1.9,-3.88]},
 {type:'box',size:[.3,2.2,.3],color:0x2a2a30,at:[-2.4,1.1,-2.6],solid:true},
 {type:'box',size:[.3,2.2,.3],color:0x2a2a30,at:[2.4,1.1,-2.6],solid:true},
 {type:'box',size:[5.4,.3,.4],color:0x2a2a30,at:[0,2.35,-2.6]},
 {type:'light',color:0xc8d4e8,intensity:1.4,distance:8,at:[0,2.6,0]},
 {type:'box',id:'cloak',size:[.5,.08,.4],color:0xa01a24,at:[0,.04,-1.4]},
 {type:'light',color:0xff9aa0,intensity:.9,distance:2.5,at:[0,.6,-1.2]}
];
for(var s=0;s<12;s++)act7Props.push({type:'box',size:[.04,.04,.04],color:0xffffff,at:[-2.5+((s*7)%11)*.45,.5+((s*5)%7)*.35,-2+((s*3)%5)*.7]});

window.__STORY__={
 title:'红楼梦：七幕导读',
 pageTitle:'红楼梦：七幕导读 · 3D',
 darkRoute:'jinyu',
 palette:{ink:0x5a1e1a,candle:0xffa860},
 ui:{catalogTitle:'你的石头记目录'},
 start:{
  sub:'一块石头，七个房间',
  html:'<p>据曹雪芹原著关键剧情虚构改编的七幕导读。你是翻书的人，跟着那块石头走过荣国府与大观园。分支只改立场与笔调，结局早已写在石上。</p>'+
   '<p>走近发光之物，按 E 或点击查看。</p>'+
   '<p style="font-size:13px;color:#7a5a40">电脑：WASD 走动，点击画面锁定视角（Esc 解锁）或按住拖拽。<br>手机：左下摇杆走动，右侧拖拽看；也可直接点物件自动走近。</p>',
  button:'— 跨进荣国府 —'
 },
 acts:[
  {id:'rongguo',hud:'第一幕 · 荣国府 · 进府',fade:'一块石头，落进红尘',
   room:{wall:C.red,floor:0x1e100a,w:7,d:7,spawn:[0,2.5]},
   props:act1Props,
   interaction:{type:'name',target:'jade',label:'通灵宝玉',
    title:'通灵宝玉',sub:'初进府的那一日',
    text:'<p>远客初到，满堂锦绣。那位衔玉而生的公子听说新来的妹妹没有玉，当众把玉摘下摔在地上。</p><p>玉没碎。烛下它温润得像一滴水。你要怎样称呼它？</p>',
    options:[
     {text:'唤它「宝玉」——人人捧着的命根子',record:'宝玉',set:{stone:'宝玉'},
      toggle:{button:'换一种读法',proceed:'把玉挂回他颈上',readings:[
       {title:'宝玉的读法',text:'它是长辈的指望，是锁住一个少年的金链子。人人都说：玉在，人就在。',dark:false},
       {title:'顽石的读法',text:'它原是补天剩下的一块石头，没用上，才被带来这里看一场繁华。',dark:true}
      ]}},
     {text:'唤它「顽石」——青埂峰下那块没补成天的石头',record:'顽石',set:{stone:'顽石'},
      toggle:{button:'换一种读法',proceed:'把石头还给这座府',readings:[
       {title:'顽石的读法',text:'它记得大荒山的风。它来，只是为了看一眼，然后回去写下来。',dark:true},
       {title:'宝玉的读法',text:'可在这座府里，没人肯叫它石头。叫一声顽石，就会有人掉泪。',dark:false}
      ]}}
    ]}},
  {id:'lixiang',hud:'第二幕 · 梨香院 · 金与木',fade:'金锁微响，竹影一摇',
   room:{wall:0x3a2a1a,floor:0x22180e,w:7,d:7,spawn:[0,2.5]},
   props:act2Props,
   interaction:{type:'choice',target:'locket',label:'錾字金锁',
    title:'金锁与绛珠',sub:'两种缘分 · 你站哪一边',
    text:'<p>梨香院里，端庄的表姐把金锁递来给他看，锁上的字和玉上的字恰好成对。窗外，潇湘馆的竹子沙沙作响。</p><p>府里人人都说一句好话；还有一个人，只在心里记着前世的灌溉之恩。</p>',
    options:[
     {text:'信金玉良缘：门第相当，人人称好',record:'金玉良缘',route:'jinyu'},
     {text:'信木石前盟：一株草，要用一生的眼泪还',record:'木石前盟',route:'mushi'}
    ]}},
  {id:'garden',hud:'第三幕 · 大观园 · 共读',fade:'春日 · 沁芳闸下',
   room:{wall:0x2a3a2a,floor:0x1e2a1a,w:7,d:7,fog:0x0a100a,spawn:[0,2.5]},
   props:act3Props,
   interaction:{type:'diary',target:'book',label:'藏在落花下的书',painKey:'heart',
    title:'共读',sub:'选一句心迹，夹进书页',
    intro:'<p>桃花底下，两个人偷偷翻一本闲书。读到一处，他笑着拿书里的话比她，她红了眼圈，又忍不住笑。</p><p>此刻，哪一句是真心？</p>',
    pains:['你懂我，比旁人多一点就够了。','我怕的不是散，是散了以后没人记得。','这园子再好，也是借来的春天。'],
    after:'<p>“{heart}”——墨迹落在书页的空白处。远处有人在唤，书得藏起来了。</p>',
    options:[
     {text:'把书塞进他的袖子',record:'藏书入袖'},
     {text:'把书埋回落花底下',record:'埋书花下'}
    ]}},
  {id:'flower-tomb',hud:'第四幕 · 花冢 · 葬花',fade:'落花满地，无人收拾',
   room:{wall:0x2a1a20,floor:0x1a1210,w:7,d:7,fog:0x0b0608,spawn:[0,2.5]},
   props:act4Props,
   interaction:{type:'choice',target:'pouch',label:'装花的锦囊',
    title:'葬花',sub:'墙上浮出四个词',
    text:'<p>她扛着花锄，把落花一捧捧收进锦囊，埋进小小的土冢。她低声念着自己写的句子，说今日葬花的人，明日又有谁来葬她。</p><p>墙上浮出几个词，越看越重。</p>',
    options:[
     {text:'陪她一起，把这些词一个个划掉',record:'陪她划词',
      wall:{words:['花谢','飘零','葬花','泪'],label:'划掉「{w}」',
       hudStart:'花冢 · 点掉墙上 {n} 个词',hudLeft:'花冢 · 还剩 {n} 个词',
       doneTitle:'花冢',doneText:'字划掉了，花还是落。你终于明白，她葬的从来不只是花。',doneOption:'掩上花冢'}},
     {text:'站在山石后，看她独自划掉它们',record:'山石后旁观',
      wall:{words:['花谢','飘零','葬花','泪'],label:'替她划掉「{w}」',
       hudStart:'花冢 · 点掉墙上 {n} 个词',hudLeft:'花冢 · 还剩 {n} 个词',
       doneTitle:'花冢',doneText:'你没有走出去。土冢很小，却像把整座园子都埋了进去。',doneOption:'悄悄离开'}}
    ]}},
  {id:'search',hud:'第五幕 · 抄检大观园',fade:'秋夜 · 灯笼一盏盏亮起',
   room:act5Room,
   props:act5Props,
   interaction:{type:'choice',target:'chest',label:'被翻开的箱笼',
    title:'抄检',sub:'{route=jinyu?烛火发冷:烛火摇晃}',
    text:'<p>一夜之间，园门大开，灯笼照进每一间屋子。箱笼被翻开，丫鬟们的私物摊在地上。有人当众挨了耳光，有人第二天就被撵了出去。</p><p>{route=jinyu?你信过的那份体面，此刻正冷冷地站在门口。:你护过的那点真心，此刻无处可藏。}</p>',
    options:[
     {text:'默然看着，什么也没说',record:'默然',set:{frost:'深'}},
     {text:'挡在箱笼前，替她们求一句情',record:'求情',set:{frost:''}},
     {text:'亲手把箱子打开——迟早要散的',record:'亲手开箱',set:{frost:'深'}}
    ]}},
  {id:'xiaoxiang',hud:'第六幕 · 潇湘馆 · 焚稿',fade:'竹影疏 · 药香冷',
   room:act6Room,
   props:act6Props,
   interaction:{type:'choice',target:'drafts',label:'一叠诗稿',
    title:'焚稿',sub:'{frost=深?园子已散，烛只剩一点:烛火还撑着}',
    text:'<p>远处府里正张灯结彩，说是要办喜事。潇湘馆却静得只剩咳嗽声。她让人把火盆挪近，把诗稿和旧帕子一样样拿过来。</p><p>{route=jinyu?金锁那边的锣鼓，一声比一声近。:前世那一滴水的债，好像就要还完了。}</p>',
    options:[
     {text:'焚稿：让诗和帕子一起进火盆',record:'焚稿',set:{draft:'焚'}},
     {text:'留稿：趁她不注意，抽出最后一页藏起',record:'留稿',set:{draft:'留'}}
    ]}},
  {id:'snow',hud:'第七幕 · 雪夜 · 出家意',fade:'雪落无声 · 石归来处',
   room:{wall:0xcfd6de,floor:0xe4e8ee,ceiling:0x1a1e26,w:8,d:8,fog:0x1a1e26,ambient:0x8a96aa,ambientIntensity:.7,spawn:[0,3]},
   props:act7Props,
   interaction:{type:'dead-letter',target:'cloak',label:'雪地上的大红斗篷',
    title:'雪夜',sub:'石头要回去了',
    text:'<p>多年以后的一个雪夜，渡口边有人披着大红斗篷，向远处的船深深一拜，便随一僧一道走进白茫茫里。</p>'+
     '<p><i>“{heart}”</i></p><p>{draft=留?你藏下的那一页上，还写着这句。:那一句早已随诗稿成灰，只有石头还记得。}故事到这里，本就写好了。</p>',
    options:[
     {text:'目送他走远，雪落满肩',record:'目送',ending:'雪中目送'},
     {text:'把那句心迹刻回石上，再合上书',record:'刻回石上',ending:'刻回石上'}
    ]}}
 ],
 catalog:{
  title:'你的石头记目录',
  template:'《红楼梦：七幕导读》· 你的版本目录\n'+
   '第一幕 荣国府·进府：唤它「{choice0}」\n'+
   '第二幕 梨香院：{choice1}\n'+
   '第三幕 大观园·共读：{choice2}｜心迹：{heart}\n'+
   '第四幕 花冢·葬花：{choice3}\n'+
   '第五幕 抄检大观园：{choice4}\n'+
   '第六幕 潇湘馆：{choice5}\n'+
   '第七幕 雪夜·出家意：{ending}\n'+
   '终局：{draft=留?一页残稿留在人间，绛珠归去，石头出家。:诗稿成灰，绛珠归去，石头出家。}\n'+
   '文风：{route=jinyu?金锁冷光:绛珠暖泪}',
  restartFade:'一块石头，落进红尘'
 }
};
})();
