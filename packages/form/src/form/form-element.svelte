<script lang="ts">
  import type { HTMLFormAttributes } from "svelte/elements";
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
  import type { FormInternals } from "./create-form.svelte.js";

  let {
    ref = $bindable(),
    internals,
    children,
    ...rest
  }: HTMLFormAttributes & {
    ref?: HTMLFormElement | undefined;
    internals: FormInternals;
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

  const attributes: HTMLFormAttributes = $derived({
    // @deprecated
    // TODO: after `attach` release, use it here
    onsubmit: internals.submitHandler,
    onreset: internals.resetHandler,
    ...uiOptions?.form,
    ...rest,
  });
</script>

<Form bind:ref {children} {config} errors={NO_ERRORS} {attributes} />
