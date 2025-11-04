<script lang="ts" module>
  import type { SchemaValue } from "@sjsf/form";

  import type { Props } from "./async-combobox.svelte";

  export interface MyAsyncComboboxOptions<T extends SchemaValue>
    extends Props<T> {}

  declare module "@sjsf/form" {
    interface UiOptions {
      myAsyncComboboxOptions?: MyAsyncComboboxOptions<any>;
    }
  }
</script>

<script lang="ts">
  import { composeProps, disabledProp, getFormContext } from "@sjsf/form";
  import type { WidgetCommonProps } from "@sjsf/form/fields/widgets";

  import AsyncCombobox from "./async-combobox.svelte";

  let {
    uiOption,
    value = $bindable(),
    config,
  }: WidgetCommonProps<SchemaValue> = $props();

  const ctx = getFormContext();
  const comboboxOptions = $derived(uiOption("myAsyncComboboxOptions"));
</script>

{#if comboboxOptions}
  <AsyncCombobox
    {...composeProps(ctx, config, { ...comboboxOptions }, disabledProp)}
    bind:value
  />
{:else}
  <p>Combobox options are undefined</p>
{/if}
