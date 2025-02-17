<script lang="ts" generics="L extends Label">
  import type { Label, Labels } from "./translation.js";
  import { getFormContext } from "./context/context.js";
  import type { Config } from "./config.js";
  import type { IconConfig } from "./icons.js";

  const ctx = getFormContext();

  const {
    id,
    config,
    args = {} as Labels[L],
  }: {} extends Labels[L]
    ? {
        id: L;
        config: Config;
        args?: never;
      }
    : {
        id: L;
        args: Labels[L];
        config: Config;
      } = $props();

  const translation = $derived(ctx.translation(id, args));
  const iconConfig: IconConfig<L> = $derived({
    config,
    params: args,
    translation,
  });
  //@ts-expect-error TODO: Fix this
  const icon = $derived(ctx.icons?.(id, iconConfig));
</script>

{#if icon}
  {@render icon(iconConfig)}
{:else}
  {translation}
{/if}
