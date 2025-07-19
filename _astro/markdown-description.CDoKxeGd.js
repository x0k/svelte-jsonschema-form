import{o as e}from"./advanced-examples.C3Qh84_v.js";import"./_commonjsHelpers.BzMcPD46.js";import"./render.ioaXADLG.js";import"./function.BfuHTiS3.js";import"./shared.CAJoasGh.js";import"./preload-helper.BUFao3bW.js";import"./buttons.CMoZ0Id3.js";/* empty css                                                       *//* empty css                                                                 */const t=`<script lang="ts">
  import Markdown from "svelte-exmarkdown";

  import {
    descriptionAttributes,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";

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
`,n=`<script lang="ts">
  import { overrideByRecord } from '@sjsf/form/lib/resolver';
  import { createForm, BasicForm, type Schema } from "@sjsf/form";

  import * as defaults from "$lib/form-defaults";

  import Description from './description.svelte';

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
`,s="markdown-description",o="0.0.1",i="module",r={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},c={"@sveltejs/adapter-auto":"^6.0.0","@sveltejs/kit":"^2.16.0","@sveltejs/vite-plugin-svelte":"^5.0.0",svelte:"^5.33.0","svelte-check":"^4.0.0",typescript:"^5.0.0",vite:"^6.2.6"},p={"@sjsf/ajv8-validator":"^2.0.0","@sjsf/basic-theme":"^2.0.0","@sjsf/form":"^2.0.0",ajv:"^8.17.1","svelte-exmarkdown":"^5.0.1"},m={name:s,private:!0,version:o,type:i,scripts:r,devDependencies:c,dependencies:p},j={package:e(m),files:{"src/routes/description.svelte":t,"src/routes/+page.svelte":n}};export{j as layer};
