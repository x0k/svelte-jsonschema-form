<script lang="ts" module>
  import { RadioButton } from "fluentui-svelte";
  import type { ComponentProps as SvelteComponentProps } from "svelte";
  import "@sjsf/form/fields/extra-widgets/radio";

  declare module "@sjsf/form" {
    interface UiOptions {
      fluentuiRadio?: Omit<
        SvelteComponentProps<typeof RadioButton>,
        "group" | "checked" | "value"
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
  import { idMapper, singleOption } from "@sjsf/form/options.svelte";

  let {
    handlers,
    config,
    value = $bindable(),
    options,
    mapped = singleOption({
      mapper: () => idMapper(options),
      value: () => value,
      update: (v) => (value = v),
    }),
  }: ComponentProps["radioWidget"] = $props();

  const ctx = getFormContext();

  const name = $derived(getId(ctx, config.path));

  function onchange() {
    handlers.oninput?.();
    handlers.onchange?.();
  }

  const attributes = $derived(
    uiOptionProps("fluentuiRadio")(
      {
        name,
        disabled: isDisabled(ctx),
        onchange,
      },
      config,
      ctx
    )
  );
</script>

<div role="radiogroup" aria-label={config.title}>
  {#each options as option (option.id)}
    <RadioButton
      label={option.label}
      value={option.mappedValue ?? option.id}
      bind:group={mapped.current}
      {...attributes}
    />
  {/each}
</div>
