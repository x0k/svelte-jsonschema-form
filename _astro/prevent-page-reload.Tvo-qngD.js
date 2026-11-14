import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{Dt as n,Mt as r,Pt as i,_t as a,ht as o,lt as s,mt as c,nn as l,st as u,tn as d}from"./client.b8lPZIo2.js";import{c as f,kt as p,u as m}from"./form.D7agbGVP.js";function h(e){n(()=>a(window,`beforeunload`,t=>{e.isChanged&&(t.preventDefault(),t.returnValue=``)}))}var g=s(`<!> <button style="width: 100%; padding: 0.5rem; margin-top: 1rem;">Reload page</button>`,1);function _(t,n){l(n,!0);let{defaults:a}=e(),s=m({...a,schema:{type:`string`}});p(s),h(s);var c=g(),_=r(c);f(_,{});var v=i(_,2);o(`click`,v,()=>{window.location.reload()}),u(t,c),d()}c([`click`]);var v={files:{"src/routes/+page.svelte":t(`<script lang="ts">
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