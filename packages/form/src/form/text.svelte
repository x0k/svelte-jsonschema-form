<script lang="ts" generics="L extends Label">
  import type { Label, Labels, Translate } from "./translation.js";
  import type { Config } from "./config.js";
  import type { IconConfig, IconDefinition } from "./icons.js";
  import { getFormContext } from "./context/index.js";

  const ctx = getFormContext();

  const {
    id,
    config,
    translate,
    args = {} as Labels[L],
  }: {} extends Labels[L]
    ? {
        id: L;
        config: Config;
        translate: Translate;
        args?: never;
      }
    : {
        id: L;
        args: Labels[L];
        translate: Translate;
        config: Config;
      } = $props();

  const translation = $derived(translate(id, args));
  const iconConfig: IconConfig<L> = $derived({
    config,
    params: args,
    translation,
  });
  const icon: IconDefinition<L> | undefined = $derived(
    ctx.icons?.(
      id,
      //@ts-expect-error TODO: fix if possible
      iconConfig
    )
  );
</script>

{#if icon}
  {@render icon(iconConfig)}
{:else}
  {translation}
{/if}
