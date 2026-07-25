import{r as e}from"./rolldown-runtime.DAXXjFlN.js";import{Y as t}from"./shadcn.XUsiemR3.js";import{a as n,i as r,n as i,r as a}from"./model.B98gGsUz.js";var o=`<script lang="ts">
  import { createForm, BasicForm, type Schema } from "@sjsf/form";
  import { overrideByRecord } from "@sjsf/form/lib/resolver";

  import * as defaults from "$lib/sjsf/defaults";

  import Description from "./description.svelte";

  const schema = {
    type: "null",
    title: "Title",
    description: "**bold** *italic* [link](#)",
  } as const satisfies Schema;

  const theme = overrideByRecord(defaults.theme, {
    description: Description,
  });

  const form = createForm({
    ...defaults,
    theme,
    schema,
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} />
`,s=`<script lang="ts">
  import {
    descriptionAttributes,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";
  import Markdown from "svelte-exmarkdown";

  const { config, description }: ComponentProps["description"] = $props();

  const ctx = getFormContext();
<\/script>

<Markdown md={description}>
  {#snippet p({ children })}
    <div {...descriptionAttributes(ctx, config, "descriptionAttributes", {})}>
      {@render children?.()}
    </div>
  {/snippet}
</Markdown>
`,c=e({default:()=>u,meta:()=>l}),l=n({category:i.UiExtension,title:`Markdown Description`,description:`Rich markdown descriptions using svelte-exmarkdown.`,tags:[a.CustomComponent]}),u=r({dependencies:[t(`svelteExmarkdown`)],files:{"src/routes/description.svelte":s,"src/routes/+page.svelte":o}});export{l as n,c as t};