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
    customInputAttributes,
    getFormContext,
    getId,
    isDisabled,
    type ComponentProps,
  } from "@sjsf/form";

  import { parseLocalDate, toLocalDate } from "#lib/local-date.js";

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["datePickerWidget"] = $props();

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));

  // `CalendarDatePicker` spreads the remaining attributes onto the native date
  // input that holds the value, and mirrors the naming and validity state onto
  // its trigger button.
  const attributes = $derived(
    customInputAttributes(ctx, config, "fluentuiDatePicker", {})
  );

  function onChange(_e: Event, date: Date | null) {
    value = date ? toLocalDate(date) : undefined;
    handlers.oninput?.();
    handlers.onchange?.();
  }

  const parsed = $derived(value ? parseLocalDate(value) : null);

  // `minDate`/`maxDate` are inclusive, so an exclusive bound has to be shifted
  // by a day for the calendar to match the schema semantics.
  const minDate = $derived.by(() => {
    const { minimum, exclusiveMinimum } = config.schema;
    const bound =
      typeof exclusiveMinimum === "number" ? exclusiveMinimum : minimum;
    if (bound === undefined) return undefined;
    const date = parseLocalDate(String(bound));
    return typeof exclusiveMinimum === "number"
      ? new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
      : date;
  });

  const maxDate = $derived.by(() => {
    const { maximum, exclusiveMaximum } = config.schema;
    const bound =
      typeof exclusiveMaximum === "number" ? exclusiveMaximum : maximum;
    if (bound === undefined) return undefined;
    const date = parseLocalDate(String(bound));
    return typeof exclusiveMaximum === "number"
      ? new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1)
      : date;
  });
</script>

<CalendarDatePicker
  {id}
  name={id}
  {...attributes}
  disabled={isDisabled(ctx)}
  readonly={config.schema.readOnly === true}
  onblur={handlers.onblur}
  value={parsed}
  {minDate}
  {maxDate}
  {onChange}
/>
