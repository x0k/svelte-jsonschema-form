<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      astryxDateRangePicker?: HTMLInputAttributes;
    }
  }
</script>

<script lang="ts">
  import type { DateRange } from "@astryx-svelte/core";
  import { DateRangeInput } from "@astryx-svelte/core";
  import {
    getFormContext,
    customInputAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/form/fields/extra-widgets/date-range-picker";

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["dateRangePickerWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    customInputAttributes(ctx, config, "astryxDateRangePicker", {})
  );

  const dateRange = $derived(
    value?.start && value?.end
      ? ({
          start:
            value.start as `${number}${number}${number}${number}-${number}${number}-${number}${number}`,
          end: value.end as `${number}${number}${number}${number}-${number}${number}-${number}${number}`,
        } satisfies DateRange)
      : null
  );
</script>

<DateRangeInput
  label={config.title ?? "Date Range"}
  value={dateRange}
  onChange={(v) => {
    value = v ? { start: v.start, end: v.end } : undefined;
    handlers.oninput?.();
    handlers.onchange?.();
  }}
  isDisabled={attributes.disabled === true}
  hasClear
/>
