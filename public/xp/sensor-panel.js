import {finite,degrees,direction,reading} from './sensor-core.js';

export function mountSensorPanel({relayBase='',standalone=false,widgetHidden=false,nativeSource=null}={}) {
  const stylesheet=document.createElement('link');stylesheet.rel='stylesheet';stylesheet.href=new URL('./sensor-panel.css?v=20261014-simple-sensors',import.meta.url);document.head.append(stylesheet);
  const widget=document.createElement('aside');widget.className='sensor-widget';widget.setAttribute('aria-label','海拔与方向');
  widget.innerHTML='<div><small>GPS 高度</small><strong data-alt>— m</strong><small data-accuracy>等待数据</small></div><div><small data-direction-label>方向</small><strong data-heading>—</strong><small data-source>未启用</small></div><button type="button" data-open>设置</button>';
  widget.hidden=widgetHidden||standalone;
  const controls=document.createElement('section');controls.className='sensor-controls';controls.hidden=!standalone;controls.setAttribute('role','dialog');controls.setAttribute('aria-label','海拔与指南针设置');
  controls.innerHTML=`<div class="sensor-card"><header class="sensor-panel-header"><h2>海拔与方向</h2><button type="button" class="sensor-close" aria-label="关闭海拔设置">完成</button></header>
    <div class="sensor-readings" data-readings></div>
    <p class="sensor-status" data-status role="status">等待手机数据</p>
    <div data-relay-section><div data-phone-setup><p>手机开始采集后，输入配对码连接一次。</p><div class="sensor-actions sensor-phone-connect"><input data-phone-code aria-label="iPhone 配对码" placeholder="六位配对码" inputmode="numeric" autocomplete="off" maxlength="6"><button data-view-phone>连接</button></div></div>
    <p data-pair-status role="status">未连接</p><button data-forget-phone hidden>断开手机</button></div>
    <div data-browser-source hidden><h3 data-reader-title>本机传感器</h3><div class="sensor-actions"><button data-gps>启用 GPS</button><button data-compass>启用指南针</button><button data-stop>停止读取</button></div>
    <div data-browser-forward hidden><div class="sensor-actions"><input data-code aria-label="手机配对码" placeholder="六位配对码" inputmode="numeric" maxlength="6"><button data-join>连接</button><button data-close-pair>断开配对</button></div></div></div>
    <div hidden><input data-base type="url"><button data-save-base></button><button data-create></button><div data-pair-code></div><a data-phone-link hidden></a><div data-browser-diagnostic><pre data-diagnostic></pre><button data-copy></button></div></div>
    <button data-hide class="sensor-hide">隐藏桌面数据卡片</button>
    </div>`;
  document.body.append(widget,controls);
  // Element fullscreen only paints that element's descendants. Keep the live
  // panel and its launcher in that subtree, including the plush clock viewer.
  const overlays=[widget,controls];
  function syncFullscreenHost(){
    const fullscreen=document.fullscreenElement||document.webkitFullscreenElement;
    const host=fullscreen?.isConnected&&fullscreen!==document.documentElement?fullscreen:document.body;
    for(const overlay of overlays)if(overlay.parentNode!==host)host.append(overlay);
  }
  for(const event of ['fullscreenchange','webkitfullscreenchange'])document.addEventListener(event,syncFullscreenHost);
  const hostObserver=new MutationObserver(syncFullscreenHost);
  hostObserver.observe(document.body,{childList:true});
  syncFullscreenHost();
  // Overlay interactions must not trigger the clock's click/keyboard controls.
  for(const overlay of overlays)for(const event of ['pointerdown','click','keydown'])overlay.addEventListener(event,e=>e.stopPropagation());
  const $=s=>controls.querySelector(s),w=s=>widget.querySelector(s);
  let sample={},remote=null,watch=null,orientationListening=false,orientationReceived=false,compassTimer=null,pair=null,pairRole='',gpsError='',compassError='',pollBusy=false,publishBusy=false,lastPublished=0,nextPollAt=0;
  let base=relayBase||localStorage.getItem('xp-sensor-relay-base')||''; $('[data-base]').value=base;
  const status=t=>$('[data-status]').textContent=t;
  const pairingStatus=t=>{$('[data-pair-status]').textContent=t;if(pairRole==='receiver')status(t);};
  function relayAvailability(){for(const selector of ['[data-create]','[data-join]','[data-code]','[data-close-pair]','[data-view-phone]','[data-phone-code]','[data-forget-phone]'])$(selector).disabled=!base;if(!base)pairingStatus('手机转发尚未接入：需要 HTTPS 转发服务，当前无法配对。本机 GPS 和指南针仍可单独检测。');}
  relayAvailability();
  const receiverKey='xp-sensor-receiver-v1';
  function saveReceiver(){if(pairRole==='receiver'&&pair)localStorage.setItem(receiverKey,JSON.stringify({id:pair.id,readToken:pair.readToken,base}));}
  function receiverUI(){const active=pairRole==='receiver';$('[data-phone-setup]').hidden=active;$('[data-forget-phone]').hidden=!active;$('[data-reader-title]').textContent=active?'iPhone HTTPS 实时数据':'本机传感器';for(const selector of ['[data-gps]','[data-compass]','[data-stop]'])$(selector).hidden=active;}
  if(!nativeSource)try{const saved=JSON.parse(localStorage.getItem(receiverKey));if(saved?.base===base&&/^[0-9a-f-]{36}$/.test(saved.id)&&/^[0-9a-f-]{36}$|^[0-9a-f]{64}$/.test(saved.readToken)){pair=saved;pairRole='receiver';remote={};widget.hidden=false;receiverUI();pairingStatus('正在恢复手机连接…');}}catch{}
  async function diagnostic(){
    let permission='无法查询';try{permission=(await navigator.permissions.query({name:'geolocation'})).state;}catch{}
    $('[data-diagnostic]').textContent=`目标车机：XOS 5.10.58902（需在车机实测）\n安全上下文：${window.isSecureContext?'是':'否，需要 HTTPS'}\n定位接口：${navigator.geolocation?'存在':'不存在'}\n定位权限状态：${permission}\n设备方向接口：${typeof DeviceOrientationEvent!=='undefined'?'存在':'不存在'}\n方向权限请求接口：${typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'?'存在':'无专用接口，需等待实际事件'}\n定位结果：${gpsError|| (sample.gpsAt?'已收到数据'+(sample.altitude===null?'，未提供高度':''):'未读取')}\n方向结果：${compassError|| (orientationReceived?'已收到方向事件':'未读取')}\n浏览器：${navigator.userAgent}`;
  }
  function paint(){
    const r=reading(remote||sample),source=remote?'iPhone / 手机':'本机';
    w('[data-alt]').textContent=finite(r.altitude)?Math.round(r.altitude)+' m':'— m';
    w('[data-accuracy]').textContent=finite(r.altitudeAccuracy)?'高度误差 ±'+Math.round(r.altitudeAccuracy)+' m':r.fresh?'未提供高度精度':'等待数据 / 已失效';
    w('[data-heading]').textContent=finite(r.heading)?direction(r.heading)+' '+Math.round(r.heading)+'°':'—';
    w('[data-direction-label]').textContent=r.headingKind;
    w('[data-source]').textContent=r.fresh?source+(finite(r.speed)?' · '+Math.round(r.speed*3.6)+' km/h':''):source+' · 无有效数据';
    const value=(v,unit='',digits=1)=>finite(v)?v.toFixed(digits)+unit:'—';
    const rows=[['海拔',value(r.altitude,' m',0)],['方向',finite(r.heading)?direction(r.heading)+' '+Math.round(r.heading)+'°':'—']];
    $('[data-readings]').replaceChildren(...rows.map(([name,text])=>{const item=document.createElement('div'),label=document.createElement('small'),strong=document.createElement('strong');label.textContent=name;strong.textContent=text;item.append(label,strong);return item;}));
  }
  function stopGPS(){if(watch!==null)navigator.geolocation?.clearWatch(watch);watch=null;delete sample.gpsAt;delete sample.altitudeAt;}
  function onOrientation(event){
    orientationReceived=true;
    if(finite(event.webkitCompassHeading)&&(!finite(event.webkitCompassAccuracy)||event.webkitCompassAccuracy>=0&&event.webkitCompassAccuracy<=30)){
      sample.compass=degrees(event.webkitCompassHeading);sample.compassKind='磁北方向';sample.compassAt=Date.now();compassError='';
    }else if(event.absolute===true&&finite(event.alpha)&&finite(event.beta)&&finite(event.gamma)&&Math.abs(event.beta)<10&&Math.abs(event.gamma)<10){
      const screenAngle=window.screen?.orientation?.angle||0;
      sample.compass=degrees(360-event.alpha+screenAngle);sample.compassKind='绝对方向参考';sample.compassAt=Date.now();compassError='';
    }else{sample.compassAt=0;compassError='收到方向事件，但没有可靠北向；绝对方向参考需要设备平放。';}
    paint();
  }
  function stopCompass(){window.removeEventListener('deviceorientation',onOrientation);window.removeEventListener('deviceorientationabsolute',onOrientation);orientationListening=false;clearTimeout(compassTimer);sample.compassAt=0;}
  async function startGPS(){
    if(!window.isSecureContext){gpsError='不是安全上下文，请使用 HTTPS 地址';status(gpsError);await diagnostic();return;}
    if(!navigator.geolocation){gpsError='浏览器未提供定位接口';status(gpsError);await diagnostic();return;}
    stopGPS();remote=null;status('正在等待定位授权和 GPS 数据…');
    watch=navigator.geolocation.watchPosition(p=>{
      const c=p.coords,now=Date.now();sample.altitude=finite(c.altitude)?c.altitude:null;sample.altitudeAccuracy=finite(c.altitudeAccuracy)?c.altitudeAccuracy:null;sample.altitudeAt=now;sample.gpsAt=now;sample.gpsHeading=finite(c.heading)?c.heading:null;sample.speed=finite(c.speed)?c.speed:null;sample.accuracy=finite(c.accuracy)?c.accuracy:null;sample.latitude=c.latitude;sample.longitude=c.longitude;sample.altitudeReference='WGS84 椭球高度';
      gpsError='';status(c.altitude===null?'定位成功，浏览器未提供高度。':'GPS 已连接，正在更新。');paint();diagnostic();
    },error=>{gpsError=({1:'定位权限被拒绝（浏览器设置、系统权限或权限策略）',2:'定位暂不可用',3:'定位超时，接口存在但尚未取得数据'})[error.code]||error.message;sample.gpsAt=0;sample.altitudeAt=0;status(gpsError);paint();diagnostic();},{enableHighAccuracy:true,maximumAge:0,timeout:15000});
    await diagnostic();
  }
  async function startCompass(){
    if(!window.isSecureContext){compassError='方向传感器需要 HTTPS 安全上下文';status(compassError);await diagnostic();return;}
    if(typeof DeviceOrientationEvent==='undefined'){compassError='浏览器没有设备方向接口';status(compassError);await diagnostic();return;}
    try{
      // Must run directly from this click handler for iOS user-gesture permission.
      if(typeof DeviceOrientationEvent.requestPermission==='function'&&await DeviceOrientationEvent.requestPermission(true)!=='granted')throw new Error('设备方向权限未授予');
      stopCompass();remote=null;orientationReceived=false;orientationListening=true;
      window.addEventListener('deviceorientation',onOrientation);window.addEventListener('deviceorientationabsolute',onOrientation);
      status('等待指南针数据；手机请平放并对齐车头。');
      compassTimer=setTimeout(()=>{if(!orientationReceived){compassError='10 秒未收到传感器数据，可能被禁用或设备不提供';status(compassError);}diagnostic();},10000);
    }catch(error){compassError=error.message;status(compassError);}await diagnostic();
  }
  async function api(route,{body,token}={}){
    if(!base)throw new Error('尚未配置 HTTPS 转发服务；GitHub Pages 不能独立完成手机同步。');
    const abort=new AbortController(),deadline=setTimeout(()=>abort.abort(),8000);
    try{const response=await fetch(base.replace(/\/$/,'')+'/api/sensors'+route,{method:body?'POST':'GET',headers:{...(body?{'Content-Type':'application/json'}:{}),...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:abort.signal});
    const data=await response.json();if(!response.ok||!data.ok){const error=new Error(data.error||'连接失败');error.status=response.status;throw error;}return data;}finally{clearTimeout(deadline);}
  }
  async function closePair(){
    if(pair)try{await api('/'+pair.id+(pairRole==='sender'?'/stop':'/close'),{body:{},token:pair.readToken||pair.writeToken});}catch{}
    localStorage.removeItem(receiverKey);pair=null;pairRole='';receiverUI();remote=null;sample={};stopGPS();stopCompass();$('[data-pair-code]').textContent='';$('[data-phone-link]').hidden=true;pairingStatus('未连接');status('等待手机数据');paint();
  }
  $('[data-create]').onclick=async()=>{try{await closePair();pair=await api('/pair',{body:{}});pairRole='receiver';saveReceiver();receiverUI();widget.hidden=false;$('[data-pair-code]').textContent=pair.code;const url=new URL('./sensors.html',import.meta.url);url.searchParams.set('join',pair.code);url.searchParams.set('relay',base);$('[data-phone-link]').href=url;$('[data-phone-link]').hidden=false;pairingStatus('配对码 10 分钟内有效。手机浏览器打开此页并输入配对码，配对后自动恢复连接。');}catch(e){pairingStatus(e.message);}};
  $('[data-join]').onclick=async()=>{try{await closePair();pair=await api('/join',{body:{code:$('[data-code]').value.trim()}});pairRole='sender';pairingStatus('已连接。请点击“启用 GPS”和“启用指南针”，并保持手机页面在前台。');}catch(e){pairingStatus(e.message);}};
  $('[data-view-phone]').onclick=async()=>{const code=$('[data-phone-code]').value.trim();if(!/^[0-9]{6}$/.test(code)){pairingStatus('请输入手机显示的六位配对码');return;}const button=$('[data-view-phone]');if(button.disabled)return;button.disabled=true;button.textContent='连接中…';try{const joined=await api('/view',{body:{code}});pair=joined;pairRole='receiver';remote={};saveReceiver();receiverUI();widget.hidden=false;nextPollAt=0;$('[data-phone-code]').value='';pairingStatus('正在接收手机数据…');relayTick();}catch(e){pairingStatus(e.status===403||e.status===404?'配对码无效或已过期，请在手机上更新':e.name==='AbortError'?'连接超时，请重试':'连接失败，请检查手机和网络');}finally{button.disabled=!base;button.textContent='连接';}};
  $('[data-phone-code]').onkeydown=e=>{if(e.key==='Enter')$('[data-view-phone]').click();};
  $('[data-forget-phone]').onclick=closePair;
  async function relayTick(){
    if(!pair)return;
    if(pairRole==='receiver'&&!pollBusy&&Date.now()>=nextPollAt){pollBusy=true;nextPollAt=Date.now()+2000;try{const data=await api('/'+pair.id,{token:pair.readToken});remote={...(data.sample||{})};const offset=Date.now()-data.serverNow;for(const key of ['gpsAt','altitudeAt','compassAt'])if(finite(remote[key])&&remote[key]>0)remote[key]+=offset;const message=data.paired?(reading(remote).fresh?'已连接 · 实时更新':'已配对 · 等待手机开始采集'):'等待手机连接';pairingStatus(message);status(message);}catch(e){remote={};pairingStatus('连接暂时中断，正在重连…');if(e.status===403||e.status===404){localStorage.removeItem(receiverKey);pair=null;pairRole='';receiverUI();pairingStatus('请重新输入手机配对码');}}finally{pollBusy=false;paint();}}
    if(pairRole==='sender'&&reading(sample).fresh&&!publishBusy&&Date.now()-lastPublished>=2000){publishBusy=true;try{await api('/'+pair.id+'/update',{token:pair.writeToken,body:{...sample,clientNow:Date.now()}});lastPublished=Date.now();pairingStatus('已转发 · '+new Date().toLocaleTimeString('zh-CN'));}catch(e){pairingStatus(e.message);}finally{publishBusy=false;}}
  }
  $('[data-save-base]').onclick=async()=>{try{const url=new URL($('[data-base]').value);if(url.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(url.hostname)&&url.origin!==location.origin)throw new Error('远程转发服务必须使用 HTTPS');if(pair)await closePair();base=url.origin;localStorage.setItem('xp-sensor-relay-base',base);relayAvailability();pairingStatus('转发地址已保存，可尝试连接。');}catch(e){pairingStatus('地址无效：'+e.message);}};
  $('[data-gps]').onclick=startGPS;$('[data-compass]').onclick=startCompass;
  $('[data-stop]').onclick=async()=>{stopGPS();stopCompass();sample={};if(pairRole==='sender')try{await api('/'+pair.id+'/stop',{body:{},token:pair.writeToken});}catch{}status('已停止读取');paint();diagnostic();};
  $('[data-close-pair]').onclick=closePair;
  w('[data-open]').onclick=()=>{controls.hidden=false;diagnostic();};$('.sensor-close').onclick=()=>{if(standalone)location.assign(new URL('./',import.meta.url));else controls.hidden=true;};
  $('[data-hide]').onclick=()=>{widget.hidden=true;if(!standalone)controls.hidden=true;};
  $('[data-copy]').onclick=async()=>{await diagnostic();try{await navigator.clipboard.writeText($('[data-diagnostic]').textContent);status('检测结果已复制');}catch{status('复制不可用，请选中检测文字手动复制。');}};
  const params=new URLSearchParams(location.search);if(standalone&&!nativeSource){$('[data-browser-source]').hidden=false;}if(params.get('join')){$('[data-browser-forward]').hidden=false;$('[data-relay-section]').hidden=true;$('[data-code]').value=params.get('join');controls.hidden=false;const candidate=params.get('relay');try{const url=new URL(candidate);if(url.protocol==='https:'||url.origin===location.origin){base=url.origin;$('[data-base]').value=base;}}catch{}}
  relayAvailability();
  async function nativeTick(){if(!nativeSource||pollBusy)return;pollBusy=true;const abort=new AbortController(),deadline=setTimeout(()=>abort.abort(),8000);try{const response=await fetch(new URL('api/phone/sample',nativeSource.base),{headers:{Authorization:'Bearer '+nativeSource.key},cache:'no-store',signal:abort.signal});const data=await response.json();if(!response.ok||!data.ok)throw new Error(data.error||'手机服务无法连接');remote=data.sample||{};status(reading(remote).fresh?'已连接 · 实时更新':'已连接 · 等待手机开始采集');}catch(e){remote={};status('连接暂时中断，正在重连…');}finally{clearTimeout(deadline);pollBusy=false;paint();}}
  if(nativeSource){$('[data-relay-section]').hidden=true;$('[data-browser-diagnostic]').hidden=true;$('[data-reader-title]').textContent='iPhone 局域网数据';for(const selector of ['[data-gps]','[data-compass]','[data-stop]'])$(selector).hidden=true;nativeTick();}
  if(!nativeSource&&pair)relayTick();
  if(!nativeSource&&!standalone)$('[data-status]').hidden=true;
  const timer=setInterval(()=>{paint();if(nativeSource)nativeTick();else relayTick();},1000);diagnostic();paint();
  window.addEventListener('pagehide',()=>{stopGPS();stopCompass();clearInterval(timer);hostObserver.disconnect();for(const event of ['fullscreenchange','webkitfullscreenchange'])document.removeEventListener(event,syncFullscreenHost);});
  return {open(){syncFullscreenHost();widget.hidden=false;controls.hidden=false;diagnostic();},registerOverlay(node){overlays.push(node);for(const event of ['pointerdown','click','keydown'])node.addEventListener(event,e=>e.stopPropagation());syncFullscreenHost();}};
}
