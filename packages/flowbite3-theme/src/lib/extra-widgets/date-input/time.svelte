<script lang="ts">
  import {
    getFormContext,
    getId,
    isDisabled,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/form/fields/extra-widgets/date-input";
  import {
    formatLocalInputTime,
    parseLocalTime,
    replaceTimePart,
  } from "@sjsf/form/fields/date-time";
  import Timepicker from "flowbite-svelte/Timepicker.svelte";

  let {
    value = $bindable(),
    config,
    handlers,
    paired = false,
  }: Omit<ComponentProps["dateInputWidget"], "inputType"> & {
    paired?: boolean;
  } = $props();

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));

  const inputId = $derived(paired ? `${id}-time` : id);

  // `Timepicker` forces its value to "00:00" when the text it receives is
  // empty or invalid. Keep the picker's text in a writable derived and commit
  // only on select, so an empty field is not dirtied on mount while external
  // value changes still sync into the picker.
  let time = $derived(formatLocalInputTime(value)?.slice(0, 5) ?? "");

  function onselect({ time: selected }: { time: string }) {
    const parsed = parseLocalTime(selected);
    if (parsed !== undefined) {
      value = replaceTimePart(value, parsed);
    }
    handlers.oninput?.();
    handlers.onchange?.();
  }
</script>

<Timepicker
  {...uiOptionProps("flowbite3TimeInput")(
    {
      id: inputId,
      disabled: isDisabled(ctx),
      required: config.required,
      onselect,
    },
    config,
    ctx
  )}
  bind:value={time}
/>
