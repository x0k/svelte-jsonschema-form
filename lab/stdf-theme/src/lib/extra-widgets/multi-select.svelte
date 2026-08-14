<script lang="ts" module>
  import { Checkbox as StdfCheckbox } from "stdf";
  import type { ComponentProps as SvelteComponentProps } from "svelte";
  import "@sjsf/form/fields/extra-widgets/multi-select";

  declare module "@sjsf/form" {
    interface UiOptions {
      stdfMultiSelect?: SvelteComponentProps<typeof StdfCheckbox>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";
  import { idMapper, multipleOptions } from "@sjsf/form/options.svelte";

  let {
    value = $bindable(),
    options,
    config,
    handlers,
    mapped = multipleOptions({
      mapper: () => idMapper(options),
      value: () => value,
      update: (v) => (value = v),
    }),
  }: ComponentProps["multiSelectWidget"] = $props();

  const ctx = getFormContext();

  const checkData = $derived(
    options.map((o) => ({
      name: o.mappedValue ?? o.id,
      label: o.label,
    }))
  );

  const { data: _data, ...attributes } = $derived(
    uiOptionProps("stdfMultiSelect")(
      {
        data: [],
        onchange,
      },
      config,
      ctx
    )
  );

  function onchange() {
    handlers.oninput?.();
    handlers.onchange?.();
  }
</script>

<StdfCheckbox
  data={checkData}
  bind:checkeds={() => mapped.current ?? [], (v) => (mapped.current = v ?? [])}
  {...attributes}
/>
