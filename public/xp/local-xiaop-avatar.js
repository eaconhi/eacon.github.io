// Articulated layers preserve the authored soft fur and recognizable 小 P face.
// They share the clock's WebGL scene, so digit occlusion is real depth testing.
export function createXiaopAvatar(T,{renderer}={}) {
 const group=new T.Group(),head=new T.Group();group.add(head);
 const materials=new Set(),geometries=new Set();let disposed=false,ready=false,headsReady=false;
 const texture=new T.TextureLoader().load(new URL('./companions/xiaop/plush-parts-v3.png?v=20261012-ideal-motion-3',import.meta.url).href,()=>{if(disposed){texture.dispose();return;}ready=true;});
 const heads=new T.TextureLoader().load(new URL('./companions/xiaop/plush-heads-fine-v5.png?v=20261012-plush-release-1',import.meta.url).href,()=>{if(disposed){heads.dispose();return;}headsReady=true;});
 const anisotropy=Math.min(8,renderer?.capabilities.getMaxAnisotropy?.()||1);heads.anisotropy=texture.anisotropy=anisotropy;
 heads.minFilter=T.LinearMipMapLinearFilter;heads.magFilter=T.LinearFilter;heads.generateMipmaps=true;
 texture.minFilter=T.LinearMipMapLinearFilter;texture.magFilter=T.LinearFilter;texture.generateMipmaps=true;
 const vertexShader=`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
 const fragmentShader=`uniform sampler2D uAtlas;uniform vec4 uRect;uniform float uOpacity;uniform float uAlphaPower;varying vec2 vUv;
 void main(){vec2 uv=uRect.xy+vUv*uRect.zw;vec4 color=texture2D(uAtlas,uv);float alpha=(uAlphaPower>0.?pow(color.a,uAlphaPower):smoothstep(.045,.36,color.a))*uOpacity;if(alpha<.018)discard;gl_FragColor=vec4(color.rgb,alpha);}`;
 const part=(rect,width,height,parent=head,opacity=1)=>{
  const [x,y,w,h]=rect,geometry=new T.PlaneGeometry(width,height,8,8);geometries.add(geometry);
  const material=new T.ShaderMaterial({uniforms:{uAtlas:{value:texture},uRect:{value:new T.Vector4(x/1536,1-(y+h)/1024,w/1536,h/1024)},uOpacity:{value:opacity},uAlphaPower:{value:0}},vertexShader,fragmentShader,transparent:true,depthTest:true,depthWrite:false,side:T.DoubleSide});materials.add(material);
  const mesh=new T.Mesh(geometry,material);mesh.frustumCulled=false;parent.add(mesh);return mesh;
 };
 const face=part([0,0,512,512],1.13,1.13);face.position.set(0,.115,0);face.material.uniforms.uAtlas.value=heads;face.material.uniforms.uRect.value.set(1/3,0,1/3,1);
 const hands=[part([25,650,235,260],.19,.21,group),part([280,650,235,260],.19,.21,group)];
 hands.forEach((p,i)=>p.position.set((i?1:-1)*.43,-.34,-.01));
 const eyes=[part([608,624,136,256],.154,.285),part([788,624,136,256],.154,.285)];
 const smiles=[part([1035,680,235,180],.215,.165,head,0),part([1280,680,235,180],.215,.165,head,0)];
 eyes.forEach((p,i)=>p.position.set((i?1:-1)*.135,-.055,.016));smiles.forEach((p,i)=>p.position.set((i?1:-1)*.135,-.057,.02));
 face.renderOrder=10;hands.forEach(p=>p.renderOrder=11);eyes.forEach(p=>{p.renderOrder=12;p.material.uniforms.uAlphaPower.value=1.6;});smiles.forEach(p=>{p.renderOrder=13;p.material.uniforms.uAlphaPower.value=1.6;});
 function setProp(value){const col=value==='hat'?1:value==='dino'?2:0;face.material.uniforms.uRect.value.set(col/3,0,1/3,1);}
 setProp('hat');
 function update({time=0,blink=0,smile=0,yaw=0,roll=0,squash=0,hand=0,hatLag=0}={}){
  head.rotation.set(0,yaw*.55,roll);head.scale.set(1+squash,1-squash,1);

  eyes.forEach(p=>{p.scale.y=Math.max(.025,1-blink);p.material.uniforms.uOpacity.value=1-smile;});
  smiles.forEach(p=>{p.scale.y=Math.max(.025,1-blink);p.material.uniforms.uOpacity.value=smile;});
  hands.forEach((p,i)=>{p.position.y=-.34+Math.max(0,hand*(i===0?1:-1))*.15+Math.sin(time*2+i)*.004;p.rotation.z=(i===0?-1:1)*hand*.6;});
 }
 function dispose(){if(disposed)return;disposed=true;group.removeFromParent();for(const g of geometries)g.dispose();for(const m of materials)m.dispose();texture.dispose();heads.dispose();}
 return {group,update,setProp,dispose,isReady:()=>ready&&headsReady,fiberCount:0,art:'articulated-plush-layers',textureInfo:()=>({headWidth:heads.image?.width||0,headHeight:heads.image?.height||0,perHeadWidth:(heads.image?.width||0)/3,anisotropy,mipmaps:heads.generateMipmaps})};
}
