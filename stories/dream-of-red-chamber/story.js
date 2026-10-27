/* 《红楼梦：一夜未写的诗》精简三幕 · 据曹雪芹原著虚构改编（字段说明见 stories/_skeleton/story.js） */
(function(){
var C={wall:0x3a1e1e,floor:0x221410,parch:0xF2E6D0,ink:0x7a1f2b,wood:0x4a2a1c,bamboo:0x2f4a2a};

var pavilionProps=[
 {type:'text',text:'沁芳\n夜谈',size:[1.2,.8],color:'#7a1f2b',at:[0,1.9,-3.38]},
 {type:'box',size:[1.4,.08,.8],color:C.wood,at:[0,.78,-1.4],solid:true},
 {type:'candle',at:[-.45,.82,-1.5],intensity:2.2},
 {type:'candle',at:[2.6,0,-2.6],intensity:1.4},
 {type:'box',id:'slip',size:[.3,.01,.2],color:C.parch,at:[.15,.83,-1.35]},
 {type:'plane',size:[1.6,1],color:0x1a2a3a,unlit:true,at:[-2.2,1.8,-3.38]}
];
for(var i=0;i<3;i++)pavilionProps.push({type:'box',size:[.18,2.8,.18],color:0x5a2a20,at:[-2.8+i*2.8,1.4,1.6],solid:true});

var yihongProps=[
 {type:'text',text:'怡红\n快绿',size:[1.2,.8],color:'#7a1f2b',at:[0,1.9,-3.38]},
 {type:'box',size:[1,.9,.6],color:C.wood,at:[0,.45,-1.6],solid:true},
 {type:'candle',at:[.35,.9,-1.7],intensity:2.4},
 {type:'ico',id:'jade',radius:.09,color:0x9fd7b0,metalness:.2,roughness:.3,at:[-.1,1,-1.55]},
 {type:'box',size:[.5,1.6,.5],color:0x6a1a20,at:[-2.4,.8,-2.4],solid:true},
 {type:'box',size:[.5,1.6,.5],color:0x6a1a20,at:[2.4,.8,-2.4],solid:true}
];

function xiaoxiangProps(S){
 var p=[
  {type:'text',text:'潇湘\n馆',size:[1.2,.8],color:'#2f4a2a',at:[0,1.9,-3.38]},
  {type:'box',size:[.7,.5,.7],color:0x3a2a1a,at:[0,.25,-1.5],solid:true},
  {type:'box',id:'chest',size:[.4,.18,.28],color:0x5a3a24,at:[0,.59,-1.5]},
  {type:'candle',at:[1.6,0,-2],intensity:S.route==='ash'?2.8:1.6}
 ];
 for(var i=0;i<5;i++)p.push({type:'box',size:[.1,3,.1],color:C.bamboo,at:[-2.6+i*.25,1.5,-2.8+(i%2)*.3],solid:true});
 for(var j=0;j<5;j++)p.push({type:'box',size:[.1,3,.1],color:C.bamboo,at:[1.8+j*.25,1.5,-2.8+(j%2)*.3],solid:true});
 return p;
}

window.__STORY__={
 title:'红楼梦：一夜未写的诗',
 pageTitle:'红楼梦 · 3D 互动小说',
 darkRoute:'ash',
 palette:{ink:0x7a1f2b,candle:0xffa860,fog:0x0a0608},
 start:{
  sub:'三个院落，一本诗稿，一个选择',
  html:'<p>据曹雪芹原著虚构改编的短篇互动。你是住进大观园的一位少年——旁人叫你宝二爷。这一夜没有书信，只有诗笺、一块玉和一只诗稿匣。走近发光之物，按 E 或点击查看。</p>'+
   '<p style="font-size:13px;color:#7a5a40">电脑：WASD 走动，点击画面锁定视角或按住拖拽。手机：左下摇杆走动，点物件自动走近。</p>',
  button:'— 走进大观园 —'
 },
 acts:[
  {id:'pavilion',hud:'第一幕 · 沁芳亭 · 夜谈',fade:'大观园 · 中秋前夜',
   room:{wall:C.wall,floor:C.floor,w:7,d:7,fog:0x0a0a14,spawn:[0,2.5]},
   props:pavilionProps,
   interaction:{type:'diary',target:'slip',label:'石桌上的诗笺',
    title:'一张空白诗笺',sub:'众人散去，你只写下一句',
    intro:'<p>姐妹们约好明日起社，各人须先拟一句。亭外水声细细，你提笔，墨在笔尖停了很久。</p>',
    pains:['花落了还会再开，人散了却不再聚。','我宁愿做一块无用的石头，也不做有用的人。','这园子再大，也只是一座好看的牢。'],
    painKey:'verse',
    after:'<p>竹影里有人轻轻咳了一声。是她，披着旧斗篷，问你写了什么。</p>',
    options:[
     {text:'把诗笺递给她看',record:'递笺给她',route:'',set:{bond:'知己'}},
     {text:'笑着说只是凑数，收进袖里',record:'藏笺入袖',route:'',set:{bond:'未说破'}},
     {text:'把诗笺投进沁芳溪',record:'笺随水去',route:'ash',set:{bond:'流水'}}
    ]}},
  {id:'yihong',hud:'第二幕 · 怡红院 · 抉择',fade:'次年 · 春深',
   room:{wall:0x4a1a1e,floor:0x2a1612,w:7,d:7,spawn:[0,2.5]},
   props:yihongProps,
   interaction:{type:'name',target:'jade',label:'枕边那块玉',
    title:'玉上的字',sub:'府里都说，这块玉就是你的命',
    text:'<p>前厅传话：老爷要你明日去见几位世交，讲讲功名、讲讲仕途。另一头，有人提起“金玉良缘”四个字，满屋都笑了。</p>'+
     '<p>你翻过玉来，背面刻着一行小字。灯下看，它像在问你：你到底叫什么名字？</p>',
    options:[
     {text:'认下“宝玉”这个名字，明日去前厅',record:'认作宝玉',ending:'金玉',
      toggle:{readings:[
       {title:'宝玉',text:'人人捧着、人人寄望的那块玉。它亮，所以必须被看见，必须有用。'},
       {title:'顽石',text:'女娲补天剩下的一块石头，无才可去补苍天。它不亮，所以自在。',dark:true}
      ],button:'翻过来再看',proceed:'把玉挂回颈上'}},
     {text:'不去。把墙上的四个词一一划掉',record:'划掉仕途',route:'',ending:'木石',
      wall:{words:['功名','仕途','经济','金玉'],z:-3.3,label:'划掉「{w}」',hudStart:'怡红院的墙 · 点掉 {n} 个词',hudLeft:'怡红院的墙 · 还剩 {n} 个词',
       doneTitle:'怡红院',doneText:'墙空了。你知道明日会挨骂，可这一夜，你第一次只是你自己。',doneOption:'去潇湘馆'}},
     {text:'什么也不说，把玉压在枕下',record:'压玉不语',route:'ash',ending:'沉默'}
    ]}},
  {id:'xiaoxiang',hud:'第三幕 · 潇湘馆 · 诗稿',fade:'秋 · 竹声如雨',
   room:function(S){return {wall:0x1e2a1e,floor:0x141a12,w:7,d:7,fog:S.route==='ash'?0x140806:0x080c08,spawn:[0,2.5]}},
   props:xiaoxiangProps,
   interaction:{type:'dead-letter',target:'chest',label:'案下的诗稿匣',
    title:'诗稿匣',sub:'这里没有一封信，只有一沓从没寄出的诗',
    text:'<p>匣里是这几年诗社的旧稿。最上面一张，竟是你那夜写的：</p>'+
     '<p style="text-align:center">“{verse}”</p>'+
     '<p>{route=ash?炭盆已经生起来了，火光在竹影上跳。:窗外竹叶沙沙，像有人在翻书。}</p>',
    options:[
     {text:'把诗稿一张张投进炭盆',record:'焚稿',route:'ash',set:{finale:'焚稿断痴'}},
     {text:'合上匣子，留给后来读的人',record:'留稿',route:'',set:{finale:'诗稿留世'}},
     {text:'带着匣子走出园门，不再回头',record:'出园',set:{finale:'悬崖撒手'}}
    ]}}
 ],
 catalog:{
  title:'你的版本目录',
  template:'《红楼梦：一夜未写的诗》· 你的版本目录\n'+
   '第一幕 沁芳亭：{choice0}｜你写下：{verse}｜与她：{bond}\n'+
   '第二幕 怡红院：{choice1}｜姻缘：{ending}\n'+
   '第三幕 潇湘馆：{choice2}\n结局：{finale}'+
   '\n文风：{route=ash?冷灰余烬:竹影清光}',
  restartFade:'大观园'
 }
};
})();
