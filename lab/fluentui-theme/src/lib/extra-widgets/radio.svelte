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
    customInputAttributes,
    getFormContext,
    getId,
    handlersAttachment,
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

  // Each `RadioButton` renders an implicit `<label>` around a real
  // `<input type="radio">`, so the attachment and the aria state both land on a
  // focusable node. `option.disabled` materialises `ui:disabledEnumValues`.
  const itemAttributes = $derived(
    handlersAttachment(handlers)(
      customInputAttributes(ctx, config, "fluentuiRadio", { name })
    )
  );
</script>

<div
  role="radiogroup"
  aria-label={config.title}
  aria-invalid={itemAttributes["aria-invalid"]}
  aria-describedby={itemAttributes["aria-describedby"]}
>
  {#each options as option (option.id)}
    <RadioButton
      id={option.id}
      label={option.label}
      value={option.mappedValue ?? option.id}
      disabled={option.disabled || itemAttributes.disabled}
      bind:group={mapped.current}
      {...itemAttributes}
    />
  {/each}
</div>
