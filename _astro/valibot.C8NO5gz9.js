import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{Et as n,Mt as r,Nt as i,Pt as a,et as o,lt as s,nn as c,st as l,tn as u}from"./client.b8lPZIo2.js";import{Ut as d,Vt as f,Wt as p,X as m,i as h,u as g}from"./form.D7agbGVP.js";import{a as _,c as v,d as y,f as b,i as x,l as S,o as C,r as w,s as T,t as E,u as D}from"./dist.BxguNThX.js";import{i as O,n as k,t as A}from"./demo-schema.Db_Bjw93.js";var j=s(`<!> <pre> </pre>`,1);function M(t,s){c(s,!0);let{defaults:A}=e(),M=T({id:v(D(b(),y(RegExp(`^\\d+$`),`Must be a number`),C(8))),active:v(x()),skills:v(D(w(D(b(),C(5))),C(4))),multipleChoicesList:v(D(w(S([`foo`,`bar`,`fuzz`])),_(2)))}),N=g({...A,...E(M),uiSchema:O,fieldsValidationMode:p|d|f,initialValue:k});var P=j(),F=r(P);h(F,{get form(){return N},novalidate:!0});var I=a(F,2),L=i(I,!0);n(e=>o(L,e),[()=>JSON.stringify(m(N),null,2)]),l(t,P),u()}var N={files:{"src/routes/+page.svelte":t(`<script lang="ts">
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
`),"src/demo-schema.ts":A},Component:M,meta:{validator:{name:`valibot`,draft2020:!1,precompiled:!1}}};export{N as default};