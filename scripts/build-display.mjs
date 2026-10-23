import {readFile,writeFile,readdir,unlink} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),xp=path.join(root,'public/xp');
const hash=value=>createHash('sha256').update(value).digest('hex').slice(0,12);
const outputs=new Map();
function emit(prefix,extension,source){const name=`${prefix}-${hash(source)}.${extension}`;outputs.set(name,source);return name;}
const state=emit('display-state','js',await readFile(path.join(xp,'display-state.js'),'utf8'));
const css=emit('sensor-panel','css',await readFile(path.join(xp,'sensor-panel.css'),'utf8'));
const panel=emit('sensor-panel','js',(await readFile(path.join(xp,'sensor-panel.js'),'utf8'))
  .replace('./display-state.js?v=20261023-fullscreen','./'+state)
  .replace('./sensor-panel.css?v=20261023-fullscreen','./'+css));
const entry=emit('local-sensors','js',(await readFile(path.join(xp,'local-sensors.js'),'utf8')).replace('./sensor-panel.js?v=20261023-fullscreen','./'+panel));
const style=emit('local-display-ui','css',await readFile(path.join(root,'features/display/style.css'),'utf8'));
for(const name of await readdir(xp))if(/^(?:display-state|sensor-panel|local-sensors|local-display-ui)-[a-f0-9]{12}\.(?:js|css)$/.test(name)&&!outputs.has(name))await unlink(path.join(xp,name));
for(const [name,source]of outputs)await writeFile(path.join(xp,name),source);
const index=path.join(xp,'index.html');let html=await readFile(index,'utf8');
html=html.replace(/src="\.\/local-sensors(?:-[a-f0-9]+)?\.js(?:\?[^" ]*)?"/,`src="./${entry}"`)
  .replace(/href="\.\/local-display-ui-[a-f0-9]+\.css"/,`href="./${style}"`);
await writeFile(index,html);
const manifestPath=path.join(xp,'offline-manifest.json'),manifest=JSON.parse(await readFile(manifestPath,'utf8'));
manifest.files=[...new Set([...manifest.files.filter(x=>!/^(?:display-state|sensor-panel|local-sensors|local-display-ui)-[a-f0-9]{12}\.(?:js|css)$/.test(x)), 'display-state.js',...outputs.keys()])];
await writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
await writeFile(path.join(xp,'display-version.json'),JSON.stringify({version:'20261023-fullscreen',state,panel,entry,style})+'\n');
console.log(`Display built: ${entry}; ${style}`);
