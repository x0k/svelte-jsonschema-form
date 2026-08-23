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
  }: ComponentProps["numberWidget"] = $props();

  const ctx = getFormContext();

  const id = $derived(getId(ctx, config.path));

  function textChanged(e: Event) {
    if (e.type === "input") {
      handlers.oninput?.();
    } else {
      handlers.onchange?.();
    }
  }

  function update(v: string | number | undefined) {
    value =
      typeof v === "number" && Number.isFinite(v) ? v : (undefined as never);
  }
</script>

<NumberBox
  bind:value={() => value ?? undefined, update}
  {...uiOptionProps("fluentuiNumber")(
    {
      id,
      placeholder: "",
      disabled: isDisabled(ctx),
      readonly: config.schema.readOnly,
      justify: true,
      hideActionButtons: true,
      textChanged,
    },
    config,
    ctx
  )}
/>
