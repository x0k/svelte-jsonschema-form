import{o as e}from"./rolldown-runtime.DAXXjFlN.js";import"./index-client.Dq5s0D8S.js";import{$t as t,At as n,J as r,Qt as i,an as a,at as o,et as s,jt as c,kt as l,st as u,wt as d}from"./client.B0k3dZbu.js";import{Ut as f,et as p,i as m,u as h}from"./form.DBP89p2-.js";import{M as g,r as _,u as v}from"./dist.x30cdV40.js";import{a as y,i as b}from"./demo.CJm6_pxQ.js";var x=e(v()),S=u(`<p>The form accepts a sequence of digits (checked synchronously) with the number
  of digits from 3 to 6 (checked asynchronously, with a 70% chance of successful
  verification)</p> <p> </p> <!>`,1);function C(e,u){t(u,!0);let{defaults:v}=y(),b=g(new x.default);b.addKeyword({keyword:`asyncLength`,async:!0,type:`string`,validate:async(e,t)=>{if(await new Promise(e=>setTimeout(e,600)),Math.random()>.7)throw Error(`async error`);return t.length>=e.minimum&&t.length<=e.maximum}});let C={$async:!0,type:`string`,pattern:`^\\d+$`,asyncLength:{minimum:3,maximum:6}},w=h({...v,validator:e=>_({...e,ajv:b}),schema:C,fieldsValidationMode:f,onSubmit:console.log});r(()=>{w.submission.abort(),w.fieldsValidation.abort()});var T=S(),E=c(n(T),2),D=l(E);a(E),m(c(E,2),{get form(){return w},novalidate:!0,autocomplete:`off`}),d(e=>s(D,`form validation: ${w.submission.status??``}, fields validation: ${w.fieldsValidation.status??``}, errors: ${e??``}`),[()=>p(w)]),o(e,T),i()}var w={files:{"src/routes/+page.svelte":b(`<script lang="ts">
  import {
    addFormComponents,
    createAsyncFormValidator,
  } from "@sjsf/ajv8-validator";
  import { ON_INPUT, BasicForm, createForm, hasErrors } from "@sjsf/form";
  import Ajv, { type AsyncSchema, type SchemaValidateFunction } from "ajv";
  import { onDestroy } from "svelte";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const ajv = addFormComponents(new Ajv());
  const validate: SchemaValidateFunction = async (schema, data) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (Math.random() > 0.7) {
      throw new Error("async error");
    }
    return data.length >= schema.minimum && data.length <= schema.maximum;
  };
  ajv.addKeyword({
    keyword: "asyncLength",
    async: true,
    type: "string",
    validate,
  });

  const schema: AsyncSchema = {
    $async: true,
    type: "string",
    pattern: "^\\\\d+$",
    asyncLength: {
      minimum: 3,
      maximum: 6,
    },
  };

  const form = createForm({
    ...defaults,
    validator: (options) => createAsyncFormValidator({ ...options, ajv }),
    schema,
    fieldsValidationMode: ON_INPUT,
    onSubmit: console.log,
  });
  onDestroy(() => {
    form.submission.abort();
    form.fieldsValidation.abort();
  });
<\/script>

<p>
  The form accepts a sequence of digits (checked synchronously) with the number
  of digits from 3 to 6 (checked asynchronously, with a 70% chance of successful
  verification)
</p>
<p>
  form validation: {form.submission.status}, fields validation: {form
    .fieldsValidation.status}, errors: {hasErrors(form)}
</p>
<BasicForm {form} novalidate autocomplete="off" />
`)},Component:C,meta:{}};export{w as default};