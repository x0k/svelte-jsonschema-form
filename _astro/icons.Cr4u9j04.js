import"./index-client.DygggIMv.js";import{$t as e,At as t,Ht as n,Qt as r,_t as i,at as a,i as o,in as s,jt as c,r as l,st as u}from"./client.B0k3dZbu.js";import{ft as d,r as f}from"./form._czxSeTP.js";import{D as p}from"./box.svelte.BEIBiGJ5.js";import{a as m,i as h}from"./demo.BRvBoDhN.js";var g=new Set([`$$slots`,`$$events`,`$$legacy`]);function _(e,t){let n=l(t,g),r=[[`path`,{d:`M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z`}],[`path`,{d:`m21.854 2.147-10.94 10.939`}]];p(e,o({name:`send`},()=>n,{get iconNode(){return r}}))}var v=e=>{s();var n=y();_(c(t(n)),{size:12}),a(e,n)},y=u(`Submit <!>`,1);function b(t,a){e(a,!0);let{defaults:s}=m();{let e=n(()=>d({submit:v}));f(t,o(()=>s,{schema:{title:`With icons`,type:`null`},get icons(){return i(e)}}))}r()}var x={files:{"src/routes/+page.svelte":h(`<script lang="ts">
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
`)},Component:b,meta:{extraDependencies:[{name:`@lucide/svelte`,version:`1.22.0`,dev:!1}]}};export{x as default};