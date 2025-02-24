<script lang="ts" module>
  import type { HTMLSelectAttributes } from "svelte/elements";
  import type { SchemaArrayValue } from "@sjsf/form/core";
  import type { WidgetCommonProps, Options } from "@sjsf/legacy-fields/widgets";

  declare module "@sjsf/form" {
    interface ComponentProps {
      multiSelectWidget: WidgetCommonProps<"multiSelect"> & Options;
    }
    interface ComponentBindings {
      multiSelectWidget: "value";
    }
    interface UiOptions {
      multiSelect?: HTMLSelectAttributes;
    }
  }

  declare module "@sjsf/legacy-fields/exports" {
    interface WidgetValue {
      multiSelect: SchemaArrayValue;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    selectAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import { indexMapper, multipleOptions } from "@sjsf/form/options.svelte";

  let {
    value = $bindable(),
    options,
    config,
    handlers,
  }: ComponentProps["multiSelectWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    selectAttributes(ctx, config, handlers, config.uiOptions?.multiSelect)
  );

  const mapped = $derived(
    multipleOptions({
      mapper: () => indexMapper(options),
      value: () => value,
      update: (v) => (value = v),
    })
  );
</script>

<select multiple bind:value={mapped.value} style="flex-grow: 1" {...attributes}>
  {#each options as option, index (option.id)}
    <option value={index} disabled={option.disabled}>
      {option.label}
    </option>
  {/each}
</select>
