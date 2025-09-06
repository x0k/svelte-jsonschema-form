<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLFormAttributes } from "svelte/elements";

  import { getComponent, getFormContext } from "./context/index.js";
  import type { Config } from "./config.js";

  let {
    ref = $bindable(),
    children,
    attributes,
  }: {
    ref?: HTMLFormElement | undefined;
    attributes?: HTMLFormAttributes | undefined;
    children: Snippet;
  } = $props();

  const ctx = getFormContext();

  const config: Config = $derived({
    id: ctx.rootId,
    name: "form",
    title: "",
    schema: ctx.schema,
    uiSchema: ctx.uiSchema,
    required: false,
  });

  const Form = $derived(getComponent(ctx, "form", config));
</script>

<Form bind:ref {config} {children} {attributes} />
