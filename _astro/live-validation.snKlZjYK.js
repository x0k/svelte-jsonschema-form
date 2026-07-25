import"./index-client.Pqo5EW-P.js";import{St as e,Xt as t,Yt as n,gt as r}from"./client.Cb7crF4c.js";import{H as i,K as a,Rt as o,i as s,tt as c,u as l}from"./form.B5NxhwOh.js";import{n as u,t as d}from"./demo.Cnu-2gYI.js";function f(d,f){t(f,!0);let{defaults:p}=u(),m={title:`Live validation`,properties:{foo:{type:`string`,minLength:10},bar:{type:`number`,minimum:1e3}}},h=l({...p,initialValue:{foo:`initial`,bar:1},schema:m,onSubmit:console.log});e(()=>{let{errors:e=[]}=a(h);c(h,r(()=>e.filter(e=>i(h,e.path,o))))}),s(d,{get form(){return h}}),n()}var p={files:{"src/routes/+page.svelte":d(`<script lang="ts">
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