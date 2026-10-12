<script lang="ts" module>
  import { ToggleSwitch } from "fluentui-svelte";
  import type { ComponentProps as SvelteComponentProps } from "svelte";
  import "@sjsf/form/fields/extra-widgets/switch";

  declare module "@sjsf/form" {
    interface UiOptions {
      fluentuiSwitch?: Omit<
        SvelteComponentProps<typeof ToggleSwitch>,
        "checked"
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

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["switchWidget"] = $props();

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));

  // `ToggleSwitch` spreads onto a real `<input type="checkbox" role="switch">`.
  const attributes = $derived(
    customInputAttributes(
      ctx,
      config,
      "fluentuiSwitch",
      handlersAttachment(handlers)({
        id,
        name: id,
        label: config.title,
        required: config.required,
      })
    )
  );
</script>

<ToggleSwitch
  bind:checked={() => value ?? false, (v) => (value = v)}
  {...attributes}
/>
