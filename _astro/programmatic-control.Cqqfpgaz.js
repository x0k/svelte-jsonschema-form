import"./index-client.BHKBF-tO.js";import{Mt as e,Pt as t,ht as n,lt as r,mt as i,nn as a,st as o,tn as s}from"./client.DYWvmWCR.js";import{Ot as c,a as l,c as u,u as d}from"./form.CbgrcR1Z.js";import{a as f,i as p}from"./demo.CcnckxZH.js";var m=r(`<!> <button>My submit</button> <button>My reset</button>`,1);function h(r,i){a(i,!0);let{defaults:p}=f(),h={type:`string`,minLength:10},g=d({...p,schema:h,initialValue:`initial`,onSubmit:e=>window.alert(e)});c(g);let _;var v=m(),y=e(v);l(y,{get ref(){return _},set ref(e){_=e},children:(e,t)=>{u(e,{})},$$slots:{default:!0}});var b=t(y,2),x=t(b,2);n(`click`,b,e=>{_?.requestSubmit()}),n(`click`,x,()=>{_?.reset()}),o(r,v),s()}i([`click`]);var g={files:{"src/routes/+page.svelte":p(`<script lang="ts">
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