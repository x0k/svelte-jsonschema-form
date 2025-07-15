<script lang="ts">
  import { BasicForm, createForm } from "@sjsf/form";
  import { BitsConfig } from "bits-ui";

  import { ShadowHost } from "$lib/components/shadow/index.js";
  import { THEME_STYLES, sjsfTheme, Theme } from "$lib/sjsf/theme.js";
  import * as defaults from "$lib/form/defaults.js";
  import { SJSF_RESOLVERS } from "$lib/sjsf/resolver.js";
  import { ICONS_STYLES, SJSF_ICONS } from "$lib/sjsf/icons.js";
  import { SJSF_VALIDATORS } from "$lib/sjsf/validators.js";

  import { themeManager } from "../../theme.svelte.js";

  import { getBuilderContext } from "../context.svelte.js";
  import { highlight } from "$lib/shiki.js";

  const ctx = getBuilderContext();

  const form = createForm({
    ...defaults,
    get schema() {
      return ctx.schema;
    },
    get uiSchema() {
      return ctx.uiSchema;
    },
    get theme() {
      return sjsfTheme(ctx.theme);
    },
    get resolver() {
      return SJSF_RESOLVERS[ctx.resolver];
    },
    get icons() {
      return SJSF_ICONS[ctx.icons];
    },
    get validator() {
      return SJSF_VALIDATORS[ctx.validator];
    },
    onSubmit: console.log,
    onSubmitError: console.warn,
    onSubmissionFailure: console.error,
  });

  let portalEl = $state.raw() as HTMLDivElement;
</script>

<div class="flex flex-col gap-2">
  <ShadowHost
    class="rounded border border-[var(--global-border)]"
    style={`${THEME_STYLES[ctx.theme]}\n${ICONS_STYLES[ctx.icons]}`}
  >
    <BitsConfig defaultPortalTo={portalEl}>
      <BasicForm
        id="form"
        {form}
        novalidate={!ctx.html5Validation}
        class={themeManager.darkOrLight}
        style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;"
        data-theme={ctx.theme.startsWith(Theme.Skeleton3)
          ? "cerberus"
          : themeManager.darkOrLight}
      />
      <div bind:this={portalEl}></div>
    </BitsConfig>
  </ShadowHost>
  <div class="rounded-md border p-2">
    {@html highlight("json", JSON.stringify(form.value, null, 2))}
  </div>
</div>
