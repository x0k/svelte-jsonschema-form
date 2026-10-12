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
    const { value: _bound, ...rest } = attributes;
    return rest;
  });

  // See `select.svelte`: the trigger is a `<button type="button">` and is the
  // only reachable surface for the aria state.
  const buttonProps: HTMLButtonAttributes = $derived({
    type: "button",
    "aria-invalid": attributes["aria-invalid"],
    "aria-describedby": attributes["aria-describedby"],
    "aria-readonly": attributes["aria-readonly"],
    "aria-required": attributes["aria-required"],
    // See `select.svelte`: the attachment cannot survive `Dropdown`'s closed
    // destructure, so blur is wired on the trigger itself.
    onblur: handlers.onblur,
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
  {buttonProps}
>
  {#each options as option (option.id)}
    <DropdownOption
      value={option.mappedValue ?? option.id}
      text={option.label}
      disabled={option.disabled}
    />
  {/each}
</Dropdown>
