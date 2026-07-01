import"./index-client.DygggIMv.js";import{$t as e,At as t,Qt as n,Tt as r,at as i,ft as a,ht as o,jt as s,pt as c,st as l}from"./client.B0k3dZbu.js";import{Ot as u,c as d,u as f}from"./form._czxSeTP.js";import{a as p,i as m}from"./demo.BRvBoDhN.js";function h(e){r(()=>o(window,`beforeunload`,t=>{e.isChanged&&(t.preventDefault(),t.returnValue=``)}))}var g=l(`<!> <button style="width: 100%; padding: 0.5rem; margin-top: 1rem;">Reload page</button>`,1);function _(r,a){e(a,!0);let{defaults:o}=p(),l=f({...o,schema:{type:`string`}});u(l),h(l);var m=g(),_=t(m);d(_,{}),c(`click`,s(_,2),()=>{window.location.reload()}),i(r,m),n()}a([`click`]);var v={files:{"src/routes/+page.svelte":m(`<script lang="ts">
  import { Content, createForm, setFormContext } from "@sjsf/form";
  import { preventPageReload } from "@sjsf/form/prevent-page-reload.svelte";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const form = createForm({
    ...defaults,
    schema: { type: "string" },
  });
  setFormContext(form);

  preventPageReload(form);
<\/script>

<Content />

<button
  style="width: 100%; padding: 0.5rem; margin-top: 1rem;"
  onclick={() => {
    window.location.reload();
  }}
>
  Reload page
</button>
`)},Component:_,meta:{}};export{v as default};