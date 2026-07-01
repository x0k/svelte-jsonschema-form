import"./index-client.DygggIMv.js";import{$t as e,At as t,Qt as n,an as r,at as i,et as a,jt as o,kt as s,st as c,wt as l}from"./client.B0k3dZbu.js";import{Bt as u,Ht as d,Ut as f,X as p,i as m,u as h}from"./form._czxSeTP.js";import{a as g,i as _}from"./demo.BRvBoDhN.js";import{i as v,n as y,r as b,t as x}from"./demo-schema.Db_Bjw93.js";import{t as S}from"./dist.pqbtU2da.js";var C=c(`<!> <pre> </pre>`,1);function w(c,_){e(_,!0);let{defaults:x}=g(),w=h({...x,schema:b,uiSchema:v,validator:S,fieldsValidationMode:f|d|u,initialValue:y});var T=C(),E=t(T);m(E,{get form(){return w},novalidate:!0});var D=o(E,2),O=s(D,!0);r(D),l(e=>a(O,e),[()=>JSON.stringify(p(w),null,2)]),i(c,T),n()}var T={files:{"src/routes/+page.svelte":_(`<script lang="ts">
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
`),"src/demo-schema.ts":x},Component:w,meta:{validator:{name:`cfworker`,draft2020:!1,precompiled:!1}}};export{T as default};