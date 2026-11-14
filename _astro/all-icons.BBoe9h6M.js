import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{i as n,nn as r,tn as i}from"./client.b8lPZIo2.js";import{r as a}from"./form.D7agbGVP.js";function o(t,o){r(o,!0);let{defaults:s}=e(),c={type:`object`,properties:{array:{type:`array`,items:{type:`number`}}},additionalProperties:{type:`string`}},l={array:{"ui:options":{copyable:!0}}},u={array:[1,2,3],foo:`bar`,baz:`quz`};a(t,n(()=>s,{get schema(){return c},get uiSchema(){return l},get initialValue(){return u}})),i()}var s={files:{"src/routes/+page.svelte":t(`<script lang="ts">
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