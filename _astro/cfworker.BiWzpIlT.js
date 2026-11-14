import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{Et as n,Mt as r,Nt as i,Pt as a,et as o,lt as s,nn as c,st as l,tn as u}from"./client.b8lPZIo2.js";import{t as d}from"./dist.U5qeWreV.js";import{Ut as f,Vt as p,Wt as m,X as h,i as g,u as _}from"./form.D7agbGVP.js";import{i as v,n as y,r as b,t as x}from"./demo-schema.Db_Bjw93.js";var S=s(`<!> <pre> </pre>`,1);function C(t,s){c(s,!0);let{defaults:x}=e(),C=_({...x,schema:b,uiSchema:v,validator:d,fieldsValidationMode:m|f|p,initialValue:y});var w=S(),T=r(w);g(T,{get form(){return C},novalidate:!0});var E=a(T,2),D=i(E,!0);n(e=>o(D,e),[()=>JSON.stringify(h(C),null,2)]),l(t,w),u()}var w={files:{"src/routes/+page.svelte":t(`<script lang="ts">
  import { createFormValidator } from "@sjsf/cfworker-validator";
  import {
    BasicForm,
    createForm,
    getValueSnapshot,
    ON_ARRAY_CHANGE,
    ON_CHANGE,
    ON_INPUT,
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
`),"src/demo-schema.ts":x},Component:C,meta:{validator:{name:`cfworker`,draft2020:!1,precompiled:!1}}};export{w as default};