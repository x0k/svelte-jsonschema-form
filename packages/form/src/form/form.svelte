<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLFormAttributes } from "svelte/elements";

  import { FORM_ROOT_ID, FORM_SCHEMA, FORM_UI_SCHEMA } from "./internals.js";
  import { getComponent, getFormContext } from "./state/index.js";
  import type { Config } from "./config.js";
  import { createPseudoId } from "./id.js";

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
    id: createPseudoId(ctx[FORM_ROOT_ID], "form"),
    title: "",
    schema: ctx[FORM_SCHEMA],
    uiSchema: ctx[FORM_UI_SCHEMA],
    required: false,
  });

  const Form = $derived(getComponent(ctx, "form", config));
</script>

<Form bind:ref {config} {children} {attributes} />
