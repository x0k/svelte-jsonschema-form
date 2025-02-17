<script lang="ts" generics="L extends Label">
  import type { Label, Labels } from "./translation.js";
  import { getFormContext } from "./context/context.js";
  import type { Config } from "./config.js";
  import type { IconConfig } from "./icons.js";

  const ctx = getFormContext();

  const {
    label,
    config,
    params,
  }: {
    label: L;
    params: Labels[L];
    config: Config;
  } = $props();

  const translation = $derived(ctx.translation(label, params));
  const iconConfig: IconConfig<L> = $derived({
    config,
    params,
    translation,
  });
  //@ts-expect-error TODO: Fix this
  const icon = $derived(ctx.icons?.(label, iconConfig));
</script>

{#if icon}
  {@render icon(iconConfig)}
{:else}
  {translation}
{/if}
