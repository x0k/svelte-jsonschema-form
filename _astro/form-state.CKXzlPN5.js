import"./index-client.BHKBF-tO.js";import{Et as e,Mt as t,Nt as n,Pt as r,et as i,lt as a,nn as o,st as s,tn as c}from"./client.DYWvmWCR.js";import{X as l,Z as u,i as d,u as f}from"./form.CbgrcR1Z.js";import{a as p,i as m}from"./demo.CcnckxZH.js";var h=a(`<!> <pre> </pre>`,1);function g(a,m){o(m,!0);let{defaults:g}=p(),_={type:`string`,minLength:10},v=f({...g,initialValue:`initial`,schema:_,onSubmit:console.log});var y=h(),b=t(y);d(b,{get form(){return v},novalidate:!0});var x=r(b,2),S=n(x,!0);e(e=>i(S,e),[()=>JSON.stringify({value:l(v),errors:Array.from(u(v))},null,2)]),s(a,y),c()}var _={files:{"src/routes/+page.svelte":m(`<script lang="ts">
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
`)},Component:g,meta:{}};export{_ as default};