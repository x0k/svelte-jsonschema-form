import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{Dt as n,nn as r,tn as i,xt as a}from"./client.b8lPZIo2.js";import{H as o,K as s,i as c,tt as l,u,zt as d}from"./form.D7agbGVP.js";function f(t,f){r(f,!0);let{defaults:p}=e(),m={title:`Live validation`,properties:{foo:{type:`string`,minLength:10},bar:{type:`number`,minimum:1e3}}},h=u({...p,initialValue:{foo:`initial`,bar:1},schema:m,onSubmit:console.log});n(()=>{let{errors:e=[]}=s(h);l(h,a(()=>e.filter(e=>o(h,e.path,d))))}),c(t,{get form(){return h}}),i()}var p={files:{"src/routes/+page.svelte":t(`<script lang="ts">
  import {
    createForm,
    BasicForm,
    hasFieldStateByPath,
    type Schema,
    FIELD_INTERACTED,
    updateErrors,
    validate,
  } from "@sjsf/form";
  import { untrack } from "svelte";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const schema: Schema = {
    title: "Live validation",
    properties: {
      foo: {
        type: "string",
        minLength: 10,
      },
      bar: {
        type: "number",
        minimum: 1000,
      },
    },
  };

  const form = createForm({
    ...defaults,
    initialValue: {
      foo: "initial",
      bar: 1,
    },
    schema,
    onSubmit: console.log,
  });

  $effect(() => {
    // NOTE: \`validate()\` reads the state snapshot,
    // causing \`$effect\` to subscribe to all changes.
    const { errors = [] } = validate(form);
    updateErrors(
      form,
      untrack(() =>
        errors.filter((e) =>
          hasFieldStateByPath(form, e.path, FIELD_INTERACTED)
        )
      )
    );
  });
<\/script>

<BasicForm {form} />
`)},Component:f,meta:{}};export{p as default};