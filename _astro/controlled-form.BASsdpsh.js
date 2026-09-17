import"./index-client.BHKBF-tO.js";import{Et as e,Mt as t,Nt as n,Pt as r,Vt as i,et as a,lt as o,nn as s,st as c,tn as l,yt as u,zt as d}from"./client.DYWvmWCR.js";import{i as f,u as p}from"./form.CbgrcR1Z.js";import{a as m,i as h}from"./demo.CcnckxZH.js";var g=o(`<!> <pre> </pre>`,1);function _(o,h){s(h,!0);let{defaults:_}=m(),v={type:`string`},y=i(`initial`),b=p({..._,schema:v,value:[()=>u(y),e=>d(y,e,!0)],onSubmit:console.log});var x=g(),S=t(x);f(S,{get form(){return b}});var C=r(S,2),w=n(C,!0);e(e=>a(w,e),[()=>JSON.stringify(u(y),null,2)]),c(o,x),l()}var v={files:{"src/routes/+page.svelte":h(`<script lang="ts">
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