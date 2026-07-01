import"./index-client.DygggIMv.js";import{$t as e,At as t,Qt as n,at as r,ft as i,jt as a,pt as o,st as s}from"./client.B0k3dZbu.js";import{Ot as c,a as l,c as u,u as d}from"./form._czxSeTP.js";import{a as f,i as p}from"./demo.BRvBoDhN.js";var m=s(`<!> <button>My submit</button> <button>My reset</button>`,1);function h(i,s){e(s,!0);let{defaults:p}=f(),h={type:`string`,minLength:10};c(d({...p,schema:h,initialValue:`initial`,onSubmit:e=>window.alert(e)}));let g;var _=m(),v=t(_);l(v,{get ref(){return g},set ref(e){g=e},children:(e,t)=>{u(e,{})},$$slots:{default:!0}});var y=a(v,2),b=a(y,2);o(`click`,y,e=>{g?.requestSubmit()}),o(`click`,b,()=>{g?.reset()}),r(i,_),n()}i([`click`]);var g={files:{"src/routes/+page.svelte":p(`<script lang="ts">
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