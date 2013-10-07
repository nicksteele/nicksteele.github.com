// Jazz-Soft.net
// This code is totally free to copy, modify and distribute.

function MidiPool(){
 var place;
 var arr=[];
 var inputs={};
 var outputs={};
 if(arguments.length){
  if(arguments[0].isJazz){
   place=arguments[0].parentNode;
   arr[0]={plugin:arguments[0]};
  }
  else{
   try{ // if this is a good location to create plugins
    var tmp=create_plugin(arguments[0]);
    arr[0]={plugin:tmp};
    place=arguments[0];
   }
   catch(err){}
  }
 }
 if(place===undefined){ // otherwise create plugins at where the current script is
  var scripts=document.getElementsByTagName('script');
  place=scripts[scripts.length-1].parentNode;
 }
 if(!arr.length) arr[0]={plugin:create_plugin(place)};

 if(navigator.appName=='Microsoft Internet Explorer'){ document.onfocusin=onFocusIE; document.onfocusout=onBlurIE;}
 else{ window.onfocus=connectMidi; window.onblur=disconnectMidi;}

 function create_plugin(where){
  var obj=document.createElement('object');
  obj.classid="CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90";
  if(!obj.isJazz) obj.type="audio/x-jazz";
  obj.style.visibility='hidden';
  obj.style.width='0px'; obj.style.height='0px';
  where.appendChild(obj);
  if(obj.isJazz) return obj;
  where.removeChild(obj);
  throw "Cannot create Jazz-Plugin";
 }
 function connectMidi(){
  try{
   for(i=0;i<arr.length;i++){
    if(arr[i].in){
     if(arr[i].func) arr[i].plugin.MidiInOpen(arr[i].in,arr[i].func);
     else arr[i].plugin.MidiInOpen(arr[i].in);
    }
    if(i && arr[i].out) arr[i].plugin.MidiOutOpen(arr[i].out);
   }
  }
  catch(err){res.innerHTML=res.innerHTML+' ERR: '+err;}
 }
 function disconnectMidi(){
  try{
   for(i=0;i<arr.length;i++){
    if(arr[i].in) arr[i].plugin.MidiInClose();
    if(i && arr[i].out) arr[i].plugin.MidiOutClose(); // don't close the default out
   }
  }
  catch(err){}
 }
 function onFocusIE(){
  active_element=document.activeElement;
  connectMidi();
 }
 var active_element;
 function onBlurIE(){
  if(active_element!=document.activeElement){ active_element=document.activeElement; return;}
  disconnectMidi();
 }

 this.MidiOutList=function(){ return arr[0].plugin.MidiOutList();}
 this.MidiInList=function(){ return arr[0].plugin.MidiInList();}
 this.MidiOut=function(name,msg){ if(outputs[name]) outputs[name].plugin.MidiOutLong(msg);}
 this.ClearMidiIn=function(name){ if(inputs[name]) inputs[name].plugin.ClearMidiIn();}
 this.QueryMidiIn=function(name){ if(inputs[name]) return inputs[name].plugin.QueryMidiIn();}
 this.OpenMidiOut=function(name){
  if(outputs[name]) return;
  var i;
  for(i=0;i<arr.length;i++) if(!arr[i].out) break;
  if(i==arr.length){
   arr[i]={plugin:create_plugin(place)};
  }
  arr[i].out=name;
  arr[i].plugin.MidiOutOpen(name);
  outputs[name]=arr[i];
 }
 this.OpenMidiIn=function(name,func){
  if(!inputs[name]){
   var i;
   for(i=0;i<arr.length;i++) if(!arr[i].in) break;
   if(i==arr.length){
    arr[i]={plugin:create_plugin(place)};
   }
   arr[i].in=name;
   inputs[name]=arr[i];
  }
  if(func) inputs[name].plugin.MidiInOpen(name,func); else inputs[name].plugin.MidiInOpen(name);
  inputs[name].func=func;
 }
}