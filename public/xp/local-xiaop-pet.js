// Plush artwork is pre-rendered in eight consistent poses; this controller
// supplies touch gestures, spring motion and the clock's fullscreen lifecycle.
const STORE='xiaop-clock-pet-v2';
const VERSION='20261011-xiaop-clear';
const clamp=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
const DEFAULTS={visible:true,size:110,prop:'hat',x:.12,y:.86,mode:'clock',moved:false,sound:true};
const ART={none:new URL('./companions/xiaop/plush-head.png?v='+VERSION,import.meta.url).href,
  hat:new URL('./companions/xiaop/plush-head-hat.png?v='+VERSION,import.meta.url).href,
  dino:new URL('./companions/xiaop/plush-head-dino.png?v='+VERSION,import.meta.url).href};
const BOARD=new URL('./companions/xiaop/plush-food-board.png?v='+VERSION,import.meta.url).href;
const BOARD_ALT=new URL('./companions/xiaop/plush-food-board-alt.png?v='+VERSION,import.meta.url).href;
const FOODS=[['能量方块',.4,.215,[265,187,288,300]],['闪电',.67,.215,[575,190,215,300]],['小蛋糕',.4,.42,[270,500,280,290]],['披萨',.67,.42,[562,496,274,305]],['汉堡',.4,.62,[270,797,279,299]],['薯条',.67,.62,[568,785,255,310]],['西兰花',.52,.8,[387,1078,290,285]]];
const ALT_NAMES=['能量方块','闪电','小手表','咖啡','鸡腿','青苹果','西兰花'];
export function mountXiaopPet({THREE:T,root,stage,camera,clock,scene,getClockCores,getClockDots}) {
  let prefs={...DEFAULTS};
  try {const s=JSON.parse(localStorage.getItem(STORE)||'{}');prefs={
    visible:s.visible!==false,size:clamp(Number(s.size)||110,80,170),
    prop:Object.prototype.hasOwnProperty.call(ART,s.prop)?s.prop:'hat',x:Number.isFinite(s.x)?clamp(s.x,0,1):DEFAULTS.x,
    y:Number.isFinite(s.y)?clamp(s.y,0,1):DEFAULTS.y,
    mode:['clock','companion','board'].includes(s.mode)?s.mode:'clock',moved:s.moved===true,sound:s.sound!==false};} catch {}
  let disposed=false,elapsed=0,state='idle',since=0,lastTouch=0,nextIdle=16;
  let drag=null,lastTap=-10,hover=0,bubbleUntil=0,needsLayout=true,frame=-1;
  let width=0,height=0,left=0,top=0,targetX=0,targetY=0,petSize=0,projection='';
  let rot=0,sx=1,sy=1,bob=0,changed=true,lastSnapshot='',dotAction=null,boardPage=0,lastClockTouch=null,foodEffect=null,lastTargetUpdate=-1;
  const digitTouches=[0,0,0,0];let audio=null,clockTouchSerial=0;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cleanup=[],preloads=[],textures={},timers=new Set();let history=[];
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
    <div class="xiaop-pet-sheet" role="dialog" aria-label="小 P桌面卡片" hidden><header><strong></strong><button type="button" aria-label="关闭桌面卡片">×</button></header><div class="xiaop-sheet-content"></div></div>`;
  root.append(ui);
  const hit=ui.querySelector('.xiaop-pet-hit'),art=ui.querySelector('.xiaop-pet-art'),bubble=ui.querySelector('.xiaop-pet-bubble');
  const launch=ui.querySelector('.xiaop-pet-launch'),menu=ui.querySelector('.xiaop-pet-menu');
  const range=ui.querySelector('input[type=range]'),select=ui.querySelector('[aria-label="小 P帽子"]');select.value=prefs.prop;
  const modeSelect=ui.querySelector('[aria-label="小 P桌面画面"]'),board=ui.querySelector('.xiaop-food-board'),sheet=ui.querySelector('.xiaop-pet-sheet');
  const canvas=stage.querySelector('canvas'),canvasVisibility=canvas?.style.visibility;
  const spriteGroup=new T.Group(),spriteGeo=new T.PlaneGeometry(1,1),spriteMat=new T.MeshBasicMaterial({transparent:true,alphaTest:.06,depthWrite:false});
  const sprite=new T.Mesh(spriteGeo,spriteMat);spriteGroup.add(sprite);scene.add(spriteGroup);
  const loader=new T.TextureLoader(),rayOrigin=new T.Vector3(),rayDirection=new T.Vector3();
  let clockPetSize=0;
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
    ui.dataset.mode=prefs.mode;root.dataset.xiaopScene=prefs.mode;modeSelect.value=prefs.mode;board.hidden=prefs.mode!=='board';spriteGroup.visible=prefs.visible&&prefs.mode==='clock';
    menu.querySelector('p').textContent=prefs.mode==='clock'?'摸摸探头的小 P · 连点两下进入小 P桌面':'摸摸头 · 拖动移动 · 连点两下跳舞';
    if(canvas)canvas.style.visibility=prefs.mode==='clock'?canvasVisibility:'hidden';
    if(corner)corner.style.display=prefs.mode==='clock'?cornerDisplay:'none';
    for(const b of ui.querySelectorAll('[data-mode]'))b.setAttribute('aria-pressed',String(b.dataset.mode===prefs.mode));needsLayout=true;changed=true;};
  const paint=()=>{art.style.backgroundImage='url("'+ART[prefs.prop]+'")';if(textures[prefs.prop]){spriteMat.map=textures[prefs.prop];spriteMat.needsUpdate=true;frame=-1;}else spriteGroup.visible=false;};paint();sync();
  for(const [name,url] of Object.entries(ART))textures[name]=loader.load(url,texture=>{
    texture.minFilter=texture.magFilter=T.LinearFilter;texture.generateMipmaps=false;
    if(disposed){texture.dispose();return;}if(name===prefs.prop){spriteMat.map=texture;spriteMat.needsUpdate=true;frame=-1;sync();ui.dataset.artReady='true';}
  });
  for(const [name,url] of Object.entries(ART)){const img=new Image();img.onload=()=>{if(disposed)return;if(name===prefs.prop){ui.dataset.artReady='true';changed=true;}};img.onerror=()=>{if(!disposed&&name===prefs.prop)speak('小 P 还没加载好，刷新再试试。',8);};img.src=url;preloads.push(img);}
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
  let transitionToken=0;
  const changeMode=value=>{
    const token=++transitionToken;menuOpen(false);
    const enter=()=>{if(token!==transitionToken)return;resetDots();clearFood();prefs.mode=value;prefs.moved=false;sync();save();act('wave');
      if(canvas){canvas.style.opacity='';canvas.style.transform='';}
      if(!reduced){hit.animate([{transform:'translateY(60px) scale(.25)',opacity:0},{transform:'translateY(-8px) scale(1.06)',opacity:1,offset:.7},{transform:'translateY(0) scale(1)',opacity:1}],{duration:700,easing:'cubic-bezier(.2,.75,.3,1)'});
        if(value==='board')board.animate([{transform:'translateX(-50px) rotate(-9deg)',opacity:0},{transform:'translateX(0) rotate(0)',opacity:1}],{duration:650,easing:'ease-out'});}
    };
    if(prefs.mode==='clock'&&value!=='clock'&&canvas&&!reduced){canvas.style.transition='opacity .36s ease,transform .36s ease';canvas.style.opacity='0';canvas.style.transform='translateY(-25px) scale(.88)';delay(enter,360);}else enter();
  };
  listen(modeSelect,'change',()=>changeMode(modeSelect.value));
  for(const b of ui.querySelectorAll('[data-mode]'))listen(b,'click',()=>changeMode(b.dataset.mode));
  const delay=(fn,ms)=>{const id=setTimeout(()=>{timers.delete(id);if(!disposed)fn();},ms);timers.add(id);};
  const foodButtons=[];
  const clearFood=()=>{foodEffect?.element?.remove();foodEffect=null;for(const item of ui.querySelectorAll('.xiaop-flying-treat'))item.remove();ui.removeAttribute('data-food-effect');if(['charge','crunch','drink','greens'].includes(state)){state='idle';since=elapsed;changed=true;}};
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
    const treat=makeTreat(index,'xiaop-flying-treat'),destinationX=targetX+(index%2?-.21:.2)*petSize,destinationY=targetY-petSize*.46;
    treat.style.left=clientX-left-28+'px';treat.style.top=clientY-top-28+'px';
    treat.style.setProperty('--food-x',(destinationX-(clientX-left))+'px');treat.style.setProperty('--food-y',(destinationY-(clientY-top))+'px');ui.append(treat);
    const sticker=makeTreat(index,'xiaop-food-sticker');sticker.style.left=(index%2?17:57)+'%';sticker.style.top='44%';sticker.style.width='26%';sticker.style.height='26%';
    foodEffect={kind,since:elapsed,element:sticker};delay(()=>{treat.remove();if(foodEffect?.element===sticker)hit.append(sticker);},650);
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
    petSize=prefs.mode==='clock'&&clockPetSize?clockPetSize:clamp(height*(prefs.mode==='clock'?.33:.38),145,prefs.mode==='clock'?310:380)*prefs.size/100;
    // Keep the entire sprite and touch target within the stage on rotation.
    const portrait=width<height;
    petSize=Math.min(petSize,width*(portrait&&prefs.mode==='board'?.46:.78),height-105);
    targetX=clamp((prefs.moved?prefs.x:(prefs.mode==='companion'?.5:prefs.mode==='board'?(portrait?.73:.62):prefs.x))*width,petSize*.5+8,width-petSize*.5-8);
    targetY=clamp((prefs.moved?prefs.y:(prefs.mode==='clock'?prefs.y:.74))*height,petSize+14,height-148);
    hit.style.left=(targetX-petSize*.5)+'px';hit.style.top=(targetY-petSize)+'px';hit.style.width=petSize+'px';hit.style.height=petSize+'px';
    bubble.style.left=clamp(targetX,105,width-105)+'px';bubble.style.top=Math.max(12,targetY-petSize-32)+'px';
    const boardHeight=Math.min(height*.56,width*(portrait?.7:.8));board.style.height=boardHeight+'px';board.style.width=boardHeight*2/3+'px';board.style.left=(width*(portrait?.28:.36)-boardHeight/3)+'px';board.style.top=(height*.74-boardHeight)+'px';
    if(clock){clock.scale.copy(originalScale).multiplyScalar(prefs.visible?.86:1);clock.position.copy(originalPosition);if(prefs.visible)clock.position.y+=(camera.top-camera.bottom)*(width<height?.13:.075);}
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
    const variants=['peek','startle','shy','giggle'],slot=clamp(index,0,3),reaction=variants[(slot+digitTouches[slot]++)%4];
    act(reaction);sound(reaction);record('碰了第'+(slot+1)+'位数字：'+({peek:'探头',startle:'弹跳',shy:'躲一下',giggle:'开心摇头'}[reaction]));};
  const started=performance.now();
  function update(dt,time){
    if(disposed)return false;elapsed=(performance.now()-started)/1000;
    const currentProjection=[camera.left,camera.right,camera.top,camera.bottom].join(',');
    if(needsLayout||currentProjection!==projection){projection=currentProjection;layout();}
    let draw=changed;changed=false;
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
    if(pose!==frame){frame=pose;art.style.backgroundPosition=(pose%4/3*100)+'% '+(pose<4?0:100)+'%';art.style.clipPath='inset(1% 1% 2% 1%)';
      const texture=textures[prefs.prop];if(texture){texture.repeat.set(.248,.49);texture.offset.set((pose%4)/4+.001,pose<4?.505:.005);}draw=true;}
    const blend=reduced?1:1-Math.exp(-dt*15);rot+=(r-rot)*blend;sx+=(scaleX-sx)*blend;sy+=(scaleY-sy)*blend;bob+=(y-bob)*blend;
    art.style.transform=`translateY(${bob.toFixed(2)}px) rotate(${rot.toFixed(4)}rad) scale(${(sx*.92).toFixed(3)},${sy.toFixed(3)})`;
    if(prefs.mode==='clock'&&prefs.visible){
      if(elapsed-lastTargetUpdate>.25){clock.updateMatrixWorld(true);const screenBounds=object=>{const box=new T.Box3().setFromObject(object),points=[];for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z])points.push(new T.Vector3(x,y,z).project(camera));const minX=Math.min(...points.map(p=>p.x)),maxX=Math.max(...points.map(p=>p.x)),minY=Math.min(...points.map(p=>p.y)),maxY=Math.max(...points.map(p=>p.y));return {x:left+(minX+1)/2*width,y:top+(1-maxY)/2*height,width:(maxX-minX)/2*width,height:(maxY-minY)/2*height};};root.dataset.xiaopClockTargets=JSON.stringify({digits:(getClockCores?.()||[]).map(screenBounds),dots:(getClockDots?.()||[]).map(d=>screenBounds(d.base))});lastTargetUpdate=elapsed;}
      const first=getClockCores?.()[0];let bounds,point,topPoint;
      if(first){clock.updateMatrixWorld(true);bounds=new T.Box3().setFromObject(first);point=bounds.min.clone().project(camera);topPoint=bounds.max.clone().project(camera);
        const size=Math.min(width*.6,clamp(Math.abs(topPoint.y-point.y)/2*height*.66,80,320)*prefs.size/110);
        if(Math.abs(size-clockPetSize)>.2){clockPetSize=size;needsLayout=true;layout();draw=true;}}
      if(!prefs.moved){
        if(first){
          const minX=(point.x+1)/2*width,minY=(1-point.y)/2*height;
          targetX=clamp(minX-petSize*.08,petSize*.5+8,width-petSize*.5-8);
          targetY=clamp(minY-petSize*.03,petSize+14,height-148);
          hit.style.left=(targetX-petSize*.5)+'px';hit.style.top=(targetY-petSize)+'px';bubble.style.left=clamp(targetX,105,width-105)+'px';bubble.style.top=Math.max(12,targetY-petSize-32)+'px';
        }
      }
      const peeking=!prefs.moved&&!reduced?Math.sin(elapsed*.9)*petSize*.024:0;
      rayOrigin.set((targetX+peeking)/width*2-1,1-(targetY-petSize*.11+bob)/height*2,-1).unproject(camera);camera.getWorldDirection(rayDirection);
      rayOrigin.addScaledVector(rayDirection,((prefs.moved?2:-1.2)-rayOrigin.z)/rayDirection.z);spriteGroup.position.copy(rayOrigin);spriteGroup.quaternion.copy(camera.quaternion);spriteGroup.rotateZ(-rot);
      const worldSize=(camera.top-camera.bottom)/height*petSize;spriteGroup.scale.set(worldSize*sx*.92,worldSize*sy,1);
      sprite.position.y=.39;sprite.scale.y=.98;spriteGroup.visible=Boolean(spriteMat.map);draw=draw||!reduced;
      if(dotAction){const phase=elapsed-dotAction.since,dots=getClockDots?.()||[],amount=reduced?0:Math.sin(Math.min(1,phase/3.4)*Math.PI),pulse=Math.sin(phase*7);
        dots.forEach((dot,index)=>{const side=index===0?-1:1;dot.base.geometry.computeBoundingSphere();const radius=dot.base.geometry.boundingSphere.radius;
          dot.group.position.copy(dotAction.anchors[index]);dot.group.position.x+=side*radius*amount*.3;
          dot.group.scale.set(1+amount*(.55+pulse*.08),1-amount*.12,1);
          dot.group.rotation.z=side*amount*(.12+pulse*.08);
        });draw=true;if(phase>=3.4)resetDots();}
    }
    if(foodEffect&&elapsed-foodEffect.since>4.4)clearFood();
    ui.dataset.action=state;ui.dataset.frame=String(frame);ui.dataset.moved=String(prefs.moved);
    const snapshot=JSON.stringify({...prefs,state:prefs.visible?state:'hidden',frame,lastClockTouch,tentacles:!!dotAction,boardPage,foodEffect:foodEffect?.kind||null});
    if(snapshot!==lastSnapshot){root.dataset.xiaopPetState=snapshot;lastSnapshot=snapshot;}
    return draw;
  }
  function dispose(){if(disposed)return;disposed=true;observer.disconnect();audio?.close().catch(()=>{});resetDots();for(const fn of cleanup)fn();for(const img of preloads){img.onload=img.onerror=null;}for(const id of timers)clearTimeout(id);for(const texture of Object.values(textures))texture.dispose();spriteGroup.removeFromParent();spriteMat.dispose();spriteGeo.dispose();
    if(canvas){canvas.style.visibility=canvasVisibility;canvas.style.opacity='';canvas.style.transform='';canvas.style.transition='';}if(clock){clock.scale.copy(originalScale);clock.position.copy(originalPosition);}if(corner){corner.style.left=cornerLeft;corner.style.display=cornerDisplay;}if(originalControlsEnd)root.style.setProperty('--xiaop-controls-end',originalControlsEnd);else root.style.removeProperty('--xiaop-controls-end');ui.remove();root.classList.remove('xiaop-companion-active');delete root.dataset.xiaopPetState;delete root.dataset.xiaopScene;}
  return {update,dispose,onClockTouch,isPetScene:()=>prefs.mode!=='clock',getState:()=>({...prefs,state,frame,lastClockTouch,tentacles:!!dotAction,boardPage,foodEffect:foodEffect?.kind||null,art:'plush-sprite-atlas'})};
}
