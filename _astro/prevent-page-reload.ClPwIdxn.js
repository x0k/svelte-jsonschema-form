import"./index-client.BHKBF-tO.js";import{Dt as e,Mt as t,Pt as n,_t as r,ht as i,lt as a,mt as o,nn as s,st as c,tn as l}from"./client.DYWvmWCR.js";import{Ot as u,c as d,u as f}from"./form.CbgrcR1Z.js";import{a as p,i as m}from"./demo.CcnckxZH.js";function h(t){e(()=>r(window,`beforeunload`,e=>{t.isChanged&&(e.preventDefault(),e.returnValue=``)}))}var g=a(`<!> <button style="width: 100%; padding: 0.5rem; margin-top: 1rem;">Reload page</button>`,1);function _(e,r){s(r,!0);let{defaults:a}=p(),o=f({...a,schema:{type:`string`}});u(o),h(o);var m=g(),_=t(m);d(_,{});var v=n(_,2);i(`click`,v,()=>{window.location.reload()}),c(e,m),l()}o([`click`]);var v={files:{"src/routes/+page.svelte":m(`<script lang="ts">
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