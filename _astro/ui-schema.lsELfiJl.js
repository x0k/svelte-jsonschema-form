import"./index-client.BHKBF-tO.js";import{i as e,nn as t,tn as n}from"./client.DYWvmWCR.js";import{r}from"./form.CbgrcR1Z.js";import{a as i,i as a}from"./demo.CcnckxZH.js";function o(a,o){t(o,!0);let{defaults:s}=i(),c={type:`string`},l={"ui:options":{title:`Custom title`,help:`Help text`,text:{placeholder:`placeholder`}}};r(a,e(()=>s,{get schema(){return c},get uiSchema(){return l},onSubmit:e=>window.alert(e)})),n()}var s={files:{"src/routes/+page.svelte":a(`<script lang="ts">
  import { type Schema, type UiSchemaRoot, SimpleForm } from "@sjsf/form";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const schema: Schema = {
    type: "string",
  };

  const uiSchema: UiSchemaRoot = {
    "ui:options": {
      title: "Custom title",
      help: "Help text",
      text: {
        placeholder: "placeholder",
      },
    },
  };
<\/script>

<SimpleForm
  {...defaults}
  {schema}
  {uiSchema}
  onSubmit={(v) => window.alert(v)}
/>
`)},Component:o,meta:{}};export{s as default};