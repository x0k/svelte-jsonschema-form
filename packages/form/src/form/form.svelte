<script lang="ts">
  import type { Snippet } from "svelte";

  import { getComponent, getFormContext } from "./context/index.js";
  import type { FormAttributes, FormElement } from "./theme.js";
  import type { Config } from './config.js';

  let {
    ref = $bindable(),
    children,
    attributes,
  }: {
    ref?: FormElement | undefined;
    attributes?: FormAttributes | undefined;
    children: Snippet;
  } = $props();

  const ctx = getFormContext();

  const config: Config = $derived({
    id: ctx.rootId,
    schema: ctx.schema,
    uiSchema: ctx.uiSchema,
    uiOptions: ctx.uiOptions,
    name: "form-element",
    title: "",
    required: false,
  });

  const Form = $derived(getComponent(ctx, "form", config));
</script>

<Form bind:ref {config} {children} {attributes} />
