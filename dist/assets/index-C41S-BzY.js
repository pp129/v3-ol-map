import{d as g,h as c,o as d,i as C,w as u,b as n,j as b,v as B,u as i,e as a,c as S,r as D,t as p,F as R,k as V,g as _,_ as h}from"./index-BKmgt4tr.js";const A=["value"],F=g({__name:"index",setup(L){const f={"fill-color":"rgba(255, 255, 255, 0.2)","stroke-color":"#ffcc33","stroke-width":2,"circle-radius":7,"circle-fill-color":"#ffcc33"},r=c();let t=c("");const v=["Point","LineString","Polygon","Circle","Square","Box"],m=()=>{var e;(e=r.value)==null||e.clear()};let l=c(!0);const w=()=>{var e;l.value=!l.value,(e=r.value)==null||e.setActive(l.value)};return(e,s)=>{const y=n("ol-draw"),k=n("ol-vector"),x=n("ol-map");return d(),C(x,{class:"map-container"},{default:u(()=>[b(a("select",{"onUpdate:modelValue":s[0]||(s[0]=o=>V(t)?t.value=o:t=o),class:"draw-types"},[s[1]||(s[1]=a("option",{value:""},"请选择",-1)),(d(),S(R,null,D(v,o=>a("option",{key:o,value:o},p(o),9,A)),64))],512),[[B,i(t)]]),a("button",{class:"draw-clear",onClick:m},"清除"),a("button",{class:"draw-active",onClick:w},p(i(l)?"停止绘制":"恢复绘制"),1),_(k,{"layer-style":f,source:{wrapX:!1}},{default:u(()=>[_(y,{ref_key:"olDrawRef",ref:r,snap:!0,modify:!0,type:i(t)},null,8,["type"])]),_:1})]),_:1})}}}),P=h(F,[["__scopeId","data-v-ed27bd1a"]]);export{P as default};