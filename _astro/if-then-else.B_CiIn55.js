import"./index-client.BZPhTvVS.js";import{i as e,nn as t,tn as n}from"./client.qk2OQxZe.js";import{r}from"./form.C6QAnDj1.js";import{a as i,i as a}from"./demo.CRk8z6pC.js";function o(a,o){t(o,!0);let{defaults:s}=i(),c={type:`object`,properties:{isCompany:{type:`boolean`,title:`Registering as a company`}},required:[`isCompany`],if:{properties:{isCompany:{const:!0}},required:[`isCompany`]},then:{properties:{companyName:{type:`string`,title:`Company name`}},required:[`companyName`]},else:{properties:{fullName:{type:`string`,title:`Full name`}},required:[`fullName`]}};r(a,e(()=>s,{get schema(){return c}})),n()}var s={files:{"src/routes/+page.svelte":a(`<script lang="ts">
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