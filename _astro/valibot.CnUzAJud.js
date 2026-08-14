import"./index-client.CkrqgRIv.js";import{Dt as e,Et as t,Tt as n,Xt as r,Yt as i,et as a,it as o,nn as s,nt as c,xt as l}from"./client.BXzhBlXN.js";import{Bt as u,Ht as d,Ut as f,X as p,i as m,u as h}from"./form.D74qHMvd.js";import{a as g,c as _,d as v,f as y,i as b,l as x,o as S,r as C,s as w,t as T,u as E}from"./dist.B_bWfXJj.js";import{n as D,t as O}from"./demo.6LNVQqAK.js";import{i as k,n as A,t as j}from"./demo-schema.Db_Bjw93.js";var M=o(`<!> <pre> </pre>`,1);function N(o,O){r(O,!0);let{defaults:j}=D(),N=w({id:_(E(y(),v(RegExp(`^\\d+$`),`Must be a number`),S(8))),active:_(b()),skills:_(E(C(E(y(),S(5))),S(4))),multipleChoicesList:_(E(C(x([`foo`,`bar`,`fuzz`])),g(2)))}),P=h({...j,...T(N),uiSchema:k,fieldsValidationMode:f|d|u,initialValue:A});var F=M(),I=t(F);m(I,{get form(){return P},novalidate:!0});var L=e(I,2),R=n(L,!0);s(L),l(e=>a(R,e),[()=>JSON.stringify(p(P),null,2)]),c(o,F),i()}var P={files:{"src/routes/+page.svelte":O(`<script lang="ts">
  import {
    BasicForm,
    createForm,
    getValueSnapshot,
    ON_ARRAY_CHANGE,
    ON_CHANGE,
    ON_INPUT,
  } from "@sjsf/form";
  import { adapt } from "@sjsf/valibot-validator";
  import * as v from "valibot";

  import { getDemoContext } from "@/lib/demo";

  import { initialValue, uiSchema } from "../demo-schema";

  const { defaults } = getDemoContext();

  const schema = v.object({
    id: v.optional(
      v.pipe(
        v.string(),
        v.regex(new RegExp("^\\\\d+$"), "Must be a number"),
        v.minLength(8)
      )
    ),
    active: v.optional(v.boolean()),
    skills: v.optional(
      v.pipe(v.array(v.pipe(v.string(), v.minLength(5))), v.minLength(4))
    ),
    multipleChoicesList: v.optional(
      v.pipe(v.array(v.picklist(["foo", "bar", "fuzz"])), v.maxLength(2))
    ),
  });

  const form = createForm({
    ...defaults,
    ...adapt(schema),
    uiSchema,
    fieldsValidationMode: ON_INPUT | ON_CHANGE | ON_ARRAY_CHANGE,
    initialValue,
  });
<\/script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
`),"src/demo-schema.ts":j},Component:N,meta:{validator:{name:`valibot`,draft2020:!1,precompiled:!1}}};export{P as default};