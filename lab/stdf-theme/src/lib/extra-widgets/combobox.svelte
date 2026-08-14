<script lang="ts" module>
  import { Input as StdfInput, ActionSheet as StdfActionSheet } from "stdf";
  import type { ComponentProps as SvelteComponentProps } from "svelte";
  import "@sjsf/form/fields/extra-widgets/combobox";

  declare module "@sjsf/form" {
    interface UiOptions {
      stdfCombobox?: SvelteComponentProps<typeof StdfInput>;
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
  import { idMapper, singleOption } from "@sjsf/form/options.svelte";

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

  let visible = $state(false);

  function onchange() {
    handlers.oninput?.();
    handlers.onchange?.();
  }

  function onfocus() {
    visible = true;
  }

  function onclickAction(index: number) {
    if (clearable && index === 0) {
      value = undefined;
    } else {
      const o = options[index - (clearable ? 1 : 0)];
      value = o?.mappedValue ?? o?.id;
    }
    visible = false;
    onchange();
  }

  const { placeholder = "" } = $derived(
    uiOptionProps("stdfCombobox")({}, config, ctx)
  );

  const actions = $derived.by(() => {
    const filtered = options;
    const items = filtered.map((o) => ({ content: o.label }));
    if (clearable) {
      items.unshift({ content: placeholder });
    }
    return items;
  });
</script>

<StdfInput
  bind:value={() => mapped.current ?? "", (v) => (mapped.current = v ?? "")}
  {...uiOptionProps("stdfCombobox")(
    {
      disabled: isDisabled(ctx),
      state: errors.length > 0 ? "error" : "theme",
      onchange,
      onfocus,
    },
    config,
    ctx
  )}
/>

<StdfActionSheet bind:visible {actions} title={config.title} {onclickAction} />
