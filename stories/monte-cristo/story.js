/* 《基督山：未寄出的复仇》五幕剧本 · 默认书（字段说明见 stories/_skeleton/story.js） */
(function(){
var C={wood:0x2B1810,parch:0xF4ECDF,ink:0x4A0E1F,stone:0x5a554e};

var act1Props=[
 {type:'box',size:[1.6,.08,.9],color:0x3a2214,at:[0,.78,-1.5],solid:true},
 {type:'candle',at:[-.5,.82,-1.6],intensity:2.6},
 {type:'box',size:[.4,.8,.4],color:0x3a2214,at:[1.8,.4,1.5],solid:true},
 {type:'text',text:'马赛港\n1815',size:[1.2,.8],color:'#4A0E1F',at:[0,1.9,-3.88]},
 {type:'box',id:'letter',size:[.32,.01,.22],color:C.parch,at:[.1,.83,-1.45]},
 {type:'cylinder',id:'seal',radius:.04,height:.015,color:C.ink,at:[.1,.845,-1.45]}
];
[[-.7,-.4],[.7,-.4],[-.7,.4],[.7,.4]].forEach(function(p){
 act1Props.splice(1,0,{type:'box',size:[.08,.78,.08],color:0x2a180e,at:[p[0],.39,-1.5+p[1]*.9]});
});

var act2Props=[
 {type:'plane',size:[.5,.6],color:0xcfd6d8,unlit:true,at:[0,2.4,-2.89]},
 {type:'box',size:[.03,.6,.03],color:0x111111,at:[-.15,2.4,-2.87]},
 {type:'box',size:[.03,.6,.03],color:0x111111,at:[0,2.4,-2.87]},
 {type:'box',size:[.03,.6,.03],color:0x111111,at:[.15,2.4,-2.87]},
 {type:'spot',color:0xdfe6e8,intensity:6,distance:10,angle:.35,penumbra:.6,decay:1,at:[0,2.4,-2.8],target:[.3,0,-.6]},
 {type:'box',size:[1.8,.3,.8],color:0x3a352f,at:[-1.9,.15,1],solid:true},
 {type:'candle',at:[1.9,0,-2.2],intensity:1.2},
 {type:'box',id:'diary',size:[.3,.04,.4],color:C.parch,at:[.3,.02,-.6]}
];

var act3Props=[
 {type:'box',size:[1.8,.08,1],color:0x4a2c18,at:[0,.8,-1.2],solid:true},
 {type:'candle',at:[.7,.84,-1.4],intensity:2.8}
];
for(var i=0;i<5;i++)act3Props.push({type:'box',size:[.5,.35,.35],color:0x5a3a1a,at:[-3+i*.25,.18,-2.8+(i%2)*.4],solid:true});
act3Props.push(
 {type:'ico',radius:.25,color:0xc9a046,metalness:.8,roughness:.3,at:[2.6,.25,-2.6]},
 {type:'box',id:'map',size:[.6,.01,.42],color:0xe6d4b0,at:[-.1,.85,-1.2]}
);

var act4Props=[
 {type:'box',size:[1.4,.08,.8],color:0x3a2214,at:[0,.78,-1.4],solid:true},
 {type:'candle',at:[-.5,.82,-1.5],intensity:2.4},
 {type:'box',size:[2.5,2.4,.4],color:0x24140b,at:[-2.5,1.2,-3.6],solid:true},
 {type:'box',id:'paper',size:[.4,.01,.5],color:C.parch,at:[.15,.83,-1.35]}
];

var act5Props=[{type:'box',size:[3,1.8,.6],color:0x3a2214,at:[0,.9,-2.9],solid:true}];
for(var r=0;r<3;r++)for(var c=0;c<5;c++){
 act5Props.push({type:'box',size:[.5,.45,.05],color:0x4a2c18,at:[-1.2+c*.6,.4+r*.55,-2.58]});
 act5Props.push({type:'box',size:[.1,.03,.03],color:0xb08a4a,at:[-1.2+c*.6,.4+r*.55,-2.54]});
}
act5Props.push(
 {type:'candle',at:[1.9,0,-1.8],intensity:2.4},
 {type:'box',id:'drawer',size:[.5,.45,.06],color:C.ink,at:[0,.95,-2.55]}
);

window.__STORY__={
 title:'基督山：未寄出的复仇',
 pageTitle:'基督山：未寄出的复仇 · 3D',
 darkRoute:'revenge',
 start:{
  sub:'一封迟了十四年的信',
  html:'<p>五个房间，五封未完的信。走近发光之物，按 E 或点击查看。</p>'+
   '<p style="font-size:13px;color:#7a5a40">电脑：WASD 走动，点击画面锁定视角（Esc 解锁）或按住拖拽。<br>手机：左下摇杆走动，右侧拖拽看；也可直接点物件自动走近。</p>',
  button:'— 推开第一扇门 —'
 },
 acts:[
  {id:'marseille',hud:'第一幕 · 马赛 · 告密',fade:'马赛 · 1815',
   room:{wall:C.wood,floor:0x1e120b,w:8,d:8,spawn:[0,3]},
   props:act1Props,
   interaction:{type:'letter-seal',target:'letter',seal:'seal',label:'一封蜡封的信',
    title:'告密信',sub:'点蜡封三次',clicks:3,firstMsg:'蜡还是温的。',crackMsgs:['裂开一道缝。','再用力些。'],
    text:'<p>“爱德蒙·唐泰斯，拿破仑党人。”</p><p>字迹你认得——是你最信任的人。明早，你就要成婚。窗外的港口，灯一盏盏熄了。</p>',
    options:[
     {text:'立刻去对质',record:'对质',route:'revenge'},
     {text:'装作不知，把信烧掉',record:'装作不知',route:''},
     {text:'把信交给第三个人',record:'交给第三人',route:''}
    ]}},
  {id:'chateau-dif',hud:'第二幕 · 伊夫堡 · 十四年',fade:'十四年后……',
   room:{wall:C.stone,floor:0x2e2a25,w:6,d:6,fog:0x07080a,spawn:[0,2]},
   props:act2Props,
   interaction:{type:'diary',target:'diary',label:'空白的日记',
    title:'狱中日记',sub:'空白页 · 如何起笔',
    intro:'<p>法利亚神父把笔塞进你手里：“先写下最痛的那一句。”</p>',
    pains:['我不是没想过原谅，只是没人来道歉。','十四年，我只记得那封信的折痕。','如果当初我没有那样信任他们。'],
    after:'<p>墨迹未干，神父咳着说：隧道还差最后一段。</p>',
    options:[{text:'与他共笔，一起挖完',record:'共笔越狱'},{text:'独自装进裹尸袋',record:'裹尸袋出逃'}]}},
  {id:'treasure',hud:'第三幕 · 宝藏 · 身份',fade:'基督山岛',
   room:{wall:0x3a2616,floor:0x24160c,w:8,d:7,spawn:[0,2.5]},
   props:act3Props,
   interaction:{type:'name',target:'map',label:'羊皮地图',
    title:'宝藏与名字',text:'<p>金子在烛光里发烫。走出这间洞室，你要用哪个名字？</p>',
    options:[
     {text:'基督山伯爵',record:'基督山伯爵',set:{name:'基督山伯爵'},route:'revenge'},
     {text:'仍是爱德蒙·唐泰斯',record:'爱德蒙·唐泰斯',set:{name:'爱德蒙·唐泰斯'},route:'mercy'},
     {text:'双名并存',record:'双名',set:{name:'双名'},
      toggle:{button:'切换读法',proceed:'带着两个名字去巴黎',readings:[
       {title:'伯爵的读法',text:'“债，要连本带利。”声音陌生，像别人借你的喉咙。',dark:true},
       {title:'唐泰斯的读法',text:'“我只想回家。”声音很轻，像十九岁那年。',dark:false}
      ]}}
    ]}},
  {id:'paris',hud:'第四幕 · 巴黎 · 清算',fade:'巴黎',
   room:{wall:C.wood,floor:0x2a1a10,w:8,d:8,spawn:[0,3]},
   props:act4Props,
   interaction:{type:'gazette',target:'paper',label:'巴黎号外',
    title:'号外',text:'<p>“某爵士旧案重提。”所有当年的人都在巴黎，名字一个个印在纸上。</p>',
    options:[
     {text:'公开揭露一切',record:'公开揭露',route:'revenge'},
     {text:'慢慢拆掉他们的人生',record:'慢慢拆人生',route:'revenge'},
     {text:'删掉复仇，改写成和解',record:'删改为和解',route:'mercy',
      wall:{words:['恨','报仇','毁掉','血债'],label:'划掉「{w}」',
       hudStart:'删改馆 · 点掉墙上 {n} 个词',hudLeft:'删改馆 · 还剩 {n} 个词',
       doneTitle:'删改馆',doneText:'墙上只剩划痕。你发现删掉的字，比写下它们更费力气。',doneOption:'去尾声'}}
    ]}},
  {id:'dead-letters',hud:'尾声 · 未寄出',fade:'尾声',
   room:function(S){return {wall:S.route==='revenge'?0x1a0f0a:0x3a2616,floor:0x24160c,w:7,d:7,spawn:[0,2.5]}},
   props:act5Props,
   interaction:{type:'dead-letter',target:'drawer',label:'死信柜',
    title:'未寄出的信',
    text:'<p><i>“{pain}”</i></p><p>十四年前的那一句，如今就写在信首。它可以寄出，也可以永远锁在这里。</p>',
    options:[
     {text:'寄出',ending:'寄出'},
     {text:'锁进死信柜',ending:'锁进死信柜',lock:{title:'锁柜',sub:'点蜡封确认',clicks:2,push:[0,0,-.04]}}
    ]}}
 ],
 catalog:{
  title:'你的版本目录',
  template:'《基督山：未寄出的复仇》· 你的版本目录\n'+
   '第一幕 马赛：{choice0}\n第二幕 伊夫堡：{choice1}｜痛句：{pain}\n第三幕 宝藏：{choice2}'+
   '\n第四幕 巴黎：{choice3}\n尾声：{ending}\n文风：{route=revenge?墨黑锐利:羊皮暖光}',
  restartFade:'马赛'
 }
};
})();
