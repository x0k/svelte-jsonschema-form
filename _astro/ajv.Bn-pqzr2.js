import"./index-client.CkrqgRIv.js";import{Dt as e,Et as t,Tt as n,Xt as r,Yt as i,et as a,it as o,nn as s,nt as c,xt as l}from"./client.BXzhBlXN.js";import{Bt as u,Ht as d,Ut as f,X as p,i as m,u as h}from"./form.D74qHMvd.js";import{n as g}from"./dist.DS7hSI2l.js";import{n as _,t as v}from"./demo.6LNVQqAK.js";import{i as y,n as b,r as x,t as S}from"./demo-schema.Db_Bjw93.js";var C=o(`<!> <pre> </pre>`,1);function w(o,v){r(v,!0);let{defaults:S}=_(),w=h({...S,schema:x,uiSchema:y,validator:g,fieldsValidationMode:f|d|u,initialValue:b});var T=C(),E=t(T);m(E,{get form(){return w},novalidate:!0});var D=e(E,2),O=n(D,!0);s(D),l(e=>a(O,e),[()=>JSON.stringify(p(w),null,2)]),c(o,T),i()}var T={files:{"src/routes/+page.svelte":v(`<script lang="ts">
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