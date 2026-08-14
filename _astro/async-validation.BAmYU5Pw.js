import{o as e}from"./rolldown-runtime.C0FnF6B9.js";import"./index-client.CkrqgRIv.js";import{Dt as t,Et as n,J as r,Tt as i,Xt as a,Yt as o,et as s,it as c,nn as l,nt as u,xt as d}from"./client.BXzhBlXN.js";import{Ut as f,et as p,i as m,u as h}from"./form.D74qHMvd.js";import{i as g,t as _}from"./dist.DS7hSI2l.js";import{c as v}from"./internals.Dq8fsHGK.js";import{n as y,t as b}from"./demo.6LNVQqAK.js";var x=e(v()),S=c(`<p>The form accepts a sequence of digits (checked synchronously) with the number
  of digits from 3 to 6 (checked asynchronously, with a 70% chance of successful
  verification)</p> <p> </p> <!>`,1);function C(e,c){a(c,!0);let{defaults:v}=y(),b=g(new x.default);b.addKeyword({keyword:`asyncLength`,async:!0,type:`string`,validate:async(e,t)=>{if(await new Promise(e=>setTimeout(e,600)),Math.random()>.7)throw Error(`async error`);return t.length>=e.minimum&&t.length<=e.maximum}});let C={$async:!0,type:`string`,pattern:`^\\d+$`,asyncLength:{minimum:3,maximum:6}},w=h({...v,validator:e=>_({...e,ajv:b}),schema:C,fieldsValidationMode:f,onSubmit:console.log});r(()=>{w.submission.abort(),w.fieldsValidation.abort()});var T=S(),E=t(n(T),2),D=i(E);l(E);var O=t(E,2);m(O,{get form(){return w},novalidate:!0,autocomplete:`off`}),d(e=>s(D,`form validation: ${w.submission.status??``}, fields validation: ${w.fieldsValidation.status??``}, errors: ${e??``}`),[()=>p(w)]),u(e,T),o()}var w={files:{"src/routes/+page.svelte":b(`<script lang="ts">
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