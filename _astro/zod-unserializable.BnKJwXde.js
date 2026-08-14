import{r as e}from"./rolldown-runtime.C0FnF6B9.js";import{a as t,i as n,n as r,r as i}from"./model.BHx2IYJR.js";import{n as a,t as o}from"./unknown-date-field.CSs7MRjk.js";var s=`<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import { adapt } from "@sjsf/zod4-validator/classic";
  import * as z from "zod";

  import * as defaults from "$lib/sjsf/defaults";
  import unknownBigIntField from "$lib/unknown-big-int-field.svelte";
  import unknownDateField from "$lib/unknown-date-field.svelte";

  const schema = z
    .object({
      birthday: z.date().meta({ title: "Birthday" }),
      id: z.bigint().meta({ title: "ID" }),
    })
    .meta({ title: "Unserializable fields" });

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
`,c=e({default:()=>u,meta:()=>l}),l=t({category:r.LogicExtension,title:`Zod Unserializable`,description:`Zod schema with unrepresentable types (Date, BigInt) handled via custom fields.`,tags:[i.CustomComponent],isValidatorSpecific:!0}),u=n({validator:`zod4`,files:{"src/routes/+page.svelte":s,"src/lib/unknown-date-field.svelte":o,"src/lib/unknown-big-int-field.svelte":a}});export{c as n,l as t};