import"./index-client.DAEmVQx2.js";import{$t as e,At as t,Qt as n,an as r,at as i,et as a,jt as o,kt as s,st as c,wt as l}from"./client.B0k3dZbu.js";import{Bt as u,Ht as d,Ut as f,X as p,i as m,u as h}from"./form.B8CJIVHV.js";import{a as g,i as _}from"./demo.yFJ0eT_4.js";import{i as v,n as y,t as b}from"./demo-schema.Db_Bjw93.js";import{a as x,c as S,d as C,f as w,i as T,l as E,o as D,r as O,s as k,t as A,u as j}from"./dist.DM8GZc3w.js";var M=c(`<!> <pre> </pre>`,1);function N(c,_){e(_,!0);let{defaults:b}=g(),N=k({id:S(j(w(),C(RegExp(`^\\d+$`),`Must be a number`),D(8))),active:S(T()),skills:S(j(O(j(w(),D(5))),D(4))),multipleChoicesList:S(j(O(E([`foo`,`bar`,`fuzz`])),x(2)))}),P=h({...b,...A(N),uiSchema:v,fieldsValidationMode:f|d|u,initialValue:y});var F=M(),I=t(F);m(I,{get form(){return P},novalidate:!0});var L=o(I,2),R=s(L,!0);r(L),l(e=>a(R,e),[()=>JSON.stringify(p(P),null,2)]),i(c,F),n()}var P={files:{"src/routes/+page.svelte":_(`<script lang="ts">
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
`),"src/demo-schema.ts":b},Component:N,meta:{validator:{name:`valibot`,draft2020:!1,precompiled:!1}}};export{P as default};