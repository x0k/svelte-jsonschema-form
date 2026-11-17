<script lang="ts">
  import {
    getFormContext,
    getId,
    isDisabled,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/form/fields/extra-widgets/date-input";
  import { replaceTimePart } from "@sjsf/form/fields/date-time";
  import { TimePicker as SvarTimePicker } from "@svar-ui/svelte-core";

  let {
    value = $bindable(),
    config,
    errors,
    handlers,
    paired = false,
  }: Omit<ComponentProps["dateInputWidget"], "inputType"> & {
    paired?: boolean;
  } = $props();

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));

  function onchange() {
    handlers.oninput?.();
    handlers.onchange?.();
  }
</script>

<SvarTimePicker
  bind:value={
    () => value ?? null, (v) => (value = replaceTimePart(value, v ?? undefined))
  }
  {...uiOptionProps("svarTimeInput")(
    {
      id: paired ? `${id}-time` : id,
      title: paired ? config.title : undefined,
      disabled: isDisabled(ctx),
      error: errors.length > 0,
      onchange,
    },
    config,
    ctx
  )}
/>
