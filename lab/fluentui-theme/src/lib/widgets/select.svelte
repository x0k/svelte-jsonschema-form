<script lang="ts" module>
  import { Dropdown, DropdownOption } from "fluentui-svelte";
  import type { ComponentProps as SvelteComponentProps } from "svelte";

  declare module "@sjsf/form" {
    interface UiOptions {
      fluentuiSelect?: SvelteComponentProps<typeof Dropdown>;
    }
  }
</script>

<script lang="ts">
  import {
    customInputAttributes,
    getFormContext,
    getId,
    isDisabled,
    type ComponentProps,
  } from "@sjsf/form";
  import {
    EMPTY_VALUE,
    idMapper,
    singleOption,
  } from "@sjsf/form/options.svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

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

  const attributes = $derived(
    customInputAttributes(ctx, config, "fluentuiSelect", {
      id,
      name: id,
      disabled: isDisabled(ctx),
    })
  );

  // `DropdownProps` is a discriminated union on `multiple`, and its ui:options
  // type widens `value`/`multiple` to the shared shape. Both are set explicitly
  // below, so they are stripped from the spread to keep the union narrowed.
  const dropdownProps = $derived.by(() => {
    const { value: _bound, multiple: _multiple, ...rest } = attributes;
    return rest;
  });

  // The native `<select>` is the control element and carries the aria state;
  // `Dropdown` mirrors the naming and validity state onto its combobox
  // `<button type="button">` trigger. Only `aria-readonly` needs to be passed
  // to the trigger directly, as it is not mirrored.
  const buttonAttributes: HTMLButtonAttributes = $derived({
    "aria-readonly": attributes["aria-readonly"],
  });

  // `Dropdown` reports no selection event; `bind:value` is the only channel.
  function setValue(v: string) {
    mapped.current = v;
    handlers.oninput?.();
    handlers.onchange?.();
  }
</script>

<!--
  `Dropdown` keeps its option list mounted while closed and `DropdownOption`
  reports its text, so the trigger renders the option label during SSR too.
-->
<Dropdown
  bind:value={() => mapped.current, setValue}
  {...dropdownProps}
  multiple={false}
  placeholder={attributes.placeholder ?? (clearable ? "" : config.title)}
  onblur={handlers.onblur}
  {buttonAttributes}
>
  {#if clearable}
    <DropdownOption value={EMPTY_VALUE} text="" />
  {/if}
  {#each options as option (option.id)}
    <DropdownOption
      value={option.mappedValue ?? option.id}
      text={option.label}
      disabled={option.disabled}
    />
  {/each}
</Dropdown>
