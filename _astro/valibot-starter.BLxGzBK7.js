import{r as e}from"./rolldown-runtime.C0FnF6B9.js";import{a as t,i as n,n as r}from"./model.DA5oU76I.js";var i=`<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import { adapt } from "@sjsf/valibot-validator";
  import * as v from "valibot";

  import * as defaults from "$lib/sjsf/defaults";

  const schema = v.pipe(
    v.object({
      hello: v.string(),
    }),
    v.metadata({
      title: "Basic form",
    })
  );

  const form = createForm({
    ...defaults,
    ...adapt(schema),
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} novalidate />
`,a=e({default:()=>s,meta:()=>o}),o=t({category:r.Starters,title:`Valibot Starter`,description:`Valibot validator integration starter.`,tags:[],isValidatorSpecific:!0}),s=n({validator:`valibot`,files:{"src/routes/+page.svelte":i}});export{a as n,o as t};