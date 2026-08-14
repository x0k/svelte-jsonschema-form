import"./index-client.CkrqgRIv.js";import{Dt as e,Et as t,Xt as n,Yt as r,it as i,lt as a,nt as o,ut as s}from"./client.BXzhBlXN.js";import{Ot as c,a as l,c as u,u as d}from"./form.D74qHMvd.js";import{n as f,t as p}from"./demo.6LNVQqAK.js";var m=i(`<!> <button>My submit</button> <button>My reset</button>`,1);function h(i,a){n(a,!0);let{defaults:p}=f(),h={type:`string`,minLength:10},g=d({...p,schema:h,initialValue:`initial`,onSubmit:e=>window.alert(e)});c(g);let _;var v=m(),y=t(v);l(y,{get ref(){return _},set ref(e){_=e},children:(e,t)=>{u(e,{})},$$slots:{default:!0}});var b=e(y,2),x=e(b,2);s(`click`,b,e=>{_?.requestSubmit()}),s(`click`,x,()=>{_?.reset()}),o(i,v),r()}a([`click`]);var g={files:{"src/routes/+page.svelte":p(`<script lang="ts">
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