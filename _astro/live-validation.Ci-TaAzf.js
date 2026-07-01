import"./index-client.DygggIMv.js";import{$t as e,Qt as t,Tt as n,yt as r}from"./client.B0k3dZbu.js";import{H as i,K as a,Rt as o,i as s,tt as c,u as l}from"./form._czxSeTP.js";import{a as u,i as d}from"./demo.BRvBoDhN.js";function f(d,f){e(f,!0);let{defaults:p}=u(),m={title:`Live validation`,properties:{foo:{type:`string`,minLength:10},bar:{type:`number`,minimum:1e3}}},h=l({...p,initialValue:{foo:`initial`,bar:1},schema:m,onSubmit:console.log});n(()=>{let{errors:e=[]}=a(h);c(h,r(()=>e.filter(e=>i(h,e.path,o))))}),s(d,{get form(){return h}}),t()}var p={files:{"src/routes/+page.svelte":d(`<script lang="ts">
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