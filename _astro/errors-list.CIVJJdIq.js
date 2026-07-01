import"./index-client.DygggIMv.js";import{$t as e,At as t,B as n,H as r,Ht as i,Qt as a,_t as o,an as s,at as c,et as l,jt as u,kt as d,ot as f,st as p,un as m,wt as h,z as g}from"./client.B0k3dZbu.js";import{Z as _,et as v,i as y,u as b}from"./form._czxSeTP.js";import{a as x,i as S}from"./demo.BRvBoDhN.js";import{n as C,t as w}from"./demo-schemas.DlwAgzCm.js";var T=p(`<li> </li>`),E=p(`<div style="padding-top: 1rem;"><span style="font-size: larger; font-weight: bold;">Errors</span> <ui style="color: red; list-style-position: inside;"></ui></div>`),D=p(`<!> <!>`,1);function O(p,S){e(S,!0);let{defaults:w}=x(),O=b({...w,schema:C});var k=D(),A=t(k);y(A,{get form(){return O},novalidate:!0});var j=u(A,2),M=e=>{var r=E(),a=u(d(r),2);g(a,21,()=>_(O),([e,t])=>e,(e,r)=>{var a=i(()=>m(o(r),2));let u=()=>o(a)[1];var p=f();g(t(p),17,u,n,(e,t)=>{var n=T(),r=d(n,!0);s(n),h(()=>l(r,o(t))),c(e,n)}),c(e,p)}),s(a),s(r),c(e,r)},N=i(()=>v(O));r(j,e=>{o(N)&&e(M)}),c(p,k),a()}var k={files:{"src/routes/+page.svelte":S(`<script lang="ts">
  import { BasicForm, createForm, getErrors, hasErrors } from "@sjsf/form";

  import { getDemoContext } from "@/lib/demo";

  import { objectSchema } from "../demo-schemas";

  const { defaults } = getDemoContext();

  const form = createForm({
    ...defaults,
    schema: objectSchema,
  });
<\/script>

<BasicForm {form} novalidate />

{#if hasErrors(form)}
  <div style="padding-top: 1rem;">
    <span style="font-size: larger; font-weight: bold;">Errors</span>
    <ui style="color: red; list-style-position: inside;">
      {#each getErrors(form) as [path, errors] (path)}
        {#each errors as error}
          <li>{error}</li>
        {/each}
      {/each}
    </ui>
  </div>
{/if}
`),"src/demo-schemas.ts":w},Component:O,meta:{}};export{k as default};