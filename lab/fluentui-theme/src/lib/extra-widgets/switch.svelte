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
  }: ComponentProps["switchWidget"] = $props();

  const ctx = getFormContext();

  function onchange() {
    handlers.oninput?.();
    handlers.onchange?.();
  }
</script>

<ToggleSwitch
  bind:checked={() => value ?? false, (v) => (value = v)}
  label={config.title}
  {...uiOptionProps("fluentuiSwitch")(
    {
      id: getId(ctx, config.path),
      disabled: isDisabled(ctx),
      onchange,
    },
    config,
    ctx
  )}
/>
