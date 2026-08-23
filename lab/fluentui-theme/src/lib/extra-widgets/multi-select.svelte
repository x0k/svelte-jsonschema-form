<script lang="ts" module>
  import { DropdownSelect as FluentDropdownSelect } from "fluentui-svelte";
  import type { ComponentProps as SvelteComponentProps } from "svelte";
  import "@sjsf/form/fields/extra-widgets/multi-select";

  declare module "@sjsf/form" {
    interface UiOptions {
      fluentuiMultiSelect?: Omit<
        SvelteComponentProps<typeof FluentDropdownSelect>,
        "value" | "children" | "multiple"
      >;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    isDisabled,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";
  import { idMapper, multipleOptions } from "@sjsf/form/options.svelte";
  import { DropdownSelect, DropdownSelectOption } from "fluentui-svelte";

  let {
    handlers,
    value = $bindable(),
    options,
    config,
    mapped = multipleOptions({
      mapper: () => idMapper(options),
      value: () => value,
      update: (v) => (value = v),
    }),
  }: ComponentProps["multiSelectWidget"] = $props();

  const ctx = getFormContext();

  function onchange() {
    handlers.oninput?.();
    handlers.onchange?.();
  }

  const attributes = $derived(
    uiOptionProps("fluentuiMultiSelect")(
      {
        disabled: isDisabled(ctx),
        onchange,
      },
      config,
      ctx
    )
  );
</script>

<DropdownSelect multiple bind:value={mapped.current} {...attributes}>
  {#each options as option (option.id)}
    <DropdownSelectOption
      value={option.mappedValue ?? option.id}
      text={option.label}
      disabled={option.disabled}
    />
  {/each}
</DropdownSelect>
