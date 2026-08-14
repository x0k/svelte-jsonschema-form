import"./index-client.CkrqgRIv.js";import{Dt as e,Et as t,Rt as n,Xt as r,Yt as i,i as a,it as o,mt as s,nt as c,r as l,tn as u}from"./client.BXzhBlXN.js";import{ft as d,r as f}from"./form.D74qHMvd.js";import{t as p}from"./Icon.K2OvYbAL.js";import{n as m,t as h}from"./demo.6LNVQqAK.js";var g=new Set([`$$slots`,`$$events`,`$$legacy`]);function _(e,t){let n=l(t,g),r=[[`path`,{d:`M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z`}],[`path`,{d:`m21.854 2.147-10.94 10.939`}]];p(e,a({name:`send`},()=>n,{get iconNode(){return r}}))}var v=n=>{u();var r=y();_(e(t(r)),{size:12}),c(n,r)},y=o(`Submit <!>`,1);function b(e,t){r(t,!0);let{defaults:o}=m();{let t=n(()=>d({submit:v}));f(e,a(()=>o,{schema:{title:`With icons`,type:`null`},get icons(){return s(t)}}))}i()}var x={files:{"src/routes/+page.svelte":h(`<script lang="ts">
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
`)},Component:b,meta:{extraDependencies:[{name:`@lucide/svelte`,version:`1.31.0`,dev:!1}]}};export{x as default};