import"./index-client.BHKBF-tO.js";import{i as e,nn as t,tn as n}from"./client.DYWvmWCR.js";import{r}from"./form.CbgrcR1Z.js";import{a as i,i as a}from"./demo.CcnckxZH.js";function o(a,o){t(o,!0);let{defaults:s}=i(),c={type:`object`,properties:{array:{type:`array`,items:{type:`number`}}},additionalProperties:{type:`string`}},l={array:{"ui:options":{copyable:!0}}},u={array:[1,2,3],foo:`bar`,baz:`quz`};r(a,e(()=>s,{get schema(){return c},get uiSchema(){return l},get initialValue(){return u}})),n()}var s={files:{"src/routes/+page.svelte":a(`<script lang="ts">
  import { type Schema, SimpleForm, type UiSchemaRoot } from "@sjsf/form";
  import type { FromSchema } from "json-schema-to-ts";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const schema = {
    type: "object",
    properties: {
      array: {
        type: "array",
        items: {
          type: "number",
        },
      },
    },
    additionalProperties: {
      type: "string",
    },
  } as const satisfies Schema;

  const uiSchema: UiSchemaRoot = {
    array: {
      "ui:options": {
        copyable: true,
      },
    },
  };

  type Model = FromSchema<typeof schema>;

  const initialValue: Model = {
    array: [1, 2, 3],
    foo: "bar",
    baz: "quz",
  };
<\/script>

<SimpleForm {...defaults} {schema} {uiSchema} {initialValue} />
`)},Component:o,meta:{}};export{s as default};