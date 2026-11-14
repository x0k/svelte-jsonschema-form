import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{i as n,nn as r,tn as i}from"./client.b8lPZIo2.js";import{r as a}from"./form.D7agbGVP.js";function o(t,o){r(o,!0);let{defaults:s}=e(),c={type:`object`,properties:{isCompany:{type:`boolean`,title:`Registering as a company`}},required:[`isCompany`],if:{properties:{isCompany:{const:!0}},required:[`isCompany`]},then:{properties:{companyName:{type:`string`,title:`Company name`}},required:[`companyName`]},else:{properties:{fullName:{type:`string`,title:`Full name`}},required:[`fullName`]}};a(t,n(()=>s,{get schema(){return c}})),i()}var s={files:{"src/routes/+page.svelte":t(`<script lang="ts">
  import { SimpleForm, type Schema } from "@sjsf/form";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const schema = {
    type: "object",
    properties: {
      isCompany: {
        type: "boolean",
        title: "Registering as a company",
      },
    },
    required: ["isCompany"],
    if: {
      properties: {
        isCompany: { const: true },
      },
      required: ["isCompany"],
    },
    then: {
      properties: {
        companyName: {
          type: "string",
          title: "Company name",
        },
      },
      required: ["companyName"],
    },
    else: {
      properties: {
        fullName: {
          type: "string",
          title: "Full name",
        },
      },
      required: ["fullName"],
    },
  } as const satisfies Schema;
<\/script>

<SimpleForm {...defaults} {schema} />
`)},Component:o,meta:{}};export{s as default};