import"./index-client.BHKBF-tO.js";import{B as e,Et as t,Gt as n,H as r,Mt as i,Nt as a,Pt as o,ct as s,et as c,jt as l,ln as u,lt as d,nn as f,pn as p,st as m,tn as h,yt as g,z as _}from"./client.DYWvmWCR.js";import{Z as v,et as y,i as b,u as x}from"./form.CbgrcR1Z.js";import{a as S,i as C}from"./demo.CcnckxZH.js";import{n as w,t as T}from"./demo-schemas.DlwAgzCm.js";var E=d(`<li> </li>`),D=d(`<div style="padding-top: 1rem;"><span style="font-size: larger; font-weight: bold;">Errors</span> <ui style="color: red; list-style-position: inside;"></ui></div>`),O=d(`<!> <!>`,1);function k(d,C){f(C,!0);let{defaults:T}=S(),k=x({...T,schema:w});var A=O(),j=i(A);b(j,{get form(){return k},novalidate:!0});var M=o(j,2),N=r=>{var d=D(),f=o(l(d),2);_(f,21,()=>v(k),([e,t])=>e,(r,o)=>{var l=n(()=>p(g(o),2));let u=()=>g(l)[1];var d=s(),f=i(d);_(f,17,u,e,(e,n)=>{var r=E(),i=a(r,!0);t(()=>c(i,g(n))),m(e,r)}),m(r,d)}),u(f),u(d),m(r,d)},P=n(()=>y(k));r(M,e=>{g(P)&&e(N)}),m(d,A),h()}var A={files:{"src/routes/+page.svelte":C(`<script lang="ts">
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