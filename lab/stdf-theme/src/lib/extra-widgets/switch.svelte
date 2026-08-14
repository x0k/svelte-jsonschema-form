<script lang="ts" module>
  import { Switch as StdfSwitch } from "stdf";
  import type { ComponentProps as SvelteComponentProps } from "svelte";
  import "@sjsf/form/fields/extra-widgets/switch";

  declare module "@sjsf/form" {
    interface UiOptions {
      stdfSwitch?: SvelteComponentProps<typeof StdfSwitch>;
    }
  }
</script>

<script lang="ts">
  import {
    getFormContext,
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

<label>
  <StdfSwitch
    bind:active={() => value ?? false, (v) => (value = v)}
    {...uiOptionProps("stdfSwitch")(
      {
        disabled: isDisabled(ctx),
        onchange,
      },
      config,
      ctx
    )}
  />
  {config.title}
</label>

<style>
  label {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 8px;
    font-family: var(--wx-checkbox-font-family);
    font-size: var(--wx-checkbox-font-size);
    line-height: var(--wx-checkbox-line-height);
    font-weight: var(--wx-checkbox-font-weight);
    color: var(--wx-checkbox-font-color);
    cursor: pointer;
  }
</style>
