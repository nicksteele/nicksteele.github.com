var Jazz;
var active_element;
var current_in;
var msg;
var sel;

//// Callback function
function midiProc(t,a,b,c){
 msg.innerHTML=msg.innerHTML+midiString(a,b,c)+"<br>";
 msg.scrollTop=msg.scrollHeight;
}
function midiString(a,b,c){
 var cmd=Math.floor(a/16);
 var note=['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'][b%12]+Math.floor(b/12);
 a=a.toString(16);
 b=(b<16?'0':'')+b.toString(16);
 c=(c<16?'0':'')+c.toString(16);
 var str=a+" "+b+" "+c+"    ";
 if(cmd==8){
  str+="Note Off   "+note;
 }
 else if(cmd==9){
  str+="Note On    "+note;
 }
 else if(cmd==10){
  str+="Aftertouch "+note;
 }
 else if(cmd==11){
  str+="Control    "+b;
 }
 else if(cmd==12){
  str+="Program    "+b;
 }
 else if(cmd==13){
  str+="Aftertouch";
 }
 else if(cmd==14){
  str+="Pitch Wheel";
 }
 return str;
}

//// Listbox
function changeMidi(){
 try{
  if(sel.selectedIndex){
   current_in=Jazz.MidiInOpen(sel.options[sel.selectedIndex].value,midiProc);
  } else {
   Jazz.MidiInClose(); current_in='';
  }
  for(var i=0;i<sel.length;i++){
   if(sel[i].value==current_in) sel[i].selected=1;
  }
 }
 catch(err){}
}

//// Connect/disconnect
function connectMidiIn(){
 try{
  var str=Jazz.MidiInOpen(current_in,midiProc);
  for(var i=0;i<sel.length;i++){
   if(sel[i].value==str) sel[i].selected=1;
  }
 }
 catch(err){}
}
function disconnectMidiIn(){
 try{
  Jazz.MidiInClose(); sel[0].selected=1;
 }
 catch(err){}
}
function onFocusIE(){
 active_element=document.activeElement;
 connectMidiIn();
}
function onBlurIE(){
 if(active_element!=document.activeElement){ active_element=document.activeElement; return;}
 disconnectMidiIn();
}

//// Initialize
Jazz=document.getElementById("Jazz1"); if(!Jazz || !Jazz.isJazz) Jazz = document.getElementById("Jazz2");
msg=document.getElementById("msg");
sel=document.getElementById("midiIn");
try{
 current_in=Jazz.MidiInOpen(0,midiProc);
 var list=Jazz.MidiInList();
 for(var i in list){
  sel[sel.options.length]=new Option(list[i],list[i],list[i]==current_in,list[i]==current_in);
 }
}
catch(err){}

if(navigator.appName=='Microsoft Internet Explorer'){ document.onfocusin=onFocusIE; document.onfocusout=onBlurIE;}
else{ window.onfocus=connectMidiIn; window.onblur=disconnectMidiIn;}