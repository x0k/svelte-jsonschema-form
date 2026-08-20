import{r as e}from"./rolldown-runtime.C0FnF6B9.js";import{a as t,i as n,n as r}from"./model.DA5oU76I.js";var i=`<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import { adapt } from "@sjsf/zod4-validator/classic";
  import * as z from "zod";

  import * as defaults from "$lib/sjsf/defaults";

  const schema = z
    .object({
      hello: z.string().meta({ title: "Hello" }),
    })
    .meta({ title: "Basic form" });

  const form = createForm({
    ...defaults,
    ...adapt(schema),
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} novalidate />
`,a=e({default:()=>s,meta:()=>o}),o=t({category:r.Starters,title:`Zod Starter`,description:`Zod validator integration starter.`,tags:[],isValidatorSpecific:!0}),s=n({validator:`zod4`,files:{"src/routes/+page.svelte":i}});export{a as n,o as t};