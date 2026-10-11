// A simple local uploader for GIF/MP4/WebM; no original review service required.
const form = document.createElement('form');
form.className = 'local-media-upload';
form.innerHTML = `<h3>添加自己的壁纸 / 视频</h3>
  <p>JPG、PNG、WebP、GIF、MP4、WebM，单个文件不超过 100 MB。素材保存在当前浏览器，添加后立即可用。手机上的素材不会自动出现在车机。</p>
  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm" required aria-label="选择壁纸或视频">
  <select aria-label="动图保存频道"><option value="developer">氛围动图</option><option value="lobby">共享壁纸</option></select>
  <button type="submit">保存到图库</button><output aria-live="polite"></output>`;
document.body.append(form);
const sync = () => {
  form.hidden = !!location.hash && !/^#\/?upload$/.test(location.hash);
  const page=document.querySelector('section[aria-label="上传页"]');
  if(page && form.parentNode!==page)page.append(form);
  else if(!page&&!form.isConnected)document.body.append(form);
};
window.addEventListener('hashchange', sync); sync();
new MutationObserver(sync).observe(document.querySelector('#app'),{childList:true,subtree:true});
const output = form.querySelector('output'), button = form.querySelector('button');
async function json(url, payload, token) {
  const response = await fetch(url, {method:'POST', headers:{'content-type':'application/json',
    ...(token ? {'x-client-action-token':token}: {})}, body:JSON.stringify(payload)});
  const result = await response.json();
  if (!response.ok || result.ok === false) throw new Error(result.error || '请求失败');
  return result;
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  const file = form.querySelector('input').files[0];
  if (!file) return;
  if (!/^(image\/(jpeg|png|webp|gif)|video\/(mp4|webm))$/.test(file.type)) {output.textContent='请选择 JPG、PNG、WebP、GIF、MP4 或 WebM';return;}
  if (file.size > 100*1024*1024) {output.textContent='文件不能超过 100 MB';return;}
  button.disabled = true;
  try {
    const deviceId = localStorage.getItem('chat-device-id') || crypto.randomUUID();
    localStorage.setItem('chat-device-id', deviceId);
    const session = await json('./api/mobile/session', {deviceId, name:localStorage.getItem('chat-name')||'我的手机'});
    output.textContent='正在上传…';
    const payload = new FormData(); payload.append('file',file);
    const media = await new Promise((resolve,reject) => {
      const request = new XMLHttpRequest();
      request.open('POST','./api/upload'); request.setRequestHeader('x-upload-token',session.identity.uploadToken);
      request.responseType='json';
      request.upload.onprogress=e=>{if(e.lengthComputable)output.textContent=`正在上传 ${Math.round(e.loaded/e.total*100)}%`;};
      request.onload=()=>request.status===200?resolve(request.response):reject(new Error(request.response?.error||'上传失败'));
      request.onerror=()=>reject(new Error('素材保存失败，请刷新重试')); request.send(payload);
    });
    await json('./api/client-action/send-message', {roomId:form.querySelector('select').value,kind:'file',file:media},session.token);
    form.reset(); output.textContent='已保存到当前浏览器的图库。';
  } catch(error) {output.textContent=error.message;}
  finally {button.disabled=false;}
});
