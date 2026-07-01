import"./index-client.DAEmVQx2.js";import{$t as e,Qt as t}from"./client.B0k3dZbu.js";import{i as n,u as r}from"./form.B8CJIVHV.js";import{a as i,i as a}from"./demo.BFc_HmCR.js";import{n as o,t as s}from"./file-size.BiJjRjGd.js";function c(a,c){e(c,!0);let{defaults:l}=i(),u=r({...l,validator:e=>({...l.validator(e),...s(({file:e,maxSizeBytes:t})=>`File ${e.name} is too large, max file size ${o(t)}`,e)}),schema:{type:`string`,title:`File`,format:`data-url`},uiSchema:{"ui:components":{stringField:`fileField`},"ui:options":{maxFileSizeBytes:1024*4}}});n(a,{get form(){return u}}),t()}var l={files:{"src/routes/+page.svelte":a(`<script>
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