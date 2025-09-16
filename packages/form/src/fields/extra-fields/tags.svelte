<script lang="ts" module>
  declare module "../../form/index.js" {
    interface FoundationalComponents {
      tagsWidget: {};
    }
  }
</script>

<script lang="ts">
  import { identity } from "@/lib/function.js";
  import type { ComponentProps } from "@/form/index.js";
  import "@/form/extra-fields/tags.js";

  import FieldBase from "../field-base.svelte";
  import "../extra-widgets/tags.js";

  let {
    config,
    value = $bindable(),
    uiOption,
  }: ComponentProps["tagsField"] = $props();
</script>

<FieldBase
  {config}
  {uiOption}
  showTitle
  useLabel
  widgetType="tagsWidget"
  bind:value
  fromValue={(v) => v ?? undefined}
  toValue={identity}
/>
