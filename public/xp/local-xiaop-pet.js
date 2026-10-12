// Continuous, articulated companion in the original clock render loop.
import {scenePose,peekMotion,foodMotion,smooth} from "./local-pet-motion.js?v=20261012-plush-release-1";
import {createXiaopAvatar} from "./local-xiaop-avatar.js?v=20261012-plush-release-1";
const STORE='xiaop-clock-pet-v2';
const VERSION='20261012-plush-release-1';
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
const DEFAULTS={visible:true,size:110,prop:'hat',x:.12,y:.86,mode:'clock',moved:false,sound:true};
const PROPS=['none','hat','dino'];
const BOARD=new URL('./companions/xiaop/plush-food-board.png?v='+VERSION,import.meta.url).href;
const BOARD_ALT=new URL('./companions/xiaop/plush-food-board-alt.png?v='+VERSION,import.meta.url).href;
const FOODS=[['能量方块',.4,.215,[265,187,288,300]],['闪电',.67,.215,[575,190,215,300]],['小蛋糕',.4,.42,[270,500,280,290]],['披萨',.67,.42,[562,496,274,305]],['汉堡',.4,.62,[270,797,279,299]],['薯条',.67,.62,[568,785,255,310]],['西兰花',.52,.8,[387,1078,290,285]]];
const ALT_NAMES=['能量方块','闪电','小手表','咖啡','鸡腿','青苹果','西兰花'];
export function mountXiaopPet({THREE:T,root,stage,camera,clock,scene,getClockCores,getClockDots,getClockDigits,renderer}) {
  let prefs={...DEFAULTS};
  try {const s=JSON.parse(localStorage.getItem(STORE)||'{}');prefs={
    visible:s.visible!==false,size:clamp(Number(s.size)||110,80,170),
    prop:PROPS.includes(s.prop)?s.prop:'hat',x:Number.isFinite(s.x)?clamp(s.x,0,1):DEFAULTS.x,
    y:Number.isFinite(s.y)?clamp(s.y,0,1):DEFAULTS.y,
    mode:['clock','companion','board'].includes(s.mode)?s.mode:'clock',moved:s.moved===true,sound:s.sound!==false};} catch {}
  let disposed=false,elapsed=0,state='idle',since=0,lastTouch=0,nextIdle=16;
  let drag=null,lastTap=-10,hover=0,bubbleUntil=0,needsLayout=true,frame=-1;
  let width=0,height=0,left=0,top=0,targetX=0,targetY=0,petSize=0,projection='';
  let rot=0,sx=1,sy=1,bob=0,changed=true,lastSnapshot='',dotAction=null,boardPage=0,lastClockTouch=null,foodEffect=null,lastTargetUpdate=-1;
  let audio=null,clockTouchSerial=0;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cleanup=[],timers=new Set(),readyWaiters=new Set();let history=[];
  let textureRendered=false;
  let sceneProgress=prefs.mode==='clock'?0:1,boardProgress=prefs.mode==='board'?1:0,sceneTransition=null,boardTransition=null,applied=[];
  let scenePhase=sceneProgress?'settled':'clock',foodPhase=null;
  const isReady=()=>!prefs.visible||textureRendered;
  const finishReady=ready=>{for(const waiter of readyWaiters){clearTimeout(waiter.timer);timers.delete(waiter.timer);waiter.resolve(ready);}readyWaiters.clear();};
  const whenReady=()=>isReady()?Promise.resolve(true):new Promise(resolve=>{const waiter={resolve,timer:null};waiter.timer=delay(()=>{readyWaiters.delete(waiter);resolve(false);},8000);readyWaiters.add(waiter);});
  const didRender=()=>{if(disposed)return;if(prefs.visible&&spriteGroup.visible&&avatar.isReady()){textureRendered=true;ui.dataset.artRendered='true';}if(isReady())finishReady(true);};
  try {history=JSON.parse(localStorage.getItem('xiaop-pet-history')||'[]').slice(-20);}catch{}
  const record=action=>{history.push({when:Date.now(),action});history=history.slice(-20);try{localStorage.setItem('xiaop-pet-history',JSON.stringify(history));}catch{}};
  const save=()=>{try {localStorage.setItem(STORE,JSON.stringify(prefs));} catch {}};
  const listen=(el,event,fn,options)=>{el.addEventListener(event,fn,options);cleanup.push(()=>el.removeEventListener(event,fn,options));};
  if(!document.querySelector('link[data-xiaop-pet-style]')){
    const link=document.createElement('link');link.rel='stylesheet';link.dataset.xiaopPetStyle='';
    link.href=new URL('./local-xiaop-pet.css?v='+VERSION,import.meta.url).href;document.head.append(link);
  }
  const ui=document.createElement('div');ui.className='xiaop-pet-ui';ui.dataset.style='plush';
  ui.innerHTML=`<button type="button" class="xiaop-pet-hit" aria-label="毛绒小 P，点按摸头，拖动移动"><span class="xiaop-pet-art" aria-hidden="true"></span><span class="xiaop-pet-sparkles" aria-hidden="true">♡</span></button>
    <div class="xiaop-pet-bubble" role="status" aria-live="polite" hidden></div>
    <button type="button" class="xiaop-pet-launch" aria-expanded="false" aria-label="小 P陪伴设置"><span aria-hidden="true">✦</span> 小 P</button>
    <div class="xiaop-pet-menu" role="dialog" aria-label="小 P陪伴" hidden>
      <div class="xiaop-pet-menu-title"><strong>毛绒小 P</strong><button type="button" data-action="close" aria-label="关闭小 P设置">×</button></div>
      <p>摸摸头 · 拖动移动 · 连点两下跳舞</p>
      <div class="xiaop-pet-actions"><button type="button" data-action="happy">摸摸头</button><button type="button" data-action="wave">挥个手</button><button type="button" data-action="dance">来跳舞</button><button type="button" data-action="sleep">打个盹</button></div>
      <label>伙伴大小 <output data-size>${prefs.size}%</output><input aria-label="小 P大小" type="range" min="80" max="170" value="${prefs.size}"></label>
      <label>毛绒帽子 <select aria-label="小 P帽子"><option value="hat">棕色牛仔帽</option><option value="dino">暖橙恐龙帽</option><option value="none">摘下帽子</option></select></label>
      <label>互动音效 <input aria-label="互动音效" data-sound type="checkbox" ${prefs.sound?'checked':''}></label>
      <label>桌面画面 <select aria-label="小 P桌面画面"><option value="clock">毛绒时钟 · 数字探头</option><option value="companion">毛绒小 P</option><option value="board">毛绒小 P · 道具互动</option></select></label>
      <div class="xiaop-pet-actions"><button type="button" data-action="reset">回到原位</button><button type="button" data-action="visibility"></button></div>
    </div><div class="xiaop-food-board" hidden><img alt="毛绒食物道具板" src="${BOARD}"></div>
    <div class="xiaop-scene-tabs" role="group" aria-label="桌面场景"><button type="button" data-mode="clock">毛绒时钟</button><button type="button" data-mode="companion">小 P桌面</button><button type="button" data-mode="board">道具互动</button></div>
    <div class="xiaop-desktop-cards"><button type="button" data-card="skills"><strong>宝藏技能</strong><span>小 P陪伴</span><i>✧</i></button><button type="button" data-card="notes"><strong>备忘录</strong><span>记录此刻的灵感</span><i>▤</i></button><button type="button" data-card="history"><strong>最近对话</strong><span>和小 P的互动</span><i>↗</i></button></div>
    <div class="xiaop-pet-sheet" role="dialog" aria-label="小 P桌面卡片" hidden><header><strong></strong><button type="button" aria-label="关闭桌面卡片">×</button></header><div class="xiaop-sheet-content"></div></div>`;
  root.append(ui);
  const hit=ui.querySelector('.xiaop-pet-hit'),art=ui.querySelector('.xiaop-pet-art'),bubble=ui.querySelector('.xiaop-pet-bubble');
  const launch=ui.querySelector('.xiaop-pet-launch'),menu=ui.querySelector('.xiaop-pet-menu');
  const range=ui.querySelector('input[type=range]'),select=ui.querySelector('[aria-label="小 P帽子"]');select.value=prefs.prop;
  const modeSelect=ui.querySelector('[aria-label="小 P桌面画面"]'),board=ui.querySelector('.xiaop-food-board'),sheet=ui.querySelector('.xiaop-pet-sheet');
  const canvas=stage.querySelector('canvas'),canvasVisibility=canvas?.style.visibility;
  const avatar=createXiaopAvatar(T,{renderer}),spriteGroup=avatar.group;scene.add(spriteGroup);
  const rayOrigin=new T.Vector3(),rayDirection=new T.Vector3();
  const shadow=document.createElement('span');shadow.className='xiaop-ground-shadow';ui.prepend(shadow);
  root.classList.add('xiaop-companion-active');
  const originalPosition=clock?.position.clone(),originalScale=clock?.scale.clone();
  const corner=root.querySelector('.clock-corner-actions'),cornerLeft=corner?.style.left,cornerDisplay=corner?.style.display;
  const originalControlsEnd=root.style.getPropertyValue('--xiaop-controls-end');
  if(corner)corner.style.left='var(--xiaop-controls-end, 140px)';
  const menuOpen=value=>{menu.hidden=!value;launch.setAttribute('aria-expanded',String(value));};
  const speak=(text,seconds=2.5)=>{bubble.textContent=text;bubble.hidden=false;bubbleUntil=elapsed+seconds;};
  // Audio is unlocked by a real gesture, never by the idle animation loop.
  const unlockAudio=()=>{if(!prefs.sound)return;const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;
    try{audio??=new Audio();if(audio.state==='suspended')audio.resume().catch(()=>{});}catch{}};
  const sound=kind=>{if(!prefs.sound)return;unlockAudio();if(!audio||audio.state==='closed')return;
    const notes={happy:[659,880,988],wave:[523,659],dance:[523,659,784,659],sleep:[392,330],peek:[587,784],startle:[988,523],shy:[659,440],giggle:[784,988,784],tentacles:[440,659,880],charge:[440,659,880,1047],crunch:[220,293,349],drink:[330,440,587],greens:[349,440,523],switch:[523,784]};
    try{for(const [index,hz] of (notes[kind]||notes.happy).entries()){const oscillator=audio.createOscillator(),gain=audio.createGain(),at=audio.currentTime+index*.085;
      oscillator.type=kind==='crunch'?'triangle':'sine';oscillator.frequency.setValueAtTime(hz,at);oscillator.frequency.exponentialRampToValueAtTime(hz*.92,at+.11);
      gain.gain.setValueAtTime(.0001,at);gain.gain.exponentialRampToValueAtTime(.045,at+.012);gain.gain.exponentialRampToValueAtTime(.0001,at+.16);
      oscillator.connect(gain);gain.connect(audio.destination);oscillator.start(at);oscillator.stop(at+.18);oscillator.onended=()=>{oscillator.disconnect();gain.disconnect();};}
      root.dataset.xiaopAudio=JSON.stringify({enabled:true,state:audio.state,event:kind});
    }catch{}};
  listen(root,'pointerdown',unlockAudio,{capture:true});listen(root,'keydown',unlockAudio,{capture:true});
  listen(ui.querySelector('[data-sound]'),'change',e=>{prefs.sound=e.target.checked;save();if(prefs.sound)sound('wave');else root.dataset.xiaopAudio=JSON.stringify({enabled:false,state:audio?.state||'uninitialized'});});
  const sync=()=>{hit.hidden=!prefs.visible;bubble.hidden=true;ui.querySelector('[data-action="visibility"]').textContent=prefs.visible?'隐藏小 P':'显示小 P';
    ui.dataset.mode=prefs.mode;root.dataset.xiaopScene=prefs.mode;modeSelect.value=prefs.mode;
    spriteGroup.visible=prefs.visible;menu.querySelector('p').textContent=prefs.mode==='clock'?'戳数字看小 P探头 · 连点小 P进入桌面':'摸摸头 · 拖动移动 · 连点两下跳舞';
    if(canvas)canvas.style.visibility=canvasVisibility;
    if(corner)corner.style.display=prefs.mode==='clock'?cornerDisplay:'none';
    for(const b of ui.querySelectorAll('[data-mode]'))b.setAttribute('aria-pressed',String(b.dataset.mode===prefs.mode));needsLayout=true;changed=true;};
  const paint=()=>{avatar.setProp(prefs.prop);art.style.backgroundImage='none';changed=true;};paint();sync();
  const act=(value,message)=>{if(!prefs.visible){prefs.visible=true;sync();save();}state=value;since=elapsed;lastTouch=elapsed;nextIdle=elapsed+16+Math.random()*8;changed=true;if(message)speak(message);};
  const messages={happy:'嘿嘿，摸摸头好开心！',wave:'小 P 在呢！',dance:'一起摇摆～',sleep:'打个盹，摸一下就醒。'};
  for(const name of ['pointerdown','pointerup','click','dblclick','keydown'])listen(ui,name,e=>e.stopPropagation());
  // Keep native scrolling from also rotating or changing the clock.
  listen(menu,'pointermove',e=>e.stopPropagation());
  listen(launch,'click',()=>menuOpen(menu.hidden));
  for(const button of ui.querySelectorAll('[data-action]'))listen(button,'click',()=>{
    const action=button.dataset.action;
    if(action==='close'){menuOpen(false);return;}
    if(action==='visibility'){prefs.visible=!prefs.visible;sync();save();return;}
    if(action==='reset'){prefs.x=DEFAULTS.x;prefs.y=DEFAULTS.y;prefs.moved=false;needsLayout=true;save();act('wave','回到你身边啦。');return;}
    act(action,messages[action]);sound(action);record(button.textContent);menuOpen(false);
  });
  listen(range,'input',()=>{prefs.size=Number(range.value);ui.querySelector('[data-size]').textContent=prefs.size+'%';needsLayout=true;save();});
  listen(select,'change',()=>{prefs.prop=select.value;paint();save();act('wave',prefs.prop==='none'?'小 P 摘帽啦。':prefs.prop==='dino'?'暖橙小恐龙，嗷呜～':'戴上毛绒帽子，出发！');record(prefs.prop==='none'?'摘下帽子':prefs.prop==='dino'?'换上暖橙恐龙帽':'换上牛仔帽');});
  const changeMode=value=>{
    if(!['clock','companion','board'].includes(value))return;
    menuOpen(false);clearFood();resetDots();
    const to=value==='clock'?0:1,boardTo=value==='board'?1:0;
    sceneTransition={from:sceneProgress,to,since:elapsed,duration:reduced?0:Math.max(.2,1.7*Math.abs(to-sceneProgress))};
    boardTransition={from:boardProgress,to:boardTo,since:elapsed,duration:reduced?0:.7};
    prefs.mode=value;prefs.moved=false;sync();save();act('wave');
  };
  listen(modeSelect,'change',()=>changeMode(modeSelect.value));
  for(const b of ui.querySelectorAll('[data-mode]'))listen(b,'click',()=>changeMode(b.dataset.mode));
  const delay=(fn,ms)=>{const id=setTimeout(()=>{timers.delete(id);if(!disposed)fn();},ms);timers.add(id);return id;};
  const foodButtons=[];
  const clearFood=()=>{foodEffect?.element?.remove();foodEffect=null;foodPhase=null;for(const item of ui.querySelectorAll('.xiaop-flying-treat'))item.remove();ui.removeAttribute('data-food-effect');if(['charge','crunch','drink','greens'].includes(state)){state='idle';since=elapsed;changed=true;}};
  listen(root,'pointerup',e=>{if(foodEffect&&!ui.contains(e.target))clearFood();});
  const updateBoard=()=>{board.querySelector('img').src=boardPage?BOARD_ALT:BOARD;
    for(const [index,b] of foodButtons.entries())b.setAttribute('aria-label',index===0?'切换食物道具':index===1?'给小 P 充电':'给小 P '+(boardPage?ALT_NAMES[index]:FOODS[index][0]));};
  const makeTreat=(index,className)=>{const crop=FOODS[index][3],treat=document.createElement('span');treat.className=className;treat.setAttribute('aria-hidden','true');
    treat.style.backgroundImage='url("'+(boardPage?BOARD_ALT:BOARD)+'")';treat.style.backgroundSize=(1024/crop[2]*100)+'% '+(1536/crop[3]*100)+'%';
    treat.style.backgroundPosition=(crop[0]/(1024-crop[2])*100)+'% '+(crop[1]/(1536-crop[3])*100)+'%';return treat;};
  const feed=(index,clientX,clientY)=>{if(!prefs.visible){prefs.visible=true;sync();save();}
    clearFood();const name=boardPage?ALT_NAMES[index]:FOODS[index][0];
    if(index===0){boardPage=1-boardPage;updateBoard();act('peek');sound('switch');record('切换食物道具');return;}
    const kind=index===1?'charge':index===6?'greens':boardPage&&[2,3].includes(index)?'drink':'crunch';
    act(kind);sound(kind);record(index===1?'充电':'收到'+name);ui.dataset.foodEffect=kind;
    if(index===1){const meter=document.createElement('span');meter.className='xiaop-charge-meter';meter.innerHTML='<i></i>';hit.append(meter);foodEffect={kind,since:elapsed,element:meter};return;}
    const treat=makeTreat(index,'xiaop-flying-treat');ui.append(treat);
    foodEffect={kind,since:elapsed,element:treat,from:{x:clientX-left,y:clientY-top}};

  };
  for(const [index,[name,x,y]] of FOODS.entries()){
    const b=document.createElement('button');b.type='button';b.className='xiaop-food-hit';b.style.left=x*100+'%';b.style.top=y*100+'%';board.append(b);foodButtons.push(b);let held=null;
    const clearHeld=()=>{held?.element?.remove();held=null;};
    listen(b,'pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);held={id:e.pointerId,x:e.clientX,y:e.clientY,moved:false,element:null};});
    listen(b,'pointermove',e=>{if(!held||held.id!==e.pointerId)return;
      if(Math.hypot(e.clientX-held.x,e.clientY-held.y)>7){held.moved=true;held.element??=makeTreat(index,'xiaop-drag-treat');if(!held.element.parentNode)ui.append(held.element);held.element.style.left=e.clientX-left-28+'px';held.element.style.top=e.clientY-top-28+'px';}
    });
    listen(b,'pointerup',e=>{if(!held||held.id!==e.pointerId)return;const dragged=held.moved;clearHeld();if(b.hasPointerCapture(e.pointerId))b.releasePointerCapture(e.pointerId);
      const head=hit.getBoundingClientRect(),accepted=e.clientX>=head.left&&e.clientX<=head.right&&e.clientY>=head.top&&e.clientY<=head.bottom;
      if(!dragged||accepted)feed(index,e.clientX,e.clientY);else sound('switch');});
    listen(b,'pointercancel',clearHeld);listen(b,'lostpointercapture',clearHeld);cleanup.push(clearHeld);
    listen(b,'click',e=>{if(e.detail===0){const box=b.getBoundingClientRect();feed(index,box.x+box.width/2,box.y+box.height/2);}});
  }
  updateBoard();
  listen(sheet.querySelector('header button'),'click',()=>{sheet.hidden=true;});
  for(const b of ui.querySelectorAll('[data-card]'))listen(b,'click',()=>{
    if(b.dataset.card==='skills'){menuOpen(true);return;}
    const content=sheet.querySelector('.xiaop-sheet-content');content.replaceChildren();sheet.hidden=false;sheet.querySelector('strong').textContent=b.dataset.card==='notes'?'备忘录':'最近对话';
    if(b.dataset.card==='notes'){
      const text=document.createElement('textarea');text.setAttribute('aria-label','我的备忘录');text.placeholder='记下此刻的灵感…';try{text.value=localStorage.getItem('xiaop-desktop-notes')||'';}catch{}content.append(text);
      const button=document.createElement('button');button.textContent='保存备忘录';button.type='button';button.onclick=()=>{try{localStorage.setItem('xiaop-desktop-notes',text.value);button.textContent='已保存';}catch{button.textContent='保存失败，请重试';}};content.append(button);
    }else if(!history.length){content.textContent='摸摸小 P，留下第一条互动。';}
    else for(const row of [...history].reverse()){const p=document.createElement('p');p.textContent=new Date(row.when).toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})+' · '+row.action;content.append(p);}
  });
  const layout=()=>{
    const box=stage.getBoundingClientRect(),container=root.getBoundingClientRect();
    width=box.width;height=box.height;left=box.left;top=box.top;if(!width||!height)return;
    ui.style.left=(left-container.left)+'px';ui.style.top=(top-container.top)+'px';ui.style.width=width+'px';ui.style.height=height+'px';
    root.style.setProperty('--xiaop-controls-end',(left-container.left+launch.offsetLeft+launch.offsetWidth+12)+'px');
    petSize=clamp(height*(prefs.mode==='clock'?.33:.38),145,prefs.mode==='clock'?310:380)*prefs.size/100;
    // Keep the entire sprite and touch target within the stage on rotation.
    const portrait=width<height;
    petSize=Math.min(petSize,width*(portrait&&prefs.mode==='board'?.46:.78),height-105);
    targetX=clamp((prefs.moved?prefs.x:(prefs.mode==='companion'?.5:prefs.mode==='board'?(portrait?.73:.62):prefs.x))*width,petSize*.5+8,width-petSize*.5-8);
    targetY=clamp((prefs.moved?prefs.y:(prefs.mode==='clock'?prefs.y:.74))*height,petSize+14,height-148);
    hit.style.left=(targetX-petSize*.5)+'px';hit.style.top=(targetY-petSize)+'px';hit.style.width=petSize+'px';hit.style.height=petSize+'px';
    bubble.style.left=clamp(targetX,105,width-105)+'px';bubble.style.top=Math.max(12,targetY-petSize-32)+'px';
    const boardHeight=Math.min(height*.56,width*(portrait?.7:.8));board.style.height=boardHeight+'px';board.style.width=boardHeight*2/3+'px';board.style.left=(width*(portrait?.28:.36)-boardHeight/3)+'px';board.style.top=(height*.74-boardHeight)+'px';
    // Companion layout must not shrink or move the reference clock.
    // The original renderer owns clock transforms; companion layout never edits them.
    needsLayout=false;changed=true;
  };
  const position=(clientX,clientY)=>{prefs.moved=true;prefs.x=(clientX-left)/width;prefs.y=(clientY-top)/height;needsLayout=true;layout();prefs.x=targetX/width;prefs.y=targetY/height;};
  listen(hit,'pointerdown',e=>{
    if(e.button!==0)return;e.preventDefault();hit.setPointerCapture(e.pointerId);
    drag={id:e.pointerId,x:e.clientX,y:e.clientY,offsetX:e.clientX-left-targetX,offsetY:e.clientY-top-targetY,moved:false};lastTouch=elapsed;
    if(state==='sleep')act('wave','醒啦，小 P 在呢！');
  });
  listen(hit,'pointermove',e=>{
    hover=clamp((e.clientX-left-targetX)/100,-1,1);
    if(!drag||e.pointerId!==drag.id)return;
    if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>7)drag.moved=true;
    if(drag.moved){state='drag';since=elapsed;position(e.clientX-drag.offsetX,e.clientY-drag.offsetY);}
  });
  const release=e=>{
    if(!drag||drag.id!==e.pointerId)return;const moved=drag.moved;drag=null;
    if(hit.hasPointerCapture(e.pointerId))hit.releasePointerCapture(e.pointerId);
    if(e.type==='pointercancel'){act('idle');return;}
    if(moved){save();act('bounce','就在这里陪你。');}
    else if(elapsed-lastTap<.38){if(prefs.mode==='clock')changeMode('companion');else act('dance',messages.dance);lastTap=-10;}
    else {act('happy',messages.happy);sound('happy');record('摸摸头');lastTap=elapsed;}
  };
  listen(hit,'pointerup',release);listen(hit,'pointercancel',release);listen(hit,'pointerleave',()=>{if(!drag)hover=0;});
  listen(hit,'keydown',e=>{
    if(['Enter',' '].includes(e.key)){e.preventDefault();act('happy',messages.happy);sound('happy');}
    const shifts={ArrowLeft:[-.03,0],ArrowRight:[.03,0],ArrowUp:[0,-.03],ArrowDown:[0,.03]};
    if(shifts[e.key]){e.preventDefault();position(left+targetX+shifts[e.key][0]*width,top+targetY+shifts[e.key][1]*height);save();}
  });
  listen(root,'keydown',e=>{if(e.key==='Escape'&&!menu.hidden){menuOpen(false);launch.focus();}});
  listen(ui,'keydown',e=>{if(e.key==='Escape'){menuOpen(false);sheet.hidden=true;launch.focus();}});
  const observer=new ResizeObserver(()=>{needsLayout=true;});observer.observe(stage);observer.observe(launch);
  speak('我是毛绒小 P，摸摸头试试。',4);
  const durations={happy:2.4,wave:2.6,dance:4.8,bounce:1.3,feed:3.2};
  Object.assign(durations,{peek:2.4,startle:2.1,shy:2.5,giggle:2.8,tentacles:3.4,charge:3.6,crunch:3.8,drink:3.8,greens:4});
  const resetDots=()=>{for(const dot of getClockDots?.()||[]){dot.group.scale.setScalar(1);dot.group.rotation.z=0;dot.group.position.set(dot.baseX,dot.baseY,dot.baseZ);}dotAction=null;};
  // The colon responds beside the clock digits. It never follows the head or
  // becomes a permanent pair of hands attached to the character's face.
  const startTentacles=index=>{const dots=getClockDots?.()||[];if(dots.length!==2)return;resetDots();
    dotAction={since:elapsed,index,anchors:dots.map(d=>new T.Vector3(d.baseX,d.baseY,d.baseZ))};act('tentacles');sound('tentacles');record('碰了冒号，圆点轻轻伸缩后回到原位');};
  const onClockTouch=({kind,index})=>{lastClockTouch={kind,index,serial:++clockTouchSerial};if(kind==='dot'){startTentacles(index);return;}
    act('peek');sound('peek');record('碰了第'+(clamp(index,0,3)+1)+'位数字：探头');};
  // Undo only our previous frame offsets before the original clock interpolates.
  const beforeClockUpdate=()=>{for(const row of applied){row.group.position.copy(row.position);row.group.scale.copy(row.scale);row.group.quaternion.copy(row.quaternion);row.group.visible=row.visible;}applied=[];};
  const remember=group=>{applied.push({group,position:group.position.clone(),scale:group.scale.clone(),quaternion:group.quaternion.clone(),visible:group.visible});};
  const sampleTransition=(transition,current)=>{
    if(!transition)return current;
    const t=transition.duration?clamp((elapsed-transition.since)/transition.duration,0,1):1;
    return transition.from+(transition.to-transition.from)*smooth(t);
  };
  const started=performance.now();
  function update(dt,time){
    if(disposed)return false;elapsed=(performance.now()-started)/1000;
    const currentProjection=[camera.left,camera.right,camera.top,camera.bottom].join(',');
    if(needsLayout||currentProjection!==projection){projection=currentProjection;layout();}
    sceneProgress=sampleTransition(sceneTransition,sceneProgress);boardProgress=sampleTransition(boardTransition,boardProgress);
    const motion=scenePose(sceneProgress);scenePhase=motion.phase;
    if(sceneTransition&&Math.abs(sceneProgress-sceneTransition.to)<.00001){sceneProgress=sceneTransition.to;sceneTransition=null;}
    if(boardTransition&&Math.abs(boardProgress-boardTransition.to)<.00001){boardProgress=boardTransition.to;boardTransition=null;}
    board.hidden=boardProgress<.001;board.inert=prefs.mode!=='board';
    board.style.transform=`translateY(${(1-boardProgress)*(height*.6+30)}px) scale(${.92+.08*boardProgress})`;
    board.style.opacity=String(boardProgress);board.style.pointerEvents=prefs.mode==='board'?'auto':'none';
    let draw=changed||!!sceneTransition||!!boardTransition;changed=false;
    if(bubbleUntil&&elapsed>bubbleUntil){bubble.hidden=true;bubbleUntil=0;}
    let t=elapsed-since;
    if(durations[state]&&t>durations[state]){state='idle';since=elapsed;t=0;}
    if(state==='idle'&&!reduced&&elapsed-lastTouch>60){state='sleep';since=elapsed;t=0;}
    else if(state==='idle'&&!reduced&&elapsed>nextIdle){state='wave';since=elapsed;nextIdle=elapsed+18+Math.random()*10;t=0;}
    let pose=0,r=hover*.018,scaleX=1,scaleY=1,y=0;
    if(!reduced)y=Math.sin(time*1.9)*1.3;
    if(state==='happy'||state==='feed'){pose=4;r=-.025;scaleX=1.035;scaleY=.97;if(!reduced)y+=Math.sin(t*8)*2;}
    else if(state==='wave'){pose=reduced?3:(Math.floor(t*4)%2?3:2);if(!reduced)r+=Math.sin(t*6)*.025;}
    else if(state==='dance'){pose=reduced?5:(Math.floor(t*2.8)%2?6:5);if(!reduced){r=Math.sin(t*8)*.045;y=-Math.abs(Math.sin(t*8))*7;}}
    else if(state==='sleep'){pose=7;r=.025;if(!reduced){scaleY=1+Math.sin(time*1.4)*.012;scaleX=1-Math.sin(time*1.4)*.006;}}
    else if(state==='drag'){pose=3;r=hover*-.065;scaleX=.96;scaleY=1.035;y=-3;}
    else if(state==='peek'){pose=5;r=-.07;if(!reduced)y=-Math.sin(Math.min(1,t/.35)*Math.PI/2)*petSize*.07;}
    else if(state==='startle'){pose=0;const jump=Math.abs(Math.sin(t*5))*Math.exp(-t*1.7);scaleX=1-jump*.12;scaleY=1+jump*.15;y=-jump*petSize*.22;}
    else if(state==='shy'){pose=7;r=.06;y=Math.sin(Math.min(1,t/.5)*Math.PI)*petSize*.12;scaleX=.95;}
    else if(state==='giggle'){pose=4;r=reduced?0:Math.sin(t*10)*.07;y=reduced?0:-Math.abs(Math.sin(t*9))*petSize*.035;}
    else if(state==='tentacles'){pose=t<1?5:0;r=reduced?0:Math.sin(t*4)*.025;y=reduced?0:Math.sin(Math.min(1,t/1.2)*Math.PI)*petSize*.08;}
    else if(state==='charge'){pose=0;scaleX=1.025;scaleY=1.025;y=reduced?0:-Math.abs(Math.sin(t*8))*4;}
    else if(state==='crunch'){pose=Math.floor(t*5)%2?4:0;scaleX=1+Math.sin(t*14)*.035;scaleY=1-Math.sin(t*14)*.025;}
    else if(state==='drink'){pose=7;r=-.07;scaleY=.97;}
    else if(state==='greens'){pose=4;r=reduced?0:Math.sin(t*5)*.05;}
    else if(state==='bounce'&&!reduced){const spring=Math.sin(t*12)*Math.exp(-t*3.5);scaleX=1+spring*.065;scaleY=1-spring*.075;y=-Math.abs(spring)*10;}
    else if(!reduced&&elapsed%4.6>.13&&elapsed%4.6<.28)pose=1;
    frame=pose;
    const blend=reduced?1:1-Math.exp(-dt*15);rot+=(r-rot)*blend;sx+=(scaleX-sx)*blend;sy+=(scaleY-sy)*blend;bob+=(y-bob)*blend;
    const screenBounds=object=>{const box=new T.Box3().setFromObject(object),points=[];for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])points.push(new T.Vector3(x,y,z).project(camera));const minX=Math.min(...points.map(p=>p.x)),maxX=Math.max(...points.map(p=>p.x)),minY=Math.min(...points.map(p=>p.y)),maxY=Math.max(...points.map(p=>p.y));return {x:left+(minX+1)/2*width,y:top+(1-maxY)/2*height,width:(maxX-minX)/2*width,height:(maxY-minY)/2*height};};
    clock?.updateMatrixWorld(true);const first=getClockCores?.()[0],bounds=first?screenBounds(first):null;
    if(bounds&&sceneProgress===0&&elapsed-lastTargetUpdate>.25){root.dataset.xiaopClockTargets=JSON.stringify({digits:(getClockCores?.()||[]).map(screenBounds),dots:(getClockDots?.()||[]).map(d=>screenBounds(d.base))});lastTargetUpdate=elapsed;}
    const portrait=width<height,clockSize=bounds?clamp(bounds.height*.65,80,300)*prefs.size/110:petSize;
    const headSize=Math.min(clamp(height*.34,145,330)*prefs.size/110,width*(portrait&&prefs.mode==='board'?.46:.68));
    petSize=clockSize+(headSize-clockSize)*smooth(sceneProgress);
    const peek=state==='peek'?(reduced?1:peekMotion(t)):0;
    const clockX=bounds?bounds.x-left+bounds.width*.38-petSize*(.12+peek*.55):width*.18;
    const clockY=bounds?bounds.y-top+bounds.height*.88:height*.6;
    const petX=width*(.5+.12*boardProgress),petY=height*.72;
    if(!prefs.moved){targetX=clockX+(petX-clockX)*smooth(sceneProgress);targetY=clockY+(petY-clockY)*smooth(sceneProgress);}
    const jump=(1-motion.head)*headSize*1.15;
    const drawY=targetY+jump*smooth(sceneProgress)+bob;
    hit.style.left=(targetX-petSize*.58)+'px';hit.style.top=(drawY-petSize*1.1)+'px';hit.style.width=petSize*1.16+'px';hit.style.height=petSize*1.12+'px';
    hit.style.clipPath=sceneProgress<.05&&!prefs.moved?'ellipse(32% 40% at 22% 45%)':'none';
    bubble.style.left=clamp(targetX,105,width-105)+'px';bubble.style.top=Math.max(12,drawY-petSize*1.15-32)+'px';
    // World-space depth puts the complete head behind the clock, then brings it forward.
    const worldSize=(camera.top-camera.bottom)/height*petSize;
    rayOrigin.set(targetX/width*2-1,1-(drawY-petSize*.43)/height*2,-1).unproject(camera);camera.getWorldDirection(rayDirection);
    const behind=first?new T.Box3().setFromObject(first).min.z-worldSize*.5-1:-1.8;
    const depth=prefs.moved?2:behind+(2-behind)*smooth(sceneProgress);
    rayOrigin.addScaledVector(rayDirection,(depth-rayOrigin.z)/rayDirection.z);
    spriteGroup.position.copy(rayOrigin);spriteGroup.quaternion.copy(camera.quaternion);
    spriteGroup.scale.set(worldSize*sx*motion.headScale,worldSize*sy*motion.headScale,worldSize*motion.headScale);spriteGroup.visible=prefs.visible;
    const blink=state==='sleep'?1:(!reduced&&elapsed%4.6>.13&&elapsed%4.6<.28?Math.sin((elapsed%4.6-.13)/.15*Math.PI):0);
    avatar.update({time:reduced?0:time,blink,smile:['happy','giggle','greens'].includes(state)?1:0,yaw:-boardProgress*.22+hover*.09,roll:rot,hand:reduced?0:state==='wave'?Math.sin(t*7):state==='dance'?Math.sin(t*8):0,squash:(1-sy)*.35,hatLag:-rot*.3});
    shadow.hidden=!prefs.visible||sceneProgress<.05;shadow.style.left=targetX+'px';shadow.style.top=(targetY+petSize*.05)+'px';shadow.style.width=petSize*(.85+.25*motion.head)+'px';shadow.style.height=petSize*.085+'px';shadow.style.opacity=String(.24*smooth(sceneProgress)/Math.max(1,1+(targetY-drawY)/petSize*3));
    for(const [index,digit] of (getClockDigits?.()||[]).entries()){
      remember(digit.group);digit.group.scale.multiplyScalar(Math.max(.001,motion.clock));digit.group.position.y-=(1-motion.clock)*(5+index*.25);digit.group.rotateZ((1-motion.clock)*(index%2?-.15:.15));digit.group.visible=motion.clock>.001;
    }
    for(const [index,dot] of (getClockDots?.()||[]).entries()){
      remember(dot.group);dot.group.position.x+=(index===0?-1:1)*(1-motion.clock)*7;dot.group.position.y-=(1-motion.clock)*.5;dot.group.visible=motion.clock>.001;
      if(dotAction&&sceneProgress===0){const phase=elapsed-dotAction.since,amount=reduced?0:Math.sin(Math.min(1,phase/3.4)*Math.PI);dot.group.scale.set(1+amount*.4,1-amount*.12,1);if(phase>=3.4)dotAction=null;}
    }
    if(foodEffect){const age=elapsed-foodEffect.since;
      if(foodEffect.from){const f=foodMotion(reduced?Math.max(1.6,age):age,foodEffect.from,{x:targetX,y:drawY},petSize);foodPhase=f.phase;
        const size=clamp(petSize*.25,36,82);Object.assign(foodEffect.element.style,{width:size+'px',height:size+'px',left:(f.x-size/2)+'px',top:(f.y-size/2)+'px',transform:`rotate(${f.rotation}rad) scale(${f.scale})`});
        if(f.phase==='hat')avatar.update({time:reduced?0:time,blink,yaw:-boardProgress*.22,roll:rot,hand:.4,hatLag:Math.sin(age*12)*.02});
        if(f.phase==='face')avatar.update({time:reduced?0:time,blink,smile:1,yaw:.08,roll:-.04,hand:.3,squash:Math.sin(age*14)*.012});
        if(f.phase==='complete')clearFood();
      }else foodPhase='charge';
      if(age>4.4)clearFood();
    }
    ui.dataset.transition=scenePhase;ui.dataset.foodPhase=foodPhase||'';ui.dataset.modelReady=String(textureRendered);
    draw=draw||prefs.visible||sceneProgress<1;
    ui.dataset.action=state;ui.dataset.frame=String(frame);ui.dataset.moved=String(prefs.moved);
    const snapshot=JSON.stringify({...prefs,state:prefs.visible?state:'hidden',frame,lastClockTouch,tentacles:!!dotAction,boardPage,foodEffect:foodEffect?.kind||null,transition:scenePhase,sceneProgress,boardProgress,foodPhase,modelReady:textureRendered});
    if(snapshot!==lastSnapshot){root.dataset.xiaopPetState=snapshot;lastSnapshot=snapshot;}
    return draw;
  }
  function dispose(){if(disposed)return;disposed=true;finishReady(false);observer.disconnect();audio?.close().catch(()=>{});resetDots();for(const fn of cleanup)fn();for(const id of timers)clearTimeout(id);beforeClockUpdate();avatar.dispose();
    if(canvas){canvas.style.visibility=canvasVisibility;canvas.style.opacity='';canvas.style.transform='';canvas.style.transition='';}if(clock){clock.scale.copy(originalScale);clock.position.copy(originalPosition);}if(corner){corner.style.left=cornerLeft;corner.style.display=cornerDisplay;}if(originalControlsEnd)root.style.setProperty('--xiaop-controls-end',originalControlsEnd);else root.style.removeProperty('--xiaop-controls-end');ui.remove();root.classList.remove('xiaop-companion-active');delete root.dataset.xiaopPetState;delete root.dataset.xiaopScene;}
  return {update,dispose,beforeClockUpdate,onClockTouch,isReady,whenReady,didRender,isPetScene:()=>prefs.mode!=='clock',getState:()=>({...prefs,state,frame,lastClockTouch,tentacles:!!dotAction,boardPage,foodEffect:foodEffect?.kind||null,art:avatar.art,textures:avatar.textureInfo(),artReady:isReady(),textureRendered,modelReady:textureRendered,fiberCount:avatar.fiberCount,transition:scenePhase,sceneProgress,boardProgress,foodPhase})};
}
