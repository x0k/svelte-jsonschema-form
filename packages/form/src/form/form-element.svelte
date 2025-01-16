<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLFormAttributes } from "svelte/elements";

  import {
    getComponent,
    getFormContext,
    getUiOptions,
  } from "./context/index.js";
  import type { Config } from "./config.js";
  import type { UiSchema } from "./ui-schema.js";
  import { FAKE_ID_SCHEMA } from "./id-schema.js";
  import { NO_ERRORS } from "./errors.js";
  import type { FormInternals } from './create-form.svelte.js';

  let {
    ref = $bindable(),
    form,
    children,
    ...rest
  }: HTMLFormAttributes & {
    ref?: HTMLFormElement | undefined
    form: FormInternals
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
    onsubmit: form.submitHandler,
    onreset: form.resetHandler,
    ...rest,
    ...uiOptions?.form,
  });
</script>

<Form bind:form={ref} {attributes} {children} {config} errors={NO_ERRORS} />
