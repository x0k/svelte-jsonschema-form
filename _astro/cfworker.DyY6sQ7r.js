import"./index-client.CkrqgRIv.js";import{Dt as e,Et as t,Tt as n,Xt as r,Yt as i,et as a,it as o,nn as s,nt as c,xt as l}from"./client.BXzhBlXN.js";import{Bt as u,Ht as d,Ut as f,X as p,i as m,u as h}from"./form.D74qHMvd.js";import{n as g,t as _}from"./demo.6LNVQqAK.js";import{i as v,n as y,r as b,t as x}from"./demo-schema.Db_Bjw93.js";import{t as S}from"./dist.CrrS4_c2.js";var C=o(`<!> <pre> </pre>`,1);function w(o,_){r(_,!0);let{defaults:x}=g(),w=h({...x,schema:b,uiSchema:v,validator:S,fieldsValidationMode:f|d|u,initialValue:y});var T=C(),E=t(T);m(E,{get form(){return w},novalidate:!0});var D=e(E,2),O=n(D,!0);s(D),l(e=>a(O,e),[()=>JSON.stringify(p(w),null,2)]),c(o,T),i()}var T={files:{"src/routes/+page.svelte":_(`<script lang="ts">
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