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
</script>

<script lang="ts">
  import { getComponent, getFormContext } from "./context/index.js";

  let {
    ref = $bindable(),
    children,
    attributes,
  }: {
    ref?: FormElement | undefined;
    attributes?: FormElementProps | undefined;
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
