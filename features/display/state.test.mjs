import test from 'node:test';
import assert from 'node:assert/strict';
import {displayState} from '../../public/xp/display-state.js';

function fixture({viewer=null,clock=null,native=null}={}){
  const body={},html={};
  return {body,documentElement:html,fullscreenElement:native,
    querySelector(selector){return selector==='.plush-clock-viewer'?clock:viewer;}};
}
test('browser fullscreen over the gallery does not enable data or music overlays',()=>{
  const doc=fixture();doc.fullscreenElement=doc.documentElement;
  assert.deepEqual(displayState(doc),{active:false,host:doc.body,kind:'gallery'});
});
test('image and video presentation remain supported without native fullscreen',()=>{
  for(const [id,kind]of [['imageViewer','wallpaper'],['videoViewer','video']]){
    const viewer={id};assert.deepEqual(displayState(fixture({viewer})),{active:true,host:viewer,kind});
  }
});
test('clock editor stays clean; screensaver and native clock receive overlays',()=>{
  let label='毛绒时钟编辑模式';
  const clock={classList:{contains:()=>false},getAttribute:()=>label};
  assert.equal(displayState(fixture({clock})).active,false);
  label='毛绒时钟屏保模式';assert.equal(displayState(fixture({clock})).host,clock);
  label='毛绒时钟编辑模式';clock.contains=x=>x===clock;
  assert.equal(displayState(fixture({clock,native:clock})).host,clock);
});
