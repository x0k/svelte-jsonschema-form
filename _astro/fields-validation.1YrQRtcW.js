import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{Gt as n,i as r,nn as i,tn as a,yt as o}from"./client.b8lPZIo2.js";import{Ut as s,Wt as c,r as l}from"./form.D7agbGVP.js";import{n as u,r as d,t as f}from"./demo-schemas.DlwAgzCm.js";function p(t,f){i(f,!0);let{defaults:p}=e();{let e=n(()=>c|s);l(t,r(()=>p,{get schema(){return u},get uiSchema(){return d},get fieldsValidationMode(){return o(e)}}))}a()}var m={files:{"src/routes/+page.svelte":t(`<script lang="ts">
  import { ON_CHANGE, ON_INPUT, SimpleForm } from "@sjsf/form";

  import { getDemoContext } from "@/lib/demo";

  import { objectSchema, objectUiSchema } from "../demo-schemas";

  const { defaults } = getDemoContext();
<\/script>

<SimpleForm
  {...defaults}
  schema={objectSchema}
  uiSchema={objectUiSchema}
  fieldsValidationMode={ON_INPUT | ON_CHANGE}
/>
`),"src/demo-schemas.ts":f},Component:p,meta:{}};export{m as default};