import"./index-client.CkrqgRIv.js";import{B as e,Dt as t,Et as n,H as r,Rt as i,Tt as a,Xt as o,Yt as s,et as c,it as l,mt as u,nn as d,nt as f,rt as p,sn as m,xt as h,z as g}from"./client.BXzhBlXN.js";import{Z as _,et as v,i as y,u as b}from"./form.D74qHMvd.js";import{n as x,t as S}from"./demo.6LNVQqAK.js";import{n as C,t as w}from"./demo-schemas.DlwAgzCm.js";var T=l(`<li> </li>`),E=l(`<div style="padding-top: 1rem;"><span style="font-size: larger; font-weight: bold;">Errors</span> <ui style="color: red; list-style-position: inside;"></ui></div>`),D=l(`<!> <!>`,1);function O(l,S){o(S,!0);let{defaults:w}=x(),O=b({...w,schema:C});var k=D(),A=n(k);y(A,{get form(){return O},novalidate:!0});var j=t(A,2),M=r=>{var o=E(),s=t(a(o),2);g(s,21,()=>_(O),([e,t])=>e,(t,r)=>{var o=i(()=>m(u(r),2));let s=()=>u(o)[1];var l=p(),_=n(l);g(_,17,s,e,(e,t)=>{var n=T(),r=a(n,!0);d(n),h(()=>c(r,u(t))),f(e,n)}),f(t,l)}),d(s),d(o),f(r,o)},N=i(()=>v(O));r(j,e=>{u(N)&&e(M)}),f(l,k),s()}var k={files:{"src/routes/+page.svelte":S(`<script lang="ts">
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