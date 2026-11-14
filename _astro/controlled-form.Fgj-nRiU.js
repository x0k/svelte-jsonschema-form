import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{Et as n,Mt as r,Nt as i,Pt as a,Vt as o,et as s,lt as c,nn as l,st as u,tn as d,yt as f,zt as p}from"./client.b8lPZIo2.js";import{i as m,u as h}from"./form.D7agbGVP.js";var g=c(`<!> <pre> </pre>`,1);function _(t,c){l(c,!0);let{defaults:_}=e(),v={type:`string`},y=o(`initial`),b=h({..._,schema:v,value:[()=>f(y),e=>p(y,e,!0)],onSubmit:console.log});var x=g(),S=r(x);m(S,{get form(){return b}});var C=a(S,2),w=i(C,!0);n(e=>s(w,e),[()=>JSON.stringify(f(y),null,2)]),u(t,x),d()}var v={files:{"src/routes/+page.svelte":t(`<script lang="ts">
  import { BasicForm, createForm, type Schema } from "@sjsf/form";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const schema: Schema = {
    type: "string",
  };

  let value = $state("initial");

  const form = createForm<string>({
    ...defaults,
    schema,
    value: [() => value, (v) => (value = v)],
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} />

<pre>{JSON.stringify(value, null, 2)}</pre>
`)},Component:_,meta:{}};export{v as default};