import{o as e}from"./rolldown-runtime.BCiCTKAo.js";import{a as t,i as n}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{Et as r,J as i,Mt as a,Nt as o,Pt as s,et as c,lt as l,nn as u,st as d,tn as f}from"./client.b8lPZIo2.js";import{M as p,r as m,u as h}from"./dist.DrLvOzsY.js";import{Wt as g,et as _,i as v,u as y}from"./form.D7agbGVP.js";var b=e(h()),x=l(`<p>The form accepts a sequence of digits (checked synchronously) with the number
  of digits from 3 to 6 (checked asynchronously, with a 70% chance of successful
  verification)</p> <p> </p> <!>`,1);function S(e,n){u(n,!0);let{defaults:l}=t(),h=p(new b.default);h.addKeyword({keyword:`asyncLength`,async:!0,type:`string`,validate:async(e,t)=>{if(await new Promise(e=>setTimeout(e,600)),Math.random()>.7)throw Error(`async error`);return t.length>=e.minimum&&t.length<=e.maximum}});let S={$async:!0,type:`string`,pattern:`^\\d+$`,asyncLength:{minimum:3,maximum:6}},C=y({...l,validator:e=>m({...e,ajv:h}),schema:S,fieldsValidationMode:g,onSubmit:console.log});i(()=>{C.submission.abort(),C.fieldsValidation.abort()});var w=x(),T=s(a(w),2),E=o(T),D=s(T,2);v(D,{get form(){return C},novalidate:!0,autocomplete:`off`}),r(e=>c(E,`form validation: ${C.submission.status??``}, fields validation: ${C.fieldsValidation.status??``}, errors: ${e??``}`),[()=>_(C)]),d(e,w),f()}var C={files:{"src/routes/+page.svelte":n(`<script lang="ts">
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
`)},Component:S,meta:{}};export{C as default};