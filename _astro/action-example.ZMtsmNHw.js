import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{fn as n,ht as r,lt as i,mt as a,nn as o,st as s,tn as c}from"./client.b8lPZIo2.js";import{c as l,kt as u,u as d}from"./form.D7agbGVP.js";var f=(e,t=n,i=n,a=n,o=n)=>{var c=p();r(`click`,c,()=>{a().current=Math.floor(Math.random()*100)}),s(e,c)},p=i(`<button type="button">Random</button>`);function m(t,n){o(n,!0);let{defaults:r}=e(),i=d({...r,schema:{type:`number`},uiSchema:{"ui:options":{title:`Number`,action:f}}});u(i),l(t,{}),c()}a([`click`]);var h={files:{"src/routes/+page.svelte":t(`<script lang="ts">
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