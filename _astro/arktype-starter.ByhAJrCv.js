import{r as e}from"./rolldown-runtime.C0FnF6B9.js";import{Y as t}from"./shadcn.CpuVl1dq.js";import{a as n,i as r,n as i}from"./model.DA5oU76I.js";var a=`<script lang="ts">
  import { createForm, BasicForm } from "@sjsf/form";
  import { adapt } from "@sjsf/form/validators/standard-schema";
  import { type } from "arktype";

  import * as defaults from "$lib/sjsf/defaults";

  const schema = type({
    hello: "string",
  });

  const form = createForm({
    ...defaults,
    ...adapt(schema),
    uiSchema: {
      "ui:options": {
        title: "Basic form",
      },
      hello: {
        "ui:options": {
          title: "Hello",
        },
      },
    },
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} novalidate />
`,o=e({default:()=>c,meta:()=>s}),s=n({category:i.Starters,title:`Arktype Starter`,description:`Arktype with standard-schema validator starter.`,tags:[],isValidatorSpecific:!0}),c=r({validator:`noop`,dependencies:[t(`arktype`)],files:{"src/routes/+page.svelte":a}});export{s as n,o as t};