<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLFormAttributes } from "svelte/elements";

  import { getComponent, getFormContext, idFromPath } from "./state/index.js";
  import { FORM_SCHEMA, FORM_UI_SCHEMA } from "./internals.js";
  import type { Config } from "./config.js";
  import { encodePseudoElement } from "./id.js";

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

  const path = [encodePseudoElement("form")];
  const config: Config = $derived({
    id: idFromPath(ctx, path),
    path,
    title: "",
    schema: ctx[FORM_SCHEMA],
    uiSchema: ctx[FORM_UI_SCHEMA],
    required: false,
  });

  const Form = $derived(getComponent(ctx, "form", config));
</script>

<Form bind:ref {config} {children} {attributes} />
