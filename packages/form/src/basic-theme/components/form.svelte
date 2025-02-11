<script lang="ts" module>
  import type { HTMLFormAttributes } from "svelte/elements";

  declare module "@/form/index.js" {
    interface FormElements {
      form: HTMLFormElement;
    }

    interface FormProps {
      form: HTMLFormAttributes;
    }

    interface UiOptions {
      form?: HTMLFormAttributes;
    }
  }
</script>

<script lang="ts">
  import { getFormContext, type ComponentProps } from "@/form/index.js";

  let {
    children,
    ref = $bindable(),
    config,
    attributes,
  }: ComponentProps["form"] = $props();

  const ctx = getFormContext();
</script>

<form
  bind:this={ref}
  onsubmit={ctx.submitHandler}
  onreset={ctx.resetHandler}
  style="display: flex; flex-direction: column; gap: 1rem"
  {...config.uiOptions?.form}
  {...attributes}
>
  {@render children()}
</form>
