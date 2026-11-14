import{p as B}from"./chunk-4BMEZGHF.tKpc3obz.js";import{V as y,P as z,aF as U,_ as u,g as j,s as q,a as H,b as K,t as Z,q as J,l as F,c as Q,F as X,K as Y,a4 as tt,e as et,z as at,H as rt}from"./_fields-hierarchy.astro_astro_type_script_index_0_lang.DFQVf8HU.js";import{p as nt}from"./radar-MK3ICKWK.DiQylqLD.js";import{d as O}from"./arc.DBBeNUhm.js";import{o as it}from"./ordinal.BYWQX77i.js";import"./preload-helper.DvGhUWap.js";import"./_commonjsHelpers.Cpj98o6Y.js";import"./_baseUniq.0M59ribE.js";import"./_basePickBy.DP5P5iPS.js";import"./clone.BQ85DOD1.js";import"./init.Gi6I4Gst.js";function st(t,a){return a<t?-1:a>t?1:a>=t?0:NaN}function ot(t){return t}function lt(){var t=ot,a=st,m=null,s=y(0),p=y(z),x=y(0);function i(e){var r,l=(e=U(e)).length,d,A,h=0,c=new Array(l),n=new Array(l),v=+s.apply(this,arguments),w=Math.min(z,Math.max(-z,p.apply(this,arguments)-v)),f,T=Math.min(Math.abs(w)/l,x.apply(this,arguments)),$=T*(w<0?-1:1),g;for(r=0;r<l;++r)(g=n[c[r]=r]=+t(e[r],r,e))>0&&(h+=g);for(a!=null?c.sort(function(S,C){return a(n[S],n[C])}):m!=null&&c.sort(function(S,C){return m(e[S],e[C])}),r=0,A=h?(w-l*$)/h:0;r<l;++r,v=f)d=c[r],g=n[d],f=v+(g>0?g*A:0)+$,n[d]={data:e[d],index:r,value:g,startAngle:v,endAngle:f,padAngle:T};return n}return i.value=function(e){return arguments.length?(t=typeof e=="function"?e:y(+e),i):t},i.sortValues=function(e){return arguments.length?(a=e,m=null,i):a},i.sort=function(e){return arguments.length?(m=e,a=null,i):m},i.startAngle=function(e){return arguments.length?(s=typeof e=="function"?e:y(+e),i):s},i.endAngle=function(e){return arguments.length?(p=typeof e=="function"?e:y(+e),i):p},i.padAngle=function(e){return arguments.length?(x=typeof e=="function"?e:y(+e),i):x},i}var ct=rt.pie,G={sections:new Map,showData:!1},b=G.sections,P=G.showData,ut=structuredClone(ct),pt=u(()=>structuredClone(ut),"getConfig"),dt=u(()=>{b=new Map,P=G.showData,at()},"clear"),gt=u(({label:t,value:a})=>{b.has(t)||(b.set(t,a),F.debug(`added new section: ${t}, with value: ${a}`))},"addSection"),ft=u(()=>b,"getSections"),mt=u(t=>{P=t},"setShowData"),ht=u(()=>P,"getShowData"),R={getConfig:pt,clear:dt,setDiagramTitle:J,getDiagramTitle:Z,setAccTitle:K,getAccTitle:H,setAccDescription:q,getAccDescription:j,addSection:gt,getSections:ft,setShowData:mt,getShowData:ht},vt=u((t,a)=>{B(t,a),a.setShowData(t.showData),t.sections.map(a.addSection)},"populateDb"),St={parse:u(async t=>{const a=await nt("pie",t);F.debug(a),vt(a,R)},"parse")},yt=u(t=>`
  .pieCircle{
    stroke: ${t.pieStrokeColor};
    stroke-width : ${t.pieStrokeWidth};
    opacity : ${t.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${t.pieOuterStrokeColor};
    stroke-width: ${t.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${t.pieTitleTextSize};
    fill: ${t.pieTitleTextColor};
    font-family: ${t.fontFamily};
  }
  .slice {
    font-family: ${t.fontFamily};
    fill: ${t.pieSectionTextColor};
    font-size:${t.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${t.pieLegendTextColor};
    font-family: ${t.fontFamily};
    font-size: ${t.pieLegendTextSize};
  }
`,"getStyles"),xt=yt,At=u(t=>{const a=[...t.entries()].map(s=>({label:s[0],value:s[1]})).sort((s,p)=>p.value-s.value);return lt().value(s=>s.value)(a)},"createPieArcs"),wt=u((t,a,m,s)=>{F.debug(`rendering pie chart
`+t);const p=s.db,x=Q(),i=X(p.getConfig(),x.pie),e=40,r=18,l=4,d=450,A=d,h=Y(a),c=h.append("g");c.attr("transform","translate("+A/2+","+d/2+")");const{themeVariables:n}=x;let[v]=tt(n.pieOuterStrokeWidth);v??=2;const w=i.textPosition,f=Math.min(A,d)/2-e,T=O().innerRadius(0).outerRadius(f),$=O().innerRadius(f*w).outerRadius(f*w);c.append("circle").attr("cx",0).attr("cy",0).attr("r",f+v/2).attr("class","pieOuterCircle");const g=p.getSections(),S=At(g),C=[n.pie1,n.pie2,n.pie3,n.pie4,n.pie5,n.pie6,n.pie7,n.pie8,n.pie9,n.pie10,n.pie11,n.pie12],D=it(C);c.selectAll("mySlices").data(S).enter().append("path").attr("d",T).attr("fill",o=>D(o.data.label)).attr("class","pieCircle");let W=0;g.forEach(o=>{W+=o}),c.selectAll("mySlices").data(S).enter().append("text").text(o=>(o.data.value/W*100).toFixed(0)+"%").attr("transform",o=>"translate("+$.centroid(o)+")").style("text-anchor","middle").attr("class","slice"),c.append("text").text(p.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const M=c.selectAll(".legend").data(D.domain()).enter().append("g").attr("class","legend").attr("transform",(o,k)=>{const E=r+l,L=E*D.domain().length/2,_=12*r,V=k*E-L;return"translate("+_+","+V+")"});M.append("rect").attr("width",r).attr("height",r).style("fill",D).style("stroke",D),M.data(S).append("text").attr("x",r+l).attr("y",r-l).text(o=>{const{label:k,value:E}=o.data;return p.getShowData()?`${k} [${E}]`:k});const I=Math.max(...M.selectAll("text").nodes().map(o=>o?.getBoundingClientRect().width??0)),N=A+e+r+l+I;h.attr("viewBox",`0 0 ${N} ${d}`),et(h,d,N,i.useMaxWidth)},"draw"),Ct={draw:wt},Wt={parser:St,db:R,renderer:Ct,styles:xt};export{Wt as diagram};
