/*
 * 《红楼梦：七幕导读》· 据曹雪芹原著关键剧情虚构改编（字段说明见 stories/_skeleton/story.js）
 * 七幕：进府 → 梨香院 → 共读 → 葬花 → 抄检 → 焚稿 → 雪夜。分支只改立场与文风，悲剧终局不变。
 * 心迹 {heart}：第三幕 diary 用 painKey:'heart' 存入（引擎默认存 {pain}，这里换了键名）。
 * 路线 route：'jinyu' 金玉（墨黑冷调，darkRoute）/ 'mushi' 木石（暖泪调）；第五幕 set.frost 让后两幕更冷更暗。
 */
(function(){
var C={red:0x5a1e1a,wood:0x3a2214,parch:0xF4ECDF,ink:0x4A0E1F,jade:0x8fd1b0,gold:0xd8b04a,bamboo:0x23331f};
/* 所有待替换文案集中在这里；场景结构与文案分离。 */
var COPY=__COPY_JSON__;

var act1Props=[
 {type:'text',text:COPY.act1.title,size:[1.2,.8],color:'#4A0E1F',at:[0,1.9,-3.38]},
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
 {type:'text',text:COPY.act2.title,size:[1.2,.8],color:'#5a4010',at:[0,1.9,-3.38]},
 {type:'box',size:[1.2,.08,.7],color:0x4a3420,at:[-.4,.78,-1.6],solid:true},
 {type:'candle',at:[-.8,.82,-1.7],intensity:2.2},
 {type:'box',size:[.08,1.4,.6],color:0x2e4a2a,at:[2.4,.7,-1.4],solid:true},
 {type:'box',size:[.1,2.6,.1],color:0x3e6a3a,at:[2.6,1.3,-2.6]},
 {type:'box',size:[.1,2.4,.1],color:0x3e6a3a,at:[2.9,1.2,-2.2]},
 {type:'cylinder',id:'locket',radius:.08,height:.02,color:C.gold,at:[-.3,.83,-1.55]},
 {type:'light',color:0xffd98a,intensity:1.1,distance:3,at:[-.3,1.2,-1.4]}
];

var act3Props=[
 {type:'text',text:COPY.act3.title,size:[1.2,.8],color:'#7a2a3a',at:[0,1.9,-3.38]},
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
 {type:'text',text:COPY.act4.title,size:[1.4,.45],color:'#7a2a3a',at:[0,2.75,-3.38]},
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
  {type:'text',text:COPY.act5.title,size:[1.2,.8],color:cold?'#2a3a4a':'#4A0E1F',at:[0,1.9,-3.88]},
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
  {type:'text',text:COPY.act6.title,size:[1.2,.8],color:'#2f4a2a',at:[0,1.9,-3.38]},
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
 {type:'text',text:COPY.act7.title,size:[1.2,.8],color:'#3a3a4a',bg:'#e8ecf0',at:[0,1.9,-3.88]},
 {type:'box',size:[.3,2.2,.3],color:0x2a2a30,at:[-2.4,1.1,-2.6],solid:true},
 {type:'box',size:[.3,2.2,.3],color:0x2a2a30,at:[2.4,1.1,-2.6],solid:true},
 {type:'box',size:[5.4,.3,.4],color:0x2a2a30,at:[0,2.35,-2.6]},
 {type:'light',color:0xc8d4e8,intensity:1.4,distance:8,at:[0,2.6,0]},
 {type:'box',id:'cloak',size:[.5,.08,.4],color:0xa01a24,at:[0,.04,-1.4]},
 {type:'light',color:0xff9aa0,intensity:.9,distance:2.5,at:[0,.6,-1.2]}
];
for(var s=0;s<12;s++)act7Props.push({type:'box',size:[.04,.04,.04],color:0xffffff,at:[-2.5+((s*7)%11)*.45,.5+((s*5)%7)*.35,-2+((s*3)%5)*.7]});

function option(text,record,bit,next){
 return {text:text,record:record,keyChoice:true,versionBit:bit,next:next};
}
var MAIN_ACTS=[
 {id:'rongguo',hud:COPY.act1.hud,fade:COPY.act1.fade,
  room:{wall:C.red,floor:0x1e100a,w:7,d:7,spawn:[0,2.5]},props:act1Props,
  interaction:{type:'choice',target:'jade',label:COPY.act1.label,title:COPY.act1.title,sub:COPY.act1.sub,text:COPY.act1.text,
   options:[option(COPY.act1.choices[0],COPY.act1.choices[0],0),option(COPY.act1.choices[1],COPY.act1.choices[1],1)]}},
 {id:'flower-tomb',hud:COPY.act4.hud,fade:COPY.act4.fade,
  room:{wall:0x2a1a20,floor:0x1a1210,w:7,d:7,fog:0x0b0608,spawn:[0,2.5]},props:act4Props,
  interaction:{type:'choice',target:'pouch',label:COPY.act4.label,title:COPY.act4.title,sub:COPY.act4.sub,text:COPY.act4.text,
   options:[option(COPY.act4.choices[0],COPY.act4.choices[0],0),option(COPY.act4.choices[1],COPY.act4.choices[1],1)]}},
 {id:'snow',hud:COPY.act7.hud,fade:COPY.act7.fade,
  room:{wall:0xcfd6de,floor:0xe4e8ee,ceiling:0x1a1e26,w:8,d:8,fog:0x1a1e26,ambient:0x8a96aa,ambientIntensity:.7,spawn:[0,3]},props:act7Props,
  interaction:{type:'dead-letter',target:'cloak',label:COPY.act7.label,title:COPY.act7.title,sub:COPY.act7.sub,text:COPY.act7.text,
   options:[option(COPY.act7.choices[0],COPY.act7.choices[0],0,'catalog'),option(COPY.act7.choices[1],COPY.act7.choices[1],1,'catalog')]}}
];
var FULL_ACTS=[
 MAIN_ACTS[0],
 {id:'lixiang',hud:COPY.act2.hud,fade:COPY.act2.fade,
  room:{wall:0x3a2a1a,floor:0x22180e,w:7,d:7,spawn:[0,2.5]},props:act2Props,
  interaction:{type:'choice',target:'locket',label:COPY.act2.label,title:COPY.act2.title,sub:COPY.act2.sub,text:COPY.act2.text,
   options:[{text:COPY.act2.choices[0],route:'jinyu'},{text:COPY.act2.choices[1],route:'mushi'}]}},
 {id:'garden',hud:COPY.act3.hud,fade:COPY.act3.fade,
  room:{wall:0x2a3a2a,floor:0x1e2a1a,w:7,d:7,fog:0x0a100a,spawn:[0,2.5]},props:act3Props,
  interaction:{type:'choice',target:'book',label:COPY.act3.label,title:COPY.act3.title,sub:COPY.act3.sub,text:COPY.act3.text,
   options:[{text:COPY.act3.choices[0]},{text:COPY.act3.choices[1]}]}},
 MAIN_ACTS[1],
 {id:'search',hud:COPY.act5.hud,fade:COPY.act5.fade,room:act5Room,props:act5Props,
  interaction:{type:'choice',target:'chest',label:COPY.act5.label,title:COPY.act5.title,sub:COPY.act5.sub,text:COPY.act5.text,
   options:[{text:COPY.act5.choices[0],set:{frost:''}},{text:COPY.act5.choices[1],set:{frost:'深'}}]}},
 {id:'xiaoxiang',hud:COPY.act6.hud,fade:COPY.act6.fade,room:act6Room,props:act6Props,
  interaction:{type:'choice',target:'drafts',label:COPY.act6.label,title:COPY.act6.title,sub:COPY.act6.sub,text:COPY.act6.text,
   options:[{text:COPY.act6.choices[0],set:{draft:'焚'}},{text:COPY.act6.choices[1],set:{draft:'留'}}]}},
 MAIN_ACTS[2]
];
window.__STORY__={
 title:COPY.title,pageTitle:COPY.pageTitle,copy:COPY,
 palette:{ink:0x5a1e1a,candle:0xffa860},
 start:{title:COPY.title,sub:COPY.startSub,html:'<p class="hook">'+COPY.hook+'</p>',button:COPY.startButton},
 acts:MAIN_ACTS,
 fullActs:FULL_ACTS,
 catalog:{title:COPY.resultTitle,restartFade:COPY.act1.fade}
};
})();
