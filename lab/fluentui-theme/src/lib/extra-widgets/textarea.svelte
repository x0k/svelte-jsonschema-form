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
    textareaAttributes,
    type ComponentProps,
  } from "@sjsf/form";

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["textareaWidget"] = $props();

  const ctx = getFormContext();

  // The wrapper is `width: fit-content` behind a scoped `.fs-textarea.svelte-*`
  // selector, which outranks a `:global(.fs-textarea)` override. An inline
  // style on the wrapper is the only override that reliably wins.
  const attributes = $derived(
    textareaAttributes(ctx, config, "fluentuiTextarea", handlers, {
      wrapperAttributes: { style: "width: 100%" },
    })
  );
</script>

<TextArea bind:value={() => value ?? "", (v) => (value = v)} {...attributes} />
