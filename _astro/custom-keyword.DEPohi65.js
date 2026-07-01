import"./index-client.Dq5s0D8S.js";import{$t as e,Qt as t}from"./client.B0k3dZbu.js";import{Ht as n,i as r,u as i}from"./form.DBP89p2-.js";import{M as a,i as o}from"./dist.x30cdV40.js";import{a as s,i as c}from"./demo.CJm6_pxQ.js";import{n as l}from"./file-size.ByEHVLE9.js";function u(c,u){e(u,!0);let{defaults:d}=s();function f(e){return e.addKeyword({keyword:`maxSizeBytes`,validate(e,t){if(t===void 0)return!0;if(!(t instanceof File))throw Error(`Expected "File", but got "${typeof t}"`);return t.size<=e},error:{message:e=>`Max file size ${l(e.schema)}`}}),e}let p=i({...d,validator:e=>o({...e,ajvPlugins:e=>f(a(e))}),schema:{title:`File`,maxSizeBytes:1024*4},uiSchema:{"ui:components":{unknownField:`unknownNativeFileField`}},fieldsValidationMode:n});r(c,{get form(){return p}}),t()}var d={files:{"src/routes/+page.svelte":c(`<script lang="ts" module>
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