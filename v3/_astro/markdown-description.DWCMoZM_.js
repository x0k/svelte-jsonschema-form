import{o as e}from"./advanced-examples.SneE-GE3.js";import"./_commonjsHelpers.DeY__IKx.js";import"./render.BvCbmumc.js";import"./definitions.C_vWxCYR.js";import"./snippet.B_3_pwki.js";import"./shared.DLMCUdlS.js";import"./preload-helper.1-HTDuIo.js";import"./buttons.DZ7xREMG.js";/* empty css                                                       *//* empty css                                                                 */const t=`<script lang="ts">
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
`,s="markdown-description",o="0.0.1",i="module",r={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},c={"@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.28.0","@sveltejs/vite-plugin-svelte":"^6.1.2",svelte:"^5.38.1","svelte-check":"^4.3.1",typescript:"^5.9.2",vite:"^7.1.2"},p={"@sjsf/ajv8-validator":"^3.0.0-next.1","@sjsf/basic-theme":"^3.0.0-next.1","@sjsf/form":"^3.0.0-next.1",ajv:"^8.17.1","svelte-exmarkdown":"^5.0.2"},m={name:s,private:!0,version:o,type:i,scripts:r,devDependencies:c,dependencies:p},y={package:e(m),files:{"src/routes/description.svelte":t,"src/routes/+page.svelte":n}};export{y as layer};
