import"./index-client.DAEmVQx2.js";import{$t as e,Qt as t,i as n}from"./client.B0k3dZbu.js";import{r}from"./form.B8CJIVHV.js";import{a as i,i as a}from"./demo.BFc_HmCR.js";function o(a,o){e(o,!0);let{defaults:s}=i(),c={type:`object`,properties:{isCompany:{type:`boolean`,title:`Registering as a company`}},required:[`isCompany`],if:{properties:{isCompany:{const:!0}},required:[`isCompany`]},then:{properties:{companyName:{type:`string`,title:`Company name`}},required:[`companyName`]},else:{properties:{fullName:{type:`string`,title:`Full name`}},required:[`fullName`]}};r(a,n(()=>s,{get schema(){return c}})),t()}var s={files:{"src/routes/+page.svelte":a(`<script lang="ts">
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