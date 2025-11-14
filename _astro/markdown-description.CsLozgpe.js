import{o as e}from"./advanced-examples.P4hRE83j.js";import"./each.UjORxt2m.js";import"./render.Dg0Wuizp.js";import"./definitions.DX10FSdJ.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.hsextPQ_.js";import"./shared.CpatY0-o.js";import"./preload-helper.BUFao3bW.js";import"./buttons.Dlf5YUyQ.js";/* empty css                                                       *//* empty css                                                                 */const t=`<script lang="ts">
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
`,s="markdown-description",o="0.0.2",r="module",i={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},c={"@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.42.0","@sveltejs/vite-plugin-svelte":"^6.1.2",svelte:"^5.30.0","svelte-check":"^4.3.1",typescript:"^5.9.2",vite:"^7.1.2"},p={"@sjsf/ajv8-validator":"workspace:*","@sjsf/basic-theme":"workspace:*","@sjsf/form":"workspace:*",ajv:"^8.17.1","svelte-exmarkdown":"^5.0.2"},m={name:s,private:!0,version:o,type:r,scripts:i,devDependencies:c,dependencies:p},y={package:e(m),files:{"src/routes/description.svelte":t,"src/routes/+page.svelte":n}};export{y as layer};
