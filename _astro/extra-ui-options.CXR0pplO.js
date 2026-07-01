import"./index-client.DAEmVQx2.js";import{$t as e,Qt as t}from"./client.B0k3dZbu.js";import{Ot as n,c as r,dt as i,ft as a,lt as o,u as s}from"./form.B8CJIVHV.js";import{a as c,i as l}from"./demo.yFJ0eT_4.js";function u(l,u){e(u,!0);let{defaults:d}=c();n(s({...d,schema:{type:`object`,properties:{foo:{type:`string`},bar:{type:`number`}}},extraUiOptions:o(a({labelAttributes:{style:`color: red`}}),i({help:e=>`${e.title} help`}))})),r(l,{}),t()}var d={files:{"src/routes/+page.svelte":l(`<script lang="ts">
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