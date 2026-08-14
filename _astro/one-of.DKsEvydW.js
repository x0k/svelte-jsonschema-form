import"./index-client.CkrqgRIv.js";import{Xt as e,Yt as t,i as n}from"./client.BXzhBlXN.js";import{r}from"./form.D74qHMvd.js";import{n as i,t as a}from"./demo.6LNVQqAK.js";function o(a,o){e(o,!0);let{defaults:s}=i(),c={type:`object`,properties:{common:{type:`string`}},oneOf:[{title:`Foo schema`,properties:{foo:{type:`string`}}},{title:`Bar schema`,properties:{bar:{type:`string`}}}]},l={common:`hello`,bar:`world`};r(a,n(()=>s,{get schema(){return c},get initialValue(){return l}})),t()}var s={files:{"src/routes/+page.svelte":a(`<script lang="ts">
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