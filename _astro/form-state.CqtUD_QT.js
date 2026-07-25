import"./index-client.Pqo5EW-P.js";import{Dt as e,Et as t,Tt as n,Xt as r,Yt as i,et as a,it as o,nn as s,nt as c,xt as l}from"./client.Cb7crF4c.js";import{X as u,Z as d,i as f,u as p}from"./form.B5NxhwOh.js";import{n as m,t as h}from"./demo.Cnu-2gYI.js";var g=o(`<!> <pre> </pre>`,1);function _(o,h){r(h,!0);let{defaults:_}=m(),v={type:`string`,minLength:10},y=p({..._,initialValue:`initial`,schema:v,onSubmit:console.log});var b=g(),x=t(b);f(x,{get form(){return y},novalidate:!0});var S=e(x,2),C=n(S,!0);s(S),l(e=>a(C,e),[()=>JSON.stringify({value:u(y),errors:Array.from(d(y))},null,2)]),c(o,b),i()}var v={files:{"src/routes/+page.svelte":h(`<script lang="ts">
  import {
    BasicForm,
    createForm,
    getErrors,
    getValueSnapshot,
    type Schema,
  } from "@sjsf/form";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const schema: Schema = {
    type: "string",
    minLength: 10,
  };

  const form = createForm({
    ...defaults,
    initialValue: "initial",
    schema,
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(
    { value: getValueSnapshot(form), errors: Array.from(getErrors(form)) },
    null,
    2
  )}</pre>
`)},Component:_,meta:{}};export{v as default};