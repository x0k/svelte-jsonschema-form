<script lang="ts" generics="L extends Label">
  import type { Label, Labels } from "./translation.js";
  import type { Config } from "./config.js";
  import type { IconConfig, IconDefinition } from "./icons.js";
  import { translate, getFormContext } from "./context/index.js";

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

  const translation = $derived(translate(ctx, id, args));
  const iconConfig: IconConfig<L> = $derived({
    config,
    params: args,
    translation,
  });
  const icon: IconDefinition<L> | undefined = $derived(
    ctx.icons?.(
      id,
      //@ts-expect-error
      iconConfig
    )
  );
</script>

{#if icon}
  {@render icon(iconConfig)}
{:else}
  {translation}
{/if}
