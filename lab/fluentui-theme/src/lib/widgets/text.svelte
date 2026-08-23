<script lang="ts" module>
  import { TextBox } from "fluentui-svelte";
  import type { ComponentProps as SvelteComponentProps } from "svelte";

  declare module "@sjsf/form" {
    interface UiOptions {
      fluentuiText?: Omit<
        SvelteComponentProps<typeof TextBox>,
        "value" | "type"
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

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["textWidget"] = $props();

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));

  function textChanged(e: Event) {
    if (e.type === "input") {
      handlers.oninput?.();
    } else {
      handlers.onchange?.();
    }
  }
</script>

<TextBox
  bind:value={() => value ?? "", (v) => (value = v)}
  {...uiOptionProps("fluentuiText")(
    {
      id,
      placeholder: "",
      readonly: config.schema.readOnly,
      disabled: isDisabled(ctx),
      hideActionButtons: true,
      justify: true,
      textChanged,
    },
    config,
    ctx
  )}
/>
