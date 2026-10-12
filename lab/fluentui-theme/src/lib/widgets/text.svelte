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
    Datalist,
    getFormContext,
    inputAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["textWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    inputAttributes(ctx, config, "fluentuiText", handlers, {
      placeholder: "",
      hideActionButtons: true,
      justify: true,
    })
  );
</script>

<TextBox bind:value={() => value ?? "", (v) => (value = v)} {...attributes} />
<Datalist id={attributes.list} {config} />
