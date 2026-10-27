/* 基督山：未寄出的复仇 · v3 Three.js（全局 THREE，file:// 可开） */
(function(){
'use strict';
var C={wood:0x2B1810,parch:0xF4ECDF,ink:0x4A0E1F,stone:0x5a554e,candle:0xffb066};
var S={act:0,choices:[],pain:'',name:'',route:'',ending:''};
var renderer=new THREE.WebGLRenderer({antialias:window.devicePixelRatio<2});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
renderer.setSize(innerWidth,innerHeight);
document.body.insertBefore(renderer.domElement,document.body.firstChild);
var scene=new THREE.Scene();
var cam=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,0.05,60);
var yaw=0,pitch=0,pos=new THREE.Vector3(0,1.6,3);
var colliders=[],hotspots=[],flames=[],roomGroup=null,bound=4.5;
var $=function(id){return document.getElementById(id)};
var panel=$('panel'),hint=$('hint'),hud=$('hud'),fade=$('fade');
var busy=true,keys={},autoTarget=null;

function mat(c,o){o=o||{};o.color=c;o.roughness=o.roughness==null?0.85:o.roughness;return new THREE.MeshStandardMaterial(o)}
function box(w,h,d,c,x,y,z,col){var m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c));m.position.set(x,y,z);roomGroup.add(m);
 if(col)colliders.push({minX:x-w/2-.25,maxX:x+w/2+.25,minZ:z-d/2-.25,maxZ:z+d/2+.25});return m}
function candle(x,y,z,intensity){box(.06,.18,.06,C.parch,x,y+.09,z);
 var f=new THREE.Mesh(new THREE.SphereGeometry(.035,6,6),new THREE.MeshBasicMaterial({color:0xffd08a}));f.position.set(x,y+.22,z);roomGroup.add(f);
 var l=new THREE.PointLight(C.candle,intensity||2.2,7,1.6);l.position.set(x,y+.35,z);roomGroup.add(l);flames.push({l:l,f:f,b:intensity||2.2});}
function room(wallC,floorC,w,d,fogC){
 if(roomGroup)scene.remove(roomGroup);roomGroup=new THREE.Group();scene.add(roomGroup);
 colliders=[];hotspots=[];flames=[];bound=w/2-.35;
 scene.fog=new THREE.Fog(fogC||0x0b0604,3,13);scene.background=new THREE.Color(fogC||0x0b0604);
 var fl=new THREE.Mesh(new THREE.PlaneGeometry(w,d),mat(floorC));fl.rotation.x=-Math.PI/2;roomGroup.add(fl);
 var ce=new THREE.Mesh(new THREE.PlaneGeometry(w,d),mat(0x120a06));ce.rotation.x=Math.PI/2;ce.position.y=3.2;roomGroup.add(ce);
 box(w,3.2,.2,wallC,0,1.6,-d/2);box(w,3.2,.2,wallC,0,1.6,d/2);box(.2,3.2,d,wallC,-w/2,1.6,0);box(.2,3.2,d,wallC,w/2,1.6,0);
 roomGroup.add(new THREE.AmbientLight(0x3a2a20,0.9));
}
function hotspot(mesh,label,fn){mesh.userData={label:label,fn:fn};hotspots.push(mesh);
 var g=new THREE.Mesh(new THREE.SphereGeometry(.05,6,6),new THREE.MeshBasicMaterial({color:0xffe2a8}));
 g.position.copy(mesh.position);g.position.y+=.35;roomGroup.add(g);mesh.userData.glow=g;}
function textPlane(txt,w,h,col,bg){var cv=document.createElement('canvas');cv.width=512;cv.height=Math.round(512*h/w);var x=cv.getContext('2d');
 x.fillStyle=bg||'#F4ECDF';x.fillRect(0,0,cv.width,cv.height);x.fillStyle=col||'#2B1810';x.font='bold '+Math.round(cv.height*.16)+'px serif';
 x.textAlign='center';x.textBaseline='middle';txt.split('\n').forEach(function(t,i,a){x.fillText(t,256,cv.height/2+(i-(a.length-1)/2)*cv.height*.22)});
 var tx=new THREE.CanvasTexture(cv);return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:tx,roughness:.9}));}

/* ---------- UI ---------- */
function show(html,dark){panel.innerHTML=html;panel.style.display='block';panel.classList.toggle('dark',!!dark);busy=true;if(document.exitPointerLock)document.exitPointerLock();}
function hide(){panel.style.display='none';busy=false}
function opts(list){return list.map(function(o,i){return '<button class="opt" data-i="'+i+'">'+o+'</button>'}).join('')}
function bindOpts(fn){[].forEach.call(panel.querySelectorAll('.opt'),function(b){b.onclick=function(){fn(+b.dataset.i)}})}
function transition(title,fn){busy=true;fade.textContent=title;fade.classList.add('on');setTimeout(function(){fn();setTimeout(function(){fade.classList.remove('on');busy=false},500)},900)}
var dark=function(){return S.route==='revenge'};

/* ---------- 幕1 马赛夜室 ---------- */
function act1(){S.act=1;hud.textContent='第一幕 · 马赛 · 告密';
 room(C.wood,0x1e120b,8,8);pos.set(0,1.6,3);yaw=0;pitch=0;
 box(1.6,.08,.9,0x3a2214,0,.78,-1.5,true);[[-.7,-.4],[.7,-.4],[-.7,.4],[.7,.4]].forEach(function(p){box(.08,.78,.08,0x2a180e,p[0],.39,-1.5+p[1]*.9)});
 candle(-.5,.82,-1.6,2.6);box(.4,.8,.4,0x3a2214,1.8,.4,1.5,true);
 var w=textPlane('马赛港\n1815',1.2,.8,'#4A0E1F');w.position.set(0,1.9,-3.88);roomGroup.add(w);
 var letter=box(.32,.01,.22,C.parch,.1,.83,-1.45);var seal=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,.015,12),mat(C.ink));seal.position.set(.1,.845,-1.45);roomGroup.add(seal);
 hotspot(letter,'一封蜡封的信',function(){var n=0;
  show('<h2>告密信</h2><div class="sub">点蜡封三次</div><div class="seal" id="sl">✠</div><p id="sm" style="text-align:center;font-size:13px">蜡还是温的。</p>');
  $('sl').onclick=function(){n++;this.style.transform='rotate('+n*25+'deg)';this.style.opacity=1-n*.25;seal.scale.setScalar(1-n*.3);
   if(n<3){$('sm').textContent=['裂开一道缝。','再用力些。'][n-1];return}
   roomGroup.remove(seal);
   show('<h2>告密信</h2><p>“爱德蒙·唐泰斯，拿破仑党人。”</p><p>字迹你认得——是你最信任的人。明早，你就要成婚。窗外的港口，灯一盏盏熄了。</p>'+opts(['立刻去对质','装作不知，把信烧掉','把信交给第三个人']));
   bindOpts(function(i){S.choices.push(['对质','装作不知','交给第三人'][i]);S.route=i===0?'revenge':'';hide();transition('十四年后……',act2)});
  };});
}
/* ---------- 幕2 伊夫堡牢房 ---------- */
var PAINS=['我不是没想过原谅，只是没人来道歉。','十四年，我只记得那封信的折痕。','如果当初我没有那样信任他们。'];
function act2(){S.act=2;hud.textContent='第二幕 · 伊夫堡 · 十四年';
 room(C.stone,0x2e2a25,6,6,0x07080a);pos.set(0,1.6,2);yaw=0;
 var win=new THREE.Mesh(new THREE.PlaneGeometry(.5,.6),new THREE.MeshBasicMaterial({color:0xcfd6d8}));win.position.set(0,2.4,-2.89);roomGroup.add(win);
 for(var i=-1;i<=1;i++)box(.03,.6,.03,0x111111,i*.15,2.4,-2.87);
 var sl=new THREE.SpotLight(0xdfe6e8,6,10,.35,.6,1);sl.position.set(0,2.4,-2.8);sl.target.position.set(.3,0,-.6);roomGroup.add(sl);roomGroup.add(sl.target);
 box(1.8,.3,.8,0x3a352f,-1.9,.15,1,true);candle(1.9,.0,-2.2,1.2);
 var diary=box(.3,.04,.4,C.parch,.3,.02,-.6);
 hotspot(diary,'空白的日记',function(){
  show('<h2>狱中日记</h2><div class="sub">空白页 · 如何起笔</div><p>法利亚神父把笔塞进你手里：“先写下最痛的那一句。”</p>'+opts(PAINS),dark());
  bindOpts(function(i){S.pain=PAINS[i];
   show('<h2>狱中日记</h2><p>墨迹未干，神父咳着说：隧道还差最后一段。</p>'+opts(['与他共笔，一起挖完','独自装进裹尸袋']),dark());
   bindOpts(function(j){S.choices.push(['共笔越狱','裹尸袋出逃'][j]);hide();transition('基督山岛',act3)});});});
}
/* ---------- 幕3 宝藏室 ---------- */
function act3(){S.act=3;hud.textContent='第三幕 · 宝藏 · 身份';
 room(0x3a2616,0x24160c,8,7);pos.set(0,1.6,2.5);yaw=0;
 box(1.8,.08,1,0x4a2c18,0,.8,-1.2,true);candle(.7,.84,-1.4,2.8);
 for(var i=0;i<5;i++){var ch=box(.5,.35,.35,0x5a3a1a,-3+i*.25,.18,-2.8+((i%2)*.4),true);}
 var g=new THREE.Mesh(new THREE.IcosahedronGeometry(.25,0),mat(0xc9a046,{metalness:.8,roughness:.3}));g.position.set(2.6,.25,-2.6);roomGroup.add(g);
 var map=box(.6,.01,.42,0xe6d4b0,-.1,.85,-1.2);
 hotspot(map,'羊皮地图',function(){
  show('<h2>宝藏与名字</h2><p>金子在烛光里发烫。走出这间洞室，你要用哪个名字？</p>'+opts(['基督山伯爵','仍是爱德蒙·唐泰斯','双名并存']),dark());
  bindOpts(function(i){S.name=['基督山伯爵','爱德蒙·唐泰斯','双名'][i];S.choices.push(S.name);
   if(i===0)S.route='revenge';if(i===1)S.route='mercy';
   if(i===2){var a=true;var r=function(){show('<h2>'+(a?'伯爵':'唐泰斯')+'的读法</h2><p>'+(a?'“债，要连本带利。”声音陌生，像别人借你的喉咙。':'“我只想回家。”声音很轻，像十九岁那年。')+'</p><button class="toggle" id="tg">切换读法</button>'+opts(['带着两个名字去巴黎']),a);
     $('tg').onclick=function(){a=!a;r()};bindOpts(function(){hide();transition('巴黎',act4)})};r();}
   else{hide();transition('巴黎',act4)}});});
}
/* ---------- 幕4 巴黎书房 ---------- */
var BAD=['恨','报仇','毁掉','血债'];
function act4(){S.act=4;hud.textContent='第四幕 · 巴黎 · 清算';
 room(C.wood,0x2a1a10,8,8);pos.set(0,1.6,3);yaw=0;
 box(1.4,.08,.8,0x3a2214,0,.78,-1.4,true);candle(-.5,.82,-1.5,2.4);
 box(2.5,2.4,.4,0x24140b,-2.5,1.2,-3.6,true);
 var paper=box(.4,.01,.5,C.parch,.15,.83,-1.35);
 hotspot(paper,'巴黎号外',function(){
  show('<h2>号外</h2><p>“某爵士旧案重提。”所有当年的人都在巴黎，名字一个个印在纸上。</p>'+opts(['公开揭露一切','慢慢拆掉他们的人生','删掉复仇，改写成和解']),dark());
  bindOpts(function(i){S.choices.push(['公开揭露','慢慢拆人生','删改为和解'][i]);
   if(i<2){S.route='revenge';hide();transition('尾声',act5);return}
   S.route='mercy';hide();
   // 墙上贴字，点掉才过关
   var left=BAD.length;
   BAD.forEach(function(w,k){var t=textPlane(w,.6,.4,'#4A0E1F');t.position.set(-1.5+k,1.7+(k%2)*.4,-3.88);t.rotation.z=(k%2?.06:-.05);roomGroup.add(t);
    hotspot(t,'划掉「'+w+'」',function(){var c=document.createElement('canvas');
     t.material.color.set(0x8a7a6a);t.scale.y=.25;hotspots.splice(hotspots.indexOf(t),1);roomGroup.remove(t.userData.glow);left--;
     hud.textContent='删改馆 · 还剩 '+left+' 个词';
     if(!left){show('<h2>删改馆</h2><p>墙上只剩划痕。你发现删掉的字，比写下它们更费力气。</p>'+opts(['去尾声']));bindOpts(function(){hide();transition('尾声',act5)})}});});
   hud.textContent='删改馆 · 点掉墙上 4 个词';});});
}
/* ---------- 幕5 死信柜 ---------- */
function act5(){S.act=5;hud.textContent='尾声 · 未寄出';
 room(S.route==='revenge'?0x1a0f0a:0x3a2616,0x24160c,7,7);pos.set(0,1.6,2.5);yaw=0;
 var cab=box(3,1.8,.6,0x3a2214,0,.9,-2.9,true);
 for(var r=0;r<3;r++)for(var c=0;c<5;c++){box(.5,.45,.05,0x4a2c18,-1.2+c*.6,.4+r*.55,-2.58);box(.1,.03,.03,0xb08a4a,-1.2+c*.6,.4+r*.55,-2.54)}
 candle(1.9,.0,-1.8,2.4);
 var dr=box(.5,.45,.06,C.ink,0,.95,-2.55);
 hotspot(dr,'死信柜',function(){
  show('<h2>未寄出的信</h2><p><i>“'+S.pain+'”</i></p><p>十四年前的那一句，如今就写在信首。它可以寄出，也可以永远锁在这里。</p>'+opts(['寄出','锁进死信柜']),dark());
  bindOpts(function(i){if(i===0){S.ending='寄出';catalog();return}
   var n=0;show('<h2>锁柜</h2><div class="sub">点蜡封确认</div><div class="seal" id="sl">✠</div>',dark());
   $('sl').onclick=function(){if(++n<2){this.style.transform='scale(.9)';return}S.ending='锁进死信柜';dr.position.z=-2.59;catalog()}});});
}
function catalog(){
 var t='《基督山：未寄出的复仇》· 你的版本目录\n'+
  '第一幕 马赛：'+S.choices[0]+'\n第二幕 伊夫堡：'+S.choices[1]+'｜痛句：'+S.pain+'\n第三幕 宝藏：'+S.choices[2]+
  '\n第四幕 巴黎：'+S.choices[3]+'\n尾声：'+S.ending+'\n文风：'+(S.route==='revenge'?'墨黑锐利':'羊皮暖光');
 show('<h2>你的版本目录</h2><textarea id="ta" readonly>'+t+'</textarea>'+opts(['复制全文','重新开始']),dark());
 bindOpts(function(i){if(i===0){var ta=$('ta');ta.select();
   (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).catch(function(){document.execCommand('copy')});panel.querySelector('.opt').textContent='已复制';}
  else{S={act:0,choices:[],pain:'',name:'',route:'',ending:''};hide();transition('马赛',act1)}});
}

/* ---------- 输入 ---------- */
var cv=renderer.domElement,ray=new THREE.Raycaster(),near=null;
addEventListener('keydown',function(e){keys[e.code]=1;if(e.code==='KeyE'&&near&&!busy)near.userData.fn()});
addEventListener('keyup',function(e){keys[e.code]=0});
var drag=null,locked=false;
document.addEventListener('pointerlockchange',function(){locked=document.pointerLockElement===cv});
document.addEventListener('mousemove',function(e){if(locked){yaw-=e.movementX*.0025;pitch=clamp(pitch-e.movementY*.0025)}});
function clamp(p){return Math.max(-1.2,Math.min(1.2,p))}
var touchMode='ontouchstart' in window;if(touchMode)$('joy').style.display='block';
cv.addEventListener('pointerdown',function(e){drag={id:e.pointerId,x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,t:Date.now()}});
cv.addEventListener('pointermove',function(e){if(!drag||drag.id!==e.pointerId||locked)return;yaw-=(e.clientX-drag.x)*.005;pitch=clamp(pitch-(e.clientY-drag.y)*.005);drag.x=e.clientX;drag.y=e.clientY});
cv.addEventListener('pointerup',function(e){if(!drag)return;var tap=Math.abs(e.clientX-drag.sx)+Math.abs(e.clientY-drag.sy)<10&&Date.now()-drag.t<400;drag=null;
 if(!tap||busy)return;
 var p=locked?new THREE.Vector2(0,0):new THREE.Vector2(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);
 ray.setFromCamera(p,cam);var hit=ray.intersectObjects(hotspots)[0];
 if(hit){if(hit.object.position.distanceTo(cam.position)<2.4)hit.object.userData.fn();else autoTarget=hit.object;}
 else if(!touchMode&&!locked&&cv.requestPointerLock){try{cv.requestPointerLock()}catch(x){}}});
var joy={x:0,y:0,id:null},J=$('joy'),K=$('knob');
J.addEventListener('pointerdown',function(e){joy.id=e.pointerId;J.setPointerCapture(e.pointerId);mv(e)});
J.addEventListener('pointermove',function(e){if(joy.id===e.pointerId)mv(e)});
J.addEventListener('pointerup',function(){joy.id=null;joy.x=joy.y=0;K.style.left=K.style.top='35px'});
function mv(e){var r=J.getBoundingClientRect(),dx=e.clientX-r.left-55,dy=e.clientY-r.top-55,l=Math.min(45,Math.hypot(dx,dy))/(Math.hypot(dx,dy)||1);
 dx*=l;dy*=l;K.style.left=35+dx+'px';K.style.top=35+dy+'px';joy.x=dx/45;joy.y=dy/45}
addEventListener('resize',function(){cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});

function tryMove(dx,dz){var nx=pos.x+dx,nz=pos.z+dz;
 function blocked(x,z){if(Math.abs(x)>bound||Math.abs(z)>bound)return true;for(var i=0;i<colliders.length;i++){var c=colliders[i];if(x>c.minX&&x<c.maxX&&z>c.minZ&&z<c.maxZ)return true}return false}
 if(!blocked(nx,pos.z))pos.x=nx;if(!blocked(pos.x,nz))pos.z=nz;}

var clock=new THREE.Clock();
function loop(){requestAnimationFrame(loop);var dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime;
 if(!busy){var f=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0)-joy.y,s=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)+joy.x;
  if(autoTarget){var tx=autoTarget.position.x-pos.x,tz=autoTarget.position.z-pos.z,d=Math.hypot(tx,tz);
   if(d<1.3||f||s){autoTarget=null}else{yaw=Math.atan2(-tx,-tz);var ox=pos.x,oz=pos.z;tryMove(tx/d*2*dt,tz/d*2*dt);if(ox===pos.x&&oz===pos.z)autoTarget=null}}
  var sp=2.2*dt,sy=Math.sin(yaw),cy=Math.cos(yaw);if(f||s)tryMove((-sy*f+cy*s)*sp,(-cy*f-sy*s)*sp);}
 cam.position.copy(pos);cam.rotation.set(pitch,yaw,0,'YXZ');
 flames.forEach(function(o,i){o.l.intensity=o.b*(.85+.15*Math.sin(t*9+i)+.05*Math.sin(t*23))});
 near=null;var best=2.4;hotspots.forEach(function(h){var d=h.position.distanceTo(cam.position);if(h.userData.glow)h.userData.glow.position.y=h.position.y+.35+.04*Math.sin(t*3);if(d<best){best=d;near=h}});
 if(near&&!busy){hint.style.display='block';hint.textContent=near.userData.label+' · 按 E / 点击查看'}else hint.style.display='none';
 renderer.render(scene,cam);}
$('go').onclick=function(){$('start').style.display='none';transition('马赛 · 1815',act1)};
act1();busy=true;loop();
window.__MC=S;
})();
