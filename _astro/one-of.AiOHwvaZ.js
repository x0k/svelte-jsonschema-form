import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{i as n,nn as r,tn as i}from"./client.b8lPZIo2.js";import{r as a}from"./form.D7agbGVP.js";function o(t,o){r(o,!0);let{defaults:s}=e(),c={type:`object`,properties:{common:{type:`string`}},oneOf:[{title:`Foo schema`,properties:{foo:{type:`string`}}},{title:`Bar schema`,properties:{bar:{type:`string`}}}]},l={common:`hello`,bar:`world`};a(t,n(()=>s,{get schema(){return c},get initialValue(){return l}})),i()}var s={files:{"src/routes/+page.svelte":t(`<script lang="ts">
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