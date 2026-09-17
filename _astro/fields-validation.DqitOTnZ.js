import"./index-client.BHKBF-tO.js";import{Gt as e,i as t,nn as n,tn as r,yt as i}from"./client.DYWvmWCR.js";import{Ht as a,Ut as o,r as s}from"./form.CbgrcR1Z.js";import{a as c,i as l}from"./demo.CcnckxZH.js";import{n as u,r as d,t as f}from"./demo-schemas.DlwAgzCm.js";function p(l,f){n(f,!0);let{defaults:p}=c();{let n=e(()=>o|a);s(l,t(()=>p,{get schema(){return u},get uiSchema(){return d},get fieldsValidationMode(){return i(n)}}))}r()}var m={files:{"src/routes/+page.svelte":l(`<script lang="ts">
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