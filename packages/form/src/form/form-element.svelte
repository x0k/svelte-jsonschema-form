<script lang="ts">
  import type { Snippet } from "svelte";

  import {
    getComponent,
    getFormContext,
    getUiOptions,
  } from "./context/index.js";
  import type { Config } from "./config.js";
  import type { UiSchema } from "./ui-schema.js";
  import { FAKE_ID_SCHEMA } from "./id-schema.js";
  import { NO_ERRORS } from "./errors.js";
  import type { FormElement } from "./component.js";

  let {
    ref = $bindable(),
    children,
  }: {
    ref?: FormElement | undefined;
    children: Snippet;
  } = $props();

  const ctx = getFormContext();

  const uiSchema: UiSchema = $derived(ctx.uiSchema["ui:formElement"] ?? {});

  const uiOptions = $derived(getUiOptions(ctx, uiSchema));

  const config: Config = $derived({
    name: "form-element",
    title: "",
    idSchema: FAKE_ID_SCHEMA,
    schema: {},
    uiSchema,
    uiOptions,
    required: false,
  });

  const Form = $derived(getComponent(ctx, "form", config));
</script>

<Form bind:ref {children} {config} errors={NO_ERRORS} />
