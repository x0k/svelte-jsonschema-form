import"./index-client.Pqo5EW-P.js";import{Dt as e,Et as t,Xt as n,Yt as r,it as i,lt as a,nt as o,ut as s}from"./client.Cb7crF4c.js";import{Ot as c,a as l,c as u,u as d}from"./form.B5NxhwOh.js";import{n as f,t as p}from"./demo.Cnu-2gYI.js";var m=i(`<!> <button>My submit</button> <button>My reset</button>`,1);function h(i,a){n(a,!0);let{defaults:p}=f(),h={type:`string`,minLength:10};c(d({...p,schema:h,initialValue:`initial`,onSubmit:e=>window.alert(e)}));let g;var _=m(),v=t(_);l(v,{get ref(){return g},set ref(e){g=e},children:(e,t)=>{u(e,{})},$$slots:{default:!0}});var y=e(v,2),b=e(y,2);s(`click`,y,e=>{g?.requestSubmit()}),s(`click`,b,()=>{g?.reset()}),o(i,_),r()}a([`click`]);var g={files:{"src/routes/+page.svelte":p(`<script lang="ts">
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