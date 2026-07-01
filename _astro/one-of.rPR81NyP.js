import"./index-client.Dq5s0D8S.js";import{$t as e,Qt as t,i as n}from"./client.B0k3dZbu.js";import{r}from"./form.DBP89p2-.js";import{a as i,i as a}from"./demo.CJm6_pxQ.js";function o(a,o){e(o,!0);let{defaults:s}=i(),c={type:`object`,properties:{common:{type:`string`}},oneOf:[{title:`Foo schema`,properties:{foo:{type:`string`}}},{title:`Bar schema`,properties:{bar:{type:`string`}}}]},l={common:`hello`,bar:`world`};r(a,n(()=>s,{get schema(){return c},get initialValue(){return l}})),t()}var s={files:{"src/routes/+page.svelte":a(`<script lang="ts">
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