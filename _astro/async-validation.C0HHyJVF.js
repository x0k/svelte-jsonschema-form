import{o as e}from"./rolldown-runtime.C0FnF6B9.js";import"./index-client.BHKBF-tO.js";import{Et as t,J as n,Mt as r,Nt as i,Pt as a,et as o,lt as s,nn as c,st as l,tn as u}from"./client.DYWvmWCR.js";import{Ut as d,et as f,i as p,u as m}from"./form.CbgrcR1Z.js";import{a as h,i as g}from"./demo.CcnckxZH.js";import{M as _,r as v,u as y}from"./dist.BrYZutIa.js";var b=e(y()),x=s(`<p>The form accepts a sequence of digits (checked synchronously) with the number
  of digits from 3 to 6 (checked asynchronously, with a 70% chance of successful
  verification)</p> <p> </p> <!>`,1);function S(e,s){c(s,!0);let{defaults:g}=h(),y=_(new b.default);y.addKeyword({keyword:`asyncLength`,async:!0,type:`string`,validate:async(e,t)=>{if(await new Promise(e=>setTimeout(e,600)),Math.random()>.7)throw Error(`async error`);return t.length>=e.minimum&&t.length<=e.maximum}});let S={$async:!0,type:`string`,pattern:`^\\d+$`,asyncLength:{minimum:3,maximum:6}},C=m({...g,validator:e=>v({...e,ajv:y}),schema:S,fieldsValidationMode:d,onSubmit:console.log});n(()=>{C.submission.abort(),C.fieldsValidation.abort()});var w=x(),T=a(r(w),2),E=i(T),D=a(T,2);p(D,{get form(){return C},novalidate:!0,autocomplete:`off`}),t(e=>o(E,`form validation: ${C.submission.status??``}, fields validation: ${C.fieldsValidation.status??``}, errors: ${e??``}`),[()=>f(C)]),l(e,w),u()}var C={files:{"src/routes/+page.svelte":g(`<script lang="ts">
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