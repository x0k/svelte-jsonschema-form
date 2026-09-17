import"./index-client.BHKBF-tO.js";import{Et as e,Mt as t,Nt as n,Pt as r,et as i,lt as a,nn as o,st as s,tn as c}from"./client.DYWvmWCR.js";import{Bt as l,Ht as u,Ut as d,X as f,i as p,u as m}from"./form.CbgrcR1Z.js";import{a as h,i as g}from"./demo.CcnckxZH.js";import{a as _,c as v,i as y,l as b,o as x,r as S,s as C,t as w}from"./classic.CYBfkNER.js";import{i as T,n as E,t as D}from"./demo-schema.Db_Bjw93.js";var O=a(`<!> <pre> </pre>`,1);function k(a,g){o(g,!0);let{defaults:D}=h();b(v());let k=x({id:C().regex(RegExp(`^\\d+$`),`Must be a number`).min(8).optional(),active:_(),skills:y(C().min(5)).min(4).optional(),multipleChoicesList:y(S([`foo`,`bar`,`fuzz`])).max(2).optional()}),A=m({...D,...w(k),uiSchema:T,fieldsValidationMode:d|u|l,initialValue:E});var j=O(),M=t(j);p(M,{get form(){return A},novalidate:!0});var N=r(M,2),P=n(N,!0);e(e=>i(P,e),[()=>JSON.stringify(f(A),null,2)]),s(a,j),c()}var A={files:{"src/routes/+page.svelte":g(`<script lang="ts">
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