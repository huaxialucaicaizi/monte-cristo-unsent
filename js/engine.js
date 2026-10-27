/* 可换书 3D 互动小说引擎 · 依赖全局 THREE 与 window.__STORY__（见 stories/_skeleton/story.js） */
(function(){
'use strict';
var ST=window.__STORY__;
var $=function(id){return document.getElementById(id)};
if(!ST||!ST.acts||!ST.acts.length){$('st-body').innerHTML='<p>剧本缺少 acts。</p>';return}

function extend(a,b){for(var k in b)if(Object.prototype.hasOwnProperty.call(b,k))a[k]=b[k];return a}
var PAL=extend({parch:0xF4ECDF,ink:0x4A0E1F,candle:0xffb066,flame:0xffd08a,ceiling:0x120a06,ambient:0x3a2a20,fog:0x0b0604},ST.palette||{});
var UI=extend({hint:' · 按 E / 点击查看',copy:'复制全文',copied:'已复制',restart:'重新开始',catalogTitle:'你的版本目录',sealGlyph:'✠'},ST.ui||{});
var ACTS=ST.acts;
function newState(){return {act:0,choices:[],route:'',ending:''}}
var S=newState();

var renderer=new THREE.WebGLRenderer({antialias:window.devicePixelRatio<2});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
renderer.setSize(innerWidth,innerHeight);
document.body.insertBefore(renderer.domElement,document.body.firstChild);
var scene=new THREE.Scene();
var cam=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,0.05,60);
var yaw=0,pitch=0,pos=new THREE.Vector3(0,1.6,3);
var colliders=[],hotspots=[],flames=[],roomGroup=null,bound=4.5,curRoom=null;
var panel=$('panel'),hint=$('hint'),hud=$('hud'),fade=$('fade');
var busy=true,keys={},autoTarget=null;

/* ---------- 模板：{pain} {choice0} {route=revenge?甲:乙} ---------- */
function fill(t){
 if(t==null)return '';if(typeof t==='function')return String(t(S));
 return String(t).replace(/\{(\w+)(?:=([^?{}]*)\?([^:{}]*):([^{}]*))?\}/g,function(m,k,eq,a,b){
  var cm=/^choice(\d+)$/.exec(k),v=cm?S.choices[+cm[1]]:S[k];
  if(eq!==undefined)return String(v==null?'':v)===eq?a:b;
  return v==null?'':v;});
}
function val(v){return typeof v==='function'?v(S):v}
function dark(){return !!ST.darkRoute&&S.route===ST.darkRoute}

/* ---------- 场景积木 ---------- */
function mat(c,o){o=o||{};o.color=c;o.roughness=o.roughness==null?0.85:o.roughness;return new THREE.MeshStandardMaterial(o)}
function place(m,at){m.position.set(at[0],at[1],at[2]);roomGroup.add(m);return m}
function box(w,h,d,c,x,y,z,col){var m=place(new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c)),[x,y,z]);
 if(col)colliders.push({minX:x-w/2-.25,maxX:x+w/2+.25,minZ:z-d/2-.25,maxZ:z+d/2+.25});return m}
function candle(x,y,z,intensity){var b=intensity||2.2;box(.06,.18,.06,PAL.parch,x,y+.09,z);
 var f=place(new THREE.Mesh(new THREE.SphereGeometry(.035,6,6),new THREE.MeshBasicMaterial({color:PAL.flame})),[x,y+.22,z]);
 var l=place(new THREE.PointLight(PAL.candle,b,7,1.6),[x,y+.35,z]);flames.push({l:l,f:f,b:b});}
function textPlane(txt,w,h,col,bg){var cv=document.createElement('canvas');cv.width=512;cv.height=Math.round(512*h/w);var x=cv.getContext('2d');
 x.fillStyle=bg||'#F4ECDF';x.fillRect(0,0,cv.width,cv.height);x.fillStyle=col||'#2B1810';x.font='bold '+Math.round(cv.height*.16)+'px serif';
 x.textAlign='center';x.textBaseline='middle';txt.split('\n').forEach(function(t,i,a){x.fillText(t,256,cv.height/2+(i-(a.length-1)/2)*cv.height*.22)});
 var tx=new THREE.CanvasTexture(cv);return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({map:tx,roughness:.9}));}
function room(r){
 if(roomGroup)scene.remove(roomGroup);roomGroup=new THREE.Group();scene.add(roomGroup);
 colliders=[];hotspots=[];flames=[];curRoom=r;var w=r.w||8,d=r.d||8,fogC=r.fog||PAL.fog;bound=w/2-.35;
 scene.fog=new THREE.Fog(fogC,3,13);scene.background=new THREE.Color(fogC);
 var fl=new THREE.Mesh(new THREE.PlaneGeometry(w,d),mat(r.floor));fl.rotation.x=-Math.PI/2;roomGroup.add(fl);
 var ce=new THREE.Mesh(new THREE.PlaneGeometry(w,d),mat(r.ceiling||PAL.ceiling));ce.rotation.x=Math.PI/2;ce.position.y=3.2;roomGroup.add(ce);
 box(w,3.2,.2,r.wall,0,1.6,-d/2);box(w,3.2,.2,r.wall,0,1.6,d/2);box(.2,3.2,d,r.wall,-w/2,1.6,0);box(.2,3.2,d,r.wall,w/2,1.6,0);
 roomGroup.add(new THREE.AmbientLight(r.ambient||PAL.ambient,r.ambientIntensity==null?0.9:r.ambientIntensity));
}
function prop(p){var a=p.at||[0,0,0],s=p.size||[1,1,1],m=null;
 switch(p.type){
  case 'box':m=box(s[0],s[1],s[2],p.color,a[0],a[1],a[2],p.solid);break;
  case 'candle':candle(a[0],a[1],a[2],p.intensity);break;
  case 'text':m=place(textPlane(p.text,s[0],s[1],p.color,p.bg),a);if(p.rotZ)m.rotation.z=p.rotZ;break;
  case 'plane':m=place(new THREE.Mesh(new THREE.PlaneGeometry(s[0],s[1]),p.unlit?new THREE.MeshBasicMaterial({color:p.color}):mat(p.color)),a);break;
  case 'cylinder':m=place(new THREE.Mesh(new THREE.CylinderGeometry(p.radius,p.radius,p.height,p.segments||12),mat(p.color)),a);break;
  case 'ico':m=place(new THREE.Mesh(new THREE.IcosahedronGeometry(p.radius,0),mat(p.color,{metalness:p.metalness||0,roughness:p.roughness})),a);break;
  case 'spot':var sl=place(new THREE.SpotLight(p.color,p.intensity,p.distance,p.angle,p.penumbra,p.decay),a);
   var t=p.target||[0,0,0];sl.target.position.set(t[0],t[1],t[2]);roomGroup.add(sl.target);m=sl;break;
  case 'light':m=place(new THREE.PointLight(p.color,p.intensity,p.distance||7,p.decay||1.6),a);break;
  default:console.warn('未知 prop 类型',p.type);
 }
 return m;
}
function hotspot(mesh,label,fn){mesh.userData={label:label,fn:fn};hotspots.push(mesh);
 var g=new THREE.Mesh(new THREE.SphereGeometry(.05,6,6),new THREE.MeshBasicMaterial({color:0xffe2a8}));
 g.position.copy(mesh.position);g.position.y+=.35;roomGroup.add(g);mesh.userData.glow=g;}

/* ---------- UI ---------- */
function show(html,dk){panel.innerHTML=html;panel.style.display='block';panel.classList.toggle('dark',!!dk);busy=true;if(document.exitPointerLock)document.exitPointerLock();}
function hide(){panel.style.display='none';busy=false}
function head(title,sub){return '<h2>'+fill(title)+'</h2>'+(sub?'<div class="sub">'+fill(sub)+'</div>':'')}
function opts(list){return list.map(function(o,i){return '<button class="opt" data-i="'+i+'">'+fill(typeof o==='string'?o:o.text)+'</button>'}).join('')}
function bindOpts(fn){[].forEach.call(panel.querySelectorAll('.opt'),function(b){b.onclick=function(){fn(+b.dataset.i)}})}
function transition(title,fn){busy=true;fade.textContent=title;fade.classList.add('on');setTimeout(function(){fn();setTimeout(function(){fade.classList.remove('on');busy=false},500)},900)}
function sealHtml(ix,msg){return '<div class="seal" id="sl">'+(ix.glyph||UI.sealGlyph)+'</div>'+(msg!=null?'<p id="sm" style="text-align:center;font-size:13px">'+fill(msg)+'</p>':'')}

/* ---------- 幕切换 ---------- */
function actIndex(id){for(var i=0;i<ACTS.length;i++)if(ACTS[i].id===id)return i;return -1}
function enter(i){var A=ACTS[i];S.act=i+1;S.actId=A.id;hud.textContent=fill(A.hud);
 var r=val(A.room)||{};room(r);var sp=r.spawn||[0,3];pos.set(sp[0],1.6,sp[1]);yaw=r.yaw||0;pitch=0;autoTarget=null;
 var P={};(val(A.props)||[]).forEach(function(p){var m=prop(p);if(p.id&&m)P[p.id]=m});
 (A.interactions||(A.interaction?[A.interaction]:[])).forEach(function(ix){
  var mesh=P[ix.target];if(!mesh){console.warn('交互 target 不存在：',ix.target);return}
  var fn=TYPES[ix.type];if(!fn){console.warn('未知交互类型：',ix.type);return}
  hotspot(mesh,fill(ix.label),function(){fn(ix,{mesh:mesh,props:P})});});
}
function go(next){hide();
 if(next==='catalog'){catalog();return}
 var i=next?actIndex(next):S.act;
 if(next&&i<0)console.warn('找不到幕：',next);
 if(i<0||i>=ACTS.length){catalog();return}
 transition(fill(ACTS[i].fade||ACTS[i].hud),function(){enter(i)});
}
/* 选项通用字段：record / route / set / ending / next，以及特效 toggle / wall / lock */
function choose(o,ctx){
 if(o.record!=null)S.choices.push(fill(o.record));
 if(o.route!==undefined)S.route=o.route;
 if(o.set)for(var k in o.set)S[k]=fill(o.set[k]);
 if(o.ending!=null)S.ending=fill(o.ending);
 var next=o.next||ctx.next;
 if(o.toggle)return toggle(o.toggle,next);
 if(o.wall)return wall(o.wall,next);
 if(o.lock)return lock(o.lock,ctx,next);
 go(next);
}
function toggle(t,next){var a=0,R=t.readings;
 (function r(){var cur=R[a];
  show(head(cur.title)+'<p>'+fill(cur.text)+'</p><button class="toggle" id="tg">'+fill(t.button||'切换读法')+'</button>'+opts([t.proceed||'继续']),cur.dark==null?dark():cur.dark);
  $('tg').onclick=function(){a=(a+1)%R.length;r()};bindOpts(function(){go(next)});})();
}
function wall(W,next){hide();var words=W.words,left=words.length,d=(curRoom&&curRoom.d)||8,z=W.z!=null?W.z:-d/2+.12;
 var tpl=function(s,o){return String(s).replace(/\{(\w)\}/g,function(m,k){return o[k]})};
 words.forEach(function(w,k){var t=textPlane(w,.6,.4,W.color||'#4A0E1F');t.position.set(-(words.length-1)/2+k,1.7+(k%2)*.4,z);t.rotation.z=(k%2?.06:-.05);roomGroup.add(t);
  hotspot(t,tpl(W.label||'划掉「{w}」',{w:w}),function(){
   t.material.color.set(0x8a7a6a);t.scale.y=.25;hotspots.splice(hotspots.indexOf(t),1);roomGroup.remove(t.userData.glow);left--;
   hud.textContent=tpl(W.hudLeft||'还剩 {n} 个词',{n:left});
   if(!left){show(head(W.doneTitle)+'<p>'+fill(W.doneText)+'</p>'+opts([W.doneOption||'继续']),dark());bindOpts(function(){go(next)})}});});
 hud.textContent=tpl(W.hudStart||'点掉墙上 {n} 个词',{n:left});
}
function lock(L,ctx,next){var n=0,N=L.clicks||2;
 show(head(L.title,L.sub)+sealHtml(L),dark());
 $('sl').onclick=function(){if(++n<N){this.style.transform='scale(.9)';return}
  var p=L.push;if(p&&ctx.mesh){ctx.mesh.position.x+=p[0]||0;ctx.mesh.position.y+=p[1]||0;ctx.mesh.position.z+=p[2]||0}
  go(next||'catalog');};
}

/* ---------- 交互类型 ---------- */
function letterSeal(ix,ctx){var n=0,N=ix.clicks||3,s3=ctx.props[ix.seal];
 show(head(ix.title,ix.sub)+sealHtml(ix,ix.firstMsg||''),dark());
 $('sl').onclick=function(){n++;this.style.transform='rotate('+n*25+'deg)';this.style.opacity=1-n/(N+1);if(s3)s3.scale.setScalar(Math.max(.05,1-n*.9/N));
  if(n<N){$('sm').textContent=fill((ix.crackMsgs||[])[n-1]||'');return}
  if(s3)roomGroup.remove(s3);
  show(head(ix.title)+fill(ix.text)+opts(ix.options),dark());
  bindOpts(function(i){choose(ix.options[i],ctx)});};
}
function diary(ix,ctx){var P=ix.pains;
 show(head(ix.title,ix.sub)+fill(ix.intro)+opts(P),dark());
 bindOpts(function(i){S[ix.painKey||'pain']=fill(P[i]);
  if(!ix.options||!ix.options.length)return go(ix.next);
  show(head(ix.title)+fill(ix.after)+opts(ix.options),dark());
  bindOpts(function(j){choose(ix.options[j],ctx)});});
}
function choice(ix,ctx){
 show(head(ix.title,ix.sub)+fill(ix.text)+opts(ix.options),dark());
 bindOpts(function(i){choose(ix.options[i],ctx)});
}
var TYPES={
 'letter-seal':letterSeal,
 'diary':diary,
 'choice':choice,'map':choice,'name':choice,'gazette':choice,
 'dead-letter':function(ix,ctx){ctx.next=ix.next||'catalog';choice(ix,ctx)}
};

function catalog(){var C=ST.catalog||{},t=fill(C.template||'{choices}');
 show(head(C.title||UI.catalogTitle)+'<textarea id="ta" readonly></textarea>'+opts([C.copy||UI.copy,C.restart||UI.restart]),dark());
 $('ta').value=t;
 bindOpts(function(i){if(i===0){var ta=$('ta');ta.select();
   (navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).catch(function(){document.execCommand('copy')});panel.querySelector('.opt').textContent=fill(C.copied||UI.copied);}
  else{S=newState();window.__GAME__.state=S;hide();transition(fill(C.restartFade||ACTS[0].fade||''),function(){enter(0)})}});
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
 if(near&&!busy){hint.style.display='block';hint.textContent=near.userData.label+UI.hint}else hint.style.display='none';
 renderer.render(scene,cam);}

/* ---------- 开场 ---------- */
var st=ST.start||{};
document.title=ST.pageTitle||ST.title||document.title;
$('st-title').innerHTML=fill(st.title||ST.title);
$('st-sub').innerHTML=fill(st.sub||ST.subtitle||'');
$('st-body').innerHTML=fill(st.html||'');
$('go').textContent=fill(st.button||'— 开始 —');$('go').style.display='block';
$('go').onclick=function(){$('start').style.display='none';transition(fill(ACTS[0].fade||''),function(){enter(0)})};
enter(0);busy=true;loop();
window.__GAME__={state:S,story:ST,go:go,hotspots:function(){return hotspots.slice()}};
})();
