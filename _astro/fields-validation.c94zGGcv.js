import"./index-client.CkrqgRIv.js";import{Rt as e,Xt as t,Yt as n,i as r,mt as i}from"./client.BXzhBlXN.js";import{Ht as a,Ut as o,r as s}from"./form.D74qHMvd.js";import{n as c,t as l}from"./demo.6LNVQqAK.js";import{n as u,r as d,t as f}from"./demo-schemas.DlwAgzCm.js";function p(l,f){t(f,!0);let{defaults:p}=c();{let t=e(()=>o|a);s(l,r(()=>p,{get schema(){return u},get uiSchema(){return d},get fieldsValidationMode(){return i(t)}}))}n()}var m={files:{"src/routes/+page.svelte":l(`<script lang="ts">
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