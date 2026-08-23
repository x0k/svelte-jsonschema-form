<script lang="ts" module>
  import { DropdownSelect as FluentDropdownSelect } from "fluentui-svelte";
  import type { ComponentProps as SvelteComponentProps } from "svelte";

  declare module "@sjsf/form" {
    interface UiOptions {
      fluentuiSelect?: Omit<
        SvelteComponentProps<typeof FluentDropdownSelect>,
        "value" | "children" | "multiple"
      >;
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
  import {
    idMapper,
    singleOption,
    EMPTY_VALUE,
  } from "@sjsf/form/options.svelte";
  import { DropdownSelect, DropdownSelectOption } from "fluentui-svelte";

  let {
    handlers,
    value = $bindable(),
    options,
    config,
    clearable = config.schema.default === undefined,
    mapped = singleOption({
      mapper: () => idMapper(options),
      value: () => value,
      update: (v) => (value = v),
    }),
  }: ComponentProps["selectWidget"] = $props();

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));

  function onchange() {
    handlers.oninput?.();
    handlers.onchange?.();
  }

  const attributes = $derived(
    uiOptionProps("fluentuiSelect")(
      {
        id,
        disabled: isDisabled(ctx),
        hidePlaceholder: true,
        onchange,
      },
      config,
      ctx
    )
  );
</script>

<DropdownSelect bind:value={mapped.current} {...attributes}>
  {#if clearable}
    <DropdownSelectOption value={EMPTY_VALUE} text="" />
  {/if}
  {#each options as option (option.id)}
    <DropdownSelectOption
      value={option.mappedValue ?? option.id}
      text={option.label}
      disabled={option.disabled}
    />
  {/each}
</DropdownSelect>
