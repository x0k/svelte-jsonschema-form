import"./index-client.BHKBF-tO.js";import{i as e,nn as t,tn as n}from"./client.DYWvmWCR.js";import{r}from"./form.CbgrcR1Z.js";import{a as i,i as a}from"./demo.CcnckxZH.js";function o(a,o){t(o,!0);let{defaults:s}=i(),c={type:`object`,properties:{foo:{type:`string`,description:"If you enter anything here then `bar` will become required"},bar:{type:`string`,description:"If you enter anything here then `baz` will appear"}},dependencies:{foo:[`bar`],bar:{properties:{baz:{enum:[`string`,`number`,`boolean`],description:`If you select anything here, the corresponding field will appear`}}},baz:{oneOf:[{properties:{baz:{const:`string`},string:{type:`string`}}},{properties:{baz:{const:`number`},number:{type:`number`}}},{properties:{baz:{const:`boolean`},boolean:{type:`boolean`}}}]}}},l={baz:{"ui:components":{stringField:`enumField`}}};r(a,e(()=>s,{get schema(){return c},get uiSchema(){return l}})),n()}var s={files:{"src/routes/+page.svelte":a(`<script lang="ts">
  import { SimpleForm, type Schema, type UiSchema } from "@sjsf/form";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const schema = {
    type: "object",
    properties: {
      foo: {
        type: "string",
        description:
          "If you enter anything here then \`bar\` will become required",
      },
      bar: {
        type: "string",
        description: "If you enter anything here then \`baz\` will appear",
      },
    },
    dependencies: {
      foo: ["bar"],
      bar: {
        properties: {
          baz: {
            enum: ["string", "number", "boolean"],
            description:
              "If you select anything here, the corresponding field will appear",
          },
        },
      },
      baz: {
        oneOf: [
          {
            properties: {
              baz: {
                const: "string",
              },
              string: {
                type: "string",
              },
            },
          },
          {
            properties: {
              baz: {
                const: "number",
              },
              number: {
                type: "number",
              },
            },
          },
          {
            properties: {
              baz: {
                const: "boolean",
              },
              boolean: {
                type: "boolean",
              },
            },
          },
        ],
      },
    },
  } as const satisfies Schema;

  const uiSchema: UiSchema = {
    baz: {
      "ui:components": {
        stringField: "enumField",
      },
    },
  };
<\/script>

<SimpleForm {...defaults} {schema} {uiSchema} />
`)},Component:o,meta:{fields:[`enum`]}};export{s as default};