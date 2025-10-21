<script lang="ts" module>
  import type { Snippet } from "svelte";
  import { getFormContext, uiOptionNestedProps, type Config } from "@sjsf/form";
  import type { LayoutType } from "@sjsf/form/fields/components";

  declare module "@sjsf/form" {
    interface UiOptions {
      myLayoutSlots?: {
        [L in LayoutType]?: Partial<{
          beforeLayout: Snippet<[Config]>;
          afterLayout: Snippet<[Config]>;
          beforeContent: Snippet<[Config]>;
          afterContent: Snippet<[Config]>;
        }>;
      };
    }
  }
</script>

<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";

  import { theme } from "$lib/form-defaults";

  const { children, config, errors, type }: ComponentProps["layout"] = $props();

  const ctx = getFormContext();

  const OriginalLayout = $derived(theme("layout", config));

  const { afterContent, afterLayout, beforeContent, beforeLayout } = $derived(
    uiOptionNestedProps("myLayoutSlots", (data) => data[type])({}, config, ctx)
  );
</script>

{@render beforeLayout?.(config)}
<OriginalLayout {config} {errors} {type}>
  {@render beforeContent?.(config)}
  {@render children()}
  {@render afterContent?.(config)}
</OriginalLayout>
{@render afterLayout?.(config)}
