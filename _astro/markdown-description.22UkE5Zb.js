import{p as n}from"./package.DSGE-J9T.js";import{p as t,M as o}from"./advanced-examples.DT8uLNFF.js";import"./each.BMwIza1_.js";import"./render.D5KaOs_C.js";import"./definitions.CSr_piYZ.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.oSD68OPL.js";import"./shared.B9lixVVw.js";import"./preload-helper.BUFao3bW.js";import"./buttons.D5CuMo9K.js";/* empty css                                                       *//* empty css                                                                 */const r=`<script lang="ts">
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
`,e=`<script lang="ts">
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
`,h={package:t(n,o),files:{"src/routes/description.svelte":r,"src/routes/+page.svelte":e}};export{h as layer};
