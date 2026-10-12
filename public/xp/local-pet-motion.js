export const clamp01 = t => Math.max(0, Math.min(1, t));
export const easeOut = t => 1 - (1 - clamp01(t)) ** 3;
export const smooth = t => { t = clamp01(t); return t*t*(3-2*t); };
const lerp = (a,b,t) => a+(b-a)*t;
// One reversible timeline. Sampling the same progress restores the same pose.
export function scenePose(progress) {
  const p=clamp01(progress), exit=smooth(p/.36), entry=clamp01((p-.28)/.72);
  const rise=entry===1?1:1-Math.exp(-7*entry)*Math.cos(10*entry);
  return {progress:p,clock:1-exit,head:rise,headScale:.7+.3*smooth(entry),
    phase:p===0?'clock':p===1?'settled':p<.28?'exit':'entry'};
}
export function sceneMotion(seconds, reverse=false) {
  return scenePose(reverse?1-clamp01(seconds/1.7):clamp01(seconds/1.7));
}
export function peekMotion(seconds) {
  if(seconds<0||seconds>=2.4)return 0;
  if(seconds<.48)return smooth(seconds/.48);
  if(seconds<1.3)return 1;
  return 1-smooth((seconds-1.3)/1.1);
}
export function foodMotion(seconds, from, head, size) {
  const t=Math.max(0,seconds), hat={x:head.x,y:head.y-size*1.08},face={x:head.x+size*.18,y:head.y-size*.48};
  if(t<.62){const p=smooth(t/.62);return {x:lerp(from.x,hat.x,p),y:lerp(from.y,hat.y,p)-Math.sin(p*Math.PI)*size*.45,scale:.75+.25*p,rotation:Math.sin(p*Math.PI)*.24,phase:'flight'};}
  if(t<1.08){const p=(t-.62)/.46;return {...hat,y:hat.y-Math.sin(p*Math.PI)*size*.07,scale:1,rotation:.08*Math.sin(p*Math.PI),phase:'hat'};}
  if(t<1.52){const p=smooth((t-1.08)/.44);return {x:lerp(hat.x,face.x,p),y:lerp(hat.y,face.y,p),scale:1-.16*p,rotation:-.16*p,phase:'fall'};}
  return {...face,scale:t>3.2?.84*(1-smooth((t-3.2)/.6)):.84,rotation:-.16,phase:t>=3.8?'complete':'face'};
}
