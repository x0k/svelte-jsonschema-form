<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";
  import "@sjsf/form/fields/extra-widgets/date-picker";

  declare module "@sjsf/form" {
    interface UiOptions {
      datePicker?: HTMLInputAttributes;
    }
  }
</script>

<script lang="ts">
  import { DateInput } from "@astryx-svelte/core";
  import {
    getFormContext,
    inputAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    value = $bindable(),
    handlers,
    config,
  }: ComponentProps["datePickerWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes(ctx, config, "datePicker", handlers, {})
  );

  const isoValue = $derived(
    value && /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? (value as `${number}${number}${number}${number}-${number}${number}-${number}${number}`)
      : undefined
  );
</script>

<DateInput
  label={attributes["aria-label"] ?? "Date"}
  value={isoValue}
  onChange={(v) => (value = v ?? "")}
  isRequired={attributes.required === true}
  isDisabled={attributes.disabled === true}
/>
