<script lang="ts">
  import { untrack } from "svelte";
  import { BasicForm, createForm } from "@sjsf/form";
  import { BitsConfig } from "bits-ui";

  import { ShadowHost } from "$lib/components/shadow/index.js";
  import { THEME_STYLES, SJSF_THEMES, Theme } from "$lib/sjsf/theme.js";
  import * as defaults from "$lib/form/defaults.js";

  import { themeManager } from "../theme.svelte.js";
  import { getBuilderContext } from "./context.svelte.js";

  const ctx = getBuilderContext();

  const form = createForm({
    ...defaults,
    get theme() {
      return SJSF_THEMES[ctx.theme];
    },
    get schema() {
      return ctx.schema;
    },
    get uiSchema() {
      return ctx.uiSchema;
    },
  });

  $effect(() => {
    ctx.theme;
    untrack(() => {
      ctx.build();
    });
  });

  let portalEl = $state.raw() as HTMLDivElement;
</script>

<ShadowHost style={THEME_STYLES[ctx.theme]}>
  <BitsConfig defaultPortalTo={portalEl}>
    <BasicForm
      id="form"
      {form}
      class={themeManager.darkOrLight}
      style="min-height: 100%; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;"
      data-theme={ctx.theme.startsWith(Theme.Skeleton3)
        ? "cerberus"
        : themeManager.darkOrLight}
    />
    <div bind:this={portalEl}></div>
  </BitsConfig>
</ShadowHost>
