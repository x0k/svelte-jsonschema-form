import"./index-client.CkrqgRIv.js";import{Xt as e,Yt as t,i as n}from"./client.BXzhBlXN.js";import{r}from"./form.D74qHMvd.js";import{n as i,t as a}from"./demo.6LNVQqAK.js";function o(a,o){e(o,!0);let{defaults:s}=i(),c={type:`string`},l={"ui:options":{title:`Custom title`,help:`Help text`,text:{placeholder:`placeholder`}}};r(a,n(()=>s,{get schema(){return c},get uiSchema(){return l},onSubmit:e=>window.alert(e)})),t()}var s={files:{"src/routes/+page.svelte":a(`<script lang="ts">
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