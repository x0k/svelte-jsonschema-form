import{r as e}from"./rolldown-runtime.C0FnF6B9.js";import{a as t,i as n,n as r,r as i}from"./model.DA5oU76I.js";var a=`<script lang="ts" module>
  declare module "@sjsf/form" {
    interface Schema {
      deprecated?: boolean;
    }
  }
<\/script>

<script lang="ts">
  import { createForm, BasicForm, type Schema, type Config } from "@sjsf/form";
  import { fromFactories } from "@sjsf/form/lib/resolver";
  import type { HTMLAttributes } from "svelte/elements";

  import * as defaults from "$lib/sjsf/defaults";

  const schema = {
    type: "object",
    title: "Basic form",
    properties: {
      foo: {
        type: "string",
      },
      bar: {
        type: "string",
        deprecated: true,
      },
    },
    required: ["hello"],
  } as const satisfies Schema;

  const form = createForm({
    ...defaults,
    schema,
    extraUiOptions: fromFactories({
      layouts: (config: Config) => ({
        "object-property": config.schema.deprecated
          ? ({
              style:
                "padding: 0.5rem; border: solid 1px orange; border-radius: 5px;",
            } satisfies HTMLAttributes<HTMLDivElement>)
          : undefined,
      }),
      action: (config: Config) =>
        config.schema.deprecated ? deprecated : undefined,
    }),
    onSubmit: console.log,
  });
<\/script>

{#snippet deprecated()}
  <span>(deprecated)</span>
{/snippet}

<BasicForm {form} />
`,o=e({default:()=>c,meta:()=>s}),s=t({category:r.LogicExtension,title:`Deprecated Keyword`,description:`Adding support for new JSON Schema keywords like 'deprecated'.`,tags:[i.Schema]}),c=n({files:{"src/routes/+page.svelte":a}});export{s as n,o as t};