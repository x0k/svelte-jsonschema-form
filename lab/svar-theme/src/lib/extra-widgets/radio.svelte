<script lang="ts" module>
  import { RadioButtonGroup as SvarRadioButtonGroup } from "@svar-ui/svelte-core";
  import type { ComponentProps as SvelteComponentProps } from "svelte";
  import "@sjsf/form/fields/extra-widgets/radio";

  declare module "@sjsf/form" {
    interface UiOptions {
      svarRadio?: SvelteComponentProps<typeof SvarRadioButtonGroup>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";
  import { singleOption } from "@sjsf/form/options.svelte";

  let {
    handlers,
    config,
    value = $bindable(),
    options,
    mapper,
    mapped = singleOption({
      mapper: () => mapper,
      value: () => value,
      update: (v) => (value = v),
    }),
  }: ComponentProps["radioWidget"] = $props();

  const ctx = getFormContext();

  function onchange() {
    handlers.oninput?.();
    handlers.onchange?.();
  }
</script>

<SvarRadioButtonGroup
  options={options.map((o) => ({ id: o.mappedValue, label: o.label }))}
  bind:value={mapped.current}
  {...uiOptionProps("svarRadio")(
    {
      onchange,
    },
    config,
    ctx
  )}
/>
