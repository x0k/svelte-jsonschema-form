import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{Gt as n,Mt as r,Pt as i,cn as a,i as o,lt as s,nn as c,r as l,st as u,tn as d,yt as f}from"./client.b8lPZIo2.js";import{s as p}from"./button.CTZX0heA.js";import{ft as m,r as h}from"./form.D7agbGVP.js";var g={name:`send`,size:24,node:[[`path`,{d:`M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z`}],[`path`,{d:`m21.854 2.147-10.94 10.939`}]]};g.node;var _=new Set([`$$slots`,`$$events`,`$$legacy`]);function v(e,t){let n=l(t,_);p(e,o(()=>n,{get icon(){return g}}))}var y=e=>{a();var t=b();v(i(r(t)),{size:12}),u(e,t)},b=s(`Submit <!>`,1);function x(t,r){c(r,!0);let{defaults:i}=e();{let e=n(()=>m({submit:y}));h(t,o(()=>i,{schema:{title:`With icons`,type:`null`},get icons(){return f(e)}}))}d()}var S={files:{"src/routes/+page.svelte":t(`<script lang="ts">
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
`)},Component:x,meta:{extraDependencies:[{name:`@lucide/svelte`,version:`1.72.0`,dev:!1}]}};export{S as default};