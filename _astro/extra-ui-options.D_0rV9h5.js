import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{nn as n,tn as r}from"./client.b8lPZIo2.js";import{c as i,dt as a,ft as o,kt as s,lt as c,u as l}from"./form.D7agbGVP.js";function u(t,u){n(u,!0);let{defaults:d}=e(),f=l({...d,schema:{type:`object`,properties:{foo:{type:`string`},bar:{type:`number`}}},extraUiOptions:c(o({labelAttributes:{style:`color: red`}}),a({help:e=>`${e.title} help`}))});s(f),i(t,{}),r()}var d={files:{"src/routes/+page.svelte":t(`<script lang="ts">
  import { Content, createForm, setFormContext, type Config } from "@sjsf/form";
  import { chain, fromFactories, fromRecord } from "@sjsf/form/lib/resolver";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const form = createForm({
    ...defaults,
    schema: {
      type: "object",
      properties: {
        foo: {
          type: "string",
        },
        bar: {
          type: "number",
        },
      },
    },
    extraUiOptions: chain(
      fromRecord({
        labelAttributes: {
          style: "color: red",
        },
      }),
      fromFactories({
        help: (config: Config) => \`\${config.title} help\`,
      })
    ),
  });
  setFormContext(form);
<\/script>

<Content />
`)},Component:u,meta:{}};export{d as default};