import"./index-client.BHKBF-tO.js";import{Et as e,Mt as t,Nt as n,Pt as r,et as i,lt as a,nn as o,st as s,tn as c}from"./client.DYWvmWCR.js";import{Bt as l,Ht as u,Ut as d,X as f,i as p,u as m}from"./form.CbgrcR1Z.js";import{a as h,i as g}from"./demo.CcnckxZH.js";import{a as _,c as v,d as y,f as b,i as x,l as S,o as C,r as w,s as T,t as E,u as D}from"./dist.tPw-C8rm.js";import{i as O,n as k,t as A}from"./demo-schema.Db_Bjw93.js";var j=a(`<!> <pre> </pre>`,1);function M(a,g){o(g,!0);let{defaults:A}=h(),M=T({id:v(D(b(),y(RegExp(`^\\d+$`),`Must be a number`),C(8))),active:v(x()),skills:v(D(w(D(b(),C(5))),C(4))),multipleChoicesList:v(D(w(S([`foo`,`bar`,`fuzz`])),_(2)))}),N=m({...A,...E(M),uiSchema:O,fieldsValidationMode:d|u|l,initialValue:k});var P=j(),F=t(P);p(F,{get form(){return N},novalidate:!0});var I=r(F,2),L=n(I,!0);e(e=>i(L,e),[()=>JSON.stringify(f(N),null,2)]),s(a,P),c()}var N={files:{"src/routes/+page.svelte":g(`<script lang="ts">
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