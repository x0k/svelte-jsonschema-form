<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLFormAttributes } from "svelte/elements";

  import { getPseudoPath, getComponent, getFormContext } from "./state/index.js";
  import { FORM_ROOT_PATH, FORM_SCHEMA, FORM_UI_SCHEMA } from "./internals.js";
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
    path: getPseudoPath(ctx, ctx[FORM_ROOT_PATH], 'form'),
    title: "",
    schema: ctx[FORM_SCHEMA],
    uiSchema: ctx[FORM_UI_SCHEMA],
    required: false,
  });

  const Form = $derived(getComponent(ctx, "form", config));
</script>

<Form bind:ref {config} {children} {attributes} />
