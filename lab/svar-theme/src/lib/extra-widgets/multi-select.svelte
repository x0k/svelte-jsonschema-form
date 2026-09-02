<script lang="ts" module>
  import { MultiCombo as SvarMultiCombo } from "@svar-ui/svelte-core";
  import type { ComponentProps as SvelteComponentProps } from "svelte";
  import "@sjsf/form/fields/extra-widgets/multi-select";

  declare module "@sjsf/form" {
    interface UiOptions {
      svarMultiSelect?: SvelteComponentProps<typeof SvarMultiCombo>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    getId,
    isDisabled,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";
  import { multipleOptions } from "@sjsf/form/options.svelte";

  let {
    value = $bindable(),
    options,
    config,
    handlers,
    errors,
    mapper,
    mapped = multipleOptions({
      mapper: () => mapper,
      value: () => value,
      update: (v) => (value = v),
    }),
  }: ComponentProps["multiSelectWidget"] = $props();

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));

  function onchange() {
    handlers.oninput?.();
    handlers.onchange?.();
  }
</script>

<SvarMultiCombo
  options={options.map((o) => ({ id: o.mappedValue, label: o.label }))}
  bind:value={mapped.current}
  {...uiOptionProps("svarMultiSelect")(
    {
      id,
      disabled: isDisabled(ctx),
      error: errors.length > 0,
      checkboxes: true,
      onchange,
    },
    config,
    ctx
  )}
/>
