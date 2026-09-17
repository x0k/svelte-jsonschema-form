import"./index-client.BHKBF-tO.js";import{fn as e,ht as t,lt as n,mt as r,nn as i,st as a,tn as o}from"./client.DYWvmWCR.js";import{Ot as s,c,u as l}from"./form.CbgrcR1Z.js";import{a as u,i as d}from"./demo.CcnckxZH.js";var f=(n,r=e,i=e,o=e,s=e)=>{var c=p();t(`click`,c,()=>{o().current=Math.floor(Math.random()*100)}),a(n,c)},p=n(`<button type="button">Random</button>`);function m(e,t){i(t,!0);let{defaults:n}=u(),r=l({...n,schema:{type:`number`},uiSchema:{"ui:options":{title:`Number`,action:f}}});s(r),c(e,{}),o()}r([`click`]);var h={files:{"src/routes/+page.svelte":d(`<script lang="ts">
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