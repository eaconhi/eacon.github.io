import {finite,degrees,direction,reading} from './sensor-core.js';

export function mountSensorPanel({relayBase='',standalone=false}={}) {
  const stylesheet=document.createElement('link');stylesheet.rel='stylesheet';stylesheet.href=new URL('./sensor-panel.css',import.meta.url);document.head.append(stylesheet);
  const widget=document.createElement('aside');widget.className='sensor-widget';widget.setAttribute('aria-label','海拔与方向');
  widget.innerHTML='<div><small>GPS 高度</small><strong data-alt>— m</strong><small data-accuracy>等待数据</small></div><div><small data-direction-label>方向</small><strong data-heading>—</strong><small data-source>未启用</small></div><button type="button" data-open>设置</button>';
  const controls=document.createElement('section');controls.className='sensor-controls';controls.hidden=!standalone;controls.setAttribute('role','dialog');controls.setAttribute('aria-label','海拔与指南针设置');
  controls.innerHTML=`<div class="sensor-card"><button type="button" class="sensor-close" aria-label="关闭海拔设置">×</button>
    <h2>海拔与指南针</h2><p>先在车辆停稳时设置，行驶时保留数据展示。</p>
    <h3>本机传感器</h3><div class="sensor-actions"><button data-gps>启用 GPS</button><button data-compass>启用指南针</button><button data-stop>停止读取</button></div>
    <p class="sensor-status" data-status>尚未申请传感器权限。</p>
    <p>GPS 高度采用浏览器提供的 WGS84 椭球高度，可能为空或存在误差。GPS 航向表示行进方向；停车时需要设备罗盘。手机罗盘表示手机朝向，需平放并对齐车头。</p>
    <h3>手机转发</h3><p>车机取不到数据时，让手机在前台读取并转发。手机锁屏或切到后台可能停止更新，超过 15 秒会显示失效。</p>
    <details><summary>转发服务地址</summary><p>GitHub Pages 需要另配 HTTPS 转发服务。本地完整版本使用同一服务。</p><label>服务地址 <input data-base placeholder="https://你的转发服务" type="url"></label><button data-save-base>保存地址</button></details>
    <div class="sensor-actions"><button data-create>车机：生成配对码</button><input data-code aria-label="手机配对码" placeholder="输入六位配对码" inputmode="numeric" maxlength="6"><button data-join>手机：连接</button><button data-close-pair>断开配对</button></div>
    <div class="sensor-pair" data-pair-code></div><p data-pair-status>未连接</p><p><a data-phone-link hidden target="_blank" rel="noopener">打开手机转发页面</a></p>
    <h3>车机检测</h3><p>接口存在不代表已经开放权限，请点击上面的启用按钮实测。</p><pre class="sensor-diagnostic" data-diagnostic></pre><button data-copy>复制检测结果</button><button data-hide>隐藏数据卡片</button>
    </div>`;
  document.body.append(widget,controls);
  const $=s=>controls.querySelector(s),w=s=>widget.querySelector(s);
  let sample={},remote=null,watch=null,orientationListening=false,orientationReceived=false,compassTimer=null,pair=null,pairRole='',gpsError='',compassError='',pollBusy=false,publishBusy=false,lastPublished=0;
  let base=localStorage.getItem('xp-sensor-relay-base')||relayBase; $('[data-base]').value=base;
  const status=t=>$('[data-status]').textContent=t;
  const pairingStatus=t=>$('[data-pair-status]').textContent=t;
  async function diagnostic(){
    let permission='无法查询';try{permission=(await navigator.permissions.query({name:'geolocation'})).state;}catch{}
    $('[data-diagnostic]').textContent=`目标车机：XOS 5.10.58902（需在车机实测）\n安全上下文：${window.isSecureContext?'是':'否，需要 HTTPS'}\n定位接口：${navigator.geolocation?'存在':'不存在'}\n定位权限状态：${permission}\n设备方向接口：${typeof DeviceOrientationEvent!=='undefined'?'存在':'不存在'}\n方向权限请求接口：${typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'?'存在':'无专用接口，需等待实际事件'}\n定位结果：${gpsError|| (sample.gpsAt?'已收到数据'+(sample.altitude===null?'，未提供高度':''):'未读取')}\n方向结果：${compassError|| (orientationReceived?'已收到方向事件':'未读取')}\n浏览器：${navigator.userAgent}`;
  }
  function paint(){
    const r=reading(remote||sample),source=remote?'手机':'本机';
    w('[data-alt]').textContent=finite(r.altitude)?Math.round(r.altitude)+' m':'— m';
    w('[data-accuracy]').textContent=finite(r.altitudeAccuracy)?'高度误差 ±'+Math.round(r.altitudeAccuracy)+' m':r.fresh?'未提供高度精度':'等待数据 / 已失效';
    w('[data-heading]').textContent=finite(r.heading)?direction(r.heading)+' '+Math.round(r.heading)+'°':'—';
    w('[data-direction-label]').textContent=r.headingKind;
    w('[data-source]').textContent=r.fresh?source+(finite(r.speed)?' · '+Math.round(r.speed*3.6)+' km/h':''):source+' · 无有效数据';
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
      const c=p.coords,now=Date.now();sample.altitude=finite(c.altitude)?c.altitude:null;sample.altitudeAccuracy=finite(c.altitudeAccuracy)?c.altitudeAccuracy:null;sample.altitudeAt=now;sample.gpsAt=now;sample.gpsHeading=finite(c.heading)?c.heading:null;sample.speed=finite(c.speed)?c.speed:null;sample.accuracy=finite(c.accuracy)?c.accuracy:null;
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
    const response=await fetch(base.replace(/\/$/,'')+'/api/sensors'+route,{method:body?'POST':'GET',headers:{...(body?{'Content-Type':'application/json'}:{}),...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{}),signal:typeof AbortSignal!=='undefined'&&AbortSignal.timeout?AbortSignal.timeout(8000):undefined});
    const data=await response.json();if(!response.ok||!data.ok)throw new Error(data.error||'连接失败');return data;
  }
  async function closePair(){
    if(pair)try{await api('/'+pair.id+(pairRole==='sender'?'/stop':'/close'),{body:{},token:pair.readToken||pair.writeToken});}catch{}
    pair=null;pairRole='';remote=null;sample={};stopGPS();stopCompass();$('[data-pair-code]').textContent='';$('[data-phone-link]').hidden=true;pairingStatus('已断开');paint();
  }
  $('[data-create]').onclick=async()=>{try{await closePair();pair=await api('/pair',{body:{}});pairRole='receiver';$('[data-pair-code]').textContent=pair.code;const url=new URL('./sensors.html',import.meta.url);url.searchParams.set('join',pair.code);url.searchParams.set('relay',base);$('[data-phone-link]').href=url;$('[data-phone-link]').hidden=false;pairingStatus('配对码 10 分钟内有效，连接后最长 2 小时。手机打开此页，输入配对码。');}catch(e){pairingStatus(e.message);}};
  $('[data-join]').onclick=async()=>{try{await closePair();pair=await api('/join',{body:{code:$('[data-code]').value.trim()}});pairRole='sender';pairingStatus('已连接。请点击“启用 GPS”和“启用指南针”，并保持手机页面在前台。');}catch(e){pairingStatus(e.message);}};
  async function relayTick(){
    if(!pair)return;
    if(pairRole==='receiver'&&!pollBusy){pollBusy=true;try{const data=await api('/'+pair.id,{token:pair.readToken});remote=data.sample||{};pairingStatus(data.paired?'手机已连接'+(data.receivedAt?' · 正在接收':' · 等待传感器数据'):'等待手机连接');}catch(e){remote={};pairingStatus(e.message);}finally{pollBusy=false;paint();}}
    if(pairRole==='sender'&&reading(sample).fresh&&!publishBusy&&Date.now()-lastPublished>=1000){publishBusy=true;try{await api('/'+pair.id+'/update',{token:pair.writeToken,body:sample});lastPublished=Date.now();pairingStatus('已转发 · '+new Date().toLocaleTimeString('zh-CN'));}catch(e){pairingStatus(e.message);}finally{publishBusy=false;}}
  }
  $('[data-save-base]').onclick=()=>{try{const url=new URL($('[data-base]').value);if(url.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(url.hostname)&&url.origin!==location.origin)throw new Error('远程转发服务必须使用 HTTPS');base=url.origin;localStorage.setItem('xp-sensor-relay-base',base);pairingStatus('转发地址已保存');}catch(e){pairingStatus('地址无效：'+e.message);}};
  $('[data-gps]').onclick=startGPS;$('[data-compass]').onclick=startCompass;
  $('[data-stop]').onclick=async()=>{stopGPS();stopCompass();sample={};if(pairRole==='sender')try{await api('/'+pair.id+'/stop',{body:{},token:pair.writeToken});}catch{}status('已停止读取');paint();diagnostic();};
  $('[data-close-pair]').onclick=closePair;
  w('[data-open]').onclick=()=>{controls.hidden=false;diagnostic();};$('.sensor-close').onclick=()=>controls.hidden=true;
  $('[data-hide]').onclick=()=>{widget.hidden=true;if(!standalone)controls.hidden=true;};
  $('[data-copy]').onclick=async()=>{await diagnostic();try{await navigator.clipboard.writeText($('[data-diagnostic]').textContent);status('检测结果已复制');}catch{status('复制不可用，请选中检测文字手动复制。');}};
  const params=new URLSearchParams(location.search);if(params.get('join')){$('[data-code]').value=params.get('join');controls.hidden=false;const candidate=params.get('relay');try{const url=new URL(candidate);if(url.protocol==='https:'||url.origin===location.origin){base=url.origin;$('[data-base]').value=base;}}catch{}}
  const timer=setInterval(()=>{paint();relayTick();},1000);diagnostic();paint();
  window.addEventListener('pagehide',()=>{stopGPS();stopCompass();clearInterval(timer);});
  return {open(){widget.hidden=false;controls.hidden=false;diagnostic();}};
}
