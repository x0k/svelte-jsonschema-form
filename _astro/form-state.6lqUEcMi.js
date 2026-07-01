import"./index-client.DAEmVQx2.js";import{$t as e,At as t,Qt as n,an as r,at as i,et as a,jt as o,kt as s,st as c,wt as l}from"./client.B0k3dZbu.js";import{X as u,Z as d,i as f,u as p}from"./form.B8CJIVHV.js";import{a as m,i as h}from"./demo.BFc_HmCR.js";var g=c(`<!> <pre> </pre>`,1);function _(c,h){e(h,!0);let{defaults:_}=m(),v={type:`string`,minLength:10},y=p({..._,initialValue:`initial`,schema:v,onSubmit:console.log});var b=g(),x=t(b);f(x,{get form(){return y},novalidate:!0});var S=o(x,2),C=s(S,!0);r(S),l(e=>a(C,e),[()=>JSON.stringify({value:u(y),errors:Array.from(d(y))},null,2)]),i(c,b),n()}var v={files:{"src/routes/+page.svelte":h(`<script lang="ts">
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