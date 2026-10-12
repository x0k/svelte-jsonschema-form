<script lang="ts" module>
  import { Checkbox } from "fluentui-svelte";
  import type { ComponentProps as SvelteComponentProps } from "svelte";

  declare module "@sjsf/form" {
    interface UiOptions {
      fluentuiCheckbox?: Omit<
        SvelteComponentProps<typeof Checkbox>,
        "checked" | "children" | "indeterminate"
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
    config,
    value = $bindable(),
    handlers,
  }: ComponentProps["checkboxWidget"] = $props();

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));

  // `Checkbox` spreads its attributes onto a real `<input type="checkbox">`,
  // so the attachment delivers input/change/focus/blur straight to the field.
  const attributes = $derived(
    customInputAttributes(
      ctx,
      config,
      "fluentuiCheckbox",
      handlersAttachment(handlers)({ id, name: id, required: config.required })
    )
  );
</script>

<Checkbox
  bind:checked={() => value ?? false, (v) => (value = v)}
  {...attributes}
>
  {config.title}
</Checkbox>
