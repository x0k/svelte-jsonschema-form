import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{nn as n,tn as r}from"./client.b8lPZIo2.js";import{i,u as a}from"./form.D7agbGVP.js";import{n as o,t as s}from"./file-size.CyhUZBRx.js";function c(t,c){n(c,!0);let{defaults:l}=e(),u=a({...l,validator:e=>({...l.validator(e),...s(({file:e,maxSizeBytes:t})=>`File ${e.name} is too large, max file size ${o(t)}`,e)}),schema:{type:`string`,title:`File`,format:`data-url`},uiSchema:{"ui:components":{stringField:`fileField`},"ui:options":{maxFileSizeBytes:4096}}});i(t,{get form(){return u}}),r()}var l={files:{"src/routes/+page.svelte":t(`<script>
  import { BasicForm, createForm } from "@sjsf/form";
  import {
    createFileSizeValidator,
    formatFileSize,
  } from "@sjsf/form/validators/file-size";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const form = createForm({
    ...defaults,
    validator: (options) => ({
      ...defaults.validator(options),
      ...createFileSizeValidator(
        ({ file, maxSizeBytes }) =>
          \`File \${file.name} is too large, max file size \${formatFileSize(maxSizeBytes)}\`,
        options
      ),
    }),
    schema: {
      type: "string",
      title: "File",
      format: "data-url",
    },
    uiSchema: {
      "ui:components": {
        stringField: "fileField",
      },
      "ui:options": {
        maxFileSizeBytes: 1024 * 4,
      },
    },
  });
<\/script>

<BasicForm {form} />
`)},Component:c,meta:{fields:[`file`],widgets:[`file`]}};export{l as default};