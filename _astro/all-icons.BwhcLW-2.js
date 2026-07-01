import"./index-client.Dq5s0D8S.js";import{$t as e,Qt as t,i as n}from"./client.B0k3dZbu.js";import{r}from"./form.DBP89p2-.js";import{a as i,i as a}from"./demo.CJm6_pxQ.js";function o(a,o){e(o,!0);let{defaults:s}=i(),c={type:`object`,properties:{array:{type:`array`,items:{type:`number`}}},additionalProperties:{type:`string`}},l={array:{"ui:options":{copyable:!0}}},u={array:[1,2,3],foo:`bar`,baz:`quz`};r(a,n(()=>s,{get schema(){return c},get uiSchema(){return l},get initialValue(){return u}})),t()}var s={files:{"src/routes/+page.svelte":a(`<script lang="ts">
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