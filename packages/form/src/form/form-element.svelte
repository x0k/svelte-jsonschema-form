<script lang="ts" module>
  import type { Snippet } from "svelte";

  import type { FormElement, FormElementProps } from "./theme.js";
  import type { Config } from "./config.js";

  declare module "./theme.js" {
    interface Components {
      form: {
        config: Config;
        ref?: FormElement | undefined;
        children: Snippet;
        attributes?: FormElementProps | undefined;
      };
    }

    interface ComponentBindings {
      form: "ref";
    }
  }

  declare module "./ui-schema.js" {
    interface UiOptions {
      form?: FormElementProps;
    }
  }
</script>

<script lang="ts">
  import { getComponent, getFormContext } from "./context/index.js";

  let {
    ref = $bindable(),
    children,
    ...rest
  }: {
    ref?: FormElement | undefined;
    children: Snippet;
  } & Omit<FormElementProps, "ref" | "children"> = $props();

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

  const attributes = $derived({
    ...ctx.uiOptions.form,
    ...rest,
  });
</script>

<Form bind:ref {config} {children} {attributes} />
