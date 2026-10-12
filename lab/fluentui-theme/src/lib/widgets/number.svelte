<script lang="ts" module>
  import { NumberBox } from "fluentui-svelte";
  import type { ComponentProps as SvelteComponentProps } from "svelte";

  declare module "@sjsf/form" {
    interface UiOptions {
      fluentuiNumber?: Omit<
        SvelteComponentProps<typeof NumberBox>,
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
  }: ComponentProps["numberWidget"] = $props();

  const ctx = getFormContext();

  function update(v: number | null) {
    value = typeof v === "number" && Number.isFinite(v) ? v : undefined;
  }

  const attributes = $derived(
    inputAttributes(ctx, config, "fluentuiNumber", handlers, {
      placeholder: "",
      variant: "compact",
    })
  );
</script>

<NumberBox
  bind:value={() => value ?? null, update}
  {...attributes as SvelteComponentProps<typeof NumberBox>}
/>
<Datalist id={attributes.list} {config} />
