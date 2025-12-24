<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-widgets/password-input";

  declare module "@sjsf/form" {
    interface UiOptions {
      passwordInput?: HTMLInputAttributes;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    inputAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    handlers,
    config,
    value = $bindable(),
  }: ComponentProps["passwordInputWidget"] = $props();

  const ctx = getFormContext();
</script>

<input
  bind:value
  {...inputAttributes(ctx, config, "colorPicker", handlers, {
    type: "password",
    class: "sjsf-password-input",
  })}
/>
