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
    ariaDescribedByProp,
    ariaInvalidProp,
    ariaRequiredProp,
    composeProps,
    getFormContext,
    getId,
    isDisabled,
    uiOptionProps,
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

  // `CalendarDatePicker` spreads its attributes onto a wrapper `<div>`; the
  // focusable trigger is an inner fluent `Button` that receives neither the id
  // nor the aria state. `bind:triggerRef` is the only handle on it.
  const attributes = $derived(
    composeProps(
      ctx,
      config,
      { "aria-invalid": undefined },
      uiOptionProps("fluentuiDatePicker"),
      ariaInvalidProp,
      ariaDescribedByProp,
      ariaRequiredProp
    )
  );

  let triggerRef = $state<HTMLButtonElement | undefined>();

  $effect(() => {
    const el = triggerRef;
    if (!el) return;
    // The fluent `Button` sets no default `type`, so the trigger would submit
    // the surrounding form every time the calendar is opened.
    el.type = "button";
    el.id = id;
    el.disabled = isDisabled(ctx) || config.schema.readOnly === true;
    for (const [key, v] of Object.entries(attributes)) {
      if (key.startsWith("aria-")) {
        el.setAttribute(key, String(v));
      }
    }
    const { onblur } = handlers;
    if (onblur) el.addEventListener("blur", onblur);
    return () => {
      if (onblur) el.removeEventListener("blur", onblur);
    };
  });

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
  {...attributes}
  bind:triggerRef
  value={parsed}
  {minDate}
  {maxDate}
  {onChange}
/>
