<script lang="ts" module>
  import { AutoSuggestBox, AutoSuggestBoxOption } from "fluentui-svelte";
  import type { ComponentProps as SvelteComponentProps } from "svelte";
  import "@sjsf/form/fields/extra-widgets/combobox";

  declare module "@sjsf/form" {
    interface UiOptions {
      fluentuiCombobox?: Omit<
        SvelteComponentProps<typeof AutoSuggestBox>,
        "value" | "children"
      >;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    getId,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";
  import {
    idMapper,
    singleOption,
    EMPTY_VALUE,
  } from "@sjsf/form/options.svelte";

  let {
    value = $bindable(),
    config,
    handlers,
    options,
    errors,
    mapped = singleOption({
      mapper: () => idMapper(options),
      value: () => value,
      update: (v) => (value = v),
    }),
    clearable = config.schema.default === undefined,
  }: ComponentProps["comboboxWidget"] = $props();

  const ctx = getFormContext();

  function onselect(selection: string) {
    if (clearable && selection === EMPTY_VALUE) {
      selection = "";
    }
    mapped.current = selection;
    handlers.oninput?.();
    handlers.onchange?.();
  }

  const text = $derived(
    options.find((o) => (o.mappedValue ?? o.id) === mapped.current)?.label ??
      mapped.current
  );

  const attributes = $derived(
    uiOptionProps("fluentuiCombobox")(
      {
        id: getId(ctx, config.path),
        "aria-invalid": errors.length > 0,
      },
      config,
      ctx
    )
  );
</script>

<AutoSuggestBox
  value={text}
  hideActionButtons
  suggestionChosen={(_e, selection) => onselect(selection)}
  {...attributes}
>
  {#if clearable}
    <AutoSuggestBoxOption index={0} value={EMPTY_VALUE} text=" " />
  {/if}
  {#each options as option, i (option.id)}
    <AutoSuggestBoxOption
      index={(clearable ? 1 : 0) + i}
      value={option.mappedValue ?? option.id}
      text={option.label}
      disabled={option.disabled}
    />
  {/each}
</AutoSuggestBox>
