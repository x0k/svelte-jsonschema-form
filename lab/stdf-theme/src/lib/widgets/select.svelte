<script lang="ts" module>
  import { ActionSheet, Cell } from "stdf";
  import type { ActionProps } from "stdf/types";
  import type { ComponentProps as SvelteComponentProps } from "svelte";

  declare module "@sjsf/form" {
    interface UiOptions {
      stdfSelect?: SvelteComponentProps<typeof ActionSheet>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
    uiOptionProps,
    type ComponentProps,
  } from "@sjsf/form";
  import { idMapper, singleOption } from "@sjsf/form/options.svelte";

  let {
    value = $bindable(),
    options,
    config,
    handlers,
    mapped = singleOption({
      mapper: () => idMapper(options),
      value: () => value,
      update: (v) => (value = v),
    }),
    clearable = config.schema.default === undefined,
  }: ComponentProps["selectWidget"] = $props();

  const ctx = getFormContext();

  let visible = $state(false);

  const { actions: _actions, ...attributes } = $derived(
    uiOptionProps("stdfSelect")(
      {
        actions: [],
        title: config.title,
      },
      config,
      ctx
    )
  );
  const mappedOptions = $derived.by(() => {
    const items: ActionProps[] = [];
    if (clearable) {
      items.push({ content: "" });
    }
    for (const o of options) {
      items.push({ content: o.label });
    }
    return items;
  });
  const valueLabel = $derived(
    options.find((o) => (o.mappedValue ?? o.id) === mapped.current)?.label ?? ""
  );

  function onchange() {
    handlers.oninput?.();
    handlers.onchange?.();
  }

  function onclickAction(index: number) {
    if (clearable && index === 0) {
      value = undefined;
    } else {
      const o = options[index - (clearable ? 1 : 0)];
      value = o?.mappedValue ?? o?.id;
    }
    onchange();
  }
</script>

<Cell detail={valueLabel} right="arrow" onclick={() => (visible = true)} />

<ActionSheet
  bind:visible
  actions={mappedOptions}
  {...attributes}
  {onclickAction}
/>
