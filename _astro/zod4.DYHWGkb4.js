import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{Et as n,Mt as r,Nt as i,Pt as a,et as o,lt as s,nn as c,st as l,tn as u}from"./client.b8lPZIo2.js";import{Ut as d,Vt as f,Wt as p,X as m,i as h,u as g}from"./form.D7agbGVP.js";import{a as _,c as v,i as y,l as b,o as x,r as S,s as C,t as w}from"./classic.BShdYLxi.js";import{i as T,n as E,t as D}from"./demo-schema.Db_Bjw93.js";var O=s(`<!> <pre> </pre>`,1);function k(t,s){c(s,!0);let{defaults:D}=e();b(v());let k=x({id:C().regex(RegExp(`^\\d+$`),`Must be a number`).min(8).optional(),active:_(),skills:y(C().min(5)).min(4).optional(),multipleChoicesList:y(S([`foo`,`bar`,`fuzz`])).max(2).optional()}),A=g({...D,...w(k),uiSchema:T,fieldsValidationMode:p|d|f,initialValue:E});var j=O(),M=r(j);h(M,{get form(){return A},novalidate:!0});var N=a(M,2),P=i(N,!0);n(e=>o(P,e),[()=>JSON.stringify(m(A),null,2)]),l(t,j),u()}var A={files:{"src/routes/+page.svelte":t(`<script lang="ts">
  import {
    BasicForm,
    createForm,
    getValueSnapshot,
    ON_ARRAY_CHANGE,
    ON_CHANGE,
    ON_INPUT,
  } from "@sjsf/form";
  import { adapt } from "@sjsf/zod4-validator/classic";
  import { z } from "zod";
  import { en } from "zod/locales";

  import { getDemoContext } from "@/lib/demo";

  import { initialValue, uiSchema } from "../demo-schema";

  const { defaults } = getDemoContext();

  z.config(en());

  const schema = z.object({
    id: z
      .string()
      .regex(new RegExp("^\\\\d+$"), "Must be a number")
      .min(8)
      .optional(),
    active: z.boolean(),
    skills: z.array(z.string().min(5)).min(4).optional(),
    multipleChoicesList: z
      .array(z.enum(["foo", "bar", "fuzz"]))
      .max(2)
      .optional(),
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
`),"src/demo-schema.ts":D},Component:k,meta:{validator:{name:`zod4`,draft2020:!1,precompiled:!1}}};export{A as default};