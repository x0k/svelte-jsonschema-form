<script lang="ts" module>
  import { Calendar as StdfCalendar, Cell as StdfCell } from "stdf";
  import type { ComponentProps as SvelteComponentProps } from "svelte";
  import "@sjsf/form/fields/extra-widgets/date-picker";

  declare module "@sjsf/form" {
    interface UiOptions {
      stdfDatePicker?: SvelteComponentProps<typeof StdfCalendar>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["datePickerWidget"] = $props();

  const ctx = getFormContext();

  let visible = $state(false);

  const initSelectedDates = $derived(value ? [value.replaceAll("-", "")] : []);

  function onchange() {
    handlers.oninput?.();
    handlers.onchange?.();
  }

  function onconfirm(dates: string[]) {
    visible = false;
    value = dates[0];
    onchange();
  }
</script>

<StdfCell
  title={config.title}
  detail={value}
  right="arrow"
  onclick={() => (visible = true)}
/>

<StdfCalendar
  bind:visible
  mode="single"
  {initSelectedDates}
  outFormat="YYYY-MM-DD"
  {...uiOptionProps("stdfDatePicker")(
    {
      onconfirm,
    },
    config,
    ctx
  )}
/>
