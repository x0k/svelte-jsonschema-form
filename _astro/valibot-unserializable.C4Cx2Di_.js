import{r as e}from"./rolldown-runtime.DAXXjFlN.js";import{a as t,i as n,n as r,r as i}from"./model.UVZZgLR2.js";import{n as a,t as o}from"./unknown-date-field.CSs7MRjk.js";var s=`<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import { adapt } from "@sjsf/valibot-validator";
  import * as v from "valibot";

  import * as defaults from "$lib/sjsf/defaults";
  import unknownBigIntField from "$lib/unknown-big-int-field.svelte";
  import unknownDateField from "$lib/unknown-date-field.svelte";

  const schema = v.pipe(
    v.object({
      birthday: v.date(),
      id: v.bigint(),
    }),
    v.metadata({ title: "Unserializable fields" })
  );

  const form = createForm({
    ...defaults,
    ...adapt(schema),
    uiSchema: {
      birthday: {
        "ui:components": {
          unknownField: unknownDateField,
        },
        "ui:options": {
          text: {
            type: "datetime-local",
          },
        },
      },
      id: {
        "ui:components": {
          unknownField: unknownBigIntField,
        },
      },
    },
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} novalidate />
`,c=e({default:()=>u,meta:()=>l}),l=t({category:r.LogicExtension,title:`Valibot Unserializable`,description:`Valibot schema with unrepresentable types (Date, BigInt) handled via custom fields.`,tags:[i.CustomComponent],isValidatorSpecific:!0}),u=n({validator:`valibot`,files:{"src/routes/+page.svelte":s,"src/lib/unknown-date-field.svelte":o,"src/lib/unknown-big-int-field.svelte":a}});export{c as n,l as t};