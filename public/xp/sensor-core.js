export const finite = v => typeof v === 'number' && Number.isFinite(v);
export const degrees = v => finite(v) ? ((v % 360) + 360) % 360 : null;
export const direction = v => finite(v) ? ['北','东北','东','东南','南','西南','西','西北'][Math.round(degrees(v) / 45) % 8] : '—';
const number = (v, min, max) => finite(v) && v >= min && v <= max ? v : null;
export function sanitizeSample(input = {}, now = Date.now()) {
  const time = v => finite(v) && v <= now + 5000 && v >= now - 15000 ? Math.min(v, now) : 0;
  return {
    altitude:number(input.altitude,-12000,100000), altitudeAccuracy:number(input.altitudeAccuracy,0,100000),
    altitudeAt:time(input.altitudeAt), accuracy:number(input.accuracy,0,100000),
    speed:number(input.speed,0,500), gpsHeading:number(input.gpsHeading,0,360), gpsAt:time(input.gpsAt),
    compass:number(input.compass,0,360), compassAt:time(input.compassAt),
    compassKind:['磁北方向','绝对方向参考'].includes(input.compassKind) ? input.compassKind : '',
    latitude:number(input.latitude,-90,90),longitude:number(input.longitude,-180,180),
    pitch:number(input.pitch,-180,180),roll:number(input.roll,-180,180),motionAt:time(input.motionAt),
    battery:number(input.battery,0,100),batteryAt:time(input.batteryAt),
    acceleration:input.acceleration&&['x','y','z'].every(k=>finite(input.acceleration[k]))?Object.fromEntries(['x','y','z'].map(k=>[k,number(input.acceleration[k],-200,200)])):null,
    rotationRate:input.rotationRate&&['x','y','z'].every(k=>finite(input.rotationRate[k]))?Object.fromEntries(['x','y','z'].map(k=>[k,number(input.rotationRate[k],-200,200)])):null,
    pressure:number(input.pressure,0,200),relativeAltitude:number(input.relativeAltitude,-10000,10000),pressureAt:time(input.pressureAt),
    altitudeReference:['WGS84 椭球高度','平均海平面高度'].includes(input.altitudeReference)?input.altitudeReference:'',
  };
}
export function reading(sample = {}, now = Date.now()) {
  const fresh = t => finite(t) && t > 0 && now >= t - 5000 && now - t <= 15000;
  const gps = fresh(sample.gpsAt), compass = fresh(sample.compassAt);
  const moving = gps && finite(sample.speed) && sample.speed >= 1.5 && finite(sample.gpsHeading);
  return {
    altitude:fresh(sample.altitudeAt) ? sample.altitude : null,
    altitudeAccuracy:fresh(sample.altitudeAt) ? sample.altitudeAccuracy : null,
    heading:moving ? degrees(sample.gpsHeading) : compass ? degrees(sample.compass) : null,
    headingKind:moving ? '行进方向 · GPS' : compass ? sample.compassKind : '方向未提供',
    speed:gps ? sample.speed : null,
    latitude:gps?sample.latitude:null,longitude:gps?sample.longitude:null,accuracy:gps?sample.accuracy:null,
    gpsHeading:gps&&finite(sample.gpsHeading)?degrees(sample.gpsHeading):null,
    compass:compass?degrees(sample.compass):null,
    pitch:fresh(sample.motionAt)?sample.pitch:null,roll:fresh(sample.motionAt)?sample.roll:null,
    acceleration:fresh(sample.motionAt)?sample.acceleration:null,rotationRate:fresh(sample.motionAt)?sample.rotationRate:null,
    battery:fresh(sample.batteryAt)?sample.battery:null,
    pressure:fresh(sample.pressureAt)?sample.pressure:null,relativeAltitude:fresh(sample.pressureAt)?sample.relativeAltitude:null,
    altitudeReference:sample.altitudeReference||'WGS84 椭球高度',
    fresh:gps || compass || fresh(sample.altitudeAt),
  };
}
