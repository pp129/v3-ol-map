import{d as w,h as a,m as y,o as b,i as j,w as i,b as n,g as s,u}from"./index-BUmfjGtO.js";const B=w({__name:"index",setup(M){const _={zoom:11,minZoom:11,center:[118.12582777425764,24.637526109241485],smoothExtentConstraint:!0,constrainResolution:!0};let r=a(1);const h=o=>o.get("value")/r.value;let m=a();const d=o=>{fetch(`/lonlat${o}.json`).then(e=>e.json()).then(e=>{r.value=Math.max(...e.map(t=>t.value)),m.value={type:"FeatureCollection",features:[...e].map(t=>({type:"Feature",geometry:{type:"Point",coordinates:[t.longitude,t.latitude]},properties:t}))}})};let l=a(0),c=a(3),f=a(20);const p=()=>{d(l.value),setTimeout(()=>{l.value<23&&(l.value++,p())},1e3)},g=o=>{const{zoom:e}=o;c.value=3+(e-11)*Math.pow(1.5,e-11)};return y(()=>{p()}),(o,e)=>{const t=n("ol-tile"),v=n("ol-feature"),x=n("ol-heatmap"),C=n("ol-map");return b(),j(C,{view:_,onChangeZoom:g},{default:i(()=>[s(t,{"tile-type":"BAIDU"}),s(x,{"z-index":8,"class-name":"heatmap",weight:h,radius:u(c),blur:u(f)},{default:i(()=>[s(v,{"geo-json":u(m)},null,8,["geo-json"])]),_:1},8,["radius","blur"])]),_:1})}}});export{B as default};
