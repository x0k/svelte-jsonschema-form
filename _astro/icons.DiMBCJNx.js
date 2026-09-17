import"./index-client.BHKBF-tO.js";import{Gt as e,Mt as t,Pt as n,cn as r,i,lt as a,nn as o,r as s,st as c,tn as l,yt as u}from"./client.DYWvmWCR.js";import{ft as d,r as f}from"./form.CbgrcR1Z.js";import{D as p}from"./box.svelte.DyFVmcoD.js";import{a as m,i as h}from"./demo.CcnckxZH.js";var g=new Set([`$$slots`,`$$events`,`$$legacy`]);function _(e,t){let n=s(t,g),r={name:`send`,size:24,node:[[`path`,{d:`M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z`}],[`path`,{d:`m21.854 2.147-10.94 10.939`}]]};p(e,i(()=>n,{get icon(){return r}}))}var v=e=>{r();var i=y();_(n(t(i)),{size:12}),c(e,i)},y=a(`Submit <!>`,1);function b(t,n){o(n,!0);let{defaults:r}=m();{let n=e(()=>d({submit:v}));f(t,i(()=>r,{schema:{title:`With icons`,type:`null`},get icons(){return u(n)}}))}l()}var x={files:{"src/routes/+page.svelte":h(`<script lang="ts">
  import Send from "@lucide/svelte/icons/send";
  import { SimpleForm } from "@sjsf/form";
  import { fromRecord } from "@sjsf/form/lib/resolver";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();
<\/script>

<SimpleForm
  {...defaults}
  schema={{
    title: "With icons",
    type: "null",
  }}
  icons={fromRecord({
    submit,
  })}
/>

{#snippet submit()}
  Submit <Send size={12} />
{/snippet}
`)},Component:b,meta:{extraDependencies:[{name:`@lucide/svelte`,version:`1.45.0`,dev:!1}]}};export{x as default};