import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{i as n,nn as r,tn as i}from"./client.b8lPZIo2.js";import{r as a}from"./form.D7agbGVP.js";function o(t,o){r(o,!0);let{defaults:s}=e(),c={type:`string`},l={"ui:options":{title:`Custom title`,help:`Help text`,text:{placeholder:`placeholder`}}};a(t,n(()=>s,{get schema(){return c},get uiSchema(){return l},onSubmit:e=>window.alert(e)})),i()}var s={files:{"src/routes/+page.svelte":t(`<script lang="ts">
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