import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{Et as n,Mt as r,Nt as i,Pt as a,et as o,lt as s,nn as c,st as l,tn as u}from"./client.b8lPZIo2.js";import{X as d,Z as f,i as p,u as m}from"./form.D7agbGVP.js";var h=s(`<!> <pre> </pre>`,1);function g(t,s){c(s,!0);let{defaults:g}=e(),_={type:`string`,minLength:10},v=m({...g,initialValue:`initial`,schema:_,onSubmit:console.log});var y=h(),b=r(y);p(b,{get form(){return v},novalidate:!0});var x=a(b,2),S=i(x,!0);n(e=>o(S,e),[()=>JSON.stringify({value:d(v),errors:Array.from(f(v))},null,2)]),l(t,y),u()}var _={files:{"src/routes/+page.svelte":t(`<script lang="ts">
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