import"./index-client.Pqo5EW-P.js";import{Dt as e,Et as t,St as n,Xt as r,Yt as i,ft as a,it as o,lt as s,nt as c,ut as l}from"./client.Cb7crF4c.js";import{Ot as u,c as d,u as f}from"./form.B5NxhwOh.js";import{n as p,t as m}from"./demo.Cnu-2gYI.js";function h(e){n(()=>a(window,`beforeunload`,t=>{e.isChanged&&(t.preventDefault(),t.returnValue=``)}))}var g=o(`<!> <button style="width: 100%; padding: 0.5rem; margin-top: 1rem;">Reload page</button>`,1);function _(n,a){r(a,!0);let{defaults:o}=p(),s=f({...o,schema:{type:`string`}});u(s),h(s);var m=g(),_=t(m);d(_,{}),l(`click`,e(_,2),()=>{window.location.reload()}),c(n,m),i()}s([`click`]);var v={files:{"src/routes/+page.svelte":m(`<script lang="ts">
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