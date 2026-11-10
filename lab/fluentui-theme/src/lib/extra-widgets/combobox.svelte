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
    ariaDescribedByProp,
    ariaInvalidProp,
    ariaRequiredProp,
    composeProps,
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
    mapped = singleOption({
      mapper: () => idMapper(options),
      value: () => value,
      update: (v) => (value = v),
    }),
    clearable = config.schema.default === undefined,
  }: ComponentProps["comboboxWidget"] = $props();

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));

  // `AutoSuggestBox` forwards the remaining attributes to the `TextBox`, which
  // spreads them onto the real `<input>`, so the field id and aria state land
  // on the control element directly.
  const attributes = $derived(
    composeProps(
      ctx,
      config,
      { "aria-invalid": undefined, onblur: handlers.onblur },
      uiOptionProps("fluentuiCombobox"),
      ariaInvalidProp,
      ariaDescribedByProp,
      ariaRequiredProp
    )
  );

  function onselect(_e: Event, selection: string) {
    mapped.current = selection;
    handlers.oninput?.();
    handlers.onchange?.();
  }

  // `textChanged` fires for both the native `input` and `change` events, which
  // is the only way to tell them apart here.
  function textChanged(e: Event) {
    if (e.type === "input") {
      handlers.oninput?.();
    } else {
      handlers.onchange?.();
    }
  }

  const text = $derived(
    options.find((o) => (o.mappedValue ?? o.id) === mapped.current)?.label ??
      mapped.current
  );
</script>

<AutoSuggestBox
  {id}
  {...attributes}
  value={text}
  type="text"
  hideActionButtons
  placeholder=""
  {textChanged}
  suggestionChosen={onselect}
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
