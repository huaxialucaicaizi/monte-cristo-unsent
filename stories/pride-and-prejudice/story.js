/* 《傲慢与偏见：一封迟到的信》精简两幕 · 据简·奥斯汀原著虚构改编（字段说明见 stories/_skeleton/story.js） */
(function(){
var C={wall:0x3b2a22,floor:0x2a1c14,parch:0xF4ECDF,ink:0x2f3a55,wood:0x4a3020};

var ballProps=[
 {type:'text',text:'梅里顿\n舞会',size:[1.2,.8],color:'#2f3a55',at:[0,1.9,-3.38]},
 {type:'box',size:[1.2,.08,.6],color:C.wood,at:[1.6,.78,-1.6],solid:true},
 {type:'candle',at:[1.3,.82,-1.7],intensity:2.4},
 {type:'candle',at:[-2.4,0,-2.6],intensity:1.6},
 {type:'box',id:'card',size:[.22,.01,.3],color:C.parch,at:[1.75,.83,-1.55]}
];
for(var i=0;i<4;i++)ballProps.push({type:'box',size:[.45,.9,.45],color:0x5a3a28,at:[-2.4+i*.6,.45,1.8],solid:true});

var grovePropsBase=[
 {type:'box',size:[.5,2.6,.5],color:0x3a2a1a,at:[-2,1.3,-2],solid:true},
 {type:'box',size:[.5,2.6,.5],color:0x3a2a1a,at:[2.1,1.3,-1.4],solid:true},
 {type:'box',size:[1.4,.4,.5],color:0x5a4a3a,at:[0,.2,-1.6],solid:true},
 {type:'candle',at:[.6,.4,-1.6],intensity:2.2},
 {type:'box',id:'letter',size:[.32,.01,.22],color:C.parch,at:[-.1,.41,-1.55]},
 {type:'cylinder',id:'seal',radius:.04,height:.015,color:C.ink,at:[-.1,.425,-1.55]}
];

window.__STORY__={
 title:'傲慢与偏见：一封迟到的信',
 pageTitle:'傲慢与偏见 · 3D 互动小说',
 darkRoute:'pride',
 palette:{ink:0x2f3a55},
 start:{
  sub:'两个房间，一次误会，一封信',
  html:'<p>据奥斯汀原著虚构改编的短篇互动。你是伊丽莎白·班纳特。走近发光之物，按 E 或点击查看。</p>'+
   '<p style="font-size:13px;color:#7a5a40">电脑：WASD 走动，点击画面锁定视角或按住拖拽。手机：左下摇杆走动，点物件自动走近。</p>',
  button:'— 走进舞厅 —'
 },
 acts:[
  {id:'meryton',hud:'第一幕 · 梅里顿 · 初见',fade:'赫特福德郡 · 秋',
   room:{wall:C.wall,floor:C.floor,w:7,d:7,spawn:[0,2.5]},
   props:ballProps,
   interaction:{type:'diary',target:'card',label:'舞会记事卡',
    title:'舞会记事卡',sub:'写下你对那位先生的第一印象',
    intro:'<p>那位从德比郡来的先生整晚站在角落，你无意中听见他说：这里没有一位小姐值得他请去跳舞。</p>',
    pains:['他以为全世界都该仰望他。','冷淡未必是骄傲，也许只是笨拙。','他的话不值得我记住——可我偏偏记住了。'],
    painKey:'impression',
    after:'<p>乐队换了一支曲子。他竟然朝你走来，微微欠身。</p>',
    options:[
     {text:'礼貌地拒绝',record:'拒绝邀舞',route:'pride'},
     {text:'接受，但一句话也不多说',record:'沉默共舞',route:''},
     {text:'接受，并当面问他那句话的意思',record:'当面质问',route:'candor'}
    ]}},
  {id:'rosings',hud:'第二幕 · 罗辛斯林荫道 · 来信',fade:'次年春 · 肯特',
   room:{wall:0x24301f,floor:0x1d2616,w:7,d:7,fog:0x0a0f08,spawn:[0,2.5]},
   props:grovePropsBase,
   interaction:{type:'letter-seal',target:'letter',seal:'seal',label:'石凳上的一封信',
    title:'林荫道上的信',sub:'点蜡封两次',clicks:2,firstMsg:'封蜡上是他的家徽。',crackMsgs:['你犹豫了一下。'],
    text:'<p>“{impression}”——你在记事卡上写过的那句，此刻在脑海里响起。</p>'+
     '<p>信里没有一句求情，只有一件件旧事的另一面：你听信的传言，你没问过的缘由。</p>',
    options:[
     {text:'重读一遍，划掉自己心里的两个词',record:'重读并自省',route:'candor',ending:'偏见消散',
      wall:{words:['傲慢','偏见'],label:'划掉「{w}」',hudStart:'心里的墙 · 点掉 {n} 个词',hudLeft:'心里的墙 · 还剩 {n} 个词',
       doneTitle:'林荫道',doneText:'你第一次发现：错看一个人，和被一个人错看，是同一种疼。',doneOption:'合上信'}},
     {text:'把信折好，写一封回信',record:'写回信',ending:'书信往来'},
     {text:'把信撕碎，交给风',record:'撕信',route:'pride',ending:'各自骄傲'}
    ]}}
 ],
 catalog:{
  title:'你的版本目录',
  template:'《傲慢与偏见：一封迟到的信》· 你的版本目录\n'+
   '第一幕 梅里顿：{choice0}｜第一印象：{impression}\n第二幕 罗辛斯：{choice1}\n结局：{ending}'+
   '\n文风：{route=pride?冷蓝疏离:春日暖光}',
  restartFade:'赫特福德郡'
 }
};
})();
