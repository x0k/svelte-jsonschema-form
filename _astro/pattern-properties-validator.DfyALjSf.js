import{r as e}from"./rolldown-runtime.C0FnF6B9.js";import{a as t,i as n,n as r,r as i}from"./model.BHx2IYJR.js";var a=`<script lang="ts">
  import {
    createForm,
    BasicForm,
    type Schema,
    type UiSchemaRoot,
  } from "@sjsf/form";
  import { createPatternPropertyKeyValidator } from "@sjsf/form/validators/properties";

  import * as defaults from "$lib/sjsf/defaults";

  const schema = {
    title: "Pattern properties",
    type: "object",
    additionalProperties: false,
    patternProperties: {
      "^[a-z][a-zA-Z0-9_]+$": {
        type: "string",
      },
    },
  } as const satisfies Schema;

  const uiSchema: UiSchemaRoot = {
    "ui:options": {
      translations: {
        "add-object-property": "Add pattern property",
        "additional-property": "patternProperty",
      },
      // NOTE: You can use \`additionalPropertyKey\` to ensure that each generated key is valid
      additionalPropertyKey: (key, attempt) =>
        attempt === 0 ? key : \`\${key}_\${attempt}\`,
    },
  };

  const form = createForm({
    ...defaults,
    validator: (options) => ({
      ...defaults.validator(options),
      ...createPatternPropertyKeyValidator(({ patternProperties }) => {
        const keys = Object.keys(patternProperties);
        return \`Must match "\${keys.length < 2 ? keys[0] : keys.join('" or "')}"\`;
      }),
    }),
    schema,
    uiSchema,
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} />
`,o=e({default:()=>c,meta:()=>s}),s=t({category:r.LogicExtension,title:`Pattern Properties Validator`,description:`Custom field component with validation logic for patternProperties.`,tags:[i.CustomComponent]}),c=n({files:{"src/routes/+page.svelte":a}});export{o as n,s as t};