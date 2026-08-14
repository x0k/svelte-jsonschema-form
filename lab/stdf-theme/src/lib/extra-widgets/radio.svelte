<script lang="ts" module>
  import { Radio as StdfRadio } from "stdf";
  import type { ComponentProps as SvelteComponentProps } from "svelte";
  import "@sjsf/form/fields/extra-widgets/radio";

  declare module "@sjsf/form" {
    interface UiOptions {
      stdfRadio?: SvelteComponentProps<typeof StdfRadio>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";
  import { idMapper, singleOption } from "@sjsf/form/options.svelte";

  let {
    handlers,
    config,
    value = $bindable(),
    options,
    mapped = singleOption({
      mapper: () => idMapper(options),
      value: () => value,
      update: (v) => (value = v),
    }),
  }: ComponentProps["radioWidget"] = $props();

  const ctx = getFormContext();

  const radioData = $derived(
    options.map((o) => ({
      name: o.mappedValue ?? o.id,
      label: o.label,
    }))
  );

  const { data: _data, ...attributes } = $derived(
    uiOptionProps("stdfRadio")(
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

<StdfRadio
  data={radioData}
  bind:value={() => mapped.current ?? "", (v) => (mapped.current = v ?? "")}
  {...attributes}
/>
