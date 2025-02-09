<script lang="ts" module>
  declare module "./theme.js" {
    interface Component {
      form: CommonComponentProps & {
        ref?: FormElement | undefined;
        children: Snippet;
        attributes?: FormElementProps | undefined;
      };
    }

    interface ComponentBindings {
      form: "ref";
    }
  }
</script>

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
  import type { FormElement, FormElementProps } from "./theme.js";

  let {
    ref = $bindable(),
    attributes,
    children,
  }: {
    ref?: FormElement | undefined;
    attributes?: FormElementProps | undefined;
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

<Form bind:ref {children} {config} errors={NO_ERRORS} {attributes} />
