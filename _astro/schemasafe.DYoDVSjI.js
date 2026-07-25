import"./index-client.Pqo5EW-P.js";import{Dt as e,Et as t,Tt as n,Xt as r,Yt as i,et as a,it as o,nn as s,nt as c,xt as l}from"./client.Cb7crF4c.js";import{Bt as u,Ht as d,Ut as f,X as p,i as m,u as h}from"./form.B5NxhwOh.js";import{n as g,t as _}from"./demo.Cnu-2gYI.js";import{i as v,n as y,r as b,t as x}from"./demo-schema.Db_Bjw93.js";import{t as S}from"./dist.CVo0G3T5.js";var C=o(`<!> <pre> </pre>`,1);function w(o,_){r(_,!0);let{defaults:x}=g(),w=h({...x,schema:b,uiSchema:v,validator:S,fieldsValidationMode:f|d|u,initialValue:y});var T=C(),E=t(T);m(E,{get form(){return w},novalidate:!0});var D=e(E,2),O=n(D,!0);s(D),l(e=>a(O,e),[()=>JSON.stringify(p(w),null,2)]),c(o,T),i()}var T={files:{"src/routes/+page.svelte":_(`<script lang="ts">
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
`),"src/demo-schema.ts":x},Component:w,meta:{validator:{name:`schemasafe`,draft2020:!1,precompiled:!1}}};export{T as default};