<script lang="ts" module>
  import { Dropdown, DropdownOption } from "fluentui-svelte";
  import type { ComponentProps as SvelteComponentProps } from "svelte";
  import "@sjsf/form/fields/extra-widgets/multi-select";

  declare module "@sjsf/form" {
    interface UiOptions {
      fluentuiMultiSelect?: SvelteComponentProps<typeof Dropdown>;
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
  import { idMapper, multipleOptions } from "@sjsf/form/options.svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

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

  const id = $derived(getId(ctx, config.path));

  const attributes = $derived(
    customInputAttributes(ctx, config, "fluentuiMultiSelect", {
      id,
      name: id,
      disabled: isDisabled(ctx),
    })
  );

  const dropdownProps = $derived.by(() => {
    const { value: _bound, multiple: _multiple, ...rest } = attributes;
    return rest;
  });

  // See `select.svelte`: the native `<select>` carries the aria state, and
  // `Dropdown` mirrors it onto the combobox trigger, save for `aria-readonly`.
  const buttonAttributes: HTMLButtonAttributes = $derived({
    "aria-readonly": attributes["aria-readonly"],
  });

  // `Dropdown` sets `toggleOnClick={multiple}`, so a plain click toggles an
  // option without needing Ctrl/Cmd.
  function setValue(v: string[]) {
    mapped.current = v;
    handlers.oninput?.();
    handlers.onchange?.();
  }
</script>

<Dropdown
  bind:value={() => mapped.current, setValue}
  {...dropdownProps}
  multiple={true}
  placeholder={attributes.placeholder ?? ""}
  onblur={handlers.onblur}
  {buttonAttributes}
>
  {#each options as option (option.id)}
    <DropdownOption
      value={option.mappedValue ?? option.id}
      text={option.label}
      disabled={option.disabled}
    />
  {/each}
</Dropdown>
