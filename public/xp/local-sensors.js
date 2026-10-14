import {mountSensorPanel} from './sensor-panel.js?v=20261014-simple-sensors';
await window.__XP_PAGES_READY;
const panel=mountSensorPanel({relayBase:"https://xp-phone-relay.connectivity-probe.workers.dev",widgetHidden:true,nativeSource:window.__XP_PHONE_SOURCE||null});
const button=document.createElement('button');button.type='button';button.textContent='海拔 / 指南针';button.className='local-sensor-button';
button.style.cssText='position:fixed;right:24px;bottom:24px;z-index:10010;border:1px solid #ffffff35;background:#162942dc;color:#fff;border-radius:14px;padding:12px 18px;font:15px system-ui;cursor:pointer';button.onclick=()=>panel.open();panel.registerOverlay(button);
