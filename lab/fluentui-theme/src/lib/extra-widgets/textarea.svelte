<script lang="ts" module>
  import { TextArea } from "fluentui-svelte";
  import type { ComponentProps as SvelteComponentProps } from "svelte";
  import "@sjsf/form/fields/extra-widgets/textarea";

  declare module "@sjsf/form" {
    interface UiOptions {
      fluentuiTextarea?: Omit<
        SvelteComponentProps<typeof TextArea>,
        "value" | "onChange"
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
    errors,
  }: ComponentProps["textareaWidget"] = $props();

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));

  function onchange() {
    handlers.oninput?.();
    handlers.onchange?.();
  }
</script>

<TextArea
  bind:value={() => value ?? "", (v) => (value = v)}
  {...uiOptionProps("fluentuiTextarea")(
    {
      id,
      disabled: isDisabled(ctx),
      readonly: config.schema.readOnly,
      "aria-invalid": errors.length > 0,
      oninput: onchange,
    },
    config,
    ctx
  )}
/>

<style>
  :global(.fs-textarea) {
    width: 100%;
  }
  :global(.fs-textarea textarea) {
    width: 100%;
  }
</style>
