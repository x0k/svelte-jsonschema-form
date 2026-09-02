<script lang="ts" module>
  import { Select as SvarSelect } from "@svar-ui/svelte-core";
  import type { ComponentProps as SvelteComponentProps } from "svelte";

  declare module "@sjsf/form" {
    interface UiOptions {
      savrSelect?: SvelteComponentProps<typeof SvarSelect>;
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
  import { singleOption, EMPTY_VALUE } from "@sjsf/form/options.svelte";

  let {
    value = $bindable(),
    options,
    config,
    errors,
    handlers,
    mapper,
    mapped = singleOption({
      mapper: () => mapper,
      value: () => value,
      update: (v) => (value = v),
    }),
    clearable = config.schema.default === undefined,
  }: ComponentProps["selectWidget"] = $props();

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));

  function onchange() {
    handlers.oninput?.();
    handlers.onchange?.();
  }

  const { placeholder = "", ...attributes } = $derived(
    uiOptionProps("savrSelect")(
      { id, disabled: isDisabled(ctx), error: errors.length > 0, onchange },
      config,
      ctx
    )
  );
  const mappedOptions = $derived.by(() => {
    const items: { id: string; label: string }[] = [];
    if (clearable) {
      items.push({ id: EMPTY_VALUE, label: placeholder });
    }
    for (const o of options) {
      items.push({ id: o.mappedValue, label: o.label });
    }
    return items;
  });
</script>

<SvarSelect
  options={mappedOptions}
  bind:value={mapped.current}
  {...attributes}
/>
