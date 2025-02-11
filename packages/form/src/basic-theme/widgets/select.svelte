<script lang="ts" module>
  import type { HTMLSelectAttributes } from "svelte/elements";

  declare module "@/form/index.js" {
    interface UiOptions {
      select?: HTMLSelectAttributes;
    }
  }
</script>

<script lang="ts">
  import { getFormContext, selectAttributes } from "@/form/index.js";
  import type { WidgetProps } from "@/fields/widgets.js";
  import { indexMapper, singleOption } from "@/options.svelte.js";

  let {
    handlers,
    value = $bindable(),
    options,
    config,
  }: WidgetProps<"select"> = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    selectAttributes(ctx, config, handlers, config.uiOptions?.select)
  );

  const mapped = $derived(
    singleOption({
      mapper: () => indexMapper(options),
      value: () => value,
      update: (v) => (value = v),
    })
  );
</script>

<select bind:value={mapped.value} style="flex-grow: 1" {...attributes}>
  {#if config.schema.default === undefined}
    <option value={-1}>{attributes.placeholder}</option>
  {/if}
  {#each options as option, index (option.id)}
    <option value={index} disabled={option.disabled}>
      {option.label}
    </option>
  {/each}
</select>
