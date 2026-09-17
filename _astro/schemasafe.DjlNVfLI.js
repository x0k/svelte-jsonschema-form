import"./index-client.BHKBF-tO.js";import{Et as e,Mt as t,Nt as n,Pt as r,et as i,lt as a,nn as o,st as s,tn as c}from"./client.DYWvmWCR.js";import{Bt as l,Ht as u,Ut as d,X as f,i as p,u as m}from"./form.CbgrcR1Z.js";import{a as h,i as g}from"./demo.CcnckxZH.js";import{i as _,n as v,r as y,t as b}from"./demo-schema.Db_Bjw93.js";import{t as x}from"./dist.DSaR6E0K.js";var S=a(`<!> <pre> </pre>`,1);function C(a,g){o(g,!0);let{defaults:b}=h(),C=m({...b,schema:y,uiSchema:_,validator:x,fieldsValidationMode:d|u|l,initialValue:v});var w=S(),T=t(w);p(T,{get form(){return C},novalidate:!0});var E=r(T,2),D=n(E,!0);e(e=>i(D,e),[()=>JSON.stringify(f(C),null,2)]),s(a,w),c()}var w={files:{"src/routes/+page.svelte":g(`<script lang="ts">
  import {
    ON_INPUT,
    BasicForm,
    createForm,
    ON_CHANGE,
    ON_ARRAY_CHANGE,
    getValueSnapshot,
  } from "@sjsf/form";
  import { createFormValidator } from "@sjsf/schemasafe-validator";

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
`),"src/demo-schema.ts":b},Component:C,meta:{validator:{name:`schemasafe`,draft2020:!1,precompiled:!1}}};export{w as default};