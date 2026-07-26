import{r as e}from"./rolldown-runtime.DAXXjFlN.js";import{Y as t}from"./shadcn.XUsiemR3.js";import{a as n,i as r,n as i,r as a}from"./model.UVZZgLR2.js";var o=`<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import { convert } from "@sjsf/form/converters/draft-2020-12";
  import type { JSONSchema } from "json-schema-typed/draft-2020-12";

  import * as defaults from "$lib/sjsf/defaults";

  const schema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    type: "array",
    prefixItems: [
      { title: "foo", type: "string", default: "carp" },
      { title: "bar", type: "string", minLength: 3 },
    ],
    items: { title: "Additional", type: "number" },
  } as const satisfies JSONSchema;

  const form = createForm({
    ...defaults,
    // WARN: Some validation functionality is lost during schema conversion.
    // Keep this in mind on the client side and use the original schema for server-side validation.
    schema: convert(schema),
    // Example using \`Ajv2020\`:
    // validator: <T,>(options: ValidatorFactoryOptions) => {
    //   const validator = defaults.validator<T>({
    //     ...options,
    //     Ajv: Ajv2020,
    //   });
    //   // TODO: Pass the original schema parts to the \`isValid\` method.
    //   return {
    //     ...validator,
    //     validateFormValue(_, formValue) {
    //       return validator.validateFormValue(schema, formValue);
    //     },
    //   };
    // },
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} />
`,s=e({default:()=>l,meta:()=>c}),c=n({category:i.LogicExtension,title:`Draft 2020-12`,description:`JSON Schema draft 2020-12 features including $ref.`,tags:[a.Schema]}),l=r({dependencies:[t(`jsonSchemaTyped`)],files:{"src/routes/+page.svelte":o}});export{c as n,s as t};