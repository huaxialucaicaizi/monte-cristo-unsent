(function(){
'use strict';
var STORAGE_MIN_CLIENT_VERSION=9460;
var STORAGE_PREFIX='red-chamber:';

function readBuildVersion(options){
 var env=options&&options.miniToolEnv;
 return Number(env&&env.buildVersion)||0;
}
function clientVersion(buildVersion){return Math.floor(buildVersion/1000)}
function getBuildVersion(){
 var xhs=window.xhs,sync=readBuildVersion(xhs&&xhs.launchOptions);
 if(sync)return Promise.resolve(sync);
 var mini=xhs&&xhs.miniTool;
 if(!mini||typeof mini.getLaunchOptions!=='function')return Promise.resolve(0);
 return mini.getLaunchOptions().then(readBuildVersion).catch(function(){return 0});
}
function fallbackGet(key){
 try{var value=localStorage.getItem(STORAGE_PREFIX+key);return value===null?null:JSON.parse(value)}catch(error){return null}
}
function fallbackSet(key,data){
 try{localStorage.setItem(STORAGE_PREFIX+key,JSON.stringify(data));return true}catch(error){return false}
}
function getLocalData(key){
 return getBuildVersion().then(function(buildVersion){
  var mini=window.xhs&&window.xhs.miniTool;
  if(clientVersion(buildVersion)>=STORAGE_MIN_CLIENT_VERSION&&mini&&typeof mini.getStorage==='function'){
   return mini.getStorage({key:STORAGE_PREFIX+key}).then(function(result){
    if(!result||result.data===null)return null;
    try{return JSON.parse(result.data)}catch(error){return null}
   }).catch(function(){return null});
  }
  return fallbackGet(key);
 });
}
function setLocalData(key,data){
 var serialized;
 try{serialized=JSON.stringify(data)}catch(error){return Promise.resolve(false)}
 if(typeof serialized!=='string')return Promise.resolve(false);
 return getBuildVersion().then(function(buildVersion){
  var mini=window.xhs&&window.xhs.miniTool;
  if(clientVersion(buildVersion)>=STORAGE_MIN_CLIENT_VERSION&&mini&&typeof mini.setStorage==='function'){
   return mini.setStorage({key:STORAGE_PREFIX+key,data:serialized}).then(function(){return true}).catch(function(){return false});
  }
  return fallbackSet(key,data);
 });
}
function showGestureOnce(){
 getLocalData('joystick-guide').then(function(seen){
  if(seen)return;
  var guide=document.getElementById('joy-guide');
  guide.classList.add('on');
  setTimeout(function(){guide.classList.remove('on')},1000);
  setLocalData('joystick-guide',{shown:true});
 });
}
function saveResult(result){
 setLocalData('last-result',{title:result.title,choices:result.choices.slice(0,3)});
}
window.__MINITOOL__={getLocalData:getLocalData,setLocalData:setLocalData,showGestureOnce:showGestureOnce,saveResult:saveResult};

var title=document.getElementById('st-title'),timer=0;
function cancelReveal(){if(timer){clearTimeout(timer);timer=0}}
title.addEventListener('pointerdown',function(){
 cancelReveal();timer=setTimeout(function(){
  timer=0;var entry=document.getElementById('full-entry');entry.hidden=false;
 },1200);
});
title.addEventListener('pointerup',cancelReveal);
title.addEventListener('pointercancel',cancelReveal);

if(typeof window.__BOOT_GAME__==='function')window.__BOOT_GAME__();
else document.getElementById('st-title').textContent='载入失败';
})();
