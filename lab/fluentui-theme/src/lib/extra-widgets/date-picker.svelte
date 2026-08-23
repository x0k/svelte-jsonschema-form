<script lang="ts" module>
  import { CalendarDatePicker } from "fluentui-svelte";
  import type { ComponentProps as SvelteComponentProps } from "svelte";
  import "@sjsf/form/fields/extra-widgets/date-picker";

  declare module "@sjsf/form" {
    interface UiOptions {
      fluentuiDatePicker?: Omit<
        SvelteComponentProps<typeof CalendarDatePicker>,
        "value"
      >;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    getId,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";

  import { parseLocalDate, toLocalDate } from "$lib/local-date.js";

  let {
    value = $bindable(),
    config,
    handlers,
    errors,
  }: ComponentProps["datePickerWidget"] = $props();

  const ctx = getFormContext();

  function onchange(date: Date | null) {
    value = date ? toLocalDate(date) : undefined;
    handlers.oninput?.();
    handlers.onchange?.();
  }

  const parsed = $derived(value ? parseLocalDate(value) : null);

  const attributes = $derived(
    uiOptionProps("fluentuiDatePicker")(
      {
        id: getId(ctx, config.path),
        "aria-invalid": errors.length > 0,
      },
      config,
      ctx
    )
  );
</script>

<CalendarDatePicker
  value={parsed}
  onChange={(_e, date) => onchange(date)}
  {...attributes}
/>
