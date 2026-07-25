import"./index-client.Pqo5EW-P.js";import{Xt as e,Yt as t,it as n,lt as r,nt as i,on as a,ut as o}from"./client.Cb7crF4c.js";import{Ot as s,c,u as l}from"./form.B5NxhwOh.js";import{n as u,t as d}from"./demo.Cnu-2gYI.js";var f=(e,t=a,n=a,r=a,s=a)=>{var c=p();o(`click`,c,()=>{r().current=Math.floor(Math.random()*100)}),i(e,c)},p=n(`<button type="button">Random</button>`);function m(n,r){e(r,!0);let{defaults:i}=u();s(l({...i,schema:{type:`number`},uiSchema:{"ui:options":{title:`Number`,action:f}}})),c(n,{}),t()}r([`click`]);var h={files:{"src/routes/+page.svelte":d(`<script lang="ts">
  import {
    Content,
    createForm,
    setFormContext,
    type Config,
    type FieldErrors,
    type FormState,
  } from "@sjsf/form";
  import type { Ref } from "@sjsf/form/lib/svelte.svelte";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const form = createForm({
    ...defaults,
    schema: { type: "number" },
    uiSchema: {
      "ui:options": {
        title: "Number",
        action: randomInt,
      },
    },
  });
  setFormContext(form);
<\/script>

{#snippet randomInt(
  _ctx: FormState<unknown>,
  _config: Config,
  valueRef: Ref<unknown>,
  _errors: FieldErrors
)}
  <button
    type="button"
    onclick={() => {
      valueRef.current = Math.floor(Math.random() * 100);
    }}
  >
    Random
  </button>
{/snippet}

<Content />
`)},Component:m,meta:{}};export{h as default};