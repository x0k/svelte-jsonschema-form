import"./index-client.Dq5s0D8S.js";import{$t as e,Ht as t,Qt as n,_t as r,i}from"./client.B0k3dZbu.js";import{Ht as a,Ut as o,r as s}from"./form.DBP89p2-.js";import{a as c,i as l}from"./demo.CJm6_pxQ.js";import{n as u,r as d,t as f}from"./demo-schemas.DlwAgzCm.js";function p(l,f){e(f,!0);let{defaults:p}=c();{let e=t(()=>o|a);s(l,i(()=>p,{get schema(){return u},get uiSchema(){return d},get fieldsValidationMode(){return r(e)}}))}n()}var m={files:{"src/routes/+page.svelte":l(`<script lang="ts">
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