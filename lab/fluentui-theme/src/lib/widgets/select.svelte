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
  // type widens `value` to `string | string[]`. `value` is bound explicitly
  // below, so it is stripped from the spread to keep the union narrowed.
  const dropdownProps = $derived.by(() => {
    const { value: _bound, ...rest } = attributes;
    return rest;
  });

  // `Dropdown` has a closed `$props()` destructure, so top-level `aria-*` props
  // are dropped even though its type claims `& Omit<HTMLInputAttributes>`.
  // `buttonProps` is the supported channel to the real
  // `<button type="button">` trigger, which is where the aria state belongs.
  const buttonProps: HTMLButtonAttributes = $derived({
    type: "button",
    "aria-invalid": attributes["aria-invalid"],
    "aria-describedby": attributes["aria-describedby"],
    "aria-readonly": attributes["aria-readonly"],
    "aria-required": attributes["aria-required"],
    // The trigger is the only focusable element, and the attachment cannot
    // survive `Dropdown`'s closed destructure, so blur is wired here.
    onblur: handlers.onblur,
  });

  // `Dropdown` reports no selection event; `bind:value` is the only channel.
  function setValue(v: string) {
    mapped.current = v;
    handlers.oninput?.();
    handlers.onchange?.();
  }
</script>

<!--
  NOTE: `Dropdown` resolves its trigger label from a context that
  `DropdownOption` populates in `onMount`, so during SSR the trigger renders the
  raw option value instead of the option label. That is accepted for this
  experimental package and asserted around in `tests/fields.ssr.test.ts`.
-->
<Dropdown
  bind:value={() => mapped.current, setValue}
  {...dropdownProps}
  multiple={false}
  placeholder={attributes.placeholder ?? (clearable ? "" : config.title)}
  {buttonProps}
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
