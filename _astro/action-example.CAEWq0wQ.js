import"./index-client.DygggIMv.js";import{$t as e,Qt as t,at as n,ft as r,ln as i,pt as a,st as o}from"./client.B0k3dZbu.js";import{Ot as s,c,u as l}from"./form._czxSeTP.js";import{a as u,i as d}from"./demo.BRvBoDhN.js";var f=(e,t=i,r=i,o=i,s=i)=>{var c=p();a(`click`,c,()=>{o().current=Math.floor(Math.random()*100)}),n(e,c)},p=o(`<button type="button">Random</button>`);function m(n,r){e(r,!0);let{defaults:i}=u();s(l({...i,schema:{type:`number`},uiSchema:{"ui:options":{title:`Number`,action:f}}})),c(n,{}),t()}r([`click`]);var h={files:{"src/routes/+page.svelte":d(`<script lang="ts">
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