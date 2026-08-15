<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-widgets/switch";

  declare module "@sjsf/form" {
    interface UiOptions {
      switch?: HTMLInputAttributes;
    }
  }
</script>

<script lang="ts">
  import { Switch } from "@astryx-svelte/core";
  import {
    getFormContext,
    customInputAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    config,
    value = $bindable(),
    handlers,
  }: ComponentProps["switchWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(customInputAttributes(ctx, config, "switch", {}));
</script>

<Switch
  label={config.title ?? "Switch"}
  bind:value={() => value ?? false, (v) => (value = v)}
  isDisabled={attributes.disabled === true}
/>
