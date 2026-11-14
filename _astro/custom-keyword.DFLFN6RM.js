import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{nn as n,tn as r}from"./client.b8lPZIo2.js";import{M as i,i as a}from"./dist.DrLvOzsY.js";import{Ut as o,i as s,u as c}from"./form.D7agbGVP.js";import{n as l}from"./file-size.CyhUZBRx.js";function u(t,u){n(u,!0);let{defaults:d}=e();function f(e){return e.addKeyword({keyword:`maxSizeBytes`,validate(e,t){if(t===void 0)return!0;if(!(t instanceof File))throw Error(`Expected "File", but got "${typeof t}"`);return t.size<=e},error:{message:e=>`Max file size ${l(e.schema)}`}}),e}let p=c({...d,validator:e=>a({...e,ajvPlugins:e=>f(i(e))}),schema:{title:`File`,maxSizeBytes:4096},uiSchema:{"ui:components":{unknownField:`unknownNativeFileField`}},fieldsValidationMode:o});s(t,{get form(){return p}}),r()}var d={files:{"src/routes/+page.svelte":t(`<script lang="ts" module>
  declare module "@sjsf/form" {
    interface Schema {
      maxSizeBytes?: number;
    }
  }
<\/script>

<script lang="ts">
  import { addFormComponents, createFormValidator } from "@sjsf/ajv8-validator";
  import { BasicForm, createForm, ON_CHANGE } from "@sjsf/form";
  import { formatFileSize } from "@sjsf/form/validators/file-size";
  import { type Ajv } from "ajv";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  function addKeywords(ajv: Ajv): Ajv {
    ajv.addKeyword({
      keyword: "maxSizeBytes",
      validate(max: number, data: unknown) {
        if (data === undefined) {
          return true;
        }
        if (!(data instanceof File)) {
          throw new Error(\`Expected "File", but got "\${typeof data}"\`);
        }
        return data.size <= max;
      },
      error: {
        message: (ctx) => \`Max file size \${formatFileSize(ctx.schema)}\`,
      },
    });
    return ajv;
  }

  const form = createForm({
    ...defaults,
    validator: (options) =>
      createFormValidator({
        ...options,
        ajvPlugins: (ajv) => addKeywords(addFormComponents(ajv)),
      }),
    schema: {
      title: "File",
      maxSizeBytes: 1024 * 4,
    },
    uiSchema: {
      "ui:components": {
        unknownField: "unknownNativeFileField",
      },
    },
    fieldsValidationMode: ON_CHANGE,
  });
<\/script>

<BasicForm {form} />
`)},Component:u,meta:{fields:[`unknown-native-file`],widgets:[`file`]}};export{d as default};