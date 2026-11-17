<script lang="ts">
  import {
    getFormContext,
    getId,
    isDisabled,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/form/fields/extra-widgets/date-input";
  import { replaceDatePart } from "@sjsf/form/fields/date-time";
  import { DatePicker as SvarDatePicker } from "@svar-ui/svelte-core";

  let {
    value = $bindable(),
    config,
    errors,
    handlers,
  }: Omit<ComponentProps["dateInputWidget"], "inputType"> = $props();

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));

  function onchange() {
    handlers.oninput?.();
    handlers.onchange?.();
  }
</script>

<SvarDatePicker
  bind:value={
    () =>
      value !== undefined
        ? new Date(value.getFullYear(), value.getMonth(), value.getDate())
        : null,
    (v) => (value = replaceDatePart(value, v ?? undefined))
  }
  {...uiOptionProps("svarDateInput")(
    {
      id,
      disabled: isDisabled(ctx),
      error: errors.length > 0,
      onchange,
      editable: true,
    },
    config,
    ctx
  )}
/>
