/* Browser-local storage bridge for the self-use Pages build. No remote accounts. */
(() => {
  'use strict';
  const base=new URL('.',document.currentScript.src),nativeFetch=window.fetch.bind(window),randomUUID=()=>crypto.randomUUID();
  const key='xp-pages-state-v1',sockets=new Set(),sessions=new Map(),identities=new Map(),blobs=new Map();
  if(!localStorage.getItem('xp-pages-interface-v1')){
    localStorage.setItem('chat-auto-screensaver','0');
    localStorage.setItem('chat-theme-mode','dark');
    localStorage.setItem('chat-theme-auto-reset-date',new Date().toLocaleDateString('en-CA'));
    localStorage.setItem('xp-pages-interface-v1','1');
    document.documentElement.dataset.themeMode='dark';document.documentElement.dataset.theme='dark';
  }
  let config,content,library,builtinMessages,state;
  const channel=typeof BroadcastChannel==='function'?new BroadcastChannel('xp-pages-local'):null;
  const database=new Promise((resolve,reject)=>{const r=indexedDB.open('xp-pages-media',1);r.onupgradeneeded=()=>r.result.createObjectStore('files',{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
  async function mediaStore(mode,run){const db=await database;return new Promise((resolve,reject)=>{const tx=db.transaction('files',mode),request=run(tx.objectStore('files'));let result;request.onsuccess=()=>result=request.result;tx.oncomplete=()=>resolve(result);tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('素材保存失败'));});}
  function saveState(){const copy=JSON.parse(JSON.stringify(state));for(const m of copy.messages)if(m.file?.localBlobId){delete m.file.url;delete m.file.thumbnailUrl;delete m.file.coverUrl;}localStorage.setItem(key,JSON.stringify(copy));}
  const persist=()=>{saveState();channel?.postMessage({updated:true});};
  const mediaUrl=value=>value?new URL(value.replace(/^\//,''),base).href:undefined;
  async function loadState(){
    let saved;try{saved=JSON.parse(localStorage.getItem(key)||'null');}catch{}
    state=saved||{rooms:[{id:'lobby',name:'共享壁纸'},{id:'developer',name:'氛围动图'}],messages:[],profiles:{},ratings:{},hiddenBuiltins:[]};
    for(const room of state.rooms)if(!room.isPrivate)room.notice=content.channelNotices[room.id]||'';
    const files=await mediaStore('readonly',s=>s.getAll());
    for(const f of files)if(!blobs.has(f.id))blobs.set(f.id,URL.createObjectURL(f.blob));
    for(const m of state.messages)if(m.file?.localBlobId){const url=blobs.get(m.file.localBlobId);m.file.url=url;if(m.file.type.startsWith('image/'))m.file.thumbnailUrl=url;}
  }
  const ready=(async()=>{
    const responses=await Promise.all(['pages-config.json','library.json'].map(file=>nativeFetch(new URL(file,base))));
    if(responses.some(r=>!r.ok))throw new Error('内置图库加载失败，请刷新重试');
    [config,{items:library}]=await Promise.all(responses.map(r=>r.json()));
    content={ok:true,announcement:null,reminder:null,tips:[],moodQuote:'留一点时间，给自己',moodQuotes:[],channelNotices:{lobby:'本机图库 · 点缩略图切换壁纸',developer:'本机氛围图库 · 动态素材循环播放',carousel:'选择壁纸加入轮播，在这里自动播放',private:'当前浏览器的私密频道 · 素材保存在本机'}};
    if(config.nativeSensorSource){
      const params=new URLSearchParams(location.search),saved=sessionStorage.getItem('xp-phone-key');
      let phoneKey=params.get('phoneKey')||saved;
      if(!phoneKey)phoneKey=prompt('请输入 iPhone 采集 App 显示的六位访问口令')||'';
      sessionStorage.setItem('xp-phone-key',phoneKey);
      window.__XP_PHONE_SOURCE={base:base.href,key:phoneKey};
      params.delete('phoneKey');history.replaceState(null,'',location.pathname+(params.size?'?'+params:'')+location.hash);
    }
    const remoteMedia=value=>config.mediaBase&&value?new URL(value.replace(/^\//,''),config.mediaBase).href:mediaUrl(value);
    builtinMessages=library.map((m,i)=>({id:'builtin-'+m.id,roomId:m.roomId,kind:'file',text:'',sender:'本地图库',senderId:'local-library',senderRole:'user',createdAt:'2026-10-01T00:00:00.000Z',builtin:true,pinned:true,defaultSelected:m.defaultSelected,file:{url:remoteMedia(m.url),thumbnailUrl:remoteMedia(m.thumbnailUrl||m.coverUrl||(m.type.startsWith('image/')?m.url:undefined)),coverUrl:remoteMedia(m.coverUrl),name:m.name,size:m.bytes||0,type:m.type,displayVideo:m.type.startsWith('video/')},imageCategories:m.categories||[],imageReview:{status:'approved'},imageRatings:{likes:0,dislikes:0}}));
    await loadState();
  })();
  window.__XP_PAGES_READY=ready;
  // Make startup failures visible instead of leaving an endless loader.
  ready.catch(error=>{console.error(error);window.addEventListener('DOMContentLoaded',()=>{const t=document.querySelector('.startup-loading-text');if(t)t.textContent=error.message;},{once:true});});
  channel?.addEventListener('message',async()=>{await ready;await loadState();for(const s of sockets)if(s.connected&&s.data.deviceId){s.deliver('room-list',roomsFor(s.data.deviceId));s.deliver('room-state',roomState(s.data.roomId,s.data.deviceId));}});
  const io={sockets:{sockets:new Map()},emit(event,payload){for(const s of sockets)if(s.connected)s.deliver(event,payload);},to(roomId){return{emit(event,payload){for(const s of sockets)if(s.connected&&s.data.roomId===roomId)s.deliver(event,payload);}};}};

  const allMessages=()=>[...builtinMessages.filter(m=>!state.hiddenBuiltins.includes(m.id)),...state.messages];
const identity=(payload={})=>{
 const deviceId=String(payload.deviceId||randomUUID()).slice(0,100);
 const profile=state.profiles[deviceId]||{name:payload.name||'鹏友',vehicleModel:'G6',gender:'',phone:'',createdAt:new Date().toISOString()};
 profile.createdAt||=new Date().toISOString();
 profile.onlineDates||=[];const today=new Date().toLocaleDateString('en-CA');if(!profile.onlineDates.includes(today))profile.onlineDates.push(today);
 state.profiles[deviceId]=profile;
 const token=randomUUID();sessions.set(token,deviceId);
 const id={deviceId,name:profile.name,role:'user',uploadToken:token,clientActionToken:token,
  newUserWaitMs:0,newUserUploadDevelopmentBypass:true,hasUsedMobileDevice:true,
  specialChannelDisplayAllowed:true,videoReviewUploadAllowed:false,donationEntryAllowed:false,
  hasSpectrumAccess:true,creativeAccess:{'velvet-clock':true},liveShowAccessAllowed:false,
  liveShowDeviceId:deviceId,liveShowVehicleModel:profile.model||profile.vehicleModel,gameIdentityToken:token};
 identities.set(deviceId,id);persist();return id;
};
const canAccess=(room,deviceId)=>!!room&&(!room.isPrivate||room.ownerId===deviceId||room.members?.some(m=>m.id===deviceId));
const allRooms=()=>state.rooms.map(({password,...room})=>({...room,messageCount:allMessages().filter(m=>m.roomId===room.id).length,
 lastMessageAt:allMessages().filter(m=>m.roomId===room.id).at(-1)?.createdAt||'',onlineCount:[...io.sockets.sockets.values()].filter(s=>s.data.roomId===room.id).length,
 isPrivate:!!room.isPrivate,isOwner:false,imageStorage:{bytes:0,maxBytes:1024*1024*1024}}));
const roomState=(roomId='lobby',deviceId='')=>{const room=allRooms().find(r=>r.id===roomId)||allRooms()[0];return {room:{...room,isOwner:room.ownerId===deviceId},history:allMessages().filter(m=>m.roomId===roomId),canPost:roomId!=='showcase'};};
const roomsFor=deviceId=>allRooms().filter(room=>canAccess(room,deviceId)).map(room=>({...room,isOwner:room.ownerId===deviceId}));
const snapshot=payload=>{const id=identity(payload);
 for(const credential of payload.joinedPrivateRooms||[]){const room=state.rooms.find(r=>r.id===credential.roomId);if(room?.isPrivate&&room.password===credential.password&&!canAccess(room,id.deviceId))room.members.push({id:id.deviceId,name:id.name});}
 const rooms=roomsFor(id.deviceId),roomId=payload.initialRoomId!=='showcase'&&rooms.some(r=>r.id===payload.initialRoomId)?payload.initialRoomId:'lobby';
 return {ok:true,isNewUser:false,identity:id,roomList:rooms,roomState:roomState(roomId,id.deviceId),roomCache:rooms.map(r=>roomState(r.id,id.deviceId)),featurePresence:[]}};
const broadcastRooms=()=>{for(const s of io.sockets.sockets.values())s.emit('room-list',roomsFor(s.data.deviceId));};
const profileFor=id=>({...state.profiles[id],deviceId:id,model:state.profiles[id]?.model||state.profiles[id]?.vehicleModel||'',hasSpectrumAccess:true,registeredAt:state.profiles[id]?.createdAt,vehicleModels:['G6','G9','P7','P7+','MONA M03','X9'],canEdit:true});
function action(event,payload={},deviceId,roomId='lobby',socket){
 const id=identities.get(deviceId)||identity({deviceId});
 if(event==='send-message'&&payload.roomId){roomId=payload.roomId;if(!canAccess(state.rooms.find(r=>r.id===roomId),deviceId))return {ok:false,error:'尚未加入该频道'};}
 if(event==='room-history'){
  const selected=payload.roomId||roomId;if(!canAccess(state.rooms.find(r=>r.id===selected),deviceId))return {ok:false,error:'尚未加入该频道'};
  const history=allMessages().filter(m=>m.roomId===selected);return {ok:true,history,message:history.find(m=>m.id===payload.messageId),items:[],page:{hasMore:false},historyPage:{hasMore:false}};
 }
 if(event==='presence-channel')return {ok:true,channels:[]};
 if(event==='typing'||event==='reply-mention-read'||event==='spectrum-toggle-tap')return {ok:true};
 if(event==='send-message'){
  if(roomId==='showcase')return {ok:false,error:'公告频道只读，请切换到共享壁纸或私密频道'};
  if(payload.kind==='file'&&!blobs.has(payload.file?.localBlobId)&&!String(payload.file?.url||'').startsWith('blob:'))return {ok:false,error:'请选择本实例上传的文件'};
  const message={id:randomUUID(),roomId,kind:payload.kind||'text',text:String(payload.text||'').slice(0,10000),
   file:payload.file?{...payload.file,localBlobId:payload.file.localBlobId||[...blobs].find(([,url])=>url===payload.file.url)?.[0]}:undefined,sender:id.name,senderId:deviceId,senderRole:'user',createdAt:new Date().toISOString(),imageReview:{status:'approved'},imageRatings:{likes:0,dislikes:0},imageCategories:[]};
  state.messages.push(message);persist();io.to(roomId).emit('message',message);broadcastRooms();return {ok:true,id:message.id,message};
 }
 if(event==='rate-image'){
  const message=allMessages().find(m=>m.id===payload.messageId);if(!message||!canAccess(state.rooms.find(r=>r.id===message.roomId),deviceId))return {ok:false,error:'图片不存在'};
  state.ratings[message.id]??={};state.ratings[message.id][deviceId]=payload.rating||'';
  const ratings=Object.values(state.ratings[message.id]);const result={ok:true,roomId:message.roomId,messageId:message.id,likes:ratings.filter(r=>r==='like').length,dislikes:ratings.filter(r=>r==='dislike').length,rating:payload.rating||'',voterDeviceId:deviceId};
  message.imageRatings={likes:result.likes,dislikes:result.dislikes};persist();io.emit('image-rating',result);return result;
 }
 if(event==='delete-message'){
  const msg=allMessages().find(m=>m.id===(payload.messageId||payload));if(!msg||!msg.builtin&&msg.senderId!==deviceId)return {ok:false,error:'只能删除自己上传的内容'};
  if(msg.builtin)state.hiddenBuiltins.push(msg.id);else state.messages=state.messages.filter(m=>m.id!==msg.id);persist();io.emit('message-deleted',{roomId:msg.roomId,messageId:msg.id});broadcastRooms();return {ok:true};
 }
 if(event==='validate-room-creation-code')return {ok:String(payload.creationCode)==='1234',error:String(payload.creationCode)==='1234'?undefined:'本地创建口令为 1234'};
 if(event==='create-private-room'){
  if(String(payload.creationCode)!=='1234')return {ok:false,error:'本地创建口令为 1234'};
  const room={id:randomUUID().slice(0,8).toUpperCase(),name:String(payload.name||'我的频道').slice(0,40),isPrivate:true,ownerId:deviceId,password:String(payload.password||''),members:[{id:deviceId,name:id.name}],notice:''};
  state.rooms.push(room);persist();broadcastRooms();if(socket){socket.leave(roomId);socket.join(room.id);socket.data.roomId=room.id;socket.emit('room-state',roomState(room.id,deviceId));}return {ok:true,room:roomState(room.id,deviceId).room,roomState:roomState(room.id,deviceId)};
 }
 if(event==='join-private-room'||event==='mobile-private-upload'){
  const room=state.rooms.find(r=>r.id===String(payload.roomId||'').toUpperCase());
  if(!room?.isPrivate||!canAccess(room,deviceId)&&room.password!==payload.password)return {ok:false,error:'频道 ID 或密码不正确'};
  if(!canAccess(room,deviceId))room.members.push({id:deviceId,name:id.name});persist();broadcastRooms();
  if(socket){socket.leave(roomId);socket.data.roomId=room.id;socket.join(room.id);socket.emit('room-state',roomState(room.id,deviceId));}return {ok:true,room:roomState(room.id,deviceId).room};
 }
 if(event==='private-room-subscription')return {ok:true};
 if(event==='delete-private-room'){
  const room=state.rooms.find(r=>r.id===payload.roomId&&r.ownerId===deviceId);if(!room)return {ok:false,error:'只有创建者可以删除频道'};
  state.rooms=state.rooms.filter(r=>r.id!==room.id);state.messages=state.messages.filter(m=>m.roomId!==room.id);persist();broadcastRooms();return {ok:true};
 }
 if(event==='update-private-room'){
  const room=state.rooms.find(r=>r.id===payload.roomId&&r.ownerId===deviceId);if(!room)return {ok:false,error:'只有创建者可以修改频道'};
  room.name=String(payload.name||room.name).slice(0,40);room.notice=String(payload.notice||'').slice(0,2000);if(payload.password)room.password=String(payload.password);persist();broadcastRooms();io.emit('room-updated',{roomId:room.id,name:room.name,notice:room.notice});return {ok:true,room:roomState(room.id,deviceId).room};
 }
 if(event==='leave-private-room'){
  const room=state.rooms.find(r=>r.id===payload&&r.isPrivate);if(!room)return {ok:false,error:'频道不存在'};
  room.members=room.members.filter(m=>m.id!==deviceId);persist();if(socket){socket.leave(room.id);socket.data.roomId='lobby';socket.join('lobby');socket.emit('room-state',{...roomState('lobby'),redirected:true});}broadcastRooms();return {ok:true};
 }
 if(['owner-profile','mobile-owner-profile','mobile-owner-avatar'].includes(event)){
  if(payload.action==='save'){Object.assign(state.profiles[deviceId],{...payload,name:String(payload.name||id.name).slice(0,40)});id.name=state.profiles[deviceId].name;persist();io.emit('owner-name-updated',{deviceId,name:id.name});}
  return {ok:true,owner:profileFor(deviceId),profile:profileFor(deviceId),...profileFor(deviceId),modelOptions:['G6','G9','P7','P7+','MONA M03','X9'].map(v=>({value:v,label:v})),limits:{},liveShowAccessAllowed:false,liveShowDeviceId:deviceId};
 }
 if(event==='mobile-account'){
  const messages=state.messages.filter(m=>m.senderId===deviceId);
  const items=(['collection','favorites'].includes(payload.view)?allMessages().filter(m=>state.ratings[m.id]?.[deviceId]==='like'):messages).map(m=>({...m,name:m.file?.name||m.text,status:m.imageReview?.status||'approved',contentKind:m.file?.type?.startsWith('video/')?'video':'image',roomName:state.rooms.find(r=>r.id===m.roomId)?.name,thumbnailUrl:m.file?.thumbnailUrl||m.file?.url,url:m.file?.url}));
  return {ok:true,items,records:[],page:{hasMore:false,cursorId:''},owner:profileFor(deviceId),newUserWaitMs:0,categories:config.wallpaperCategories||[],atmosphereCategories:config.atmosphereCategories||[],stats:{uploaded:messages.length,pending:0,onlineDays:state.profiles[deviceId]?.onlineDates?.length||1,uploads:messages.length,images:messages.length,likes:items.length},rooms:roomsFor(deviceId),privateRooms:roomsFor(deviceId).filter(r=>r.isPrivate),identity:id};
 }
 if(event==='set-image-categories'){
  const message=state.messages.find(m=>m.id===payload.messageId&&m.senderId===deviceId);
  if(!message)return {ok:false,error:'图片不存在'};
  message.imageCategories=payload.imageCategories||[];persist();io.emit('message-categories',{roomId:message.roomId,messageId:message.id,imageCategories:message.imageCategories});return {ok:true};
 }
 if(event.startsWith('live-show-'))return {ok:true,allowed:true,items:state.messages.filter(m=>m.roomId==='live-show'),messages:[],ranking:[],page:{hasMore:false},modelOptions:[],vehicleModel:'G6'};
 return {ok:false,error:'静态版未接入此后端功能：'+event};
}


  class LocalSocket {
    constructor(){this.connected=false;this.active=true;this.data={};this.handlers=new Map();sockets.add(this);io.sockets.sockets.set(randomUUID(),this);this.connect();}
    on(event,fn){const listeners=this.handlers.get(event)||[];listeners.push(fn);this.handlers.set(event,listeners);return this;}
    off(event,fn){if(fn)this.handlers.set(event,(this.handlers.get(event)||[]).filter(x=>x!==fn));else this.handlers.delete(event);return this;}
    removeAllListeners(){this.handlers.clear();return this;}
    deliver(event,payload){for(const fn of this.handlers.get(event)||[])fn(payload);}
    connect(){this.active=true;ready.then(()=>{if(!this.active||this.connected)return;this.connected=true;this.deliver('connect');}).catch(e=>this.deliver('connect_error',e));return this;}
    disconnect(){this.active=false;this.connected=false;this.deliver('disconnect','本机连接已停止');return this;}
    leave(){} join(){}
    emit(event,payload,callback){ready.then(()=>{
      let result;
      if(event==='join'){const snap=snapshot(payload);this.data={deviceId:snap.identity.deviceId,roomId:snap.roomState.room.id};this.deliver('identity',snap.identity);this.deliver('room-list',snap.roomList);this.deliver('room-state',snap.roomState);result={...snap.identity,ok:true,isNewUser:false};}
      else if(event==='switch-room'){const roomId=typeof payload==='string'?payload:payload.roomId;if(!canAccess(state.rooms.find(r=>r.id===roomId),this.data.deviceId))result={ok:false,error:'尚未加入该频道'};else{this.data.roomId=roomId;const room=roomState(roomId,this.data.deviceId);this.deliver('room-state',room);result={ok:true,...room};}}
      else result=action(event,payload,this.data.deviceId,this.data.roomId,this);
      if(typeof callback==='function')callback(result);
    }).catch(error=>{console.error(event,error);if(typeof callback==='function')callback({ok:false,error:error.message});});return this;}
  }
  window.__XPStaticSocket=()=>new LocalSocket();
  async function upload(form){
    await ready;const file=form.get('file');
    if(!(file instanceof Blob)||!/^((image\/(jpeg|png|webp|gif))|(video\/(mp4|webm)))$/.test(file.type))throw new Error('请选择 JPG、PNG、WebP、GIF、MP4 或 WebM');
    if(file.size>100*1024*1024)throw new Error('文件不能超过 100 MB');
    const id=randomUUID();await mediaStore('readwrite',s=>s.put({id,blob:file}));
    const url=URL.createObjectURL(file);blobs.set(id,url);
    return{id,localBlobId:id,name:file.name,type:file.type,size:file.size,url,displayVideo:file.type.startsWith('video/'),thumbnailUrl:file.type.startsWith('image/')?url:undefined};
  }
  async function api(route,body={},headers=new Headers()){
    await ready;
    if(route==='/client-config')return config;
    if(route==='/public-content')return content;
    if(route==='/snapshot')return snapshot(body);
    if(route==='/mobile/session'){const id=identity(body);return{ok:true,token:id.clientActionToken,identity:id};}
    if(route==='/upload')return upload(body);
    const deviceId=sessions.get(headers.get('x-client-action-token')||headers.get('x-mobile-page-token'))||localStorage.getItem('chat-device-id')||[...identities.keys()][0];
    if(route.startsWith('/client-action/'))return action(route.slice('/client-action/'.length),body,deviceId,body.roomId||'lobby');
    if(route==='/mobile/request')return action(body.event,body.payload,deviceId);
    if(route==='/mobile-access/car-token'||route==='/mobile-access/redeem-code')return{ok:false,error:'GitHub 版仅保存本机素材；跨设备上传需另接后端。'};
    if(route==='/mobile-access/check')return{ok:true,allowed:true,uploadRoomId:'lobby'};
    if(route==='/viewer-presence')return{ok:true,leaseToken:randomUUID(),expiresAt:Date.now()+3600000};
    if(route==='/local-library')return{ok:true,total:library.length,images:library.filter(m=>m.type.startsWith('image/')).length,videos:library.filter(m=>m.type.startsWith('video/')).length};
    if(route==='/announcements/latest')return{ok:true,announcement:null};
    if(route==='/startup-reminders/latest')return{ok:true,reminder:null};
    if(route==='/games/catalog')return{ok:true,games:[]};
    if(['/preferred-sites','/group-qrcodes','/smart-codes','/vehicle-gallery','/donations','/donations/status','/mobile-preview-media'].includes(route))return{ok:true,enabled:false,sites:[],groups:[],items:[],records:[],car:[],phone:[],video:[]};
    if(['/preview-visit','/preferred-sites/click'].includes(route))return{ok:true};
    return{ok:false,error:'此功能需要后端服务；当前使用本机图库。'};
  }
  function ownApi(input){try{const url=new URL(typeof input==='string'||input instanceof URL?input:input.url,location.href);return url.origin===base.origin&&url.pathname.startsWith(base.pathname+'api/')?url.pathname.slice((base.pathname+'api').length):null;}catch{return null;}}
  window.fetch=async function(input,options={}){
    const route=ownApi(input);if(!route||route.startsWith('/sensors')||route.startsWith('/phone'))return nativeFetch(input,options);
    try{let body=options.body;if(body===undefined&&input instanceof Request)body=await input.clone().text();if(typeof body==='string')body=body?JSON.parse(body):{};
      const data=await api(route,body||{},new Headers(options.headers||(input instanceof Request?input.headers:{})));
      return new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}});
    }catch(e){return new Response(JSON.stringify({ok:false,error:e.name==='QuotaExceededError'?'浏览器存储空间不足，请删除一些自选素材。':e.message}),{status:400,headers:{'Content-Type':'application/json'}});}
  };
  // Only the upload route is handled locally. Other XHRs retain native semantics.
  const NativeXHR=window.XMLHttpRequest;
  window.XMLHttpRequest=class extends EventTarget{
    constructor(){super();this.native=new NativeXHR();this.upload=new EventTarget();this.status=0;this.readyState=0;this.responseText='';this.response='';this.headers={};this.aborted=false;}
    open(method,url,...rest){this.local=ownApi(url)==='/upload';if(!this.local){this.native.open(method,url,...rest);this.upload=this.native.upload;for(const event of ['load','error','abort','timeout','readystatechange','loadend','loadstart'])this.native.addEventListener(event,e=>{this.status=this.native.status;this.readyState=this.native.readyState;this.responseText=this.native.responseText;this.response=this.native.response;this.fire(event,e);});}this.readyState=1;}
    setRequestHeader(name,value){if(this.local)this.headers[name]=value;else this.native.setRequestHeader(name,value);}
    getResponseHeader(name){return this.local?(name.toLowerCase()==='content-type'?'application/json':null):this.native.getResponseHeader(name);}
    getAllResponseHeaders(){return this.local?'content-type: application/json':this.native.getAllResponseHeaders();}
    fire(name,event=new Event(name)){this.dispatchEvent(event);this['on'+name]?.(event);}
    send(form){if(!this.local){this.native.timeout=this.timeout||0;this.native.send(form);return;}
      upload(form).then(data=>{if(this.aborted)return;this.status=200;this.responseText=JSON.stringify(data);const p=new ProgressEvent('progress',{lengthComputable:true,loaded:data.size,total:data.size});this.upload.dispatchEvent(p);this.upload.onprogress?.(p);this.upload.dispatchEvent(new Event('load'));this.complete();}).catch(error=>{if(this.aborted)return;this.status=400;this.responseText=JSON.stringify({ok:false,error:error.name==='QuotaExceededError'?'浏览器存储空间不足':error.message});this.complete();});}
    complete(){this.readyState=4;this.response=this.responseType==='json'?JSON.parse(this.responseText):this.responseText;this.fire('readystatechange');this.fire('load');this.fire('loadend');}
    abort(){this.aborted=true;if(this.local){this.fire('abort');this.fire('loadend');}else this.native.abort();}
  };
})();
