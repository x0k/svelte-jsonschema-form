import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{Mt as n,Pt as r,ht as i,lt as a,mt as o,nn as s,st as c,tn as l}from"./client.b8lPZIo2.js";import{a as u,c as d,kt as f,u as p}from"./form.D7agbGVP.js";var m=a(`<!> <button>My submit</button> <button>My reset</button>`,1);function h(t,a){s(a,!0);let{defaults:o}=e(),h={type:`string`,minLength:10},g=p({...o,schema:h,initialValue:`initial`,onSubmit:e=>window.alert(e)});f(g);let _;var v=m(),y=n(v);u(y,{get ref(){return _},set ref(e){_=e},children:(e,t)=>{d(e,{})},$$slots:{default:!0}});var b=r(y,2),x=r(b,2);i(`click`,b,e=>{_?.requestSubmit()}),i(`click`,x,()=>{_?.reset()}),c(t,v),l()}o([`click`]);var g={files:{"src/routes/+page.svelte":t(`<script lang="ts">
  import {
    Content,
    createForm,
    Form,
    setFormContext,
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
    schema,
    initialValue: "initial",
    onSubmit: (v) => window.alert(v),
  });
  setFormContext(form);

  let ref: HTMLFormElement | undefined;
<\/script>

<Form bind:ref>
  <Content />
</Form>
<button
  onclick={(_e) => {
    ref?.requestSubmit();
    // or
    // form.submit(new SubmitEvent("submit", { submitter: _e.currentTarget }));
    // (\`target\` and \`currentTarget\` will not be properly set)
  }}>My submit</button
>
<button
  onclick={() => {
    ref?.reset();
    // or
    // form.reset(new Event("reset"))
    // (\`target\` and \`currentTarget\` will not be properly set)
  }}
>
  My reset
</button>
`)},Component:h,meta:{}};export{g as default};