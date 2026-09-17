import"./index-client.BHKBF-tO.js";import{i as e,nn as t,tn as n}from"./client.DYWvmWCR.js";import{r}from"./form.CbgrcR1Z.js";import{a as i,i as a}from"./demo.CcnckxZH.js";function o(a,o){t(o,!0);let{defaults:s}=i(),c={type:`object`,properties:{common:{type:`string`}},oneOf:[{title:`Foo schema`,properties:{foo:{type:`string`}}},{title:`Bar schema`,properties:{bar:{type:`string`}}}]},l={common:`hello`,bar:`world`};r(a,e(()=>s,{get schema(){return c},get initialValue(){return l}})),n()}var s={files:{"src/routes/+page.svelte":a(`<script lang="ts">
  import { SimpleForm, type Schema } from "@sjsf/form";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const schema = {
    type: "object",
    properties: {
      common: {
        type: "string",
      },
    },
    oneOf: [
      {
        title: "Foo schema",
        properties: {
          foo: {
            type: "string",
          },
        },
      },
      {
        title: "Bar schema",
        properties: {
          bar: {
            type: "string",
          },
        },
      },
    ],
  } as const satisfies Schema;

  const initialValue = {
    common: "hello",
    bar: "world",
  };
<\/script>

<SimpleForm {...defaults} {schema} {initialValue} />
`)},Component:o,meta:{}};export{s as default};