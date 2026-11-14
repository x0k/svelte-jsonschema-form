import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{B as n,Et as r,Gt as i,H as a,Mt as o,Nt as s,Pt as c,ct as l,et as u,jt as d,ln as f,lt as p,nn as m,pn as h,st as g,tn as _,yt as v,z as y}from"./client.b8lPZIo2.js";import{Z as b,et as x,i as S,u as C}from"./form.D7agbGVP.js";import{n as w,t as T}from"./demo-schemas.DlwAgzCm.js";var E=p(`<li> </li>`),D=p(`<div style="padding-top: 1rem;"><span style="font-size: larger; font-weight: bold;">Errors</span> <ui style="color: red; list-style-position: inside;"></ui></div>`),O=p(`<!> <!>`,1);function k(t,p){m(p,!0);let{defaults:T}=e(),k=C({...T,schema:w});var A=O(),j=o(A);S(j,{get form(){return k},novalidate:!0});var M=c(j,2),N=e=>{var t=D(),a=c(d(t),2);y(a,21,()=>b(k),([e,t])=>e,(e,t)=>{var a=i(()=>h(v(t),2));let c=()=>v(a)[1];var d=l(),f=o(d);y(f,17,c,n,(e,t)=>{var n=E(),i=s(n,!0);r(()=>u(i,v(t))),g(e,n)}),g(e,d)}),f(a),f(t),g(e,t)},P=i(()=>x(k));a(M,e=>{v(P)&&e(N)}),g(t,A),_()}var A={files:{"src/routes/+page.svelte":t(`<script lang="ts">
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
`),"src/demo-schemas.ts":T},Component:k,meta:{}};export{A as default};