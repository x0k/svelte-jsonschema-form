import"./index-client.DAEmVQx2.js";import{$t as e,At as t,Qt as n,an as r,at as i,et as a,jt as o,kt as s,st as c,wt as l}from"./client.B0k3dZbu.js";import{Bt as u,Ht as d,Ut as f,X as p,i as m,u as h}from"./form.B8CJIVHV.js";import{i as g}from"./dist.BCg_GFK4.js";import{a as _,i as v}from"./demo.BFc_HmCR.js";import{i as y,n as b,r as x,t as S}from"./demo-schema.Db_Bjw93.js";var C=c(`<!> <pre> </pre>`,1);function w(c,v){e(v,!0);let{defaults:S}=_(),w=h({...S,schema:x,uiSchema:y,validator:g,fieldsValidationMode:f|d|u,initialValue:b});var T=C(),E=t(T);m(E,{get form(){return w},novalidate:!0});var D=o(E,2),O=s(D,!0);r(D),l(e=>a(O,e),[()=>JSON.stringify(p(w),null,2)]),i(c,T),n()}var T={files:{"src/routes/+page.svelte":v(`<script lang="ts">
  import { createFormValidator } from "@sjsf/ajv8-validator";
  import {
    ON_INPUT,
    BasicForm,
    createForm,
    ON_CHANGE,
    ON_ARRAY_CHANGE,
    getValueSnapshot,
  } from "@sjsf/form";

  import { getDemoContext } from "@/lib/demo";

  import { initialValue, schema, uiSchema } from "../demo-schema";

  const { defaults } = getDemoContext();

  const form = createForm({
    ...defaults,
    schema,
    uiSchema,
    validator: createFormValidator,
    fieldsValidationMode: ON_INPUT | ON_CHANGE | ON_ARRAY_CHANGE,
    initialValue,
  });
<\/script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
`),"src/demo-schema.ts":S},Component:w,meta:{}};export{T as default};