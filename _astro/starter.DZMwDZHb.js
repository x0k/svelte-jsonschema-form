import{r as e}from"./rolldown-runtime.DAXXjFlN.js";import{a as t,i as n,n as r}from"./model.UVZZgLR2.js";var i=`<script lang="ts">
  import { createForm, BasicForm, type Schema } from "@sjsf/form";

  import * as defaults from "$lib/sjsf/defaults";

  const schema = {
    type: "object",
    title: "Basic form",
    properties: {
      hello: {
        title: "Hello",
        type: "string",
      },
    },
    required: ["hello"],
  } as const satisfies Schema;

  const form = createForm({
    ...defaults,
    schema,
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} />
`,a=e({default:()=>s,meta:()=>o}),o=t({category:r.Starters,title:`Basic Starter`,description:`Basic JSON Schema form setup with Svelte.`,tags:[]}),s=n({files:{"src/routes/+page.svelte":i}});export{a as n,o as t};